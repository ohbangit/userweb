import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useState } from 'react'
import { Broadcast, Participant } from '../types/schedule'
import { isSameDay, formatTime } from '../utils/date'
import { BroadcastDetailModal } from './BroadcastDetailModal'

interface DailyScheduleProps {
    broadcasts: Broadcast[]
    currentDate: Dayjs
}

const getInitial = (name: string) => name.trim().slice(0, 1)

function ParticipantStack({ participants }: { participants: Participant[] }) {
    const visible = participants.slice(0, 3)
    const remaining = participants.length - visible.length

    return (
        <div className="flex items-center">
            <div className="flex -space-x-2">
                {visible.map((participant, index) => (
                    <div
                        key={`${participant.name}-${index}`}
                        className="relative h-6 w-6 overflow-hidden rounded-full border border-border/60 bg-bg-secondary text-[10px] font-semibold text-text"
                        title={participant.name}
                    >
                        {participant.avatarUrl ? (
                            <img
                                src={participant.avatarUrl}
                                alt={participant.name}
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <span className="flex h-full w-full items-center justify-center">
                                {getInitial(participant.name)}
                            </span>
                        )}
                    </div>
                ))}
                {remaining > 0 && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border/60 bg-bg-secondary text-[10px] font-semibold text-text-dim">
                        +{remaining}
                    </div>
                )}
            </div>
        </div>
    )
}

function DailyBroadcastItem({
    broadcast,
    onClick,
}: {
    broadcast: Broadcast
    onClick: () => void
}) {
    const startTime = formatTime(broadcast.startTime)
    const endTime = broadcast.endTime
        ? formatTime(broadcast.endTime)
        : undefined
    const gameTitle = broadcast.gameTitle ?? broadcast.tags?.[0]
    const tags = broadcast.tags ?? []
    const participants: Participant[] =
        broadcast.participants && broadcast.participants.length > 0
            ? broadcast.participants
            : [
                  {
                      name: broadcast.streamerName,
                      avatarUrl: broadcast.streamerProfileUrl ?? undefined,
                  },
              ]
    const participantsWithStreamerFallback = participants.map((participant) => {
        if (participant.avatarUrl) {
            return participant
        }
        if (
            participant.name === broadcast.streamerName &&
            broadcast.streamerProfileUrl
        ) {
            return {
                ...participant,
                avatarUrl: broadcast.streamerProfileUrl,
            }
        }
        return participant
    })
    const sortedParticipants = [...participantsWithStreamerFallback].sort(
        (a, b) => a.name.localeCompare(b.name, 'ko'),
    )
    const participantLabel =
        sortedParticipants.length > 1
            ? `${sortedParticipants[0].name} 외 ${sortedParticipants.length - 1}명`
            : sortedParticipants[0].name

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
                    broadcast.isCollab
                        ? 'from-collab/90 via-collab/60 to-collab/20'
                        : 'from-primary/90 via-primary/60 to-primary/20',
                ].join(' ')}
            />

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text">
                        {startTime}
                    </span>
                    {endTime && (
                        <span className="text-[11px] text-text-dim">
                            – {endTime}
                        </span>
                    )}
                </div>
                <div className="flex items-start gap-2">
                    <h3 className="text-base font-bold leading-snug text-text">
                        {broadcast.title}
                    </h3>
                </div>

                <div className="flex items-center gap-3">
                    <ParticipantStack participants={sortedParticipants} />
                    <span className="text-[11px] text-text-dim">
                        {participantLabel}
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md border border-border/40 bg-category px-2 py-0.5 text-[10px] font-semibold text-text-muted">
                        {gameTitle}
                    </span>
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

export function DailySchedule({ broadcasts, currentDate }: DailyScheduleProps) {
    const [selectedBroadcast, setSelectedBroadcast] =
        useState<Broadcast | null>(null)

    const dayBroadcasts = broadcasts
        .filter((b) => isSameDay(dayjs(b.startTime), currentDate))
        .sort(
            (a, b) =>
                dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf(),
        )

    if (dayBroadcasts.length === 0) {
        return (
            <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-border/40 bg-card sm:min-h-[280px]">
                <div className="text-center">
                    <p className="text-sm text-text-muted">
                        예정된 방송이 없습니다
                    </p>
                    <p className="mt-1 text-xs text-text-dim">
                        다른 날짜를 확인해 보세요
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
                <span className="text-xs text-text-dim">
                    {dayBroadcasts.length}개의 방송
                </span>
            </div>
            <div className="space-y-2">
                {dayBroadcasts.map((broadcast) => (
                    <DailyBroadcastItem
                        key={broadcast.id}
                        broadcast={broadcast}
                        onClick={() => setSelectedBroadcast(broadcast)}
                    />
                ))}
            </div>
            <BroadcastDetailModal
                broadcast={selectedBroadcast}
                onClose={() => setSelectedBroadcast(null)}
            />
        </div>
    )
}
