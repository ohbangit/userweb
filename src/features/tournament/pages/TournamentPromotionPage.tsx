import { useParams } from 'react-router-dom'
import { useTournamentPromotion, useTournamentTeams } from '../hooks'
import {
    DraftPanelView,
    PlayerListPanelView,
    SchedulePanelView,
    FinalResultPanelView,
} from '../components'
import type {
    DraftContent,
    ScheduleContent,
    FinalResultContent,
    PublicPromotionPanel,
} from '../types'

function PanelDivider() {
    return <hr className="border-gray-100" />
}

interface PanelRendererProps {
    panel: PublicPromotionPanel
    slug: string
}

function PanelRenderer({ panel, slug }: PanelRendererProps) {
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

    if (panel.type === 'PLAYER_LIST' || panel.type === 'TEAMS') {
        return <PlayerListPanelView title={panelTitle} teams={teams} />
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

const DEFAULT_PANEL_TITLE: Record<string, string> = {
    DRAFT: '드래프트 & 참가자',
    TEAMS: '선수 목록',
    PLAYER_LIST: '선수 목록',
    SCHEDULE: '일정 & 결과',
    FINAL_RESULT: '최종 결과',
}

export default function TournamentPromotionPage() {
    const { slug } = useParams<{ slug: string }>()
    const resolvedSlug = slug ?? ''

    const { data, isLoading, isError } = useTournamentPromotion(resolvedSlug)

    if (isLoading) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            </div>
        )
    }

    if (isError || data === null || data === undefined) {
        return (
            <div className="flex min-h-64 flex-col items-center justify-center gap-2 text-gray-400">
                <span className="text-4xl">📭</span>
                <p className="text-sm">프로모션 정보를 불러올 수 없습니다.</p>
            </div>
        )
    }

    const visiblePanels = data.panels
        .filter((panel) => panel.enabled && !panel.hidden)
        .sort((a, b) => a.order_index - b.order_index)

    if (visiblePanels.length === 0) {
        return (
            <div className="flex min-h-64 flex-col items-center justify-center gap-2 text-gray-400">
                <span className="text-4xl">🔜</span>
                <p className="text-sm">준비 중입니다.</p>
            </div>
        )
    }

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-12 py-8">
            {visiblePanels.map((panel, idx) => (
                <div key={panel.id}>
                    {idx > 0 && <PanelDivider />}
                    {idx > 0 && <div className="pt-12" />}
                    <PanelRenderer panel={panel} slug={resolvedSlug} />
                </div>
            ))}
        </div>
    )
}
