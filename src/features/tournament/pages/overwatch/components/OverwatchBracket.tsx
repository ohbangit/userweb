import { useRef, useState, useLayoutEffect, useCallback, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import type { BracketMatch, BracketTeamSlot } from '../types'
import { useOWTournamentMatches } from '../hooks/useOWTournamentMatches'
import { OverwatchMatchDetailModal } from './OverwatchMatchDetailModal'
import { cn } from '../../../../../lib/cn'

const UPPER_CONNECTIONS: Array<{ from: string; to: string }> = [
    { from: 'ub-sf-1', to: 'ub-f' },
    { from: 'ub-sf-2', to: 'ub-f' },
]

const LOWER_CONNECTIONS: Array<{ from: string; to: string }> = [{ from: 'lb-r1', to: 'lb-f' }]

function formatSchedule(iso: string | null): string {
    if (!iso) return ''
    const d = new Date(iso)
    const month = d.getMonth() + 1
    const day = d.getDate()
    const hour = d.getHours()
    const min = String(d.getMinutes()).padStart(2, '0')
    return `${month}/${day} ${hour}:${min}`
}

function useBracketLines(containerRef: React.RefObject<HTMLDivElement | null>, connections: Array<{ from: string; to: string }>): string[] {
    const [paths, setPaths] = useState<string[]>([])

    const measure = useCallback(() => {
        const container = containerRef.current
        if (!container) return

        const cRect = container.getBoundingClientRect()
        const next: string[] = []

        for (const { from, to } of connections) {
            const fromEl = container.querySelector<HTMLElement>(`[data-match-id="${from}"]`)
            const toEl = container.querySelector<HTMLElement>(`[data-match-id="${to}"]`)
            if (!fromEl || !toEl) continue

            const f = fromEl.getBoundingClientRect()
            const t = toEl.getBoundingClientRect()

            const x1 = f.right - cRect.left
            const y1 = f.top + f.height / 2 - cRect.top
            const x2 = t.left - cRect.left
            const y2 = t.top + t.height / 2 - cRect.top
            const mx = (x1 + x2) / 2

            next.push(`M${x1} ${y1} H${mx} V${y2} H${x2}`)
        }

        setPaths(next)
    }, [containerRef, connections])

    useLayoutEffect(() => {
        measure()
    }, [measure])

    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        const ro = new ResizeObserver(measure)
        ro.observe(el)
        return () => ro.disconnect()
    }, [containerRef, measure])

    return paths
}

function TeamRow({ team, isWinner }: { team: BracketTeamSlot | null; isWinner: boolean }) {
    if (!team) {
        return (
            <div className="flex h-10 items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-3 last:border-b-0">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-white/[0.06]">
                    <span className="text-[10px] text-[#4b5563]">?</span>
                </div>
                <span className="text-xs text-[#4b5563]">TBD</span>
                <span className="ml-auto text-sm font-bold text-[#4b5563]">–</span>
            </div>
        )
    }

    return (
        <div
            className={cn(
                'flex h-10 items-center gap-2 border-b border-white/[0.06] px-3 last:border-b-0',
                isWinner ? 'bg-white/[0.06]' : 'bg-white/[0.02]',
            )}
        >
            <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded bg-white/[0.08]">
                {team.logoUrl ? (
                    <img src={team.logoUrl} alt={team.name} className="h-full w-full object-cover" />
                ) : (
                    <span className="text-[10px] font-bold text-[#6b7280]">{team.name.slice(0, 1)}</span>
                )}
            </div>
            <span className={cn('min-w-0 truncate text-xs font-semibold', isWinner ? 'text-white' : 'text-[#9ca3af]')}>
                {team.name}
            </span>
            <span className={cn('ml-auto shrink-0 text-sm font-bold tabular-nums', isWinner ? 'text-[#f99e1a]' : 'text-[#6b7280]')}>
                {team.score ?? '–'}
            </span>
        </div>
    )
}

function MatchNode({ match, onClick }: { match: BracketMatch; onClick?: () => void }) {
    const t1Score = match.team1?.score ?? -1
    const t2Score = match.team2?.score ?? -1
    const hasResult = match.team1 !== null && match.team2 !== null && t1Score >= 0 && t2Score >= 0
    const t1Winner = hasResult && t1Score > t2Score
    const t2Winner = hasResult && t2Score > t1Score
    const isClickable = match.team1 !== null || match.team2 !== null

    return (
        <div className="w-[160px] shrink-0 sm:w-[180px]">
            {match.scheduledAt && (
                <div className="mb-1 flex items-center gap-1.5">
                    {match.isLive && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ef4444]" />}
                    <span className={cn('text-[10px] font-bold', match.isLive ? 'text-[#ef4444]' : 'text-[#f99e1a]')}>
                        {match.isLive ? 'LIVE' : formatSchedule(match.scheduledAt)}
                    </span>
                </div>
            )}
            <div
                data-match-id={match.id}
                role={isClickable ? 'button' : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onClick={isClickable ? onClick : undefined}
                onKeyDown={
                    isClickable
                        ? (e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  onClick?.()
                              }
                          }
                        : undefined
                }
                className={cn(
                    'overflow-hidden rounded-lg border border-white/[0.08]',
                    isClickable ? 'cursor-pointer transition-colors hover:border-white/20 hover:bg-white/[0.03]' : '',
                )}
            >
                <TeamRow team={match.team1} isWinner={t1Winner} />
                <TeamRow team={match.team2} isWinner={t2Winner} />
            </div>
        </div>
    )
}

function RoundColumn({
    label,
    matches,
    onMatchClick,
    className,
}: {
    label: string
    matches: BracketMatch[]
    onMatchClick?: (match: BracketMatch, roundLabel: string) => void
    className?: string
}) {
    return (
        <div className={`flex flex-col items-center ${className ?? ''}`}>
            <div className="mb-3 -skew-x-6 bg-white/[0.08] px-3 py-1">
                <span className="inline-block skew-x-6 text-[10px] font-bold uppercase tracking-widest text-[#aab0b6]">{label}</span>
            </div>
            <div className="flex flex-1 flex-col items-center justify-around gap-6">
                {matches.map((match) => (
                    <MatchNode key={match.id} match={match} onClick={onMatchClick ? () => onMatchClick(match, label) : undefined} />
                ))}
            </div>
        </div>
    )
}

function SvgOverlay({ paths }: { paths: string[] }) {
    if (paths.length === 0) return null
    return (
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" style={{ zIndex: 1 }}>
            {paths.map((d, i) => (
                <path key={i} d={d} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fill="none" />
            ))}
        </svg>
    )
}

export function OverwatchBracket() {
    const { data, isLoading, error } = useOWTournamentMatches()
    const bracket = data?.bracket ?? null

    const upperRef = useRef<HTMLDivElement>(null)
    const lowerRef = useRef<HTMLDivElement>(null)

    const upperPaths = useBracketLines(upperRef, UPPER_CONNECTIONS)
    const lowerPaths = useBracketLines(lowerRef, LOWER_CONNECTIONS)

    const [selected, setSelected] = useState<{
        match: BracketMatch
        roundLabel: string
    } | null>(null)

    const handleMatchClick = useCallback((match: BracketMatch, roundLabel: string) => {
        setSelected({ match, roundLabel })
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-[#6b7280]" />
            </div>
        )
    }

    if (error instanceof Error) {
        return <div className="py-10 text-center text-sm text-[#ff8f8f]">대진표를 불러오지 못했습니다.</div>
    }

    if (!bracket || (bracket.upper.length === 0 && bracket.lower.length === 0 && !bracket.grandFinal)) {
        return <div className="py-10 text-center text-sm text-[#6b7280]">등록된 대진 정보가 없습니다.</div>
    }

    return (
        <>
            <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                <div className="min-w-fit space-y-8 lg:flex lg:items-start lg:gap-6 lg:space-y-0">
                    {bracket.upper.length > 0 && (
                        <div className="lg:flex-1">
                            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#6b7280]">Upper Bracket</h3>
                            <div ref={upperRef} className="relative flex items-center gap-6 sm:gap-8">
                                <SvgOverlay paths={upperPaths} />
                                {bracket.upper.map((round) => (
                                    <RoundColumn
                                        key={round.label}
                                        label={round.label}
                                        matches={round.matches}
                                        onMatchClick={handleMatchClick}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {bracket.upper.length > 0 && bracket.lower.length > 0 && (
                        <>
                            <div className="h-px bg-white/[0.06] lg:hidden" />
                            <div className="hidden lg:block lg:w-px lg:self-stretch lg:bg-white/[0.06]" />
                        </>
                    )}

                    {bracket.lower.length > 0 && (
                        <div className="lg:flex-1">
                            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#6b7280]">Lower Bracket</h3>
                            <div ref={lowerRef} className="relative flex items-center gap-6 sm:gap-8">
                                <SvgOverlay paths={lowerPaths} />
                                {bracket.lower.map((round) => (
                                    <RoundColumn
                                        key={round.label}
                                        label={round.label}
                                        matches={round.matches}
                                        onMatchClick={handleMatchClick}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {bracket.grandFinal && (
                        <>
                            <div className="h-px bg-white/[0.06] lg:hidden" />
                            <div className="hidden lg:block lg:w-px lg:self-stretch lg:bg-white/[0.06]" />
                            <div>
                                <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#6b7280]">Grand Final</h3>
                                <div className="flex items-center">
                                    <RoundColumn label="GRAND FINAL" matches={[bracket.grandFinal]} onMatchClick={handleMatchClick} />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {selected !== null && (
                <OverwatchMatchDetailModal match={selected.match} roundLabel={selected.roundLabel} onClose={() => setSelected(null)} />
            )}
        </>
    )
}
