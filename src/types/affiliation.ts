export interface AffiliationItem {
    id: number
    name: string
}

/** 소속 ID를 기반으로 태그 색상을 결정하는 팔레트 */
const AFFILIATION_COLOR_PALETTE = [
    '#7c3aed', // violet
    '#2563eb', // blue
    '#059669', // emerald
    '#d97706', // amber
    '#dc2626', // red
    '#0891b2', // cyan
    '#c026d3', // fuchsia
    '#65a30d', // lime
] as const

/** 소속 ID에서 일관된 태그 색상을 반환한다 */
export function getAffiliationColor(id: number): string {
    return AFFILIATION_COLOR_PALETTE[id % AFFILIATION_COLOR_PALETTE.length]
}
