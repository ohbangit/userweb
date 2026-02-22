import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApiGet, adminApiPost } from '../../../lib/apiClient'
import type {
    ApplyBroadcastCrawlRunRequest,
    ApplyBroadcastCrawlRunResponse,
    GetBroadcastCrawlRunResponse,
    RunBroadcastCrawlRequest,
    RunBroadcastCrawlResponse,
} from '../types'

export function useRunBroadcastCrawl() {
    return useMutation<
        RunBroadcastCrawlResponse,
        Error,
        RunBroadcastCrawlRequest
    >({
        mutationFn: (body) =>
            adminApiPost<RunBroadcastCrawlResponse>(
                '/api/admin/broadcast-crawl/runs',
                body,
            ),
    })
}

export function useGetBroadcastCrawlRun() {
    return useMutation<GetBroadcastCrawlRunResponse, Error, { runId: string }>({
        mutationFn: ({ runId }) =>
            adminApiGet<GetBroadcastCrawlRunResponse>(
                `/api/admin/broadcast-crawl/runs/${runId}`,
            ),
    })
}

export function useApplyBroadcastCrawlRun() {
    const queryClient = useQueryClient()
    return useMutation<
        ApplyBroadcastCrawlRunResponse,
        Error,
        { runId: string; body: ApplyBroadcastCrawlRunRequest }
    >({
        mutationFn: ({ runId, body }) =>
            adminApiPost<ApplyBroadcastCrawlRunResponse>(
                `/api/admin/broadcast-crawl/runs/${runId}/apply`,
                body,
            ),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: ['schedule'],
            })
        },
    })
}
