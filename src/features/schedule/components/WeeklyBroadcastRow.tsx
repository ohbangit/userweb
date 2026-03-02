import { Zap } from 'lucide-react'
import { memo, useMemo } from 'react'
import type { Broadcast } from '../types/schedule'
import { formatTime } from '../utils/date'
import { resolveParticipants, sortParticipants } from '../utils/participant'
import { ParticipantStack } from './ParticipantStack'

interface WeeklyBroadcastRowProps {
    broadcast: Broadcast
    onClick: () => void
}

function WeeklyBroadcastRowComponent({ broadcast, onClick }: WeeklyBroadcastRowProps) {
    const startTime = formatTime(broadcast.startTime)

    const { sortedParticipants, representativeName, remaining } = useMemo(() => {
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
        }
    }, [broadcast])

    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-transparent px-3 py-2.5 text-left transition-all hover:border-border/40 hover:bg-card sm:gap-3"
        >
            {/* 상태 도트: LIVE=빨강 애니메이션, 합방=보라, 일반=primary */}
            <span
                className={[
                    'h-2 w-2 shrink-0 rounded-full',
                    broadcast.isLive ? 'bg-live' : broadcast.isCollab ? 'bg-collab' : 'bg-primary/60',
                ].join(' ')}
            />

            {/* 시작 시간 */}
            <span className="w-10 shrink-0 text-sm font-bold tabular-nums text-text sm:w-11">{startTime}</span>

            {/* 합방 배지 + 방송 제목 */}
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
                {broadcast.isCollab && (
                    <span className="shrink-0 rounded-md bg-collab/10 px-1.5 py-0.5 text-[10px] font-semibold text-collab">합방</span>
                )}
                <span className="truncate text-sm font-semibold text-text">{broadcast.title}</span>
                {broadcast.isChzzkSupport === true && (
                    <Zap className="h-3.5 w-3.5 shrink-0 fill-primary text-primary" />
                )}
            </div>

            {/* 참여자: 아바타 스택 + 대표자 이름 */}
            <div className="flex shrink-0 items-center gap-1.5">

                <ParticipantStack participants={sortedParticipants} />
                <span className="hidden max-w-[100px] truncate text-[11px] text-text-muted sm:block">
                    {representativeName}
                    {remaining > 0 && ` 외 ${remaining}명`}
                </span>
            </div>
        </button>
    )
}

export const WeeklyBroadcastRow = memo(WeeklyBroadcastRowComponent)
