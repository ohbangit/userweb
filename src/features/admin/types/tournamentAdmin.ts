type SlotType = 'TNK' | 'DPS' | 'SPT' | 'HEAD_COACH' | 'COACH'

type TournamentAdminMember = {
    id: number
    slot: SlotType
    streamerId: number | null
    name: string
    channelId: string | null
    isPartner: boolean
    avatarUrl: string | null
    profileUrl: string | null
}

type TournamentItem = {
    id: number
    slug: string
    name: string
    game: string
    startedAt: string | null
    endedAt: string | null
    bannerUrl: string | null
    isActive: boolean
    createdAt: string
}

type TournamentListResponse = {
    tournaments: TournamentItem[]
}

type CreateTournamentRequest = {
    slug: string
    name: string
    game: string
    startedAt?: string
    endedAt?: string
    bannerUrl?: string
    isActive?: boolean
}

type UpdateTournamentRequest = {
    name?: string
    startedAt?: string
    endedAt?: string
    bannerUrl?: string
    isActive?: boolean
}

type TournamentAdminTeam = {
    id: number
    name: string
    logoUrl: string | null
    teamOrder: number
    members: TournamentAdminMember[]
}

type TournamentAdminTeamsResponse = {
    teams: TournamentAdminTeam[]
}

type CreateTournamentTeamRequest = {
    name: string
    logoUrl?: string
    teamOrder?: number
}

type UpdateTournamentTeamRequest = {
    name?: string
    logoUrl?: string
    teamOrder?: number
}

type UpsertTournamentMemberRequest = {
    slot: SlotType
    streamerId?: number
    name?: string
    profileUrl?: string
}

export type {
    CreateTournamentRequest,
    CreateTournamentTeamRequest,
    SlotType,
    TournamentAdminMember,
    TournamentAdminTeam,
    TournamentAdminTeamsResponse,
    TournamentItem,
    TournamentListResponse,
    UpdateTournamentRequest,
    UpdateTournamentTeamRequest,
    UpsertTournamentMemberRequest,
}
