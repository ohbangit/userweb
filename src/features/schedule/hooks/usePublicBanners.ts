import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../../../lib/apiClient'

export interface PublicBanner {
    id: number
    type: string
    title: string
    description: string | null
    imageUrl: string
    linkUrl: string | null
    tournamentSlug: string | null
    startedAt: string | null
    endedAt: string | null
    orderIndex: number
}

interface PublicBannersResponse {
    banners: PublicBanner[]
}

export function usePublicBanners() {
    return useQuery<PublicBannersResponse>({
        queryKey: ['banners', 'public'],
        queryFn: () => apiGet<PublicBannersResponse>('/api/banners'),
        staleTime: 5 * 60 * 1000,
    })
}
