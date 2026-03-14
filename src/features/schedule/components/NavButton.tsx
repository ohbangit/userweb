import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../../../components/ui'
import type { NavButtonProps } from './types'

/**
 * 날짜 컨트롤 패널 이전/다음 이동 버튼
 * Button outline + icon variant 사용.
 * 반응형: 모바일 h-9/w-9 → sm: h-8/w-8
 */
export function NavButton({ direction, onClick }: NavButtonProps) {
    return (
        <Button
            variant="outline"
            size="icon"
            onClick={onClick}
            className="rounded-lg sm:h-8 sm:w-8"
            aria-label={direction === 'prev' ? '이전' : '다음'}
        >
            {direction === 'prev' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
    )
}
