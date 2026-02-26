export type PromotionPanelType =
    | 'DRAFT'
    | 'TEAMS'
    | 'PLAYER_LIST'
    | 'SCHEDULE'
    | 'FINAL_RESULT'
export type PromotionConfigStatus = 'draft' | 'published'

export interface PromotionPanel {
    id: number
    configId: number
    type: PromotionPanelType
    enabled: boolean
    hidden: boolean
    orderIndex: number
    titleOverride: string | null
    content: Record<string, unknown>
}

export interface PromotionConfig {
    id: number
    tournamentSlug: string
    status: PromotionConfigStatus
    version: number
    publishedAt: string | null
    panels: PromotionPanel[]
}

// DRAFT 패널 content 타입
export interface DraftParticipant {
    id: string
    streamerId: number | null
    name: string
    teamId: number | null
    seed: number | null
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
    mvpPlayerId: number | null
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
}

// API 요청 타입
export interface CreatePromotionConfigRequest {
    panels?: Array<{
        type: PromotionPanelType
        enabled?: boolean
        hidden?: boolean
        orderIndex?: number
        titleOverride?: string
    }>
}

export interface UpdatePromotionPanelItem {
    id: number
    enabled?: boolean
    hidden?: boolean
    orderIndex?: number
    titleOverride?: string | null
    content?: Record<string, unknown>
}

export interface UpdatePromotionPanelsRequest {
    panels: UpdatePromotionPanelItem[]
}

export interface ReorderPromotionPanelsRequest {
    panelIdsInOrder: number[]
}

// API 응답 타입 (BE raw → FE mapped)
export interface PromotionConfigRaw {
    id: number
    tournament_slug: string
    status: PromotionConfigStatus
    version: number
    published_at: string | null
    panels: Array<{
        id: number
        config_id: number
        type: PromotionPanelType
        enabled: boolean
        hidden: boolean
        order_index: number
        title_override: string | null
        content: Record<string, unknown>
    }>
}
