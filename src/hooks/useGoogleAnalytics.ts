import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * React Router v6 + GA4 페이지뷰 추적 훅
 * - 라우트 변경 시마다 page_view 이벤트를 전송한다
 * - 프로덕션 환경에서만 동작한다
 */
export function useGoogleAnalytics() {
    const location = useLocation()

    useEffect(() => {
        if (!import.meta.env.PROD) return
        if (typeof window.gtag !== 'function') return

        window.gtag('event', 'page_view', {
            page_path: location.pathname + location.search,
            page_location: window.location.href,
        })
    }, [location])
}
