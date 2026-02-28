export interface StreamerItem {
    id: number
    name: string
    nickname: string
    channelId: string | null
    isPartner: boolean
    channelImageUrl: string | null
    followerCount: number | null
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

export interface UpdateNicknameRequest {
    nickname: string
}
