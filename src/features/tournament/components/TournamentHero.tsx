import { Calendar, ExternalLink, Radio, Mic2, Crown } from 'lucide-react'
import overwatchSrc from '../../../assets/overwatch.png'
import f1CarSrc from '../../../assets/f1_car.svg'
import partnerMark from '../../../assets/mark.png'

import { trackEvent } from '../../../utils/analytics'

interface TournamentLink {
    label: string
    url: string
}

interface CommentatorItem {
    name: string
    avatarUrl: string | null
    channelUrl: string | null
    isPartner: boolean
}

interface TournamentHeroProps {
    name: string
    game: string
    bannerUrl: string | null
    startedAt: string | null
    endedAt: string | null
    tags: string[]
    isChzzkSupport: boolean
    // 주최자
    hostName: string | null
    hostAvatarUrl: string | null
    hostChannelUrl: string | null
    hostIsPartner: boolean
    // 중계자 (주최자와 별도로 중계하는 경우)
    broadcasterName?: string | null
    broadcasterAvatarUrl?: string | null
    broadcasterChannelUrl?: string | null
    broadcasterIsPartner?: boolean
    // 해설진 (선택, 1명 이상)
    commentators?: CommentatorItem[]
    links: TournamentLink[]
    slug: string
    heroTopLogoSrc?: string
    heroTopLogoAlt?: string
}

type TournamentStatus = 'before' | 'ongoing' | 'ended'

function getTournamentStatus(startedAt: string | null, endedAt: string | null): TournamentStatus {
    const now = new Date()

    if (endedAt !== null) {
        const endedDate = new Date(endedAt)
        endedDate.setHours(23, 59, 59, 999)
        if (endedDate < now) return 'ended'
    }

    if (startedAt !== null) {
        const startedDate = new Date(startedAt)
        startedDate.setHours(0, 0, 0, 0)
        if (startedDate <= now) return 'ongoing'
    }

    return 'before'
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

const STATUS_CONFIG: Record<TournamentStatus, { label: string; className: string; dot: string | null }> = {
    before: {
        label: '진행전',
        className: 'border-gray-600/40 bg-gray-500/10 text-gray-400',
        dot: null,
    },
    ongoing: {
        label: '진행중',
        className: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
        dot: 'bg-amber-400',
    },
    ended: {
        label: '진행종료',
        className: 'border-[#1e3a5f] bg-[#0596e8]/10 text-[#6aadcc]',
        dot: null,
    },
}

function isRacingGame(game: string): boolean {
    const normalized = game.trim().toUpperCase()
    return normalized === 'RACING' || normalized.includes('F1')
}

/** 주최/중계/해설 공통 인물 행 */
function PersonRow({
    name,
    avatarUrl,
    channelUrl,
    isPartner,
    ringClass,
    nameHoverClass,
}: {
    name: string
    avatarUrl: string | null
    channelUrl: string | null
    isPartner: boolean
    ringClass: string
    nameHoverClass: string
}) {
    const inner = (
        <div className="flex items-center gap-2">
            {avatarUrl !== null && (
                <img src={avatarUrl} alt={name} className={['h-8 w-8 rounded-full ring-2', ringClass].join(' ')} loading="lazy" />
            )}
            <span className={['text-sm font-semibold text-white transition-colors', nameHoverClass].join(' ')}>{name}</span>
            {isPartner && (
                <span className="inline-flex items-center" aria-label="파트너 스트리머" title="파트너 스트리머">
                    <img src={partnerMark} alt="파트너" className="h-3.5 w-3.5" loading="lazy" />
                </span>
            )}
        </div>
    )

    if (channelUrl !== null) {
        return (
            <a href={channelUrl} target="_blank" rel="noopener noreferrer" className="group">
                {inner}
            </a>
        )
    }
    return <div>{inner}</div>
}

export function TournamentHero({
    name,
    game,
    bannerUrl,
    startedAt,
    endedAt,
    tags,
    isChzzkSupport,
    hostName,
    hostAvatarUrl,
    hostChannelUrl,
    hostIsPartner,
    broadcasterName,
    broadcasterAvatarUrl,
    broadcasterChannelUrl,
    broadcasterIsPartner = false,
    commentators = [],
    links,
    slug,
    heroTopLogoSrc,
    heroTopLogoAlt = '',
}: TournamentHeroProps) {
    const hasBanner = bannerUrl !== null && bannerUrl.length > 0
    const status = getTournamentStatus(startedAt, endedAt)
    const statusConfig = STATUS_CONFIG[status]
    const isF1 = isRacingGame(game)
    const tagClass = isF1 ? 'border-[#5a1515]/80 bg-[#1a0808]/80 text-[#ffb3af]' : 'border-[#1e3a5f] bg-[#041524]/60 text-[#6aadcc]'
    const accentLabelClass = isF1 ? 'text-[#E10600]/80' : 'text-[#0596e8]/80'
    const personRingClass = isF1 ? 'ring-[#E10600]/40' : 'ring-[#1e3a5f]'
    const personHoverClass = isF1 ? 'group-hover:text-[#ffb3af]' : 'group-hover:text-primary'
    const linkClass = isF1
        ? 'border-[#5a1515]/80 bg-[#1a0808]/80 text-[#ffb3af] hover:border-[#E10600] hover:text-white'
        : 'border-[#1e3a5f] bg-[#041524]/80 text-[#6aadcc] hover:border-[#0596e8] hover:text-white'
    const statusClassName = status === 'ended' && isF1 ? 'border-[#E10600]/40 bg-[#E10600]/10 text-[#ff8a80]' : statusConfig.className
    const calendarIconClass = isF1 ? 'text-[#E10600]' : 'text-[#0596e8]'

    const hasBroadcaster = broadcasterName !== undefined && broadcasterName !== null && broadcasterName.length > 0
    const hasCommentators = commentators.length > 0

    return (
        <div
            className="relative flex min-h-[340px] w-full items-end pt-10 md:min-h-[380px]"
            style={
                hasBanner
                    ? {
                          backgroundImage: `url(${bannerUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                      }
                    : undefined
            }
        >
            {/* 배경 처리 */}
            {hasBanner ? (
                <div
                    className={[
                        'absolute inset-0 bg-gradient-to-b',
                        isF1 ? 'from-[#2a0304]/55 via-[#17050a]/72 to-[#05080f]' : 'from-[#020d18]/60 via-[#020d18]/70 to-[#020d18]',
                    ].join(' ')}
                />
            ) : (
                <div
                    className={[
                        'absolute inset-0 bg-gradient-to-br',
                        isF1 ? 'from-[#2a0304] via-[#16070f] to-[#020d18]' : 'from-[#031a2e] via-[#052040] to-[#020d18]',
                    ].join(' ')}
                />
            )}

            {/* 장식 요소 */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className={[
                        'absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl',
                        isF1 ? 'bg-[#E10600]/5' : 'bg-[#0596e8]/5',
                    ].join(' ')}
                />
                <div
                    className={[
                        'absolute -left-16 bottom-0 h-48 w-48 rounded-full blur-3xl',
                        isF1 ? 'bg-[#F5C842]/5' : 'bg-[#f4930d]/5',
                    ].join(' ')}
                />
            </div>

            {/* 콘텐츠 */}
            <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-8 md:pb-10 pt-2">
                {/* 배지 영역 */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    {/* 치지직 제작지원 */}
                    {isChzzkSupport && (
                        <div className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            <span>치지직 제작지원</span>
                        </div>
                    )}

                    {/* 텍스트 태그 */}
                    {tags.map((tag) => (
                        <div key={tag} className={['rounded-full border px-3 py-1 text-xs', tagClass].join(' ')}>
                            {tag}
                        </div>
                    ))}

                    {/* 상태 배지 */}
                    <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusClassName}`}>
                        {statusConfig.dot !== null && (
                            <span className="relative flex h-2 w-2">
                                <span
                                    className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${statusConfig.dot}`}
                                />
                                <span className={`relative inline-flex h-2 w-2 rounded-full ${statusConfig.dot}`} />
                            </span>
                        )}
                        {statusConfig.label}
                    </div>
                </div>

                {isF1 && heroTopLogoSrc !== undefined ? (
                    <div className="mt-1">
                        <img src={heroTopLogoSrc} alt={heroTopLogoAlt} className="h-12 w-auto drop-shadow-lg md:h-16" />
                        <h1 className="mt-3 font-koverwatch text-3xl leading-[0.95] font-black text-white drop-shadow-lg md:text-5xl">
                            {name}
                        </h1>
                    </div>
                ) : (
                    <div className="mt-1 flex items-end gap-3 md:gap-4">
                        {isF1 ? (
                            <img src={f1CarSrc} alt="" aria-hidden="true" className="h-9 w-auto drop-shadow-lg md:h-12" />
                        ) : (
                            <img src={overwatchSrc} alt="" aria-hidden="true" className="h-9 w-9 drop-shadow-lg md:h-12 md:w-12" />
                        )}
                        <h1 className="font-koverwatch text-3xl leading-[0.95] font-black text-white drop-shadow-lg md:text-5xl">{name}</h1>
                    </div>
                )}

                {/* 기간 */}
                {(startedAt !== null || endedAt !== null) && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-[#6aadcc]">
                        <Calendar className={['h-4 w-4', calendarIconClass].join(' ')} />
                        <span>
                            {startedAt !== null ? formatDate(startedAt) : '?'}
                            {endedAt !== null ? ` ~ ${formatDate(endedAt)}` : ''}
                        </span>
                    </div>
                )}

                {/* 하단 구분선 */}
                <div
                    className={[
                        'mt-6 h-px w-full bg-gradient-to-r to-transparent',
                        isF1 ? 'from-[#E10600]/60 via-[#7a0300]/40' : 'from-[#0596e8]/60 via-[#1e3a5f]/40',
                    ].join(' ')}
                />

                {/* 주최자 / 중계 / 해설진 정보 */}
                {(hostName !== null || hasBroadcaster || hasCommentators) && (
                    <div className="mt-4 space-y-3">
                        {/* 주최 */}
                        {hostName !== null && (
                            <div className="flex items-center gap-3">
                                <span
                                    className={['flex w-16 shrink-0 items-center gap-1.5 text-xs font-semibold', accentLabelClass].join(
                                        ' ',
                                    )}
                                >
                                    <Crown className="h-3 w-3" />
                                    주최
                                </span>
                                <PersonRow
                                    name={hostName}
                                    avatarUrl={hostAvatarUrl}
                                    channelUrl={hostChannelUrl}
                                    isPartner={hostIsPartner}
                                    ringClass={personRingClass}
                                    nameHoverClass={personHoverClass}
                                />
                            </div>
                        )}

                        {/* 중계 */}
                        {hasBroadcaster && (
                            <div className="flex items-center gap-3">
                                <span
                                    className={['flex w-16 shrink-0 items-center gap-1.5 text-xs font-semibold', accentLabelClass].join(
                                        ' ',
                                    )}
                                >
                                    <Radio className="h-3 w-3" />
                                    중계
                                </span>
                                <PersonRow
                                    name={broadcasterName!}
                                    avatarUrl={broadcasterAvatarUrl ?? null}
                                    channelUrl={broadcasterChannelUrl ?? null}
                                    isPartner={broadcasterIsPartner}
                                    ringClass={personRingClass}
                                    nameHoverClass={personHoverClass}
                                />
                            </div>
                        )}

                        {/* 해설진 */}
                        {hasCommentators && (
                            <div className="flex items-start gap-3">
                                <span
                                    className={[
                                        'flex w-16 shrink-0 items-center gap-1.5 pt-1 text-xs font-semibold',
                                        accentLabelClass,
                                    ].join(' ')}
                                >
                                    <Mic2 className="h-3 w-3" />
                                    해설
                                </span>
                                <div className="flex flex-wrap gap-3">
                                    {commentators.map((commentator, index) => (
                                        <PersonRow
                                            key={`${commentator.name}-${index}`}
                                            name={commentator.name}
                                            avatarUrl={commentator.avatarUrl}
                                            channelUrl={commentator.channelUrl}
                                            isPartner={commentator.isPartner}
                                            ringClass={personRingClass}
                                            nameHoverClass={personHoverClass}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 추가 링크 */}
                {links.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                        {links.map((link, i) => (
                            <a
                                key={i}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => {
                                    trackEvent('tournament_link_click', {
                                        slug,
                                        link_label: link.label,
                                        link_url: link.url,
                                    })
                                }}
                                className={[
                                    'flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors',
                                    linkClass,
                                ].join(' ')}
                            >
                                <ExternalLink className="h-3 w-3" />
                                {link.label}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
