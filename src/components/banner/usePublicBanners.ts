import { useQuery } from '@tanstack/react-query'
import { QUERY_STALE_TIME_DEFAULT } from '../../constants/config'
import { apiGet } from '../../lib/apiClient'
import type { PublicBannersResponse } from './types'

export function usePublicBanners() {
    return useQuery<PublicBannersResponse>({
        queryKey: ['banners', 'public'],
        queryFn: () => apiGet<PublicBannersResponse>('/api/banners'),
        staleTime: QUERY_STALE_TIME_DEFAULT,
    })
}
