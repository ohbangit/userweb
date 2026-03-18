import { memo } from 'react'
import { Gamepad2 } from 'lucide-react'
import type { Broadcast } from '../types/schedule'
import { formatTime } from '../utils/date'
import { resolveParticipants, sortParticipants } from '../utils/participant'
import { ParticipantStack } from './ParticipantStack'
import partnerMark from '../../../assets/mark.png'
import { Badge } from '../../../components/ui/Badge'
import { BroadcastTypeBadge, getBroadcastTypeTone } from './BroadcastTypeBadge'
import { cn } from '../../../lib/cn'

export interface DailyBroadcastItemProps {
    broadcast: Broadcast
    onClick: () => void
}

type CardTone = 'collab' | 'internal' | 'tournament' | 'content' | 'default'

const toneBg: Record<CardTone, string> = {
    collab: 'bg-[linear-gradient(270deg,rgba(139,92,246,0.1)_0%,rgba(139,92,246,0.015)_100%)]',
    internal: 'bg-[linear-gradient(270deg,rgba(244,63,94,0.1)_0%,rgba(244,63,94,0.015)_100%)]',
    tournament: 'bg-[linear-gradient(270deg,rgba(245,158,11,0.1)_0%,rgba(245,158,11,0.015)_100%)]',
    content: 'bg-[linear-gradient(270deg,rgba(14,165,233,0.1)_0%,rgba(14,165,233,0.015)_100%)]',
    default: 'bg-[linear-gradient(270deg,rgba(148,163,184,0.07)_0%,rgba(148,163,184,0.01)_100%)]',
}

const toneHover: Record<CardTone, string> = {
    collab: 'hover:shadow-[0_8px_24px_rgba(139,92,246,0.1)]',
    internal: 'hover:shadow-[0_8px_24px_rgba(244,63,94,0.1)]',
    tournament: 'hover:shadow-[0_8px_24px_rgba(245,158,11,0.1)]',
    content: 'hover:shadow-[0_8px_24px_rgba(14,165,233,0.1)]',
    default: 'hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)]',
}

function DailyBroadcastItemComponent({ broadcast, onClick }: DailyBroadcastItemProps) {
    const startTime = formatTime(broadcast.startTime)
    const isUndecided = broadcast.startTime === null
    const categoryName = broadcast.category?.name ?? undefined
    const tags = broadcast.tags ?? []
    const participants = resolveParticipants(
        broadcast.streamers,
        broadcast.streamerName,
        broadcast.streamerNickname,
        broadcast.streamerProfileUrl,
    )
    const sortedParticipants = sortParticipants(participants)
    const representative = sortedParticipants.find((p) => p.isHost) ?? sortedParticipants[0]
    const representativeName = representative ? (representative.nickname ?? representative.name) : ''
    const remaining = sortedParticipants.length - 1
    const tone: CardTone = getBroadcastTypeTone(broadcast) ?? 'default'

    const hasMetadata = categoryName !== undefined || tags.length > 0 || broadcast.isChzzkSupport === true || broadcast.isDrops === true

    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'group relative flex w-full cursor-pointer flex-col gap-2 overflow-hidden rounded-2xl p-3.5 text-left transition-all duration-200 sm:p-4',
                toneBg[tone],
                toneHover[tone],
                'hover:-translate-y-0.5',
                'active:translate-y-0 active:scale-[0.99] active:shadow-none',
            )}
        >
            <div className="flex items-center justify-between gap-3">
                <h3 className="min-w-0 truncate text-base font-extrabold leading-tight text-text transition-colors duration-200 dark:group-hover:text-white">
                    {broadcast.title}
                </h3>
                {isUndecided ? (
                    <span className="shrink-0 rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-amber-400">
                        미정
                    </span>
                ) : (
                    <span className="shrink-0 text-[13px] font-bold tabular-nums text-text-muted">
                        {startTime}
                    </span>
                )}
            </div>

            <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                    <ParticipantStack participants={sortedParticipants} maxVisible={3} size="sm" />
                    <span className="flex min-w-0 items-center gap-1 text-[12px] text-text-dim">
                        <span className="truncate font-medium">{representativeName}</span>
                        {representative?.isPartner === true && (
                            <img src={partnerMark} alt="파트너" className="h-3.5 w-3.5 shrink-0" loading="lazy" />
                        )}
                        {remaining > 0 && <span className="shrink-0 opacity-60">외 {remaining}명</span>}
                    </span>
                </div>
                <BroadcastTypeBadge broadcast={broadcast} className="shrink-0" />
            </div>

            {hasMetadata && (
                <div className="flex flex-wrap items-center gap-1 pt-0.5">
                    {categoryName !== undefined && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-bg-secondary/80 px-1.5 py-0.5 text-[10px] font-medium text-text-muted">
                            <Gamepad2 className="h-2.5 w-2.5" />
                            {categoryName}
                        </span>
                    )}
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-md bg-border/30 px-1.5 py-0.5 text-[10px] text-text-muted"
                        >
                            {tag}
                        </span>
                    ))}
                    {broadcast.isDrops === true && <Badge variant="primary" size="sm">드롭스</Badge>}
                    {broadcast.isChzzkSupport === true && <Badge variant="primary" size="sm">치지직 제작지원</Badge>}
                </div>
            )}
        </button>
    )
}

export const DailyBroadcastItem = memo(DailyBroadcastItemComponent)
