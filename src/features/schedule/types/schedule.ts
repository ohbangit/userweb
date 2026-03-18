import type { OverwatchMatchInfo } from './overwatch'

import type { AffiliationItem } from '../../../types/affiliation'

export interface Participant {
    id?: string
    name: string
    nickname?: string
    avatarUrl?: string
    channelUrl?: string | null
    youtubeUrl?: string | null
    fanCafeUrl?: string | null
    streamerId?: number | null
    isHost?: boolean
    isPartner?: boolean
    affiliations?: AffiliationItem[] | null
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
    streamerNickname: string
    streamerProfileUrl?: string | null
    streamerChannelUrl?: string | null
    streamerIsPartner?: boolean
    category?: Category | null
    tags?: string[]
    streamers?: Participant[]
    startTime: string | null
    endTime?: string
    isLive: boolean
    isCollab: boolean
    collabPartners?: string[]
    thumbnailUrl?: string
    isVisible?: boolean
    isDrops?: boolean
    isChzzkSupport?: boolean
    overwatchMatch?: OverwatchMatchInfo | null
}

export type ViewMode = 'daily' | 'weekly' | 'monthly'
