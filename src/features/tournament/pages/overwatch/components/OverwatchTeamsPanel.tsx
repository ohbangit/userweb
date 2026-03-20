import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import tnkIcon from '../../../../../assets/tnk.svg'
import dpsIcon from '../../../../../assets/dps.svg'
import sptIcon from '../../../../../assets/spt.svg'
import partnerMark from '../../../../../assets/mark.png'
import { useOWTournamentTeams } from '../hooks/useOWTournamentTeams'
import type { OWTeamMemberPublicItem, OWTeamMemberSlot, OWTeamPublicItem } from '../types'

const SLOT_ORDER: Record<OWTeamMemberSlot, number> = {
    TNK: 0,
    DPS: 1,
    SPT: 2,
    HEAD_COACH: 3,
    COACH: 4,
}

const SLOT_META: Record<string, { icon: string; label: string; color: string }> = {
    TNK: { icon: tnkIcon, label: 'TANK', color: '#3b82f6' },
    DPS: { icon: dpsIcon, label: 'DPS', color: '#ef4444' },
    SPT: { icon: sptIcon, label: 'SPT', color: '#22c55e' },
    HEAD_COACH: { icon: '', label: '감독', color: '#a78bfa' },
    COACH: { icon: '', label: '코치', color: '#8b5cf6' },
}

const PLAYER_SLOTS = new Set<string>(['TNK', 'DPS', 'SPT'])
const TEAM_ACCENT_COLORS = ['#f99e1a', '#0596e8', '#22c55e', '#ef4444']

function sortMembers(members: OWTeamMemberPublicItem[]): OWTeamMemberPublicItem[] {
    return [...members].sort((a, b) => {
        const slotDiff = (SLOT_ORDER[a.slot as OWTeamMemberSlot] ?? 99) - (SLOT_ORDER[b.slot as OWTeamMemberSlot] ?? 99)
        if (slotDiff !== 0) return slotDiff
        if (a.isCaptain && !b.isCaptain) return -1
        if (!a.isCaptain && b.isCaptain) return 1
        return 0
    })
}

function splitMembers(members: OWTeamMemberPublicItem[]) {
    const sorted = sortMembers(members)
    return {
        players: sorted.filter((m) => PLAYER_SLOTS.has(m.slot)),
        staff: sorted.filter((m) => !PLAYER_SLOTS.has(m.slot)),
    }
}

function MemberLink({ member, className, children }: { member: OWTeamMemberPublicItem; className?: string; children: React.ReactNode }) {
    if (member.channelId) {
        return (
            <a
                href={`https://chzzk.naver.com/${member.channelId}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`group cursor-pointer ${className ?? ''}`}
                aria-label={`${member.name} 치지직 채널 열기`}
            >
                {children}
            </a>
        )
    }
    return <div className={className}>{children}</div>
}

const HEX_CLIP = 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)'

function Avatar({
    url,
    name,
    size,
    hexagon,
    borderColor,
}: {
    url: string | null
    name: string
    size: number
    hexagon?: boolean
    borderColor?: string
}) {
    const px = `${size}px`

    if (hexagon) {
        const aura = borderColor ?? 'rgba(255,255,255,0.15)'
        const border = 2
        const outerSize = size + border * 2
        const outerPx = `${outerSize}px`
        return (
            <div className="relative shrink-0" style={{ width: outerPx, height: outerPx }}>
                <div
                    className="absolute -inset-1.5 rounded-full blur-[10px]"
                    style={{ background: `radial-gradient(circle, ${aura} 0%, ${aura}80 35%, transparent 65%)` }}
                />
                <div
                    className="relative"
                    style={{
                        width: outerPx,
                        height: outerPx,
                        clipPath: HEX_CLIP,
                        background: `linear-gradient(to bottom, ${aura}, ${aura}60)`,
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

    return (
        <div className="shrink-0 overflow-hidden rounded-full bg-white/[0.06]" style={{ width: px, height: px }}>
            {url ? (
                <img src={url} alt={name} className="h-full w-full object-cover" loading="lazy" />
            ) : (
                <span className="flex h-full w-full items-center justify-center text-xs font-bold text-[#4b5563]">{name.slice(0, 1)}</span>
            )}
        </div>
    )
}

function SlotBadge({ slot }: { slot: string }) {
    const meta = SLOT_META[slot]
    if (!meta) return null
    return (
        <span
            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
            style={{ backgroundColor: `${meta.color}20`, color: meta.color }}
        >
            {meta.icon && <img src={meta.icon} alt={meta.label} className="h-3 w-3" />}
            {meta.label}
        </span>
    )
}

function useHorizontalScroll() {
    const ref = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    const updateScroll = useCallback(() => {
        const el = ref.current
        if (!el) return
        setCanScrollLeft(el.scrollLeft > 4)
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
    }, [])

    useEffect(() => {
        const el = ref.current
        if (!el) return
        updateScroll()
        el.addEventListener('scroll', updateScroll, { passive: true })
        const observer = new ResizeObserver(updateScroll)
        observer.observe(el)
        return () => {
            el.removeEventListener('scroll', updateScroll)
            observer.disconnect()
        }
    }, [updateScroll])

    const scrollBy = useCallback((dir: 'left' | 'right') => {
        ref.current?.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' })
    }, [])

    return { ref, canScrollLeft, canScrollRight, scrollBy }
}

function ScrollContainer({ children }: { children: React.ReactNode }) {
    const { ref, canScrollLeft, canScrollRight, scrollBy } = useHorizontalScroll()

    return (
        <div className="relative">
            <div
                className={`pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-[#0a1929] to-transparent transition-opacity duration-200 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}
            />
            <button
                type="button"
                onClick={() => scrollBy('left')}
                className={`absolute left-1 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-white/[0.1] p-1.5 text-white/60 backdrop-blur-sm transition-all hover:bg-white/[0.2] hover:text-white ${canScrollLeft ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                aria-label="왼쪽으로 스크롤"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>

            <div ref={ref} className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                {children}
            </div>

            <button
                type="button"
                onClick={() => scrollBy('right')}
                className={`absolute right-1 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-white/[0.1] p-1.5 text-white/60 backdrop-blur-sm transition-all hover:bg-white/[0.2] hover:text-white ${canScrollRight ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                aria-label="오른쪽으로 스크롤"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
            <div
                className={`pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-[#0a1929] to-transparent transition-opacity duration-200 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}
            />
        </div>
    )
}

function TeamCard({ team, index }: { team: OWTeamPublicItem; index: number }) {
    const { players, staff } = useMemo(() => splitMembers(team.members), [team.members])
    const accent = TEAM_ACCENT_COLORS[index % TEAM_ACCENT_COLORS.length]

    return (
        <div className="w-[270px] shrink-0 overflow-hidden rounded-xl border-l-[3px] bg-white/[0.03]" style={{ borderLeftColor: accent }}>
            <div
                className="flex items-center gap-3 px-4 py-2.5"
                style={{ background: `linear-gradient(135deg, ${accent}20, transparent 60%)` }}
            >
                <h4 className="text-sm font-bold tracking-wide text-[#eef0f3]">{team.name}</h4>
            </div>

            <div className="space-y-2 px-3 py-3">
                {(['TNK', 'DPS', 'SPT'] as const).map((slot) => {
                    const group = players.filter((m) => m.slot === slot)
                    if (group.length === 0) return null
                    return (
                        <div key={slot} className="flex justify-center gap-3">
                            {group.map((member) => (
                                <MemberLink
                                    key={member.id}
                                    member={member}
                                    className="relative flex w-[80px] flex-col items-center gap-0.5 rounded-lg py-2 transition-colors hover:bg-white/[0.06]"
                                >
                                    {SLOT_META[member.slot]?.icon && (
                                        <div
                                            className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full"
                                            style={{ backgroundColor: `${SLOT_META[member.slot].color}30` }}
                                        >
                                            <img src={SLOT_META[member.slot].icon} alt={SLOT_META[member.slot].label} className="h-3 w-3" />
                                        </div>
                                    )}
                                    <Avatar
                                        url={member.avatarUrl}
                                        name={member.name}
                                        size={40}
                                        hexagon
                                        borderColor={SLOT_META[member.slot]?.color}
                                    />
                                    <div className="flex items-center gap-1">
                                        <span className="max-w-[72px] truncate pr-1 text-[11px] italic text-[#d1d5db] transition-colors group-hover:text-white">
                                            {member.name}
                                        </span>
                                        {member.isPartner && (
                                            <img src={partnerMark} alt="파트너" className="h-3 w-3 shrink-0" loading="lazy" />
                                        )}
                                    </div>
                                </MemberLink>
                            ))}
                        </div>
                    )
                })}
            </div>

            {staff.length > 0 && (
                <div className="border-t border-white/[0.06] px-3 py-2.5">
                    <div className="space-y-1.5">
                        {staff.map((member) => (
                            <MemberLink
                                key={member.id}
                                member={member}
                                className="flex items-center gap-2 rounded-md px-1 py-0.5 transition-colors hover:bg-white/[0.06]"
                            >
                                <Avatar url={member.avatarUrl} name={member.name} size={22} />
                                <span className="min-w-0 truncate text-[11px] text-[#9ca3af] transition-colors group-hover:text-white">
                                    {member.name}
                                </span>
                                <SlotBadge slot={member.slot} />
                            </MemberLink>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

/* ──────────────── 메인 컴포넌트 ──────────────── */

export function OverwatchTeamsPanel() {
    const { data, isLoading, error } = useOWTournamentTeams()
    const teams = data?.teams ?? []

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-[#6b7280]" />
            </div>
        )
    }

    if (error instanceof Error) {
        return <div className="py-10 text-center text-sm text-[#ff8f8f]">팀 정보를 불러오지 못했습니다.</div>
    }

    if (teams.length === 0) {
        return <div className="py-10 text-center text-sm text-[#6b7280]">등록된 팀이 없습니다.</div>
    }

    return (
        <ScrollContainer>
            {teams.map((team, i) => (
                <TeamCard key={team.id} team={team} index={i} />
            ))}
        </ScrollContainer>
    )
}
