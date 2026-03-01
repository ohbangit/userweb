import { memo } from 'react'
import type { Broadcast } from '../types/schedule'
import { formatTime } from '../utils/date'
import { resolveParticipants, sortParticipants } from '../utils/participant'
import { ParticipantStack } from './ParticipantStack'
import partnerMark from '../../../assets/mark.png'

export interface DailyBroadcastItemProps {
    broadcast: Broadcast
    onClick: () => void
}

function DailyBroadcastItemComponent({ broadcast, onClick }: DailyBroadcastItemProps) {
    const startTime = formatTime(broadcast.startTime)
    const endTime = broadcast.endTime ? formatTime(broadcast.endTime) : undefined
    const categoryName = broadcast.category?.name ?? undefined
    const tags = broadcast.tags ?? []
    const participants = resolveParticipants(
        broadcast.participants,
        broadcast.streamerName,
        broadcast.streamerNickname,
        broadcast.streamerProfileUrl,
    )
    const sortedParticipants = sortParticipants(participants)
    const representative = sortedParticipants.find((p) => p.isHost) ?? sortedParticipants[0]
    const representativeName = representative ? (representative.nickname ?? representative.name) : ''
    const remaining = sortedParticipants.length - 1

    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                'group relative flex w-full cursor-pointer gap-3 overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-bg-secondary/70 p-3 text-left transition-all sm:p-4',
                'hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_14px_34px_rgba(0,0,0,0.35)]',
                'before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-[radial-gradient(circle_at_top,rgba(0,255,163,0.12),transparent_60%)] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100',
            ].join(' ')}
        >
            <div
                className={[
                    'w-1 shrink-0 self-stretch rounded-full bg-gradient-to-b',
                    broadcast.isCollab ? 'from-collab/90 via-collab/60 to-collab/20' : 'from-primary/90 via-primary/60 to-primary/20',
                ].join(' ')}
            />

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text">{startTime}</span>
                    {endTime && <span className="text-[11px] text-text-dim">– {endTime}</span>}
                </div>
                <div className="flex items-start gap-2">
                    <h3 className="text-base font-bold leading-snug text-text">{broadcast.title}</h3>
                </div>

                <div className="flex items-center gap-3">
                    <ParticipantStack participants={sortedParticipants} />
                    <span className="flex items-center gap-0.5 text-[11px] text-text-dim">
                        {representativeName}
                        {representative?.isPartner === true && (
                            <img src={partnerMark} alt="파트너" className="h-3 w-3 shrink-0" loading="lazy" />
                        )}
                        {remaining > 0 && ` 외 ${remaining}명`}
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {categoryName !== undefined && (
                        <span className="rounded-md border border-border/40 bg-category px-2 py-0.5 text-[10px] font-semibold text-text-muted">
                            {categoryName}
                        </span>
                    )}
                    {broadcast.isChzzkSupport === true && (
                        <span className="rounded-md border border-primary/60 px-2 py-0.5 text-[10px] font-medium text-primary">
                            치지직 제작지원
                        </span>
                    )}
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-md border border-border/30 bg-bg-secondary px-2 py-0.5 text-[10px] text-text-dim"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </button>
    )
}

export const DailyBroadcastItem = memo(DailyBroadcastItemComponent)
