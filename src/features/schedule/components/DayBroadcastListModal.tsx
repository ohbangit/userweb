import { useEffect, useCallback } from 'react'
import type { Dayjs } from 'dayjs'
import { X } from 'lucide-react'
import { Broadcast } from '../types/schedule'
import { getDayName } from '../utils/date'
import { BroadcastCard } from './BroadcastCard'

interface DayBroadcastListModalProps {
    day: Dayjs | null
    broadcasts: Broadcast[]
    onClose: () => void
    onSelectBroadcast: (broadcast: Broadcast) => void
}

export function DayBroadcastListModal({
    day,
    broadcasts,
    onClose,
    onSelectBroadcast,
}: DayBroadcastListModalProps) {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        },
        [onClose],
    )

    useEffect(() => {
        if (!day) return
        document.addEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [day, handleKeyDown])

    if (!day) return null

    const dayName = getDayName(day)
    const dateLabel = `${day.month() + 1}월 ${day.date()}일 (${dayName})`

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
                role="presentation"
            />

            <div
                className="relative flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-2xl border border-border/40 bg-bg shadow-[0_-8px_40px_rgba(0,0,0,0.3)] sm:max-h-[80vh] sm:max-w-md sm:rounded-2xl sm:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
                role="dialog"
                aria-modal="true"
                aria-label={`${dateLabel} 방송 목록`}
            >
                <div className="flex items-center justify-between border-b border-border/30 px-5 py-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-text">
                            {dateLabel}
                        </h2>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                            {broadcasts.length}개
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-text-muted transition-colors hover:bg-card-hover hover:text-text"
                        aria-label="닫기"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    <div className="flex flex-col gap-2.5 p-4">
                        {broadcasts.map((broadcast) => (
                            <BroadcastCard
                                key={broadcast.id}
                                broadcast={broadcast}
                                variant="compact"
                                onClick={() => {
                                    onClose()
                                    onSelectBroadcast(broadcast)
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="border-t border-border/30 px-5 py-4 sm:hidden">
                    <button
                        onClick={onClose}
                        className="w-full cursor-pointer rounded-xl bg-card py-3 text-sm font-semibold text-text transition-colors hover:bg-card-hover"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    )
}
