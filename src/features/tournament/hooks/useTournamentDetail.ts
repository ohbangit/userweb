import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../../../lib/apiClient'
import type { TournamentDetail } from '../types'

export function useTournamentDetail(slug: string) {
    return useQuery({
        queryKey: ['tournaments', slug, 'detail'],
        queryFn: () => apiGet<TournamentDetail>(`/api/tournaments/${slug}`),
        retry: false,
    })
}
