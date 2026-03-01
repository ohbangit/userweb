import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { PublicBanner } from '../hooks/usePublicBanners'

const TYPE_BADGE: Record<string, string> = {
    tournament: 'bg-amber-500/90 text-white',
    collab: 'bg-violet-500/90 text-white',
    content: 'bg-sky-500/90 text-white',
    내전: 'bg-rose-500/90 text-white',
}

const TYPE_LABEL: Record<string, string> = {
    tournament: '대회',
    collab: '콜라보',
    content: '콘텐츠',
    내전: '내전',
}

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
})

interface BannerCarouselProps {
    banners: PublicBanner[]
}

function getCardsPerView(width: number): number {
    if (width >= 1280) return 4
    if (width >= 640) return 2
    return 1
}

function parseDate(value: string): Date | null {
    const date = new Date(`${value}T00:00:00`)
    return Number.isNaN(date.getTime()) ? null : date
}

function isBannerEnded(banner: PublicBanner): boolean {
    if (banner.endedAt === null) return false
    const endedDate = new Date(`${banner.endedAt}T23:59:59`)
    if (Number.isNaN(endedDate.getTime())) return false
    return endedDate.getTime() < Date.now()
}

function formatScheduleText(banner: PublicBanner): string {
    if (isBannerEnded(banner)) return '종료됨'

    if (banner.startedAt !== null && banner.endedAt !== null) {
        const startDate = parseDate(banner.startedAt)
        const endDate = parseDate(banner.endedAt)
        if (startDate !== null && endDate !== null) {
            return `${dateFormatter.format(startDate)} - ${dateFormatter.format(endDate)}`
        }
    }

    if (banner.startedAt !== null) {
        const startDate = parseDate(banner.startedAt)
        if (startDate !== null) return `${dateFormatter.format(startDate)} 시작`
    }

    if (banner.endedAt !== null) {
        const endDate = parseDate(banner.endedAt)
        if (endDate !== null) return `${dateFormatter.format(endDate)}까지`
    }

    return '일정 미정'
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
    const navigate = useNavigate()
    const trackRef = useRef<HTMLDivElement | null>(null)
    const itemRefs = useRef<Array<HTMLElement | null>>([])
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const touchStartXRef = useRef<number | null>(null)
    const [paused, setPaused] = useState(false)
    const [cardsPerView, setCardsPerView] = useState(() =>
        getCardsPerView(window.innerWidth),
    )
    const [currentIndex, setCurrentIndex] = useState(0)
    const [largeImageIds, setLargeImageIds] = useState<Record<number, boolean>>(
        {},
    )

    const total = banners.length
    const maxStartIndex = Math.max(0, total - cardsPerView)

    const pageCount = useMemo(
        () => Math.max(1, Math.ceil(total / cardsPerView)),
        [total, cardsPerView],
    )

    useEffect(() => {
        const handleResize = () => {
            setCardsPerView(getCardsPerView(window.innerWidth))
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        setCurrentIndex((prev) => Math.min(prev, maxStartIndex))
    }, [maxStartIndex])

    const scrollToIndex = useCallback((index: number) => {
        const target = itemRefs.current[index]
        if (target === null || target === undefined) return
        target.scrollIntoView({
            behavior: 'smooth',
            inline: 'start',
            block: 'nearest',
        })
    }, [])

    const goNext = useCallback(() => {
        if (total === 0) return
        const next = currentIndex + cardsPerView
        const nextIndex = next > maxStartIndex ? 0 : next
        setCurrentIndex(nextIndex)
        scrollToIndex(nextIndex)
    }, [cardsPerView, currentIndex, maxStartIndex, scrollToIndex, total])

    const goPrev = useCallback(() => {
        if (total === 0) return
        const prev = currentIndex - cardsPerView
        const prevIndex = prev < 0 ? maxStartIndex : prev
        setCurrentIndex(prevIndex)
        scrollToIndex(prevIndex)
    }, [cardsPerView, currentIndex, maxStartIndex, scrollToIndex, total])

    useEffect(() => {
        if (paused || total <= cardsPerView) return
        timerRef.current = setInterval(() => {
            goNext()
        }, 4000)
        return () => {
            if (timerRef.current !== null) clearInterval(timerRef.current)
        }
    }, [cardsPerView, goNext, paused, total])

    const handleTouchStart = useCallback(
        (e: React.TouchEvent<HTMLDivElement>) => {
            touchStartXRef.current = e.touches[0].clientX
        },
        [],
    )

    const handleTouchEnd = useCallback(
        (e: React.TouchEvent<HTMLDivElement>) => {
            if (touchStartXRef.current === null) return
            const deltaX =
                touchStartXRef.current - e.changedTouches[0].clientX
            touchStartXRef.current = null
            if (Math.abs(deltaX) < 40) return
            if (deltaX > 0) {
                goNext()
            } else {
                goPrev()
            }
        },
        [goNext, goPrev],
    )

    if (total === 0) return null

    function handleBannerClick(linkUrl: string | null): void {
        if (linkUrl === null || linkUrl.length === 0) return
        if (linkUrl.startsWith('http://') || linkUrl.startsWith('https://')) {
            window.open(linkUrl, '_blank', 'noopener,noreferrer')
            return
        }
        navigate(linkUrl)
    }

    function handleImageLoad(id: number, image: HTMLImageElement): void {
        const isLarge = image.naturalWidth >= 960 || image.naturalHeight >= 540
        setLargeImageIds((prev) => {
            if (prev[id] === isLarge) return prev
            return { ...prev, [id]: isLarge }
        })
    }

    return (
        <section
            className="group relative space-y-2"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div
                ref={trackRef}
                className="grid snap-x snap-mandatory grid-flow-col auto-cols-[100%] gap-2 overflow-x-hidden sm:auto-cols-[calc((100%-0.5rem)/2)] sm:gap-3 xl:auto-cols-[calc((100%-2.25rem)/4)]"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {banners.map((banner, index) => {
                    const badgeClass =
                        TYPE_BADGE[banner.type] ?? 'bg-primary/90 text-white'
                    const typeLabel = TYPE_LABEL[banner.type] ?? banner.type
                    const scheduleText = formatScheduleText(banner)
                    const ended = isBannerEnded(banner)
                    const useDiagonalDetail = largeImageIds[banner.id] === true

                    return (
                        <article
                            key={banner.id}
                            ref={(element) => {
                                itemRefs.current[index] = element
                            }}
                            className="relative h-[90px] snap-start overflow-hidden rounded-xl border border-border/50"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    handleBannerClick(banner.linkUrl)
                                }
                                className="group relative h-full w-full cursor-pointer text-left"
                            >
                                <img
                                    src={banner.imageUrl}
                                    alt={banner.title}
                                    className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                                    onLoad={(event) => {
                                        handleImageLoad(
                                            banner.id,
                                            event.currentTarget,
                                        )
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-black/72 via-black/50 to-black/22" />
                                {useDiagonalDetail && (
                                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.32)_0%,rgba(255,255,255,0)_28%,rgba(0,0,0,0.36)_100%)]" />
                                )}

                                <div className="relative z-10 flex h-full flex-col justify-between py-2.5 pl-4 pr-2.5">
                                    <div className="flex min-w-0 flex-col gap-1">
                                        <p className="truncate text-[18px] font-extrabold leading-tight tracking-tight text-white">
                                            {banner.title}
                                        </p>
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="truncate text-[11px] text-white/90">
                                                {banner.description?.trim().length
                                                    ? banner.description
                                                    : '주요 콘텐츠 안내'}
                                            </p>
                                            <span
                                                className={[
                                                    'shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold',
                                                    badgeClass,
                                                ].join(' ')}
                                            >
                                                {typeLabel}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span
                                            className={[
                                                'truncate text-[11px] font-semibold',
                                                ended
                                                    ? 'text-rose-300'
                                                    : 'text-white',
                                            ].join(' ')}
                                        >
                                            {scheduleText}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        </article>
                    )
                })}
            </div>

            {cardsPerView > 1 && total > cardsPerView && (
                <>
                    <button
                        type="button"
                        onClick={goPrev}
                        className="pointer-events-none absolute left-1 top-[45px] z-20 -translate-y-1/2 cursor-pointer rounded-full bg-black/55 p-1.5 text-white opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100 hover:bg-black/70"
                        aria-label="이전 배너"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={goNext}
                        className="pointer-events-none absolute right-1 top-[45px] z-20 -translate-y-1/2 cursor-pointer rounded-full bg-black/55 p-1.5 text-white opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100 hover:bg-black/70"
                        aria-label="다음 배너"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </>
            )}

            <div
                className={[
                    'justify-center py-1',
                    cardsPerView === 1 && total > 1 ? 'flex' : 'hidden',
                ].join(' ')}
            >
                <div className="flex items-center gap-1.5">
                    {Array.from({ length: pageCount }).map((_, pageIndex) => {
                        const activePage = Math.floor(
                            currentIndex / cardsPerView,
                        )
                        const isActive = activePage === pageIndex
                        return (
                            <button
                                key={pageIndex}
                                type="button"
                                onClick={() => {
                                    const nextIndex = Math.min(
                                        pageIndex * cardsPerView,
                                        maxStartIndex,
                                    )
                                    setCurrentIndex(nextIndex)
                                    scrollToIndex(nextIndex)
                                }}
                                className={[
                                    'h-1.5 cursor-pointer rounded-full transition-all',
                                    isActive
                                        ? 'w-4 bg-primary'
                                        : 'w-1.5 bg-border hover:bg-text-dim',
                                ].join(' ')}
                                aria-label={`배너 페이지 ${pageIndex + 1}`}
                            />
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
