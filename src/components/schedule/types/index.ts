import type { Dayjs } from 'dayjs'
import type { ViewMode } from '../../../features/schedule/types'

export interface NavButtonProps {
    direction: 'prev' | 'next'
    onClick: () => void
}

export interface ViewToggleProps {
    viewMode: ViewMode
    onChange: (mode: ViewMode) => void
}

export interface PeriodDisplayProps {
    currentDate: Dayjs
    viewMode: ViewMode
}

export interface DateControlPanelProps {
    currentDate: Dayjs
    viewMode: ViewMode
    isToday: boolean
    onPrev: () => void
    onNext: () => void
    onToday: () => void
    onViewModeChange: (mode: ViewMode) => void
}
