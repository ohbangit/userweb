import { useEffect, useState } from 'react'

/**
 * 페이지 스크롤이 threshold를 넘었는지 여부를 반환하는 훅
 * @param threshold 감지 기준 스크롤 거리 (px, 기본값 0)
 * @returns threshold 초과 여부
 */
export function useScrolled(threshold = 0) {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        function handleScroll() {
            setScrolled(window.scrollY > threshold)
        }

        // 마운트 시 초기값 동기화
        handleScroll()

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [threshold])

    return scrolled
}
