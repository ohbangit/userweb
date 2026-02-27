import { Calendar, ExternalLink } from 'lucide-react'
import overwatchSrc from '../../../assets/overwatch.png'
import partnerMark from '../../../assets/mark.png'

interface TournamentLink {
    label: string
    url: string
}

interface TournamentHeroProps {
    name: string
    bannerUrl: string | null
    startedAt: string | null
    endedAt: string | null
    isActive: boolean
    tags: string[]
    isChzzkSupport: boolean
    hostName: string | null
    hostAvatarUrl: string | null
    hostChannelUrl: string | null
    hostIsPartner: boolean
    links: TournamentLink[]
}

type TournamentStatus = 'before' | 'ongoing' | 'ended'

function getTournamentStatus(
    startedAt: string | null,
    endedAt: string | null,
    isActive: boolean,
): TournamentStatus {
    const now = new Date()
    if (endedAt !== null && new Date(endedAt) < now) return 'ended'
    if (isActive || (startedAt !== null && new Date(startedAt) <= now))
        return 'ongoing'
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

const STATUS_CONFIG: Record<
    TournamentStatus,
    { label: string; className: string; dot: string | null }
> = {
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

export function TournamentHero({
    name,
    bannerUrl,
    startedAt,
    endedAt,
    isActive,
    tags,
    isChzzkSupport,
    hostName,
    hostAvatarUrl,
    hostChannelUrl,
    hostIsPartner,
    links,
}: TournamentHeroProps) {
    const hasBanner = bannerUrl !== null && bannerUrl.length > 0
    const status = getTournamentStatus(startedAt, endedAt, isActive)
    const statusConfig = STATUS_CONFIG[status]

    return (
        <div
            className="relative flex min-h-[320px] w-full items-end md:min-h-[320px]"
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
                <div className="absolute inset-0 bg-gradient-to-b from-[#020d18]/60 via-[#020d18]/70 to-[#020d18]" />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#031a2e] via-[#052040] to-[#020d18]" />
            )}

            {/* 장식 요소 */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#0596e8]/5 blur-3xl" />
                <div className="absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-[#f4930d]/5 blur-3xl" />
            </div>

            {/* 콘텐츠 */}
            <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-8 md:pb-10">
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
                        <div
                            key={tag}
                            className="rounded-full border border-[#1e3a5f] bg-[#041524]/60 px-3 py-1 text-xs text-[#6aadcc]"
                        >
                            {tag}
                        </div>
                    ))}

                    {/* 상태 배지 */}
                    <div
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusConfig.className}`}
                    >
                        {statusConfig.dot !== null && (
                            <span className="relative flex h-2 w-2">
                                <span
                                    className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${statusConfig.dot}`}
                                />
                                <span
                                    className={`relative inline-flex h-2 w-2 rounded-full ${statusConfig.dot}`}
                                />
                            </span>
                        )}
                        {statusConfig.label}
                    </div>
                </div>

                {/* 대회명 + OW 아이콘 */}
                <div className="mt-1 flex items-end gap-3 md:gap-4">
                    <img
                        src={overwatchSrc}
                        alt=""
                        aria-hidden="true"
                        className="h-9 w-9 drop-shadow-lg md:h-12 md:w-12"
                    />
                    <h1 className="font-koverwatch text-3xl leading-[0.95] font-black text-white drop-shadow-lg md:text-5xl">
                        {name}
                    </h1>
                </div>

                {/* 기간 */}
                {(startedAt !== null || endedAt !== null) && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-[#6aadcc]">
                        <Calendar className="h-4 w-4 text-[#0596e8]" />
                        <span>
                            {startedAt !== null ? formatDate(startedAt) : '?'}
                            {endedAt !== null
                                ? ` ~ ${formatDate(endedAt)}`
                                : ''}
                        </span>
                    </div>
                )}

                {/* 하단 구분선 */}
                <div className="mt-6 h-px w-full bg-gradient-to-r from-[#0596e8]/60 via-[#1e3a5f]/40 to-transparent" />

                {/* 주최 스트리머 */}
                {hostName !== null && (
                    <div className="mt-3 flex items-center gap-3">
                        {hostAvatarUrl !== null && (
                            <img
                                src={hostAvatarUrl}
                                alt={hostName}
                                className="h-9 w-9 rounded-full ring-2 ring-[#1e3a5f]"
                            />
                        )}
                        <div className="flex items-center gap-2">
                            {hostChannelUrl !== null ? (
                                <a
                                    href={hostChannelUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-base font-semibold text-white transition-colors hover:text-primary"
                                >
                                    {hostName}
                                </a>
                            ) : (
                                <span className="text-base font-semibold text-white">
                                    {hostName}
                                </span>
                            )}
                            {hostIsPartner && (
                                <span
                                    className="inline-flex items-center"
                                    aria-label="파트너 스트리머"
                                    title="파트너 스트리머"
                                >
                                    <img
                                        src={partnerMark}
                                        alt="파트너"
                                        className="h-3.5 w-3.5"
                                        loading="lazy"
                                    />
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* 추가 링크 */}
                {links.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {links.map((link, i) => (
                            <a
                                key={i}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 rounded-full border border-[#1e3a5f] bg-[#041524]/80 px-3 py-1 text-xs text-[#6aadcc] transition-colors hover:border-[#0596e8] hover:text-white"
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
