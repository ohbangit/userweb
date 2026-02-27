import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../../../lib/apiClient'
import type { TournamentListResponse } from '../types'

export function useTournamentList() {
    return useQuery({
        queryKey: ['tournaments'],
        queryFn: () => apiGet<TournamentListResponse>('/api/tournaments'),
        retry: false,
        staleTime: 1000 * 60 * 10,
    })
}
