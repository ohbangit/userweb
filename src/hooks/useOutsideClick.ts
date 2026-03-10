import { useEffect, type RefObject } from 'react'

/**
 * 지정한 요소 외부 클릭 시 콜백을 실행하는 훅
 * @param ref 감지 대상 요소의 ref
 * @param callback 외부 클릭 시 실행할 함수
 * @param enabled 훅 활성화 여부 (false이면 리스너 등록 안 함)
 */
export function useOutsideClick<T extends HTMLElement>(ref: RefObject<T | null>, callback: () => void, enabled = true) {
    useEffect(() => {
        if (!enabled) return

        function handleMouseDown(e: MouseEvent) {
            if (ref.current !== null && !ref.current.contains(e.target as Node)) {
                callback()
            }
        }

        document.addEventListener('mousedown', handleMouseDown)
        return () => document.removeEventListener('mousedown', handleMouseDown)
    }, [ref, callback, enabled])
}
