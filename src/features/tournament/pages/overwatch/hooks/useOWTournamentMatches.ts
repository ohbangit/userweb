import { useQuery } from '@tanstack/react-query'
import type { OWBracketResponse } from '../types/owTournament'
import { OW_STATIC_MATCHES } from '../data/overwatchStaticData'

export function useOWTournamentMatches() {
    return useQuery<OWBracketResponse, Error>({
        queryKey: ['ow-static-matches'],
        queryFn: () => OW_STATIC_MATCHES,
        initialData: OW_STATIC_MATCHES,
        staleTime: Infinity,
    })
}
