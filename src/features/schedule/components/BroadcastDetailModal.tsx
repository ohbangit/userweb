import { useMemo } from 'react'
import dayjs from 'dayjs'
import { X, Gamepad2, Users, Crown } from 'lucide-react'
import type { Broadcast, Participant } from '../types/schedule'
import type { CardTone } from '../constants/cardTone'
import { useBroadcastDetail } from '../hooks/useBroadcastDetail'
import { formatTime, getDayName } from '../utils/date'
import { getInitial, sortParticipants } from '../utils/participant'
import { getBroadcastTypeTone } from './BroadcastTypeBadge'
import { useModalKeydown } from '../../../hooks/useModalKeydown'
import chzzkIcon from '../../../assets/chzzk_icon.png'
import youtubeIcon from '../../../assets/youtube.png'
import cafeIcon from '../../../assets/cafe.png'
import partnerMark from '../../../assets/mark.png'
import { Badge } from '../../../components/ui/Badge'
import { AffiliationBadge } from '../../../app/components/AffiliationBadge'
import { MatchSetsPanel } from './overwatch'
import { cn } from '../../../lib/cn'

interface BroadcastDetailModalProps {
    broadcast: Broadcast | null
    onClose: () => void
}

// ---------------------------------------------------------------------------
// Hero 그라데이션 — 카드 톤의 강화 버전
// ---------------------------------------------------------------------------

const heroGradient: Record<CardTone, string> = {
    collab: 'bg-[linear-gradient(180deg,rgba(139,92,246,0.15)_0%,transparent_100%)]',
    internal: 'bg-[linear-gradient(180deg,rgba(244,63,94,0.15)_0%,transparent_100%)]',
    tournament: 'bg-[linear-gradient(180deg,rgba(245,158,11,0.15)_0%,transparent_100%)]',
    content: 'bg-[linear-gradient(180deg,rgba(14,165,233,0.15)_0%,transparent_100%)]',
    default: 'bg-[linear-gradient(180deg,rgba(148,163,184,0.08)_0%,transparent_100%)]',
}

// ---------------------------------------------------------------------------
// 참여자 카드 (가로 스크롤용)
// ---------------------------------------------------------------------------

/** 채널 링크 아이콘 버튼 */
function ChannelLink({ href, icon, alt }: { href: string; icon: string; alt: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/40 bg-card/70 transition-colors hover:border-primary/40 hover:bg-primary/10"
            aria-label={`${alt} 열기`}
        >
            <img src={icon} alt={alt} className="h-3.5 w-3.5" loading="lazy" />
        </a>
    )
}

/**
 * 참여자 카드 — 가로 스크롤 컨테이너 내 개별 카드
 * 아바타 · 이름 · 주최/파트너/소속 · 채널 아이콘
 */
function ParticipantCard({
    participant,
    fallbackAvatarUrl,
    fallbackChannelUrl,
}: {
    participant: Participant
    fallbackAvatarUrl?: string
    fallbackChannelUrl?: string
}) {
    const avatarUrl = participant.avatarUrl ?? fallbackAvatarUrl
    const displayName = participant.nickname ?? participant.name
    const channelUrl = participant.channelUrl ?? fallbackChannelUrl
    const affiliations = participant.affiliations ?? []
    const hasChannels = channelUrl || participant.youtubeUrl || participant.fanCafeUrl

    return (
        <div className="flex w-32 shrink-0 flex-col items-center gap-2 rounded-2xl bg-bg-secondary/50 px-3 py-3.5 sm:w-36">
            {/* 아바타 */}
            <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-border/40 bg-bg-secondary">
                {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                    <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-text-dim">
                        {getInitial(displayName)}
                    </span>
                )}
            </div>

            {/* 이름 + 뱃지 */}
            <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1">
                    <span className="max-w-[100px] truncate text-xs font-semibold text-text">{displayName}</span>
                    {participant.isPartner && (
                        <img src={partnerMark} alt="파트너" className="h-3 w-3 shrink-0" loading="lazy" />
                    )}
                </div>
                {participant.isHost && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-semibold text-primary">
                        <Crown className="h-2.5 w-2.5" />
                        주최
                    </span>
                )}
                {affiliations.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-0.5">
                        {affiliations.map((aff) => (
                            <AffiliationBadge key={aff.id} affiliation={aff} size="sm" />
                        ))}
                    </div>
                )}
            </div>

            {/* 채널 아이콘 */}
            {hasChannels && (
                <div className="flex items-center gap-1">
                    {channelUrl && <ChannelLink href={channelUrl} icon={chzzkIcon} alt="치지직" />}
                    {participant.youtubeUrl && <ChannelLink href={participant.youtubeUrl} icon={youtubeIcon} alt="유튜브" />}
                    {participant.fanCafeUrl && <ChannelLink href={participant.fanCafeUrl} icon={cafeIcon} alt="팬카페" />}
                </div>
            )}
        </div>
    )
}

// ---------------------------------------------------------------------------
// 메인 모달
// ---------------------------------------------------------------------------

/**
 * 방송 상세 모달
 * hero 헤더(유형별 그라데이션 + 제목 + 시간 + 메타 칩) + 섹션 기반 스크롤 콘텐츠
 */
export function BroadcastDetailModal({ broadcast, onClose }: BroadcastDetailModalProps) {
    const { data: detailData } = useBroadcastDetail(broadcast?.id ?? null)
    const displayBroadcast: Broadcast | null = detailData ?? broadcast
    useModalKeydown(displayBroadcast !== null, onClose)

    const sortedParticipants = useMemo(() => {
        if (!displayBroadcast) return []
        const participants: Participant[] =
            displayBroadcast.streamers && displayBroadcast.streamers.length > 0
                ? displayBroadcast.streamers
                : [
                      {
                          name: displayBroadcast.streamerName,
                          nickname: displayBroadcast.streamerNickname,
                      },
                  ]
        return sortParticipants(participants)
    }, [displayBroadcast])

    if (!displayBroadcast) return null

    const date = dayjs(displayBroadcast.startTime)
    const startTime = formatTime(displayBroadcast.startTime)
    const isUndecided = displayBroadcast.startTime === null
    const dayName = getDayName(date)
    const dateLabel = isUndecided ? '날짜 미정' : `${date.month() + 1}월 ${date.date()}일 (${dayName})`
    const categoryName = displayBroadcast.category?.name ?? undefined
    const tags = displayBroadcast.tags ?? []
    const tone: CardTone = getBroadcastTypeTone(displayBroadcast) ?? 'default'

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} role="presentation" />

            <div
                className="relative flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-2xl border border-border/40 bg-bg shadow-[0_-8px_40px_rgba(0,0,0,0.3)] sm:max-h-[80vh] sm:max-w-lg sm:rounded-2xl sm:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
                role="dialog"
                aria-modal="true"
                aria-label={displayBroadcast.title}
            >
                {/* ─── Hero 헤더 ─── */}
                <div className={cn('relative shrink-0 px-5 pt-4 pb-4', heroGradient[tone])}>
                    {/* 유형 뱃지 + 닫기 */}
                    <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            {tone !== 'default' && (
                                <Badge
                                    variant={tone === 'collab' ? 'collab' : tone === 'internal' ? 'internal' : tone === 'tournament' ? 'tournament' : 'content'}
                                    size="md"
                                >
                                    {tone === 'collab' ? '합방' : tone === 'internal' ? '내전' : tone === 'tournament' ? '대회' : '콘텐츠'}
                                </Badge>
                            )}
                            {displayBroadcast.isDrops === true && <Badge variant="primary" size="sm">드롭스</Badge>}
                            {displayBroadcast.isChzzkSupport === true && <Badge variant="primary" size="sm">제작지원</Badge>}
                        </div>
                        <button
                            onClick={onClose}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-text-muted transition-colors hover:bg-card-hover hover:text-text"
                            aria-label="닫기"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* 제목 */}
                    <h2 className="text-lg font-bold leading-snug text-text sm:text-xl">
                        {displayBroadcast.title}
                    </h2>

                    {/* 날짜 · 시간 · 카테고리 인라인 */}
                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-muted">
                        <span>{dateLabel}</span>
                        <span className="text-border">·</span>
                        {isUndecided ? (
                            <span className="font-semibold text-amber-400">시간 미정</span>
                        ) : (
                            <span className="font-semibold text-text">{startTime}</span>
                        )}
                        {categoryName !== undefined && (
                            <>
                                <span className="text-border">·</span>
                                <span className="inline-flex items-center gap-1">
                                    <Gamepad2 className="h-3.5 w-3.5" />
                                    {categoryName}
                                </span>
                            </>
                        )}
                    </div>

                    {/* 태그 칩 */}
                    {tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {tags.map((tag) => (
                                <Badge key={tag} variant="outline">#{tag}</Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* ─── 스크롤 콘텐츠 ─── */}
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    <div className="space-y-5 px-5 py-4">
                        {/* § 오버워치 매치 */}
                        {displayBroadcast.overwatchMatch != null && (
                            <section>
                                <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-dim">
                                    <span>⚔</span>
                                    세트 구성
                                </h3>
                                <MatchSetsPanel match={displayBroadcast.overwatchMatch} />
                            </section>
                        )}

                        {/* § 참여자 — 가로 스크롤 */}
                        <section>
                            <h3 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-dim">
                                <Users className="h-3.5 w-3.5" />
                                참여자 ({sortedParticipants.length})
                            </h3>
                            <div className="-mx-5 px-5">
                                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
                                    {sortedParticipants.map((participant, index) => (
                                        <ParticipantCard
                                            key={`${participant.name}-${index}`}
                                            participant={participant}
                                            fallbackAvatarUrl={
                                                participant.name === displayBroadcast.streamerName
                                                    ? (displayBroadcast.streamerProfileUrl ?? undefined)
                                                    : undefined
                                            }
                                            fallbackChannelUrl={
                                                participant.name === displayBroadcast.streamerName
                                                    ? (displayBroadcast.streamerChannelUrl ?? undefined)
                                                    : undefined
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* § 추후 섹션 자리 (시청자 수, 출처, 썸네일, 다시보기 등) */}
                    </div>
                </div>

                {/* ─── 모바일 닫기 버튼 ─── */}
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
