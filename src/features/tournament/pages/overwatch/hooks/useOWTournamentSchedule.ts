import type { Broadcast } from '../../../../schedule/types/schedule'

interface UseOWTournamentScheduleResult {
    days: Array<{
        date: string
        items: Broadcast[]
    }>
    isLoading: boolean
    error: Error | null
}

export function useOWTournamentSchedule(
    _startDate: string | null,
    _endDate: string | null,
): UseOWTournamentScheduleResult {
    return {
        days: [],
        isLoading: false,
        error: null,
    }
}
