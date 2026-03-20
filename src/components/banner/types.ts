export interface PublicBanner {
    id: number
    type: string
    title: string
    description: string | null
    imageUrl: string
    linkUrl: string | null
    startedAt: string | null
    endedAt: string | null
    orderIndex: number
}

export interface PublicBannersResponse {
    banners: PublicBanner[]
}

export interface BannerCardProps {
    banner: PublicBanner
    isLargeImage: boolean
    isPriorityImage?: boolean
    onClick: (banner: PublicBanner) => void
    onImageLoad: (id: number, image: HTMLImageElement) => void
    innerRef?: (el: HTMLElement | null) => void
}

export interface BannerCarouselProps {
    banners: PublicBanner[]
}
