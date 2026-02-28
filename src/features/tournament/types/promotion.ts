export type PromotionPanelType =
    | 'DRAFT'
    | 'TEAMS'
    | 'PLAYER_LIST'
    | 'SCHEDULE'
    | 'FINAL_RESULT'
export type PromotionConfigStatus = 'draft' | 'published'

export interface PublicPromotionPanel {
    id: number
    config_id: number
    type: PromotionPanelType
    enabled: boolean
    hidden: boolean
    order_index: number
    title_override: string | null
    content: Record<string, unknown>
}

export interface PublicPromotionConfig {
    id: number
    tournament_slug: string
    status: PromotionConfigStatus
    version: number
    published_at: string | null
    panels: PublicPromotionPanel[]
}

// DRAFT 패널 content 타입
export type OverwatchRole = 'TNK' | 'DPS' | 'SPT'

export interface DraftParticipant {
    id: string
    streamerId: number | null
    name: string
    teamId: number | null
    position: OverwatchRole | null
    avatarUrl: string | null
    isPartner: boolean
    order: number
}

export interface DraftContent {
    startsOn: string | null
    meta: string
    participants: DraftParticipant[]
}

// SCHEDULE 패널 content 타입
export type MatchStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'

export interface ScheduleMatch {
    id: string
    teamAId: number
    teamBId: number
    mvpPlayerIds: number[]
    status: MatchStatus
    scoreA: number | null
    scoreB: number | null
    order: number
}

export interface ScheduleGroup {
    id: string
    title: string
    groupDate: string | null
    order: number
    matches: ScheduleMatch[]
}

export interface ScheduleContent {
    groups: ScheduleGroup[]
}

// FINAL_RESULT 패널 content 타입
export interface StandingEntry {
    teamId: number
    rank: number
    wins: number | null
    losses: number | null
    points: number | null
    note: string
}

export interface FinalResultContent {
    standings: StandingEntry[]
    mvpPlayerId: number | null
}

// 팀 조회 응답 타입
export interface TournamentMember {
    id: number
    slot: string
    streamerId: number | null
    name: string
    nickname?: string
    channelId: string | null
    isPartner: boolean
    avatarUrl: string | null
    profileUrl: string | null
}

export interface TournamentTeam {
    id: number
    name: string
    logoUrl: string | null
    members: TournamentMember[]
}

export interface TournamentTeamsResponse {
    teams: TournamentTeam[]
}

export interface TournamentDetail {
    id: number
    slug: string
    name: string
    game: string
    startedAt: string | null
    endedAt: string | null
    bannerUrl: string | null
    isActive: boolean
    tags: string[]
    isChzzkSupport: boolean
    hostName: string | null
    hostAvatarUrl: string | null
    hostChannelUrl: string | null
    hostIsPartner: boolean
    links: { label: string; url: string }[]
}

export interface TournamentListResponse {
    tournaments: TournamentDetail[]
}
