import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useMemo, useState } from 'react'
import type { Broadcast } from '../types/schedule'
import { getMonthDays, isSameMonth, isToday, isSameDay, formatFullDate } from '../utils/date'
import { WeeklyBroadcastRow } from './WeeklyBroadcastRow'
import { cn } from '../../../lib/cn'
import { DAY_NAMES_SHORT } from '../../../constants/date'

interface MonthlyScheduleProps {
    broadcasts: Broadcast[]
    currentDate: Dayjs
    onSelectDay?: (day: Dayjs) => void
}

const DAY_HEADERS = DAY_NAMES_SHORT

export function MonthlySchedule({ broadcasts, currentDate, onSelectDay }: MonthlyScheduleProps) {
    const broadcastsByDate = useMemo(() => {
        const map = new Map<string, Broadcast[]>()
        for (const b of broadcasts) {
            const key = dayjs(b.startTime).format('YYYY-MM-DD')
            const arr = map.get(key)
            if (arr) arr.push(b)
            else map.set(key, [b])
        }
        for (const arr of map.values()) {
            arr.sort((a, b) => dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf())
        }
        return map
    }, [broadcasts])

    const monthDays = useMemo(() => getMonthDays(currentDate), [currentDate])

    const getBroadcastsForDay = (day: Dayjs) => broadcastsByDate.get(day.format('YYYY-MM-DD')) ?? []

    const initialDay = useMemo(() => {
        const today = dayjs()
        if (isSameMonth(today, currentDate)) return today
        const first = monthDays.find((d) => isSameMonth(d, currentDate) && (broadcastsByDate.get(d.format('YYYY-MM-DD'))?.length ?? 0) > 0)
        return first ?? currentDate.startOf('month')
    }, [currentDate, monthDays, broadcastsByDate])

    const [selectedDay, setSelectedDay] = useState<Dayjs>(initialDay)

    const selectedBroadcasts = getBroadcastsForDay(selectedDay)

    const rows = useMemo(() => {
        const result: Dayjs[][] = []
        for (let i = 0; i < monthDays.length; i += 7) {
            result.push(monthDays.slice(i, i + 7))
        }
        return result
    }, [monthDays])

    return (
        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
            {/* 좌측: 히트맵 캘린더 */}
            <div className="-mx-2 sm:mx-0 md:w-80 md:shrink-0 lg:w-96">
                <div className="overflow-hidden rounded-xl border border-border/60 shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
                    {/* 요일 헤더 */}
                    <div className="grid grid-cols-7 border-b border-border/30 bg-bg-secondary">
                        {DAY_HEADERS.map((name) => (
                            <div key={name} className="py-3 text-center text-xs font-semibold text-text-muted">
                                {name}
                            </div>
                        ))}
                    </div>

                    {/* 날짜 그리드 */}
                    {rows.map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            className="grid grid-cols-7 divide-x divide-border/20 border-b border-border/20 last:border-b-0"
                        >
                            {row.map((day) => {
                                const inMonth = isSameMonth(day, currentDate)
                                const today = isToday(day)
                                const isSelected = isSameDay(day, selectedDay)
                                const dayBroadcasts = getBroadcastsForDay(day)
                                const hasCollab = dayBroadcasts.some((b) => b.isCollab)
                                const dotCount = Math.min(dayBroadcasts.length, 3)

                                return (
                                    <button
                                        type="button"
                                        key={day.format('YYYY-MM-DD')}
                                        onClick={() => setSelectedDay(day)}
                                        className={cn(
                                            'flex min-h-[64px] cursor-pointer flex-col items-center justify-center gap-1 py-2 transition-colors hover:bg-card-hover/50 md:min-h-[76px]',
                                            isSelected ? 'bg-primary/10' : inMonth ? 'bg-bg' : 'bg-bg-secondary/50',
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'flex h-7 w-7 items-center justify-center rounded-full text-sm',
                                                today
                                                    ? 'bg-primary font-bold text-bg'
                                                    : isSelected
                                                      ? 'font-bold text-primary'
                                                      : inMonth
                                                        ? 'font-medium text-text'
                                                        : 'text-text-dim',
                                            )}
                                        >
                                            {day.date()}
                                        </span>

                                        {dotCount > 0 && (
                                            <div className="flex items-center gap-0.5">
                                                {Array.from({ length: dotCount }, (_, i) => (
                                                    <span
                                                        key={i}
                                                        className={cn(
                                                            'h-1.5 w-1.5 rounded-full',
                                                            i === 0 && hasCollab
                                                                ? 'bg-collab'
                                                                : dotCount === 1
                                                                  ? 'bg-primary/50'
                                                                  : dotCount === 2
                                                                    ? 'bg-primary/70'
                                                                    : 'bg-primary',
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* 우측: 피드 패널 */}
            <div className="flex min-w-0 flex-1 flex-col gap-3">
                {/* 날짜 헤더 */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-text">{formatFullDate(selectedDay)}</h3>
                        {selectedBroadcasts.length > 0 && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                {selectedBroadcasts.length}개
                            </span>
                        )}
                    </div>
                    {onSelectDay !== undefined && (
                        <button
                            type="button"
                            onClick={() => onSelectDay(selectedDay)}
                            className="cursor-pointer rounded-lg border border-border/40 px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-border hover:text-text"
                        >
                            일간 보기
                        </button>
                    )}
                </div>

                {/* 방송 목록 */}
                {selectedBroadcasts.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center rounded-xl border border-border/30 bg-bg-secondary/50 py-16">
                        <p className="text-sm text-text-dim">이 날은 방송이 없습니다</p>
                    </div>
                ) : (
                    <div className="flex flex-col space-y-1.5">
                        {selectedBroadcasts.map((broadcast) => (
                            <WeeklyBroadcastRow key={broadcast.id} broadcast={broadcast} onClick={() => onSelectDay?.(selectedDay)} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
