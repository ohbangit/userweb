export interface AffiliationItem {
    id: number
    name: string
    color?: string | null
}

/** 소속 태그 색상 프리셋 팔레트 */
export const AFFILIATION_COLOR_PALETTE = [
    '#7c3aed', // violet
    '#2563eb', // blue
    '#059669', // emerald
    '#d97706', // amber
    '#dc2626', // red
    '#0891b2', // cyan
    '#c026d3', // fuchsia
    '#65a30d', // lime
    '#e11d48', // rose
    '#0d9488', // teal
    '#9333ea', // purple
    '#f59e0b', // yellow
] as const

export type AffiliationColor = (typeof AFFILIATION_COLOR_PALETTE)[number]

/** color 필드가 있으면 그대로, 없으면 id 기반 팔레트 색상 반환 */
export function getAffiliationColor(item: AffiliationItem | number): string {
    if (typeof item === 'number') {
        return AFFILIATION_COLOR_PALETTE[item % AFFILIATION_COLOR_PALETTE.length]
    }
    if (item.color != null && item.color.trim().length > 0) {
        return item.color
    }
    return AFFILIATION_COLOR_PALETTE[item.id % AFFILIATION_COLOR_PALETTE.length]
}
