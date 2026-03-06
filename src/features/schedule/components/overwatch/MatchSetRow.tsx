import type { OverwatchSet } from '../../types/overwatch'
import { MapTypeBadge } from './MapTypeBadge'

interface MatchSetRowProps {
    set: OverwatchSet
    homeTeam: string
    awayTeam: string
}

export function MatchSetRow({ set, homeTeam, awayTeam }: MatchSetRowProps) {
    const isCompleted = set.isPlayed && set.result !== null
    const isOngoing = set.isPlayed && set.result === null
    const isPending = !set.isPlayed

    return (
        <div className={['grid grid-cols-[44px_52px_1fr_auto] items-center gap-2 py-1.5 text-xs', isPending ? 'opacity-40' : ''].join(' ')}>
            {/* SET N */}
            <span className={['text-[10px] font-bold tracking-wider', isOngoing ? 'text-primary' : 'text-text-dim'].join(' ')}>
                SET {set.setNumber}
            </span>

            {/* 맵 타입 뱃지 */}
            <div>
                <MapTypeBadge mapType={set.mapType} size="sm" />
            </div>

            {/* 맵 이름 */}
            <span className={['truncate font-medium', isPending ? 'text-text-muted/50' : 'text-text-muted'].join(' ')}>
                {isPending ? '—' : (set.mapName ?? 'TBD')}
            </span>

            {/* 결과 */}
            <div className="flex items-center justify-end">
                {isOngoing && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-primary">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                        진행 중
                    </span>
                )}
                {isCompleted && (
                    <span className="text-[10px] font-semibold text-text-muted">
                        {set.result === 'home' ? homeTeam : awayTeam} ✓
                        {set.roundScore != null && <span className="ml-1 text-text-dim">({set.roundScore})</span>}
                    </span>
                )}
                {isPending && <span className="text-[10px] text-text-muted/50">—</span>}
            </div>
        </div>
    )
}
