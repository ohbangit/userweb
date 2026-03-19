import { useState } from 'react'
import dayjs from 'dayjs'
import { ChevronDown, Radio } from 'lucide-react'
import { MatchSetsPanel } from '../../../../schedule/components/overwatch/MatchSetsPanel'
import type { Broadcast } from '../../../../schedule/types/schedule'
import { cn } from '../../../../../lib/cn'

interface OverwatchScheduleSectionProps {
    days: Array<{
        date: string
        items: Broadcast[]
    }>
    isLoading: boolean
    error: Error | null
}

function formatDateLabel(date: string): string {
    return dayjs(date).format('YYYY.MM.DD ddd')
}

function formatTimeLabel(value: string | null): string {
    if (value === null) return '미정'
    return dayjs(value).format('HH:mm')
}

function ScheduleSkeleton() {
    return (
        <section className="w-full">
            <div className="h-7 w-16 animate-pulse rounded-lg bg-white/[0.06]" />
            <div className="mt-5 flex flex-col gap-3">
                {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="rounded-2xl bg-white/[0.04] p-4">
                        <div className="h-5 w-20 animate-pulse rounded bg-white/[0.08]" />
                        <div className="mt-3 h-28 animate-pulse rounded-2xl bg-white/[0.06]" />
                    </div>
                ))}
            </div>
        </section>
    )
}

function ScheduleError({ message }: { message: string }) {
    return (
        <section className="w-full">
            <div className="rounded-2xl bg-white/[0.04] p-5 text-sm text-[#9ca3af]">{message}</div>
        </section>
    )
}

function MatchCard({ item }: { item: Broadcast }) {
    const match = item.overwatchMatch

    if (!match) return null

    return (
        <article className="snap-start rounded-2xl bg-white/[0.06] p-4 transition-colors hover:bg-white/[0.08]">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="flex items-center gap-1.5">
                        <Radio className="h-3 w-3 text-[#6b7280]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">{item.isLive ? 'Live' : 'Match'}</span>
                    </div>
                    <h3 className="mt-1.5 text-sm font-semibold text-[#eef0f3]">{item.title}</h3>
                </div>
                <span className="shrink-0 rounded bg-white/[0.08] px-2 py-1 text-[11px] font-medium text-[#aab0b6]">
                    {formatTimeLabel(item.startTime)}
                </span>
            </div>

            <div className="mt-3 rounded-xl bg-white/[0.04] p-3">
                <MatchSetsPanel match={match} />
            </div>
        </article>
    )
}
export function OverwatchScheduleSection({ days, isLoading, error }: OverwatchScheduleSectionProps) {
    const [collapsed, setCollapsed] = useState(false)

    if (isLoading) return <ScheduleSkeleton />
    if (error) return <ScheduleError message={error.message} />
    if (days.length === 0) return null

    return (
        <section className="w-full">
            {/* ci.me 스타일 섹션 헤더: 큼고 덕하게, 분리선 없음 */}
            <button
                type="button"
                onClick={() => setCollapsed((prev) => !prev)}
                aria-expanded={!collapsed}
                className="group flex w-full cursor-pointer items-center justify-between text-left"
            >
                <h2 className="text-xl font-bold text-white">일정</h2>
                <ChevronDown
                    className={cn('h-5 w-5 text-[#6b7280] transition-transform duration-200 group-hover:text-[#9ca3af]', collapsed ? '-rotate-90' : '')}
                />
            </button>

            {!collapsed && (
                <div className="mt-5 flex flex-col gap-3">
                    {days.map((day) => (
                        <div key={day.date} className="rounded-2xl bg-white/[0.04] p-4">
                            {/* 날짜: ci.me 스타일 태그 */}
                            <div className="mb-3 flex items-center gap-2">
                                <span className="rounded bg-white/[0.08] px-2 py-0.5 text-xs font-semibold text-[#d1d5db]">
                                    {formatDateLabel(day.date)}
                                </span>
                            </div>
                            <div className="grid snap-x snap-mandatory grid-flow-col auto-cols-[minmax(280px,86vw)] gap-3 overflow-x-auto pb-1 scrollbar-hide md:auto-cols-[minmax(320px,1fr)] md:gap-3">
                                {day.items.map((item) => (
                                    <MatchCard key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}
