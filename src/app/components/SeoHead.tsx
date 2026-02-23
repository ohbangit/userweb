import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

const DEFAULT_SITE_URL = 'https://ohbang-it.kr'
const DEFAULT_IMAGE_PATH = '/og-default.svg'

type SeoMeta = {
    readonly title: string
    readonly description: string
    readonly robots: string
}

function resolveMeta(pathname: string): SeoMeta {
    if (pathname.startsWith('/admin')) {
        return {
            title: '오뱅잇 어드민',
            description: '오뱅잇 관리자 페이지',
            robots: 'noindex, nofollow, noarchive',
        }
    }
    return {
        title: '오뱅잇 - 스트리밍 스케줄',
        description:
            '치지직 스트리밍 일정을 일간, 주간, 월간으로 확인하고 방송 상세 정보를 빠르게 확인하세요.',
        robots: 'index, follow',
    }
}

export function SeoHead() {
    const location = useLocation()
    const siteUrl =
        (import.meta.env.VITE_SITE_URL as string | undefined) ??
        DEFAULT_SITE_URL
    const ogImageUrl =
        (import.meta.env.VITE_OG_IMAGE_URL as string | undefined) ??
        `${siteUrl}${DEFAULT_IMAGE_PATH}`
    const canonicalUrl = `${siteUrl}${location.pathname}`
    const meta = resolveMeta(location.pathname)

    return (
        <Helmet>
            <title>{meta.title}</title>
            <meta name="description" content={meta.description} />
            <meta name="robots" content={meta.robots} />
            <link rel="canonical" href={canonicalUrl} />

            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="오뱅잇" />
            <meta property="og:locale" content="ko_KR" />
            <meta property="og:title" content={meta.title} />
            <meta property="og:description" content={meta.description} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:image" content={ogImageUrl} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={meta.title} />
            <meta name="twitter:description" content={meta.description} />
            <meta name="twitter:image" content={ogImageUrl} />
        </Helmet>
    )
}
