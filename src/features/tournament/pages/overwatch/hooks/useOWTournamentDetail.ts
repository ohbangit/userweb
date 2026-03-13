import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../../../../../lib/apiClient'
import type { OWPublicResponse } from '../types'

export function useOWTournamentDetail(slug: string) {
    return useQuery({
        queryKey: ['ow', slug, 'detail'],
        queryFn: () => apiGet<OWPublicResponse>(`/api/ow/${slug}`),
        retry: false,
    })
}
