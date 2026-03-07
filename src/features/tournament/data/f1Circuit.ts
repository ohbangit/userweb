/**
 * F1 서킷 고정 데이터 (게임 상수)
 *
 * - 서버/어드민 불필요. 코드로만 관리.
 * - layoutImageUrl: 서킷 레이아웃 이미지 URL (없으면 null)
 */

import type { F1CircuitContent } from '../types'

export const F1_CIRCUIT_DATA: F1CircuitContent = {
    circuits: [
        {
            id: 'b4f6f476-1366-4040-bfac-6a5cd58d9039',
            circuitName: '엘버트 파크 서킷',
            country: '호주',
            layoutImageUrl:
                'https://i.namu.wiki/i/NkJY3DKO1VXClRDQXHeCcNf4By5NPitmSwLN5S7xcdEnvOtF17Ig7MvcyhhFBt_4rn0X6mgI6w55Cdp4_lrvvg.webp',
            length: '5.278km',
            corners: 14,
            lapRecord: '1:19.813',
            order: 0,
        },
        {
            id: '8491ba6c-31fa-4e68-9049-e127e8697b9f',
            circuitName: '실버스톤 서킷',
            country: '영국',
            layoutImageUrl:
                'https://i.namu.wiki/i/4rYrdqpLhoJXgh6c0dfSdtI7HB4tVSMzWZ90IHL8CvkoX-PyBx81X7jBGn5fxZtGD4wBLluHL2XFLUyHvIN4sggzF0A_7efO9VyMRMbdvJTd6Rz6YZnGYIWmxHhgFUCRNgyHuACCU4iFpb3sh2M0hQ.webp',
            length: '5.891km',
            corners: 18,
            lapRecord: '1:27.097',
            order: 1,
        },
        {
            id: 'c5fa7de2-1c6a-4013-bb12-a91f13ba156c',
            circuitName: '야스 마리나 서킷',
            country: '아부다비',
            layoutImageUrl:
                'https://i.namu.wiki/i/SHbPRMGvC5vxbGS7KTsBQjyrg2qu0b0-SfXwgV3HYHrarf76v5GwdwXTOiYqxJubw1EZGZK7L1ogrQ_2NwR0623T73wrqhf6FEo4NBd-GcWiWkD8xoDfkil-afk_DCvJ4FmgZTSuJTWoSlh54yGPoA.webp',
            length: '5.281km',
            corners: 16,
            lapRecord: '1:25.637',
            order: 2,
        },
    ],
}
