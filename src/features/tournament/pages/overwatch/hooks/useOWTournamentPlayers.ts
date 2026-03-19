import { useQuery } from '@tanstack/react-query'
import type { OWPlayersResponse } from '../types/owTournament'
import { OW_STATIC_PLAYERS } from '../data/overwatchStaticData'

export function useOWTournamentPlayers(_slug: string) {
    return useQuery<OWPlayersResponse, Error>({
        queryKey: ['ow-static-players'],
        queryFn: () => OW_STATIC_PLAYERS,
        initialData: OW_STATIC_PLAYERS,
        staleTime: Infinity,
    })
}
