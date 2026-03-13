import { Fragment, useMemo } from 'react'
import { ArrowRight, ArrowLeft, Crown, Loader2 } from 'lucide-react'
import tnkIcon from '../../../../../assets/tnk.svg'
import dpsIcon from '../../../../../assets/dps.svg'
import sptIcon from '../../../../../assets/spt.svg'
import partnerMark from '../../../../../assets/mark.png'
import type { OWPlayerPosition, OWPlayerPublicItem } from '../types'

const POSITION_ICON: Record<OWPlayerPosition, string> = {
    TNK: tnkIcon,
    DPS: dpsIcon,
    SPT: sptIcon,
}

interface DraftRound {
    round: number
    slots: (OWPlayerPublicItem | null)[]
    direction: 'ltr' | 'rtl'
}

interface DraftBoard {
    captains: (OWPlayerPublicItem | null)[]
    rounds: DraftRound[]
    numTeams: number
}

interface TeamData {
    captain: OWPlayerPublicItem | null
    picks: { player: OWPlayerPublicItem | null; round: number }[]
}

function buildDraftBoard(players: OWPlayerPublicItem[]): DraftBoard {
    const rawCaptains = players.filter((p) => p.isCaptain)
    const numTeams = Math.max(rawCaptains.length, 2)
    const captains: (OWPlayerPublicItem | null)[] = Array.from({ length: numTeams }, (_, i) => rawCaptains[i] ?? null)
    const picked = players.filter((p) => p.draftPick !== null).sort((a, b) => (a.draftPick ?? 0) - (b.draftPick ?? 0))

    const rounds: DraftRound[] = []
    for (const player of picked) {
        const pick = player.draftPick!
        const round = Math.ceil(pick / numTeams)
        const posInRound = (pick - 1) % numTeams
        const isEvenRound = round % 2 === 0
        const teamIndex = isEvenRound ? numTeams - 1 - posInRound : posInRound

        while (rounds.length < round) {
            const r = rounds.length + 1
            rounds.push({
                round: r,
                slots: Array.from<OWPlayerPublicItem | null>({ length: numTeams }).fill(null),
                direction: r % 2 === 0 ? 'rtl' : 'ltr',
            })
        }

        rounds[round - 1].slots[teamIndex] = player
    }

    return { captains, rounds, numTeams }
}

function buildTeams(board: DraftBoard): TeamData[] {
    return board.captains.map((captain, i) => ({
        captain,
        picks: board.rounds.map((r) => ({
            player: r.slots[i],
            round: r.round,
        })),
    }))
}

function CaptainHeaderCell({ captain }: { captain: OWPlayerPublicItem | null }) {
    if (!captain) {
        return (
            <div className="flex flex-1 flex-col items-center gap-1 py-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04] ring-2 ring-white/[0.06]">
                    <span className="text-xs text-[#4b5563]">?</span>
                </div>
                <span className="text-[9px] text-[#4b5563]">미정</span>
            </div>
        )
    }

    const inner = (
        <div className="flex flex-col items-center gap-1">
            <div className="relative">
                <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-white/[0.06] ring-2 ring-[#f99e1a]/40">
                    {captain.avatarUrl ? (
                        <img src={captain.avatarUrl} alt={captain.name} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                        <span className="flex h-full w-full items-center justify-center text-xs font-bold text-[#4b5563]">
                            {captain.name.slice(0, 1)}
                        </span>
                    )}
                </div>
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2">
                    <Crown className="h-2.5 w-2.5 fill-[#f99e1a] text-[#f99e1a]" strokeWidth={2} />
                </div>
            </div>
            <span className="max-w-full truncate text-[10px] font-bold text-[#d1d5db] transition-colors group-hover:text-white">
                {captain.name}
            </span>
        </div>
    )

    if (captain.channelId) {
        return (
            <a
                href={`https://chzzk.naver.com/${captain.channelId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-1 cursor-pointer justify-center py-1"
                aria-label={`${captain.name} 치지직 채널 열기`}
            >
                {inner}
            </a>
        )
    }

    return <div className="flex flex-1 justify-center py-1">{inner}</div>
}

function MobilePickRow({ player, round }: { player: OWPlayerPublicItem | null; round: number }) {
    if (!player) {
        return (
            <div className="flex items-center gap-2 py-2">
                <span className="w-5 shrink-0 text-[9px] font-bold uppercase text-[#4b5563]">R{round}</span>
                <span className="text-xs text-[#4b5563]">—</span>
            </div>
        )
    }

    const content = (
        <div className="flex items-center gap-2">
            <span className="w-5 shrink-0 text-[9px] font-bold uppercase text-[#4b5563]">R{round}</span>
            <div className="relative">
                <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-white/[0.06] ring-1 ring-white/10">
                    {player.avatarUrl ? (
                        <img src={player.avatarUrl} alt={player.name} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                        <span className="flex h-full w-full items-center justify-center text-[10px] font-bold text-[#4b5563]">
                            {player.name.slice(0, 1)}
                        </span>
                    )}
                </div>
                <img
                    src={POSITION_ICON[player.position]}
                    alt={player.position}
                    className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#0c1e33] p-0.5"
                />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center gap-1">
                    <span className="truncate text-xs text-[#d1d5db] transition-colors group-hover:text-white">{player.name}</span>
                    {player.isPartner && <img src={partnerMark} alt="파트너" className="h-2.5 w-2.5 shrink-0" loading="lazy" />}
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-[9px] tabular-nums text-[#4b5563]">#{player.draftPick}</span>
                    {player.draftPassed && (
                        <span className="rounded bg-[#ff8f8f]/15 px-1 py-px text-[8px] font-bold text-[#ff8f8f]">유찰</span>
                    )}
                </div>
            </div>
        </div>
    )

    if (player.channelId) {
        return (
            <a
                href={`https://chzzk.naver.com/${player.channelId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex cursor-pointer items-center py-2 transition-colors hover:bg-white/[0.03]"
                aria-label={`${player.name} 치지직 채널 열기`}
            >
                {content}
            </a>
        )
    }

    return <div className="flex items-center py-2">{content}</div>
}

function MobileTeamCard({ team }: { team: TeamData }) {
    const captain = team.captain

    const captainInner = captain ? (
        <div className="flex items-center gap-2">
            <div className="relative">
                <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full bg-white/[0.06] ring-2 ring-[#f99e1a]/40">
                    {captain.avatarUrl ? (
                        <img src={captain.avatarUrl} alt={captain.name} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                        <span className="flex h-full w-full items-center justify-center text-[10px] font-bold text-[#4b5563]">
                            {captain.name.slice(0, 1)}
                        </span>
                    )}
                </div>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                    <Crown className="h-2 w-2 fill-[#f99e1a] text-[#f99e1a]" strokeWidth={2} />
                </div>
            </div>
            <span className="truncate text-xs font-bold text-[#d1d5db] transition-colors group-hover:text-white">{captain.name}</span>
        </div>
    ) : (
        <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.04] ring-2 ring-white/[0.06]">
                <span className="text-[10px] text-[#4b5563]">?</span>
            </div>
            <span className="text-xs text-[#4b5563]">미정</span>
        </div>
    )

    return (
        <div className="overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.03]">
            {captain?.channelId ? (
                <a
                    href={`https://chzzk.naver.com/${captain.channelId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex cursor-pointer items-center border-b border-white/[0.06] px-3 py-2.5 transition-colors hover:bg-white/[0.06]"
                    aria-label={`${captain.name} 치지직 채널 열기`}
                >
                    {captainInner}
                </a>
            ) : (
                <div className="border-b border-white/[0.06] px-3 py-2.5">{captainInner}</div>
            )}

            <div className="divide-y divide-white/[0.04] px-3">
                {team.picks.map(({ player, round }) => (
                    <MobilePickRow key={round} player={player} round={round} />
                ))}
            </div>
        </div>
    )
}

function PlayerAvatar({ player }: { player: OWPlayerPublicItem }) {
    return (
        <div className="relative">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white/[0.06] ring-2 ring-white/10">
                {player.avatarUrl ? (
                    <img src={player.avatarUrl} alt={player.name} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                    <span className="flex h-full w-full items-center justify-center text-sm font-bold text-[#4b5563]">
                        {player.name.slice(0, 1)}
                    </span>
                )}
            </div>
            <img
                src={POSITION_ICON[player.position]}
                alt={player.position}
                className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#0c1e33] p-0.5"
            />
        </div>
    )
}

function SlotCell({ player }: { player: OWPlayerPublicItem | null }) {
    if (!player) {
        return (
            <div className="flex flex-1 items-center justify-center rounded-lg bg-white/[0.03] py-6">
                <span className="text-xs text-[#4b5563]">—</span>
            </div>
        )
    }

    const content = (
        <div className="flex flex-col items-center gap-1">
            <PlayerAvatar player={player} />
            <div className="flex items-center gap-1">
                <span className="text-xs text-[#d1d5db] transition-colors group-hover:text-white">{player.name}</span>
                {player.isPartner && <img src={partnerMark} alt="파트너" className="h-3 w-3 shrink-0" loading="lazy" />}
            </div>
            <div className="flex items-center gap-1.5">
                <span className="text-[10px] tabular-nums text-[#4b5563]">#{player.draftPick}</span>
                {player.draftPassed && (
                    <span className="rounded bg-[#ff8f8f]/15 px-1.5 py-px text-[9px] font-bold text-[#ff8f8f]">유찰</span>
                )}
            </div>
        </div>
    )

    if (player.channelId) {
        return (
            <a
                href={`https://chzzk.naver.com/${player.channelId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-1 cursor-pointer justify-center rounded-lg bg-white/[0.03] px-2 py-3 transition-colors hover:bg-white/[0.06]"
                aria-label={`${player.name} 치지직 채널 열기`}
            >
                {content}
            </a>
        )
    }

    return <div className="flex flex-1 justify-center rounded-lg bg-white/[0.03] px-2 py-3">{content}</div>
}

function RoundRow({ entry }: { entry: DraftRound }) {
    const Arrow = entry.direction === 'ltr' ? ArrowRight : ArrowLeft

    return (
        <div className="flex items-center gap-3">
            <div className="w-12 shrink-0 text-right">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#4b5563]">R{entry.round}</span>
            </div>

            <div className="flex flex-1 items-center gap-1.5">
                {entry.slots.map((player, teamIdx) => (
                    <Fragment key={teamIdx}>
                        {teamIdx > 0 && <Arrow className="h-3.5 w-3.5 shrink-0 text-[#f99e1a]/60" />}
                        <SlotCell player={player} />
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

interface OverwatchDraftPanelProps {
    players: OWPlayerPublicItem[]
    isLoading: boolean
    error: Error | null
}

export function OverwatchDraftPanel({ players, isLoading, error }: OverwatchDraftPanelProps) {
    const board = useMemo(() => buildDraftBoard(players), [players])
    const { captains, rounds } = board
    const teams = useMemo(() => buildTeams(board), [board])
    const hasDraftData = rounds.length > 0

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-[#6b7280]" />
            </div>
        )
    }

    if (error) {
        return <div className="py-10 text-center text-sm text-[#ff8f8f]">드래프트 정보를 불러오지 못했습니다.</div>
    }

    if (!hasDraftData) {
        return <div className="py-10 text-center text-sm text-[#6b7280]">드래프트가 아직 진행되지 않았습니다.</div>
    }

    return (
        <>
            <div className="grid grid-cols-2 gap-2.5 md:hidden">
                {teams.map((team, i) => (
                    <MobileTeamCard key={team.captain?.streamerId ?? `team-${i}`} team={team} />
                ))}
            </div>

            <div className="hidden md:block">
                <div className="space-y-3">
                    <div className="flex items-end gap-3">
                        <div className="w-12 shrink-0" />
                        <div className="flex flex-1 items-end gap-1.5">
                            {captains.map((captain, i) => (
                                <Fragment key={captain?.streamerId ?? `cap-${i}`}>
                                    {i > 0 && <div className="w-3.5 shrink-0" />}
                                    <CaptainHeaderCell captain={captain} />
                                </Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-white/[0.06]" />

                    {rounds.map((entry) => (
                        <RoundRow key={entry.round} entry={entry} />
                    ))}
                </div>
            </div>
        </>
    )
}
