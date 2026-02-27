import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ChevronUp } from 'lucide-react'
import { Header } from '../../../app/components/Header'
import { useTournamentPromotion, useTournamentTeams } from '../hooks'
import { useTournamentDetail } from '../hooks/useTournamentDetail'
import {
    DraftPanelView,
    PlayerListPanelView,
    TeamsPanelView,
    SchedulePanelView,
    FinalResultPanelView,
    TournamentHero,
} from '../components'
import type {
    DraftContent,
    OverwatchRole,
    ScheduleContent,
    FinalResultContent,
    PublicPromotionPanel,
} from '../types'

const DEFAULT_PANEL_TITLE: Record<string, string> = {
    DRAFT: '드래프트',
    TEAMS: '팀 정보',
    PLAYER_LIST: '참가자',
    SCHEDULE: '일정 & 결과',
    FINAL_RESULT: '최종 결과',
}

interface PanelRendererProps {
    panel: PublicPromotionPanel
    slug: string
    draftParticipants: Array<{
        id: string
        name: string
        position: OverwatchRole | null
        avatarUrl: string | null
        isPartner: boolean
    }>
}

function PanelRenderer({ panel, slug, draftParticipants }: PanelRendererProps) {
    const { data: teamsData } = useTournamentTeams(
        slug,
        panel.type === 'PLAYER_LIST' ||
            panel.type === 'SCHEDULE' ||
            panel.type === 'FINAL_RESULT',
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
            />
        )
    }

    if (panel.type === 'TEAMS') {
        return <TeamsPanelView title={panelTitle} teams={teams} />
    }

    if (panel.type === 'SCHEDULE') {
        const content = panel.content as unknown as ScheduleContent
        return (
            <SchedulePanelView
                title={panelTitle}
                content={{ groups: content.groups ?? [] }}
                teams={teams}
            />
        )
    }

    if (panel.type === 'FINAL_RESULT') {
        const content = panel.content as unknown as FinalResultContent
        return (
            <FinalResultPanelView
                title={panelTitle}
                content={{ standings: content.standings ?? [] }}
                teams={teams}
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

    const { data: detail } = useTournamentDetail(resolvedSlug)
    const {
        data: promotionData,
        isLoading,
        isError,
    } = useTournamentPromotion(resolvedSlug)

    const name = detail?.name ?? resolvedSlug
    const bannerUrl = detail?.bannerUrl ?? null
    const startedAt = detail?.startedAt ?? null
    const endedAt = detail?.endedAt ?? null
    const isActive = detail?.isActive ?? false
    const tags = detail?.tags ?? []
    const isChzzkSupport = detail?.isChzzkSupport ?? false
    const hostName = detail?.hostName ?? null
    const hostAvatarUrl = detail?.hostAvatarUrl ?? null
    const hostChannelUrl = detail?.hostChannelUrl ?? null
    const hostIsPartner = detail?.hostIsPartner ?? false
    const links = detail?.links ?? []
    const seoTitle = `${name} | 오뱅잇`
    const seoDescription = `${name} 대회의 일정, 참가자, 팀 정보, 최종 결과를 한눈에 확인하세요.`
    const seoUrl =
        typeof window !== 'undefined' ? window.location.href : undefined
    const canonicalUrl =
        typeof window !== 'undefined'
            ? `${window.location.origin}${window.location.pathname}`
            : undefined
    const eventSchema = {
        '@context': 'https://schema.org',
        '@type': 'SportsEvent',
        name,
        description: seoDescription,
        startDate: startedAt ?? undefined,
        endDate: endedAt ?? undefined,
        eventStatus: isActive
            ? 'https://schema.org/EventScheduled'
            : 'https://schema.org/EventCompleted',
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
                <p className="text-sm text-[#6aadcc]">
                    프로모션 정보를 불러올 수 없습니다.
                </p>
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

    const draftPanel = promotionData.panels.find(
        (panel) => panel.type === 'DRAFT',
    )
    const rawDraftParticipants =
        draftPanel !== undefined &&
        typeof draftPanel.content === 'object' &&
        draftPanel.content !== null &&
        'participants' in draftPanel.content &&
        Array.isArray(
            (draftPanel.content as Record<string, unknown>).participants,
        )
            ? ((draftPanel.content as Record<string, unknown>)
                  .participants as unknown[])
            : []
    const draftParticipants = rawDraftParticipants
        .reduce<
            Array<{
                id: string
                name: string
                position: OverwatchRole | null
                avatarUrl: string | null
                isPartner: boolean
                order: number
            }>
        >((acc, item, index) => {
            if (typeof item !== 'object' || item === null) return acc
            const participant = item as Record<string, unknown>
            if (
                typeof participant.id !== 'string' ||
                typeof participant.name !== 'string'
            )
                return acc
            acc.push({
                id: participant.id,
                name: participant.name,
                position: (['TNK', 'DPS', 'SPT'] as const).includes(
                    participant.position as OverwatchRole,
                )
                    ? (participant.position as OverwatchRole)
                    : null,
                avatarUrl:
                    typeof participant.avatarUrl === 'string'
                        ? participant.avatarUrl
                        : null,
                isPartner: participant.isPartner === true,
                order:
                    typeof participant.order === 'number'
                        ? participant.order
                        : index,
            })
            return acc
        }, [])
        .sort((a, b) => a.order - b.order)
        .map(({ id, name, position, avatarUrl, isPartner }) => ({
            id,
            name,
            position,
            avatarUrl,
            isPartner,
        }))

    return (
        <div className="min-h-screen bg-[#020d18]">
            <Header />
            <Helmet>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDescription} />
                <meta
                    name="keywords"
                    content={`${name}, 오버워치, 대회, 이스포츠, 오뱅잇`}
                />
                <meta
                    name="robots"
                    content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
                />
                <meta
                    name="googlebot"
                    content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
                />
                {canonicalUrl !== undefined && (
                    <link rel="canonical" href={canonicalUrl} />
                )}
                <meta property="og:type" content="website" />
                <meta property="og:locale" content="ko_KR" />
                <meta property="og:title" content={seoTitle} />
                <meta property="og:description" content={seoDescription} />
                {seoUrl !== undefined && (
                    <meta property="og:url" content={seoUrl} />
                )}
                <meta property="og:image" content={bannerUrl ?? ''} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={seoTitle} />
                <meta name="twitter:description" content={seoDescription} />
                <meta name="twitter:image" content={bannerUrl ?? ''} />
                <script type="application/ld+json">
                    {JSON.stringify(eventSchema)}
                </script>
            </Helmet>

            <div className="font-koverwatch italic">
                <TournamentHero
                    name={name}
                    bannerUrl={bannerUrl}
                    startedAt={startedAt}
                    endedAt={endedAt}
                    isActive={isActive}
                    tags={tags}
                    isChzzkSupport={isChzzkSupport}
                    hostName={hostName}
                    hostAvatarUrl={hostAvatarUrl}
                    hostChannelUrl={hostChannelUrl}
                    hostIsPartner={hostIsPartner}
                    links={links}
                />

                <div className="mx-auto max-w-[1280px] px-4 py-8 xl:grid xl:grid-cols-[minmax(0,1fr)_180px] xl:gap-6">
                    <div className="mx-auto max-w-5xl space-y-4 xl:mx-0 xl:max-w-none">
                        {visiblePanels.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-3 py-20">
                                <span className="text-5xl">🔜</span>
                                <p className="text-sm text-[#6aadcc]">
                                    준비 중입니다.
                                </p>
                            </div>
                        ) : (
                            visiblePanels.map((panel) => (
                                <section
                                    key={panel.id}
                                    id={`panel-${panel.id}`}
                                    className="scroll-mt-24"
                                >
                                    <PanelRenderer
                                        panel={panel}
                                        slug={resolvedSlug}
                                        draftParticipants={draftParticipants}
                                    />
                                </section>
                            ))
                        )}
                    </div>

                    {panelNavItems.length > 0 && (
                        <nav
                            aria-label="콘텐츠 목록"
                            className="hidden xl:block"
                        >
                            <div className="sticky top-24 rounded-xl bg-[#062035]/90 p-3 ring-1 ring-[#1e3a5f] backdrop-blur-sm">
                                <p className="mb-2 text-[10px] font-black tracking-[0.2em] text-[#0596e8]/80">
                                    CONTENTS
                                </p>
                                <ul className="space-y-1.5">
                                    {panelNavItems.map((item) => (
                                        <li key={item.id}>
                                            <a
                                                href={`#${item.id}`}
                                                className="block rounded-md px-2 py-1.5 text-sm text-[#6aadcc] transition hover:bg-[#041524] hover:text-[#e8f4fd]"
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
                        className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#062035] text-[#6aadcc] ring-1 ring-[#1e3a5f] transition hover:bg-[#07304f] hover:text-[#e8f4fd]"
                    >
                        <ChevronUp className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    )
}
