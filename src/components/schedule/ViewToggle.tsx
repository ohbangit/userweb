import type { ViewToggleProps } from './types'

/** 뷰 모드 전환 세그먼트 컨트롤 (일간 / 주간 / 월간) */
export function ViewToggle({ viewMode, onChange }: ViewToggleProps) {
    // 공통 버튼 base 클래스
    // h-8 sm:h-7: 컨테이너 p-0.5(2px 상하) 포함 시 전체 높이가 h-9 sm:h-8로 NavButton · 오늘 버튼과 동일하게 맞춤
    const baseClass =
        'inline-flex h-8 cursor-pointer items-center rounded-md px-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:h-7 sm:px-4'

    // 선택된 탭 클래스 (shadcn data-[state=on] 패턴 참조)
    const activeClass = 'bg-card text-text shadow-sm'

    // 비선택 탭 클래스 (shadcn ghost hover 패턴 참조)
    const inactiveClass = 'text-text-muted hover:bg-muted/50 hover:text-text active:scale-95'

    return (
        <div className="inline-flex rounded-lg border border-border/50 bg-bg-secondary p-0.5">
            <button onClick={() => onChange('daily')} className={[baseClass, viewMode === 'daily' ? activeClass : inactiveClass].join(' ')}>
                <span className="sm:hidden">일</span>
                <span className="hidden sm:inline">일간</span>
            </button>
            <button
                onClick={() => onChange('weekly')}
                className={[baseClass, viewMode === 'weekly' ? activeClass : inactiveClass].join(' ')}
            >
                <span className="sm:hidden">주</span>
                <span className="hidden sm:inline">주간</span>
            </button>
            <button
                onClick={() => onChange('monthly')}
                className={[baseClass, viewMode === 'monthly' ? activeClass : inactiveClass].join(' ')}
            >
                <span className="sm:hidden">월</span>
                <span className="hidden sm:inline">월간</span>
            </button>
        </div>
    )
}
