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
                    'cursor-pointer rounded-md px-2.5 py-2 text-sm font-medium transition-all sm:px-4 sm:py-1.5',
                    viewMode === 'daily'
                        ? 'bg-card text-text shadow-sm'
                        : 'text-text-muted hover:text-text',
                ].join(' ')}
            >
                <span className="sm:hidden">일</span>
                <span className="hidden sm:inline">일간</span>
            </button>
            <button
                onClick={() => onChange('weekly')}
                className={[
                    'cursor-pointer rounded-md px-2.5 py-2 text-sm font-medium transition-all sm:px-4 sm:py-1.5',
                    viewMode === 'weekly'
                        ? 'bg-card text-text shadow-sm'
                        : 'text-text-muted hover:text-text',
                ].join(' ')}
            >
                <span className="sm:hidden">주</span>
                <span className="hidden sm:inline">주간</span>
            </button>
            <button
                onClick={() => onChange('monthly')}
                className={[
                    'cursor-pointer rounded-md px-2.5 py-2 text-sm font-medium transition-all sm:px-4 sm:py-1.5',
                    viewMode === 'monthly'
                        ? 'bg-card text-text shadow-sm'
                        : 'text-text-muted hover:text-text',
                ].join(' ')}
            >
                <span className="sm:hidden">월</span>
                <span className="hidden sm:inline">월간</span>
            </button>
        </div>
    )
}
