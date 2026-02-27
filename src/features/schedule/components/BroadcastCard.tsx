import { memo, useMemo } from 'react'
import type { Broadcast, Participant } from '../types/schedule'
import { formatTime } from '../utils/date'
import { sortParticipants, getParticipantLabel } from '../utils/participant'

interface BroadcastCardProps {
    broadcast: Broadcast
    variant?: 'compact' | 'full'
    onClick?: () => void
}

function StatusDot({ broadcast }: { broadcast: Broadcast }) {
    if (broadcast.isCollab) {
        return (
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-collab" />
        )
    }
    return (
        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/40" />
    )
}

function BroadcastCardComponent({
    broadcast,
    variant = 'compact',
    onClick,
}: BroadcastCardProps) {
    const startTime = formatTime(broadcast.startTime)
    const endTime = broadcast.endTime
        ? formatTime(broadcast.endTime)
        : undefined
    const { participantLabel, tags } = useMemo(() => {
        const p: Participant[] =
            broadcast.participants && broadcast.participants.length > 0
                ? broadcast.participants
                : [{ name: broadcast.streamerName }]
        const sortedParticipants = sortParticipants(p)
        return {
            sortedParticipants,
            participantLabel: getParticipantLabel(sortedParticipants),
            tags: broadcast.tags ?? [],
        }
    }, [broadcast])

    if (variant === 'full') {
        return (
            <div className="flex items-center gap-1.5 rounded-md px-1.5 py-1">
                <StatusDot broadcast={broadcast} />
                <span className="text-[10px] font-medium text-text-dim">
                    {startTime}
                </span>
                <span className="min-w-0 truncate text-[10px] font-semibold text-text-muted">
                    {broadcast.title}
                </span>
            </div>
        )
    }

    const Wrapper = onClick ? 'button' : 'div'

    return (
        <Wrapper
            {...(onClick ? { type: 'button' as const, onClick } : {})}
            className={[
                'group relative flex w-full flex-col overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-bg-secondary/70 p-2.5 text-left transition-all',
                onClick ? 'cursor-pointer' : '',
                'hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)]',
                'before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:bg-[radial-gradient(circle_at_top,rgba(0,255,163,0.12),transparent_60%)] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100',
            ].join(' ')}
        >
            <div className="flex min-w-0 flex-col gap-1">
                <h3 className="truncate text-xs font-bold leading-snug text-text">
                    {broadcast.title}
                </h3>

                <span className="text-[10px] font-medium text-text-dim">
                    {startTime}
                    {endTime && ` – ${endTime}`}
                </span>

                <div className="flex items-center gap-1">
                    <span className="text-[10px] font-semibold text-primary">
                        {participantLabel}
                    </span>
                </div>
                {(broadcast.isChzzkSupport === true || tags.length > 0) && (
                    <div className="flex flex-wrap gap-0.5">
                        {broadcast.isChzzkSupport === true && (
                            <span className="rounded-md border border-primary/60 px-1.5 py-0.5 text-[9px] font-medium text-primary">
                                치지직 제작지원
                            </span>
                        )}
                        {tags.slice(0, 2).map((tag) => (
                            <span
                                key={tag}
                                className="rounded-md border border-border/40 bg-category px-1.5 py-0.5 text-[9px] font-medium text-text-muted"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </Wrapper>
    )
}

export const BroadcastCard = memo(BroadcastCardComponent)
