import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../../../lib/apiClient'
import type { PublicPromotionConfig, PublicTournamentPlayersResponse, TournamentTeamsResponse } from '../types'

/** 대회 슬러그로 배포된 프로모션 설정을 조회한다 */
export function useTournamentPromotion(slug: string) {
    return useQuery({
        queryKey: ['tournaments', slug, 'promotion'],
        queryFn: () => apiGet<PublicPromotionConfig>(`/api/tournaments/${slug}/promotion`),
        retry: false,
    })
}

/** 대회 슬러그로 팀 목록을 조회한다 */
export function useTournamentTeams(slug: string, enabled = true) {
    return useQuery({
        queryKey: ['tournaments', slug, 'teams'],
        queryFn: () => apiGet<TournamentTeamsResponse>(`/api/tournaments/${slug}/teams`),
        enabled,
        retry: false,
    })
}

/** 대회 슬러그로 F1 플레이어 목록을 조회한다 */
export function useTournamentPlayers(slug: string, enabled = true) {
    return useQuery({
        queryKey: ['tournaments', slug, 'players'],
        queryFn: () => apiGet<PublicTournamentPlayersResponse>(`/api/tournaments/v2/${slug}/players`),
        enabled: enabled && slug.trim().length > 0,
        retry: false,
    })
}
