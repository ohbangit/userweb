import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Broadcast } from '../types/schedule'
import { getWeekDays, getDayName, isToday } from '../utils/date'
import { Zap } from 'lucide-react'
import { WeeklyDateTabs } from './WeeklyDateTabs'
import { WeeklyBroadcastRow } from './WeeklyBroadcastRow'
import { BroadcastDetailModal } from './BroadcastDetailModal'

interface WeeklyScheduleProps {
    broadcasts: Broadcast[]
    currentDate: Dayjs
}

export function WeeklySchedule({ broadcasts, currentDate }: WeeklyScheduleProps) {
    const [selectedBroadcast, setSelectedBroadcast] = useState<Broadcast | null>(null)
    const [activeDateKey, setActiveDateKey] = useState<string>(() => currentDate.format('YYYY-MM-DD'))

    // 주가 바뀌면 activeDateKey 초기화
    useEffect(() => {
        setActiveDateKey(currentDate.format('YYYY-MM-DD'))
    }, [currentDate])

    const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map())
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate])

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
        const scrollOffset =
            containerEl.scrollTop + (sectionRect.top - containerRect.top)
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

    return (
        <div className="overflow-hidden rounded-xl border border-border/40 bg-bg">
            {/* 날짜 탭 바 */}
            <WeeklyDateTabs
                weekDays={weekDays}
                broadcastCountByDate={broadcastCountByDate}
                activeDateKey={activeDateKey}
                onSelectDate={handleSelectDate}
            />

            {/* Legend */}
            <div className="flex items-center gap-3 border-b border-border/20 px-4 py-1.5">
                <span className="flex items-center gap-1 text-[10px] text-text-dim">
                    <span className="h-1.5 w-1.5 rounded-full bg-live" />
                    LIVE
                </span>
                <span className="flex items-center gap-1 text-[10px] text-text-dim">
                    <Zap className="h-3 w-3 fill-primary text-primary" />
                    치지직 제작지원
                </span>
            </div>

            {/* 내부 스크롤 영역 — 탭은 항상 위에 고정 */}
            <div
                ref={scrollContainerRef}
                className="max-h-[70vh] overflow-y-auto scrollbar-hide"
            >
            <div className="divide-y divide-border/20">
                {weekDays.map((day) => {
                    const key = day.format('YYYY-MM-DD')
                    const today = isToday(day)
                    const dayBroadcasts = broadcastsByDate.get(key) ?? []

                    return (
                        <div
                            key={key}
                            ref={(el) => {
                                if (el) sectionRefs.current.set(key, el)
                                else sectionRefs.current.delete(key)
                            }}
                        >
                            {/* 날짜 섹션 헤더 */}
                            <div className={['flex items-center justify-between px-4 py-3', today ? 'bg-primary/[0.03]' : ''].join(' ')}>
                                <div className="flex items-center gap-2">
                                    <span className={['text-xs font-bold', today ? 'text-primary' : 'text-text-muted'].join(' ')}>
                                        {getDayName(day)}요일
                                    </span>
                                    <span className={['text-xs', today ? 'text-primary/70' : 'text-text-dim'].join(' ')}>
                                        {day.month() + 1}/{day.date()}
                                    </span>
                                    {today && (
                                        <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                                            오늘
                                        </span>
                                    )}
                                </div>
                                {dayBroadcasts.length > 0 && (
                                    <span className="rounded-full bg-bg-secondary px-2 py-0.5 text-[10px] font-medium text-text-dim">
                                        {dayBroadcasts.length}개
                                    </span>
                                )}
                            </div>

                            {/* 방송 행 목록 */}
                            {dayBroadcasts.length > 0 ? (
                                <div className="px-2 pb-3">
                                    {dayBroadcasts.map((broadcast) => (
                                        <WeeklyBroadcastRow
                                            key={broadcast.id}
                                            broadcast={broadcast}
                                            onClick={() => setSelectedBroadcast(broadcast)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center py-6">
                                    <span className="text-xs text-text-dim">방송 없음</span>
                                </div>
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
