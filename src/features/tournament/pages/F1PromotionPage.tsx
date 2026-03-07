import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ChevronUp } from 'lucide-react'
import { Header } from '../../../app/components/Header'
import { TournamentHero } from '../components/TournamentHero'
import {
    F1DriversPanelView,
    F1QualifyingPanelView,
    F1CircuitPanelView,
    F1TeamDraftPanelView,
    F1RaceSchedulePanelView,
    F1RaceResultPanelView,
    F1StandingsPanelView,
} from '../components'
import { F1_CIRCUIT_DATA } from '../data/f1Circuit'
import { buildF1TeamDraftContentFromPlayers } from '../data/f1TeamDraft'
import { useTournamentPlayers, useTournamentPromotion } from '../hooks'
import { useTournamentDetailV2 } from '../hooks/useTournamentDetail'
import type {
    F1DriversContent,
    F1QualifyingContent,
    F1RaceResultContent,
    F1RaceScheduleContent,
    F1StandingsContent,
    F1TeamDraftContent,
    PublicTournamentPlayersResponse,
    PublicPromotionPanel,
} from '../types'

const F1_SLUG = 'chzzk-racing4th'

const DEFAULT_PANEL_TITLE: Record<string, string> = {
    F1_DRIVERS: '드라이버',
    F1_RACE_SCHEDULE: '레이스 일정',
    F1_RACE_RESULT: '레이스 결과',
    F1_STANDINGS: '챔피언십 순위',
    F1_QUALIFYING: '예선 결과',
    F1_CIRCUIT: '서킷 정보',
    F1_TEAM_DRAFT: '팀 드래프트',
}

function isDefaultExpanded(content: Record<string, unknown>): boolean {
    return content.defaultExpanded === true
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

function F1PanelRenderer({ panel, playersData }: { panel: PublicPromotionPanel; playersData?: PublicTournamentPlayersResponse }) {
    const panelTitle = panel.title_override ?? DEFAULT_PANEL_TITLE[panel.type] ?? panel.type

    if (panel.type === 'F1_DRIVERS') {
        const content =
            playersData === undefined ? (panel.content as unknown as F1DriversContent) : toF1DriversContentFromPlayersApi(playersData)
        return (
            <F1DriversPanelView
                title={panelTitle}
                content={{
                    participants: Array.isArray(content.participants) ? content.participants : [],
                }}
            />
        )
    }

    if (panel.type === 'F1_QUALIFYING') {
        const content = panel.content as unknown as F1QualifyingContent
        return (
            <F1QualifyingPanelView
                title={panelTitle}
                content={{
                    description: typeof content.description === 'string' ? content.description : '',
                    firstDriverResults: Array.isArray(content.firstDriverResults) ? content.firstDriverResults : [],
                    secondDriverResults: Array.isArray(content.secondDriverResults) ? content.secondDriverResults : [],
                }}
            />
        )
    }

    if (panel.type === 'F1_TEAM_DRAFT') {
        if (playersData !== undefined) {
            return <F1TeamDraftPanelView title={panelTitle} content={buildF1TeamDraftContentFromPlayers(playersData)} />
        }
        const content = panel.content as unknown as F1TeamDraftContent
        return <F1TeamDraftPanelView title={panelTitle} content={{ teams: Array.isArray(content.teams) ? content.teams : [] }} />
    }

    if (panel.type === 'F1_CIRCUIT') {
        // 서킷 정보는 정적 데이터 사용 (TournamentPromotionPage와 동일 정책)
        return <F1CircuitPanelView title={panelTitle} content={F1_CIRCUIT_DATA} />
    }

    if (panel.type === 'F1_RACE_SCHEDULE') {
        const content = panel.content as unknown as F1RaceScheduleContent
        return (
            <F1RaceSchedulePanelView
                title={panelTitle}
                content={{ races: Array.isArray(content.races) ? content.races : [] }}
                defaultExpanded={isDefaultExpanded(panel.content)}
            />
        )
    }

    if (panel.type === 'F1_RACE_RESULT') {
        const content = panel.content as unknown as F1RaceResultContent
        return (
            <F1RaceResultPanelView
                title={panelTitle}
                content={{ races: Array.isArray(content.races) ? content.races : [] }}
                defaultExpanded={isDefaultExpanded(panel.content)}
            />
        )
    }

    if (panel.type === 'F1_STANDINGS') {
        const content = panel.content as unknown as F1StandingsContent
        return (
            <F1StandingsPanelView
                title={panelTitle}
                content={{
                    standings: Array.isArray(content.standings) ? content.standings : [],
                }}
                defaultExpanded={isDefaultExpanded(panel.content)}
            />
        )
    }

    return null
}

const SEO_TITLE = 'F1 25 레이싱 대회 | 오뱅잇'
const SEO_DESC = 'F1 25 레이싱 대회의 드라이버, 예선 결과, 팀 구성, 레이스 일정 및 챔피언십 순위를 확인하세요.'

export default function F1PromotionPage() {
    const [showScrollTop, setShowScrollTop] = useState(false)

    useEffect(() => {
        function handleScroll() {
            setShowScrollTop(window.scrollY > 480)
        }
        handleScroll()
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const { data: detail } = useTournamentDetailV2(F1_SLUG)
    const { data: promotionData, isLoading } = useTournamentPromotion(F1_SLUG)
    const { data: playersData } = useTournamentPlayers(F1_SLUG, true)

    const name = detail?.name ?? 'F1 25 레이싱 대회'
    const bannerUrl = detail?.bannerUrl ?? null
    const startedAt = detail?.startedAt ?? null
    const endedAt = detail?.endedAt ?? null
    const tags = detail?.tags ?? []
    const isChzzkSupport = detail?.isChzzkSupport ?? false
    const hostName = detail?.host.name ?? null
    const hostAvatarUrl = detail?.host.avatarUrl ?? null
    const hostChannelUrl = detail?.host.channelUrl ?? null
    const hostIsPartner = detail?.host.isPartner ?? false
    const links = detail?.links ?? []

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#020d18]">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#E10600] border-t-transparent" />
            </div>
        )
    }

    // TODO: enabled/hidden 조건 복구 필요 — 현재 임시로 전체 패널 노출
    const visiblePanels = (promotionData?.panels ?? []).sort((a, b) => a.order_index - b.order_index)

    const panelNavItems = visiblePanels.map((panel) => ({
        id: `panel-${panel.id}`,
        label: panel.title_override ?? DEFAULT_PANEL_TITLE[panel.type] ?? panel.type,
    }))

    return (
        <div className="min-h-screen bg-[#020d18]">
            <Helmet>
                <title>{SEO_TITLE}</title>
                <meta name="description" content={SEO_DESC} />
                <meta property="og:title" content={SEO_TITLE} />
                <meta property="og:description" content={SEO_DESC} />
                <meta name="robots" content="index,follow" />
            </Helmet>

            <Header />

            <div className="font-koverwatch italic">
                <TournamentHero
                    name={name}
                    game="RACING"
                    bannerUrl={bannerUrl}
                    startedAt={startedAt}
                    endedAt={endedAt}
                    tags={tags}
                    isChzzkSupport={isChzzkSupport}
                    hostName={hostName}
                    hostAvatarUrl={hostAvatarUrl}
                    hostChannelUrl={hostChannelUrl}
                    hostIsPartner={hostIsPartner}
                    links={links}
                    slug={F1_SLUG}
                />

                <div className="px-4 py-8">
                    <div className="mx-auto max-w-5xl space-y-4">
                        {visiblePanels.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-3 py-20">
                                <span className="text-5xl">🔜</span>
                                <p className="text-sm text-[#6aadcc]">준비 중입니다.</p>
                            </div>
                        ) : (
                            visiblePanels.map((panel) => (
                                <section key={panel.id} id={`panel-${panel.id}`} className="scroll-mt-24">
                                    <F1PanelRenderer panel={panel} playersData={playersData} />
                                </section>
                            ))
                        )}
                    </div>
                </div>

                {/* 우측 고정 패널 네비게이션 */}
                {panelNavItems.length > 0 && (
                    <nav aria-label="콘텐츠 목록" className="fixed right-4 top-24 z-10 hidden w-32 min-[1440px]:block">
                        <div className="p-1">
                            <p className="mb-2 text-[10px] font-black tracking-[0.2em] text-[#E10600]/80">CONTENTS</p>
                            <ul className="space-y-1.5">
                                {panelNavItems.map((item) => (
                                    <li key={item.id}>
                                        <a
                                            href={`#${item.id}`}
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

                {/* 맨 위로 */}
                {showScrollTop && (
                    <button
                        type="button"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
