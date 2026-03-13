import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../../../lib/apiClient'
import type { TournamentListResponse } from '../types'
import { QUERY_STALE_TIME_LONG } from '../../../constants/config'

export function useTournamentList() {
    return useQuery({
        queryKey: ['tournaments'],
        queryFn: () => apiGet<TournamentListResponse>('/api/tournaments'),
        retry: false,
        staleTime: QUERY_STALE_TIME_LONG,
    })
}
