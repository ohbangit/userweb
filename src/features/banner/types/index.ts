/** 공개 배너 데이터 */
export interface PublicBanner {
    id: number
    type: string // 배너 유형 (tournament | collab | content | 내전 | 출시 | 인기)
    title: string
    description: string | null
    imageUrl: string
    linkUrl: string | null
    tournamentSlug: string | null
    startedAt: string | null // YYYY-MM-DD
    endedAt: string | null // YYYY-MM-DD
    orderIndex: number
}

/** usePublicBanners API 응답 */
export interface PublicBannersResponse {
    banners: PublicBanner[]
}

/** 배너 카드 props */
export interface BannerCardProps {
    banner: PublicBanner
    isLargeImage: boolean // 960x540 이상 이미지 — 대각선 디테일 적용
    isPriorityImage?: boolean
    onClick: (banner: PublicBanner) => void
    onImageLoad: (id: number, image: HTMLImageElement) => void
    innerRef?: (el: HTMLElement | null) => void // 캐러셀 스크롤 대상 ref
}

/** 배너 섹션 props */
export interface BannerCarouselProps {
    banners: PublicBanner[]
}
