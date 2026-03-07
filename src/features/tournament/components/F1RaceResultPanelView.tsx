import { useEffect, useState } from 'react'
import { ChevronDown, ChevronRight, Zap } from 'lucide-react'
import type { F1RaceResultContent } from '../types'

interface Props {
    title: string
    content: F1RaceResultContent
    defaultExpanded?: boolean
}

const MEDAL: Record<number, string> = {
    1: '🥇',
    2: '🥈',
    3: '🥉',
}

const POINTS_TABLE: Record<number, number> = {
    1: 25,
    2: 18,
    3: 15,
    4: 12,
    5: 10,
    6: 8,
    7: 6,
    8: 4,
    9: 2,
    10: 1,
}

function getPositionColor(position: number | null, dnf: boolean): string {
    if (dnf) return 'text-gray-500'
    if (position === null) return 'text-[#6aadcc]'
    if (position === 1) return 'text-[#F5C842]'
    if (position === 2) return 'text-gray-300'
    if (position === 3) return 'text-amber-600'
    return 'text-[#e8f4fd]'
}

export function F1RaceResultPanelView({ title, content, defaultExpanded = false }: Props) {
    const [collapsed, setCollapsed] = useState(!defaultExpanded)
    const [expandedRaceId, setExpandedRaceId] = useState<string | null>(null)

    useEffect(() => {
        setCollapsed(!defaultExpanded)
    }, [defaultExpanded])

    // 첫 번째 레이스를 기본으로 열어둠
    useEffect(() => {
        if (content.races.length > 0 && expandedRaceId === null) {
            setExpandedRaceId(content.races[0]?.id ?? null)
        }
    }, [content.races, expandedRaceId])

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
                    {content.races.length === 0 ? (
                        <p className="mt-4 text-base text-[#6aadcc]/60">등록된 레이스 결과가 없습니다.</p>
                    ) : (
                        <div className="mt-4 space-y-3">
                            {content.races.map((race) => {
                                const isExpanded = expandedRaceId === race.id
                                const sorted = [...race.results].sort((a, b) => {
                                    if (a.dnf && !b.dnf) return 1
                                    if (!a.dnf && b.dnf) return -1
                                    if (a.position !== null && b.position !== null) return a.position - b.position
                                    if (a.position !== null) return -1
                                    if (b.position !== null) return 1
                                    return 0
                                })

                                return (
                                    <div key={race.id} className="overflow-hidden rounded-xl border border-[#1e3a5f] bg-[#041524]/60">
                                        {/* 레이스 헤더 (접이식 트리거) */}
                                        <button
                                            type="button"
                                            onClick={() => setExpandedRaceId(isExpanded ? null : race.id)}
                                            aria-expanded={isExpanded}
                                            className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left transition hover:bg-[#062035]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-base font-bold text-[#e8f4fd]">{race.raceTitle}</span>
                                                {sorted.length > 0 && <span className="text-xs text-[#6aadcc]/60">{sorted.length}명</span>}
                                            </div>
                                            <ChevronRight
                                                className={[
                                                    'h-4 w-4 text-[#6aadcc]/60 transition-transform duration-200',
                                                    isExpanded ? 'rotate-90' : '',
                                                ].join(' ')}
                                            />
                                        </button>

                                        {/* 레이스 결과 테이블 */}
                                        {isExpanded && (
                                            <div className="border-t border-[#1e3a5f]/60">
                                                {sorted.length === 0 ? (
                                                    <p className="px-4 py-3 text-sm text-[#6aadcc]/60">결과가 없습니다.</p>
                                                ) : (
                                                    <>
                                                        {/* 헤더 */}
                                                        <div className="grid grid-cols-[2.5rem_1fr_3rem_3.5rem] items-center gap-2 px-4 py-2 text-xs font-bold text-[#6aadcc]/70">
                                                            <span className="text-center">순위</span>
                                                            <span>드라이버</span>
                                                            <span className="text-center">포인트</span>
                                                            <span className="text-center">기록</span>
                                                        </div>
                                                        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#1e3a5f]/55 to-transparent" />
                                                        <ul>
                                                            {sorted.map((result, index) => (
                                                                <li key={result.driverId}>
                                                                    {index > 0 && (
                                                                        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#1e3a5f]/30 to-transparent" />
                                                                    )}
                                                                    <div className="grid grid-cols-[2.5rem_1fr_3rem_3.5rem] items-center gap-2 px-4 py-2.5">
                                                                        {/* 순위 */}
                                                                        <span
                                                                            className={[
                                                                                'text-center text-base font-black',
                                                                                getPositionColor(result.position, result.dnf),
                                                                            ].join(' ')}
                                                                        >
                                                                            {result.dnf
                                                                                ? 'DNF'
                                                                                : (MEDAL[result.position ?? 0] ?? result.position ?? '-')}
                                                                        </span>

                                                                        {/* 이름 */}
                                                                        <span
                                                                            className={[
                                                                                'truncate text-sm font-semibold',
                                                                                result.dnf ? 'text-gray-500' : 'text-[#e8f4fd]',
                                                                            ].join(' ')}
                                                                        >
                                                                            {result.name}
                                                                        </span>

                                                                        {/* 포인트 */}
                                                                        <span className="text-center text-sm font-bold text-[#F5C842]">
                                                                            {result.points !== null
                                                                                ? result.points
                                                                                : result.position !== null && !result.dnf
                                                                                  ? (POINTS_TABLE[result.position] ?? 0)
                                                                                  : '-'}
                                                                        </span>

                                                                        {/* 패스티스트 랩 */}
                                                                        <span className="flex justify-center">
                                                                            {result.fastestLap && (
                                                                                <Zap
                                                                                    className="h-3.5 w-3.5 text-[#a855f7]"
                                                                                    aria-label="패스티스트 랩"
                                                                                />
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </>
            )}
        </section>
    )
}
