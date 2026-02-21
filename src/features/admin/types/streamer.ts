export interface StreamerItem {
    id: string
    name: string
    channelId: string | null
    isPartner: boolean
    channelImageUrl: string | null
    youtubeUrl: string | null
    fanCafeUrl: string | null
}

export interface RegisterStreamerRequest {
    channelId: string
}

export interface UpdateChannelRequest {
    channelId: string
}

export interface UpdateYoutubeUrlRequest {
    youtubeUrl: string
}

export interface UpdateFanCafeUrlRequest {
    fanCafeUrl: string
}
