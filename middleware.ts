/**
 * Vercel Edge Middleware — 소셜 봇 OG 메타태그 동적 주입
 *
 * 봇(KakaoTalk·Discord·Twitter 등) UA를 감지하면 index.html을 fetch한 뒤
 * 라우트에 맞는 동적 OG/Twitter 태그를 <!-- OG_META_START/END --> 구간에 주입하여 반환한다.
 * 일반 사용자 요청은 그대로 통과시킨다.
 *
 * ※ Vercel Edge Middleware 내부 fetch()는 미들웨어를 재호출하지 않으므로 무한 루프 없음.
 */

// ---------------------------------------------------------------------------
// 타입
// ---------------------------------------------------------------------------
interface OgMeta {
    title: string
    description: string
    url: string
    imageUrl: string
}

interface TournamentDetail {
    name: string
    bannerUrl: string | null
}

// ---------------------------------------------------------------------------
// 상수
// ---------------------------------------------------------------------------
const SITE_URL =
    (process.env.VITE_SITE_URL as string | undefined) ?? 'https://ohbang-it.kr'

const API_BASE_URL =
    (process.env.VITE_API_BASE_URL as string | undefined) ??
    'http://localhost:3000'

const DEFAULT_DESCRIPTION =
    '치지직 스트리밍 일정을 일간, 주간, 월간으로 확인하고 방송 상세 정보를 빠르게 확인하세요.'

const DEFAULT_OG: OgMeta = {
    title: '오뱅잇 - 치지직 스트리밍 스케줄',
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    imageUrl: `${SITE_URL}/api/og`,
}

// ---------------------------------------------------------------------------
// 봇 UA 감지
// ---------------------------------------------------------------------------
const BOT_UA_PATTERNS = [
    // 소셜/메신저
    'kakaotalk',
    'kakaostory',
    'facebookexternalhit',
    'facebot',
    'twitterbot',
    'discordbot',
    'slackbot',
    'slack-imgproxy',
    'telegrambot',
    'whatsapp',
    'line/',
    'linkedinbot',
    // 검색 크롤러
    'googlebot',
    'bingbot',
    'yandexbot',
    'duckduckbot',
    'baiduspider',
    'applebot',
    // 공통 프리뷰/크롤러
    'embedly',
    'ia_archiver',
    'sogou',
    'rogerbot',
    'screaming frog',
]

function isBot(ua: string): boolean {
    const lower = ua.toLowerCase()
    return BOT_UA_PATTERNS.some((p) => lower.includes(p))
}

// ---------------------------------------------------------------------------
// HTML 이스케이프
// ---------------------------------------------------------------------------
function esc(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
}

// ---------------------------------------------------------------------------
// 날짜 유틸
// ---------------------------------------------------------------------------
const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'] as const

function parseKstDate(dateStr: string): Date | null {
    // dateStr: YYYY-MM-DD
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (!match) return null
    const d = new Date(`${dateStr}T00:00:00+09:00`)
    return isNaN(d.getTime()) ? null : d
}

// ---------------------------------------------------------------------------
// 라우트별 OG 메타 생성
// ---------------------------------------------------------------------------

/** 스케줄 페이지: URL 파라미터 기반 제목·설명 생성 (API 호출 없음) */
function buildScheduleOg(url: URL): OgMeta {
    const dateParam = url.searchParams.get('date')
    const view = url.searchParams.get('view') ?? 'daily'

    if (!dateParam) return { ...DEFAULT_OG, url: url.href }

    const d = parseKstDate(dateParam)
    if (!d) return { ...DEFAULT_OG, url: url.href }

    const m = d.getMonth() + 1
    const day = d.getDate()
    const dayName = DAY_NAMES[d.getDay()]

    let title: string
    if (view === 'daily') {
        title = `오뱅잇 - ${m}월 ${day}일(${dayName}) 치지직 스케줄`
    } else if (view === 'weekly') {
        title = `오뱅잇 - ${m}월 치지직 주간 스케줄`
    } else {
        title = `오뱅잇 - ${d.getFullYear()}년 ${m}월 치지직 스케줄`
    }

    const description = `${m}월 ${day}일 치지직 방송 일정을 오뱅잇에서 확인하세요. 일간·주간·월간 스케줄과 방송 상세 정보를 한눈에 볼 수 있습니다.`
    const ogParams = new URLSearchParams({ title, description })

    return {
        title,
        description,
        url: url.href,
        imageUrl: `${SITE_URL}/api/og?${ogParams.toString()}`,
    }
}

/** 토너먼트 페이지: 백엔드 API 조회 (2초 타임아웃, 실패 시 기본값 반환) */
async function buildTournamentOg(url: URL, slug: string): Promise<OgMeta> {
    try {
        const res = await fetch(`${API_BASE_URL}/api/tournaments/${slug}`, {
            signal: AbortSignal.timeout(2000),
            headers: { 'Content-Type': 'application/json' },
        })

        if (res.ok) {
            const data = (await res.json()) as TournamentDetail
            const title = `오뱅잇 - ${data.name}`
            const description = `${data.name} 대회 정보와 일정을 오뱅잇에서 확인하세요.`
            const ogParams = new URLSearchParams({ title, description })

            return {
                title,
                description,
                url: url.href,
                imageUrl:
                    data.bannerUrl ??
                    `${SITE_URL}/api/og?${ogParams.toString()}`,
            }
        }
    } catch {
        // 타임아웃 또는 네트워크 오류 → 기본값 사용
    }

    return {
        title: '오뱅잇 - 대회 정보',
        description: '오뱅잇에서 대회 정보와 일정을 확인하세요.',
        url: url.href,
        imageUrl: `${SITE_URL}/api/og?${new URLSearchParams({ title: '오뱅잇 - 대회 정보', description: '오뱅잇에서 대회 정보와 일정을 확인하세요.' }).toString()}`,
    }
}

/** URL에 따라 적절한 OgMeta 반환 */
async function resolveOgMeta(url: URL): Promise<OgMeta> {
    const { pathname } = url

    const tournamentMatch = pathname.match(/^\/tournament\/([^/]+)/)
    if (tournamentMatch) {
        return buildTournamentOg(url, tournamentMatch[1])
    }

    if (pathname === '/' || pathname === '') {
        return buildScheduleOg(url)
    }

    return { ...DEFAULT_OG, url: url.href }
}

// ---------------------------------------------------------------------------
// OG 태그 문자열 생성 & index.html 주입
// ---------------------------------------------------------------------------
function buildOgBlock(meta: OgMeta): string {
    return [
        '<!-- Open Graph (동적 — 봇 요청 시 미들웨어 주입) -->',
        `<meta property="og:type" content="website" />`,
        `<meta property="og:site_name" content="오뱅잇" />`,
        `<meta property="og:locale" content="ko_KR" />`,
        `<meta property="og:title" content="${esc(meta.title)}" />`,
        `<meta property="og:description" content="${esc(meta.description)}" />`,
        `<meta property="og:url" content="${esc(meta.url)}" />`,
        `<meta property="og:image" content="${esc(meta.imageUrl)}" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        `<meta property="og:image:alt" content="${esc(meta.title)}" />`,
        '',
        '<!-- Twitter Card (동적) -->',
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${esc(meta.title)}" />`,
        `<meta name="twitter:description" content="${esc(meta.description)}" />`,
        `<meta name="twitter:image" content="${esc(meta.imageUrl)}" />`,
    ].join('\n        ')
}

const OG_BLOCK_RE = /<!-- OG_META_START -->[\s\S]*?<!-- OG_META_END -->/

function injectOgMeta(html: string, meta: OgMeta): string {
    const block = `<!-- OG_META_START -->\n        ${buildOgBlock(meta)}\n        <!-- OG_META_END -->`
    return html.replace(OG_BLOCK_RE, block)
}

// ---------------------------------------------------------------------------
// Edge Middleware 진입점
// ---------------------------------------------------------------------------
export default async function middleware(
    req: Request,
): Promise<Response | undefined> {
    const ua = req.headers.get('user-agent') ?? ''

    // 봇이 아니면 정상 통과
    if (!isBot(ua)) return undefined

    const url = new URL(req.url)

    // 정적 에셋·API 라우트는 스킵 (확장자 있는 경로, /api/, /src/)
    const { pathname } = url
    const isAsset =
        /\.(?:js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot|map|json|webp|avif)$/i.test(
            pathname,
        ) ||
        pathname.startsWith('/api/') ||
        pathname.startsWith('/src/')
    if (isAsset) return undefined

    // 어드민 페이지는 noindex이므로 스킵
    if (pathname.startsWith('/admin')) return undefined

    try {
        // index.html fetch (Vercel 내부 fetch는 미들웨어 재호출 안 함)
        const indexRes = await fetch(new URL('/', url.origin).toString())
        if (!indexRes.ok) return undefined

        const html = await indexRes.text()
        const meta = await resolveOgMeta(url)
        const modified = injectOgMeta(html, meta)

        return new Response(modified, {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'no-store, no-cache',
                'X-Og-Injected': '1',
            },
        })
    } catch {
        // 예외 발생 시 정상 통과 (기존 정적 폴백 OG 사용)
        return undefined
    }
}
