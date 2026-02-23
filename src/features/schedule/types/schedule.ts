export interface Participant {
    id?: string
    name: string
    avatarUrl?: string
    channelUrl?: string | null
    streamerId?: number | null
    isHost?: boolean
    isPartner?: boolean
}

export interface Category {
    id: number
    name: string
    thumbnailUrl: string | null
}

export interface Broadcast {
    id: string
    title: string
    broadcastType?: string | null
    streamerName: string
    streamerProfileUrl?: string | null
    streamerChannelUrl?: string | null
    streamerIsPartner?: boolean
    category?: Category | null
    tags?: string[]
    participants?: Participant[]
    startTime: string
    endTime?: string
    isLive: boolean
    isCollab: boolean
    collabPartners?: string[]
    thumbnailUrl?: string
    isVisible?: boolean
}

export type ViewMode = 'daily' | 'weekly' | 'monthly'
