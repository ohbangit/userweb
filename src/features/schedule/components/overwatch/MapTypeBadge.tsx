import type { OverwatchMapType } from '../../types/overwatch'
import { cn } from '../../../../lib/cn'

const MAP_TYPE_STYLES: Record<OverwatchMapType, string> = {
    쟁탈: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    혼합: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    밀기: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    호위: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
}

interface MapTypeBadgeProps {
    mapType: OverwatchMapType
    size?: 'sm' | 'md'
}

export function MapTypeBadge({ mapType, size = 'md' }: MapTypeBadgeProps) {
    const style = MAP_TYPE_STYLES[mapType]

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-md border font-medium',
                size === 'sm' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-xs',
                style,
            )}
        >
            {mapType}
        </span>
    )
}
