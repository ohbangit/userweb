import type { PublicBanner } from '../types'

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
})

/**
 * 날짜 문자열(YYYY-MM-DD)을 Date 객체로 변환합니다.
 * @param value YYYY-MM-DD 형식 문자열
 * @returns 유효한 Date 또는 null
 */
export function parseDate(value: string): Date | null {
    const date = new Date(`${value}T00:00:00`)
    return Number.isNaN(date.getTime()) ? null : date
}

/**
 * 배너 종료 여부를 반환합니다.
 * @param banner 배너 데이터
 */
export function isBannerEnded(banner: PublicBanner): boolean {
    if (banner.endedAt === null) return false
    const endedDate = new Date(`${banner.endedAt}T23:59:59`)
    if (Number.isNaN(endedDate.getTime())) return false
    return endedDate.getTime() < Date.now()
}

/**
 * 배너 일정 텍스트를 반환합니다. (기간 | 시작일 | 종료일 | 종료됨 | 일정 미정)
 * @param banner 배너 데이터
 */
export function formatScheduleText(banner: PublicBanner): string {
    if (isBannerEnded(banner)) return '종료됨'

    if (banner.startedAt !== null && banner.endedAt !== null) {
        const startDate = parseDate(banner.startedAt)
        const endDate = parseDate(banner.endedAt)
        if (startDate !== null && endDate !== null) {
            return `${dateFormatter.format(startDate)} - ${dateFormatter.format(endDate)}`
        }
    }

    if (banner.startedAt !== null) {
        const startDate = parseDate(banner.startedAt)
        if (startDate !== null) return `${dateFormatter.format(startDate)} 시작`
    }

    if (banner.endedAt !== null) {
        const endDate = parseDate(banner.endedAt)
        if (endDate !== null) return `${dateFormatter.format(endDate)}까지`
    }

    return '일정 미정'
}
