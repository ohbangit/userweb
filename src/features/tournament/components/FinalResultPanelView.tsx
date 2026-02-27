import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import partnerMark from '../../../assets/mark.png'
import tnkSrc from '../../../assets/tnk.svg'
import dpsSrc from '../../../assets/dps.svg'
import sptSrc from '../../../assets/spt.svg'
import type { FinalResultContent, OverwatchRole, TournamentMember, TournamentTeam } from '../types'

interface Props {
    title: string
    content: FinalResultContent
    teams: TournamentTeam[]
}

function getTeam(
    teams: TournamentTeam[],
    teamId: number,
): TournamentTeam | undefined {
    return teams.find((t) => t.id === teamId)
}

const ROLE_IMG: Record<OverwatchRole, string> = {
    TNK: tnkSrc,
    DPS: dpsSrc,
    SPT: sptSrc,
    }

function getMvpPlayer(
    teams: TournamentTeam[],
    mvpPlayerId: number | null,
    ): (TournamentMember & { teamName: string }) | null {
    if (mvpPlayerId === null) return null

    for (const team of teams) {
        const player = team.members.find((member) => member.id === mvpPlayerId)
        if (player !== undefined) {
            return { ...player, teamName: team.name }
        }
    }

    return null
}

const MEDAL: Record<number, string> = {
    1: '🥇',
    2: '🥈',
    3: '🥉',
}

export function FinalResultPanelView({ title, content, teams }: Props) {
    const sorted = [...content.standings].sort((a, b) => a.rank - b.rank)
    const [collapsed, setCollapsed] = useState(true)
    const mvpPlayer = getMvpPlayer(teams, content.mvpPlayerId)

    return (
        <section className="w-full mt-10">
            <button
                type="button"
                onClick={() => setCollapsed((prev) => !prev)}
                aria-expanded={!collapsed}
                className="flex w-full items-center justify-between text-left cursor-pointer"
            >
                <h2 className="text-4xl font-bold text-[#e8f4fd]">{title}</h2>
                <ChevronDown
                    className={[
                        'h-6 w-6 text-[#6aadcc] transition-transform duration-200',
                        collapsed ? '-rotate-90' : '',
                    ].join(' ')}
                />
            </button>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-[#0596e8]/60 via-[#1e3a5f]/40 to-transparent" />

            {!collapsed && sorted.length === 0 ? (
                <p className="mt-4 text-base text-[#6aadcc]/60">
                    최종 결과가 아직 없습니다.
                </p>
            ) : !collapsed ? (
                <div className="mt-4 flex items-start gap-6">
                    {/* 왼쪽: 순위표 */}
                    <div className="min-w-0 flex-1 overflow-hidden rounded-xl">
                        <div className="grid grid-cols-[3rem_1fr_3.5rem_3.5rem] items-center gap-2 px-4 py-1.5 text-sm font-bold text-[#6aadcc] sm:grid-cols-[3rem_1fr_4.5rem_4.5rem]">
                            <span className="text-center tracking-wide">순위</span>
                            <span className="tracking-wide">팀</span>
                            <span className="text-center tracking-wide">승</span>
                            <span className="text-center tracking-wide">패</span>
                        </div>
                        <div className="h-px w-full bg-gradient-to-r from-[#0596e8]/60 via-[#1e3a5f]/40 to-transparent" />
                        <ul>
                            {sorted.map((entry, index) => {
                                const team = getTeam(teams, entry.teamId)
                                return (
                                    <li key={entry.teamId}>
                                        {index > 0 && (
                                            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#1e3a5f]/55 to-transparent" />
                                        )}
                                        <div className="grid grid-cols-[3rem_1fr_3.5rem_3.5rem] items-center gap-2 px-4 py-1.5 sm:grid-cols-[3rem_1fr_4.5rem_4.5rem]">
                                            <span className="text-center text-lg">
                                                {MEDAL[entry.rank] !== undefined ? (
                                                    MEDAL[entry.rank]
                                                ) : (
                                                    <span className="font-bold text-[#e8f4fd]">
                                                        {entry.rank}
                                                    </span>
                                                )}
                                            </span>
                                            <div className="flex min-w-0 items-center gap-2">
                                                {team?.logoUrl !== undefined &&
                                                    team.logoUrl !== null && (
                                                        <img
                                                            src={team.logoUrl}
                                                            alt={team.name}
                                                            className="h-7 w-7 shrink-0 rounded-full object-cover ring-2 ring-[#1e3a5f]"
                                                        />
                                                    )}
                                                <div className="min-w-0">
                                                    <p className="truncate pr-2 text-base font-semibold text-[#e8f4fd]">
                                                        {team?.name ?? `팀 #${entry.teamId}`}
                                                    </p>
                                                    {entry.note.length > 0 && (
                                                        <p className="truncate text-sm text-[#6aadcc]/70">
                                                            {entry.note}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-center text-base font-bold text-emerald-300">
                                                {entry.wins ?? '-'}
                                            </span>
                                            <span className="text-center text-base font-bold text-rose-300">
                                                {entry.losses ?? '-'}
                                            </span>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    {/* 오른쪽: MVP */}
                    {mvpPlayer !== null && (() => {
                        const role = (['TNK', 'DPS', 'SPT'] as const).includes(
                            mvpPlayer.slot as OverwatchRole,
                        )
                            ? (mvpPlayer.slot as OverwatchRole)
                            : null
                        return (
                            <div className="flex w-44 shrink-0 flex-col items-center gap-2">
                                <p className="text-base font-black tracking-[0.35em] text-[#0596e8]">
                                    MVP
                                </p>
                                <div className="relative flex w-full flex-col items-center gap-3 rounded-2xl border border-[#0596e8]/40 bg-[#041e33] px-5 py-6 shadow-[0_0_32px_rgba(5,150,232,0.15)] ring-1 ring-[#0596e8]/20">
                                    <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-[#0596e8]/80 to-transparent" />
                                    {mvpPlayer.avatarUrl !== null ? (
                                        <img
                                            src={mvpPlayer.avatarUrl}
                                            alt={mvpPlayer.name}
                                            className="h-20 w-20 rounded-full object-cover ring-2 ring-[#0596e8]/60 ring-offset-2 ring-offset-[#041e33]"
                                        />
                                    ) : (
                                        <div className="h-20 w-20 rounded-full bg-[#062035] ring-2 ring-[#0596e8]/60 ring-offset-2 ring-offset-[#041e33]" />
                                    )}
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-base font-bold text-[#e8f4fd] text-center">
                                            {mvpPlayer.name}
                                        </span>
                                        {mvpPlayer.isPartner && (
                                            <img
                                                src={partnerMark}
                                                alt="파트너"
                                                className="h-3.5 w-3.5 shrink-0"
                                            />
                                        )}
                                    </div>
                                    <p className="-mt-2 text-xs text-[#6aadcc]/80 text-center">
                                        {mvpPlayer.teamName}
                                    </p>
                                    {role !== null && (
                                        <img
                                            src={ROLE_IMG[role]}
                                            alt={role}
                                            className="h-7 w-7 opacity-80"
                                        />
                                    )}
                                </div>
                            </div>
                        )
                    })()}
                </div>
            ) : null}
        </section>
    )
}
