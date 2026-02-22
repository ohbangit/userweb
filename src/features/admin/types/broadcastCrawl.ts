export interface CrawledParticipant {
    channelId: string | null
    name: string
    channelImageUrl: string | null
    isPartner: boolean
    isManaged: boolean
    streamerId: string | null
}

export interface CrawledBroadcast {
    sourceEventId: string
    title: string
    gameTitle: string | null
    tags: string[]
    broadcastType: string
    startTime: string
    endTime: string | null
    allDay: boolean
    timezone: string
    thumbnailUrl: string | null
    isLive: boolean
    isCollab: boolean
    participants: CrawledParticipant[]
}

export interface RunBroadcastCrawlRequest {
    monthStart: string
    monthEnd: string
}

export interface RunBroadcastCrawlResponse {
    runId: string
    status: string
    monthStart: string
    monthEnd: string
    broadcasts: CrawledBroadcast[]
}

export interface GetBroadcastCrawlRunResponse {
    runId: string
    status: string
    monthStart: string
    monthEnd: string
    broadcasts: CrawledBroadcast[]
}

export interface ApplyBroadcastCrawlRunRequest {
    sourceEventIds: string[]
}

export interface ApplyBroadcastCrawlRunResponse {
    insertedCount: number
}
