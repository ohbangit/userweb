import { memo } from 'react'
import type { Dayjs } from 'dayjs'
import { getDayName, isToday } from '../utils/date'

interface WeeklyDateTabsProps {
    weekDays: Dayjs[]
    broadcastCountByDate: Map<string, number>
    activeDateKey: string
    onSelectDate: (day: Dayjs) => void
}

function WeeklyDateTabsComponent({ weekDays, broadcastCountByDate, activeDateKey, onSelectDate }: WeeklyDateTabsProps) {
    return (
        <div className="flex border-b border-border/30 px-2 sm:overflow-x-auto sm:scrollbar-hide">
            {weekDays.map((day) => {
                const key = day.format('YYYY-MM-DD')
                const today = isToday(day)
                const hasBroadcasts = (broadcastCountByDate.get(key) ?? 0) > 0
                const isActive = activeDateKey === key

                return (
                    <button
                        key={key}
                        type="button"
                        onClick={() => onSelectDate(day)}
                        className={[
                            'flex flex-1 sm:flex-none sm:min-w-[48px] sm:shrink-0 cursor-pointer flex-col items-center gap-0.5 rounded-t-xl px-2 pt-2 pb-2.5 transition-all',
                            isActive ? 'bg-primary/10' : 'hover:bg-bg-secondary',
                        ].join(' ')}
                    >
                        <span className={['text-[10px] font-medium', today ? 'text-primary' : 'text-text-dim'].join(' ')}>
                            {getDayName(day)}
                        </span>
                        <span
                            className={[
                                'flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold',
                                today ? 'bg-primary text-bg' : isActive ? 'text-primary' : 'text-text',
                            ].join(' ')}
                        >
                            {day.date()}
                        </span>
                        <span
                            className={[
                                'h-1 w-1 rounded-full transition-opacity',
                                hasBroadcasts ? 'opacity-100' : 'opacity-0',
                                today || isActive ? 'bg-primary' : 'bg-text-dim',
                            ].join(' ')}
                        />
                    </button>
                )
            })}

        </div>
    )
}

export const WeeklyDateTabs = memo(WeeklyDateTabsComponent)
