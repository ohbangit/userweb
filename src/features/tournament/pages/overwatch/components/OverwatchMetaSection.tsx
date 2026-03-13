import { Calendar, ExternalLink, CircleDot } from 'lucide-react'
import overwatchSrc from '../../../../../assets/overwatch.png'
import overwatchLogoSrc from '../../../../../assets/overwatch_logo.svg'
import type { OWMetaSectionViewModel } from '../types'

/** OverwatchMetaSection props */
interface OverwatchMetaSectionProps {
    meta: OWMetaSectionViewModel
}

type TournamentStatus = 'before' | 'ongoing' | 'ended'

/**
 * 대회 진행 상태를 계산합니다.
 * @param startDate 시작일 (nullable)
 * @param endDate 종료일 (nullable)
 */
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
        className: 'bg-white/[0.08] text-[#aab0b6]',
    },
    ongoing: {
        label: '진행중',
        className: 'bg-[#f99e1a]/15 text-[#f99e1a]',
        pulseClass: 'bg-[#f99e1a]',
    },
    ended: {
        label: '종료',
        className: 'bg-white/[0.06] text-[#6b7280]',
    },
}

/**
 * 오버워치 대회 히어로 섹션
 * 배너(순수 시각) + 메타 인포 패널(카드) 의 2단 레이아웃
 */
export function OverwatchMetaSection({ meta }: OverwatchMetaSectionProps) {
    const status = getTournamentStatus(meta.startDate, meta.endDate)
    const statusMeta = STATUS_META[status]
    const hasBanner = !!meta.bannerUrl

    return (
        <div>
            {/* ─── BANNER : 순수 시각 영역, 텍스트 없음 ─── */}
            <div
                className="relative h-[100px] w-full overflow-hidden md:h-[140px]"
                style={
                    hasBanner
                        ? {
                              backgroundImage: `url(${meta.bannerUrl})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center top',
                          }
                        : undefined
                }
            >
                {hasBanner && <div className="absolute inset-0 bg-gradient-to-b from-[#020d18]/60 via-[#020d18]/70 to-[#020d18]" />}
            </div>

            {/* ─── META PANEL : 배너 아래로 오버랩되는 인포 카드 ─── */}
            <div className="relative z-10 mx-auto -mt-8 max-w-5xl px-4 not-italic md:-mt-12">
                <div className="rounded-2xl border border-[#1e3a5f]/40 bg-gradient-to-b from-[#0c1e33]/50 to-[#060e1c]/60 p-5 backdrop-blur-md md:p-6">
                    {/* 헤더: 로고 좌측 / 상태 배지 우측 */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            <img src={overwatchSrc} alt="" aria-hidden="true" className="h-8 w-8 md:h-10 md:w-10" />
                            <img src={overwatchLogoSrc} alt="Overwatch" className="h-7 w-auto md:h-9" />
                        </div>
                        <span
                            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusMeta.className}`}
                        >
                            {statusMeta.pulseClass ? (
                                <span className="relative flex h-1.5 w-1.5">
                                    <span
                                        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${statusMeta.pulseClass}`}
                                    />
                                    <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${statusMeta.pulseClass}`} />
                                </span>
                            ) : (
                                <CircleDot className="h-3 w-3" />
                            )}
                            {statusMeta.label}
                        </span>
                    </div>

                    {/* 타이틀 */}
                    <h1 className="mt-3 font-koverwatch text-3xl font-black italic leading-tight text-white md:text-4xl xl:text-5xl">
                        {meta.title}
                    </h1>

                    {/* 날짜 + 태그 행 */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        {meta.dateLabel && (
                            <span className="flex items-center gap-1.5 text-xs text-[#aab0b6]">
                                <Calendar className="h-3.5 w-3.5 shrink-0" />
                                {meta.dateLabel}
                            </span>
                        )}
                        {meta.isChzzkSupport && (
                            <span className="rounded bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">치지직 제작지원</span>
                        )}
                        {meta.tags.map((tag) => (
                            <span key={tag} className="rounded bg-white/[0.07] px-2 py-0.5 text-xs text-[#aab0b6]">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* 링크 */}
                    {meta.links.length > 0 && (
                        <>
                            <div className="mt-5 h-px bg-white/[0.08]" />
                            <div className="mt-4 flex flex-wrap gap-2">
                                {meta.links.map((link) => (
                                    <a
                                        key={`${link.label}-${link.url}`}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white/[0.08] px-3 py-1.5 text-xs font-medium text-[#d1d5db] transition hover:bg-white/[0.15] hover:text-white"
                                    >
                                        <ExternalLink className="h-3 w-3 text-[#f99e1a]" />
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
