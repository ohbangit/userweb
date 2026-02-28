import { useState, useEffect } from 'react'
import type { ViewMode } from '../features/schedule/types'

const STORAGE_KEY = 'ohbangit-view-mode'
const DEFAULT_MODE: ViewMode = 'weekly'
const VALID_MODES: readonly ViewMode[] = ['daily', 'weekly', 'monthly']

function isValidViewMode(value: string | null | undefined): value is ViewMode {
    return value != null && VALID_MODES.includes(value as ViewMode)
}

function getInitialViewMode(urlParam?: string | null): ViewMode {
    if (isValidViewMode(urlParam)) {
        return urlParam
    }
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isValidViewMode(stored)) {
        return stored
    }
    return DEFAULT_MODE
}

export function useViewMode(urlParam?: string | null) {
    const [viewMode, setViewMode] = useState<ViewMode>(
        () => getInitialViewMode(urlParam),
    )

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, viewMode)
    }, [viewMode])

    return { viewMode, setViewMode } as const
}
