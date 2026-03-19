import type { OWPublicResponse, OWPlayersResponse, OWTeamsResponse, OWBracketResponse } from '../types/owTournament'

export const OW_STATIC_META: OWPublicResponse = {
    "slug": "overwatch-vs-talon",
    "title": "RIVAL CLASH: 오버워치 vs 탈론",
    "bannerUrl": null,
    "startDate": "2026-03-08",
    "endDate": "2026-03-13",
    "description": "총 상금 10000만원!!!!\n\n더블 엘리미네이션 토너먼트 (* 두번 지면 탈락!)",
    "tags": [
        "인챈트",
        "블리자드"
    ],
    "links": [
        {
            "url": "https://cafe.naver.com/korunner/24128?tc=shared_link",
            "label": "카페공지",
            "type": null
        },
        {
            "url": "https://news.blizzard.com/ko-kr/article/24261472/s-vs-rival-clash",
            "label": "블리자드",
            "type": null
        },
        {
            "url": "https://namu.wiki/w/%EB%9F%AC%EB%84%88's%20%EC%98%A4%EB%B2%84%EC%9B%8C%EC%B9%98%20vs%20%ED%83%88%EB%A1%A0%20-%20RIVAL%20CLASH",
            "label": "나무위키",
            "type": null
        }
    ],
    "isChzzkSupport": true,
    "hosts": [
        {
            "streamerId": 229,
            "name": "러너",
            "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNTExMTdfMjgx/MDAxNzYzMzU5MDM3NjU2.cuwYMM9e7pl6SgUQFI2gLNq6EGOmdpvm2GEqbspz0ukg.CklyBuTcCaQd_zxfAORr2N3B9RCYz2tXhFapbTqhJIIg.PNG/image.png",
            "channelId": "19e3b97ca1bca954d1ac84cf6862e0dc",
            "isPartner": true
        }
    ],
    "broadcasters": [
        {
            "streamerId": 283,
            "name": "ENCHANT",
            "avatarUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMTVfMjYy/MDAxNzAyNjIwMzQ5NjE1.tVl6ew-9iBd3Z3fEG8iRmzCFbUpf3qKj_o1BSXWB73og.kqiVM7bjKl40zr9m52PqMdO6cZB6mIXYA7PRIM388mcg.JPEG/Symbol.jpg",
            "channelId": "22bd842599735ae19e454983280f611e",
            "isPartner": true
        }
    ],
    "commentators": [
        {
            "streamerId": 229,
            "name": "러너",
            "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNTExMTdfMjgx/MDAxNzYzMzU5MDM3NjU2.cuwYMM9e7pl6SgUQFI2gLNq6EGOmdpvm2GEqbspz0ukg.CklyBuTcCaQd_zxfAORr2N3B9RCYz2tXhFapbTqhJIIg.PNG/image.png",
            "channelId": "19e3b97ca1bca954d1ac84cf6862e0dc",
            "isPartner": true
        },
        {
            "streamerId": 251,
            "name": "문창식",
            "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNDExMDFfMTMy/MDAxNzMwNDM5MDE0NjEz.rGj8GMOjsmLSxyvqGSbIx9Q-vY127kOPXS1-06zsVN4g.dqfO54QskhLfEzKDSMp7LwvAxNn8vznvm4rMxliLI8wg.JPEG/NNG-17304390141735789229437060428523.jpg",
            "channelId": "872fdddbfde55c30248c3d381a949568",
            "isPartner": false
        },
        {
            "streamerId": 76,
            "name": "용봉탕",
            "avatarUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMjFfMTA5/MDAxNzAzMTQ0MzYzNzEw.Qdk0maCc-2zN838HEHZEi7pSNndbL36eV_ySq3IyYA4g.hIkj8rt_ylqW3k0cr0tV1OD6t8qfmhs1Enrxr9hPV4gg.PNG/1234.png",
            "channelId": "5735174155c67f9f3ebf250cf88f33ee",
            "isPartner": false
        }
    ],
    "panels": [
        {
            "id": 3,
            "type": "PLAYER_LIST",
            "orderIndex": 1,
            "titleOverride": null
        },
        {
            "id": 2,
            "type": "DRAFT",
            "orderIndex": 2,
            "titleOverride": null
        },
        {
            "id": 1,
            "type": "TEAMS",
            "orderIndex": 3,
            "titleOverride": null
        },
        {
            "id": 4,
            "type": "SCHEDULE",
            "orderIndex": 4,
            "titleOverride": null
        },
        {
            "id": 5,
            "type": "FINAL_RESULT",
            "orderIndex": 5,
            "titleOverride": null
        }
    ]
}

export const OW_STATIC_PLAYERS: OWPlayersResponse = {
    "players": [
        {
            "streamerId": 75,
            "name": "양아지",
            "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNTA0MDJfMTQg/MDAxNzQzNTIwNTc0OTA0.lL8e5sGkq1Xr4QjOXEADTw7GNwETN_Qrpv8yf3Ct9mkg.nfR2X3wib3P6ekWFGEas3iHvdwG0trX0Ax5dwypLaN4g.PNG/2_%286%29.png",
            "channelId": "3e825479d71ead63b76de0d6f6b5dc83",
            "isPartner": true,
            "position": "SPT",
            "isCaptain": false,
            "draftPick": 15,
            "draftPassed": true
        },
        {
            "streamerId": 27,
            "name": "둥그레",
            "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNTAxMThfMTc3/MDAxNzM3MjAwNDEwNDEz.3HR0Dgho-J8f52wL76yNcAdxK23Fpn0sgn0PrliTEA4g.5lGwprVCWWgRugT5FFARxJkScJ374zwoBh0wVx73OKEg.PNG/178E770E-723D-42F1-AFF5-0F225ABF0B2A-1737200410.png",
            "channelId": "1b0561f3051c10a24b9d8ec9a6cb3374",
            "isPartner": true,
            "position": "SPT",
            "isCaptain": false,
            "draftPick": 7,
            "draftPassed": false
        },
        {
            "streamerId": 192,
            "name": "삐부",
            "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNDA5MjFfOTgg/MDAxNzI2OTA3NTEwMzAx.alpzjL6SITSDFXzy4wceQvnQYzbIrZwRQYl4w2HUnpUg.mJoZNEWZzpqIEiCSvI3JR49-KAG3eIM7VjfIqlwI30og.PNG/f01144d33e6e7278-1.png",
            "channelId": "5f44570b82fb82d4814ef9502cf6401a",
            "isPartner": true,
            "position": "SPT",
            "isCaptain": false,
            "draftPick": 2,
            "draftPassed": false
        },
        {
            "streamerId": 10,
            "name": "아야츠노 유니",
            "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNTAzMzFfMjQw/MDAxNzQzNDMwNTM4OTg4.Bam6imHvAZLBWT0GHFprz94iS5CaGFmVI9RoXktnY-4g.AkwRyhY_RhSGzEiBXTvs4pEyo7KxI4GmUd151O8cVcYg.PNG/%EC%9C%A0%EB%8B%883.png",
            "channelId": "45e71a76e949e16a34764deb962f9d9f",
            "isPartner": true,
            "position": "SPT",
            "isCaptain": false,
            "draftPick": 1,
            "draftPassed": false
        },
        {
            "streamerId": 59,
            "name": "서넹",
            "avatarUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMTlfMTMz/MDAxNzAyOTU5OTUzNzAx.EgFT_odne3NeV7MAcP6vvOUptwlPNut0YCvhRQijBckg.9q7feFbKNIrN3MkQyBYnIvQwgJUuZoyA8lbpPi3yiy8g.JPEG/unnamed.jpg",
            "channelId": "5777797bab18388e7044ed7bac3c56c8",
            "isPartner": true,
            "position": "SPT",
            "isCaptain": false,
            "draftPick": 4,
            "draftPassed": false
        },
        {
            "streamerId": 43,
            "name": "푸린",
            "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNjAyMDlfMjQw/MDAxNzcwNjI4MzcyNTg0.SQw3dnvofX4DlxLYk0Ick0c3EapsF6iaja5gj_wnn8Ug.MENvgDIlqSmA25gFtzkmsc-VqPmatNnTXlpYcO3Dem8g.PNG/image.png",
            "channelId": "75bd327f6ba6f57106c79fe3f2c3d19f",
            "isPartner": true,
            "position": "SPT",
            "isCaptain": false,
            "draftPick": 16,
            "draftPassed": true
        },
        {
            "streamerId": 125,
            "name": "임나은",
            "avatarUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMjFfMjE4/MDAxNzAzMTQwNTQ4NDEz.l-4zi6piSfpGzSTZNq_V7192BUVrOpkHUZsqIDW8lLgg.cqAuLaz96FEuvBTNQF3NovipkisvMs2As5G5MxjaZTcg.PNG/1%EC%9E%84%EB%82%98%EC%9D%80-2.png",
            "channelId": "0de024a1ca4a64f1a23a95ff9eeee5a5",
            "isPartner": true,
            "position": "SPT",
            "isCaptain": false,
            "draftPick": 14,
            "draftPassed": true
        },
        {
            "streamerId": 61,
            "name": "엘리",
            "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNTEwMTJfMjQg/MDAxNzYwMjU5MzQwODQw.72r-pbnXpBvoFivvGK9dKk9CAO8aJN5UV6wXejRiiPwg.Oo7lN5-LX4Dd9tETgUqx5UGoHXNKZ55O5Xy6MnaX7-kg.PNG/image.png",
            "channelId": "475313e6c26639d5763628313b4c130e",
            "isPartner": true,
            "position": "SPT",
            "isCaptain": false,
            "draftPick": 12,
            "draftPassed": false
        },
        {
            "streamerId": 22,
            "name": "소우릎",
            "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNDExMjdfMjE5/MDAxNzMyNjY3Njg5NDM0.8j3rtvugOXkN9FMjIBNxIIw2dQ2V_dm62_AaTLV-L3Ig.UvW54nb6XcJ22PKwT45mG9oM8vd6HEsovglMBpmsSUEg.JPEG/%EB%84%A4%EC%9D%B4%EB%B2%84_%ED%94%84%EB%A1%9C%ED%95%84.jpg",
            "channelId": "fc00d47a77ed2d1156cd5997eba30310",
            "isPartner": true,
            "position": "DPS",
            "isCaptain": false,
            "draftPick": 3,
            "draftPassed": false
        },
        {
            "streamerId": 249,
            "name": "눈꽃",
            "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNDAyMDhfMjQx/MDAxNzA3MzQyMjM3Mzgy.3bjg2WU5OhQgn6LclnDY99PtcHJKs4Uip5ZnwpKk9Akg.e3lG8RxAihRVY4UTSSD4UvAzzuIyWAyhcm0SjOQGM_Eg.PNG/a041cbbe2c736a35.png",
            "channelId": "343fc0e877aa8ca0cad5106b33d6fa95",
            "isPartner": true,
            "position": "DPS",
            "isCaptain": false,
            "draftPick": 13,
            "draftPassed": false
        },
        {
            "streamerId": 57,
            "name": "실프",
            "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNDEwMThfNzgg/MDAxNzI5MjM1Mjc1NTYy.Qblw8-SDtgX1cgiv-HKFasWbX7Ynr5j-HGPmDyhi9vwg.g5XvfcEXVrIRHCIFt-gU1JjrkXusKOyhE9fb7r7qkJ0g.JPEG/%EB%A8%80%EB%8B%98_%ED%8C%AC%EC%95%84%ED%8A%B8.jpg",
            "channelId": "d6fc3283fe0938bca8d65093e4c2bb94",
            "isPartner": true,
            "position": "DPS",
            "isCaptain": false,
            "draftPick": 10,
            "draftPassed": false
        },
        {
            "streamerId": 1,
            "name": "울프",
            "avatarUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMjBfNDkg/MDAxNzAzMDU1NjA1MTY2.bCUbi8bRvnKsF6Gmw_EIPrll1fPYTkJzTDo243vchEEg.JIYN6Ve8RVWFNqjdiwrEImVAAK4s-bNrJRRGA0ikM8sg.JPEG/%EA%B7%B8%EC%9C%BD.jpg",
            "channelId": "0b33823ac81de48d5b78a38cdbc0ab94",
            "isPartner": true,
            "position": "DPS",
            "isCaptain": false,
            "draftPick": 8,
            "draftPassed": false
        },
        {
            "streamerId": 217,
            "name": "네클릿",
            "avatarUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMTlfMzgg/MDAxNzAyOTgyNDkwNzU2.69Y1Bznm6GcUlQo35pbCnKAzdt-dio5zREtLxSk0vWQg.pI7i4goPlZ50YIYhsx82N1Zgm_ZOKHJxAR6OYDi6V2Ig.PNG/f2b4a79a-f9ce-4c4d-bbd9-37dd95fe01d4-profile_image-300x300.png",
            "channelId": "dff5fc9706f8260682ce6eb93acaad64",
            "isPartner": true,
            "position": "DPS",
            "isCaptain": false,
            "draftPick": 11,
            "draftPassed": false
        },
        {
            "streamerId": 121,
            "name": "댕균",
            "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNTExMzBfMjc4/MDAxNzY0NDMwNjA0MTEx.2yG3ggIShTI9yswyEjG7gH5oX0oq0Ef9NcXYn4xPtnYg.0eJGxgZpqvs-GgAN0ReATzk0oKKTM_RgDiVyrtPzv1cg.JPEG/image.jpg",
            "channelId": "415d3f63dab9ca7fe8ab4eb3c55b856b",
            "isPartner": false,
            "position": "DPS",
            "isCaptain": false,
            "draftPick": 9,
            "draftPassed": false
        },
        {
            "streamerId": 118,
            "name": "뱅",
            "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNTA0MTFfMTU0/MDAxNzQ0MzA0NTg5MjE5.6toa4kRwjhkudPEPzM5M08cuq8RfU2Ptn9Wg6I3YR4Ig.bgsdMNxOyWwzXIksUTuqR-Wsl4RIKRsjj46lxWMrtpsg.PNG/558C0E86-BEE1-4CB1-8814-F503574FD862-1744304587.png",
            "channelId": "9d4f299325b38f9183bdb90b8849d912",
            "isPartner": true,
            "position": "DPS",
            "isCaptain": false,
            "draftPick": 5,
            "draftPassed": false
        },
        {
            "streamerId": 150,
            "name": "큐베",
            "avatarUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMTlfMTQ1/MDAxNzAyOTg5NDExMjI3.ZtBTqxhtGpbSlhO3yb_fybC7D4rd5uf5Ia2Yu5R3Gmgg.4HOcxkk47iqx6DhNHhPStudkjMpc6Vv13g-kBkE3eEEg.PNG/1.png",
            "channelId": "26ae7850ad5b6b09ca864d482dc7fa50",
            "isPartner": true,
            "position": "DPS",
            "isCaptain": false,
            "draftPick": 6,
            "draftPassed": false
        },
        {
            "streamerId": 29,
            "name": "빅헤드",
            "avatarUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMTlfMzYg/MDAxNzAyOTcwODY1OTUy.1hHkqzH-zyEhyW2EJNfj1q6r7XTDeQNNqL_owQQ6AFwg.mCjDaHbdF0jjfhB2PvFuFJLxL9jQ-PV0oSLLDRXoGLUg.GIF/popHEAD.gif",
            "channelId": "ca1850b2eceb7f86146695fd9bb9cefc",
            "isPartner": true,
            "position": "TNK",
            "isCaptain": true,
            "draftPick": null,
            "draftPassed": false
        },
        {
            "streamerId": 26,
            "name": "명예훈장",
            "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNDAzMDlfMjgz/MDAxNzA5OTcyMjE4MzE4.tazj8FnBUJm3wdTIvF2c_J0DiXPfEFC811J74rBHU6gg.LNbEKg4Dc4kxfTvtTHbBRMiOEezBmsPT3zwmvv6q8qsg.JPEG/ddd.jpg",
            "channelId": "5d53f8fa5bef9b1bd4dc884f9907c079",
            "isPartner": true,
            "position": "TNK",
            "isCaptain": true,
            "draftPick": null,
            "draftPassed": false
        },
        {
            "streamerId": 153,
            "name": "치킨쿤",
            "avatarUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMTlfMjkx/MDAxNzAyOTg3MTU4MTI2.xjXuwGf1C2lFWgNkRvvEkHIgSelXf_HozLaFCx15kW0g.dp4FtK6XjvcdSfoRs7Bv6YozhCRyvbauUvknbR8N6bUg.PNG/3.png",
            "channelId": "4b00ded9b083e31c29dc509d7e063c7a",
            "isPartner": true,
            "position": "TNK",
            "isCaptain": true,
            "draftPick": null,
            "draftPassed": false
        },
        {
            "streamerId": 328,
            "name": "나무늘보",
            "avatarUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMjNfNzIg/MDAxNzAzMzA4Mzc3MzUw.9aFs-t5TU5TtqwR36HI6uKHkPMqwf9lK1bx4uanrRUUg.1_SY29dXi7OmK_BkKUDMYiBhnsill23GbXyNaIt-EQ8g.JPEG/channels4_profile.jpg",
            "channelId": "b4ad93eb95fdf626c63fd034878d9f09",
            "isPartner": false,
            "position": "TNK",
            "isCaptain": true,
            "draftPick": null,
            "draftPassed": false
        }
    ]
}

export const OW_STATIC_TEAMS: OWTeamsResponse = {
    "teams": [
        {
            "id": 1,
            "name": "건피상사",
            "logoUrl": null,
            "teamOrder": 0,
            "members": [
                {
                    "id": 2,
                    "slot": "TNK",
                    "streamerId": 26,
                    "name": "명예훈장",
                    "nickname": "명예훈장",
                    "channelId": "5d53f8fa5bef9b1bd4dc884f9907c079",
                    "isPartner": true,
                    "isCaptain": true,
                    "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNDAzMDlfMjgz/MDAxNzA5OTcyMjE4MzE4.tazj8FnBUJm3wdTIvF2c_J0DiXPfEFC811J74rBHU6gg.LNbEKg4Dc4kxfTvtTHbBRMiOEezBmsPT3zwmvv6q8qsg.JPEG/ddd.jpg",
                    "profileUrl": null
                },
                {
                    "id": 5,
                    "slot": "DPS",
                    "streamerId": 1,
                    "name": "울프",
                    "nickname": "울프",
                    "channelId": "0b33823ac81de48d5b78a38cdbc0ab94",
                    "isPartner": true,
                    "isCaptain": false,
                    "avatarUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMjBfNDkg/MDAxNzAzMDU1NjA1MTY2.bCUbi8bRvnKsF6Gmw_EIPrll1fPYTkJzTDo243vchEEg.JIYN6Ve8RVWFNqjdiwrEImVAAK4s-bNrJRRGA0ikM8sg.JPEG/%EA%B7%B8%EC%9C%BD.jpg",
                    "profileUrl": null
                },
                {
                    "id": 12,
                    "slot": "DPS",
                    "streamerId": 118,
                    "name": "뱅",
                    "nickname": "뱅",
                    "channelId": "9d4f299325b38f9183bdb90b8849d912",
                    "isPartner": true,
                    "isCaptain": false,
                    "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNTA0MTFfMTU0/MDAxNzQ0MzA0NTg5MjE5.6toa4kRwjhkudPEPzM5M08cuq8RfU2Ptn9Wg6I3YR4Ig.bgsdMNxOyWwzXIksUTuqR-Wsl4RIKRsjj46lxWMrtpsg.PNG/558C0E86-BEE1-4CB1-8814-F503574FD862-1744304587.png",
                    "profileUrl": null
                },
                {
                    "id": 13,
                    "slot": "SPT",
                    "streamerId": 59,
                    "name": "서넹",
                    "nickname": "서넹",
                    "channelId": "5777797bab18388e7044ed7bac3c56c8",
                    "isPartner": true,
                    "isCaptain": false,
                    "avatarUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMTlfMTMz/MDAxNzAyOTU5OTUzNzAx.EgFT_odne3NeV7MAcP6vvOUptwlPNut0YCvhRQijBckg.9q7feFbKNIrN3MkQyBYnIvQwgJUuZoyA8lbpPi3yiy8g.JPEG/unnamed.jpg",
                    "profileUrl": null
                },
                {
                    "id": 20,
                    "slot": "SPT",
                    "streamerId": 61,
                    "name": "엘리",
                    "nickname": "엘리",
                    "channelId": "475313e6c26639d5763628313b4c130e",
                    "isPartner": true,
                    "isCaptain": false,
                    "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNTEwMTJfMjQg/MDAxNzYwMjU5MzQwODQw.72r-pbnXpBvoFivvGK9dKk9CAO8aJN5UV6wXejRiiPwg.Oo7lN5-LX4Dd9tETgUqx5UGoHXNKZ55O5Xy6MnaX7-kg.PNG/image.png",
                    "profileUrl": null
                },
                {
                    "id": 21,
                    "slot": "HEAD_COACH",
                    "streamerId": 3,
                    "name": "풍월량",
                    "nickname": "풍월량",
                    "channelId": "7ce8032370ac5121dcabce7bad375ced",
                    "isPartner": true,
                    "isCaptain": false,
                    "avatarUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMjBfNzgg/MDAxNzAyOTk5MDU4NTQ1.q74UANafs4egu_GflqIXrKZvqweabjdsqb3q7F-vEPEg.0DlZf3Myopu6ITUmTkOYLU-GKcBLotgKn61A0o9ZAN4g.PNG/7d354ef2-b2a8-4276-8c12-5be7f6301ae0-profile_image-600x600.png",
                    "profileUrl": null
                },
                {
                    "id": 22,
                    "slot": "COACH",
                    "streamerId": null,
                    "name": "이태준",
                    "channelId": null,
                    "isPartner": false,
                    "isCaptain": false,
                    "avatarUrl": null,
                    "profileUrl": "https://namu.wiki/w/이태준"
                }
            ]
        },
        {
            "id": 2,
            "name": "에임몬스터",
            "logoUrl": null,
            "teamOrder": 1,
            "members": [
                {
                    "id": 3,
                    "slot": "TNK",
                    "streamerId": 153,
                    "name": "치킨쿤",
                    "nickname": "치킨쿤",
                    "channelId": "4b00ded9b083e31c29dc509d7e063c7a",
                    "isPartner": true,
                    "isCaptain": true,
                    "avatarUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMTlfMjkx/MDAxNzAyOTg3MTU4MTI2.xjXuwGf1C2lFWgNkRvvEkHIgSelXf_HozLaFCx15kW0g.dp4FtK6XjvcdSfoRs7Bv6YozhCRyvbauUvknbR8N6bUg.PNG/3.png",
                    "profileUrl": null
                },
                {
                    "id": 6,
                    "slot": "DPS",
                    "streamerId": 22,
                    "name": "소우릎",
                    "nickname": "소우릎",
                    "channelId": "fc00d47a77ed2d1156cd5997eba30310",
                    "isPartner": true,
                    "isCaptain": false,
                    "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNDExMjdfMjE5/MDAxNzMyNjY3Njg5NDM0.8j3rtvugOXkN9FMjIBNxIIw2dQ2V_dm62_AaTLV-L3Ig.UvW54nb6XcJ22PKwT45mG9oM8vd6HEsovglMBpmsSUEg.JPEG/%EB%84%A4%EC%9D%B4%EB%B2%84_%ED%94%84%EB%A1%9C%ED%95%84.jpg",
                    "profileUrl": null
                },
                {
                    "id": 11,
                    "slot": "DPS",
                    "streamerId": 10,
                    "name": "아야츠노 유니",
                    "nickname": "아야츠노 유니",
                    "channelId": "45e71a76e949e16a34764deb962f9d9f",
                    "isPartner": true,
                    "isCaptain": false,
                    "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNTAzMzFfMjQw/MDAxNzQzNDMwNTM4OTg4.Bam6imHvAZLBWT0GHFprz94iS5CaGFmVI9RoXktnY-4g.AkwRyhY_RhSGzEiBXTvs4pEyo7KxI4GmUd151O8cVcYg.PNG/%EC%9C%A0%EB%8B%883.png",
                    "profileUrl": null
                },
                {
                    "id": 14,
                    "slot": "SPT",
                    "streamerId": 57,
                    "name": "실프",
                    "nickname": "실프",
                    "channelId": "d6fc3283fe0938bca8d65093e4c2bb94",
                    "isPartner": true,
                    "isCaptain": false,
                    "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNDEwMThfNzgg/MDAxNzI5MjM1Mjc1NTYy.Qblw8-SDtgX1cgiv-HKFasWbX7Ynr5j-HGPmDyhi9vwg.g5XvfcEXVrIRHCIFt-gU1JjrkXusKOyhE9fb7r7qkJ0g.JPEG/%EB%A8%80%EB%8B%98_%ED%8C%AC%EC%95%84%ED%8A%B8.jpg",
                    "profileUrl": null
                },
                {
                    "id": 19,
                    "slot": "SPT",
                    "streamerId": 125,
                    "name": "임나은",
                    "nickname": "임나은",
                    "channelId": "0de024a1ca4a64f1a23a95ff9eeee5a5",
                    "isPartner": true,
                    "isCaptain": false,
                    "avatarUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMjFfMjE4/MDAxNzAzMTQwNTQ4NDEz.l-4zi6piSfpGzSTZNq_V7192BUVrOpkHUZsqIDW8lLgg.cqAuLaz96FEuvBTNQF3NovipkisvMs2As5G5MxjaZTcg.PNG/1%EC%9E%84%EB%82%98%EC%9D%80-2.png",
                    "profileUrl": null
                },
                {
                    "id": 23,
                    "slot": "HEAD_COACH",
                    "streamerId": 207,
                    "name": "따효니",
                    "nickname": "따효니",
                    "channelId": "0dad8baf12a436f722faa8e5001c5011",
                    "isPartner": true,
                    "isCaptain": false,
                    "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNTA4MTFfMjMy/MDAxNzU0OTEyMjY1MDc4.mARd5LYxanGQXjxIDx3Wdi4G09HSF9_QqNKK5BsiL9kg.Y9xQFoaxZHNk2hvC_CyMVOB_8atqZmIiHN3j2A4Gwv4g.PNG/image.png",
                    "profileUrl": null
                }
            ]
        },
        {
            "id": 3,
            "name": "큰머리상사",
            "logoUrl": null,
            "teamOrder": 2,
            "members": [
                {
                    "id": 1,
                    "slot": "TNK",
                    "streamerId": 29,
                    "name": "빅헤드",
                    "nickname": "빅헤드",
                    "channelId": "ca1850b2eceb7f86146695fd9bb9cefc",
                    "isPartner": true,
                    "isCaptain": true,
                    "avatarUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMTlfMzYg/MDAxNzAyOTcwODY1OTUy.1hHkqzH-zyEhyW2EJNfj1q6r7XTDeQNNqL_owQQ6AFwg.mCjDaHbdF0jjfhB2PvFuFJLxL9jQ-PV0oSLLDRXoGLUg.GIF/popHEAD.gif",
                    "profileUrl": null
                },
                {
                    "id": 7,
                    "slot": "DPS",
                    "streamerId": 249,
                    "name": "눈꽃",
                    "nickname": "눈꽃",
                    "channelId": "343fc0e877aa8ca0cad5106b33d6fa95",
                    "isPartner": true,
                    "isCaptain": false,
                    "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNDAyMDhfMjQx/MDAxNzA3MzQyMjM3Mzgy.3bjg2WU5OhQgn6LclnDY99PtcHJKs4Uip5ZnwpKk9Akg.e3lG8RxAihRVY4UTSSD4UvAzzuIyWAyhcm0SjOQGM_Eg.PNG/a041cbbe2c736a35.png",
                    "profileUrl": null
                },
                {
                    "id": 10,
                    "slot": "DPS",
                    "streamerId": 27,
                    "name": "둥그레",
                    "nickname": "둥그레",
                    "channelId": "1b0561f3051c10a24b9d8ec9a6cb3374",
                    "isPartner": true,
                    "isCaptain": false,
                    "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNTAxMThfMTc3/MDAxNzM3MjAwNDEwNDEz.3HR0Dgho-J8f52wL76yNcAdxK23Fpn0sgn0PrliTEA4g.5lGwprVCWWgRugT5FFARxJkScJ374zwoBh0wVx73OKEg.PNG/178E770E-723D-42F1-AFF5-0F225ABF0B2A-1737200410.png",
                    "profileUrl": null
                },
                {
                    "id": 15,
                    "slot": "SPT",
                    "streamerId": 121,
                    "name": "댕균",
                    "nickname": "댕균",
                    "channelId": "415d3f63dab9ca7fe8ab4eb3c55b856b",
                    "isPartner": false,
                    "isCaptain": false,
                    "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNTExMzBfMjc4/MDAxNzY0NDMwNjA0MTEx.2yG3ggIShTI9yswyEjG7gH5oX0oq0Ef9NcXYn4xPtnYg.0eJGxgZpqvs-GgAN0ReATzk0oKKTM_RgDiVyrtPzv1cg.JPEG/image.jpg",
                    "profileUrl": null
                },
                {
                    "id": 18,
                    "slot": "SPT",
                    "streamerId": 192,
                    "name": "삐부",
                    "nickname": "삐부",
                    "channelId": "5f44570b82fb82d4814ef9502cf6401a",
                    "isPartner": true,
                    "isCaptain": false,
                    "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNDA5MjFfOTgg/MDAxNzI2OTA3NTEwMzAx.alpzjL6SITSDFXzy4wceQvnQYzbIrZwRQYl4w2HUnpUg.mJoZNEWZzpqIEiCSvI3JR49-KAG3eIM7VjfIqlwI30og.PNG/f01144d33e6e7278-1.png",
                    "profileUrl": null
                },
                {
                    "id": 24,
                    "slot": "COACH",
                    "streamerId": null,
                    "name": "박민수",
                    "channelId": null,
                    "isPartner": false,
                    "isCaptain": false,
                    "avatarUrl": null,
                    "profileUrl": null
                },
                {
                    "id": 25,
                    "slot": "COACH",
                    "streamerId": null,
                    "name": "김도현",
                    "channelId": null,
                    "isPartner": false,
                    "isCaptain": false,
                    "avatarUrl": null,
                    "profileUrl": null
                }
            ]
        },
        {
            "id": 4,
            "name": "탈모케어중",
            "logoUrl": null,
            "teamOrder": 3,
            "members": [
                {
                    "id": 4,
                    "slot": "TNK",
                    "streamerId": 328,
                    "name": "나무늘보",
                    "nickname": "나무늘보",
                    "channelId": "b4ad93eb95fdf626c63fd034878d9f09",
                    "isPartner": false,
                    "isCaptain": true,
                    "avatarUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMjNfNzIg/MDAxNzAzMzA4Mzc3MzUw.9aFs-t5TU5TtqwR36HI6uKHkPMqwf9lK1bx4uanrRUUg.1_SY29dXi7OmK_BkKUDMYiBhnsill23GbXyNaIt-EQ8g.JPEG/channels4_profile.jpg",
                    "profileUrl": null
                },
                {
                    "id": 8,
                    "slot": "DPS",
                    "streamerId": 75,
                    "name": "양아지",
                    "nickname": "양아지",
                    "channelId": "3e825479d71ead63b76de0d6f6b5dc83",
                    "isPartner": true,
                    "isCaptain": false,
                    "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNTA0MDJfMTQg/MDAxNzQzNTIwNTc0OTA0.lL8e5sGkq1Xr4QjOXEADTw7GNwETN_Qrpv8yf3Ct9mkg.nfR2X3wib3P6ekWFGEas3iHvdwG0trX0Ax5dwypLaN4g.PNG/2_%286%29.png",
                    "profileUrl": null
                },
                {
                    "id": 9,
                    "slot": "DPS",
                    "streamerId": 43,
                    "name": "푸린",
                    "nickname": "푸린",
                    "channelId": "75bd327f6ba6f57106c79fe3f2c3d19f",
                    "isPartner": true,
                    "isCaptain": false,
                    "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNjAyMDlfMjQw/MDAxNzcwNjI4MzcyNTg0.SQw3dnvofX4DlxLYk0Ick0c3EapsF6iaja5gj_wnn8Ug.MENvgDIlqSmA25gFtzkmsc-VqPmatNnTXlpYcO3Dem8g.PNG/image.png",
                    "profileUrl": null
                },
                {
                    "id": 16,
                    "slot": "SPT",
                    "streamerId": 150,
                    "name": "큐베",
                    "nickname": "큐베",
                    "channelId": "26ae7850ad5b6b09ca864d482dc7fa50",
                    "isPartner": true,
                    "isCaptain": false,
                    "avatarUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMTlfMTQ1/MDAxNzAyOTg5NDExMjI3.ZtBTqxhtGpbSlhO3yb_fybC7D4rd5uf5Ia2Yu5R3Gmgg.4HOcxkk47iqx6DhNHhPStudkjMpc6Vv13g-kBkE3eEEg.PNG/1.png",
                    "profileUrl": null
                },
                {
                    "id": 17,
                    "slot": "SPT",
                    "streamerId": 217,
                    "name": "네클릿",
                    "nickname": "네클릿",
                    "channelId": "dff5fc9706f8260682ce6eb93acaad64",
                    "isPartner": true,
                    "isCaptain": false,
                    "avatarUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMTlfMzgg/MDAxNzAyOTgyNDkwNzU2.69Y1Bznm6GcUlQo35pbCnKAzdt-dio5zREtLxSk0vWQg.pI7i4goPlZ50YIYhsx82N1Zgm_ZOKHJxAR6OYDi6V2Ig.PNG/f2b4a79a-f9ce-4c4d-bbd9-37dd95fe01d4-profile_image-300x300.png",
                    "profileUrl": null
                },
                {
                    "id": 26,
                    "slot": "HEAD_COACH",
                    "streamerId": 181,
                    "name": "침착맨",
                    "nickname": "침착맨",
                    "channelId": "bb382c2c0cc9fa7c86ab3b037fb5799c",
                    "isPartner": false,
                    "isCaptain": false,
                    "avatarUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMTlfMTU0/MDAxNzAyOTU0NDE3NDcy.ykWtgPCYsJ6bR0iGi-mDG8g4jKBPvD17onQV2StICPsg.crHkYsEsJBBCOlWj8Afiwg-FImH5hMtAk5CWMp9dZ4Eg.PNG/%EC%B9%A8%EC%B0%A9%EB%A7%A8-%ED%94%84%EB%A1%9C%ED%95%84-2023.png",
                    "profileUrl": null
                }
            ]
        }
    ]
}

export const OW_STATIC_MATCHES: OWBracketResponse = {
    "bracket": {
        "upper": [
            {
                "label": "UB SEMI-FINAL",
                "matches": [
                    {
                        "id": "ub-sf-1",
                        "team1": {
                            "name": "건피상사",
                            "logoUrl": null,
                            "score": 1
                        },
                        "team2": {
                            "name": "탈모케어중",
                            "logoUrl": null,
                            "score": 3
                        },
                        "scheduledAt": "2026-03-12T05:00:00+00:00",
                        "isLive": false,
                        "format": "bo5",
                        "status": "COMPLETED",
                        "sets": [
                            {
                                "setNumber": 1,
                                "mapType": "쟁탈",
                                "mapName": "네팔",
                                "score1": 1,
                                "score2": 2,
                                "winner": "team2",
                                "roundScore": "1:2"
                            },
                            {
                                "setNumber": 2,
                                "mapType": "혼합",
                                "mapName": "할리우드",
                                "score1": 1,
                                "score2": 2,
                                "winner": "team2",
                                "roundScore": undefined
                            },
                            {
                                "setNumber": 3,
                                "mapType": "밀기",
                                "mapName": "콜로세오",
                                "score1": 1,
                                "score2": 0,
                                "winner": "team1",
                                "roundScore": undefined
                            },
                            {
                                "setNumber": 4,
                                "mapType": "호위",
                                "mapName": "66번국도",
                                "score1": 1,
                                "score2": 2,
                                "winner": "team2",
                                "roundScore": undefined
                            }
                        ],
                        "mvps": [
                            {
                                "name": "울프",
                                "avatarUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMjBfNDkg/MDAxNzAzMDU1NjA1MTY2.bCUbi8bRvnKsF6Gmw_EIPrll1fPYTkJzTDo243vchEEg.JIYN6Ve8RVWFNqjdiwrEImVAAK4s-bNrJRRGA0ikM8sg.JPEG/%EA%B7%B8%EC%9C%BD.jpg",
                                "position": "DPS",
                                "count": 1
                            },
                            {
                                "name": "양아지",
                                "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNTA0MDJfMTQg/MDAxNzQzNTIwNTc0OTA0.lL8e5sGkq1Xr4QjOXEADTw7GNwETN_Qrpv8yf3Ct9mkg.nfR2X3wib3P6ekWFGEas3iHvdwG0trX0Ax5dwypLaN4g.PNG/2_%286%29.png",
                                "position": "DPS",
                                "count": 1
                            },
                            {
                                "name": "나무늘보",
                                "avatarUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMjNfNzIg/MDAxNzAzMzA4Mzc3MzUw.9aFs-t5TU5TtqwR36HI6uKHkPMqwf9lK1bx4uanrRUUg.1_SY29dXi7OmK_BkKUDMYiBhnsill23GbXyNaIt-EQ8g.JPEG/channels4_profile.jpg",
                                "position": "TNK",
                                "count": 1
                            },
                            {
                                "name": "명예훈장",
                                "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNDAzMDlfMjgz/MDAxNzA5OTcyMjE4MzE4.tazj8FnBUJm3wdTIvF2c_J0DiXPfEFC811J74rBHU6gg.LNbEKg4Dc4kxfTvtTHbBRMiOEezBmsPT3zwmvv6q8qsg.JPEG/ddd.jpg",
                                "position": "TNK",
                                "count": 1
                            }
                        ]
                    },
                    {
                        "id": "ub-sf-2",
                        "team1": {
                            "name": "에임몬스터",
                            "logoUrl": null,
                            "score": 2
                        },
                        "team2": {
                            "name": "큰머리상사",
                            "logoUrl": null,
                            "score": 3
                        },
                        "scheduledAt": "2026-03-12T07:00:00+00:00",
                        "isLive": false,
                        "format": "bo5",
                        "status": "COMPLETED",
                        "sets": [
                            {
                                "setNumber": 1,
                                "mapType": "쟁탈",
                                "mapName": "일리오스",
                                "score1": 2,
                                "score2": 0,
                                "winner": "team1",
                                "roundScore": "2:0"
                            },
                            {
                                "setNumber": 2,
                                "mapType": "혼합",
                                "mapName": "할리우드",
                                "score1": 1,
                                "score2": 2,
                                "winner": "team2",
                                "roundScore": undefined
                            },
                            {
                                "setNumber": 3,
                                "mapType": "밀기",
                                "mapName": "콜로세오",
                                "score1": 0,
                                "score2": 1,
                                "winner": "team2",
                                "roundScore": undefined
                            },
                            {
                                "setNumber": 4,
                                "mapType": "호위",
                                "mapName": "도라도",
                                "score1": 2,
                                "score2": 1,
                                "winner": "team1",
                                "roundScore": undefined
                            },
                            {
                                "setNumber": 5,
                                "mapType": "쟁탈",
                                "mapName": "네팔",
                                "score1": 0,
                                "score2": 2,
                                "winner": "team2",
                                "roundScore": "0:2"
                            }
                        ],
                        "mvps": [
                            {
                                "name": "소우릎",
                                "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNDExMjdfMjE5/MDAxNzMyNjY3Njg5NDM0.8j3rtvugOXkN9FMjIBNxIIw2dQ2V_dm62_AaTLV-L3Ig.UvW54nb6XcJ22PKwT45mG9oM8vd6HEsovglMBpmsSUEg.JPEG/%EB%84%A4%EC%9D%B4%EB%B2%84_%ED%94%84%EB%A1%9C%ED%95%84.jpg",
                                "position": "DPS",
                                "count": 2
                            },
                            {
                                "name": "빅헤드",
                                "avatarUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMTlfMzYg/MDAxNzAyOTcwODY1OTUy.1hHkqzH-zyEhyW2EJNfj1q6r7XTDeQNNqL_owQQ6AFwg.mCjDaHbdF0jjfhB2PvFuFJLxL9jQ-PV0oSLLDRXoGLUg.GIF/popHEAD.gif",
                                "position": "TNK",
                                "count": 1
                            },
                            {
                                "name": "댕균",
                                "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNTExMzBfMjc4/MDAxNzY0NDMwNjA0MTEx.2yG3ggIShTI9yswyEjG7gH5oX0oq0Ef9NcXYn4xPtnYg.0eJGxgZpqvs-GgAN0ReATzk0oKKTM_RgDiVyrtPzv1cg.JPEG/image.jpg",
                                "position": "SPT",
                                "count": 1
                            },
                            {
                                "name": "둥그레",
                                "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNTAxMThfMTc3/MDAxNzM3MjAwNDEwNDEz.3HR0Dgho-J8f52wL76yNcAdxK23Fpn0sgn0PrliTEA4g.5lGwprVCWWgRugT5FFARxJkScJ374zwoBh0wVx73OKEg.PNG/178E770E-723D-42F1-AFF5-0F225ABF0B2A-1737200410.png",
                                "position": "DPS",
                                "count": 1
                            }
                        ]
                    }
                ]
            },
            {
                "label": "UB FINAL",
                "matches": [
                    {
                        "id": "ub-f",
                        "team1": {
                            "name": "탈모케어중",
                            "logoUrl": null,
                            "score": 0
                        },
                        "team2": {
                            "name": "큰머리상사",
                            "logoUrl": null,
                            "score": 3
                        },
                        "scheduledAt": "2026-03-12T09:00:00+00:00",
                        "isLive": false,
                        "format": "bo5",
                        "status": "COMPLETED",
                        "sets": [
                            {
                                "setNumber": 1,
                                "mapType": "쟁탈",
                                "mapName": "부산",
                                "score1": 1,
                                "score2": 2,
                                "winner": "team2",
                                "roundScore": "1:2"
                            },
                            {
                                "setNumber": 2,
                                "mapType": "혼합",
                                "mapName": "눔바니",
                                "score1": 2,
                                "score2": 3,
                                "winner": "team2",
                                "roundScore": undefined
                            },
                            {
                                "setNumber": 3,
                                "mapType": "밀기",
                                "mapName": "콜로세오",
                                "score1": 0,
                                "score2": 1,
                                "winner": "team2",
                                "roundScore": undefined
                            }
                        ],
                        "mvps": [
                            {
                                "name": "댕균",
                                "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNTExMzBfMjc4/MDAxNzY0NDMwNjA0MTEx.2yG3ggIShTI9yswyEjG7gH5oX0oq0Ef9NcXYn4xPtnYg.0eJGxgZpqvs-GgAN0ReATzk0oKKTM_RgDiVyrtPzv1cg.JPEG/image.jpg",
                                "position": "SPT",
                                "count": 1
                            },
                            {
                                "name": "나무늘보",
                                "avatarUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMjNfNzIg/MDAxNzAzMzA4Mzc3MzUw.9aFs-t5TU5TtqwR36HI6uKHkPMqwf9lK1bx4uanrRUUg.1_SY29dXi7OmK_BkKUDMYiBhnsill23GbXyNaIt-EQ8g.JPEG/channels4_profile.jpg",
                                "position": "TNK",
                                "count": 1
                            },
                            {
                                "name": "둥그레",
                                "avatarUrl": "https://nng-phinf.pstatic.net/MjAyNTAxMThfMTc3/MDAxNzM3MjAwNDEwNDEz.3HR0Dgho-J8f52wL76yNcAdxK23Fpn0sgn0PrliTEA4g.5lGwprVCWWgRugT5FFARxJkScJ374zwoBh0wVx73OKEg.PNG/178E770E-723D-42F1-AFF5-0F225ABF0B2A-1737200410.png",
                                "position": "DPS",
                                "count": 1
                            }
                        ]
                    }
                ]
            }
        ],
        "lower": [
            {
                "label": "LB ROUND 1",
                "matches": [
                    {
                        "id": "lb-r1",
                        "team1": {
                            "name": "건피상사",
                            "logoUrl": null,
                            "score": 1
                        },
                        "team2": {
                            "name": "에임몬스터",
                            "logoUrl": null,
                            "score": 3
                        },
                        "scheduledAt": null,
                        "isLive": false,
                        "format": "bo5",
                        "status": "COMPLETED",
                        "sets": [
                            {
                                "setNumber": 1,
                                "mapType": "쟁탈",
                                "mapName": "네팔",
                                "score1": 2,
                                "score2": 1,
                                "winner": "team1",
                                "roundScore": "2:1"
                            },
                            {
                                "setNumber": 2,
                                "mapType": "혼합",
                                "mapName": "아이헨발데",
                                "score1": 1,
                                "score2": 3,
                                "winner": "team2",
                                "roundScore": undefined
                            },
                            {
                                "setNumber": 3,
                                "mapType": "밀기",
                                "mapName": "콜로세오",
                                "score1": 0,
                                "score2": 1,
                                "winner": "team2",
                                "roundScore": undefined
                            },
                            {
                                "setNumber": 4,
                                "mapType": "호위",
                                "mapName": "리알토",
                                "score1": 1,
                                "score2": 2,
                                "winner": "team2",
                                "roundScore": undefined
                            }
                        ],
                        "mvps": []
                    }
                ]
            },
            {
                "label": "LB FINAL",
                "matches": [
                    {
                        "id": "lb-f",
                        "team1": {
                            "name": "탈모케어중",
                            "logoUrl": null,
                            "score": 3
                        },
                        "team2": {
                            "name": "에임몬스터",
                            "logoUrl": null,
                            "score": 2
                        },
                        "scheduledAt": null,
                        "isLive": false,
                        "format": "bo5",
                        "status": "COMPLETED",
                        "sets": [],
                        "mvps": []
                    }
                ]
            }
        ],
        "grandFinal": {
            "id": "gf",
            "team1": {
                "name": "큰머리상사",
                "logoUrl": null,
                "score": 4
            },
            "team2": {
                "name": "탈모케어중",
                "logoUrl": null,
                "score": 3
            },
            "scheduledAt": null,
            "isLive": false,
            "format": "bo7",
            "status": "COMPLETED",
            "sets": [
                {
                    "setNumber": 1,
                    "mapType": "쟁탈",
                    "mapName": "네팔",
                    "score1": 2,
                    "score2": 0,
                    "winner": "team1",
                    "roundScore": "2:0"
                },
                {
                    "setNumber": 2,
                    "mapType": "혼합",
                    "mapName": "눔바니",
                    "score1": 1,
                    "score2": 3,
                    "winner": "team2",
                    "roundScore": undefined
                },
                {
                    "setNumber": 3,
                    "mapType": "밀기",
                    "mapName": "루나사피",
                    "score1": 0,
                    "score2": 1,
                    "winner": "team2",
                    "roundScore": undefined
                },
                {
                    "setNumber": 4,
                    "mapType": "호위",
                    "mapName": "도라도",
                    "score1": 3,
                    "score2": 2,
                    "winner": "team1",
                    "roundScore": undefined
                },
                {
                    "setNumber": 5,
                    "mapType": "쟁탈",
                    "mapName": "오아시스",
                    "score1": 1,
                    "score2": 2,
                    "winner": "team2",
                    "roundScore": "1:2"
                },
                {
                    "setNumber": 6,
                    "mapType": "혼합",
                    "mapName": "할리우드",
                    "score1": 1,
                    "score2": 0,
                    "winner": "team1",
                    "roundScore": undefined
                },
                {
                    "setNumber": 7,
                    "mapType": "호위",
                    "mapName": "66번 국도",
                    "score1": 3,
                    "score2": 2,
                    "winner": "team1",
                    "roundScore": undefined
                }
            ],
            "mvps": []
        }
    }
}
