import { useEffect, useState } from 'react'
import { ChevronDown, Zap } from 'lucide-react'
import type { F1StandingsContent } from '../types'
import { cn } from '../../../lib/cn'

interface Props {
    title: string
    content: F1StandingsContent
    defaultExpanded?: boolean
}

const MEDAL: Record<number, string> = {
    1: '🥇',
    2: '🥈',
    3: '🥉',
}

export function F1StandingsPanelView({ title, content, defaultExpanded = false }: Props) {
    const sorted = [...content.standings].sort((a, b) => a.rank - b.rank)
    const [collapsed, setCollapsed] = useState(!defaultExpanded)

    useEffect(() => {
        setCollapsed(!defaultExpanded)
    }, [defaultExpanded])

    const maxPoints = sorted[0]?.totalPoints ?? 1

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
                    className={cn('h-6 w-6 text-[#6aadcc] transition-transform duration-200', collapsed ? '-rotate-90' : '')}
                />
            </button>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-[#E10600]/60 via-[#7a0300]/40 to-transparent" />

            {!collapsed && (
                <>
                    {sorted.length === 0 ? (
                        <p className="mt-4 text-base text-[#6aadcc]/60">챔피언십 순위가 아직 없습니다.</p>
                    ) : (
                        <div className="mt-4 overflow-hidden rounded-xl border border-[#1e3a5f]">
                            {/* 헤더 */}
                            <div className="grid grid-cols-[2.5rem_1fr_4rem] sm:grid-cols-[3rem_1fr_5rem_3rem_3rem_3rem] items-center gap-2 bg-[#041524]/80 px-4 py-2 text-xs font-bold text-[#6aadcc]">
                                <span className="text-center">순위</span>
                                <span>드라이버</span>
                                <span className="text-center">포인트</span>
                                <span className="hidden sm:block text-center" title="우승">
                                    🏆
                                </span>
                                <span className="hidden sm:block text-center" title="포디움">
                                    🥉
                                </span>
                                <span className="hidden sm:block text-center" title="패스티스트 랩">
                                    ⚡
                                </span>
                            </div>
                            <div className="h-px w-full bg-gradient-to-r from-[#E10600]/60 via-[#7a0300]/40 to-transparent" />

                            <ul>
                                {sorted.map((entry, index) => {
                                    const pointsRatio = maxPoints > 0 ? entry.totalPoints / maxPoints : 0
                                    const isTop3 = entry.rank <= 3

                                    return (
                                        <li key={entry.driverId}>
                                            {index > 0 && (
                                                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#1e3a5f]/55 to-transparent" />
                                            )}
                                            <div
                                                className={cn(
                                                    'grid grid-cols-[2.5rem_1fr_4rem] sm:grid-cols-[3rem_1fr_5rem_3rem_3rem_3rem] items-center gap-2 px-4 py-3 transition',
                                                    isTop3 ? 'bg-[#0a0305]' : '',
                                                )}
                                            >
                                                {/* 순위 */}
                                                <span className="text-center text-lg">
                                                    {MEDAL[entry.rank] !== undefined ? (
                                                        MEDAL[entry.rank]
                                                    ) : (
                                                        <span className="text-base font-bold text-[#6aadcc]">{entry.rank}</span>
                                                    )}
                                                </span>

                                                {/* 드라이버 정보 */}
                                                <div className="flex min-w-0 items-center gap-2.5">
                                                    {entry.avatarUrl !== null ? (
                                                        <img
                                                            src={entry.avatarUrl}
                                                            alt={entry.name}
                                                            className={cn(
                                                                'h-8 w-8 shrink-0 rounded-full object-cover',
                                                                isTop3 ? 'ring-2 ring-[#E10600]/50' : 'ring-1 ring-[#1e3a5f]',
                                                            )}
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="h-8 w-8 shrink-0 rounded-full bg-[#1e3a5f]" />
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-1">
                                                            <span className="truncate text-sm font-bold text-[#e8f4fd]">{entry.name}</span>
                                                        </div>
                                                        {/* 포인트 바 */}
                                                        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-[#1e3a5f]/40">
                                                            <div
                                                                className={cn(
                                                                    'h-full rounded-full transition-all duration-500',
                                                                    isTop3 ? 'bg-[#E10600]' : 'bg-[#6aadcc]/60',
                                                                )}
                                                                style={{ width: `${pointsRatio * 100}%` }}
                                                            />
                                                        </div>
                                                        {entry.note.length > 0 && (
                                                            <span className="text-xs text-[#6aadcc]/60">{entry.note}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* 누적 포인트 */}
                                                <span
                                                    className={cn(
                                                        'text-center text-base font-black',
                                                        isTop3 ? 'text-[#F5C842]' : 'text-[#e8f4fd]',
                                                    )}
                                                >
                                                    {entry.totalPoints}
                                                </span>

                                                {/* 우승 횟수 */}
                                                <span className="hidden sm:block text-center text-sm font-semibold text-[#e8f4fd]">{entry.wins}</span>

                                                {/* 포디움 횟수 */}
                                                <span className="hidden sm:block text-center text-sm font-semibold text-[#e8f4fd]">{entry.podiums}</span>

                                                {/* 패스티스트 랩 */}
                                                <span className="hidden sm:flex justify-center">
                                                    {entry.fastestLaps > 0 && (
                                                        <span className="flex items-center gap-0.5">
                                                            <Zap className="h-3.5 w-3.5 text-[#a855f7]" />
                                                            <span className="text-xs text-[#a855f7]">{entry.fastestLaps}</span>
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )}
                </>
            )}
        </section>
    )
}
