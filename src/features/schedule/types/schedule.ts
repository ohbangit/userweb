export interface Participant {
    name: string
    avatarUrl?: string
}

export interface Broadcast {
    id: string
    title: string
    streamerName: string
    streamerProfileUrl?: string
    category: string
    gameTitle?: string
    tags?: string[]
    participants?: Participant[]
    startTime: string
    endTime?: string
    isLive: boolean
    isCollab: boolean
    collabPartners?: string[]
    thumbnailUrl?: string
}

export type ViewMode = 'daily' | 'weekly' | 'monthly'
