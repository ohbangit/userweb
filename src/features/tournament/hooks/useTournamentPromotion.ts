import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../../../lib/apiClient'
import type { PublicPromotionConfig, TournamentTeamsResponse } from '../types'

/** 대회 슬러그로 배포된 프로모션 설정을 조회한다 */
export function useTournamentPromotion(slug: string) {
    return useQuery({
        queryKey: ['tournaments', slug, 'promotion'],
        queryFn: () =>
            apiGet<PublicPromotionConfig>(`/tournaments/${slug}/promotion`),
        retry: false,
    })
}

/** 대회 슬러그로 팀 목록을 조회한다 */
export function useTournamentTeams(slug: string, enabled = true) {
    return useQuery({
        queryKey: ['tournaments', slug, 'teams'],
        queryFn: () =>
            apiGet<TournamentTeamsResponse>(`/tournaments/${slug}/teams`),
        enabled,
        retry: false,
    })
}
