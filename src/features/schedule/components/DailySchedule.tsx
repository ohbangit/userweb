import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useMemo, useState } from 'react'
import type { Broadcast } from '../types/schedule'
import { isSameDay } from '../utils/date'
import { BroadcastDetailModal } from './BroadcastDetailModal'
import { DailyBroadcastItem } from './DailyBroadcastItem'

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
        return (
            <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-border/40 bg-card sm:min-h-[280px]">
                <div className="text-center">
                    <p className="text-sm text-text-muted">
                        예정된 방송이 없습니다
                    </p>
                    <p className="mt-1 text-xs text-text-dim">
                        다른 날짜를 확인해 보세요
                    </p>
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
                        onClick={() => setSelectedBroadcast(broadcast)}
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
