import dayjs, { Dayjs } from 'dayjs'

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

export function getDayName(date: Dayjs): string {
    return DAY_NAMES[date.day()]
}

export function getWeekDays(date: Dayjs): Dayjs[] {
    const day = date.day()
    const monday = date.subtract((day + 6) % 7, 'day').startOf('day')

    return Array.from({ length: 7 }, (_, i) => monday.add(i, 'day'))
}

export function getMonthDays(date: Dayjs): Dayjs[] {
    const year = date.year()
    const month = date.month()

    const firstDay = dayjs().year(year).month(month).date(1).startOf('day')
    const lastDay = firstDay.endOf('month')

    const startOffset = (firstDay.day() + 6) % 7
    const startDate = firstDay.subtract(startOffset, 'day')

    const days: Dayjs[] = []
    let current = startDate

    while (days.length < 42) {
        days.push(current)
        current = current.add(1, 'day')
        if (days.length >= 35 && current.isAfter(lastDay, 'day')) break
    }

    return days
}

export function formatTime(isoString: string): string {
    return dayjs(isoString).format('HH:mm')
}

export function formatTimeRange(startTime: string, endTime?: string): string {
    const start = formatTime(startTime)
    if (!endTime) return `${start}~`
    const end = formatTime(endTime)
    return `${start}~ ${end}`
}

export function formatDate(date: Dayjs): string {
    const month = date.month() + 1
    const day = date.date()
    return `${month}월 ${day}일`
}

export function isSameDay(a: Dayjs, b: Dayjs): boolean {
    return a.isSame(b, 'day')
}

export function isToday(date: Dayjs): boolean {
    return date.isSame(dayjs(), 'day')
}

export function getWeekRange(date: Dayjs): { start: Dayjs; end: Dayjs } {
    const days = getWeekDays(date)
    return { start: days[0], end: days[6] }
}

export function getMonthRange(date: Dayjs): { start: Dayjs; end: Dayjs } {
    return {
        start: date.startOf('month').startOf('day'),
        end: date.endOf('month').startOf('day'),
    }
}

export function getWeekNumber(date: Dayjs): number {
    const firstDayOfMonth = date.startOf('month')
    const dayOfMonth = date.date()
    const firstDayWeekday = (firstDayOfMonth.day() + 6) % 7
    return Math.ceil((dayOfMonth + firstDayWeekday) / 7)
}

export function addDays(date: Dayjs, days: number): Dayjs {
    return date.add(days, 'day')
}

export function addMonths(date: Dayjs, months: number): Dayjs {
    return date.add(months, 'month')
}

export function isSameMonth(a: Dayjs, b: Dayjs): boolean {
    return a.isSame(b, 'month')
}

export function formatFullDate(date: Dayjs): string {
    const year = String(date.year()).slice(-2)
    const month = date.month() + 1
    const day = date.date()
    const dayName = getDayName(date)
    return `${year}년 ${month}월 ${day}일 (${dayName})`
}
