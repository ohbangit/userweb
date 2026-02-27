import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'
import partnerMark from '../../../assets/mark.png'
import tnkSrc from '../../../assets/tnk.svg'
import dpsSrc from '../../../assets/dps.svg'
import sptSrc from '../../../assets/spt.svg'
import type { OverwatchRole, TournamentTeam } from '../types'

interface Props {
    title: string
    teams: TournamentTeam[]
}

const ROLE_IMG: Record<OverwatchRole, string> = {
    TNK: tnkSrc,
    DPS: dpsSrc,
    SPT: sptSrc,
}

const ROLE_THEME: Record<
    OverwatchRole,
    { card: string; iconWrap: string; avatarRing: string }
> = {
    TNK: {
        card: 'ring-1 ring-sky-400/30',
        iconWrap: 'bg-sky-500/10 ring-1 ring-sky-400/40',
        avatarRing: 'ring-sky-500/40',
    },
    DPS: {
        card: 'ring-1 ring-rose-400/30',
        iconWrap: 'bg-rose-500/10 ring-1 ring-rose-400/40',
        avatarRing: 'ring-rose-500/40',
    },
    SPT: {
        card: 'ring-1 ring-emerald-400/30',
        iconWrap: 'bg-emerald-500/10 ring-1 ring-emerald-400/40',
        avatarRing: 'ring-emerald-500/40',
    },
}

const SLOT_LABEL: Record<string, string> = {
    TNK: '탱커',
    DPS: '딜러',
    SPT: '서포터',
    HEAD_COACH: '감독',
    COACH: '코치',
}

const PLAYER_SLOT_ORDER: Record<string, number> = {
    TNK: 0,
    DPS: 1,
    SPT: 2,
}

const STAFF_SLOT_ORDER: Record<string, number> = {
    HEAD_COACH: 0,
    COACH: 1,
}

function getMemberBroadcastUrl(member: {
    profileUrl: string | null
    channelId: string | null
}): string | null {
    if (member.profileUrl !== null && member.profileUrl.length > 0) {
        return member.profileUrl
    }
    if (member.channelId !== null && member.channelId.length > 0) {
        return `https://chzzk.naver.com/live/${member.channelId}`
    }
    return null
}

function MemberCardLink({
    href,
    className,
    children,
}: {
    href: string | null
    className: string
    children: ReactNode
}) {
    if (href === null) {
        return <div className={className}>{children}</div>
    }

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${className} transition-colors hover:bg-[#07304f]`}
        >
            {children}
        </a>
    )
}

export function TeamsPanelView({ title, teams }: Props) {
    const [collapsed, setCollapsed] = useState(true)

    return (
        <section className="w-full mt-10">
            <button
                type="button"
                onClick={() => setCollapsed((prev) => !prev)}
                className="flex w-full items-center justify-between cursor-pointer"
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

            {!collapsed && (
                <div className="mt-4">
                    {teams.length === 0 ? (
                        <p className="text-base text-[#6aadcc]/60">
                            등록된 팀이 없습니다.
                        </p>
                    ) : (
                        <div className="grid gap-3">
                            {teams.map((team) => (
                                <div
                                    key={team.id}
                                    className="w-full rounded-xl bg-[#062035] p-2.5"
                                >
                                    <div className="mb-2 flex items-center gap-2 rounded-lg bg-[#041524]/70 px-2 py-1.5 ring-1 ring-[#1e3a5f]/70">
                                        {team.logoUrl !== null && (
                                            <img
                                                src={team.logoUrl}
                                                alt={team.name}
                                                className="h-8 w-8 rounded-full object-cover ring-2 ring-[#1e3a5f]"
                                            />
                                        )}
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold tracking-[0.2em] text-[#0596e8]/80">
                                                TEAM
                                            </p>
                                            <span className="truncate pr-[2px] text-lg font-black text-[#e8f4fd] drop-shadow-[0_0_8px_rgba(5,150,232,0.35)]">
                                                {team.name}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex flex-wrap gap-1.5">
                                            {team.members
                                                .filter((member) =>
                                                    [
                                                        'TNK',
                                                        'DPS',
                                                        'SPT',
                                                    ].includes(member.slot),
                                                )
                                                .sort(
                                                    (a, b) =>
                                                        PLAYER_SLOT_ORDER[
                                                            a.slot
                                                        ] -
                                                        PLAYER_SLOT_ORDER[
                                                            b.slot
                                                        ],
                                                )
                                                .map((member) => (
                                                    <MemberCardLink
                                                        key={member.id}
                                                        href={getMemberBroadcastUrl(
                                                            member,
                                                        )}
                                                        className={`group relative flex min-w-0 flex-1 flex-col items-center gap-1.5 overflow-hidden rounded-lg bg-[#041524] px-2 py-1.5 sm:min-w-[120px] ${ROLE_THEME[member.slot as OverwatchRole].card}`}
                                                    >
                                                        <div className="pointer-events-none absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-[#0596e8]/80 to-transparent" />
                                                        <div
                                                            className={`flex h-6 w-6 items-center justify-center rounded-md ${ROLE_THEME[member.slot as OverwatchRole].iconWrap}`}
                                                        >
                                                            <img
                                                                src={
                                                                    ROLE_IMG[
                                                                        member.slot as OverwatchRole
                                                                    ]
                                                                }
                                                                alt={
                                                                    member.slot
                                                                }
                                                                className="h-4 w-4"
                                                            />
                                                        </div>
                                                        <div className="flex min-w-0 items-center gap-1.5">
                                                            {member.avatarUrl !==
                                                            null ? (
                                                                <img
                                                                    src={
                                                                        member.avatarUrl
                                                                    }
                                                                    alt={
                                                                        member.name
                                                                    }
                                                                    className={`h-7 w-7 shrink-0 rounded-full object-cover ring-2 ${ROLE_THEME[member.slot as OverwatchRole].avatarRing}`}
                                                                />
                                                            ) : (
                                                                <div className="h-7 w-7 shrink-0 rounded-full bg-[#062035] ring-2 ring-[#1e3a5f]" />
                                                            )}
                                                            <span className="truncate pr-[2px] text-sm font-semibold text-[#e8f4fd]">
                                                                {member.name}
                                                            </span>
                                                            {member.isPartner && (
                                                                <img
                                                                    src={
                                                                        partnerMark
                                                                    }
                                                                    alt="파트너"
                                                                    className="h-3 w-3 shrink-0"
                                                                />
                                                            )}
                                                        </div>
                                                    </MemberCardLink>
                                                ))}
                                        </div>

                                        {team.members.some((member) =>
                                            ['TNK', 'DPS', 'SPT'].includes(
                                                member.slot,
                                            ),
                                        ) &&
                                            team.members.some((member) =>
                                                [
                                                    'HEAD_COACH',
                                                    'COACH',
                                                ].includes(member.slot),
                                            ) && (
                                                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#1e3a5f]/70 to-transparent" />
                                            )}

                                        <div className="flex flex-wrap justify-center gap-1.5">
                                            {team.members
                                                .filter((member) =>
                                                    [
                                                        'HEAD_COACH',
                                                        'COACH',
                                                    ].includes(member.slot),
                                                )
                                                .sort(
                                                    (a, b) =>
                                                        STAFF_SLOT_ORDER[
                                                            a.slot
                                                        ] -
                                                        STAFF_SLOT_ORDER[
                                                            b.slot
                                                        ],
                                                )
                                                .map((member) => (
                                                    <MemberCardLink
                                                        key={member.id}
                                                        href={getMemberBroadcastUrl(
                                                            member,
                                                        )}
                                                        className="flex min-w-0 items-center justify-between gap-1.5 rounded-lg bg-[#041524] px-2 py-1.5 sm:min-w-[170px]"
                                                    >
                                                        <div className="flex min-w-0 items-center gap-2">
                                                            {member.avatarUrl !==
                                                            null ? (
                                                                <img
                                                                    src={
                                                                        member.avatarUrl
                                                                    }
                                                                    alt={
                                                                        member.name
                                                                    }
                                                                    className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-[#1e3a5f]"
                                                                />
                                                            ) : (
                                                                <div className="h-8 w-8 shrink-0 rounded-full bg-[#062035] ring-2 ring-[#1e3a5f]" />
                                                            )}
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="truncate pr-[2px] text-[13px] font-semibold text-[#e8f4fd]">
                                                                        {
                                                                            member.name
                                                                        }
                                                                    </span>
                                                                    {member.isPartner && (
                                                                        <img
                                                                            src={
                                                                                partnerMark
                                                                            }
                                                                            alt="파트너"
                                                                            className="h-3 w-3 shrink-0"
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className="shrink-0 rounded-full bg-[#062035] px-1.5 py-0.5 text-[10px] font-semibold text-[#6aadcc]">
                                                            {SLOT_LABEL[
                                                                member.slot
                                                            ] ?? member.slot}
                                                        </span>
                                                    </MemberCardLink>
                                                ))}
                                        </div>
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
