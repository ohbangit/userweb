import { memo, useMemo } from 'react'
import type { Broadcast } from '../types/schedule'
import type { CardTone } from '../constants/cardTone'
import { toneBg } from '../constants/cardTone'
import { formatTime } from '../utils/date'
import { resolveParticipants, sortParticipants } from '../utils/participant'
import { ParticipantStack } from './ParticipantStack'
import partnerMark from '../../../assets/mark.png'
import { Badge } from '../../../components/ui/Badge'
import { BroadcastTypeBadge, getBroadcastTypeTone } from './BroadcastTypeBadge'
import { cn } from '../../../lib/cn'

interface WeeklyBroadcastRowProps {
    broadcast: Broadcast
    onClick: () => void
}

/** 주간 행 호버 — 유형별 border 색상 */
const toneHover: Record<CardTone, string> = {
    collab: 'hover:border-collab/25',
    internal: 'hover:border-rose-500/25',
    tournament: 'hover:border-amber-500/25',
    content: 'hover:border-sky-500/25',
    default: 'hover:border-border/40',
}

/**
 * 주간 방송 행 (레거시 — 현재 미사용, 향후 재활용 가능)
 * 1행 인라인: 시간 + 유형뱃지 + 제목 + 드롭스/제작지원 + 참여자
 */
function WeeklyBroadcastRowComponent({ broadcast, onClick }: WeeklyBroadcastRowProps) {
    const startTime = formatTime(broadcast.startTime)
    const isUndecided = broadcast.startTime === null
    const tone: CardTone = getBroadcastTypeTone(broadcast) ?? 'default'

    const { sortedParticipants, representativeName, remaining, isRepresentativePartner } = useMemo(() => {
        const participants = resolveParticipants(
            broadcast.streamers,
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
            className={cn(
                'group flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-transparent px-3 py-2.5 text-left transition-all duration-200 sm:gap-3',
                toneBg[tone],
                toneHover[tone],
                'hover:bg-card',
                'active:scale-[0.99] active:bg-transparent',
            )}
        >
            {isUndecided ? (
                <span className="w-10 shrink-0 text-[11px] font-semibold text-amber-400 sm:w-11">미정</span>
            ) : (
                <span className="w-10 shrink-0 text-sm font-bold tabular-nums text-text-muted sm:w-11">{startTime}</span>
            )}

            <div className="flex min-w-0 flex-1 items-center gap-1.5">
                {getBroadcastTypeTone(broadcast) !== null && (
                    <BroadcastTypeBadge broadcast={broadcast} />
                )}
                <span className="truncate text-sm font-semibold text-text transition-colors duration-200 dark:group-hover:text-white">{broadcast.title}</span>
                {broadcast.isDrops === true && <Badge variant="primary" size="sm">드롭스</Badge>}
                {broadcast.isChzzkSupport === true && <Badge variant="primary" size="sm">치지직 제작지원</Badge>}
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
                <ParticipantStack participants={sortedParticipants} size="sm" maxVisible={3} />
                <span className="hidden items-center gap-0.5 text-[11px] text-text-dim sm:flex">
                    <span className="max-w-[80px] truncate font-medium">{representativeName}</span>
                    {isRepresentativePartner && <img src={partnerMark} alt="파트너" className="h-3 w-3 shrink-0" loading="lazy" />}
                    {remaining > 0 && <span className="opacity-60">외 {remaining}명</span>}
                </span>
            </div>
        </button>
    )
}

export const WeeklyBroadcastRow = memo(WeeklyBroadcastRowComponent)
