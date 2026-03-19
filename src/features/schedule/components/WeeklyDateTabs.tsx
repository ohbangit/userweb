import { memo } from 'react'
import type { Dayjs } from 'dayjs'
import { getDayName, isToday, getWeekNumber } from '../utils/date'
import { cn } from '../../../lib/cn'

/** 주간 미니 캘린더 스트립 props */
interface WeeklyDateTabsProps {
    weekDays: Dayjs[] // 월~일 7일 배열
    broadcastCountByDate: Map<string, number> // 날짜별 방송 수
    activeDateKey: string // 현재 활성 날짜 (YYYY-MM-DD)
    onSelectDate: (day: Dayjs) => void // 날짜 클릭 핸들러
}

/**
 * 밀도 도트 — 방송 수에 따라 1~3개 도트 렌더링
 * @param count 방송 수 (0이면 흐린 도트 1개)
 * @param highlight 강조 여부 (오늘 또는 활성 날짜)
 */
function DensityDots({ count, highlight }: { count: number; highlight: boolean }) {
    const dotCount = Math.min(Math.max(count, 1), 3)
    const dimmed = count === 0

    return (
        <div className="flex h-3 items-center justify-center gap-0.5">
            {Array.from({ length: dotCount }, (_, i) => (
                <span
                    key={i}
                    className={cn(
                        'h-1 w-1 rounded-full transition-opacity',
                        highlight ? 'bg-primary' : 'bg-text-dim',
                        dimmed && 'opacity-30',
                    )}
                />
            ))}
        </div>
    )
}

/**
 * 주간 미니 캘린더 스트립
 * 주차 헤더 + 7일 그리드 (요일명 · 날짜 숫자 · 밀도 도트)
 */
function WeeklyDateTabsComponent({ weekDays, broadcastCountByDate, activeDateKey, onSelectDate }: WeeklyDateTabsProps) {
    const refDay = weekDays[0]
    const weekLabel = `${refDay.month() + 1}월 ${getWeekNumber(refDay)}주차`

    return (
        <div className="mx-3 mt-3 mb-2 rounded-2xl bg-bg-secondary/30 px-3 py-2.5 sm:mx-4">
            {/* 주차 헤더 */}
            <p className="mb-2 text-center text-xs font-medium text-text-muted">{weekLabel}</p>

            {/* 7일 그리드 */}
            <div className="grid grid-cols-7">
                {weekDays.map((day) => {
                    const key = day.format('YYYY-MM-DD')
                    const today = isToday(day)
                    const isActive = activeDateKey === key
                    const count = broadcastCountByDate.get(key) ?? 0
                    const highlight = today || isActive

                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onSelectDate(day)}
                            className="flex cursor-pointer flex-col items-center gap-1 py-1 transition-all duration-150"
                        >
                            {/* 요일명 */}
                            <span
                                className={cn(
                                    'text-[10px] font-medium',
                                    today ? 'text-primary' : 'text-text-dim',
                                )}
                            >
                                {getDayName(day)}
                            </span>

                            {/* 날짜 숫자 */}
                            <span
                                className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors',
                                    today
                                        ? 'bg-primary text-bg'
                                        : isActive
                                          ? 'bg-primary/15 text-primary ring-2 ring-primary/40'
                                          : 'text-text hover:bg-primary/5',
                                )}
                            >
                                {day.date()}
                            </span>

                            {/* 밀도 도트 */}
                            <DensityDots count={count} highlight={highlight} />
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export const WeeklyDateTabs = memo(WeeklyDateTabsComponent)
