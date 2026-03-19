import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useSchedule, useViewMode, useSwipe } from '../hooks'
import { addDays, addMonths, isSameDay } from '../utils'
import type { ViewMode } from '../types'
import {
    DailySchedule,
    WeeklySchedule,
    MonthlySchedule,
    ScheduleSeoHead,
    DateControlPanel,
} from '../components'
import { BannerCarousel, usePublicBanners } from '../../../components/banner'
import { cn } from '../../../lib/cn'

export default function SchedulePage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const { viewMode, setViewMode } = useViewMode(searchParams.get('view'))
    const [monthlyResetKey, setMonthlyResetKey] = useState(0)
    const [isFading, setIsFading] = useState(false)
    const [currentDate, setCurrentDate] = useState<Dayjs>(() => {
        const dateParam = searchParams.get('date')
        if (dateParam) {
            const parsed = dayjs(dateParam)
            if (parsed.isValid()) return parsed
        }
        return dayjs()
    })
    const {
        data: broadcasts = [],
        isPending,
        isError,
        refetch,
    } = useSchedule(viewMode, currentDate)
    const { data: bannersData } = usePublicBanners()

    const triggerFade = useCallback((action: () => void) => {
        setIsFading(true)
        const timeout = setTimeout(() => {
            action()
            setIsFading(false)
        }, 120)
        return () => clearTimeout(timeout)
    }, [])

    const handlePrev = useCallback(() => {
        triggerFade(() => {
            setCurrentDate((prev) => {
                if (viewMode === 'daily') return addDays(prev, -1)
                return viewMode === 'weekly' ? addDays(prev, -7) : addMonths(prev, -1)
            })
        })
    }, [viewMode, triggerFade])

    const handleNext = useCallback(() => {
        triggerFade(() => {
            setCurrentDate((prev) => {
                if (viewMode === 'daily') return addDays(prev, 1)
                return viewMode === 'weekly' ? addDays(prev, 7) : addMonths(prev, 1)
            })
        })
    }, [viewMode, triggerFade])

    const handleToday = () => {
        setCurrentDate(dayjs())
        setMonthlyResetKey((prev) => prev + 1)
    }

    const handleViewModeChange = useCallback(
        (newMode: ViewMode) => {
            triggerFade(() => {
                setCurrentDate(dayjs())
                setViewMode(newMode)
                if (newMode === 'monthly') setMonthlyResetKey((prev) => prev + 1)
            })
        },
        [setViewMode, triggerFade],
    )

    const isToday = isSameDay(currentDate, dayjs())

    const { handleTouchStart, handleTouchEnd } = useSwipe(handleNext, handlePrev)

    useEffect(() => {
        setSearchParams(
            { date: currentDate.format('YYYY-MM-DD'), view: viewMode },
            { replace: true },
        )
    }, [viewMode, currentDate, setSearchParams])

    return (
        <>
            <ScheduleSeoHead
                broadcasts={broadcasts}
                currentDate={currentDate}
                viewMode={viewMode}
            />
            <div className="space-y-4 sm:space-y-6">
                <BannerCarousel banners={bannersData?.banners ?? []} />
                <DateControlPanel
                    currentDate={currentDate}
                    viewMode={viewMode}
                    isToday={isToday}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    onToday={handleToday}
                    onViewModeChange={handleViewModeChange}
                />

                <div
                    className={cn(
                        'transition-opacity duration-150',
                        isFading ? 'opacity-0' : 'opacity-100',
                    )}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {isPending ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-20">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
                            <p className="text-sm text-text-muted">
                                일정을 불러오는 중...
                            </p>
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-20">
                            <p className="text-sm text-text-muted">
                                일정을 불러오는 데 실패했습니다
                            </p>
                            <button
                                onClick={() => refetch()}
                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border/40 bg-card px-4 py-2 text-xs font-medium text-text-muted transition-colors hover:border-border hover:text-text"
                            >
                                <RefreshCw className="h-3.5 w-3.5" />
                                다시 시도
                            </button>
                        </div>
                    ) : viewMode === 'daily' ? (
                        <DailySchedule
                            broadcasts={broadcasts}
                            currentDate={currentDate}
                        />
                    ) : viewMode === 'weekly' ? (
                        <WeeklySchedule
                            broadcasts={broadcasts}
                            currentDate={currentDate}
                        />
                    ) : (
                        <MonthlySchedule
                            key={`${currentDate.format('YYYY-MM')}-${monthlyResetKey}`}
                            broadcasts={broadcasts}
                            currentDate={currentDate}
                            onSelectDay={(day) => {
                                setCurrentDate(day)
                                setViewMode('daily')
                            }}
                        />
                    )}
                </div>
            </div>
        </>
    )
}
