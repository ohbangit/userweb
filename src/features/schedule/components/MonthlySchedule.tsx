import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronUp, ChevronDown, Calendar, Flame, Radio } from 'lucide-react'
import type { Broadcast } from '../types/schedule'
import { getMonthDays, isSameMonth, isToday, getDayName, getRelativeLabel } from '../utils/date'
import { WeeklyBroadcastCard } from './WeeklyBroadcastCard'
import { BroadcastDetailModal } from './BroadcastDetailModal'
import { trackEvent } from '../../../utils/analytics'
import { cn } from '../../../lib/cn'
import { DAY_NAMES_SHORT } from '../../../constants/date'

interface MonthlyScheduleProps {
    broadcasts: Broadcast[]
    currentDate: Dayjs
    onSelectDay?: (day: Dayjs) => void
}

/**
 * 히트맵 셀 배경색을 반환합니다.
 * @param count 해당 날짜 방송 수
 * @param isActive 현재 활성 날짜 여부
 * @returns Tailwind 배경 클래스
 */
function getHeatmapBg(count: number, isActive: boolean): string {
    if (count === 0) return ''
    if (isActive) return 'bg-primary/15'
    if (count <= 2) return 'bg-primary/[0.07]'
    if (count <= 4) return 'bg-primary/[0.14]'
    return 'bg-primary/[0.22]'
}

/**
 * 월간 스케줄 뷰
 * 히트맵 캘린더 + 어젠다 리스트 (데스크톱: 사이드 패널, 모바일: 상하 스택 + 접기/펼치기)
 */
export function MonthlySchedule({ broadcasts, currentDate }: MonthlyScheduleProps) {
    const [selectedBroadcast, setSelectedBroadcast] = useState<Broadcast | null>(null)
    const [activeDateKey, setActiveDateKey] = useState<string>('')
    const [isCalendarCollapsed, setIsCalendarCollapsed] = useState(false)

    const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map())
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const initialScrollDone = useRef(false)

    const monthDays = useMemo(() => getMonthDays(currentDate), [currentDate])

    const rows = useMemo(() => {
        const result: Dayjs[][] = []
        for (let i = 0; i < monthDays.length; i += 7) {
            result.push(monthDays.slice(i, i + 7))
        }
        return result
    }, [monthDays])

    const activeRowIdx = useMemo(() => {
        return rows.findIndex((row) => row.some((day) => day.format('YYYY-MM-DD') === activeDateKey))
    }, [rows, activeDateKey])

    const broadcastsByDate = useMemo(() => {
        const map = new Map<string, Broadcast[]>()
        for (const b of broadcasts) {
            const key = b.startTime ? dayjs(b.startTime).format('YYYY-MM-DD') : null
            if (!key) continue
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

    const daysWithBroadcasts = useMemo(() => {
        return monthDays
            .filter((day) => isSameMonth(day, currentDate) && broadcastsByDate.has(day.format('YYYY-MM-DD')))
    }, [monthDays, currentDate, broadcastsByDate])

    const monthlySummary = useMemo(() => {
        const totalBroadcasts = broadcasts.length
        const daysWithContent = daysWithBroadcasts.length
        let busiestDay = ''
        let busiestCount = 0
        for (const day of daysWithBroadcasts) {
            const key = day.format('YYYY-MM-DD')
            const count = broadcastCountByDate.get(key) ?? 0
            if (count > busiestCount) {
                busiestCount = count
                busiestDay = `${day.month() + 1}/${day.date()} (${getDayName(day)})`
            }
        }
        return { totalBroadcasts, daysWithContent, busiestDay, busiestCount }
    }, [broadcasts, daysWithBroadcasts, broadcastCountByDate])

    useEffect(() => {
        initialScrollDone.current = false
        const todayKey = dayjs().format('YYYY-MM-DD')
        const todayInMonth = daysWithBroadcasts.find((d) => d.format('YYYY-MM-DD') === todayKey)
        if (todayInMonth) {
            setActiveDateKey(todayKey)
        } else if (daysWithBroadcasts.length > 0) {
            setActiveDateKey(daysWithBroadcasts[0].format('YYYY-MM-DD'))
        } else {
            setActiveDateKey(currentDate.format('YYYY-MM-DD'))
        }
    }, [currentDate, daysWithBroadcasts])

    const handleDayClick = (day: Dayjs) => {
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

    useEffect(() => {
        const container = scrollContainerRef.current
        if (!container) return
        const handleScroll = () => {
            const containerRect = container.getBoundingClientRect()
            let activeKey = daysWithBroadcasts[0]?.format('YYYY-MM-DD') ?? ''
            for (const [key, el] of sectionRefs.current.entries()) {
                if (el.getBoundingClientRect().top <= containerRect.top + 1) {
                    activeKey = key
                }
            }
            setActiveDateKey(activeKey)
        }
        container.addEventListener('scroll', handleScroll, { passive: true })
        return () => container.removeEventListener('scroll', handleScroll)
    }, [daysWithBroadcasts])

    useEffect(() => {
        if (initialScrollDone.current) return
        if (daysWithBroadcasts.length === 0) return
        const sectionEl = sectionRefs.current.get(activeDateKey)
        const containerEl = scrollContainerRef.current
        if (sectionEl && containerEl) {
            const containerRect = containerEl.getBoundingClientRect()
            const sectionRect = sectionEl.getBoundingClientRect()
            const scrollOffset = containerEl.scrollTop + (sectionRect.top - containerRect.top)
            containerEl.scrollTo({ top: scrollOffset, behavior: 'instant' })
            initialScrollDone.current = true
        }
    })

    const visibleRows = isCalendarCollapsed && activeRowIdx >= 0 ? [rows[activeRowIdx]] : rows

    const calendarBlock = (
        <div className="mx-3 mt-3 mb-2 rounded-2xl bg-bg-secondary/30 px-2 py-2.5 sm:mx-4 sm:px-3 md:mx-0 md:mt-4 md:mb-0">
            <div className="mb-1.5 grid grid-cols-7 text-center">
                {DAY_NAMES_SHORT.map((name) => (
                    <span key={name} className="text-[10px] font-medium text-text-dim">
                        {name}
                    </span>
                ))}
            </div>

            <div className={cn('overflow-hidden transition-all duration-200', isCalendarCollapsed ? 'max-h-12' : 'max-h-96')}>
                {visibleRows.map((row, rowIdx) => (
                    <div key={isCalendarCollapsed ? `collapsed-${activeRowIdx}` : rowIdx} className="grid grid-cols-7">
                        {row.map((day) => {
                            const key = day.format('YYYY-MM-DD')
                            const inMonth = isSameMonth(day, currentDate)
                            const today = isToday(day)
                            const isActive = activeDateKey === key
                            const count = broadcastCountByDate.get(key) ?? 0

                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => handleDayClick(day)}
                                    className={cn(
                                        'flex flex-col items-center justify-center py-1 transition-colors duration-100',
                                        inMonth ? 'cursor-pointer' : 'cursor-default opacity-30',
                                        inMonth && getHeatmapBg(count, isActive),
                                        inMonth && !today && !isActive && count === 0 && 'hover:bg-primary/5',
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium',
                                            today
                                                ? 'bg-primary font-bold text-bg'
                                                : isActive && inMonth
                                                  ? 'font-bold text-primary'
                                                  : 'text-text',
                                        )}
                                    >
                                        {day.date()}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={() => setIsCalendarCollapsed((prev) => !prev)}
                className="mt-1 flex w-full items-center justify-center gap-1 rounded-lg py-1 text-[10px] font-medium text-text-dim transition-colors hover:bg-primary/5 hover:text-text-muted md:hidden"
            >
                {isCalendarCollapsed ? (
                    <>
                        <ChevronDown className="h-3 w-3" />
                        펼치기
                    </>
                ) : (
                    <>
                        <ChevronUp className="h-3 w-3" />
                        접기
                    </>
                )}
            </button>
        </div>
    )

    const summaryBlock = (
        <div className="hidden space-y-3 md:block">
            <div className="rounded-2xl bg-bg-secondary/30 px-4 py-3.5">
                <p className="mb-2.5 text-[11px] font-bold tracking-wide text-text-muted uppercase">밀도</p>
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-text-dim">적음</span>
                    <div className="flex flex-1 gap-0.5">
                        <div className="h-3 flex-1 rounded-sm bg-primary/[0.07]" />
                        <div className="h-3 flex-1 rounded-sm bg-primary/[0.14]" />
                        <div className="h-3 flex-1 rounded-sm bg-primary/[0.22]" />
                        <div className="h-3 flex-1 rounded-sm bg-primary/[0.35]" />
                    </div>
                    <span className="text-[10px] text-text-dim">많음</span>
                </div>
            </div>

            <div className="rounded-2xl bg-bg-secondary/30 px-4 py-3.5">
                <p className="mb-3 text-[11px] font-bold tracking-wide text-text-muted uppercase">이번 달 요약</p>
                <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                            <Radio className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-text-dim">총 방송</p>
                            <p className="text-sm font-bold text-text">{monthlySummary.totalBroadcasts}개</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-text-dim">방송 있는 날</p>
                            <p className="text-sm font-bold text-text">{monthlySummary.daysWithContent}일</p>
                        </div>
                    </div>
                    {monthlySummary.busiestCount > 0 && (
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10">
                                <Flame className="h-3.5 w-3.5 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-xs text-text-dim">가장 바쁜 날</p>
                                <p className="text-sm font-bold text-text">{monthlySummary.busiestDay} <span className="font-normal text-text-dim">({monthlySummary.busiestCount}개)</span></p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

    const agendaBlock = (
        <div className="min-w-0 flex-1">
            <div ref={scrollContainerRef} className="max-h-[60vh] overflow-y-auto scrollbar-hide md:max-h-[70vh]">
                {daysWithBroadcasts.length === 0 ? (
                    <p className="px-4 py-12 text-center text-sm text-text-dim">이번 달 방송이 없습니다</p>
                ) : (
                    <div className="divide-y divide-border/20">
                        {daysWithBroadcasts.map((day) => {
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
                                        <span className="rounded-full bg-bg-secondary px-2 py-0.5 text-[10px] font-medium text-text-dim">
                                            {dayBroadcasts.length}개
                                        </span>
                                    </div>

                                    <div className="space-y-1.5 px-3 py-2.5 sm:px-4">
                                        {dayBroadcasts.map((broadcast) => (
                                            <WeeklyBroadcastCard
                                                key={broadcast.id}
                                                broadcast={broadcast}
                                                onClick={() => {
                                                    trackEvent('broadcast_click', {
                                                        broadcast_id: broadcast.id,
                                                        broadcast_name: broadcast.streamerName,
                                                        view_mode: 'monthly',
                                                    })
                                                    setSelectedBroadcast(broadcast)
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )

    return (
        <div className="overflow-hidden bg-bg sm:rounded-xl sm:border sm:border-border/40 md:flex md:flex-row md:gap-0 md:p-4">
            <div className="md:w-80 md:shrink-0 md:space-y-3 md:pr-4 lg:w-96">
                {calendarBlock}
                {summaryBlock}
            </div>
            {agendaBlock}
            <BroadcastDetailModal broadcast={selectedBroadcast} onClose={() => setSelectedBroadcast(null)} />
        </div>
    )
}
