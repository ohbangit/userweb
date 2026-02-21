import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    adminApiGet,
    adminApiPost,
    adminApiPatch,
} from '../../../lib/apiClient'
import type {
    StreamerItem,
    RegisterStreamerRequest,
    UpdateChannelRequest,
    UpdateYoutubeUrlRequest,
    UpdateFanCafeUrlRequest,
} from '../types'

type StreamerListResponse = { items: StreamerItem[] }

type StreamersParams = {
    name?: string
    hasChannel?: boolean
}

const STREAMERS_KEY = ['admin', 'streamers'] as const

export function useStreamers(params: StreamersParams = {}) {
    const queryParams: Record<string, string> = {}
    if (params.name !== undefined && params.name.trim().length > 0) {
        queryParams['name'] = params.name.trim()
    }
    if (params.hasChannel === false) {
        queryParams['hasChannel'] = 'false'
    }
    return useQuery<StreamerItem[]>({
        queryKey: [...STREAMERS_KEY, queryParams],
        queryFn: () =>
            adminApiGet<StreamerListResponse>(
                '/api/admin/streamers',
                queryParams,
            ).then((res) => res.items),
    })
}

export function useRegisterStreamer() {
    const queryClient = useQueryClient()
    return useMutation<StreamerItem, Error, RegisterStreamerRequest>({
        mutationFn: (body) =>
            adminApiPost<StreamerItem>('/api/admin/streamers', body),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: STREAMERS_KEY })
        },
    })
}

export function useSyncStreamer(streamerId: string) {
    const queryClient = useQueryClient()
    return useMutation<StreamerItem, Error, UpdateChannelRequest>({
        mutationFn: (body) =>
            adminApiPatch<StreamerItem>(
                `/api/admin/streamers/${streamerId}/channel`,
                body,
            ),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: STREAMERS_KEY })
        },
    })
}

export function useUpdateYoutubeUrl(channelId: string) {
    const queryClient = useQueryClient()
    return useMutation<StreamerItem, Error, UpdateYoutubeUrlRequest>({
        mutationFn: (body) =>
            adminApiPatch<StreamerItem>(
                `/api/admin/streamers/${channelId}/youtube-url`,
                body,
            ),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: STREAMERS_KEY })
        },
    })
}

export function useUpdateFanCafeUrl(channelId: string) {
    const queryClient = useQueryClient()
    return useMutation<StreamerItem, Error, UpdateFanCafeUrlRequest>({
        mutationFn: (body) =>
            adminApiPatch<StreamerItem>(
                `/api/admin/streamers/${channelId}/fan-cafe-url`,
                body,
            ),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: STREAMERS_KEY })
        },
    })
}

export function useRefreshStreamer(streamerId: string) {
    const queryClient = useQueryClient()
    return useMutation<StreamerItem, Error, void>({
        mutationFn: () =>
            adminApiPost<StreamerItem>(
                `/api/admin/streamers/${streamerId}/refresh`,
                {},
            ),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: STREAMERS_KEY })
        },
    })
}
