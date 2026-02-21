import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import type { ViewMode } from '../types'
import { useSchedule } from '../hooks'
import { addDays, addMonths } from '../utils'
import {
    DailySchedule,
    WeeklySchedule,
    MonthlySchedule,
    ViewToggle,
    NavButton,
    PeriodDisplay,
} from '../components'

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
