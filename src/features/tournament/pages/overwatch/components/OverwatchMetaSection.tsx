import { CalendarDays, ExternalLink, Radio, Crown, Mic2, CircleDot } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import overwatchSrc from '../../../../../assets/overwatch.png'
import overwatchLogoSrc from '../../../../../assets/overwatch_logo.svg'
import partnerMark from '../../../../../assets/mark.png'
import type { OWMetaSectionViewModel, OWStaffPublicItem } from '../types'

interface OverwatchMetaSectionProps {
    meta: OWMetaSectionViewModel
}

function PartnerBadge() {
    return (
        <span className="inline-flex items-center" aria-label="파트너 스트리머" title="파트너 스트리머">
            <img src={partnerMark} alt="파트너" className="h-3.5 w-3.5" loading="lazy" />
        </span>
    )
}

type TournamentStatus = 'before' | 'ongoing' | 'ended'

function getTournamentStatus(startDate: string | null, endDate: string | null): TournamentStatus {
    const now = new Date()

    if (endDate) {
        const ended = new Date(endDate)
        ended.setHours(23, 59, 59, 999)

        if (ended < now) return 'ended'
    }

    if (startDate) {
        const started = new Date(startDate)
        started.setHours(0, 0, 0, 0)

        if (started <= now) return 'ongoing'
    }

    return 'before'
}

const STATUS_META: Record<TournamentStatus, { label: string; className: string; pulseClass?: string }> = {
    before: {
        label: '진행전',
        className: 'border-[#31526f] bg-[#07192a]/80 text-[#9cc7e2]',
    },
    ongoing: {
        label: '진행중',
        className: 'border-[#f99e1a]/45 bg-[#f99e1a]/12 text-[#ffd89c]',
        pulseClass: 'bg-[#f99e1a]',
    },
    ended: {
        label: '종료',
        className: 'border-[#1e3a5f] bg-[#0596e8]/10 text-[#9fd4f5]',
    },
}

function StaffItem({ item }: { item: OWStaffPublicItem }) {
    const avatar = (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0b2235] text-xs font-semibold text-[#d9ecf8] ring-2 ring-[#1e3a5f]">
            {item.avatarUrl ? (
                <img src={item.avatarUrl} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
            ) : (
                <span>{item.name.slice(0, 1)}</span>
            )}
        </div>
    )

    const content = (
        <div className="flex min-w-0 items-center gap-2">
            {avatar}
            <span className="truncate text-sm font-semibold text-white transition-colors group-hover:text-[#9fd4f5]">{item.name}</span>
            {item.isPartner && <PartnerBadge />}
        </div>
    )

    if (item.channelId) {
        return (
            <a
                href={`https://chzzk.naver.com/${item.channelId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-w-0 cursor-pointer"
                aria-label={`${item.name} 치지직 채널 열기`}
            >
                {content}
            </a>
        )
    }

    return <div className="inline-flex min-w-0">{content}</div>
}

function GroupBlock({ icon: Icon, label, items }: { icon: LucideIcon; label: string; items: OWStaffPublicItem[] }) {
    if (items.length === 0) return null

    return (
        <section className="pt-4 first:border-t-0 first:pt-0">
            <div className="flex flex-col gap-2.5 md:flex-row md:items-start md:gap-3">
                <div className="flex shrink-0 items-center gap-1.5 text-[#59b3ff] md:w-28 md:pt-1">
                    <Icon className="h-4 w-4 shrink-0 text-[#59b3ff]" strokeWidth={2.2} />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8fcdf3]">{label}</span>
                </div>
                <div className="flex min-w-0 flex-1 flex-wrap gap-x-4 gap-y-2.5">
                    {items.map((item) => (
                        <StaffItem key={`${label}-${item.streamerId ?? item.name}`} item={item} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export function OverwatchMetaSection({ meta }: OverwatchMetaSectionProps) {
    const status = getTournamentStatus(meta.startDate, meta.endDate)
    const statusMeta = STATUS_META[status]
    const hasBanner = !!meta.bannerUrl

    return (
        <section className="relative overflow-hidden rounded-[36px] bg-[#03111d] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            {hasBanner ? (
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${meta.bannerUrl})` }} />
            ) : null}
            <div
                className={[
                    'absolute inset-0',
                    hasBanner
                        ? 'bg-gradient-to-b from-[#020d18]/30 via-[#020d18]/72 to-[#020d18]'
                        : 'bg-[radial-gradient(circle_at_top,_rgba(249,158,26,0.16),_transparent_24%),linear-gradient(135deg,#04192b_0%,#03111d_45%,#020d18_100%)]',
                ].join(' ')}
            />
            <div className="absolute -right-16 top-0 h-48 w-48 rounded-full bg-[#f99e1a]/12 blur-3xl" />
            <div className="absolute -left-12 bottom-0 h-44 w-44 rounded-full bg-[#2e95d3]/12 blur-3xl" />

            <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-8 pt-2 md:pb-10">
                {/*메타*/}
                <div>
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#f99e1a]/35 bg-[#f99e1a]/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.24em] text-[#ffd08a]">
                            <img src={overwatchSrc} alt="" aria-hidden="true" className="h-3.5 w-3.5" />
                            Overwatch
                        </span>
                        {meta.isChzzkSupport ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#00dc82]/35 bg-[#00dc82]/12 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-[#7cf0b8]">
                                <span className="h-2 w-2 rounded-full bg-[#00dc82]" />
                                치지직 제작지원
                            </span>
                        ) : null}
                        {meta.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full border border-[#294a64] bg-[#061a2a]/78 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#9fd4f5] backdrop-blur-sm"
                            >
                                {tag}
                            </span>
                        ))}
                        <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] ${statusMeta.className}`}
                        >
                            {statusMeta.pulseClass ? (
                                <span className="relative flex h-2 w-2">
                                    <span
                                        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${statusMeta.pulseClass}`}
                                    />
                                    <span className={`relative inline-flex h-2 w-2 rounded-full ${statusMeta.pulseClass}`} />
                                </span>
                            ) : (
                                <CircleDot className="h-3.5 w-3.5" />
                            )}
                            {statusMeta.label}
                        </span>
                    </div>

                    {/*로고*/}
                    <div className="mt-1">
                        <img src={overwatchLogoSrc} alt="Overwatch" className="h-12 w-auto drop-shadow-lg md:h-16" />
                    </div>

                    {/*타이틀*/}
                    <h1 className="mt-3 font-koverwatch text-3xl font-black leading-[0.95] text-white drop-shadow-lg md:text-5xl xl:text-6xl">
                        {meta.title}
                    </h1>

                    {/*일정*/}
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#6aadcc]">
                        {meta.dateLabel ? (
                            <span className="inline-flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-[#f99e1a]" />
                                {meta.dateLabel}
                            </span>
                        ) : null}
                    </div>
                </div>

                <div className="mt-6 h-px w-full bg-gradient-to-r from-[#6fb7e6]/70 via-[#3978a6]/40 to-transparent" />

                <div className="mt-4 space-y-4 md:space-y-3">
                    <GroupBlock icon={Crown} label="주최" items={meta.groups.find((group) => group.id === 'hosts')?.items ?? []} />
                    <GroupBlock icon={Radio} label="중계" items={meta.groups.find((group) => group.id === 'broadcasters')?.items ?? []} />
                    <GroupBlock icon={Mic2} label="해설" items={meta.groups.find((group) => group.id === 'commentators')?.items ?? []} />
                </div>

                {meta.links.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2.5">
                        {meta.links.map((link) => (
                            <a
                                key={`${link.label}-${link.url}`}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#31526f] bg-[#071a2a]/82 px-2.5 py-1 text-xs font-semibold text-[#eaf6fd] backdrop-blur-sm transition hover:border-[#f99e1a] hover:bg-[#0b2235] hover:text-white"
                            >
                                <ExternalLink className="h-3.5 w-3.5 text-[#f99e1a]" />
                                {link.label}
                            </a>
                        ))}
                    </div>
                ) : null}
            </div>
        </section>
    )
}
