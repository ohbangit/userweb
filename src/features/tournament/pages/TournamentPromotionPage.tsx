import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ChevronUp } from 'lucide-react'
import { Header } from '../../../components/layout'
import { useTournamentPlayers, useTournamentPromotion, useTournamentTeams } from '../hooks'
import { useTournamentDetail, useTournamentDetailV2 } from '../hooks/useTournamentDetail'
import { F1_CIRCUIT_DATA } from '../data/f1Circuit'
import {
    DraftPanelView,
    PlayerListPanelView,
    TeamsPanelView,
    SchedulePanelView,
    FinalResultPanelView,
    TournamentHero,
    F1DriversPanelView,
    F1RaceSchedulePanelView,
    F1RaceResultPanelView,
    F1StandingsPanelView,
    F1QualifyingPanelView,
    F1CircuitPanelView,
    F1TeamDraftPanelView,
} from '../components'
import type {
    DraftContent,
    F1DriversContent,
    F1RaceResultContent,
    F1RaceScheduleContent,
    F1StandingsContent,
    F1QualifyingContent,
    F1TeamDraftContent,
    FinalResultContent,
    OverwatchRole,
    PublicTournamentPlayersResponse,
    PublicPromotionPanel,
    TournamentDetail,
    TournamentDetailV2,
    ScheduleContent,
    TournamentOverwatchMapType,
} from '../types'
import { trackEvent } from '../../../utils/analytics'

const DEFAULT_PANEL_TITLE: Record<string, string> = {
    DRAFT: '드래프트',
    TEAMS: '팀 정보',
    PLAYER_LIST: '참가자',
    SCHEDULE: '일정 & 결과',
    FINAL_RESULT: '최종 결과',
    F1_DRIVERS: '드라이버',
    F1_RACE_SCHEDULE: '레이스 일정',
    F1_RACE_RESULT: '레이스 결과',
    F1_STANDINGS: '챔피언십 순위',
    F1_QUALIFYING: '예선 결과',
    F1_CIRCUIT: '서킷 정보',
    F1_TEAM_DRAFT: '팀 드래프트',
}

type TournamentStatus = 'before' | 'ongoing' | 'ended'

function getTournamentStatusBySchedule(startedAt: string | null, endedAt: string | null): TournamentStatus {
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

interface PanelRendererProps {
    panel: PublicPromotionPanel
    slug: string
    isOverwatch: boolean
    playersData?: PublicTournamentPlayersResponse
    draftParticipants: Array<{
        id: string
        name: string
        channelId: string | null
        position: OverwatchRole | null
        avatarUrl: string | null
        isPartner: boolean
        isCaptain: boolean
    }>
}

function isDefaultExpanded(content: Record<string, unknown>): boolean {
    return content.defaultExpanded === true
}

function isOverwatchGame(game: string): boolean {
    const normalized = game.trim().toUpperCase()
    return normalized === 'OVERWATCH' || normalized === 'OW'
}

function isRacingGame(game: string): boolean {
    const normalized = game.trim().toUpperCase()
    return normalized === 'RACING' || normalized.includes('F1')
}

function toNumberOrNull(value: unknown): number | null {
    return typeof value === 'number' ? value : null
}

function toStringOrNull(value: unknown): string | null {
    return typeof value === 'string' ? value : null
}

function toF1DriversContentFromPlayersApi(response: PublicTournamentPlayersResponse): F1DriversContent {
    return {
        participants: [...response.players]
            .sort((a, b) => a.order - b.order)
            .map((player) => {
                const info = typeof player.info === 'object' && player.info !== null ? (player.info as Record<string, unknown>) : {}

                return {
                    id: String(player.id),
                    streamerId: player.streamerId,
                    name: typeof info.name === 'string' && info.name.length > 0 ? info.name : player.nickname,
                    nickname: player.nickname,
                    avatarUrl: player.avatarUrl,
                    channelUrl: player.channelUrl,
                    isPartner: player.isPartner,
                    driverRole: info.driverRole === 'SECOND' ? 'SECOND' : 'FIRST',
                    tier: toStringOrNull(info.tier),
                    ranking: toNumberOrNull(info.ranking),
                    participationCount: toNumberOrNull(info.participationCount) ?? 0,
                    winCount: toNumberOrNull(info.winCount) ?? 0,
                    carNumber: toNumberOrNull(info.carNumber),
                    secondGroup: player.secondGroup ?? (info.secondGroup === 'A' || info.secondGroup === 'B' ? info.secondGroup : null),
                    qualifyingEliminated: player.qualifyingEliminated ?? info.qualifyingEliminated === true,
                    order: player.order,
                }
            }),
    }
}

function toTournamentDetailFromV2(detailV2: TournamentDetailV2): TournamentDetail {
    return {
        id: 0,
        slug: detailV2.slug,
        name: detailV2.name,
        game: detailV2.game,
        startedAt: detailV2.startedAt,
        endedAt: detailV2.endedAt,
        bannerUrl: detailV2.bannerUrl,
        isActive: detailV2.isActive,
        tags: detailV2.tags,
        isChzzkSupport: detailV2.isChzzkSupport,
        hostName: detailV2.host.name,
        hostAvatarUrl: detailV2.host.avatarUrl,
        hostChannelUrl: detailV2.host.channelUrl,
        hostIsPartner: detailV2.host.isPartner,
        links: detailV2.links,
        description: detailV2.description,
        showDescription: detailV2.showDescription,
        broadcasterName: detailV2.broadcaster.name,
        broadcasterAvatarUrl: detailV2.broadcaster.avatarUrl,
        broadcasterChannelUrl: detailV2.broadcaster.channelUrl,
        broadcasterIsPartner: detailV2.broadcaster.isPartner,
        commentators: detailV2.commentators.map((commentator) => ({
            name: commentator.name ?? '',
            avatarUrl: commentator.avatarUrl,
            channelUrl: commentator.channelUrl,
            isPartner: commentator.isPartner,
            streamerId: null,
        })),
    }
}

function toOverwatchMapType(value: unknown): TournamentOverwatchMapType | null {
    if (value === '쟁탈' || value === '혼합' || value === '밀기' || value === '호위' || value === '플레시포인트') {
        return value
    }
    return null
}

function PanelRenderer({ panel, slug, isOverwatch, playersData, draftParticipants }: PanelRendererProps) {
    const { data: teamsData } = useTournamentTeams(
        slug,
        panel.type === 'PLAYER_LIST' || panel.type === 'SCHEDULE' || panel.type === 'FINAL_RESULT',
    )
    const teams = teamsData?.teams ?? []
    const panelTitle = panel.title_override ?? DEFAULT_PANEL_TITLE[panel.type]

    if (panel.type === 'DRAFT') {
        const content = panel.content as unknown as DraftContent
        return (
            <DraftPanelView
                title={panelTitle}
                content={{
                    startsOn: content.startsOn ?? null,
                    meta: content.meta ?? '',
                    participants: content.participants ?? [],
                }}
            />
        )
    }

    if (panel.type === 'PLAYER_LIST') {
        return (
            <PlayerListPanelView
                title={panelTitle}
                teams={teams}
                participants={draftParticipants}
                defaultExpanded={isDefaultExpanded(panel.content)}
            />
        )
    }

    if (panel.type === 'TEAMS') {
        return <TeamsPanelView title={panelTitle} teams={teams} defaultExpanded={isDefaultExpanded(panel.content)} />
    }

    if (panel.type === 'SCHEDULE') {
        const content = panel.content as unknown as ScheduleContent
        const safeGroups = Array.isArray(content.groups)
            ? content.groups.map((g) => ({
                  ...g,
                  matches: g.matches.map((m) => ({
                      ...m,
                      mvpPlayerIds: Array.isArray(m.mvpPlayerIds) ? m.mvpPlayerIds : [],
                      setMaps: Array.isArray(m.setMaps)
                          ? m.setMaps.map((setMap, index) => ({
                                setNumber: typeof setMap.setNumber === 'number' ? setMap.setNumber : index + 1,
                                mapType: toOverwatchMapType(setMap.mapType) ?? '쟁탈',
                                mapName: typeof setMap.mapName === 'string' ? setMap.mapName : null,
                                scoreA: typeof setMap.scoreA === 'number' ? setMap.scoreA : null,
                                scoreB: typeof setMap.scoreB === 'number' ? setMap.scoreB : null,
                            }))
                          : [],
                  })),
              }))
            : []
        return (
            <SchedulePanelView
                title={panelTitle}
                content={{ groups: safeGroups }}
                teams={teams}
                isOverwatch={isOverwatch}
                defaultExpanded={isDefaultExpanded(panel.content)}
            />
        )
    }

    if (panel.type === 'FINAL_RESULT') {
        const content = panel.content as unknown as FinalResultContent
        return (
            <FinalResultPanelView
                title={panelTitle}
                content={{
                    standings: content.standings ?? [],
                    mvpPlayerId: typeof content.mvpPlayerId === 'number' ? content.mvpPlayerId : null,
                }}
                teams={teams}
                defaultExpanded={isDefaultExpanded(panel.content)}
            />
        )
    }

    if (panel.type === 'F1_DRIVERS') {
        const content =
            playersData === undefined ? (panel.content as unknown as F1DriversContent) : toF1DriversContentFromPlayersApi(playersData)
        return (
            <F1DriversPanelView
                title={panelTitle ?? 'F1 드라이버'}
                content={{ participants: Array.isArray(content.participants) ? content.participants : [] }}
            />
        )
    }

    if (panel.type === 'F1_RACE_SCHEDULE') {
        const content = panel.content as unknown as F1RaceScheduleContent
        return (
            <F1RaceSchedulePanelView
                title={panelTitle ?? '레이스 일정'}
                content={{ races: Array.isArray(content.races) ? content.races : [] }}
                defaultExpanded={isDefaultExpanded(panel.content)}
            />
        )
    }

    if (panel.type === 'F1_RACE_RESULT') {
        const content = panel.content as unknown as F1RaceResultContent
        return (
            <F1RaceResultPanelView
                title={panelTitle ?? '레이스 결과'}
                content={{ races: Array.isArray(content.races) ? content.races : [] }}
                defaultExpanded={isDefaultExpanded(panel.content)}
            />
        )
    }

    if (panel.type === 'F1_STANDINGS') {
        const content = panel.content as unknown as F1StandingsContent
        return (
            <F1StandingsPanelView
                title={panelTitle ?? '쭔중스크스팅 순위'}
                content={{ standings: Array.isArray(content.standings) ? content.standings : [] }}
                defaultExpanded={isDefaultExpanded(panel.content)}
            />
        )
    }

    if (panel.type === 'F1_QUALIFYING') {
        const content = panel.content as unknown as F1QualifyingContent
        return (
            <F1QualifyingPanelView
                title={panelTitle ?? '예선 결과'}
                content={{
                    description: typeof content.description === 'string' ? content.description : '',
                    firstDriverResults: Array.isArray(content.firstDriverResults) ? content.firstDriverResults : [],
                    secondDriverResults: Array.isArray(content.secondDriverResults) ? content.secondDriverResults : [],
                }}
            />
        )
    }

    if (panel.type === 'F1_CIRCUIT') {
        return <F1CircuitPanelView title={panelTitle ?? '서킷 정보'} content={F1_CIRCUIT_DATA} />
    }
    if (panel.type === 'F1_TEAM_DRAFT') {
        const content = panel.content as unknown as F1TeamDraftContent
        return (
            <F1TeamDraftPanelView
                title={panelTitle ?? '팀 드래프트'}
                content={{ teams: Array.isArray(content.teams) ? content.teams : [] }}
            />
        )
    }

    return null
}

export default function TournamentPromotionPage() {
    const { slug } = useParams<{ slug: string }>()
    const resolvedSlug = slug ?? ''
    const [showScrollTop, setShowScrollTop] = useState(false)

    useEffect(() => {
        function handleScroll() {
            setShowScrollTop(window.scrollY > 480)
        }

        handleScroll()
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const { data: detailV1 } = useTournamentDetail(resolvedSlug)
    const { data: detailV2 } = useTournamentDetailV2(resolvedSlug)

    const detailFromV2 = detailV2 === undefined ? undefined : toTournamentDetailFromV2(detailV2)
    const detailForGameDetection = detailFromV2 ?? detailV1
    const shouldUseV2Layout = detailFromV2 !== undefined && isRacingGame(detailForGameDetection?.game ?? '')
    const detail = shouldUseV2Layout ? detailFromV2 : detailV1

    const { data: promotionData, isLoading, isError } = useTournamentPromotion(resolvedSlug)

    const name = detail?.name ?? resolvedSlug
    const bannerUrl = detail?.bannerUrl ?? null
    const startedAt = detail?.startedAt ?? null
    const endedAt = detail?.endedAt ?? null
    const tags = detail?.tags ?? []
    const isChzzkSupport = detail?.isChzzkSupport ?? false
    const hostName = detail?.hostName ?? null
    const hostAvatarUrl = detail?.hostAvatarUrl ?? null
    const hostChannelUrl = detail?.hostChannelUrl ?? null
    const hostIsPartner = detail?.hostIsPartner ?? false
    const links = detail?.links ?? []
    const game = detail?.game ?? ''
    const isOverwatchTournament = detail !== undefined && isOverwatchGame(game)
    const isF1Tournament = detail !== undefined && isRacingGame(game)
    const { data: playersData } = useTournamentPlayers(resolvedSlug, isF1Tournament)
    // 새 필드
    const description = detail?.description ?? null
    const showDescription = detail?.showDescription ?? false
    const broadcasterName = detail?.broadcasterName ?? null
    const broadcasterAvatarUrl = detail?.broadcasterAvatarUrl ?? null
    const broadcasterChannelUrl = detail?.broadcasterChannelUrl ?? null
    const broadcasterIsPartner = detail?.broadcasterIsPartner ?? false
    const commentators = detail?.commentators ?? []

    const seoTitle = `${name} | 오뱅잇`
    const seoDescription = `${name} 대회의 일정, 참가자, 팀 정보, 최종 결과를 한눈에 확인하세요.`
    const seoUrl = typeof window !== 'undefined' ? window.location.href : undefined
    const canonicalUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : undefined
    const tournamentStatus = getTournamentStatusBySchedule(startedAt, endedAt)
    const eventSchema = {
        '@context': 'https://schema.org',
        '@type': 'SportsEvent',
        name,
        description: seoDescription,
        startDate: startedAt ?? undefined,
        endDate: endedAt ?? undefined,
        eventStatus:
            tournamentStatus === 'ended'
                ? 'https://schema.org/EventCompleted'
                : tournamentStatus === 'ongoing'
                  ? 'https://schema.org/EventInProgress'
                  : 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
        image: bannerUrl !== null ? [bannerUrl] : undefined,
        url: seoUrl,
        organizer:
            hostName !== null
                ? {
                      '@type': 'Organization',
                      name: hostName,
                      url: hostChannelUrl ?? undefined,
                  }
                : undefined,
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#020d18]">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#0596e8] border-t-transparent" />
            </div>
        )
    }

    if (isError || promotionData === null || promotionData === undefined) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#020d18]">
                <span className="text-5xl">📭</span>
                <p className="text-sm text-[#6aadcc]">프로모션 정보를 불러올 수 없습니다.</p>
            </div>
        )
    }

    const visiblePanels = promotionData.panels
        .filter((panel) => panel.enabled && !panel.hidden)
        .sort((a, b) => a.order_index - b.order_index)

    const panelNavItems = visiblePanels.map((panel) => ({
        id: `panel-${panel.id}`,
        label: panel.title_override ?? DEFAULT_PANEL_TITLE[panel.type],
    }))

    const draftPanel = promotionData.panels.find((panel) => panel.type === 'DRAFT')
    const rawDraftParticipants =
        draftPanel !== undefined &&
        typeof draftPanel.content === 'object' &&
        draftPanel.content !== null &&
        'participants' in draftPanel.content &&
        Array.isArray((draftPanel.content as Record<string, unknown>).participants)
            ? ((draftPanel.content as Record<string, unknown>).participants as unknown[])
            : []
    const draftParticipants = rawDraftParticipants
        .reduce<
            Array<{
                id: string
                name: string
                channelId: string | null
                position: OverwatchRole | null
                avatarUrl: string | null
                isPartner: boolean
                isCaptain: boolean
                order: number
            }>
        >((acc, item, index) => {
            if (typeof item !== 'object' || item === null) return acc
            const participant = item as Record<string, unknown>
            if (typeof participant.id !== 'string' || typeof participant.name !== 'string') return acc
            acc.push({
                id: participant.id,
                name: participant.name,
                channelId: typeof participant.channelId === 'string' ? participant.channelId : null,
                position: (['TNK', 'DPS', 'SPT'] as const).includes(participant.position as OverwatchRole)
                    ? (participant.position as OverwatchRole)
                    : null,
                avatarUrl: typeof participant.avatarUrl === 'string' ? participant.avatarUrl : null,
                isPartner: participant.isPartner === true,
                isCaptain: participant.isCaptain === true,
                order: typeof participant.order === 'number' ? participant.order : index,
            })
            return acc
        }, [])
        .sort((a, b) => a.order - b.order)
        .map(({ id, name: pName, channelId, position, avatarUrl, isPartner, isCaptain }) => ({
            id,
            name: pName,
            channelId,
            position,
            avatarUrl,
            isPartner,
            isCaptain,
        }))

    return (
        <div className="min-h-screen bg-[#020d18]">
            <Header />
            <Helmet>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDescription} />
                <meta
                    name="keywords"
                    content={isF1Tournament ? `${name}, F1, 레이스, 대회, 오뼱잋` : `${name}, 오버워치, 대회, 이스포츠, 오뼱잋`}
                />
                <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
                <meta name="googlebot" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
                {canonicalUrl !== undefined && <link rel="canonical" href={canonicalUrl} />}
                <meta property="og:type" content="website" />
                <meta property="og:locale" content="ko_KR" />
                <meta property="og:title" content={seoTitle} />
                <meta property="og:description" content={seoDescription} />
                {seoUrl !== undefined && <meta property="og:url" content={seoUrl} />}
                <meta property="og:image" content={bannerUrl ?? ''} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={seoTitle} />
                <meta name="twitter:description" content={seoDescription} />
                <meta name="twitter:image" content={bannerUrl ?? ''} />
                <script type="application/ld+json">{JSON.stringify(eventSchema)}</script>
            </Helmet>

            <div className="font-koverwatch italic">
                <TournamentHero
                    name={name}
                    game={game}
                    bannerUrl={bannerUrl}
                    startedAt={startedAt}
                    endedAt={endedAt}
                    tags={tags}
                    isChzzkSupport={isChzzkSupport}
                    hostName={hostName}
                    hostAvatarUrl={hostAvatarUrl}
                    hostChannelUrl={hostChannelUrl}
                    hostIsPartner={hostIsPartner}
                    broadcasterName={broadcasterName}
                    broadcasterAvatarUrl={broadcasterAvatarUrl}
                    broadcasterChannelUrl={broadcasterChannelUrl}
                    broadcasterIsPartner={broadcasterIsPartner}
                    commentators={commentators}
                    links={links}
                    slug={resolvedSlug}
                />
                {/* 부가 설명 */}

                <div className="px-4 py-8">
                    {showDescription && description !== null && description.length > 0 && (
                        <div className="mx-auto max-w-5xl pb-8">
                            <p className="text-xl text-[#6aadcc] opacity-70 whitespace-pre-wrap break-words">{description}</p>
                            <div className="mt-6 h-px bg-[#1e3a5f]/50" />
                        </div>
                    )}
                    <div className="mx-auto max-w-5xl space-y-4">
                        {visiblePanels.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-3 py-20">
                                <span className="text-5xl">🔜</span>
                                <p className="text-sm text-[#6aadcc]">준비 중입니다.</p>
                            </div>
                        ) : (
                            visiblePanels.map((panel) => (
                                <section key={panel.id} id={`panel-${panel.id}`} className="scroll-mt-24">
                                    <PanelRenderer
                                        panel={panel}
                                        slug={resolvedSlug}
                                        isOverwatch={isOverwatchTournament}
                                        playersData={playersData}
                                        draftParticipants={draftParticipants}
                                    />
                                </section>
                            ))
                        )}
                    </div>

                    {panelNavItems.length > 0 && (
                        <nav aria-label="콘텐츠 목록" className="fixed right-4 top-24 z-10 hidden w-32 min-[1440px]:block">
                            <div className="p-1">
                                <p className="mb-2 text-[10px] font-black tracking-[0.2em] text-[#0596e8]/80">CONTENTS</p>
                                <ul className="space-y-1.5">
                                    {panelNavItems.map((item) => (
                                        <li key={item.id}>
                                            <a
                                                href={`#${item.id}`}
                                                onClick={() => {
                                                    trackEvent('tournament_panel_nav_click', {
                                                        slug: resolvedSlug,
                                                        panel_label: item.label,
                                                        panel_id: item.id,
                                                    })
                                                }}
                                                className="block rounded-md px-2 py-1.5 text-sm text-[#6aadcc]/60 transition hover:text-[#e8f4fd]"
                                            >
                                                {item.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </nav>
                    )}
                </div>

                {showScrollTop && (
                    <button
                        type="button"
                        onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        aria-label="맨 위로 이동"
                        className="fixed bottom-6 right-6 z-50 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#062035] text-[#6aadcc] ring-1 ring-[#1e3a5f] transition hover:bg-[#07304f] hover:text-[#e8f4fd]"
                    >
                        <ChevronUp className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    )
}
