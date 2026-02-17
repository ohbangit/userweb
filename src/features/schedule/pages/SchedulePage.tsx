import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { ViewMode } from '../types/schedule'
import { useSchedule } from '../hooks/useSchedule'
import {
    addDays,
    addMonths,
    getWeekNumber,
    getWeekRange,
    formatDate,
    formatFullDate,
} from '../utils/date'
import { DailySchedule } from '../components/DailySchedule'
import { WeeklySchedule } from '../components/WeeklySchedule'
import { MonthlySchedule } from '../components/MonthlySchedule'

function ViewToggle({
    viewMode,
    onChange,
}: {
    viewMode: ViewMode
    onChange: (mode: ViewMode) => void
}) {
    return (
        <div className="inline-flex rounded-lg border border-border/50 bg-bg-secondary p-0.5">
            <button
                onClick={() => onChange('daily')}
                className={[
                    'cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition-all sm:px-4 sm:py-1.5',
                    viewMode === 'daily'
                        ? 'bg-card text-text shadow-sm'
                        : 'text-text-muted hover:text-text',
                ].join(' ')}
            >
                일간
            </button>
            <button
                onClick={() => onChange('weekly')}
                className={[
                    'cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition-all sm:px-4 sm:py-1.5',
                    viewMode === 'weekly'
                        ? 'bg-card text-text shadow-sm'
                        : 'text-text-muted hover:text-text',
                ].join(' ')}
            >
                주간
            </button>
            <button
                onClick={() => onChange('monthly')}
                className={[
                    'cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition-all sm:px-4 sm:py-1.5',
                    viewMode === 'monthly'
                        ? 'bg-card text-text shadow-sm'
                        : 'text-text-muted hover:text-text',
                ].join(' ')}
            >
                월간
            </button>
        </div>
    )
}

function NavButton({
    direction,
    onClick,
}: {
    direction: 'prev' | 'next'
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-border/40 bg-card text-text-muted transition-colors hover:border-border hover:text-text sm:h-8 sm:w-8"
        >
            {direction === 'prev' ? (
                <ChevronLeft className="h-4 w-4" />
            ) : (
                <ChevronRight className="h-4 w-4" />
            )}
        </button>
    )
}

function PeriodDisplay({
    currentDate,
    viewMode,
}: {
    currentDate: Dayjs
    viewMode: ViewMode
}) {
    const year = String(currentDate.year()).slice(-2)
    const month = currentDate.month() + 1
    const containerClass = 'flex min-h-12 flex-col justify-center'

    if (viewMode === 'daily') {
        return (
            <div className={containerClass}>
                <h2 className="text-base font-semibold text-text sm:text-lg">
                    {formatFullDate(currentDate)}
                </h2>
            </div>
        )
    }

    if (viewMode === 'weekly') {
        const weekNum = getWeekNumber(currentDate)
        const range = getWeekRange(currentDate)
        return (
            <div className={containerClass}>
                <h2 className="text-base font-semibold text-text sm:text-lg">
                    {year}년 {month}월 {weekNum}주차
                </h2>
                <p className="mt-0.5 text-xs text-text-dim">
                    {formatDate(range.start)} – {formatDate(range.end)}
                </p>
            </div>
        )
    }

    return (
        <div className={containerClass}>
            <h2 className="text-base font-semibold text-text sm:text-lg">
                {year}년 {month}월
            </h2>
        </div>
    )
}

export default function SchedulePage() {
    const [viewMode, setViewMode] = useState<ViewMode>('weekly')
    const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs())
    const {
        data: broadcasts = [],
        isPending,
        isError,
        refetch,
    } = useSchedule(viewMode, currentDate)

    const handlePrev = () => {
        setCurrentDate((prev) => {
            if (viewMode === 'daily') return addDays(prev, -1)
            return viewMode === 'weekly'
                ? addDays(prev, -7)
                : addMonths(prev, -1)
        })
    }

    const handleNext = () => {
        setCurrentDate((prev) => {
            if (viewMode === 'daily') return addDays(prev, 1)
            return viewMode === 'weekly' ? addDays(prev, 7) : addMonths(prev, 1)
        })
    }

    const handleToday = () => {
        setCurrentDate(dayjs())
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-h-12 items-center gap-2 sm:gap-3">
                    <NavButton direction="prev" onClick={handlePrev} />
                    <PeriodDisplay
                        currentDate={currentDate}
                        viewMode={viewMode}
                    />
                    <NavButton direction="next" onClick={handleNext} />
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        onClick={handleToday}
                        className="cursor-pointer rounded-lg border border-border/40 bg-card px-4 py-2 text-xs font-medium text-text-muted transition-colors hover:border-border hover:text-text sm:px-3 sm:py-1.5"
                    >
                        오늘
                    </button>
                    <ViewToggle viewMode={viewMode} onChange={setViewMode} />
                </div>
            </div>

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
                    broadcasts={broadcasts}
                    currentDate={currentDate}
                    onSelectDay={(day) => {
                        setCurrentDate(day)
                        setViewMode('daily')
                    }}
                />
            )}
        </div>
    )
}
