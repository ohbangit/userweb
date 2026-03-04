import { Zap } from 'lucide-react'
import { memo, useMemo } from 'react'
import type { Broadcast } from '../types/schedule'
import { formatTime } from '../utils/date'
import { resolveParticipants, sortParticipants } from '../utils/participant'
import { ParticipantStack } from './ParticipantStack'
import partnerMark from '../../../assets/mark.png'

interface WeeklyBroadcastRowProps {
    broadcast: Broadcast
    onClick: () => void
}

type RowTone = 'collab' | 'internal' | 'tournament' | 'content' | 'default'

const TYPE_ROW_BG_CLASS: Record<RowTone, string> = {
    collab: 'bg-[linear-gradient(270deg,rgba(139,92,246,0.1)_0%,rgba(139,92,246,0.015)_100%)]',
    internal: 'bg-[linear-gradient(270deg,rgba(244,63,94,0.1)_0%,rgba(244,63,94,0.015)_100%)]',
    tournament: 'bg-[linear-gradient(270deg,rgba(245,158,11,0.1)_0%,rgba(245,158,11,0.015)_100%)]',
    content: 'bg-[linear-gradient(270deg,rgba(14,165,233,0.1)_0%,rgba(14,165,233,0.015)_100%)]',
    default: 'bg-[linear-gradient(270deg,rgba(148,163,184,0.07)_0%,rgba(148,163,184,0.01)_100%)]',
}

function normalizeTypeTone(broadcast: Broadcast): RowTone {
    const type = (broadcast.broadcastType ?? '').trim().toLowerCase()
    if (broadcast.isCollab || type === '합방' || type === 'collab') return 'collab'
    if (type === '내전' || type === 'internal') return 'internal'
    if (type === '대회' || type === 'tournament') return 'tournament'
    if (type === '콘텐츠' || type === 'content') return 'content'
    return 'default'
}

function WeeklyBroadcastRowComponent({ broadcast, onClick }: WeeklyBroadcastRowProps) {
    const startTime = formatTime(broadcast.startTime)
    const typeTone = normalizeTypeTone(broadcast)

    const { sortedParticipants, representativeName, remaining, isRepresentativePartner } = useMemo(() => {
        const participants = resolveParticipants(
            broadcast.participants,
            broadcast.streamerName,
            broadcast.streamerNickname,
            broadcast.streamerProfileUrl,
        )
        const sorted = sortParticipants(participants)
        const representative = sorted.find((p) => p.isHost) ?? sorted[0]
        return {
            sortedParticipants: sorted,
            representativeName: representative?.nickname ?? representative?.name ?? '',
            remaining: sorted.length - 1,
            isRepresentativePartner: representative?.isPartner === true,
        }
    }, [broadcast])

    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                'group flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-transparent px-3 py-2.5 text-left transition-all hover:border-border/40 hover:bg-card sm:gap-3',
                TYPE_ROW_BG_CLASS[typeTone],
            ].join(' ')}
        >
            <span className="w-10 shrink-0 text-sm font-bold tabular-nums text-text-muted sm:w-11">{startTime}</span>

            <div className="flex min-w-0 flex-1 items-center gap-1.5">
                {broadcast.isCollab && (
                    <span className="shrink-0 rounded-md bg-collab/10 px-1.5 py-0.5 text-[10px] font-semibold text-collab">합방</span>
                )}
                <span className="truncate text-sm font-semibold text-text">{broadcast.title}</span>
                {broadcast.isChzzkSupport === true && <Zap className="h-3.5 w-3.5 shrink-0 fill-primary text-primary" />}
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
                <ParticipantStack participants={sortedParticipants} />
                <span className="hidden items-center gap-0.5 text-[11px] text-text-muted sm:flex">
                    <span className="max-w-[80px] truncate">{representativeName}</span>
                    {isRepresentativePartner && <img src={partnerMark} alt="파트너" className="h-3 w-3 shrink-0" loading="lazy" />}
                    {remaining > 0 && ` 외 ${remaining}명`}
                </span>
            </div>
        </button>
    )
}

export const WeeklyBroadcastRow = memo(WeeklyBroadcastRowComponent)
