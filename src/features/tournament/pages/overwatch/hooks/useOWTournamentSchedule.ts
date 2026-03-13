import { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { apiGet } from '../../../../../lib/apiClient'
import type { ScheduleDailyResponse } from '../../../../schedule/types/api'
import type { Broadcast } from '../../../../schedule/types/schedule'

interface OWScheduleDay {
    date: string
    items: Broadcast[]
}

interface UseOWTournamentScheduleResult {
    days: OWScheduleDay[]
    isLoading: boolean
    error: Error | null
}

const MAX_SCHEDULE_DAYS = 14

function buildDateRange(startDate: string | null, endDate: string | null): string[] {
    const start = startDate ?? endDate
    const end = endDate ?? startDate

    if (!start || !end) return []

    const startDay = dayjs(start)
    const endDay = dayjs(end)

    if (!startDay.isValid() || !endDay.isValid()) return []

    const lastDay = endDay.isBefore(startDay) ? startDay : endDay
    const dates: string[] = []
    let cursor = startDay

    while ((cursor.isBefore(lastDay, 'day') || cursor.isSame(lastDay, 'day')) && dates.length < MAX_SCHEDULE_DAYS) {
        dates.push(cursor.format('YYYY-MM-DD'))
        cursor = cursor.add(1, 'day')
    }

    return dates
}

function filterOWBroadcasts(items: Broadcast[]): Broadcast[] {
    return items.filter((item) => item.overwatchMatch != null)
}

export function useOWTournamentSchedule(startDate: string | null, endDate: string | null): UseOWTournamentScheduleResult {
    const dates = useMemo(() => buildDateRange(startDate, endDate), [endDate, startDate])

    const queries = useQueries({
        queries: dates.map((date) => ({
            queryKey: ['ow-schedule', date],
            queryFn: () =>
                apiGet<ScheduleDailyResponse>('/api/schedule', {
                    view: 'daily',
                    date,
                    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
                }),
            enabled: dates.length > 0,
            retry: false,
        })),
    })

    const isLoading = queries.some((query) => query.isLoading)
    const firstError = queries.find((query) => query.error)?.error ?? null

    const days = useMemo(() => {
        return queries
            .map((query, index) => {
                const response = query.data

                if (!response) return null

                const items = filterOWBroadcasts(response.items)

                return {
                    date: dates[index],
                    items,
                }
            })
            .filter((day): day is OWScheduleDay => day !== null && day.items.length > 0)
    }, [dates, queries])

    return {
        days,
        isLoading,
        error: firstError instanceof Error ? firstError : null,
    }
}
