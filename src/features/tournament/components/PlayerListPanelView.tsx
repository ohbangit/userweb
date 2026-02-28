import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import partnerMark from '../../../assets/mark.png'
import tnkSrc from '../../../assets/tnk.svg'
import dpsSrc from '../../../assets/dps.svg'
import sptSrc from '../../../assets/spt.svg'
import type { OverwatchRole, TournamentTeam } from '../types'

const ROLE_IMG: Record<OverwatchRole, string> = {
    TNK: tnkSrc,
    DPS: dpsSrc,
    SPT: sptSrc,
}

const SLOT_LABEL: Record<string, string> = {
    TNK: '탱커',
    DPS: '딜러',
    SPT: '서포터',
    HEAD_COACH: '감독',
    COACH: '코치',
}

interface DraftParticipantPreview {
    id: string
    name: string
    position: OverwatchRole | null
    avatarUrl: string | null
    isPartner: boolean
}

interface Props {
    title: string
    teams: TournamentTeam[]
    participants?: DraftParticipantPreview[]
}

export function PlayerListPanelView({
    title,
    teams,
    participants = [],
}: Props) {
    const [collapsed, setCollapsed] = useState(true)

    const players = teams
        .flatMap((team) =>
            team.members.map((member) => ({
                ...member,
                teamId: team.id,
                teamName: team.name,
                teamLogoUrl: team.logoUrl,
            })),
        )
        .filter(
            (member) => member.slot !== 'HEAD_COACH' && member.slot !== 'COACH',
        )

    const hasDraftParticipants = participants.length > 0
    const normalizedTitle =
        title === '참가자 목록' || title === '참여자 목록' ? '참가자' : title

    return (
        <section className="w-full mt-10">
            {/* 접이식 타이틀 */}
            <button
                type="button"
                onClick={() => setCollapsed((prev) => !prev)}
                className="flex w-full items-center justify-between"
            >
                <h2 className="text-3xl font-bold text-[#e8f4fd]">
                    {normalizedTitle}
                </h2>
                <ChevronDown
                    className={[
                        'h-6 w-6 text-[#6aadcc] transition-transform duration-200',
                        collapsed ? '-rotate-90' : '',
                    ].join(' ')}
                />
            </button>
            {/* 디바이더 */}
            <div className="mt-3 h-px w-full bg-gradient-to-r from-[#0596e8]/60 via-[#1e3a5f]/40 to-transparent" />
            {/* 콘텐츠 */}
            {!collapsed && (
                <div className="mt-4">
                    {hasDraftParticipants ? (
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4">
                            {participants.map((p) => (
                                <div
                                    key={p.id}
                                    className="flex w-full min-w-0 items-center justify-between gap-3 rounded-xl bg-[#062035] px-4 py-3"
                                >
                                    {p.avatarUrl !== null ? (
                                        <img
                                            src={p.avatarUrl}
                                            alt={p.name}
                                            className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-[#1e3a5f]"
                                        />
                                    ) : (
                                        <div className="h-14 w-14 shrink-0 rounded-full bg-[#041524] ring-2 ring-[#1e3a5f]" />
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="truncate pr-[2px] text-[17px] font-semibold text-[#e8f4fd]">
                                                {p.name}
                                            </span>
                                            {p.isPartner && (
                                                <img
                                                    src={partnerMark}
                                                    alt="파트너"
                                                    className="h-3.5 w-3.5 shrink-0"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    {p.position !== null ? (
                                        <div className="flex w-12 shrink-0 flex-col items-center gap-0.5">
                                            <img
                                                src={ROLE_IMG[p.position]}
                                                alt={p.position}
                                                className="h-8 w-8"
                                            />
                                            <span className="text-xs font-bold tracking-wide text-[#6aadcc]">
                                                {p.position}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="w-8 shrink-0" />
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : players.length === 0 ? (
                        <p className="text-base text-[#6aadcc]/60">
                            등록된 참여자가 없습니다.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4">
                            {players.map((player) => (
                                <div
                                    key={`${player.teamId}-${player.id}`}
                                    className="flex w-full min-w-0 items-center justify-between gap-3 rounded-xl bg-[#062035] px-4 py-3"
                                >
                                    {player.avatarUrl !== null ? (
                                        <img
                                            src={player.avatarUrl}
                                            alt={player.nickname ?? player.name}
                                            className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-[#1e3a5f]"
                                        />
                                    ) : (
                                        <div className="h-14 w-14 shrink-0 rounded-full bg-[#041524] ring-2 ring-[#1e3a5f]" />
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="truncate pr-[2px] text-[17px] font-semibold text-[#e8f4fd]">
                                                {player.nickname ?? player.name}
                                            </span>
                                            {player.isPartner && (
                                                <img
                                                    src={partnerMark}
                                                    alt="파트너"
                                                    className="h-3.5 w-3.5 shrink-0"
                                                />
                                            )}
                                        </div>
                                        <p className="mt-0.5 text-sm text-[#6aadcc]/70">
                                            {player.teamName}
                                        </p>
                                    </div>
                                    {(['TNK', 'DPS', 'SPT'] as const).includes(
                                        player.slot as OverwatchRole,
                                    ) ? (
                                        <div className="flex w-12 shrink-0 flex-col items-center gap-0.5">
                                            <img
                                                src={
                                                    ROLE_IMG[
                                                        player.slot as OverwatchRole
                                                    ]
                                                }
                                                alt={player.slot}
                                                className="h-8 w-8"
                                            />
                                            <span className="text-xs font-bold tracking-wide text-[#6aadcc]">
                                                {SLOT_LABEL[player.slot] ??
                                                    player.slot}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="w-8 shrink-0" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </section>
    )
}
