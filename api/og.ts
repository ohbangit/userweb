import { ImageResponse } from '@vercel/og'
import { createElement } from 'react'

export const config = { runtime: 'edge' }

function trimText(value: string, max: number): string {
    return value.length > max ? `${value.slice(0, max)}...` : value
}

export default function handler(req: Request): Response {
    const { searchParams } = new URL(req.url)
    const title = trimText(searchParams.get('title') ?? '오뱅잇 - 치지직 스트리밍 스케줄', 40)
    const description = trimText(searchParams.get('description') ?? '일간 · 주간 · 월간 방송 일정을 한눈에', 80)

    const e = createElement
    const imageTree = e(
        'div',
        {
            style: {
                display: 'flex',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #0e0e10 0%, #1a1a23 100%)',
                color: '#efeff1',
                padding: '72px 88px',
                flexDirection: 'column',
                justifyContent: 'space-between',
            },
        },
        e(
            'div',
            {
                style: {
                    display: 'flex',
                    fontSize: '34px',
                    fontWeight: 700,
                    color: '#00ffa3',
                },
            },
            '오뱅잇',
        ),
        e(
            'div',
            {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px',
                },
            },
            e(
                'div',
                {
                    style: {
                        display: 'flex',
                        fontSize: '62px',
                        fontWeight: 700,
                        lineHeight: 1.2,
                    },
                },
                title,
            ),
            e(
                'div',
                {
                    style: {
                        display: 'flex',
                        fontSize: '28px',
                        color: '#adadb8',
                        lineHeight: 1.35,
                    },
                },
                description,
            ),
        ),
        e(
            'div',
            {
                style: {
                    display: 'flex',
                    justifyContent: 'flex-end',
                    fontSize: '22px',
                    color: 'rgba(148,163,184,0.8)',
                },
            },
            'ohbang-it.kr',
        ),
    )

    return new ImageResponse(imageTree, {
        width: 1200,
        height: 630,
    })
}
