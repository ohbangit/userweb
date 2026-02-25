import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import type { Broadcast, ViewMode } from '../types'
import { getDayName, getWeekNumber } from '../utils'

const SITE_URL =
    (import.meta.env.VITE_SITE_URL as string | undefined) ??
    'https://ohbang-it.kr'
const OG_IMAGE_URL =
    (import.meta.env.VITE_OG_IMAGE_URL as string | undefined) ??
    `${SITE_URL}/og-default.svg`

interface ScheduleSeoHeadProps {
    broadcasts: Broadcast[]
    currentDate: Dayjs
    viewMode: ViewMode
}

/** 뷰 모드·날짜 기반 페이지 타이틀 생성 */
function buildTitle(currentDate: Dayjs, viewMode: ViewMode): string {
    if (viewMode === 'daily') {
        const m = currentDate.month() + 1
        const d = currentDate.date()
        const day = getDayName(currentDate)
        return `오뱅잇 - ${m}월 ${d}일(${day}) 치지직 스케줄`
    }
    if (viewMode === 'weekly') {
        const m = currentDate.month() + 1
        const week = getWeekNumber(currentDate)
        return `오뱅잇 - ${m}월 ${week}주차 치지직 스케줄`
    }
    return `오뱅잇 - ${currentDate.year()}년 ${currentDate.month() + 1}월 치지직 스케줄`
}

/** 스트리머명 포함 동적 디스크립션 생성 */
function buildDescription(
    broadcasts: Broadcast[],
    currentDate: Dayjs,
    viewMode: ViewMode,
): string {
    const uniqueStreamers = [...new Set(broadcasts.map((b) => b.streamerName))]

    if (uniqueStreamers.length === 0) {
        return '치지직 스트리밍 일정을 일간, 주간, 월간으로 확인하고 방송 상세 정보를 빠르게 확인하세요.'
    }

    const period =
        viewMode === 'daily'
            ? `${currentDate.month() + 1}월 ${currentDate.date()}일`
            : viewMode === 'weekly'
              ? `${currentDate.month() + 1}월 ${getWeekNumber(currentDate)}주차`
              : `${currentDate.year()}년 ${currentDate.month() + 1}월`

    const top = uniqueStreamers.slice(0, 3)
    const rest = uniqueStreamers.length - top.length
    const names = rest > 0 ? `${top.join(', ')} 외 ${rest}명` : top.join(', ')

    return `${names}의 ${period} 치지직 방송 일정을 오뱅잇에서 확인하세요. 일간·주간·월간 스케줄과 방송 상세 정보를 한눈에 볼 수 있습니다.`
}

/** 스트리머명·카테고리 기반 키워드 생성 */
function buildKeywords(broadcasts: Broadcast[]): string {
    const streamers = [...new Set(broadcasts.map((b) => b.streamerName))].slice(
        0,
        8,
    )

    const categories = [
        ...new Set(
            broadcasts.flatMap((b) =>
                b.category?.name != null ? [b.category.name] : [],
            ),
        ),
    ].slice(0, 4)

    const base = [
        '치지직',
        '치지직 스케줄',
        '치지직 방송일정',
        '스트리밍 일정',
        '오뱅잇',
        '방송 스케줄',
    ]

    return [
        ...base,
        ...streamers.map((n) => `${n} 치지직`),
        ...categories,
    ].join(', ')
}

interface EventSchema {
    '@context': 'https://schema.org'
    '@type': 'Event'
    name: string
    startDate: string
    endDate?: string
    eventAttendanceMode: string
    eventStatus: string
    isAccessibleForFree: boolean
    location: {
        '@type': 'VirtualLocation'
        url: string
    }
    organizer: {
        '@type': 'Person'
        name: string
        url?: string
    }
    description: string
}

/** 방송 목록 → schema.org Event 배열 변환 (최대 20개) */
function buildEventSchemas(broadcasts: Broadcast[]): EventSchema[] {
    return broadcasts
        .filter((b) => Boolean(b.title) && Boolean(b.startTime))
        .slice(0, 20)
        .map((b): EventSchema => {
            const schema: EventSchema = {
                '@context': 'https://schema.org',
                '@type': 'Event',
                name: b.title,
                startDate: dayjs(b.startTime).toISOString(),
                eventAttendanceMode:
                    'https://schema.org/OnlineEventAttendanceMode',
                eventStatus: 'https://schema.org/EventScheduled',
                isAccessibleForFree: true,
                location: {
                    '@type': 'VirtualLocation',
                    url: b.streamerChannelUrl ?? SITE_URL,
                },
                organizer: {
                    '@type': 'Person',
                    name: b.streamerName,
                },
                description: b.title,
            }

            if (b.endTime) {
                schema.endDate = dayjs(b.endTime).toISOString()
            }

            if (b.streamerChannelUrl) {
                schema.organizer = {
                    ...schema.organizer,
                    url: b.streamerChannelUrl,
                }
            }

            return schema
        })
}

/**
 * 스케줄 페이지 전용 동적 SEO 헤드
 * — 현재 날짜/뷰 모드 기반 타이틀·디스크립션
 * — 로드된 방송 목록 기반 키워드·Event JSON-LD
 * — SeoHead 와 병합되며, 겹치는 항목은 이쪽이 우선
 */
export function ScheduleSeoHead({
    broadcasts,
    currentDate,
    viewMode,
}: ScheduleSeoHeadProps) {
    const title = useMemo(
        () => buildTitle(currentDate, viewMode),
        [currentDate, viewMode],
    )

    const description = useMemo(
        () => buildDescription(broadcasts, currentDate, viewMode),
        [broadcasts, currentDate, viewMode],
    )

    const keywords = useMemo(() => buildKeywords(broadcasts), [broadcasts])

    const jsonLd = useMemo(() => {
        const events = buildEventSchemas(broadcasts)
        if (events.length === 0) return null

        return JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: title,
            numberOfItems: events.length,
            itemListElement: events.map((event, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: event,
            })),
        })
    }, [broadcasts, title])

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={OG_IMAGE_URL} />

            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={OG_IMAGE_URL} />

            {jsonLd !== null && (
                <script type="application/ld+json">{jsonLd}</script>
            )}
        </Helmet>
    )
}
