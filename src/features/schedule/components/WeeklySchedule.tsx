import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Broadcast } from '../types/schedule'
import { getWeekDays, getDayName, isToday, getRelativeLabel } from '../utils/date'
import { WeeklyDateTabs } from './WeeklyDateTabs'
import { WeeklyBroadcastCard } from './WeeklyBroadcastCard'
import { BroadcastDetailModal } from './BroadcastDetailModal'
import { trackEvent } from '../../../utils/analytics'
import { cn } from '../../../lib/cn'

interface WeeklyScheduleProps {
    broadcasts: Broadcast[]
    currentDate: Dayjs
}

/**
 * 주간 스케줄 뷰
 * 미니 캘린더 스트립 + 어젠다 리스트 (sticky 헤더, 양방향 스크롤 싱크)
 */
export function WeeklySchedule({ broadcasts, currentDate }: WeeklyScheduleProps) {
    const [selectedBroadcast, setSelectedBroadcast] = useState<Broadcast | null>(null)
    const [activeDateKey, setActiveDateKey] = useState<string>(() => currentDate.format('YYYY-MM-DD'))

    // 주가 바뀌면 activeDateKey 초기화
    useEffect(() => {
        setActiveDateKey(currentDate.format('YYYY-MM-DD'))
    }, [currentDate])

    const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map())
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const initialScrollDone = useRef(false)

    const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate])

    const broadcastsByDate = useMemo(() => {
        const map = new Map<string, Broadcast[]>()
        for (const b of broadcasts) {
            const key = b.startTime ? dayjs(b.startTime).format('YYYY-MM-DD') : 'undecided'
            if (key === 'undecided') continue
            const arr = map.get(key)
            if (arr) arr.push(b)
            else map.set(key, [b])
        }
        for (const arr of map.values()) {
            arr.sort((a, b) => dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf())
        }
        return map
    }, [broadcasts])

    const broadcastCountByDate = useMemo(() => {
        const countMap = new Map<string, number>()
        for (const [key, arr] of broadcastsByDate.entries()) {
            countMap.set(key, arr.length)
        }
        return countMap
    }, [broadcastsByDate])

    // 탭 클릭 → 컨테이너 내부 스크롤
    const handleSelectDate = (day: Dayjs) => {
        const key = day.format('YYYY-MM-DD')
        setActiveDateKey(key)
        const sectionEl = sectionRefs.current.get(key)
        const containerEl = scrollContainerRef.current
        if (!sectionEl || !containerEl) return
        const containerRect = containerEl.getBoundingClientRect()
        const sectionRect = sectionEl.getBoundingClientRect()
        const scrollOffset = containerEl.scrollTop + (sectionRect.top - containerRect.top)
        containerEl.scrollTo({ top: scrollOffset, behavior: 'smooth' })
    }

    // 내부 스크롤 시 활성 탭 자동 업데이트
    useEffect(() => {
        const container = scrollContainerRef.current
        if (!container) return
        const handleScroll = () => {
            const containerRect = container.getBoundingClientRect()
            let activeKey = weekDays[0].format('YYYY-MM-DD')
            for (const [key, el] of sectionRefs.current.entries()) {
                if (el.getBoundingClientRect().top <= containerRect.top + 1) {
                    activeKey = key
                }
            }
            setActiveDateKey(activeKey)
        }
        container.addEventListener('scroll', handleScroll, { passive: true })
        return () => container.removeEventListener('scroll', handleScroll)
    }, [weekDays])

    // 마운트 시 오늘 섹션으로 자동 스크롤
    useEffect(() => {
        if (initialScrollDone.current) return
        const todayKey = dayjs().format('YYYY-MM-DD')
        const sectionEl = sectionRefs.current.get(todayKey)
        const containerEl = scrollContainerRef.current
        if (sectionEl && containerEl) {
            const containerRect = containerEl.getBoundingClientRect()
            const sectionRect = sectionEl.getBoundingClientRect()
            const scrollOffset = containerEl.scrollTop + (sectionRect.top - containerRect.top)
            containerEl.scrollTo({ top: scrollOffset, behavior: 'instant' })
            setActiveDateKey(todayKey)
            initialScrollDone.current = true
        }
    })

    return (
        <div className="overflow-hidden bg-bg sm:rounded-xl sm:border sm:border-border/40">
            {/* 미니 캘린더 스트립 */}
            <WeeklyDateTabs
                weekDays={weekDays}
                broadcastCountByDate={broadcastCountByDate}
                activeDateKey={activeDateKey}
                onSelectDate={handleSelectDate}
            />

            {/* 어젠다 스크롤 영역 */}
            <div ref={scrollContainerRef} className="max-h-[70vh] overflow-y-auto scrollbar-hide">
                <div className="divide-y divide-border/20">
                    {weekDays.map((day) => {
                        const key = day.format('YYYY-MM-DD')
                        const today = isToday(day)
                        const relativeLabel = getRelativeLabel(day)
                        const dayBroadcasts = broadcastsByDate.get(key) ?? []

                        return (
                            <div
                                key={key}
                                ref={(el) => {
                                    if (el) sectionRefs.current.set(key, el)
                                    else sectionRefs.current.delete(key)
                                }}
                            >
                                {/* 날짜 섹션 헤더 — sticky */}
                                <div
                                    className={cn(
                                        'sticky top-0 z-10 flex items-center justify-between border-b border-border/10 px-4 py-2.5 backdrop-blur-sm',
                                        today ? 'bg-primary/[0.04]' : 'bg-bg/95',
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        {relativeLabel && (
                                            <span
                                                className={cn(
                                                    'rounded-full px-2 py-0.5 text-[11px] font-bold',
                                                    today
                                                        ? 'bg-primary/10 text-primary'
                                                        : 'bg-bg-secondary text-text-muted',
                                                )}
                                            >
                                                {relativeLabel}
                                            </span>
                                        )}
                                        <span className={cn('text-sm font-semibold', today ? 'text-primary' : 'text-text')}>
                                            {getDayName(day)}요일
                                        </span>
                                        <span className={cn('text-xs', today ? 'text-primary/60' : 'text-text-dim')}>
                                            {day.month() + 1}/{day.date()}
                                        </span>
                                    </div>
                                    {dayBroadcasts.length > 0 && (
                                        <span className="rounded-full bg-bg-secondary px-2 py-0.5 text-[10px] font-medium text-text-dim">
                                            {dayBroadcasts.length}개
                                        </span>
                                    )}
                                </div>

                                {/* 방송 카드 목록 */}
                                {dayBroadcasts.length > 0 ? (
                                    <div className="space-y-1.5 px-3 py-2.5 sm:px-4">
                                        {dayBroadcasts.map((broadcast) => (
                                            <WeeklyBroadcastCard
                                                key={broadcast.id}
                                                broadcast={broadcast}
                                                onClick={() => {
                                                    trackEvent('broadcast_click', {
                                                        broadcast_id: broadcast.id,
                                                        broadcast_name: broadcast.streamerName,
                                                        view_mode: 'weekly',
                                                    })
                                                    setSelectedBroadcast(broadcast)
                                                }}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="px-4 py-4 text-center text-xs text-text-dim">방송 없음</p>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            <BroadcastDetailModal broadcast={selectedBroadcast} onClose={() => setSelectedBroadcast(null)} />
        </div>
    )
}
