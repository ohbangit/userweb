import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../../../../../lib/apiClient'
import type { OWPlayersResponse } from '../types'

export function useOWTournamentPlayers(slug: string) {
    return useQuery({
        queryKey: ['ow', slug, 'players'],
        queryFn: () => apiGet<OWPlayersResponse>(`/api/ow/${slug}/players`),
        retry: false,
    })
}
