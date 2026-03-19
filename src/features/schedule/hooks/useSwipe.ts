import { useCallback, useRef } from 'react'

/**
 * 좌우 스와이프 제스처를 감지합니다.
 * @param onSwipeLeft 왼쪽 스와이프 시 호출
 * @param onSwipeRight 오른쪽 스와이프 시 호출
 * @returns touchStart/touchEnd 핸들러
 */
export function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void) {
    const touchStartX = useRef(0)
    const touchStartY = useRef(0)

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX
        touchStartY.current = e.touches[0].clientY
    }, [])

    const handleTouchEnd = useCallback(
        (e: React.TouchEvent) => {
            const dx = e.changedTouches[0].clientX - touchStartX.current
            const dy = e.changedTouches[0].clientY - touchStartY.current
            if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx)) return
            if (dx < 0) onSwipeLeft()
            else onSwipeRight()
        },
        [onSwipeLeft, onSwipeRight],
    )

    return { handleTouchStart, handleTouchEnd }
}
