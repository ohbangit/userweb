import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Crown } from 'lucide-react'
import type { ReactNode } from 'react'
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
    channelId: string | null
    position: OverwatchRole | null
    avatarUrl: string | null
    isPartner: boolean
    isCaptain: boolean
}

interface Props {
    title: string
    teams: TournamentTeam[]
    participants?: DraftParticipantPreview[]
}

function getBroadcastUrl(member: { profileUrl?: string | null; channelId?: string | null }): string | null {
    if (member.profileUrl !== undefined && member.profileUrl !== null && member.profileUrl.length > 0) {
        return member.profileUrl
    }
    if (member.channelId !== undefined && member.channelId !== null && member.channelId.length > 0) {
        return `https://chzzk.naver.com/live/${member.channelId}`
    }
    return null
}

function AvatarLink({ href, label, children }: { href: string | null; label: string; children: ReactNode }) {
    if (href === null) {
        return <>{children}</>
    }

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer rounded-full transition hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#59b5df]/70"
            aria-label={label}
            title="방송국으로 이동"
        >
            {children}
        </a>
    )
}

export function PlayerListPanelView({ title, teams, participants = [] }: Props) {
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
        .filter((member) => member.slot !== 'HEAD_COACH' && member.slot !== 'COACH')

    const hasDraftParticipants = participants.length > 0
    const normalizedTitle = title === '참가자 목록' || title === '참여자 목록' ? '참가자' : title

    return (
        <section className="w-full mt-10">
            {/* 접이식 타이틀 */}
            <button type="button" onClick={() => setCollapsed((prev) => !prev)} className="flex w-full items-center justify-between">
                <h2 className="text-3xl font-bold text-[#e8f4fd]">{normalizedTitle}</h2>
                <ChevronDown
                    className={['h-6 w-6 text-[#6aadcc] transition-transform duration-200', collapsed ? '-rotate-90' : ''].join(' ')}
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
                                <div key={p.id} className="relative w-full min-w-0 rounded-xl bg-[#062035] px-3 py-3 sm:px-4">
                                    {p.isCaptain && (
                                        <span className="absolute left-1.5 top-1.5 z-10 inline-flex items-center justify-center rounded-md bg-[#041524]/80 p-1 ring-1 ring-amber-400/50">
                                            <Crown className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                        </span>
                                    )}
                                    <div className="flex items-stretch justify-between gap-2 sm:hidden">
                                        <div className="flex min-w-0 flex-1 flex-col items-center gap-2 rounded-md bg-[#041524]/70 px-2 py-2 ring-1 ring-[#1e3a5f]">
                                            <AvatarLink
                                                href={getBroadcastUrl({ channelId: p.channelId })}
                                                label={`${p.name} 방송국으로 이동`}
                                            >
                                                {p.avatarUrl !== null ? (
                                                    <img
                                                        src={p.avatarUrl}
                                                        alt={p.name}
                                                        className="h-14 w-14 rounded-full object-cover ring-2 ring-[#1e3a5f]"
                                                    />
                                                ) : (
                                                    <div className="h-14 w-14 rounded-full bg-[#041524] ring-2 ring-[#1e3a5f]" />
                                                )}
                                            </AvatarLink>
                                            <div className="flex w-full min-w-0 items-center justify-center gap-1.5">
                                                <span className="truncate pr-[2px] text-center text-[15px] font-semibold text-[#e8f4fd]">
                                                    {p.name}
                                                </span>
                                                {p.isPartner && <img src={partnerMark} alt="파트너" className="h-3.5 w-3.5 shrink-0" />}
                                            </div>
                                        </div>

                                        {p.position !== null ? (
                                            <div className="flex w-12 shrink-0 flex-col items-center justify-center gap-0.5 px-1 py-1">
                                                <img src={ROLE_IMG[p.position]} alt={p.position} className="h-5 w-5" />
                                                <span className="text-[10px] font-bold tracking-wide text-[#6aadcc]">{p.position}</span>
                                            </div>
                                        ) : (
                                            <div className="w-12 shrink-0" />
                                        )}
                                    </div>

                                    <div className="hidden w-full items-center justify-between gap-3 sm:flex">
                                        <AvatarLink href={getBroadcastUrl({ channelId: p.channelId })} label={`${p.name} 방송국으로 이동`}>
                                            {p.avatarUrl !== null ? (
                                                <img
                                                    src={p.avatarUrl}
                                                    alt={p.name}
                                                    className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-[#1e3a5f]"
                                                />
                                            ) : (
                                                <div className="h-14 w-14 shrink-0 rounded-full bg-[#041524] ring-2 ring-[#1e3a5f]" />
                                            )}
                                        </AvatarLink>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className="truncate pr-[2px] text-[17px] font-semibold text-[#e8f4fd]">{p.name}</span>
                                                {p.isPartner && <img src={partnerMark} alt="파트너" className="h-3.5 w-3.5 shrink-0" />}
                                            </div>
                                        </div>
                                        {p.position !== null ? (
                                            <div className="flex w-12 shrink-0 flex-col items-center gap-0.5">
                                                <img src={ROLE_IMG[p.position]} alt={p.position} className="h-8 w-8" />
                                                <span className="text-xs font-bold tracking-wide text-[#6aadcc]">{p.position}</span>
                                            </div>
                                        ) : (
                                            <div className="w-8 shrink-0" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : players.length === 0 ? (
                        <p className="text-base text-[#6aadcc]/60">등록된 참여자가 없습니다.</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4">
                            {players.map((player) => (
                                <div
                                    key={`${player.teamId}-${player.id}`}
                                    className="relative w-full min-w-0 rounded-xl bg-[#062035] px-3 py-3 sm:px-4"
                                >
                                    {player.isCaptain && (
                                        <span className="absolute left-1.5 top-1.5 z-10 inline-flex items-center justify-center rounded-md bg-[#041524]/80 p-1 ring-1 ring-amber-400/50">
                                            <Crown className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                        </span>
                                    )}
                                    <div className="flex items-stretch justify-between gap-2 sm:hidden">
                                        <div className="flex min-w-0 flex-1 flex-col items-center gap-2 rounded-md bg-[#041524]/70 px-2 py-2 ring-1 ring-[#1e3a5f]">
                                            <AvatarLink
                                                href={getBroadcastUrl({
                                                    channelId: player.channelId,
                                                    profileUrl: player.profileUrl,
                                                })}
                                                label={`${player.nickname ?? player.name} 방송국으로 이동`}
                                            >
                                                {player.avatarUrl !== null ? (
                                                    <img
                                                        src={player.avatarUrl}
                                                        alt={player.nickname ?? player.name}
                                                        className="h-14 w-14 rounded-full object-cover ring-2 ring-[#1e3a5f]"
                                                    />
                                                ) : (
                                                    <div className="h-14 w-14 rounded-full bg-[#041524] ring-2 ring-[#1e3a5f]" />
                                                )}
                                            </AvatarLink>
                                            <div className="flex w-full min-w-0 items-center justify-center gap-1.5">
                                                <span className="truncate pr-[2px] text-center text-[15px] font-semibold text-[#e8f4fd]">
                                                    {player.nickname ?? player.name}
                                                </span>
                                                {player.isPartner && (
                                                    <img src={partnerMark} alt="파트너" className="h-3.5 w-3.5 shrink-0" />
                                                )}
                                            </div>
                                        </div>

                                        {(['TNK', 'DPS', 'SPT'] as const).includes(player.slot as OverwatchRole) ? (
                                            <div className="flex w-12 shrink-0 flex-col items-center justify-center gap-0.5 px-1 py-1">
                                                <img src={ROLE_IMG[player.slot as OverwatchRole]} alt={player.slot} className="h-5 w-5" />
                                                <span className="text-[10px] font-bold tracking-wide text-[#6aadcc]">
                                                    {SLOT_LABEL[player.slot] ?? player.slot}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="w-12 shrink-0" />
                                        )}
                                    </div>

                                    <div className="hidden w-full items-center justify-between gap-3 sm:flex">
                                        <AvatarLink
                                            href={getBroadcastUrl({
                                                channelId: player.channelId,
                                                profileUrl: player.profileUrl,
                                            })}
                                            label={`${player.nickname ?? player.name} 방송국으로 이동`}
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
                                        </AvatarLink>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className="truncate pr-[2px] text-[17px] font-semibold text-[#e8f4fd]">
                                                    {player.nickname ?? player.name}
                                                </span>
                                                {player.isPartner && (
                                                    <img src={partnerMark} alt="파트너" className="h-3.5 w-3.5 shrink-0" />
                                                )}
                                            </div>
                                            <p className="mt-0.5 text-sm text-[#6aadcc]/70">{player.teamName}</p>
                                        </div>
                                        {(['TNK', 'DPS', 'SPT'] as const).includes(player.slot as OverwatchRole) ? (
                                            <div className="flex w-12 shrink-0 flex-col items-center gap-0.5">
                                                <img src={ROLE_IMG[player.slot as OverwatchRole]} alt={player.slot} className="h-8 w-8" />
                                                <span className="text-xs font-bold tracking-wide text-[#6aadcc]">
                                                    {SLOT_LABEL[player.slot] ?? player.slot}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="w-8 shrink-0" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </section>
    )
}
