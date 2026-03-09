import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { trackEvent } from '../../../utils/analytics'
import { cn } from '../../../lib/cn'
import type { BannerCarouselProps, PublicBanner } from '../types'
import { BannerCard } from './BannerCard'
import {
    BANNER_CAROUSEL_INTERVAL_MS,
    BANNER_CAROUSEL_SWIPE_THRESHOLD_PX,
    BANNER_LARGE_IMAGE_MIN_WIDTH_PX,
    BANNER_LARGE_IMAGE_MIN_HEIGHT_PX,
} from '../../../constants/config'

/**
 * 뷰포트 너비에 따른 한 화면에 보여지는 배너 카드 수를 반환합니다.
 * @param width 현재 뷰포트 너비(px)
 */
function getCardsPerView(width: number): number {
    if (width >= 1280) return 4
    if (width >= 640) return 2
    return 1
}

/**
 * 배너 섹션
 * 배너 카드를 캐러셀 형태로 보여주는 영역.
 * 반응형 레이아웃에 따라 보여지는 개수와 형태가 다르다.
 */
export function BannerCarousel({ banners }: BannerCarouselProps) {
    const navigate = useNavigate()
    const trackRef = useRef<HTMLDivElement | null>(null)
    const itemRefs = useRef<Array<HTMLElement | null>>([])
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const touchStartXRef = useRef<number | null>(null)

    const [paused, setPaused] = useState(false)
    const [isDocumentHidden, setIsDocumentHidden] = useState(false)
    const [cardsPerView, setCardsPerView] = useState(1)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [largeImageIds, setLargeImageIds] = useState<Record<number, boolean>>({})

    const total = banners.length
    const maxStartIndex = Math.max(0, total - cardsPerView)
    const pageCount = useMemo(() => Math.max(1, Math.ceil(total / cardsPerView)), [total, cardsPerView])

    // 뷰포트 리사이즈 시 cardsPerView 갱신
    useEffect(() => {
        const updateCardsPerView = () => {
            setCardsPerView(getCardsPerView(window.innerWidth))
        }

        updateCardsPerView()

        window.addEventListener('resize', updateCardsPerView)
        return () => window.removeEventListener('resize', updateCardsPerView)
    }, [])

    useEffect(() => {
        if (typeof document === 'undefined') return

        const handleVisibilityChange = () => {
            setIsDocumentHidden(document.hidden)
        }

        handleVisibilityChange()
        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
    }, [])

    // cardsPerView 변경 시 currentIndex 범위 보정
    useEffect(() => {
        setCurrentIndex((prev) => Math.min(prev, maxStartIndex))
    }, [maxStartIndex])

    const scrollToIndex = useCallback((index: number) => {
        const target = itemRefs.current[index]
        if (target === null || target === undefined) return
        target.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
    }, [])

    const showLeftBanner = useCallback(() => {
        if (total === 0) return
        const next = currentIndex + cardsPerView
        const nextIndex = next > maxStartIndex ? 0 : next
        setCurrentIndex(nextIndex)
        scrollToIndex(nextIndex)
    }, [cardsPerView, currentIndex, maxStartIndex, scrollToIndex, total])

    const showRightBanner = useCallback(() => {
        if (total === 0) return
        const prev = currentIndex - cardsPerView
        const prevIndex = prev < 0 ? maxStartIndex : prev
        setCurrentIndex(prevIndex)
        scrollToIndex(prevIndex)
    }, [cardsPerView, currentIndex, maxStartIndex, scrollToIndex, total])

    // 자동 슬라이드 (4초 간격, hover 시 일시 정지)
    useEffect(() => {
        if (paused || isDocumentHidden || total <= cardsPerView) return
        timerRef.current = setInterval(() => showRightBanner(), BANNER_CAROUSEL_INTERVAL_MS)
        return () => {
            if (timerRef.current !== null) clearInterval(timerRef.current)
        }
    }, [cardsPerView, isDocumentHidden, paused, showRightBanner, total])

    const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
        touchStartXRef.current = e.touches[0].clientX
    }, [])

    const handleTouchEnd = useCallback(
        (e: React.TouchEvent<HTMLDivElement>) => {
            if (touchStartXRef.current === null) return
            const deltaX = touchStartXRef.current - e.changedTouches[0].clientX
            touchStartXRef.current = null
            if (Math.abs(deltaX) < BANNER_CAROUSEL_SWIPE_THRESHOLD_PX) return
            if (deltaX > 0) showRightBanner()
            else showLeftBanner()
        },
        [showLeftBanner, showRightBanner],
    )

    const handleBannerClick = useCallback(
        (banner: PublicBanner) => {
            if (banner.linkUrl === null || banner.linkUrl.length === 0) return
            trackEvent('banner_click', {
                banner_title: banner.title,
                banner_type: banner.type,
                destination_url: banner.linkUrl,
            })
            if (banner.linkUrl.startsWith('http://') || banner.linkUrl.startsWith('https://')) {
                window.open(banner.linkUrl, '_blank', 'noopener,noreferrer')
                return
            }
            navigate(banner.linkUrl)
        },
        [navigate],
    )

    const handleImageLoad = useCallback((id: number, image: HTMLImageElement) => {
        const isLarge = image.naturalWidth >= BANNER_LARGE_IMAGE_MIN_WIDTH_PX || image.naturalHeight >= BANNER_LARGE_IMAGE_MIN_HEIGHT_PX
        setLargeImageIds((prev) => {
            if (prev[id] === isLarge) return prev
            return { ...prev, [id]: isLarge }
        })
    }, [])

    if (total === 0) return null

    const showNavButtons = cardsPerView > 1 && total > cardsPerView
    const showDots = cardsPerView === 1 && total > 1

    // 캐러셀 네비게이션 버튼 공통 클래스
    const navBtnClass =
        'pointer-events-none absolute top-[45px] z-20 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-1.5 text-white opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100 hover:bg-black/70 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50'

    return (
        <section className="group relative space-y-2" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            {/* 배너 카드 그리드 */}
            <div
                ref={trackRef}
                className="grid snap-x snap-mandatory grid-flow-col auto-cols-[100%] gap-3 overflow-x-hidden sm:auto-cols-[calc((100%-0.75rem)/2)] sm:gap-3 xl:auto-cols-[calc((100%-3rem)/4)] xl:gap-4"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {banners.map((banner, index) => (
                    <BannerCard
                        key={banner.id}
                        banner={banner}
                        isLargeImage={largeImageIds[banner.id]}
                        isPriorityImage={index === 0}
                        onClick={handleBannerClick}
                        onImageLoad={handleImageLoad}
                        innerRef={(el) => {
                            itemRefs.current[index] = el
                        }}
                    />
                ))}
            </div>

            {/* 데스크탑 네비게이션 버튼 (2장 이상일 때만 표시) */}
            {showNavButtons && (
                <>
                    <button type="button" onClick={showLeftBanner} className={cn(navBtnClass, 'left-1')} aria-label="왼쪽 배너 보기">
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={showRightBanner} className={cn(navBtnClass, 'right-1')} aria-label="오른쪽 배너 보기">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </>
            )}

            {/* 모바일 페이지 인디케이터 (1장씩 볼 때만 표시) */}
            {showDots && (
                <div className="flex justify-center py-1">
                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: pageCount }).map((_, pageIndex) => {
                            const activePage = Math.floor(currentIndex / cardsPerView)
                            const isActive = activePage === pageIndex
                            return (
                                <button
                                    key={pageIndex}
                                    type="button"
                                    onClick={() => {
                                        const nextIndex = Math.min(pageIndex * cardsPerView, maxStartIndex)
                                        setCurrentIndex(nextIndex)
                                        scrollToIndex(nextIndex)
                                    }}
                                    className={cn(
                                        'h-1.5 cursor-pointer rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                                        isActive ? 'w-4 bg-primary' : 'w-1.5 bg-border hover:bg-text-dim',
                                    )}
                                    aria-label={`배너 페이지 ${pageIndex + 1}`}
                                />
                            )
                        })}
                    </div>
                </div>
            )}
        </section>
    )
}
