import { useEffect, useState } from 'react'
import { ChevronDown, Zap } from 'lucide-react'
import controlSrc from '../../../assets/control.svg'
import tnkSrc from '../../../assets/tnk.svg'
import dpsSrc from '../../../assets/dps.svg'
import sptSrc from '../../../assets/spt.svg'
import escortSrc from '../../../assets/escort.svg'
import flashpointSrc from '../../../assets/flashpoint.svg'
import hybridSrc from '../../../assets/hybrid.svg'
import pushSrc from '../../../assets/push.webp'
import type { OverwatchSetMap, ScheduleContent, ScheduleMatch, TournamentOverwatchMapType, TournamentTeam } from '../types'

const ROLE_ORDER: Record<string, number> = {
    TNK: 0,
    DPS: 1,
    SPT: 2,
}

const ROLE_IMG: Record<string, string> = {
    TNK: tnkSrc,
    DPS: dpsSrc,
    SPT: sptSrc,
}

const ROLE_TONE: Record<string, string> = {
    TNK: 'bg-sky-500/10 ring-sky-400/40',
    DPS: 'bg-rose-500/10 ring-rose-400/40',
    SPT: 'bg-emerald-500/10 ring-emerald-400/40',
}

const MAP_TYPE_CLASS: Record<TournamentOverwatchMapType, string> = {
    쟁탈: 'border-violet-400/30 bg-violet-500/15 text-violet-300',
    혼합: 'border-orange-400/30 bg-orange-500/15 text-orange-300',
    밀기: 'border-blue-400/30 bg-blue-500/15 text-blue-300',
    호위: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-300',
    플레시포인트: 'border-fuchsia-400/30 bg-fuchsia-500/15 text-fuchsia-300',
}

const TEAM_WINNER_CONTAINER_CLASS = {
    blue: 'border-blue-400/50 bg-blue-500/18',
    red: 'border-rose-400/50 bg-rose-500/18',
} as const

const MAP_TYPE_ICON: Record<TournamentOverwatchMapType, string> = {
    쟁탈: controlSrc,
    혼합: hybridSrc,
    밀기: pushSrc,
    호위: escortSrc,
    플레시포인트: flashpointSrc,
}

const MAP_FLAG_BY_NAME: Record<string, string> = {
    남극반도: '🇦🇶',
    네팔: '🇳🇵',
    리장타워: '🇨🇳',
    '리장 타워': '🇨🇳',
    부산: '🇰🇷',
    오아시스: '🇮🇶',
    일리오스: '🇬🇷',
    사모아: '🇼🇸',
    눔바니: '🇳🇬',
    미드타운: '🇺🇸',
    블리자드월드: '🇺🇸',
    '블리자드 월드': '🇺🇸',
    아이헨발데: '🇩🇪',
    할리우드: '🇺🇸',
    파라이수: '🇧🇷',
    '왕의 길': '🇬🇧',
    '뉴 퀸 스트리트': '🇨🇦',
    이스페란사: '🇵🇹',
    루나사피: '🇲🇲',
    콜로세오: '🇮🇹',
    '66번 국도': '🇺🇸',
    '66번국도': '🇺🇸',
    '감시기지:지브롤터': '🇬🇮',
    도라도: '🇲🇽',
    리알토: '🇮🇹',
    '서킷 로얄': '🇲🇨',
    서킷로얄: '🇲🇨',
    '삼발리 수도원': '🇳🇵',
    쓰레기촌: '🇦🇺',
    하바나: '🇨🇺',
    '뉴 정크 시티': '🇦🇺',
    수라바사: '🇮🇳',
    아틀리스: '🇲🇦',
}

interface Props {
    title: string
    content: ScheduleContent
    teams: TournamentTeam[]
    isOverwatch?: boolean
    defaultExpanded?: boolean
}

function getTeamName(teams: TournamentTeam[], teamId: number): string {
    return teams.find((t) => t.id === teamId)?.name ?? `팀 #${teamId}`
}

function getTeamLogo(teams: TournamentTeam[], teamId: number): string | null {
    return teams.find((t) => t.id === teamId)?.logoUrl ?? null
}

function getTeam(teams: TournamentTeam[], teamId: number): TournamentTeam | null {
    return teams.find((t) => t.id === teamId) ?? null
}

function getOrderedPlayers(team: TournamentTeam | null) {
    if (team === null) return []
    return team.members
        .filter((member) => ['TNK', 'DPS', 'SPT'].includes(member.slot))
        .sort((a, b) => ROLE_ORDER[a.slot] - ROLE_ORDER[b.slot])
}

interface MatchCardProps {
    match: ScheduleMatch
    teams: TournamentTeam[]
    isOverwatch: boolean
}

function MatchCard({ match, teams, isOverwatch }: MatchCardProps) {
    const isCompleted = match.status === 'COMPLETED'
    const scoreA = match.scoreA ?? 0
    const scoreB = match.scoreB ?? 0
    const teamAWon = isCompleted && scoreA > scoreB
    const teamBWon = isCompleted && scoreB > scoreA

    const logoA = getTeamLogo(teams, match.teamAId)
    const logoB = getTeamLogo(teams, match.teamBId)
    const teamA = getTeam(teams, match.teamAId)
    const teamB = getTeam(teams, match.teamBId)
    const teamAPlayers = getOrderedPlayers(teamA)
    const teamBPlayers = getOrderedPlayers(teamB)
    const configuredSetMaps: OverwatchSetMap[] = isOverwatch
        ? Array.isArray(match.setMaps) && match.setMaps.length > 0
            ? match.setMaps.filter((setMap) => setMap.mapName !== null && setMap.mapName.trim().length > 0)
            : match.mapType !== undefined && match.mapName !== undefined && match.mapName !== null && match.mapName.trim().length > 0
              ? [
                    {
                        setNumber: 1,
                        mapType: match.mapType ?? '쟁탈',
                        mapName: match.mapName,
                        scoreA: null,
                        scoreB: null,
                    },
                ]
              : []
        : []
    return (
        <div className="relative overflow-hidden rounded-xl bg-[#062035] p-4 ring-1 ring-[#1e3a5f]/70">
            <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#0596e8]/70 to-transparent" />
            {isOverwatch && configuredSetMaps.length > 0 && (
                <div className="mb-3.5 flex flex-wrap items-center justify-center gap-2 px-0.5">
                    {configuredSetMaps.map((setMap) =>
                        (() => {
                            const setScoreA = setMap.scoreA ?? 0
                            const setScoreB = setMap.scoreB ?? 0
                            const hasSetScore = setMap.scoreA !== null && setMap.scoreB !== null
                            const isSetAWon = hasSetScore && setScoreA > setScoreB
                            const isSetBWon = hasSetScore && setScoreB > setScoreA
                            const winnerTone = isSetAWon
                                ? TEAM_WINNER_CONTAINER_CLASS.blue
                                : isSetBWon
                                  ? TEAM_WINNER_CONTAINER_CLASS.red
                                  : null
                            return (
                                <div
                                    key={setMap.setNumber}
                                    className={[
                                        'inline-flex max-w-full min-w-0 flex-wrap items-center gap-1.5 rounded-lg border px-2.5 py-1',
                                        winnerTone !== null ? winnerTone : 'border-[#1e3a5f] bg-[#041524]',
                                    ].join(' ')}
                                >
                                    <span
                                        className={[
                                            'inline-flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs font-semibold',
                                            MAP_TYPE_CLASS[setMap.mapType],
                                        ].join(' ')}
                                    >
                                        <img
                                            src={MAP_TYPE_ICON[setMap.mapType]}
                                            alt=""
                                            aria-hidden="true"
                                            className="h-3.5 w-3.5 shrink-0"
                                        />
                                        <span className="hidden sm:inline">{setMap.mapType}</span>
                                    </span>
                                    <span className="min-w-0 max-w-[9.5rem] truncate pr-2 text-sm font-semibold text-[#b9dfff] sm:max-w-none">
                                        <span className="hidden sm:inline">{MAP_FLAG_BY_NAME[setMap.mapName ?? ''] ?? '🌐'} </span>
                                        {setMap.mapName}
                                    </span>
                                    {hasSetScore && (
                                        <span className="ml-1 inline-flex shrink-0 items-center gap-1 rounded-md border border-[#1e3a5f] bg-[#062035] px-1.5 py-0.5 text-xs font-bold">
                                            <span className="rounded px-1 text-[#a7cfe6]">{setScoreA}</span>
                                            <span className="text-[#6aadcc]">:</span>
                                            <span className="rounded px-1 text-[#a7cfe6]">{setScoreB}</span>
                                        </span>
                                    )}
                                </div>
                            )
                        })(),
                    )}
                </div>
            )}
            <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
                <div className="min-w-0 space-y-1 text-right">
                    <div className="mb-2 flex items-center justify-end gap-2.5">
                        <div className="min-w-0 text-right pr-2">
                            <p className="text-xs font-bold tracking-[0.2em] text-[#0596e8]/80">TEAM</p>
                            <span className="truncate text-[28px] font-black text-[#e8f4fd]">{getTeamName(teams, match.teamAId)}</span>
                        </div>
                        {logoA !== null && (
                            <img
                                src={logoA}
                                alt={getTeamName(teams, match.teamAId)}
                                className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-[#1e3a5f]"
                            />
                        )}
                    </div>

                    <div className="space-y-1.5">
                        {teamAPlayers.map((player) => {
                            const mvpCount = match.mvpPlayerIds.filter((id) => id === player.id).length
                            const isDimmed = isCompleted && !teamAWon && mvpCount === 0
                            return (
                                <div
                                    key={player.id}
                                    className={[
                                        'relative grid grid-cols-[auto_minmax(0,1fr)] sm:grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-md border border-[#1e3a5f]/70 bg-[#041524]/65 px-2 py-1.5',
                                        mvpCount > 0 ? 'ring-1 ring-amber-300/50' : '',
                                    ].join(' ')}
                                >
                                    <span
                                        className={`flex h-6 w-6 items-center justify-center rounded ${ROLE_TONE[player.slot] ?? 'bg-[#041524] ring-[#1e3a5f]/40'} ring-1 ${isDimmed ? 'opacity-55' : ''}`}
                                    >
                                        <img src={ROLE_IMG[player.slot]} alt={player.slot} className="h-4 w-4 shrink-0" />
                                    </span>
                                    <span
                                        className={`flex min-w-0 items-center justify-end gap-1 truncate pr-2 text-[15px] font-semibold text-[#e8f4fd] ${isDimmed ? 'opacity-55' : ''}`}
                                    >
                                        {mvpCount > 0 &&
                                            Array.from({
                                                length: mvpCount,
                                            }).map((_, i) => <Zap key={i} className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />)}
                                        {player.nickname ?? player.name}
                                    </span>
                                    <div className="hidden sm:block">
                                        {player.avatarUrl !== null ? (
                                            <img
                                                src={player.avatarUrl}
                                                alt={player.nickname ?? player.name}
                                                className={`h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-[#1e3a5f] ${isDimmed ? 'opacity-55' : ''}`}
                                            />
                                        ) : (
                                            <div
                                                className={`h-8 w-8 shrink-0 rounded-full bg-[#041524] ring-1 ring-[#1e3a5f] ${isDimmed ? 'opacity-55' : ''}`}
                                            />
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="flex shrink-0 self-stretch flex-col items-center gap-1.5">
                    <div className="flex items-center gap-2.5">
                        {isCompleted ? (
                            <>
                                <span
                                    className={`text-4xl font-black italic sm:text-5xl ${teamAWon ? 'text-[#59b3ff]' : 'text-[#6aadcc]/55'}`}
                                >
                                    {scoreA}
                                </span>
                                <span className="text-xl text-[#6aadcc]/50">:</span>
                                <span
                                    className={`text-4xl font-black italic sm:text-5xl ${teamBWon ? 'text-[#ff6b7f]' : 'text-[#6aadcc]/55'}`}
                                >
                                    {scoreB}
                                </span>
                            </>
                        ) : (
                            <span className="text-sm font-bold italic text-[#6aadcc]/70">VS</span>
                        )}
                    </div>

                    {(teamAPlayers.length > 0 || teamBPlayers.length > 0) && (
                        <div className="flex flex-1 items-center">
                            <span className="text-5xl font-black italic text-[#6aadcc]/65">VS</span>
                        </div>
                    )}
                </div>

                <div className="min-w-0 space-y-1 text-left">
                    <div className="mb-2 flex items-center gap-2.5">
                        {logoB !== null && (
                            <img
                                src={logoB}
                                alt={getTeamName(teams, match.teamBId)}
                                className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-[#1e3a5f]"
                            />
                        )}
                        <div className="min-w-0 text-left pr-2">
                            <p className="text-xs font-bold tracking-[0.2em] text-[#0596e8]/80">TEAM</p>
                            <span className="truncate text-2xl font-black text-[#e8f4fd]">{getTeamName(teams, match.teamBId)}</span>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        {teamBPlayers.map((player) => {
                            const mvpCount = match.mvpPlayerIds.filter((id) => id === player.id).length
                            const isDimmed = isCompleted && !teamBWon && mvpCount === 0
                            return (
                                <div
                                    key={player.id}
                                    className={[
                                        'relative grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-md border border-[#1e3a5f]/70 bg-[#041524]/65 px-2 py-1.5',
                                        mvpCount > 0 ? 'ring-1 ring-amber-300/50' : '',
                                    ].join(' ')}
                                >
                                    <div className="hidden sm:block">
                                        {player.avatarUrl !== null ? (
                                            <img
                                                src={player.avatarUrl}
                                                alt={player.nickname ?? player.name}
                                                className={`h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-[#1e3a5f] ${isDimmed ? 'opacity-55' : ''}`}
                                            />
                                        ) : (
                                            <div
                                                className={`h-8 w-8 shrink-0 rounded-full bg-[#041524] ring-1 ring-[#1e3a5f] ${isDimmed ? 'opacity-55' : ''}`}
                                            />
                                        )}
                                    </div>
                                    <span
                                        className={`flex min-w-0 items-center gap-1 truncate pr-2 text-[15px] font-semibold text-[#e8f4fd] ${isDimmed ? 'opacity-55' : ''}`}
                                    >
                                        {player.nickname ?? player.name}
                                        {mvpCount > 0 &&
                                            Array.from({
                                                length: mvpCount,
                                            }).map((_, i) => <Zap key={i} className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />)}
                                    </span>
                                    <span
                                        className={`flex h-6 w-6 items-center justify-center rounded ${ROLE_TONE[player.slot] ?? 'bg-[#041524] ring-[#1e3a5f]/40'} ring-1 ${isDimmed ? 'opacity-55' : ''}`}
                                    >
                                        <img src={ROLE_IMG[player.slot]} alt={player.slot} className="h-4 w-4 shrink-0" />
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function SchedulePanelView({ title, content, teams, isOverwatch = false, defaultExpanded = false }: Props) {
    const sortedGroups = [...content.groups].sort((a, b) => a.order - b.order)
    const [collapsed, setCollapsed] = useState(!defaultExpanded)
    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({})

    useEffect(() => {
        setCollapsed(!defaultExpanded)
    }, [defaultExpanded])

    return (
        <section className="w-full mt-10">
            <button
                type="button"
                onClick={() => setCollapsed((prev) => !prev)}
                aria-expanded={!collapsed}
                className="flex w-full items-center justify-between text-left cursor-pointer"
            >
                <h2 className="text-3xl font-bold text-[#e8f4fd]">{title}</h2>
                <ChevronDown
                    className={['h-6 w-6 text-[#6aadcc] transition-transform duration-200', collapsed ? '-rotate-90' : ''].join(' ')}
                />
            </button>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-[#0596e8]/60 via-[#1e3a5f]/40 to-transparent" />

            {!collapsed && sortedGroups.length === 0 ? (
                <p className="mt-4 text-base text-[#6aadcc]/60">등록된 일정이 없습니다.</p>
            ) : !collapsed ? (
                <div className="mt-4 flex flex-col gap-5">
                    {sortedGroups.map((group) => {
                        const sortedMatches = [...group.matches].sort((a, b) => a.order - b.order)
                        const isGroupCollapsed = collapsedGroups[String(group.id)] !== false
                        return (
                            <div key={group.id} className="rounded-xl bg-[#062035] p-3 ring-1 ring-[#1e3a5f]/70">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCollapsedGroups((prev) => ({
                                            ...prev,
                                            [String(group.id)]: !isGroupCollapsed,
                                        }))
                                    }}
                                    aria-expanded={!isGroupCollapsed}
                                    className="mb-3 flex w-full items-center justify-between text-left cursor-pointer"
                                >
                                    <div className="flex items-baseline gap-2.5">
                                        <h3 className="text-2xl font-black text-[#e8f4fd]">{group.title}</h3>
                                        {group.groupDate !== null && (
                                            <span className="rounded-full bg-[#041524] px-2.5 py-1 text-sm text-[#6aadcc]">
                                                {new Date(group.groupDate).toLocaleDateString('ko-KR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        )}
                                    </div>
                                    <ChevronDown
                                        className={[
                                            'h-5 w-5 text-[#6aadcc] transition-transform duration-200',
                                            isGroupCollapsed ? '-rotate-90' : '',
                                        ].join(' ')}
                                    />
                                </button>

                                {!isGroupCollapsed && (
                                    <div className="grid gap-2">
                                        {sortedMatches.map((match) => (
                                            <MatchCard key={match.id} match={match} teams={teams} isOverwatch={isOverwatch} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            ) : null}
        </section>
    )
}
