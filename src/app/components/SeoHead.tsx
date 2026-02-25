import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

const DEFAULT_SITE_URL = 'https://ohbang-it.kr'
const DEFAULT_IMAGE_PATH = '/og-default.svg'

const SITE_KEYWORDS =
    '치지직,치지직 스케줄,치지직 방송일정,스트리밍 일정,오뱅잇,방송 스케줄,치지직 라이브'

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
        title: '오뱅잇 - 치지직 스트리밍 스케줄',
        description:
            '치지직 스트리밍 일정을 일간, 주간, 월간으로 확인하고 방송 상세 정보를 빠르게 확인하세요.',
        robots: 'index, follow',
    }
}

/**
 * 공통 SEO 헤드 컴포넌트
 * — 모든 페이지에서 렌더링되는 기본 메타태그 및 구조화 데이터
 * — ScheduleSeoHead 가 페이지 안에 존재하면 title/description 은 덮어쓰여짐
 */
export function SeoHead() {
    const location = useLocation()
    const siteUrl =
        (import.meta.env.VITE_SITE_URL as string | undefined) ??
        DEFAULT_SITE_URL
    const ogImageUrl =
        (import.meta.env.VITE_OG_IMAGE_URL as string | undefined) ??
        `${siteUrl}${DEFAULT_IMAGE_PATH}`
    const canonicalUrl = `${siteUrl}/`
    const meta = resolveMeta(location.pathname)

    const isPublicPage = !location.pathname.startsWith('/admin')

    const websiteJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: '오뱅잇',
        url: siteUrl,
        description: '치지직 스트리밍 일정을 일간, 주간, 월간으로 확인하세요.',
        inLanguage: 'ko-KR',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${siteUrl}/?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    }

    return (
        <Helmet>
            <title>{meta.title}</title>
            <meta name="description" content={meta.description} />
            <meta name="robots" content={meta.robots} />
            <link rel="canonical" href={canonicalUrl} />

            {isPublicPage && <meta name="keywords" content={SITE_KEYWORDS} />}

            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="오뱅잇" />
            <meta property="og:locale" content="ko_KR" />
            <meta property="og:title" content={meta.title} />
            <meta property="og:description" content={meta.description} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:image" content={ogImageUrl} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta
                property="og:image:alt"
                content="오뱅잇 - 치지직 스트리밍 스케줄"
            />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={meta.title} />
            <meta name="twitter:description" content={meta.description} />
            <meta name="twitter:image" content={ogImageUrl} />

            {isPublicPage && (
                <script type="application/ld+json">
                    {JSON.stringify(websiteJsonLd)}
                </script>
            )}
        </Helmet>
    )
}
