import dayjs from 'dayjs'
import { CalendarDays, Radio } from 'lucide-react'
import { MatchSetsPanel } from '../../../../schedule/components/overwatch/MatchSetsPanel'
import type { Broadcast } from '../../../../schedule/types/schedule'

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

function formatTimeLabel(value: string): string {
    return dayjs(value).format('HH:mm')
}

function ScheduleSkeleton() {
    return (
        <div className="mt-10 rounded-[32px] border border-[#16324a]/55 bg-[#03111d]/52 p-5 backdrop-blur-sm md:p-6">
            <div className="h-5 w-40 animate-pulse rounded-full bg-[#14324b]" />
            <div className="mt-5 grid gap-3 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="rounded-[24px] border border-[#1f3d57] bg-[#061727]/80 p-4">
                        <div className="h-4 w-28 animate-pulse rounded-full bg-[#14324b]" />
                        <div className="mt-4 h-24 animate-pulse rounded-2xl bg-[#10283c]" />
                    </div>
                ))}
            </div>
        </div>
    )
}

function ScheduleError({ message }: { message: string }) {
    return <div className="mt-10 rounded-[28px] border border-[#5d2d2d] bg-[#1b0e12]/90 p-5 text-sm text-[#ffe6e6]/88">{message}</div>
}

function MatchCard({ item }: { item: Broadcast }) {
    const match = item.overwatchMatch

    if (!match) return null

    return (
        <article className="snap-start rounded-[24px] border border-[#1f3d57] bg-[#061727]/86 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2 text-[#8ed0f2]">
                        <Radio className="h-3.5 w-3.5" />
                        <span className="text-[11px] font-black uppercase tracking-[0.22em]">{item.isLive ? 'Live Match' : 'Match'}</span>
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-[#f4fbff]">{item.title}</h3>
                </div>
                <span className="rounded-full border border-[#294a64] bg-[#061a2a]/72 px-2.5 py-1 text-[11px] font-semibold text-[#9fd4f5]">
                    {formatTimeLabel(item.startTime)}
                </span>
            </div>

            <div className="mt-4 rounded-2xl border border-[#17324a] bg-[#04111d]/88 p-3">
                <MatchSetsPanel match={match} />
            </div>
        </article>
    )
}

export function OverwatchScheduleSection({ days, isLoading, error }: OverwatchScheduleSectionProps) {
    if (isLoading) return <ScheduleSkeleton />
    if (error) return <ScheduleError message={error.message} />
    if (days.length === 0) return null

    return (
        <section className="mt-10 rounded-[32px] border border-[#16324a]/55 bg-[#03111d]/52 p-5 backdrop-blur-sm md:p-6">
            <div className="flex items-center gap-2 text-[#dff4ff]">
                <CalendarDays className="h-4 w-4 text-[#8ed0f2]" />
                <h2 className="text-lg font-black uppercase tracking-[0.24em] text-[#8ed0f2]">Schedule</h2>
            </div>

            <div className="mt-5 space-y-6">
                {days.map((day) => (
                    <section key={day.date}>
                        <div className="flex items-center gap-2 text-[#f4fbff]">
                            <h3 className="text-base font-black uppercase tracking-[0.18em] text-[#f4fbff]">{formatDateLabel(day.date)}</h3>
                            <span className="h-px flex-1 bg-gradient-to-r from-[#6fb7e6]/45 to-transparent" />
                        </div>

                        <div className="mt-4 grid snap-x snap-mandatory grid-flow-col auto-cols-[minmax(280px,86vw)] gap-3 overflow-x-auto pb-2 scrollbar-hide md:auto-cols-[minmax(360px,1fr)] md:gap-4">
                            {day.items.map((item) => (
                                <MatchCard key={item.id} item={item} />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </section>
    )
}
