import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../../../lib/apiClient'
import type { PublicBannersResponse } from '../types'
import { QUERY_STALE_TIME_DEFAULT } from '../../../constants/config'

/**
 * 공개 배너 목록을 조회합니다.
 * @returns 배너 목록 쿼리 결과 (banners 배열 포함)
 */
export function usePublicBanners() {
    return useQuery<PublicBannersResponse>({
        queryKey: ['banners', 'public'],
        queryFn: () => apiGet<PublicBannersResponse>('/api/banners'),
        staleTime: QUERY_STALE_TIME_DEFAULT,
    })
}
