import { useQuery } from '@tanstack/react-query'
import type { OWTeamsResponse } from '../types/owTournament'
import { OW_STATIC_TEAMS } from '../data/overwatchStaticData'

export function useOWTournamentTeams() {
    return useQuery<OWTeamsResponse, Error>({
        queryKey: ['ow-static-teams'],
        queryFn: () => OW_STATIC_TEAMS,
        initialData: OW_STATIC_TEAMS,
        staleTime: Infinity,
    })
}
