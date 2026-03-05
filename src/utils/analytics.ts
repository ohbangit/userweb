/**
 * GA4 커스텀 이벤트 유틸리티
 *
 * - 프로덕션 환경에서만 전송한다 (개발/스테이징 오염 방지)
 * - window.gtag 미존재 시 조용히 무시한다
 * - 이벤트 이름과 파라미터 타입을 명시적으로 관리한다
 */

type GaEventMap = {
    /** 배너 클릭 */
    banner_click: {
        banner_title: string
        banner_type: string
        destination_url: string
    }
    /** 헤더 대회 메뉴에서 대회 페이지 진입 */
    tournament_enter: {
        slug: string
        tournament_name: string
        source: 'desktop_dropdown' | 'mobile_menu'
    }
    /** 방송 카드/행 클릭 → 상세 모달 오픈 */
    broadcast_click: {
        broadcast_id: string | number
        broadcast_name: string
        view_mode: 'daily' | 'weekly' | 'monthly'
    }
    /** 대회 페이지 내 외부 링크 클릭 */
    tournament_link_click: {
        slug: string
        link_label: string
        link_url: string
    }
    /** 대회 페이지 우측 패널 네비게이션 클릭 */
    tournament_panel_nav_click: {
        slug: string
        panel_label: string
        panel_id: string
    }
}

export function trackEvent<K extends keyof GaEventMap>(name: K, params: GaEventMap[K]): void {
    if (!import.meta.env.PROD) return
    if (typeof window.gtag !== 'function') return
    window.gtag('event', name, params as Record<string, unknown>)
}
