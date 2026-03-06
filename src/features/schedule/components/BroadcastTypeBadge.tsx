import { memo } from 'react'
import type { Broadcast } from '../types/schedule'

type BroadcastTypeTone = 'collab' | 'internal' | 'tournament' | 'content'

export function getBroadcastTypeTone(broadcast: Broadcast): BroadcastTypeTone | null {
    const type = (broadcast.broadcastType ?? '').trim().toLowerCase()
    if (broadcast.isCollab || type === '합방' || type === 'collab') return 'collab'
    if (type === '내전' || type === 'internal') return 'internal'
    if (type === '대회' || type === 'tournament') return 'tournament'
    if (type === '콘텐츠' || type === 'content') return 'content'
    return null
}

const TYPE_BADGE_LABEL: Record<BroadcastTypeTone, string> = {
    collab: '합방',
    internal: '내전',
    tournament: '대회',
    content: '콘텐츠',
}

const TYPE_BADGE_CLASS: Record<BroadcastTypeTone, string> = {
    collab: 'bg-collab/10 text-collab',
    internal: 'bg-rose-500/10 text-rose-500',
    tournament: 'bg-amber-500/10 text-amber-500',
    content: 'bg-sky-500/10 text-sky-500',
}

interface BroadcastTypeBadgeProps {
    broadcast: Broadcast
    className?: string
}

function BroadcastTypeBadgeComponent({ broadcast, className }: BroadcastTypeBadgeProps) {
    const tone = getBroadcastTypeTone(broadcast)
    if (!tone) return null
    return (
        <span
            className={['shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold', TYPE_BADGE_CLASS[tone], className ?? '']
                .filter(Boolean)
                .join(' ')}
        >
            {TYPE_BADGE_LABEL[tone]}
        </span>
    )
}

export const BroadcastTypeBadge = memo(BroadcastTypeBadgeComponent)
