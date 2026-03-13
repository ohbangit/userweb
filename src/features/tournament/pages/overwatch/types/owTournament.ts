export interface OWLinkItem {
    label: string
    url: string
    type: string | null
}

export type OWPanelType = 'DRAFT' | 'PLAYER_LIST' | 'TEAMS' | 'SCHEDULE' | 'FINAL_RESULT'

export interface OWPanelPublicItem {
    id: number
    type: OWPanelType
    orderIndex: number
    titleOverride: string | null
}

export interface OWStaffPublicItem {
    streamerId: number | null
    name: string
    avatarUrl: string | null
    channelId: string | null
    isPartner: boolean
}

export interface OWPublicResponse {
    slug: string
    title: string
    bannerUrl: string | null
    startDate: string | null
    endDate: string | null
    description: string | null
    tags: string[]
    links: OWLinkItem[]
    isChzzkSupport: boolean
    hosts: OWStaffPublicItem[]
    broadcasters: OWStaffPublicItem[]
    commentators: OWStaffPublicItem[]
    panels: OWPanelPublicItem[]
}

export type OWPlayerPosition = 'TNK' | 'DPS' | 'SPT'

export interface OWPlayerPublicItem {
    streamerId: number
    name: string
    avatarUrl: string | null
    channelId: string | null
    isPartner: boolean
    position: OWPlayerPosition
    isCaptain: boolean
    draftPick: number | null
    draftPassed: boolean
}

export interface OWPlayersResponse {
    players: OWPlayerPublicItem[]
}

export interface OWMetaGroupViewModel {
    id: 'hosts' | 'broadcasters' | 'commentators'
    label: string
    items: OWStaffPublicItem[]
}

export type OWTeamMemberSlot = 'TNK' | 'DPS' | 'SPT' | 'HEAD_COACH' | 'COACH'

export interface OWTeamMemberPublicItem {
    id: number
    slot: OWTeamMemberSlot
    streamerId: number | null
    name: string
    nickname?: string
    channelId: string | null
    isPartner: boolean
    isCaptain: boolean
    avatarUrl: string | null
    profileUrl: string | null
}

export interface OWTeamPublicItem {
    id: number
    name: string
    logoUrl: string | null
    teamOrder: number
    members: OWTeamMemberPublicItem[]
}

export interface OWTeamsResponse {
    teams: OWTeamPublicItem[]
}

export type OverwatchMapType = '쟁탈' | '혼합' | '밀기' | '호위' | '플레시포인트'

export type MatchFormat = 'bo3' | 'bo5' | 'bo7'

export type MatchStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED'

export interface BracketTeamSlot {
    name: string
    logoUrl: string | null
    score: number | null
}

export interface BracketMatchSet {
    setNumber: number
    mapType: OverwatchMapType
    mapName: string | null
    score1: number | null
    score2: number | null
    winner: 'team1' | 'team2' | null
    roundScore?: string
}

export interface BracketMvp {
    name: string
    avatarUrl: string | null
    position: OWPlayerPosition
    count: number
}

export interface BracketMatch {
    id: string
    team1: BracketTeamSlot | null
    team2: BracketTeamSlot | null
    scheduledAt: string | null
    isLive: boolean
    format?: MatchFormat
    status?: MatchStatus
    sets?: BracketMatchSet[]
    mvps?: BracketMvp[]
}

export interface BracketRound {
    label: string
    matches: BracketMatch[]
}

export interface BracketData {
    upper: BracketRound[]
    lower: BracketRound[]
    grandFinal: BracketMatch | null
}

export interface OWBracketResponse {
    bracket: BracketData
}

export interface OWMetaSectionViewModel {
    slug: string
    title: string
    bannerUrl: string | null
    startDate: string | null
    endDate: string | null
    dateLabel: string | null
    description: string | null
    tags: string[]
    links: OWLinkItem[]
    isChzzkSupport: boolean
    groups: OWMetaGroupViewModel[]
}
