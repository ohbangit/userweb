import { NavButton } from './NavButton'
import { PeriodDisplay } from './PeriodDisplay'
import { ViewToggle } from './ViewToggle'
import { cn } from '../../../lib/cn'
import type { DateControlPanelProps } from './types'

function TodayButton({ isToday, onToday }: { isToday: boolean; onToday: () => void }) {
    return (
        <button
            type="button"
            onClick={onToday}
            disabled={isToday}
            className={cn(
                'inline-flex h-9 items-center rounded-lg border px-2.5 text-xs font-medium transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                'sm:h-8 sm:px-3',
                isToday
                    ? 'cursor-default border-primary/40 bg-primary/10 text-primary'
                    : 'cursor-pointer border-border/50 bg-card text-text-muted hover:border-border hover:bg-card-hover hover:text-text active:scale-95',
            )}
        >
            오늘
        </button>
    )
}

function MobilePanel({ currentDate, viewMode, isToday, onPrev, onNext, onToday, onViewModeChange }: DateControlPanelProps) {
    return (
        <div className="rounded-xl border border-border/30 bg-card/40 px-4 py-3">
            <div className="flex items-center gap-2 sm:gap-3">
                <NavButton direction="prev" onClick={onPrev} />
                <PeriodDisplay currentDate={currentDate} viewMode={viewMode} />
                <NavButton direction="next" onClick={onNext} />
            </div>
            <div className="mt-2.5 flex items-center justify-between">
                <TodayButton isToday={isToday} onToday={onToday} />
                <ViewToggle viewMode={viewMode} onChange={onViewModeChange} />
            </div>
        </div>
    )
}

function DesktopPanel({ currentDate, viewMode, isToday, onPrev, onNext, onToday, onViewModeChange }: DateControlPanelProps) {
    return (
        <div className="flex items-center justify-between gap-1.5 rounded-xl border border-border/30 bg-card/40 px-4 py-2.5 sm:gap-2">
            <div className="flex shrink-0 items-center gap-1 sm:gap-3">
                <NavButton direction="prev" onClick={onPrev} />
                <PeriodDisplay currentDate={currentDate} viewMode={viewMode} />
                <NavButton direction="next" onClick={onNext} />
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <TodayButton isToday={isToday} onToday={onToday} />
                <ViewToggle viewMode={viewMode} onChange={onViewModeChange} />
            </div>
        </div>
    )
}

export function DateControlPanel(props: DateControlPanelProps) {
    return (
        <>
            <div className="lg:hidden">
                <MobilePanel {...props} />
            </div>
            <div className="hidden lg:block">
                <DesktopPanel {...props} />
            </div>
        </>
    )
}
