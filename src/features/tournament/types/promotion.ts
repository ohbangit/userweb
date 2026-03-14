import type { DraftParticipant } from '../../admin/types/tournamentPromotion'

export type { DraftParticipant }

export type PromotionPanelType =
    | 'DRAFT'
    | 'TEAMS'
    | 'PLAYER_LIST'
    | 'SCHEDULE'
    | 'FINAL_RESULT'
    | 'F1_DRIVERS'
    | 'F1_RACE_SCHEDULE'
    | 'F1_RACE_RESULT'
    | 'F1_STANDINGS'
    | 'F1_QUALIFYING'
    | 'F1_CIRCUIT'
    | 'F1_TEAM_DRAFT'
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

export interface DraftContent {
    startsOn: string | null
    meta: string
    participants: DraftParticipant[]
}

// 해설진 타입
export interface Commentator {
    name: string
    avatarUrl: string | null
    channelUrl: string | null
    isPartner: boolean
    streamerId: number | null
}

// SCHEDULE 패널 content 타입
export type MatchStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
export type TournamentOverwatchMapType = '쟁탈' | '혼합' | '밀기' | '호위' | '플레시포인트'

export interface OverwatchSetMap {
    setNumber: number
    mapType: TournamentOverwatchMapType
    mapName: string | null
    scoreA: number | null
    scoreB: number | null
}

export interface ScheduleMatch {
    id: string
    teamAId: number
    teamBId: number
    mvpPlayerIds: number[]
    status: MatchStatus
    scoreA: number | null
    scoreB: number | null
    mapType?: TournamentOverwatchMapType | null
    mapName?: string | null
    setMaps?: OverwatchSetMap[]
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
    isCaptain: boolean
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

export interface TournamentPlayerPublic {
    id: number
    nickname: string
    isPartner: boolean
    order: number
    avatarUrl: string | null
    channelUrl: string | null
    streamerId: number | null
    secondGroup: 'A' | 'B' | null
    qualifyingEliminated: boolean
    info: Record<string, unknown>
}

export interface PublicTournamentPlayersResponse {
    players: TournamentPlayerPublic[]
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
    // 부가 설명
    description?: string | null
    showDescription?: boolean
    // 중계자 (주최자와 별도로 중계하는 경우)
    broadcasterName?: string | null
    broadcasterAvatarUrl?: string | null
    broadcasterChannelUrl?: string | null
    broadcasterIsPartner?: boolean
    broadcasterStreamerId?: number | null
    // 해설진
    commentators?: Commentator[]
}

export interface TournamentV2CommonStreamer {
    name: string | null
    avatarUrl: string | null
    channelUrl: string | null
    isPartner: boolean
}

export interface TournamentDetailV2 {
    slug: string
    name: string
    game: string
    startedAt: string | null
    endedAt: string | null
    bannerUrl: string | null
    isActive: boolean
    tags: string[]
    isChzzkSupport: boolean
    host: TournamentV2CommonStreamer
    links: { label: string; url: string }[]
    description: string | null
    showDescription: boolean
    broadcaster: TournamentV2CommonStreamer
    commentators: TournamentV2CommonStreamer[]
}

export interface TournamentListResponse {
    tournaments: TournamentDetail[]
}

// ── F1_DRIVERS 패널 content 타입 ──────────────────────────────────────
export type F1DriverRole = 'FIRST' | 'SECOND'
export type F1SecondGroup = 'A' | 'B'

export interface F1Driver {
    id: string
    streamerId: number | null
    name: string
    nickname?: string
    avatarUrl: string | null
    channelUrl: string | null
    isPartner: boolean
    driverRole: F1DriverRole
    tier: string | null
    ranking: number | null
    participationCount: number
    winCount: number
    carNumber: number | null
    secondGroup?: F1SecondGroup | null
    qualifyingEliminated?: boolean
    order: number
}

export interface F1DriversContent {
    participants: F1Driver[]
}

// ── F1_RACE_SCHEDULE 패널 content 타입 ────────────────────────────────
export type F1RaceStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'

export interface F1RaceEvent {
    id: string
    title: string
    circuit: string
    scheduledAt: string | null
    status: F1RaceStatus
    order: number
}

export interface F1RaceScheduleContent {
    races: F1RaceEvent[]
}

// ── F1_RACE_RESULT 패널 content 타입 ──────────────────────────────────
export interface F1DriverRaceResult {
    driverId: string
    name: string
    position: number | null
    points: number | null
    dnf: boolean
    fastestLap: boolean
}

export interface F1SingleRaceResult {
    id: string
    raceId: string
    raceTitle: string
    results: F1DriverRaceResult[]
}

export interface F1RaceResultContent {
    races: F1SingleRaceResult[]
}

// ── F1_STANDINGS 패널 content 타입 ────────────────────────────────────
export interface F1StandingEntry {
    driverId: string
    name: string
    avatarUrl: string | null
    rank: number
    totalPoints: number
    wins: number
    podiums: number
    fastestLaps: number
    note: string
}

export interface F1StandingsContent {
    standings: F1StandingEntry[]
}

// ── F1_QUALIFYING 패널 content 타입 ───────────────────────────────────
export interface F1QualifyingDriver {
    driverId: string
    name: string
    avatarUrl: string | null
    isPartner: boolean
    position: number | null
    lapTime: string | null
    qualified: boolean
}

export interface F1QualifyingContent {
    description: string
    firstDriverResults: F1QualifyingDriver[]
    secondDriverResults: F1QualifyingDriver[]
}

// ── F1_CIRCUIT 패널 content 타입 ──────────────────────────────────────
export interface F1CircuitContent {
    circuits: F1CircuitItem[]
}

export interface F1CircuitItem {
    id: string
    circuitName: string
    country: string | null
    layoutImageUrl: string | null
    length: string | null
    corners: number | null
    lapRecord: string | null
    order: number
}

// ── F1_TEAM_DRAFT 패널 content 타입 ───────────────────────────────────
export interface F1DraftTeamDriver {
    driverId: string
    name: string
    avatarUrl: string | null
    isPartner: boolean
    driverRole: F1DriverRole
}

export interface F1DraftTeamOperator {
    driverId: string
    name: string
    avatarUrl: string | null
    isPartner: boolean
}

export interface F1DraftTeam {
    id: string
    teamName: string
    firstDriver: F1DraftTeamDriver
    secondDriver: F1DraftTeamDriver
    operator: F1DraftTeamOperator | null
    order: number
}

export interface F1TeamDraftContent {
    teams: F1DraftTeam[]
}

// ── F1_DAY_RESULT 패널 content 타입 ──────────────────────────────────
/** 퀄리파잉 단일 드라이버 결과 */
export interface F1DayQualifyingEntry {
    driverId: number       // TournamentPlayerPublic.id 와 매칭
    teamIndex: number      // TEAM_THEMES 배열 인덱스
    position: number | null
    lapTime: string | null
}

/** 레이스(R1/R2) 단일 드라이버 결과 */
export interface F1DayRaceEntry {
    driverId: number       // TournamentPlayerPublic.id 와 매칭
    teamIndex: number      // TEAM_THEMES 배열 인덱스
    position: number | null
    grid: number | null     // 출발 그리드
    lapTime: string | null
    dnf: boolean | null
    fastestLap: boolean
    points: number | null
}

/** 팀 성적 항목 */
export interface F1DayTeamStanding {
    teamIndex: number       // TEAM_THEMES 배열 인덱스 (레드불=0 …)
    rank: number
    totalPoints: number
    r1Points?: number
    r2Points?: number
}

/** 개인 성적 항목 */
export interface F1DayDriverStanding {
    driverId: number        // TournamentPlayerPublic.id 와 매칭
    teamIndex: number       // 소속 팀 인덱스
    points: number
}

/** Day 단위 전체 레이스 결과 */
export interface F1DayResultContent {
    label: string           // ex) "Day 1"
    qualifying: F1DayQualifyingEntry[]
    race1: F1DayRaceEntry[]
    race2: F1DayRaceEntry[]
    teamStandings: F1DayTeamStanding[]
    driverStandings: F1DayDriverStanding[]
}
