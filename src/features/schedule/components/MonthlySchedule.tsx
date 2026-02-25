import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import type { Broadcast } from '../types/schedule'
import {
    getMonthDays,
    getDayName,
    getWeekDays,
    isSameDay,
    isSameMonth,
    isToday,
} from '../utils/date'
import { BroadcastCard } from './BroadcastCard'

interface MonthlyScheduleProps {
    broadcasts: Broadcast[]
    currentDate: Dayjs
    onSelectDay?: (day: Dayjs) => void
}

const DAY_HEADERS = getWeekDays(dayjs()).map((d) => getDayName(d))

export function MonthlySchedule({
    broadcasts,
    currentDate,
    onSelectDay,
}: MonthlyScheduleProps) {
    const monthDays = getMonthDays(currentDate)

    const getBroadcastsForDay = (day: Dayjs) =>
        broadcasts
            .filter((b) => isSameDay(dayjs(b.startTime), day))
            .sort(
                (a, b) =>
                    dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf(),
            )

    const rows: Dayjs[][] = []
    for (let i = 0; i < monthDays.length; i += 7) {
        rows.push(monthDays.slice(i, i + 7))
    }

    return (
        <div className="overflow-x-auto overflow-y-hidden rounded-xl border border-border/40 scrollbar-hide">
            <div className="min-w-[640px] md:min-w-0">
                <div className="grid grid-cols-7 border-b border-border/30 bg-bg-secondary">
                    {DAY_HEADERS.map((name) => (
                        <div
                            key={name}
                            className="px-1.5 py-1.5 text-center text-[10px] font-medium text-text-muted sm:px-3 sm:py-2 sm:text-xs"
                        >
                            {name}
                        </div>
                    ))}
                </div>

                {rows.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="grid grid-cols-7 divide-x divide-border/20"
                    >
                        {row.map((day) => {
                            const dayBroadcasts = getBroadcastsForDay(day)
                            const inMonth = isSameMonth(day, currentDate)
                            const today = isToday(day)

                            return (
                                <button
                                    type="button"
                                    key={day.toISOString()}
                                    onClick={() => onSelectDay?.(day)}
                                    className={[
                                        'flex min-h-[80px] cursor-pointer flex-col items-stretch border-b border-border/20 p-1 text-left transition-colors hover:bg-card-hover/50 sm:min-h-[100px] sm:p-1.5 md:min-h-[120px] md:p-2',
                                        inMonth
                                            ? 'bg-bg'
                                            : 'bg-bg-secondary/50',
                                        today ? 'bg-primary/[0.02]' : '',
                                    ].join(' ')}
                                >
                                    <div className="flex shrink-0 items-center justify-between">
                                        <span
                                            className={[
                                                'flex h-5 w-5 items-center justify-center rounded-full text-[10px] sm:h-6 sm:w-6 sm:text-xs',
                                                today
                                                    ? 'bg-primary font-bold text-bg'
                                                    : inMonth
                                                      ? 'font-semibold text-text'
                                                      : 'text-text-dim',
                                            ].join(' ')}
                                        >
                                            {day.date()}
                                        </span>
                                        {dayBroadcasts.length > 0 && (
                                            <span className="text-[10px] text-text-dim">
                                                {dayBroadcasts.length}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-1 flex flex-col gap-0.5 sm:mt-1.5">
                                        {dayBroadcasts
                                            .slice(0, 2)
                                            .map((broadcast) => (
                                                <BroadcastCard
                                                    key={broadcast.id}
                                                    broadcast={broadcast}
                                                    variant="full"
                                                />
                                            ))}
                                        {dayBroadcasts.length > 2 && (
                                            <span className="px-1 text-[10px] text-text-dim sm:px-1.5">
                                                +{dayBroadcasts.length - 2}개
                                            </span>
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
}
