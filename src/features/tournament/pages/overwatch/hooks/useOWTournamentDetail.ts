import { useQuery } from '@tanstack/react-query'
import type { OWPublicResponse } from '../types/owTournament'
import { OW_STATIC_META } from '../data/overwatchStaticData'

export function useOWTournamentDetail() {
    return useQuery<OWPublicResponse, Error>({
        queryKey: ['ow-static-detail'],
        queryFn: () => OW_STATIC_META,
        initialData: OW_STATIC_META,
        staleTime: Infinity,
    })
}
