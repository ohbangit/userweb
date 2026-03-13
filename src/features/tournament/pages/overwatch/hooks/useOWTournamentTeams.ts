import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../../../../../lib/apiClient'
import type { OWTeamsResponse } from '../types'

export function useOWTournamentTeams(slug: string) {
    return useQuery({
        queryKey: ['ow', slug, 'teams'],
        queryFn: () => apiGet<OWTeamsResponse>(`/api/ow/${slug}/teams`),
        retry: false,
    })
}
