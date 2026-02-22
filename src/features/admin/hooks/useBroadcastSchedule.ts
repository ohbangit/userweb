import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    adminApiGet,
    adminApiPost,
    adminApiPatch,
    adminApiDelete,
} from '../../../lib/apiClient'
import type {
    CreateBroadcastRequest,
    UpdateBroadcastRequest,
    BroadcastMutationResponse,
} from '../types'
import type {
    ScheduleWeeklyResponse,
    ScheduleMonthlyResponse,
} from '../../schedule/types'

type ScheduleView = 'weekly' | 'monthly'

type UseScheduleParams = {
    view: ScheduleView
    date: string
    tz?: string
}

const SCHEDULE_KEY = ['admin', 'schedule'] as const

export function useScheduleBroadcasts({ view, date, tz }: UseScheduleParams) {
    const params: Record<string, string> = { view, date }
    if (tz !== undefined) params['tz'] = tz
    return useQuery<ScheduleWeeklyResponse | ScheduleMonthlyResponse>({
        queryKey: [...SCHEDULE_KEY, view, date],
        queryFn: () =>
            adminApiGet<ScheduleWeeklyResponse | ScheduleMonthlyResponse>(
                '/api/admin/schedule',
                params,
            ),
    })
}

export function useCreateBroadcast() {
    const queryClient = useQueryClient()
    return useMutation<
        BroadcastMutationResponse,
        Error,
        CreateBroadcastRequest
    >({
        mutationFn: (body) =>
            adminApiPost<BroadcastMutationResponse>(
                '/api/admin/broadcasts',
                body,
            ),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: SCHEDULE_KEY })
        },
    })
}

export function useUpdateBroadcast(broadcastId: string) {
    const queryClient = useQueryClient()
    return useMutation<
        BroadcastMutationResponse,
        Error,
        UpdateBroadcastRequest
    >({
        mutationFn: (body) =>
            adminApiPatch<BroadcastMutationResponse>(
                `/api/admin/broadcasts/${broadcastId}`,
                body,
            ),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: SCHEDULE_KEY })
        },
    })
}

export function useDeleteBroadcast() {
    const queryClient = useQueryClient()
    return useMutation<void, Error, string>({
        mutationFn: (broadcastId) =>
            adminApiDelete(`/api/admin/broadcasts/${broadcastId}`),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: SCHEDULE_KEY })
        },
    })
}
