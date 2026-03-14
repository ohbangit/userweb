import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../../lib/apiClient'
import type { MenuItem } from './types'

const MENUS_STALE_TIME_MS = 5 * 60 * 1000
const MENUS_GC_TIME_MS = 30 * 60 * 1000

export function useMenus() {
    return useQuery({
        queryKey: ['menus'],
        queryFn: () => apiGet<readonly MenuItem[]>('/api/menus'),
        staleTime: MENUS_STALE_TIME_MS,
        gcTime: MENUS_GC_TIME_MS,
    })
}
