import type { Dayjs } from 'dayjs'
import type { ViewMode } from '../types'
import {
    getWeekNumber,
    getWeekRange,
    formatDate,
    formatFullDate,
} from '../utils'

interface PeriodDisplayProps {
    currentDate: Dayjs
    viewMode: ViewMode
}

export function PeriodDisplay({ currentDate, viewMode }: PeriodDisplayProps) {
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
