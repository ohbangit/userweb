/**
 * F1 레이스 Day별 결과 정적 데이터
 *
 * - 드라이버 매칭: driverId → TournamentPlayerPublic.id (number)
 * - 팀 매칭: teamIndex → TEAM_THEMES 배열 인덱스 (f1TeamDraft.ts)
 *   0: 레드불  1: 맥라렌  2: 메르세데스  3: 페라리  4: 레이싱 불스
 *   5: 알핀   6: 애스턴마틴  7: 윌리엄스  8: 자우버  9: 하스
 */

import type { F1DayResultContent } from '../types'

export const F1_DAY_RESULTS: F1DayResultContent[] = [
    // 데이터를 여기에 채워 넣어주세요.
    // 예시 구조:
    {
        label: 'Day 1',
        qualifying: [
            { driverId: 41, teamIndex: 0, position: 1, lapTime: '1:16.710' }, // 형독
            { driverId: 47, teamIndex: 4, position: 2, lapTime: '1:16.877' }, // 유영혁
            { driverId: 43, teamIndex: 2, position: 3, lapTime: '1:17.164' }, // 박인수
            { driverId: 70, teamIndex: 9, position: 4, lapTime: '1:17.234' }, // 레밀레기
            { driverId: 45, teamIndex: 1, position: 5, lapTime: '1:17.407' }, // 제황
            { driverId: 52, teamIndex: 8, position: 6, lapTime: '1:17.447' }, // 양메이
            { driverId: 67, teamIndex: 8, position: 7, lapTime: '1:17.596' }, // 남시우
            { driverId: 49, teamIndex: 3, position: 8, lapTime: '1:17.814' }, // 사모장
            { driverId: 56, teamIndex: 2, position: 9, lapTime: '1:17.950' }, // 새싹감자
            { driverId: 42, teamIndex: 7, position: 10, lapTime: '1:18.024' }, // 남궁혁
            { driverId: 44, teamIndex: 5, position: 11, lapTime: '1:18.041' }, // 요나
            { driverId: 79, teamIndex: 1, position: 12, lapTime: '1:18.049' }, // 해오니
            { driverId: 55, teamIndex: 7, position: 13, lapTime: '1:18.071' }, // 오단밍
            { driverId: 75, teamIndex: 0, position: 14, lapTime: '1:18.241' }, // 연곰
            { driverId: 46, teamIndex: 9, position: 15, lapTime: '1:18.537' }, // 강지형
            { driverId: 60, teamIndex: 3, position: 16, lapTime: '1:18.567' }, // 미치르
            { driverId: 78, teamIndex: 6, position: 17, lapTime: '1:18.827' }, // 푸후
            { driverId: 64, teamIndex: 6, position: 18, lapTime: '1:19.127' }, // 하쁘
            { driverId: 61, teamIndex: 5, position: 19, lapTime: '1:19.151' }, // 히비
            { driverId: 62, teamIndex: 4, position: 20, lapTime: '1:19.685' }, // 유리리
        ],
        race1: [
            { driverId: 41, teamIndex: 0, position: 1, grid: 1, lapTime: '27:36.010', dnf: false, fastestLap: false, points: 24 }, // 형독
            { driverId: 70, teamIndex: 9, position: 2, grid: 3, lapTime: '27:47.320', dnf: false, fastestLap: true, points: 22 }, // 레밀레기
            { driverId: 42, teamIndex: 7, position: 3, grid: 10, lapTime: '27:59.709', dnf: false, fastestLap: false, points: 20 }, // 남궁혁
            { driverId: 79, teamIndex: 1, position: 4, grid: 17, lapTime: '28:24.878', dnf: false, fastestLap: false, points: 18 }, // 해오니
            { driverId: 52, teamIndex: 8, position: 5, grid: 4, lapTime: '28:34.249', dnf: false, fastestLap: false, points: 16 }, // 양메이
            { driverId: 61, teamIndex: 5, position: 6, grid: 19, lapTime: '28:35.348', dnf: false, fastestLap: false, points: 15 }, // 이치카 히비
            { driverId: 47, teamIndex: 4, position: 7, grid: 2, lapTime: '28:40.380', dnf: false, fastestLap: false, points: 14 }, // 유영혁
            { driverId: 43, teamIndex: 2, position: 8, grid: 8, lapTime: '28:46.666', dnf: false, fastestLap: false, points: 13 }, // 박인수
            { driverId: 64, teamIndex: 6, position: 9, grid: 18, lapTime: '28:48.904', dnf: false, fastestLap: false, points: 12 }, // 하쁘
            { driverId: 44, teamIndex: 5, position: 10, grid: 11, lapTime: '28:49.502', dnf: false, fastestLap: false, points: 11 }, // 요나
            { driverId: 62, teamIndex: 4, position: 11, grid: 20, lapTime: '28:50.370', dnf: false, fastestLap: false, points: 10 }, // 유리리
            { driverId: 56, teamIndex: 2, position: 12, grid: 9, lapTime: '28:52.289', dnf: false, fastestLap: false, points: 9 }, // 새싹감자
            { driverId: 55, teamIndex: 7, position: 13, grid: 12, lapTime: '28:54.717', dnf: false, fastestLap: false, points: 8 }, // 오단밍
            { driverId: 67, teamIndex: 8, position: 14, grid: 6, lapTime: '28:57.018', dnf: false, fastestLap: false, points: 7 }, // 남시우
            { driverId: 45, teamIndex: 1, position: 15, grid: 4, lapTime: '28:58.038', dnf: false, fastestLap: false, points: 6 }, // 제황
            { driverId: 75, teamIndex: 0, position: 16, grid: 13, lapTime: '29:00.567', dnf: false, fastestLap: false, points: 5 }, // 연곰
            { driverId: 78, teamIndex: 6, position: 17, grid: 16, lapTime: '+1 Lap', dnf: false, fastestLap: false, points: 4 }, // 푸후
            { driverId: 46, teamIndex: 9, position: 18, grid: 14, lapTime: '+1 Lap', dnf: false, fastestLap: false, points: 3 }, // 강지형
            { driverId: 60, teamIndex: 3, position: null, grid: 15, lapTime: 'DNF', dnf: true, fastestLap: false, points: 0 }, // 미치르
            { driverId: 49, teamIndex: 3, position: null, grid: 7, lapTime: 'DNF', dnf: true, fastestLap: false, points: 0 }, // 사모장
        ],
        race2: [
            { driverId: 70, teamIndex: 9, position: 1, grid: 19, lapTime: '29:49.673', dnf: false, fastestLap: true, points: 24 }, // 레밀레기
            { driverId: 41, teamIndex: 0, position: 2, grid: 20, lapTime: '29:53.013', dnf: false, fastestLap: false, points: 22 }, // 형독
            { driverId: 47, teamIndex: 4, position: 3, grid: 14, lapTime: '29:54.880', dnf: false, fastestLap: false, points: 20 }, // 유영혁
            { driverId: 46, teamIndex: 9, position: 4, grid: 3, lapTime: '29:59.039', dnf: false, fastestLap: false, points: 18 }, // 강지형
            { driverId: 42, teamIndex: 7, position: 5, grid: 18, lapTime: '30:04.453', dnf: false, fastestLap: false, points: 16 }, // 남궁혁
            { driverId: 55, teamIndex: 7, position: 6, grid: 8, lapTime: '30:05.916', dnf: false, fastestLap: false, points: 15 }, // 오단밍
            { driverId: 49, teamIndex: 3, position: 7, grid: 1, lapTime: '30:08.484', dnf: false, fastestLap: false, points: 14 }, // 사모장
            { driverId: 75, teamIndex: 0, position: 8, grid: 5, lapTime: '30:09.233', dnf: false, fastestLap: false, points: 13 }, // 연곰
            { driverId: 45, teamIndex: 1, position: 9, grid: 6, lapTime: '30:11.443', dnf: false, fastestLap: false, points: 12 }, // 제황
            { driverId: 44, teamIndex: 5, position: 10, grid: 11, lapTime: '30:11.675', dnf: false, fastestLap: false, points: 11 }, // 요나
            { driverId: 52, teamIndex: 8, position: 11, grid: 16, lapTime: '30:11.955', dnf: false, fastestLap: false, points: 10 }, // 양메이
            { driverId: 43, teamIndex: 2, position: 12, grid: 13, lapTime: '30:13.037', dnf: false, fastestLap: false, points: 9 }, // 박인수
            { driverId: 56, teamIndex: 2, position: 13, grid: 9, lapTime: '30:16.036', dnf: false, fastestLap: false, points: 8 }, // 새싹감자
            { driverId: 79, teamIndex: 1, position: 14, grid: 17, lapTime: '30:16.354', dnf: false, fastestLap: false, points: 7 }, // 해오니
            { driverId: 64, teamIndex: 6, position: 15, grid: 12, lapTime: '30:18.913', dnf: false, fastestLap: false, points: 6 }, // 하쁘
            { driverId: 78, teamIndex: 6, position: 16, grid: 4, lapTime: '30:19.533', dnf: false, fastestLap: false, points: 5 }, // 푸후
            { driverId: 61, teamIndex: 5, position: 17, grid: 15, lapTime: '30:20.575', dnf: false, fastestLap: false, points: 4 }, // 히비
            { driverId: 60, teamIndex: 3, position: 18, grid: 2, lapTime: '30:25.379', dnf: false, fastestLap: false, points: 3 }, // 미치르
            { driverId: 67, teamIndex: 8, position: 19, grid: 7, lapTime: '30:46.095', dnf: false, fastestLap: false, points: 2 }, // 남시우
            { driverId: 62, teamIndex: 4, position: null, grid: 10, lapTime: 'DNF', dnf: true, fastestLap: false, points: 0 }, // 유리리
        ],
        teamStandings: [
            { teamIndex: 9, rank: 1, totalPoints: 71, r1Points: 26, r2Points: 45 }, // 하스
            { teamIndex: 0, rank: 2, totalPoints: 64, r1Points: 29, r2Points: 35 }, // 레드불
            { teamIndex: 7, rank: 3, totalPoints: 59, r1Points: 28, r2Points: 31 }, // 윌리엄스
            { teamIndex: 1, rank: 4, totalPoints: 45, r1Points: 26, r2Points: 19 }, // 맥라렌
            { teamIndex: 4, rank: 5, totalPoints: 44, r1Points: 24, r2Points: 20 }, // RB
            { teamIndex: 5, rank: 6, totalPoints: 41, r1Points: 26, r2Points: 15 }, // 알핀
            { teamIndex: 2, rank: 7, totalPoints: 39, r1Points: 22, r2Points: 17 }, // 메르세데스
            { teamIndex: 8, rank: 8, totalPoints: 35, r1Points: 23, r2Points: 12 }, // 자우버
            { teamIndex: 6, rank: 9, totalPoints: 27, r1Points: 16, r2Points: 11 }, // 애스턴마틴
            { teamIndex: 3, rank: 10, totalPoints: 17, r1Points: 0, r2Points: 17 }, // 페라리
        ],
        driverStandings: [
            { driverId: 70, teamIndex: 9, points: 50 }, // 레밀리아(추측: 레밀레기)
            { driverId: 41, teamIndex: 0, points: 46 }, // 형독
            { driverId: 42, teamIndex: 7, points: 36 }, // 남궁혁
            { driverId: 47, teamIndex: 4, points: 34 }, // 유영혁
            { driverId: 79, teamIndex: 1, points: 27 }, // 해오니
            { driverId: 52, teamIndex: 8, points: 26 }, // 양메이
            { driverId: 55, teamIndex: 7, points: 23 }, // 오단밍
            { driverId: 43, teamIndex: 2, points: 22 }, // 박인수
            { driverId: 44, teamIndex: 5, points: 22 }, // 요나
            { driverId: 46, teamIndex: 9, points: 21 }, // 강지형
            { driverId: 61, teamIndex: 5, points: 20 }, // 히비
            { driverId: 64, teamIndex: 6, points: 18 }, // 하쁘
            { driverId: 45, teamIndex: 1, points: 18 }, // 제황
            { driverId: 75, teamIndex: 0, points: 18 }, // 연곰
            { driverId: 56, teamIndex: 2, points: 17 }, // 새싹감자
            { driverId: 49, teamIndex: 3, points: 14 }, // 사모장
            { driverId: 62, teamIndex: 4, points: 10 }, // 유리리
            { driverId: 67, teamIndex: 8, points: 9 }, // 남시우
            { driverId: 78, teamIndex: 6, points: 5 }, // 푸후
            { driverId: 60, teamIndex: 3, points: 3 }, // 미치르
        ],
    },
]

export const F1_FINAL_RESULT: F1DayResultContent = {
    label: 'Final',
    qualifying: [
        { driverId: 47, teamIndex: 4, position: 1, lapTime: '1:23.854' }, // 유영혁
        { driverId: 41, teamIndex: 0, position: 2, lapTime: '1:24.088' }, // 형독
        { driverId: 70, teamIndex: 9, position: 3, lapTime: '1:24.515' }, // 레밀레기
        { driverId: 55, teamIndex: 7, position: 4, lapTime: '1:24.540' }, // 오단밍
        { driverId: 43, teamIndex: 2, position: 5, lapTime: '1:24.550' }, // 박인수
        { driverId: 45, teamIndex: 1, position: 6, lapTime: '1:24.700' }, // 제황
        { driverId: 49, teamIndex: 3, position: 7, lapTime: '1:24.766' }, // 사모장
        { driverId: 42, teamIndex: 7, position: 8, lapTime: '1:24.852' }, // 남궁혁
        { driverId: 56, teamIndex: 2, position: 9, lapTime: '1:25.034' }, // 새싹감자
        { driverId: 62, teamIndex: 4, position: 10, lapTime: '1:25.294' }, // 유리리
        { driverId: 52, teamIndex: 8, position: 11, lapTime: '1:25.299' }, // 양메이
        { driverId: 79, teamIndex: 1, position: 12, lapTime: '1:25.367' }, // 해오니
        { driverId: 44, teamIndex: 5, position: 13, lapTime: '1:25.418' }, // 요나
        { driverId: 60, teamIndex: 3, position: 14, lapTime: '1:25.876' }, // 미치르
        { driverId: 46, teamIndex: 9, position: 15, lapTime: '1:25.895' }, // 강지형
        { driverId: 78, teamIndex: 6, position: 16, lapTime: '1:26.005' }, // 푸후
        { driverId: 67, teamIndex: 8, position: 17, lapTime: '1:26.171' }, // 남시우
        { driverId: 61, teamIndex: 5, position: 18, lapTime: '1:26.186' }, // 히비
        { driverId: 75, teamIndex: 0, position: 19, lapTime: '1:26.587' }, // 연곰
        { driverId: 64, teamIndex: 6, position: 20, lapTime: '1:26.642' }, // 하쁘
    ],
    race1: [
        // 파이널 Race 1 결과를 여기에 채워 넣어주세요.
        // { driverId: 41, teamIndex: 0, position: 1, grid: 1, lapTime: 'xx:xx.xxx', dnf: false, fastestLap: false, points: 24 },
    ],
    race2: [
        // 파이널 Race 2 결과를 여기에 채워 넣어주세요. (없으면 비워두세요)
    ],
    teamStandings: [
        // 파이널 팀 성적을 여기에 채워 넣어주세요.
        // { teamIndex: 0, rank: 1, totalPoints: 0, r1Points: 0, r2Points: 0 },
    ],
    driverStandings: [
        // 파이널 드라이버 성적을 여기에 채워 넣어주세요.
        // { driverId: 41, teamIndex: 0, points: 0 },
    ],
}
