import type { Broadcast, Participant } from '../types/schedule'
import { formatTime } from '../utils/date'

interface BroadcastCardProps {
    broadcast: Broadcast
    variant?: 'compact' | 'full'
    onClick?: () => void
}

function ColorBar({ broadcast }: { broadcast: Broadcast }) {
    return (
        <div
            className={[
                'w-0.5 shrink-0 self-stretch rounded-full bg-gradient-to-b',
                broadcast.isCollab
                    ? 'from-collab/90 via-collab/60 to-collab/20'
                    : 'from-primary/90 via-primary/60 to-primary/20',
            ].join(' ')}
        />
    )
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

export function BroadcastCard({
    broadcast,
    variant = 'compact',
    onClick,
}: BroadcastCardProps) {
    const startTime = formatTime(broadcast.startTime)
    const endTime = broadcast.endTime
        ? formatTime(broadcast.endTime)
        : undefined
    const category = broadcast.category?.name ?? undefined
    const participants: Participant[] =
        broadcast.participants && broadcast.participants.length > 0
            ? broadcast.participants
            : [{ name: broadcast.streamerName }]
    const sortedParticipants = [...participants].sort((a, b) =>
        a.name.localeCompare(b.name, 'ko'),
    )
    const participantLabel =
        sortedParticipants.length > 1
            ? `${sortedParticipants[0].name} 외 ${sortedParticipants.length - 1}명`
            : sortedParticipants[0].name

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
                'group relative flex w-full gap-2.5 overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-bg-secondary/70 p-2.5 text-left transition-all',
                onClick ? 'cursor-pointer' : '',
                'hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)]',
                'before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:bg-[radial-gradient(circle_at_top,rgba(0,255,163,0.12),transparent_60%)] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100',
            ].join(' ')}
        >
            <ColorBar broadcast={broadcast} />

            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-medium text-text-dim">
                        {startTime}
                        {endTime && ` – ${endTime}`}
                    </span>
                </div>

                <h3 className="truncate text-xs font-bold leading-snug text-text">
                    {broadcast.title}
                </h3>

                <span className="text-[10px] font-semibold text-primary">
                    {participantLabel}
                </span>

                <span className="self-start rounded-md border border-border/40 bg-category px-1.5 py-0.5 text-[9px] font-medium text-text-muted">
                    {category}
                </span>
            </div>
        </Wrapper>
    )
}
