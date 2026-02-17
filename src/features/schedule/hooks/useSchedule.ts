import { useQuery } from '@tanstack/react-query'
import type { Dayjs } from 'dayjs'
import { apiGet } from '../../../lib/apiClient'
import type { Broadcast, ViewMode } from '../types/schedule'
import type { ScheduleResponse } from '../types/api'

function formatDateParam(date: Dayjs): string {
    return date.format('YYYY-MM-DD')
}

function normalizeBroadcasts(response: ScheduleResponse): Broadcast[] {
    if (response.view === 'daily') {
        return response.items
    }
    return response.days.flatMap((day) => day.items)
}

export function useSchedule(viewMode: ViewMode, currentDate: Dayjs) {
    const dateStr = formatDateParam(currentDate)

    return useQuery({
        queryKey: ['schedule', viewMode, dateStr],
        queryFn: () =>
            apiGet<ScheduleResponse>('/api/schedule', {
                view: viewMode,
                date: dateStr,
                tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
            }),
        select: normalizeBroadcasts,
    })
}
