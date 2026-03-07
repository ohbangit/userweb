import { useEffect, useState } from 'react'
import { ChevronDown, Flag, MapPin, Clock } from 'lucide-react'
import type { F1RaceScheduleContent, F1RaceStatus } from '../../../types'

interface Props {
    title: string
    content: F1RaceScheduleContent
    defaultExpanded?: boolean
}

const STATUS_CONFIG: Record<F1RaceStatus, { label: string; className: string; dot: string | null }> = {
    SCHEDULED: {
        label: '예정',
        className: 'border-[#1e3a5f] bg-[#0596e8]/10 text-[#6aadcc]',
        dot: null,
    },
    COMPLETED: {
        label: '완료',
        className: 'border-[#E10600]/30 bg-[#E10600]/10 text-[#ff6b6b]',
        dot: null,
    },
    CANCELLED: {
        label: '취소',
        className: 'border-gray-600/30 bg-gray-600/10 text-gray-500',
        dot: null,
    },
}

function formatScheduledAt(dateStr: string | null): string {
    if (dateStr === null) return '-'
    const d = new Date(dateStr)
    return d.toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export function F1StaticRaceSchedulePanelView({ title, content, defaultExpanded = false }: Props) {
    const sorted = [...content.races].sort((a, b) => a.order - b.order)
    const [collapsed, setCollapsed] = useState(!defaultExpanded)

    useEffect(() => {
        setCollapsed(!defaultExpanded)
    }, [defaultExpanded])

    return (
        <section className="w-full mt-10">
            <button
                type="button"
                onClick={() => setCollapsed((prev) => !prev)}
                aria-expanded={!collapsed}
                className="flex w-full items-center justify-between text-left cursor-pointer"
            >
                <h2 className="font-f1 text-5xl font-black tracking-tight uppercase text-[#e8f4fd]">{title}</h2>
                <ChevronDown
                    className={['h-6 w-6 text-[#6aadcc] transition-transform duration-200', collapsed ? '-rotate-90' : ''].join(' ')}
                />
            </button>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-[#E10600]/60 via-[#7a0300]/40 to-transparent" />

            {!collapsed && (
                <>
                    {sorted.length === 0 ? (
                        <p className="mt-4 text-base text-[#6aadcc]/60">등록된 레이스 일정이 없습니다.</p>
                    ) : (
                        <ol className="mt-4 space-y-2">
                            {sorted.map((race, index) => {
                                const statusConfig = STATUS_CONFIG[race.status]
                                const isCompleted = race.status === 'COMPLETED'
                                const isCancelled = race.status === 'CANCELLED'

                                return (
                                    <li
                                        key={race.id}
                                        className={[
                                            'flex items-start gap-4 rounded-xl border p-4 transition',
                                            isCompleted
                                                ? 'border-[#E10600]/20 bg-[#120608]/60'
                                                : isCancelled
                                                  ? 'border-gray-700/30 bg-gray-900/40 opacity-50'
                                                  : 'border-[#1e3a5f] bg-[#041524]/60',
                                        ].join(' ')}
                                    >
                                        {/* 라운드 번호 */}
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E10600]/10 ring-1 ring-[#E10600]/30">
                                            <span className="text-sm font-black text-[#E10600]">{index + 1}</span>
                                        </div>

                                        {/* 정보 */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Flag className="h-3.5 w-3.5 shrink-0 text-[#E10600]" />
                                                <span
                                                    className={[
                                                        'text-base font-bold leading-tight',
                                                        isCancelled ? 'text-gray-500 line-through' : 'text-[#e8f4fd]',
                                                    ].join(' ')}
                                                >
                                                    {race.title}
                                                </span>
                                                <span
                                                    className={[
                                                        'rounded-full border px-2 py-0.5 text-xs font-semibold',
                                                        statusConfig.className,
                                                    ].join(' ')}
                                                >
                                                    {statusConfig.label}
                                                </span>
                                            </div>

                                            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-[#6aadcc]/80">
                                                {race.circuit.length > 0 && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {race.circuit}
                                                    </span>
                                                )}
                                                {race.scheduledAt !== null && (
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {formatScheduledAt(race.scheduledAt)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ol>
                    )}
                </>
            )}
        </section>
    )
}
