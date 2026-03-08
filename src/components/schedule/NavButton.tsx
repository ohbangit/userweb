import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { NavButtonProps } from './types'

/**
 * 날짜 컨트롤 패널 이전/다음 이동 버튼
 * shadcn outline variant + magicui active:scale-95 press 피드백 적용
 */
export function NavButton({ direction, onClick }: NavButtonProps) {
    return (
        <button
            onClick={onClick}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border/50 bg-card text-text-muted transition-all duration-200 hover:border-border hover:bg-muted/50 hover:text-text active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:h-8 sm:w-8"
        >
            {direction === 'prev' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
    )
}
