import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../../../lib/apiClient'
import type { TournamentDetail, TournamentDetailV2 } from '../types'

export function useTournamentDetail(slug: string) {
    return useQuery({
        queryKey: ['tournaments', slug, 'detail'],
        queryFn: () => apiGet<TournamentDetail>(`/api/tournaments/${slug}`),
        retry: false,
    })
}

export function useTournamentDetailV2(slug: string) {
    return useQuery({
        queryKey: ['tournaments', 'v2', slug, 'detail'],
        queryFn: () => apiGet<TournamentDetailV2>(`/api/tournaments/v2/${slug}`),
        retry: false,
    })
}
