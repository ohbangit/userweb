import { useTournamentTeams } from '../hooks'
import { DraftPanelView } from './DraftPanelView'
import { PlayerListPanelView } from './PlayerListPanelView'
import { TeamsPanelView } from './TeamsPanelView'
import { SchedulePanelView } from './SchedulePanelView'
import { FinalResultPanelView } from './FinalResultPanelView'
import { F1DriversPanelView } from './F1DriversPanelView'
import { F1RaceSchedulePanelView } from './F1RaceSchedulePanelView'
import { F1RaceResultPanelView } from './F1RaceResultPanelView'
import { F1StandingsPanelView } from './F1StandingsPanelView'
import { F1QualifyingPanelView } from './F1QualifyingPanelView'
import { F1CircuitPanelView } from './F1CircuitPanelView'
import { F1TeamDraftPanelView } from './F1TeamDraftPanelView'
import { F1_CIRCUIT_DATA } from '../data/f1Circuit'
import type {
    DraftContent,
    F1DriversContent,
    F1QualifyingContent,
    F1RaceResultContent,
    F1RaceScheduleContent,
    F1StandingsContent,
    F1TeamDraftContent,
    FinalResultContent,
    ScheduleContent,
} from '../types'
import type { PanelRendererProps } from '../types/tournamentPromotion'
import {
    DEFAULT_PANEL_TITLE,
    getSafeOverwatchMapType,
    isDefaultExpanded,
    toF1DriversContentFromPlayersApi,
} from '../utils/tournamentPromotion'

export function PanelRenderer({ panel, slug, isOverwatch, playersData, draftParticipants }: PanelRendererProps) {
    const { data: teamsData } = useTournamentTeams(
        slug,
        panel.type === 'PLAYER_LIST' || panel.type === 'SCHEDULE' || panel.type === 'FINAL_RESULT',
    )
    const teams = teamsData?.teams ?? []
    const panelTitle = panel.title_override ?? DEFAULT_PANEL_TITLE[panel.type]

    if (panel.type === 'DRAFT') {
        const content = panel.content as unknown as DraftContent
        return <DraftPanelView title={panelTitle} content={{ startsOn: content.startsOn ?? null, meta: content.meta ?? '', participants: content.participants ?? [] }} />
    }

    if (panel.type === 'PLAYER_LIST') {
        return <PlayerListPanelView title={panelTitle} teams={teams} participants={draftParticipants} defaultExpanded={isDefaultExpanded(panel.content)} />
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
                                mapType: getSafeOverwatchMapType(setMap.mapType),
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
                content={{ standings: content.standings ?? [], mvpPlayerId: typeof content.mvpPlayerId === 'number' ? content.mvpPlayerId : null }}
                teams={teams}
                defaultExpanded={isDefaultExpanded(panel.content)}
            />
        )
    }

    if (panel.type === 'F1_DRIVERS') {
        const content = playersData === undefined ? (panel.content as unknown as F1DriversContent) : toF1DriversContentFromPlayersApi(playersData)
        return <F1DriversPanelView title={panelTitle ?? 'F1 드라이버'} content={{ participants: Array.isArray(content.participants) ? content.participants : [] }} />
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
        return <F1TeamDraftPanelView title={panelTitle ?? '팀 드래프트'} content={{ teams: Array.isArray(content.teams) ? content.teams : [] }} />
    }

    return null
}
