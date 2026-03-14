import { NavButton } from './NavButton'
import { PeriodDisplay } from './PeriodDisplay'
import { ViewToggle } from './ViewToggle'
import { cn } from '../../../lib/cn'
import type { DateControlPanelProps } from './types'

/**
 * 날짜 컨트롤 패널
 * 스케줄러 상단의 날짜 이동 / 오늘로 이동 / 뷰모드 전환을 하나로 묶은 영역
 */
export function DateControlPanel({ currentDate, viewMode, isToday, onPrev, onNext, onToday, onViewModeChange }: DateControlPanelProps) {
    return (
        <div className="flex items-center justify-between gap-2">
            {/* 날짜 이동: 이전 · 현재 기간 · 다음 */}
            <div className="flex items-center gap-2 sm:gap-3">
                <NavButton direction="prev" onClick={onPrev} />
                <PeriodDisplay currentDate={currentDate} viewMode={viewMode} />
                <NavButton direction="next" onClick={onNext} />
            </div>

            {/* 오늘 이동 + 뷰모드 전환 */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <button
                    type="button"
                    onClick={onToday}
                    disabled={isToday}
                    className={cn(
                        'inline-flex h-9 items-center rounded-lg border px-2.5 text-xs font-medium transition-all duration-200',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                        'sm:h-8 sm:px-3',
                        isToday
                            ? // 오늘 활성: primary 색상으로 현재 위치 표시, 커서 기본
                              'cursor-default border-primary/40 bg-primary/10 text-primary'
                            : // 오늘 비활성: outline 버튼 패턴
                              'cursor-pointer border-border/50 bg-card text-text-muted hover:border-border hover:bg-card-hover hover:text-text active:scale-95',
                    )}
                >
                    오늘
                </button>
                <ViewToggle viewMode={viewMode} onChange={onViewModeChange} />
            </div>
        </div>
    )
}
