/** 방송 유형별 카드 톤 (그라데이션 배경·호버 효과에 사용) */
export type CardTone = 'collab' | 'internal' | 'tournament' | 'content' | 'default'

/** 유형별 270deg 그라데이션 배경 */
export const toneBg: Record<CardTone, string> = {
    collab: 'bg-[linear-gradient(270deg,rgba(139,92,246,0.1)_0%,rgba(139,92,246,0.015)_100%)]',
    internal: 'bg-[linear-gradient(270deg,rgba(244,63,94,0.1)_0%,rgba(244,63,94,0.015)_100%)]',
    tournament: 'bg-[linear-gradient(270deg,rgba(245,158,11,0.1)_0%,rgba(245,158,11,0.015)_100%)]',
    content: 'bg-[linear-gradient(270deg,rgba(14,165,233,0.1)_0%,rgba(14,165,233,0.015)_100%)]',
    default: 'bg-[linear-gradient(270deg,rgba(148,163,184,0.07)_0%,rgba(148,163,184,0.01)_100%)]',
}
