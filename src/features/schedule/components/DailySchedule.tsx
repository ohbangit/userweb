import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useMemo, useState } from 'react'
import { CalendarOff } from 'lucide-react'
import type { Broadcast } from '../types/schedule'
import { isSameDay, isToday } from '../utils/date'
import { BroadcastDetailModal } from './BroadcastDetailModal'
import { DailyBroadcastItem } from './DailyBroadcastItem'
import { trackEvent } from '../../../utils/analytics'

interface DailyScheduleProps {
    broadcasts: Broadcast[]
    currentDate: Dayjs
}

export function DailySchedule({ broadcasts, currentDate }: DailyScheduleProps) {
    const [selectedBroadcast, setSelectedBroadcast] =
        useState<Broadcast | null>(null)

    const dayBroadcasts = useMemo(
        () =>
            broadcasts
                .filter((b) => isSameDay(dayjs(b.startTime), currentDate))
                .sort(
                    (a, b) =>
                        dayjs(a.startTime).valueOf() -
                        dayjs(b.startTime).valueOf(),
                ),
        [broadcasts, currentDate],
    )

    if (dayBroadcasts.length === 0) {
        const today = isToday(currentDate)
        return (
            <div className="flex min-h-[50vh] items-center justify-center rounded-xl border border-border/40 bg-card">
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-secondary/60">
                        <CalendarOff className="h-6 w-6 text-text-dim" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-text-muted">
                            {today ? '오늘은 일정이 없어요' : '예정된 방송이 없습니다'}
                        </p>
                        <p className="mt-1 text-xs text-text-dim">
                            다른 날짜를 확인해 보세요
                        </p>
                    </div>
                    <div className="mt-2 w-full max-w-xs space-y-2 opacity-30">
                        <div className="h-16 rounded-xl bg-bg-secondary/80" />
                        <div className="h-16 rounded-xl bg-bg-secondary/60" />
                        <div className="h-16 rounded-xl bg-bg-secondary/40" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
                <span className="text-xs text-text-dim">
                    {dayBroadcasts.length}개의 방송
                </span>
            </div>
            <div className="space-y-2">
                {dayBroadcasts.map((broadcast) => (
                    <DailyBroadcastItem
                        key={broadcast.id}
                        broadcast={broadcast}
                        onClick={() => {
                            trackEvent('broadcast_click', {
                                broadcast_id: broadcast.id,
                                broadcast_name: broadcast.streamerName,
                                view_mode: 'daily',
                            })
                            setSelectedBroadcast(broadcast)
                        }}
                    />
                ))}
            </div>
            <BroadcastDetailModal
                broadcast={selectedBroadcast}
                onClose={() => setSelectedBroadcast(null)}
            />
        </div>
    )
}
