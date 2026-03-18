import { memo } from 'react'
import type { Broadcast } from '../types/schedule'
import { Badge } from '../../../components/ui/Badge'
import type { BadgeVariant } from '../../../components/ui/Badge'

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

const TONE_TO_VARIANT: Record<BroadcastTypeTone, BadgeVariant> = {
    collab: 'collab',
    internal: 'internal',
    tournament: 'tournament',
    content: 'content',
}

interface BroadcastTypeBadgeProps {
    broadcast: Broadcast
    className?: string
}

function BroadcastTypeBadgeComponent({ broadcast, className }: BroadcastTypeBadgeProps) {
    const tone = getBroadcastTypeTone(broadcast)
    if (!tone) return null
    return (
        <Badge variant={TONE_TO_VARIANT[tone]} size="sm" className={className}>
            {TYPE_BADGE_LABEL[tone]}
        </Badge>
    )
}

export const BroadcastTypeBadge = memo(BroadcastTypeBadgeComponent)
