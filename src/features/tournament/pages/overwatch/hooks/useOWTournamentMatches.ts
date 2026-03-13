import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../../../../../lib/apiClient'
import type { OWBracketResponse } from '../types'

export function useOWTournamentMatches(slug: string) {
    return useQuery({
        queryKey: ['ow', slug, 'matches'],
        queryFn: () => apiGet<OWBracketResponse>(`/api/ow/${slug}/matches`),
        retry: false,
    })
}
