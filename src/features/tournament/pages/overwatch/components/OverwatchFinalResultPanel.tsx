import { useMemo } from 'react'
import { Loader2, Trophy, Zap, Activity, Swords, Target, Crosshair } from 'lucide-react'
import { useOWTournamentMatches } from '../hooks/useOWTournamentMatches'
import { useOWTournamentTeams } from '../hooks/useOWTournamentTeams'
import type { BracketMatch, BracketMvp } from '../types'
import tnkIcon from '../../../../../assets/tnk.svg'
import dpsIcon from '../../../../../assets/dps.svg'
import sptIcon from '../../../../../assets/spt.svg'

const TEAM_ACCENT_COLORS = ['#f99e1a', '#0596e8', '#22c55e', '#ef4444']

const ROLE_IMG: Record<string, string> = {
    TNK: tnkIcon,
    DPS: dpsIcon,
    SPT: sptIcon,
}

const ROLE_COLOR: Record<string, string> = {
    TNK: '#3b82f6',
    DPS: '#ef4444',
    SPT: '#22c55e',
}

const HEX_CLIP = 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)'

function HexAvatar({ url, name, size, borderColor }: { url: string | null; name: string; size: number; borderColor: string }) {
    const border = 2
    const outerSize = size + border * 2
    const outerPx = `${outerSize}px`
    return (
        <div className="relative shrink-0" style={{ width: outerPx, height: outerPx }}>
            <div
                className="absolute -inset-1.5 rounded-full blur-[10px]"
                style={{ background: `radial-gradient(circle, ${borderColor} 0%, ${borderColor}80 35%, transparent 65%)` }}
            />
            <div
                className="relative"
                style={{
                    width: outerPx,
                    height: outerPx,
                    clipPath: HEX_CLIP,
                    background: `linear-gradient(to bottom, ${borderColor}, ${borderColor}60)`,
                }}
            >
                <div className="absolute overflow-hidden bg-white/[0.06]" style={{ inset: `${border}px`, clipPath: HEX_CLIP }}>
                    {url ? (
                        <img src={url} alt={name} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                        <span className="flex h-full w-full items-center justify-center text-xs font-bold text-[#4b5563]">
                            {name.slice(0, 1)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

export function OverwatchFinalResultPanel() {
    const { data: matchData, isLoading: isMatchesLoading, error: matchesError } = useOWTournamentMatches()
    const { data: teamData, isLoading: isTeamsLoading, error: teamsError } = useOWTournamentTeams()

    const isLoading = isMatchesLoading || isTeamsLoading
    const error = matchesError || teamsError

    const bracket = matchData?.bracket
    const teams = useMemo(() => teamData?.teams ?? [], [teamData?.teams])

    const allMatches = useMemo(() => {
        if (!bracket) return []
        const matches: BracketMatch[] = []
        bracket.upper.forEach((r) => matches.push(...r.matches))
        bracket.lower.forEach((r) => matches.push(...r.matches))
        if (bracket.grandFinal) matches.push(bracket.grandFinal)
        return matches
    }, [bracket])

    const completedMatches = useMemo(() => allMatches.filter((m) => m.status === 'COMPLETED'), [allMatches])

    // 1. Tournament Champion Banner
    const grandFinal = bracket?.grandFinal
    const isTournamentComplete = grandFinal?.status === 'COMPLETED'
    let championName: string | null = null
    if (isTournamentComplete && grandFinal) {
        const s1 = grandFinal.team1?.score ?? 0
        const s2 = grandFinal.team2?.score ?? 0
        if (s1 > s2) championName = grandFinal.team1?.name ?? null
        else if (s2 > s1) championName = grandFinal.team2?.name ?? null
    }

    // 2. Final Standings
    const standings = useMemo(() => {
        if (!bracket) return []
        const result: { rank: number; name: string; wins: number; losses: number }[] = []

        const getRecord = (teamName: string) => {
            let wins = 0
            let losses = 0
            completedMatches.forEach((m) => {
                if (m.team1?.name === teamName || m.team2?.name === teamName) {
                    const s1 = m.team1?.score ?? 0
                    const s2 = m.team2?.score ?? 0
                    const isTeam1 = m.team1?.name === teamName
                    if (s1 > s2) {
                        if (isTeam1) wins++
                        else losses++
                    } else if (s2 > s1) {
                        if (!isTeam1) wins++
                        else losses++
                    }
                }
            })
            return { wins, losses }
        }

        // 1st and 2nd from Grand Final
        if (grandFinal?.status === 'COMPLETED') {
            const s1 = grandFinal.team1?.score ?? 0
            const s2 = grandFinal.team2?.score ?? 0
            if (s1 > s2) {
                if (grandFinal.team1?.name) result.push({ rank: 1, name: grandFinal.team1.name, ...getRecord(grandFinal.team1.name) })
                if (grandFinal.team2?.name) result.push({ rank: 2, name: grandFinal.team2.name, ...getRecord(grandFinal.team2.name) })
            } else if (s2 > s1) {
                if (grandFinal.team2?.name) result.push({ rank: 1, name: grandFinal.team2.name, ...getRecord(grandFinal.team2.name) })
                if (grandFinal.team1?.name) result.push({ rank: 2, name: grandFinal.team1.name, ...getRecord(grandFinal.team1.name) })
            }
        }

        // 3rd from LB Final (lower bracket last round)
        const lbFinalRound = bracket.lower[bracket.lower.length - 1]
        if (lbFinalRound) {
            const lbFinalMatch = lbFinalRound.matches[0]
            if (lbFinalMatch?.status === 'COMPLETED') {
                const s1 = lbFinalMatch.team1?.score ?? 0
                const s2 = lbFinalMatch.team2?.score ?? 0
                if (s1 > s2) {
                    if (lbFinalMatch.team2?.name)
                        result.push({ rank: 3, name: lbFinalMatch.team2.name, ...getRecord(lbFinalMatch.team2.name) })
                } else if (s2 > s1) {
                    if (lbFinalMatch.team1?.name)
                        result.push({ rank: 3, name: lbFinalMatch.team1.name, ...getRecord(lbFinalMatch.team1.name) })
                }
            }
        }

        // 4th from LB R1 (lower bracket first round)
        const lbR1Round = bracket.lower[0]
        if (lbR1Round) {
            const lbR1Match = lbR1Round.matches[0]
            if (lbR1Match?.status === 'COMPLETED') {
                const s1 = lbR1Match.team1?.score ?? 0
                const s2 = lbR1Match.team2?.score ?? 0
                if (s1 > s2) {
                    if (lbR1Match.team2?.name) result.push({ rank: 4, name: lbR1Match.team2.name, ...getRecord(lbR1Match.team2.name) })
                } else if (s2 > s1) {
                    if (lbR1Match.team1?.name) result.push({ rank: 4, name: lbR1Match.team1.name, ...getRecord(lbR1Match.team1.name) })
                }
            }
        }

        return result.sort((a, b) => a.rank - b.rank)
    }, [bracket, completedMatches, grandFinal])

    // 3. MVP Leaderboard
    const mvpLeaderboard = useMemo(() => {
        const mvpMap = new Map<string, BracketMvp>()
        completedMatches.forEach((m) => {
            m.mvps?.forEach((mvp) => {
                const key = `${mvp.name}-${mvp.position}`
                if (mvpMap.has(key)) {
                    const existing = mvpMap.get(key)!
                    mvpMap.set(key, { ...existing, count: existing.count + mvp.count })
                } else {
                    mvpMap.set(key, { ...mvp })
                }
            })
        })
        return Array.from(mvpMap.values()).sort((a, b) => b.count - a.count)
    }, [completedMatches])

    // 4. Tournament Stats Cards
    const stats = useMemo(() => {
        let totalSets = 0
        let closestDiff = Infinity
        let dominantDiff = -1

        completedMatches.forEach((m) => {
            const s1 = m.team1?.score ?? 0
            const s2 = m.team2?.score ?? 0
            totalSets += s1 + s2

            const diff = Math.abs(s1 - s2)
            if (diff < closestDiff) closestDiff = diff
            if (diff > dominantDiff) dominantDiff = diff
        })

        return {
            totalMatches: completedMatches.length,
            totalSets,
            closestDiff: closestDiff === Infinity ? 0 : closestDiff,
            dominantDiff: dominantDiff === -1 ? 0 : dominantDiff,
        }
    }, [completedMatches])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-[#6b7280]" />
            </div>
        )
    }

    if (error) {
        return <div className="py-10 text-center text-sm text-[#ff8f8f]">최종 결과를 불러오지 못했습니다.</div>
    }

    if (!bracket || allMatches.length === 0) {
        return <div className="py-10 text-center text-sm text-[#6b7280]">등록된 대회 결과가 없습니다.</div>
    }

    const getTeamColor = (teamName: string) => {
        const team = teams.find((t) => t.name === teamName)
        if (team) {
            return TEAM_ACCENT_COLORS[team.teamOrder % TEAM_ACCENT_COLORS.length]
        }
        return '#6b7280'
    }

    return (
        <div className="space-y-6">
            {/* 1. Tournament Champion Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a1929] px-8 py-6">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
                {isTournamentComplete && championName ? (
                    <div className="relative z-10 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30">
                                <Trophy className="h-7 w-7" />
                            </div>
                            <div className="space-y-0.5 text-center">
                                <div className="text-[10px] font-black italic tracking-widest text-amber-500">CHAMPION</div>
                                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{championName}</h2>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30">
                            <Trophy className="h-8 w-8" />
                        </div>
                        <div className="space-y-1">
                            <div className="text-sm font-bold tracking-widest text-[#6b7280]">TOURNAMENT STATUS</div>
                            <h2 className="text-2xl font-bold text-white">대회 진행 중</h2>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    {/* 2. Final Standings */}
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-[#9ca3af]">Final Standings</h3>
                        <div className="space-y-2">
                            {standings.length > 0 ? (
                                standings.map((s) => {
                                    const color = getTeamColor(s.name)
                                    const medal = s.rank === 1 ? '🥇' : s.rank === 2 ? '🥈' : s.rank === 3 ? '🥉' : '4th'
                                    return (
                                        <div
                                            key={s.name}
                                            className="flex items-center justify-between rounded-xl border-l-[3px] bg-white/[0.03] px-4 py-3 transition-colors hover:bg-white/[0.05]"
                                            style={{ borderLeftColor: color }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex w-8 justify-center text-xl font-black italic text-white/80">
                                                    {medal}
                                                </div>
                                                <div className="text-lg font-bold text-white">{s.name}</div>
                                            </div>
                                            <div className="text-sm font-bold tabular-nums text-[#9ca3af]">
                                                <span className="text-white">{s.wins}</span>W -{' '}
                                                <span className="text-white">{s.losses}</span>L
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="py-8 text-center text-sm text-[#6b7280]">아직 확정된 순위가 없습니다.</div>
                            )}
                        </div>
                    </div>

                    {/* 4. Tournament Stats Cards */}
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
                            <div className="mb-1 flex justify-center text-[#6b7280]">
                                <Swords className="h-5 w-5" />
                            </div>
                            <div className="text-2xl font-black italic tabular-nums text-white">{stats.totalMatches}</div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-[#9ca3af]">완료 경기</div>
                        </div>
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
                            <div className="mb-1 flex justify-center text-[#6b7280]">
                                <Activity className="h-5 w-5" />
                            </div>
                            <div className="text-2xl font-black italic tabular-nums text-white">{stats.totalSets}</div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-[#9ca3af]">총 세트</div>
                        </div>
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
                            <div className="mb-1 flex justify-center text-[#6b7280]">
                                <Target className="h-5 w-5" />
                            </div>
                            <div className="text-2xl font-black italic tabular-nums text-white">{stats.closestDiff}</div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-[#9ca3af]">최소 점수차</div>
                        </div>
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
                            <div className="mb-1 flex justify-center text-[#6b7280]">
                                <Crosshair className="h-5 w-5" />
                            </div>
                            <div className="text-2xl font-black italic tabular-nums text-white">{stats.dominantDiff}</div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-[#9ca3af]">최대 점수차</div>
                        </div>
                    </div>
                </div>

                {/* 3. MVP Leaderboard */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#9ca3af]">
                        <Zap className="h-4 w-4 fill-amber-400 text-amber-400" />
                        MVP Leaderboard
                    </h3>
                    <div className="space-y-3">
                        {mvpLeaderboard.length > 0 ? (
                            mvpLeaderboard.map((mvp, i) => {
                                const color = ROLE_COLOR[mvp.position] ?? '#6b7280'
                                return (
                                    <div
                                        key={`${mvp.name}-${mvp.position}`}
                                        className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2.5 transition-colors hover:bg-white/[0.06]"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex w-4 justify-center text-xs font-bold text-[#6b7280]">{i + 1}</div>
                                            <div className="relative">
                                                {ROLE_IMG[mvp.position] && (
                                                    <div
                                                        className="absolute -left-1 -top-1 z-10 flex h-4 w-4 items-center justify-center rounded-full"
                                                        style={{ backgroundColor: `${color}30` }}
                                                    >
                                                        <img src={ROLE_IMG[mvp.position]} alt={mvp.position} className="h-2.5 w-2.5" />
                                                    </div>
                                                )}
                                                <HexAvatar url={mvp.avatarUrl} name={mvp.name} size={36} borderColor={color} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">{mvp.name}</div>
                                                <div
                                                    className="mt-0.5 inline-flex items-center gap-1 rounded px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                                                    style={{ backgroundColor: `${color}20`, color }}
                                                >
                                                    {ROLE_IMG[mvp.position] && (
                                                        <img src={ROLE_IMG[mvp.position]} alt={mvp.position} className="h-2.5 w-2.5" />
                                                    )}
                                                    {mvp.position}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-amber-400">
                                            <span className="text-lg font-black italic tabular-nums">{mvp.count}</span>
                                            <Zap className="h-4 w-4 fill-amber-400" />
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="py-8 text-center text-sm text-[#6b7280]">아직 MVP 데이터가 없습니다.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
