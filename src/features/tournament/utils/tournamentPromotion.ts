import { DEFAULT_OVERWATCH_MAP_TYPE, OVERWATCH_MAP_TYPES } from '../constants/overwatch'
import type {
    DraftParticipant,
    F1DriversContent,
    OverwatchRole,
    PublicTournamentPlayersResponse,
    TournamentDetail,
    TournamentDetailV2,
    TournamentOverwatchMapType,
} from '../types'

export const DEFAULT_PANEL_TITLE: Record<string, string> = {
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

export type TournamentStatus = 'before' | 'ongoing' | 'ended'

export function getTournamentStatusBySchedule(startedAt: string | null, endedAt: string | null): TournamentStatus {
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

export function isDefaultExpanded(content: Record<string, unknown>): boolean {
    return content.defaultExpanded === true
}

export function isOverwatchGame(game: string): boolean {
    const normalized = game.trim().toUpperCase()
    return normalized === 'OVERWATCH' || normalized === 'OW'
}

export function isRacingGame(game: string): boolean {
    const normalized = game.trim().toUpperCase()
    return normalized === 'RACING' || normalized.includes('F1')
}

function toNumberOrNull(value: unknown): number | null {
    return typeof value === 'number' ? value : null
}

function toStringOrNull(value: unknown): string | null {
    return typeof value === 'string' ? value : null
}

export function toF1DriversContentFromPlayersApi(response: PublicTournamentPlayersResponse): F1DriversContent {
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

export function toTournamentDetailFromV2(detailV2: TournamentDetailV2): TournamentDetail {
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

export function toOverwatchMapType(value: unknown): TournamentOverwatchMapType | null {
    if (typeof value !== 'string') return null
    return OVERWATCH_MAP_TYPES.includes(value as TournamentOverwatchMapType) ? (value as TournamentOverwatchMapType) : null
}

export function toDraftParticipants(rawPanelContent: Record<string, unknown> | null): DraftParticipant[] {
    const rawParticipants =
        rawPanelContent !== null && Array.isArray(rawPanelContent.participants) ? (rawPanelContent.participants as unknown[]) : []

    return rawParticipants
        .reduce<DraftParticipant[]>((acc, item, index) => {
            if (typeof item !== 'object' || item === null) return acc
            const participant = item as Record<string, unknown>
            if (typeof participant.id !== 'string' || typeof participant.name !== 'string') return acc
            acc.push({
                id: participant.id,
                streamerId: typeof participant.streamerId === 'number' ? participant.streamerId : null,
                name: participant.name,
                channelId: typeof participant.channelId === 'string' ? participant.channelId : null,
                teamId: typeof participant.teamId === 'number' ? participant.teamId : null,
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
}

export function getSafeOverwatchMapType(value: unknown): TournamentOverwatchMapType {
    return toOverwatchMapType(value) ?? DEFAULT_OVERWATCH_MAP_TYPE
}
