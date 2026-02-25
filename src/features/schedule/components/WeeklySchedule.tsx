import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useState } from 'react'
import type { Broadcast } from '../types/schedule'
import { getWeekDays, getDayName, isSameDay, isToday } from '../utils/date'
import { BroadcastCard } from './BroadcastCard'
import { BroadcastDetailModal } from './BroadcastDetailModal'
import { DayBroadcastListModal } from './DayBroadcastListModal'

const MAX_VISIBLE = 3

interface WeeklyScheduleProps {
    broadcasts: Broadcast[]
    currentDate: Dayjs
}

export function WeeklySchedule({
    broadcasts,
    currentDate,
}: WeeklyScheduleProps) {
    const [selectedBroadcast, setSelectedBroadcast] =
        useState<Broadcast | null>(null)
    const [expandedDay, setExpandedDay] = useState<Dayjs | null>(null)
    const weekDays = getWeekDays(currentDate)

    const getBroadcastsForDay = (day: Dayjs) =>
        broadcasts
            .filter((b) => isSameDay(dayjs(b.startTime), day))
            .sort(
                (a, b) =>
                    dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf(),
            )

    const expandedDayBroadcasts = expandedDay
        ? getBroadcastsForDay(expandedDay)
        : []

    return (
        <div className="flex gap-px overflow-x-auto overflow-y-hidden rounded-xl border border-border/40 bg-border/20 scrollbar-hide snap-x snap-mandatory md:grid md:grid-cols-7 md:snap-none">
            {weekDays.map((day) => {
                const dayBroadcasts = getBroadcastsForDay(day)
                const today = isToday(day)
                const hiddenCount = dayBroadcasts.length - MAX_VISIBLE
                const visibleBroadcasts = dayBroadcasts.slice(0, MAX_VISIBLE)

                return (
                    <div
                        key={day.toISOString()}
                        className={[
                            'flex min-w-[200px] shrink-0 snap-start flex-col bg-bg md:min-w-0 md:shrink',
                            'min-h-[300px] sm:min-h-[360px]',
                            today ? 'bg-primary/[0.02]' : '',
                        ].join(' ')}
                    >
                        <div
                            className={[
                                'flex items-center gap-2 border-b border-border/30 px-3 py-2.5',
                                today ? 'border-b-primary/30' : '',
                            ].join(' ')}
                        >
                            <span
                                className={[
                                    'text-xs font-medium',
                                    today ? 'text-primary' : 'text-text-muted',
                                ].join(' ')}
                            >
                                {getDayName(day)}
                            </span>
                            <span
                                className={[
                                    'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                                    today ? 'bg-primary text-bg' : 'text-text',
                                ].join(' ')}
                            >
                                {day.date()}
                            </span>
                        </div>

                        <div className="flex flex-1 flex-col gap-2 p-2">
                            {dayBroadcasts.length > 0 ? (
                                <>
                                    {visibleBroadcasts.map((broadcast) => (
                                        <BroadcastCard
                                            key={broadcast.id}
                                            broadcast={broadcast}
                                            variant="compact"
                                            onClick={() =>
                                                setSelectedBroadcast(broadcast)
                                            }
                                        />
                                    ))}
                                    {hiddenCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setExpandedDay(day)}
                                            className="cursor-pointer rounded-lg border border-border/30 bg-bg-secondary/60 px-2 py-1.5 text-xs font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/10"
                                        >
                                            +{hiddenCount}개 더보기
                                        </button>
                                    )}
                                </>
                            ) : (
                                <div className="flex flex-1 items-center justify-center">
                                    <span className="text-xs text-text-dim">
                                        방송 없음
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
            <DayBroadcastListModal
                day={expandedDay}
                broadcasts={expandedDayBroadcasts}
                onClose={() => setExpandedDay(null)}
                onSelectBroadcast={(broadcast) =>
                    setSelectedBroadcast(broadcast)
                }
            />
            <BroadcastDetailModal
                broadcast={selectedBroadcast}
                onClose={() => setSelectedBroadcast(null)}
            />
        </div>
    )
}
