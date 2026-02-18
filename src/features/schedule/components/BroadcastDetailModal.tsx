import { useEffect, useCallback } from 'react'
import dayjs from 'dayjs'
import { X, Calendar, Clock, Gamepad2, Hash, Users } from 'lucide-react'
import { Broadcast, Participant } from '../types/schedule'
import { useBroadcastDetail } from '../hooks/useBroadcastDetail'
import { formatTime, getDayName } from '../utils/date'
import chzzkIcon from '../../../assets/chzzk_icon.png'

interface BroadcastDetailModalProps {
    broadcast: Broadcast | null
    onClose: () => void
}

const getInitial = (name: string) => name.trim().slice(0, 1)

function StatusIndicator({ broadcast }: { broadcast: Broadcast }) {
    if (broadcast.isCollab) {
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-collab/30 bg-collab/15 px-2.5 py-1 text-xs font-medium text-collab">
                합방
            </span>
        )
    }
    return (
        <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            예정
        </span>
    )
}

function ParticipantRow({
    participant,
    channelUrl,
    avatarFallbackUrl,
}: {
    participant: Participant
    channelUrl?: string
    avatarFallbackUrl?: string
}) {
    const avatarUrl = participant.avatarUrl ?? avatarFallbackUrl
    return (
        <div className="flex items-center gap-3 rounded-xl bg-bg-secondary/60 px-3 py-2.5">
            <div className="relative h-9 w-9 overflow-hidden rounded-full border border-border/60 bg-bg-secondary text-sm font-semibold text-text">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
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
            <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-semibold text-text">
                    {participant.name}
                </span>
            </div>
            {channelUrl && (
                <a
                    href={channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/40 bg-card/70 transition-colors hover:border-primary/40 hover:bg-primary/10"
                    aria-label={`${participant.name} 치지직 채널 열기`}
                >
                    <img
                        src={chzzkIcon}
                        alt="치지직"
                        className="h-4 w-4"
                        loading="lazy"
                    />
                </a>
            )}
        </div>
    )
}

function InfoRow({
    icon: Icon,
    label,
    children,
}: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    children: React.ReactNode
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="flex w-20 shrink-0 items-center gap-1.5 pt-0.5">
                <Icon className="h-3.5 w-3.5 text-text-dim" />
                <span className="text-xs font-medium text-text-dim">
                    {label}
                </span>
            </div>
            <div className="min-w-0 flex-1 text-sm text-text">{children}</div>
        </div>
    )
}

export function BroadcastDetailModal({
    broadcast,
    onClose,
}: BroadcastDetailModalProps) {
    const { data: detailData } = useBroadcastDetail(broadcast?.id ?? null)
    const displayBroadcast: Broadcast | null = detailData ?? broadcast

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        },
        [onClose],
    )

    useEffect(() => {
        if (!displayBroadcast) return
        document.addEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [displayBroadcast, handleKeyDown])

    if (!displayBroadcast) return null

    const date = dayjs(displayBroadcast.startTime)
    const startTime = formatTime(displayBroadcast.startTime)
    const endTime = displayBroadcast.endTime
        ? formatTime(displayBroadcast.endTime)
        : undefined
    const dayName = getDayName(date)
    const dateLabel = `${date.month() + 1}월 ${date.date()}일 (${dayName})`
    const gameTitle = displayBroadcast.gameTitle ?? displayBroadcast.tags?.[0]
    const tags = displayBroadcast.tags ?? []
    const participants: Participant[] =
        displayBroadcast.participants &&
        displayBroadcast.participants.length > 0
            ? displayBroadcast.participants
            : [{ name: displayBroadcast.streamerName }]
    const sortedParticipants = [...participants].sort((a, b) =>
        a.name.localeCompare(b.name, 'ko'),
    )

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
                role="presentation"
            />

            <div
                className="relative flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-2xl border border-border/40 bg-bg shadow-[0_-8px_40px_rgba(0,0,0,0.3)] sm:max-h-[80vh] sm:max-w-lg sm:rounded-2xl sm:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
                role="dialog"
                aria-modal="true"
                aria-label={displayBroadcast.title}
            >
                <div className="flex items-center justify-between border-b border-border/30 px-5 py-4">
                    <StatusIndicator broadcast={displayBroadcast} />
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-text-muted transition-colors hover:bg-card-hover hover:text-text"
                        aria-label="닫기"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    <div className="space-y-5 px-5 py-5">
                        <div>
                            <h2 className="text-lg font-bold leading-snug text-text sm:text-xl">
                                {displayBroadcast.title}
                            </h2>
                        </div>

                        <div className="space-y-3">
                            <InfoRow icon={Calendar} label="날짜">
                                {dateLabel}
                            </InfoRow>
                            <InfoRow icon={Clock} label="시간">
                                <span className="font-semibold">
                                    {startTime}
                                </span>
                                {endTime && (
                                    <span className="text-text-muted">
                                        {' '}
                                        – {endTime}
                                    </span>
                                )}
                            </InfoRow>
                            <InfoRow icon={Gamepad2} label="카테고리">
                                <span className="inline-block rounded-md border border-border/40 bg-category px-2 py-0.5 text-xs font-semibold text-text-muted">
                                    {gameTitle}
                                </span>
                            </InfoRow>
                            {tags.length > 0 && (
                                <InfoRow icon={Hash} label="태그">
                                    <div className="flex flex-wrap gap-1.5">
                                        {tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-md border border-border/30 bg-bg-secondary px-2 py-0.5 text-xs text-text-dim"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </InfoRow>
                            )}
                        </div>

                        <div className="space-y-2.5">
                            <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-dim">
                                <Users className="h-3.5 w-3.5" />
                                참여자 ({sortedParticipants.length})
                            </h3>
                            <div className="space-y-1.5">
                                {sortedParticipants.map(
                                    (participant, index) => (
                                        <ParticipantRow
                                            key={`${participant.name}-${index}`}
                                            participant={participant}
                                            channelUrl={
                                                participant.channelUrl ??
                                                (participant.name ===
                                                displayBroadcast.streamerName
                                                    ? (displayBroadcast.streamerChannelUrl ??
                                                      undefined)
                                                    : undefined)
                                            }
                                            avatarFallbackUrl={
                                                participant.name ===
                                                displayBroadcast.streamerName
                                                    ? (displayBroadcast.streamerProfileUrl ??
                                                      undefined)
                                                    : undefined
                                            }
                                        />
                                    ),
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border/30 px-5 py-4 sm:hidden">
                    <button
                        onClick={onClose}
                        className="w-full cursor-pointer rounded-xl bg-card py-3 text-sm font-semibold text-text transition-colors hover:bg-card-hover"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    )
}
