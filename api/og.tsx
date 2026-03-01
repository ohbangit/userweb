import { ImageResponse } from '@vercel/og'


export const config = { runtime: 'edge' }

async function loadGoogleFont(
    font: string,
    text: string,
): Promise<ArrayBuffer | undefined> {
    try {
        const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`
        const css = await (await fetch(url, { signal: AbortSignal.timeout(4000) })).text()
        const match = css.match(
            /src: url\((.+)\) format\('(opentype|truetype)'\)/,
        )
        if (match) {
            const res = await fetch(match[1], { signal: AbortSignal.timeout(4000) })
            if (res.status === 200) return res.arrayBuffer()
        }
        return undefined
    } catch {
        return undefined
    }
}

export default async function handler(req: Request) {
    const { searchParams } = new URL(req.url)
    const title = searchParams.get('title') || '치지직 스트리밍 스케줄'
    const description =
        searchParams.get('description') ||
        '일간 · 주간 · 월간 방송 일정을 한눈에'

    const fullText = `오뱅잇${title}${description}ohbang-it.kr`
    const fontData = await loadGoogleFont('Noto+Sans+KR:wght@400;700', fullText)

    const fonts: {
        name: string
        data: ArrayBuffer
        weight: 400 | 700
        style: 'normal'
    }[] = []
    if (fontData) {
        fonts.push({
            name: 'Noto Sans KR',
            data: fontData,
            weight: 700,
            style: 'normal' as const,
        })
    }

    return new ImageResponse(
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #0e0e10 0%, #1a1a23 100%)',
                padding: '80px 96px',
                justifyContent: 'space-between',
                fontFamily: fonts.length > 0 ? 'Noto Sans KR' : 'sans-serif',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* 데코레이션 서클 */}
            <div
                style={{
                    display: 'flex',
                    position: 'absolute',
                    top: '-100px',
                    right: '-80px',
                    width: '440px',
                    height: '440px',
                    borderRadius: '50%',
                    background:
                        'radial-gradient(circle, rgba(0,255,163,0.18) 0%, transparent 70%)',
                }}
            />
            <div
                style={{
                    display: 'flex',
                    position: 'absolute',
                    bottom: '-100px',
                    left: '-80px',
                    width: '440px',
                    height: '440px',
                    borderRadius: '50%',
                    background:
                        'radial-gradient(circle, rgba(0,255,163,0.12) 0%, transparent 70%)',
                }}
            />

            {/* 상단: 브랜드 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                    style={{
                        display: 'flex',
                        fontSize: '36px',
                        fontWeight: 700,
                        color: '#00ffa3',
                        letterSpacing: '-0.02em',
                    }}
                >
                    오뱅잇
                </div>
                <div
                    style={{
                        display: 'flex',
                        height: '28px',
                        width: '2px',
                        background: 'rgba(255,255,255,0.15)',
                    }}
                />
                <div
                    style={{
                        display: 'flex',
                        fontSize: '20px',
                        color: 'rgba(173,173,184,0.8)',
                    }}
                >
                    스트리밍 스케줄
                </div>
            </div>

            {/* 중앙: 타이틀 + 설명 */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        fontSize: '64px',
                        fontWeight: 700,
                        color: '#efeff1',
                        lineHeight: 1.2,
                        letterSpacing: '-0.02em',
                    }}
                >
                    {title.length > 30 ? title.slice(0, 30) + '...' : title}
                </div>
                <div
                    style={{
                        display: 'flex',
                        fontSize: '28px',
                        color: '#adadb8',
                        lineHeight: 1.4,
                    }}
                >
                    {description.length > 60
                        ? description.slice(0, 60) + '...'
                        : description}
                </div>
            </div>

            {/* 하단: URL */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        fontSize: '22px',
                        fontWeight: 400,
                        color: 'rgba(148,163,184,0.7)',
                    }}
                >
                    ohbang-it.kr
                </div>
            </div>
        </div>,
        {
            width: 1200,
            height: 630,
            fonts: fonts.length > 0 ? fonts : undefined,
        },
    )
}
