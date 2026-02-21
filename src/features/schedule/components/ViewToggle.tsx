import type { ViewMode } from '../types'

interface ViewToggleProps {
    viewMode: ViewMode
    onChange: (mode: ViewMode) => void
}

export function ViewToggle({ viewMode, onChange }: ViewToggleProps) {
    return (
        <div className="inline-flex rounded-lg border border-border/50 bg-bg-secondary p-0.5">
            <button
                onClick={() => onChange('daily')}
                className={[
                    'cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition-all sm:px-4 sm:py-1.5',
                    viewMode === 'daily'
                        ? 'bg-card text-text shadow-sm'
                        : 'text-text-muted hover:text-text',
                ].join(' ')}
            >
                일간
            </button>
            <button
                onClick={() => onChange('weekly')}
                className={[
                    'cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition-all sm:px-4 sm:py-1.5',
                    viewMode === 'weekly'
                        ? 'bg-card text-text shadow-sm'
                        : 'text-text-muted hover:text-text',
                ].join(' ')}
            >
                주간
            </button>
            <button
                onClick={() => onChange('monthly')}
                className={[
                    'cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition-all sm:px-4 sm:py-1.5',
                    viewMode === 'monthly'
                        ? 'bg-card text-text shadow-sm'
                        : 'text-text-muted hover:text-text',
                ].join(' ')}
            >
                월간
            </button>
        </div>
    )
}
