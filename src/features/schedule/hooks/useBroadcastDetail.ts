import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../../../lib/apiClient'
import type { BroadcastDetailResponse } from '../types/api'

export function useBroadcastDetail(broadcastId: string | null) {
    return useQuery({
        queryKey: ['broadcast', broadcastId],
        queryFn: () =>
            apiGet<BroadcastDetailResponse>(`/api/broadcasts/${broadcastId}`),
        enabled: !!broadcastId,
    })
}
