export type BroadcastType = '합방' | '대회' | '콘텐츠' | '내전'

export interface AdminScheduleParticipant {
    id?: string
    name: string
    avatarUrl: string | null
    channelUrl: string | null
    streamerId?: string | null
    isHost?: boolean
    isPartner?: boolean
}

export interface AdminBroadcastItem {
    id: string
    title: string
    broadcastType: string | null
    streamerName: string
    streamerId: string
    streamerProfileUrl: string | null
    streamerChannelUrl: string | null
    streamerIsPartner: boolean
    gameTitle: string | null
    tags: string[]
    participants: AdminScheduleParticipant[]
    startTime: string
    endTime: string | null
    thumbnailUrl: string | null
    isLive: boolean
    isCollab: boolean
    source: string | null
}

export interface AdminScheduleResponse {
    view: string
    startDate: string
    endDate: string
    dates: AdminScheduleDateGroup[]
}

export interface AdminScheduleDateGroup {
    date: string
    broadcasts: AdminBroadcastItem[]
}

export interface CreateBroadcastRequest {
    title: string
    streamerId: string
    broadcastType?: string
    gameTitle?: string
    startTime: string
    endTime?: string
    thumbnailUrl?: string
    participantIds?: string[]
    participants?: AdminBroadcastParticipantInput[]
    tags?: string[]
    source?: string
    externalId?: string
    isVisible?: boolean
}

export interface UpdateBroadcastRequest {
    title?: string
    streamerId?: string
    broadcastType?: string
    gameTitle?: string
    startTime?: string
    endTime?: string
    thumbnailUrl?: string
    participantIds?: string[]
    participants?: AdminBroadcastParticipantInput[]
    tags?: string[]
    isVisible?: boolean
}

export interface AdminBroadcastParticipantInput {
    name: string
    streamerId?: string
    isHost?: boolean
}

export interface BroadcastMutationResponse {
    id: string
}
