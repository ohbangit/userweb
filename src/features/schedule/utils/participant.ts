import type { Participant } from '../types/schedule'

/**
 * 참가자 이름의 첫 글자를 추출 (아바타 폴백용)
 */
export function getInitial(name: string): string {
    return name.trim().slice(0, 1)
}

/**
 * 참가자 목록을 호스트 우선, 한국어 이름순으로 정렬
 */
export function sortParticipants(participants: Participant[]): Participant[] {
    return [...participants].sort((a, b) => {
        if (a.isHost && !b.isHost) return -1
        if (!a.isHost && b.isHost) return 1
        return a.name.localeCompare(b.name, 'ko')
    })
}

/**
 * broadcast 데이터에서 참가자 목록을 추출하고 스트리머 정보를 폴백으로 활용
 */
export function resolveParticipants(
    participants: Participant[] | undefined,
    streamerName: string,
    streamerProfileUrl?: string | null,
): Participant[] {
    if (participants && participants.length > 0) {
        return participants.map((participant) => {
            if (participant.avatarUrl) return participant
            if (participant.name === streamerName && streamerProfileUrl) {
                return { ...participant, avatarUrl: streamerProfileUrl }
            }
            return participant
        })
    }
    return [
        {
            name: streamerName,
            avatarUrl: streamerProfileUrl ?? undefined,
        },
    ]
}

/**
 * 정렬된 참가자 목록에서 대표 라벨 텍스트를 생성
 * ex) "호스트이름 외 2명" 또는 "참가자이름"
 */
export function getParticipantLabel(sortedParticipants: Participant[]): string {
    const hostParticipant = sortedParticipants.find((p) => Boolean(p.isHost))
    const representative = hostParticipant ?? sortedParticipants[0]
    if (sortedParticipants.length > 1) {
        return `${representative.name} 외 ${sortedParticipants.length - 1}명`
    }
    return representative.name
}
