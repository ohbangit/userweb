import dayjs from 'dayjs'
import { Broadcast } from '../types/schedule'

function getThisWeekDate(dayOffset: number, hour: number): string {
    const now = dayjs()
    const day = now.day()
    const monday = now
        .subtract((day + 6) % 7, 'day')
        .hour(hour)
        .minute(0)
        .second(0)
        .millisecond(0)

    const target = monday.add(dayOffset, 'day')
    return target.toISOString()
}

function getThisMonthDate(day: number, hour: number, minute = 0): string {
    const date = dayjs()
        .date(day)
        .hour(hour)
        .minute(minute)
        .second(0)
        .millisecond(0)
    return date.toISOString()
}

const todayDayOffset = (() => {
    const day = dayjs().day()
    return (day + 6) % 7
})()

type MockCategory = '게임' | '토크' | '먹방' | '음악' | '예술' | '프로그래밍'

const CATEGORY_GAME_MAP: Record<MockCategory, string> = {
    게임: '배틀그라운드',
    토크: 'Just Chatting',
    먹방: '먹방',
    음악: '라이브 세션',
    예술: '드로잉',
    프로그래밍: '라이브 코딩',
}

const CATEGORY_TAGS_MAP: Record<MockCategory, string[]> = {
    게임: ['게임', '랭크', '합방', '스쿼드'],
    토크: ['토크', '수다', '라디오', '심야'],
    먹방: ['먹방', '메뉴추천', '리뷰'],
    음악: ['음악', '라이브', '커버'],
    예술: ['예술', '힐링', '작업'],
    프로그래밍: ['프로그래밍', '코딩', '질문답변'],
}

type MockSeed = {
    id: string
    title: string
    streamerName: string
    mockCategory: MockCategory
    startTime: string
    endTime?: string
    isLive: boolean
    isCollab: boolean
    collabPartners?: string[]
}

const buildParticipants = (names: string[]) =>
    Array.from(new Set(names)).map((name) => ({ name }))

function toBroadcast(seed: MockSeed): Broadcast {
    return {
        id: seed.id,
        title: seed.title,
        streamerName: seed.streamerName,
        gameTitle: CATEGORY_GAME_MAP[seed.mockCategory],
        tags: CATEGORY_TAGS_MAP[seed.mockCategory],
        participants: buildParticipants([
            seed.streamerName,
            ...(seed.collabPartners ?? []),
        ]),
        startTime: seed.startTime,
        endTime: seed.endTime,
        isLive: seed.isLive,
        isCollab: seed.isCollab,
        collabPartners: seed.collabPartners,
    }
}

const seeds: MockSeed[] = [
    {
        id: '1',
        title: '오늘도 달려봅시다! 랭크 도전기',
        streamerName: '김뱅온',
        mockCategory: '게임',
        startTime: getThisWeekDate(0, 19),
        endTime: getThisWeekDate(0, 22),
        isLive: false,
        isCollab: false,
    },
    {
        id: '2',
        title: '심야 토크 라이브 🌙',
        streamerName: '박수다',
        mockCategory: '토크',
        startTime: getThisWeekDate(0, 23),
        isLive: false,
        isCollab: false,
    },
    {
        id: '3',
        title: '먹방 & 수다 타임',
        streamerName: '이먹방',
        mockCategory: '먹방',
        startTime: getThisWeekDate(1, 12),
        endTime: getThisWeekDate(1, 14),
        isLive: false,
        isCollab: false,
    },
    {
        id: '4',
        title: '합방! 배그 스쿼드 🔥',
        streamerName: '김뱅온',
        mockCategory: '게임',
        startTime: getThisWeekDate(1, 20),
        endTime: getThisWeekDate(1, 23),
        isLive: false,
        isCollab: true,
        collabPartners: ['박수다', '최겜장'],
    },
    {
        id: '5',
        title: '기타 연주 라이브 🎸',
        streamerName: '정음악',
        mockCategory: '음악',
        startTime: getThisWeekDate(2, 18),
        endTime: getThisWeekDate(2, 20),
        isLive: false,
        isCollab: false,
    },
    {
        id: '6',
        title: '그림 그리기 힐링 방송',
        streamerName: '한그림',
        mockCategory: '예술',
        startTime: getThisWeekDate(2, 21),
        endTime: getThisWeekDate(2, 23),
        isLive: false,
        isCollab: false,
    },
    {
        id: '7',
        title: '시청자와 같이 노래방!',
        streamerName: '정음악',
        mockCategory: '음악',
        startTime: getThisWeekDate(3, 19),
        endTime: getThisWeekDate(3, 22),
        isLive: false,
        isCollab: true,
        collabPartners: ['한그림'],
    },
    {
        id: '8',
        title: '새벽 감성 토크',
        streamerName: '박수다',
        mockCategory: '토크',
        startTime: getThisWeekDate(3, 0),
        endTime: getThisWeekDate(3, 3),
        isLive: false,
        isCollab: false,
    },
    {
        id: '9',
        title: '금요일 스페셜! 공포게임',
        streamerName: '최겜장',
        mockCategory: '게임',
        startTime: getThisWeekDate(4, 20),
        endTime: getThisWeekDate(4, 24),
        isLive: false,
        isCollab: false,
    },
    {
        id: '10',
        title: '요리 도전기 🍳',
        streamerName: '이먹방',
        mockCategory: '먹방',
        startTime: getThisWeekDate(4, 15),
        endTime: getThisWeekDate(4, 17),
        isLive: false,
        isCollab: false,
    },
    {
        id: '11',
        title: '주말 마라톤 방송 📺',
        streamerName: '김뱅온',
        mockCategory: '게임',
        startTime: getThisWeekDate(5, 14),
        endTime: getThisWeekDate(5, 22),
        isLive: false,
        isCollab: false,
    },
    {
        id: '12',
        title: '6인 합방 대난투!',
        streamerName: '최겜장',
        mockCategory: '게임',
        startTime: getThisWeekDate(5, 20),
        endTime: getThisWeekDate(5, 23),
        isLive: false,
        isCollab: true,
        collabPartners: ['김뱅온', '박수다', '이먹방', '정음악', '한그림'],
    },
    {
        id: '13',
        title: '일요일 힐링 음악 방송',
        streamerName: '정음악',
        mockCategory: '음악',
        startTime: getThisWeekDate(6, 15),
        endTime: getThisWeekDate(6, 18),
        isLive: false,
        isCollab: false,
    },
    {
        id: '14',
        title: '주간 하이라이트 리뷰',
        streamerName: '박수다',
        mockCategory: '토크',
        startTime: getThisWeekDate(6, 20),
        endTime: getThisWeekDate(6, 22),
        isLive: false,
        isCollab: false,
    },
    {
        id: '15',
        title: '라이브 코딩 세션 💻',
        streamerName: '오개발',
        mockCategory: '프로그래밍',
        startTime: getThisWeekDate(todayDayOffset, 10),
        endTime: getThisWeekDate(todayDayOffset, 13),
        isLive: true,
        isCollab: false,
    },
    {
        id: '16',
        title: '점심시간 잡담',
        streamerName: '이먹방',
        mockCategory: '토크',
        startTime: getThisMonthDate(5, 12),
        endTime: getThisMonthDate(5, 14),
        isLive: false,
        isCollab: false,
    },
    {
        id: '17',
        title: '신작 게임 리뷰',
        streamerName: '최겜장',
        mockCategory: '게임',
        startTime: getThisMonthDate(12, 19),
        endTime: getThisMonthDate(12, 22),
        isLive: false,
        isCollab: false,
    },
    {
        id: '18',
        title: '합방 노래 배틀 🎤',
        streamerName: '정음악',
        mockCategory: '음악',
        startTime: getThisMonthDate(20, 20),
        endTime: getThisMonthDate(20, 23),
        isLive: false,
        isCollab: true,
        collabPartners: ['박수다'],
    },
    {
        id: '19',
        title: '새벽 감성 드로잉',
        streamerName: '한그림',
        mockCategory: '예술',
        startTime: getThisMonthDate(25, 0),
        isLive: false,
        isCollab: false,
    },
    {
        id: '20',
        title: '오전 요가 & 토크',
        streamerName: '박수다',
        mockCategory: '토크',
        startTime: getThisWeekDate(2, 9),
        endTime: getThisWeekDate(2, 11),
        isLive: false,
        isCollab: false,
    },
    {
        id: '21',
        title: '점심 먹방 라이브 🍜',
        streamerName: '이먹방',
        mockCategory: '먹방',
        startTime: getThisWeekDate(2, 12),
        endTime: getThisWeekDate(2, 14),
        isLive: false,
        isCollab: false,
    },
    {
        id: '22',
        title: '오후 코딩 챌린지',
        streamerName: '오개발',
        mockCategory: '프로그래밍',
        startTime: getThisWeekDate(2, 15),
        endTime: getThisWeekDate(2, 17),
        isLive: false,
        isCollab: false,
    },
    {
        id: '23',
        title: '합방 게임 토너먼트 🏆',
        streamerName: '최겜장',
        mockCategory: '게임',
        startTime: getThisWeekDate(2, 22),
        endTime: getThisWeekDate(2, 24),
        isLive: false,
        isCollab: true,
        collabPartners: ['김뱅온', '이먹방'],
    },
    {
        id: '24',
        title: '아침 러닝 브이로그',
        streamerName: '박수다',
        mockCategory: '토크',
        startTime: getThisWeekDate(5, 8),
        endTime: getThisWeekDate(5, 10),
        isLive: false,
        isCollab: false,
    },
    {
        id: '25',
        title: '주말 쿠킹 클래스 🧑‍🍳',
        streamerName: '이먹방',
        mockCategory: '먹방',
        startTime: getThisWeekDate(5, 11),
        endTime: getThisWeekDate(5, 13),
        isLive: false,
        isCollab: false,
    },
    {
        id: '26',
        title: '저녁 노래방 합방 🎵',
        streamerName: '정음악',
        mockCategory: '음악',
        startTime: getThisWeekDate(5, 18),
        endTime: getThisWeekDate(5, 20),
        isLive: false,
        isCollab: true,
        collabPartners: ['한그림', '박수다'],
    },
]

export const mockBroadcasts: Broadcast[] = seeds.map((seed) => {
    const broadcast = toBroadcast(seed)
    if (seed.id === '15' && broadcast.endTime) {
        const now = dayjs()
        const start = dayjs(broadcast.startTime)
        const end = dayjs(broadcast.endTime)
        broadcast.isLive =
            (now.isAfter(start) || now.isSame(start)) &&
            (now.isBefore(end) || now.isSame(end))
    }
    return broadcast
})
