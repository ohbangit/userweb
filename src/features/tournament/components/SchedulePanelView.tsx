import { useState } from 'react'
import { ChevronDown, Zap } from 'lucide-react'
import partnerMark from '../../../assets/mark.png'
import tnkSrc from '../../../assets/tnk.svg'
import dpsSrc from '../../../assets/dps.svg'
import sptSrc from '../../../assets/spt.svg'
import type { ScheduleContent, ScheduleMatch, TournamentTeam } from '../types'

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

interface Props {
    title: string
    content: ScheduleContent
    teams: TournamentTeam[]
}

function getTeamName(teams: TournamentTeam[], teamId: number): string {
    return teams.find((t) => t.id === teamId)?.name ?? `팀 #${teamId}`
}

function getTeamLogo(teams: TournamentTeam[], teamId: number): string | null {
    return teams.find((t) => t.id === teamId)?.logoUrl ?? null
}

function getTeam(
    teams: TournamentTeam[],
    teamId: number,
): TournamentTeam | null {
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
}

function MatchCard({ match, teams }: MatchCardProps) {
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
    return (
        <div className="relative overflow-hidden rounded-xl bg-[#062035] p-4 ring-1 ring-[#1e3a5f]/70">
            <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#0596e8]/70 to-transparent" />
            <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
                <div className="min-w-0 space-y-1 text-right">
                    <div className="mb-2 flex items-center justify-end gap-2.5">
                        <div className="min-w-0 text-right pr-2">
                            <p className="text-[10px] font-bold tracking-[0.2em] text-[#0596e8]/80">
                                TEAM
                            </p>
                            <span className="truncate text-2xl font-black text-[#e8f4fd]">
                                {getTeamName(teams, match.teamAId)}
                            </span>
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
                            const mvpCount = match.mvpPlayerIds.filter(
                                (id) => id === player.id,
                            ).length
                            const isDimmed = isCompleted && !teamAWon && mvpCount === 0
                            return (
                                <div
                                    key={player.id}
                                    className={[
                                        'relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-md border border-[#1e3a5f]/70 bg-[#041524]/65 px-2 py-1.5',
                                        mvpCount > 0 ? 'ring-1 ring-amber-300/50' : '',
                                    ].join(' ')}
                                >
                                    <span
                                        className={`flex h-6 w-6 items-center justify-center rounded ${ROLE_TONE[player.slot] ?? 'bg-[#041524] ring-[#1e3a5f]/40'} ring-1 ${isDimmed ? 'opacity-55' : ''}`}
                                    >
                                        <img
                                            src={ROLE_IMG[player.slot]}
                                            alt={player.slot}
                                            className="h-4 w-4 shrink-0"
                                        />
                                    </span>
                                    <span
                                        className={`flex min-w-0 items-center justify-end gap-1 truncate text-sm font-semibold text-[#e8f4fd] ${isDimmed ? 'opacity-55' : ''}`}
                                    >
                                        {mvpCount > 0 &&
                                            Array.from({ length: mvpCount }).map(
                                                (_, i) => (
                                                    <Zap
                                                        key={i}
                                                        className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400"
                                                    />
                                                ),
                                            )}
                                        {player.name}
                                        {player.isPartner && (
                                            <img
                                                src={partnerMark}
                                                alt="파트너"
                                                className={`h-3.5 w-3.5 shrink-0 ${isDimmed ? 'opacity-55' : ''}`}
                                            />
                                        )}
                                    </span>
                                    {player.avatarUrl !== null ? (
                                        <img
                                            src={player.avatarUrl}
                                            alt={player.name}
                                            className={`h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-[#1e3a5f] ${isDimmed ? 'opacity-55' : ''}`}
                                        />
                                    ) : (
                                        <div
                                            className={`h-8 w-8 shrink-0 rounded-full bg-[#041524] ring-1 ring-[#1e3a5f] ${isDimmed ? 'opacity-55' : ''}`}
                                        />
                                    )}
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
                                <span className="text-xl text-[#6aadcc]/50">
                                    :
                                </span>
                                <span
                                    className={`text-4xl font-black italic sm:text-5xl ${teamBWon ? 'text-[#ff6b7f]' : 'text-[#6aadcc]/55'}`}
                                >
                                    {scoreB}
                                </span>
                            </>
                        ) : (
                            <span className="text-sm font-bold italic text-[#6aadcc]/70">
                                VS
                            </span>
                        )}
                    </div>

                    {(teamAPlayers.length > 0 || teamBPlayers.length > 0) && (
                        <div className="flex flex-1 items-center">
                            <span className="text-5xl font-black italic text-[#6aadcc]/65">
                                VS
                            </span>
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
                            <p className="text-[10px] font-bold tracking-[0.2em] text-[#0596e8]/80">
                                TEAM
                            </p>
                            <span className="truncate text-2xl font-black text-[#e8f4fd]">
                                {getTeamName(teams, match.teamBId)}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        {teamBPlayers.map((player) => {
                            const mvpCount = match.mvpPlayerIds.filter(
                                (id) => id === player.id,
                            ).length
                            const isDimmed = isCompleted && !teamBWon && mvpCount === 0
                            return (
                                <div
                                    key={player.id}
                                    className={[
                                        'relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-md border border-[#1e3a5f]/70 bg-[#041524]/65 px-2 py-1.5',
                                        mvpCount > 0 ? 'ring-1 ring-amber-300/50' : '',
                                    ].join(' ')}
                                >
                                    {player.avatarUrl !== null ? (
                                        <img
                                            src={player.avatarUrl}
                                            alt={player.name}
                                            className={`h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-[#1e3a5f] ${isDimmed ? 'opacity-55' : ''}`}
                                        />
                                    ) : (
                                        <div
                                            className={`h-8 w-8 shrink-0 rounded-full bg-[#041524] ring-1 ring-[#1e3a5f] ${isDimmed ? 'opacity-55' : ''}`}
                                        />
                                    )}
                                    <span
                                        className={`flex min-w-0 items-center gap-1 truncate text-sm font-semibold text-[#e8f4fd] ${isDimmed ? 'opacity-55' : ''}`}
                                    >
                                        {player.name}
                                        {player.isPartner && (
                                            <img
                                                src={partnerMark}
                                                alt="파트너"
                                                className={`h-3.5 w-3.5 shrink-0 ${isDimmed ? 'opacity-55' : ''}`}
                                            />
                                        )}
                                        {mvpCount > 0 &&
                                            Array.from({ length: mvpCount }).map(
                                                (_, i) => (
                                                    <Zap
                                                        key={i}
                                                        className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400"
                                                    />
                                                ),
                                            )}
                                    </span>
                                    <span
                                        className={`flex h-6 w-6 items-center justify-center rounded ${ROLE_TONE[player.slot] ?? 'bg-[#041524] ring-[#1e3a5f]/40'} ring-1 ${isDimmed ? 'opacity-55' : ''}`}
                                    >
                                        <img
                                            src={ROLE_IMG[player.slot]}
                                            alt={player.slot}
                                            className="h-4 w-4 shrink-0"
                                        />
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

export function SchedulePanelView({ title, content, teams }: Props) {
    const sortedGroups = [...content.groups].sort((a, b) => a.order - b.order)
    const [collapsed, setCollapsed] = useState(true)
    const [collapsedGroups, setCollapsedGroups] = useState<
        Record<string, boolean>
    >({})

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
                    className={[
                        'h-6 w-6 text-[#6aadcc] transition-transform duration-200',
                        collapsed ? '-rotate-90' : '',
                    ].join(' ')}
                />
            </button>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-[#0596e8]/60 via-[#1e3a5f]/40 to-transparent" />

            {!collapsed && sortedGroups.length === 0 ? (
                <p className="mt-4 text-base text-[#6aadcc]/60">
                    등록된 일정이 없습니다.
                </p>
            ) : !collapsed ? (
                <div className="mt-4 flex flex-col gap-5">
                    {sortedGroups.map((group) => {
                        const sortedMatches = [...group.matches].sort(
                            (a, b) => a.order - b.order,
                        )
                        const isGroupCollapsed =
                            collapsedGroups[String(group.id)] !== false
                        return (
                            <div
                                key={group.id}
                                className="rounded-xl bg-[#062035] p-3 ring-1 ring-[#1e3a5f]/70"
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCollapsedGroups((prev) => ({
                                            ...prev,
                                            [String(group.id)]:
                                                !isGroupCollapsed,
                                        }))
                                    }}
                                    aria-expanded={!isGroupCollapsed}
                                    className="mb-3 flex w-full items-center justify-between text-left cursor-pointer"
                                >
                                    <div className="flex items-baseline gap-2.5">
                                        <h3 className="text-2xl font-black text-[#e8f4fd]">
                                            {group.title}
                                        </h3>
                                        {group.groupDate !== null && (
                                            <span className="rounded-full bg-[#041524] px-2.5 py-1 text-sm text-[#6aadcc]">
                                                {new Date(
                                                    group.groupDate,
                                                ).toLocaleDateString('ko-KR', {
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
                                            isGroupCollapsed
                                                ? '-rotate-90'
                                                : '',
                                        ].join(' ')}
                                    />
                                </button>

                                {!isGroupCollapsed && (
                                    <div className="grid gap-2">
                                        {sortedMatches.map((match) => (
                                            <MatchCard
                                                key={match.id}
                                                match={match}
                                                teams={teams}
                                            />
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
