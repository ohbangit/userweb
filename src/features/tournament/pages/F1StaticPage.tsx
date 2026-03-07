import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ChevronUp, Flag } from 'lucide-react'
import { Header } from '../../../app/components/Header'
import { F1TeamDraftPanelView, TournamentHero, F1DayResultPanelView } from '../components'
import { F1StaticCircuitPanelView, F1StaticDriversPanelView } from './f1-static/components'
import { F1_CIRCUIT_DATA } from '../data/f1Circuit'
import { buildF1TeamDraftContentFromPlayers } from '../data/f1TeamDraft'
import { F1_DAY_RESULTS } from '../data/f1DayResult'
import { useTournamentPlayers } from '../hooks'
import { useTournamentDetailV2 } from '../hooks/useTournamentDetail'
import type { F1DriverRole, F1DriversContent, PublicTournamentPlayersResponse } from '../types'
import f125LogoSrc from '../../../assets/F1_25_logo.png'

const F1_SLUG = 'chzzk-racing4th'

const PANEL_NAV = [
    { id: 'circuit', label: '서킷 정보' },
    { id: 'drivers', label: '드라이버' },
    { id: 'team', label: '팀 구성' },
    { id: 'race-result', label: '레이스 결과' },
    // { id: 'standings', label: '챔피언십 순위' },
]

function ComingSoonPanel({ title }: { title: string }) {
    return (
        <section className="mt-10 w-full">
            <h2 className="font-f1 text-5xl font-black uppercase tracking-tight text-[#e8f4fd]">{title}</h2>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-[#E10600]/60 via-[#7a0300]/40 to-transparent" />
            <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#2e1a1a]/60 bg-[#120608]/30 py-16">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E10600]/30 bg-[#E10600]/10">
                    <Flag className="h-5 w-5 text-[#E10600]/60" />
                </div>
                <p className="text-sm font-semibold uppercase tracking-widest text-[#6aadcc]/50">Coming Soon</p>
            </div>
        </section>
    )
}

const SEO_DESC = 'F1 25 레이싱 대회의 드라이버, 예선 결과, 팀 구성, 레이스 일정 및 챔피언십 순위를 확인하세요.'
const EMPTY_DRIVERS_CONTENT: F1DriversContent = { participants: [] }

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
                const driverRole: F1DriverRole = info.driverRole === 'SECOND' ? 'SECOND' : 'FIRST'

                return {
                    id: String(player.id),
                    streamerId: player.streamerId,
                    name: typeof info.name === 'string' && info.name.length > 0 ? info.name : player.nickname,
                    nickname: player.nickname,
                    avatarUrl: player.avatarUrl,
                    channelUrl: player.channelUrl,
                    isPartner: player.isPartner,
                    driverRole,
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

export default function F1StaticPage() {
    const [showScrollTop, setShowScrollTop] = useState(false)
    const { data: detail } = useTournamentDetailV2(F1_SLUG)
    const { data: playersData } = useTournamentPlayers(F1_SLUG, true)

    const driversContent = playersData === undefined ? EMPTY_DRIVERS_CONTENT : toF1DriversContentFromPlayersApi(playersData)
    const teamDraftContent = playersData === undefined ? { teams: [] } : buildF1TeamDraftContentFromPlayers(playersData)

    const name = detail?.name ?? 'F1 25 레이싱 대회'
    const game = detail?.game ?? 'RACING'
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
    const description = detail?.description ?? null
    const showDescription = detail?.showDescription ?? false
    const broadcasterName = detail?.broadcaster.name ?? null
    const broadcasterAvatarUrl = detail?.broadcaster.avatarUrl ?? null
    const broadcasterChannelUrl = detail?.broadcaster.channelUrl ?? null
    const broadcasterIsPartner = detail?.broadcaster.isPartner ?? false
    const commentators = (detail?.commentators ?? []).map((item) => ({
        name: item.name ?? '',
        avatarUrl: item.avatarUrl,
        channelUrl: item.channelUrl,
        isPartner: item.isPartner,
        streamerId: null,
    }))

    const seoTitle = `${name} | 오뱅잇`

    useEffect(() => {
        function handleScroll() {
            setShowScrollTop(window.scrollY > 480)
        }
        handleScroll()
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="relative min-h-screen font-f1">
            <div className="bg-f1-fixed fixed inset-0 -z-10" aria-hidden="true" />
            <Helmet>
                <title>{seoTitle}</title>
                <meta name="description" content={SEO_DESC} />
                <meta property="og:title" content={seoTitle} />
                <meta property="og:description" content={SEO_DESC} />
                <meta name="robots" content="index,follow" />
            </Helmet>

            <Header />

            <div>
                <div className="font-f1">
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
                        slug={F1_SLUG}
                        heroTopLogoSrc={f125LogoSrc}
                        heroTopLogoAlt="F1 25 로고"
                    />
                </div>

                <nav aria-label="콘텐츠 목록" className="fixed right-4 top-24 z-10 hidden w-32 min-[1440px]:block">
                    <div className="p-1">
                        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#E10600]/80">CONTENTS</p>
                        <ul className="space-y-1.5">
                            {PANEL_NAV.map((item) => (
                                <li key={item.id}>
                                    <a
                                        href={`#panel-${item.id}`}
                                        className="block rounded-md px-2 py-1.5 text-sm text-[#6aadcc]/60 transition hover:text-[#e8f4fd]"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>

                <div className="bg-black/60 px-4 pb-16 pt-10">
                    <div className="mx-auto max-w-5xl space-y-4">
                        <section className="scroll-mt-24">
                            <div className="aspect-video w-full overflow-hidden rounded-2xl">
                                <iframe
                                    title="CHZZK Player"
                                    src="https://chzzk.naver.com/embed/clip/18JfrwyuBS"
                                    className="h-full w-full"
                                    frameBorder="0"
                                    allow="autoplay; clipboard-write; web-share"
                                    allowFullScreen
                                />
                            </div>
                        </section>

                        {showDescription && description && (
                            <section className="scroll-mt-24">
                                <p className="whitespace-pre-wrap text-base text-[#6aadcc]/80">{description}</p>
                            </section>
                        )}

                        <section id="panel-circuit" className="scroll-mt-24">
                            <F1StaticCircuitPanelView title="서킷 정보" content={F1_CIRCUIT_DATA} />
                        </section>

                        <section id="panel-drivers" className="scroll-mt-24">
                            <F1StaticDriversPanelView title="드라이버" content={driversContent} />
                        </section>

                        <section id="panel-team" className="scroll-mt-24">
                            <F1TeamDraftPanelView title="팀 구성" content={teamDraftContent} />
                        </section>

                        <section id="panel-race-result" className="scroll-mt-24">
                            {F1_DAY_RESULTS.length > 0 ? (
                                F1_DAY_RESULTS.map((dayResult) => (
                                    <F1DayResultPanelView
                                        key={dayResult.label}
                                        title={`레이스 결과 — ${dayResult.label}`}
                                        content={dayResult}
                                        drivers={driversContent.participants}
                                    />
                                ))
                            ) : (
                                <ComingSoonPanel title="레이스 결과" />
                            )}
                        </section>

                        {/*<section id="panel-standings" className="scroll-mt-24">*/}
                        {/*    <ComingSoonPanel title="챔피언십 순위" />*/}
                        {/*</section>*/}
                    </div>
                </div>

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
