import type { F1DraftTeamDriver, F1DraftTeamOperator, F1DriverRole, F1TeamDraftContent, PublicTournamentPlayersResponse } from '../types'

type TeamTheme = {
    readonly teamName: string
    readonly teamNameKo: string
    readonly logoUrl: string | null
    readonly logoBgClass: string
    readonly stripeClass: string
    readonly cardClass: string
    readonly firstBadgeClass: string
    readonly secondBadgeClass: string
    readonly operatorBadgeClass: string
}

type NormalizedPlayer = {
    readonly id: number
    readonly nickname: string
    readonly avatarUrl: string | null
    readonly isPartner: boolean
    readonly driverRole: F1DriverRole
    readonly qualifyingEliminated: boolean
}

export type F1TeamAssignmentInput = {
    readonly firstDriverId: number
    readonly secondDriverId: number
    readonly operatorId?: number | null
}

export type F1TeamAssignmentComparison = {
    readonly missingPlayerIds: readonly number[]
}

export const F1_TEAM_ASSIGNMENTS: readonly F1TeamAssignmentInput[] = [
    { firstDriverId: 41, secondDriverId: 75, operatorId: 51 },
    { firstDriverId: 45, secondDriverId: 79, operatorId: 59 },
    { firstDriverId: 43, secondDriverId: 79, operatorId: null },
    { firstDriverId: 49, secondDriverId: 60, operatorId: null },
    { firstDriverId: 47, secondDriverId: 62, operatorId: 66 },
    { firstDriverId: 44, secondDriverId: 61, operatorId: 71 },
    { firstDriverId: 78, secondDriverId: 64, operatorId: null },
    { firstDriverId: 42, secondDriverId: 55, operatorId: 76 },
    { firstDriverId: 52, secondDriverId: 67, operatorId: 53 },
    { firstDriverId: 46, secondDriverId: 70, operatorId: 58 },
]

const TEAM_THEMES: readonly TeamTheme[] = [
    {
        teamName: 'Oracle Red Bull Racing',
        teamNameKo: '레드불',
        logoUrl: 'https://i.namu.wiki/i/pp0NTcIwmqMFAQYwgftzD1TCFMWOSnNNKPq93UuK3UTYqbFh-QcnmVfzZMwJ9TjKXpXvEHT_lS6K8FnCo15iWg.svg',
        logoBgClass: 'bg-[#1E41FF]',
        stripeClass: 'from-[#1E41FF] via-[#0B1F5D] to-[#E10600]',
        cardClass: 'border-[#1E41FF]/40 bg-[#050d2a]/85',
        firstBadgeClass: 'bg-[#1E41FF]/20 text-[#8ca3ff] ring-1 ring-[#1E41FF]/40',
        secondBadgeClass: 'bg-[#E10600]/15 text-[#ff8d89] ring-1 ring-[#E10600]/30',
        operatorBadgeClass: 'bg-[#8a4fff]/20 text-[#cfb0ff] ring-1 ring-[#8a4fff]/35',
    },
    {
        teamName: 'McLaren Formula 1 Team',
        teamNameKo: '맥라렌',
        logoUrl:
            'https://i.namu.wiki/i/ZWzNY63tvJtbjIUj7HeLRSwyQHU6CtXtPEHte1i1Jftrkz_NRmo1Ij0HCjJAv6Cd73xdzkzgvw7ej78P8l-DDA2dpxgRL52L4bgqvVfnFBoI6zd6VteVohRkfVdw_zgkk4FtZ08O-XjCJwDNzUYkLQ.svg',
        logoBgClass: 'bg-[#FF8000]',
        stripeClass: 'from-[#FF8000] via-[#a34d00] to-[#ffd19c]',
        cardClass: 'border-[#FF8000]/35 bg-[#1f1104]/85',
        firstBadgeClass: 'bg-[#FF8000]/20 text-[#ffbf85] ring-1 ring-[#FF8000]/40',
        secondBadgeClass: 'bg-[#ffd19c]/20 text-[#ffe5c4] ring-1 ring-[#ffd19c]/35',
        operatorBadgeClass: 'bg-[#9b5e2e]/20 text-[#dfb48c] ring-1 ring-[#9b5e2e]/35',
    },
    {
        teamName: 'Mercedes-AMG Petronas',
        teamNameKo: '메르세데스',
        logoUrl:
            'https://i.namu.wiki/i/1XFISyrBVLAO1ZCLwRnij40bXt7PkL2vrKRWno4p3Xji_08xVx3gPszmkB-7aKRNKDVxtwUOlIfxqSICM6tc4WzXQrTuPq4KnXySDj685uAJPyzszVS0ssAy3-k2NPaXmG4suSI24WtuaItEBONWWw.svg',
        logoBgClass: 'bg-[#00D2BE]',
        stripeClass: 'from-[#00D2BE] via-[#0e3f3a] to-[#8af5ea]',
        cardClass: 'border-[#00D2BE]/35 bg-[#051a18]/85',
        firstBadgeClass: 'bg-[#00D2BE]/20 text-[#85f2e6] ring-1 ring-[#00D2BE]/40',
        secondBadgeClass: 'bg-[#8af5ea]/20 text-[#c9fff9] ring-1 ring-[#8af5ea]/35',
        operatorBadgeClass: 'bg-[#2d8f86]/20 text-[#8fd7cf] ring-1 ring-[#2d8f86]/35',
    },
    {
        teamName: 'Scuderia Ferrari HP',
        teamNameKo: '페라리',
        logoUrl:
            'https://i.namu.wiki/i/njMPAPw7v-JDe6_FA1NKHc1RAYVl3ryG7jkV-eZaxuQLjqff12FsHTltPjkzioHHKjf3TcTkKMe0ITKpD5TKWpALWCmthjkB0GfjJ9ABOyRaVDZsSzyeQs3VBOnLdEgvcuwRB3oKpIY7Fn-3bFyE_w.svg',
        logoBgClass: 'bg-[#E10600]',
        stripeClass: 'from-[#E10600] via-[#7a0300] to-[#f5d26a]',
        cardClass: 'border-[#E10600]/40 bg-[#200707]/85',
        firstBadgeClass: 'bg-[#E10600]/20 text-[#ff9c98] ring-1 ring-[#E10600]/35',
        secondBadgeClass: 'bg-[#f5d26a]/20 text-[#ffe39c] ring-1 ring-[#f5d26a]/35',
        operatorBadgeClass: 'bg-[#b0713a]/20 text-[#f1c39a] ring-1 ring-[#b0713a]/35',
    },
    {
        teamName: 'Visa Cash App RB',
        teamNameKo: '레이싱 불스',
        logoUrl: 'https://i.namu.wiki/i/R_kr8J2eTWqNWGOhM5qfXe9sumRCci9eDGSVvHXdDVxkEu41r6hmNfbtqxqF3Y8zlY5LQ0tXgAiS2rNP4jszUQ.svg',
        logoBgClass: 'bg-[#6692FF]',
        stripeClass: 'from-[#6692FF] via-[#152d66] to-[#d9e3ff]',
        cardClass: 'border-[#6692FF]/35 bg-[#0a1630]/85',
        firstBadgeClass: 'bg-[#6692FF]/20 text-[#b3c8ff] ring-1 ring-[#6692FF]/40',
        secondBadgeClass: 'bg-[#d9e3ff]/20 text-[#f0f4ff] ring-1 ring-[#d9e3ff]/35',
        operatorBadgeClass: 'bg-[#7289c4]/20 text-[#c0cce8] ring-1 ring-[#7289c4]/35',
    },
    {
        teamName: 'BWT Alpine F1 Team',
        teamNameKo: '알핀',
        logoUrl:
            'https://i.namu.wiki/i/eZDGYCwJXmB1CBzRs1uo0XMH0WT92NbMhmdkuITK8Vq3aSapCRFTq4RE2P3-Quqc9FFqWFVeGcuUUyQc5iH_hxNMjdeTdsrmIkmuFVrKQSJkJ_LoHHW3ntiW0Jje-_V9e6uLlo-6894DPSyaECSU-g.svg',
        logoBgClass: 'bg-[#FF87BC]',
        stripeClass: 'from-[#FF87BC] via-[#5d2240] to-[#54b2ff]',
        cardClass: 'border-[#FF87BC]/35 bg-[#220d18]/85',
        firstBadgeClass: 'bg-[#FF87BC]/20 text-[#ffb7d8] ring-1 ring-[#FF87BC]/40',
        secondBadgeClass: 'bg-[#54b2ff]/20 text-[#b9ddff] ring-1 ring-[#54b2ff]/35',
        operatorBadgeClass: 'bg-[#9f5f80]/20 text-[#ddb2c9] ring-1 ring-[#9f5f80]/35',
    },
    {
        teamName: 'Aston Martin Aramco',
        teamNameKo: '애스턴마틴',
        logoUrl:
            'https://i.namu.wiki/i/0LY_ISLsUAh10t0BGTa4LwYiYzwblcPQ8GvwR5Nhpx4eThWigmhyUHC0dKOGi3z__hxI2eafiYFY3f_fz0ja6KN736b4-le-HrAuedJK6dcjcaZYg5C8KoDsE81hokBVYeb60qtBi0Q3TzJVwxc9zQ.svg',
        logoBgClass: 'bg-[#006F62]',
        stripeClass: 'from-[#006F62] via-[#0a2f2a] to-[#7fd7c6]',
        cardClass: 'border-[#006F62]/35 bg-[#061916]/85',
        firstBadgeClass: 'bg-[#006F62]/25 text-[#88d8ca] ring-1 ring-[#006F62]/45',
        secondBadgeClass: 'bg-[#7fd7c6]/20 text-[#c4f3ea] ring-1 ring-[#7fd7c6]/35',
        operatorBadgeClass: 'bg-[#3b8d84]/20 text-[#a8d5cf] ring-1 ring-[#3b8d84]/35',
    },
    {
        teamName: 'Williams Racing',
        teamNameKo: '윌리엄스',
        logoUrl:
            'https://i.namu.wiki/i/_3o71UA47IZ_42ZXND1qdnCSMIxumPka2puldLBtj_GWdt4sSG_NO1ypmlk19utgpYyL3GrTRklhhXsPFNA6Et6NzasfjBwr00pX0_xEfNNeMFeRzbP7sYzKXpuC_RHALZX9Yi-xdLQbJzjfhbqo_g.webp',
        logoBgClass: 'bg-[#005AFF]',
        stripeClass: 'from-[#005AFF] via-[#071f58] to-[#83a8ff]',
        cardClass: 'border-[#005AFF]/35 bg-[#071126]/85',
        firstBadgeClass: 'bg-[#005AFF]/20 text-[#90b4ff] ring-1 ring-[#005AFF]/40',
        secondBadgeClass: 'bg-[#83a8ff]/20 text-[#c8d9ff] ring-1 ring-[#83a8ff]/35',
        operatorBadgeClass: 'bg-[#3e64b3]/20 text-[#a8bde9] ring-1 ring-[#3e64b3]/35',
    },
    {
        teamName: 'Stake F1 Team Kick Sauber',
        teamNameKo: '자우버',
        logoUrl: 'https://i.namu.wiki/i/yDB-G-nGaehi2g-LOsEVGiFlG2eT60WGlI6C9kobXg-1i2CRW6JwzpCcvQuk1Uk5ynx8XEsXa_JasyVM4ZIvCA.svg',
        logoBgClass: 'bg-[#00E701]',
        stripeClass: 'from-[#00E701] via-[#0d3a0d] to-[#9BFF9C]',
        cardClass: 'border-[#00E701]/35 bg-[#071b08]/85',
        firstBadgeClass: 'bg-[#00E701]/20 text-[#9cff9d] ring-1 ring-[#00E701]/40',
        secondBadgeClass: 'bg-[#9BFF9C]/20 text-[#d4ffd5] ring-1 ring-[#9BFF9C]/35',
        operatorBadgeClass: 'bg-[#4c9f4d]/20 text-[#b9dfb9] ring-1 ring-[#4c9f4d]/35',
    },
    {
        teamName: 'MoneyGram Haas F1 Team',
        teamNameKo: '하스',
        logoUrl:
            'https://i.namu.wiki/i/RFItq1M97-u5kQLZ-DcU_H2c0wx4deG8BxcpBW148o2FUlCm-t1vwwo5v8tMRl0MowlVFtTTzNL11XZe096DLQ3a6QEZKV8QUpKq9edWIQb0VtQ6OBmkph7MIU2Jw1pDTi68HkN5Vv99tvCIPa9ngg.svg',
        logoBgClass: 'bg-[#A8A8A8]',
        stripeClass: 'from-[#A8A8A8] via-[#2a2a2a] to-[#ffffff]',
        cardClass: 'border-[#A8A8A8]/35 bg-[#131313]/85',
        firstBadgeClass: 'bg-[#A8A8A8]/20 text-[#dedede] ring-1 ring-[#A8A8A8]/40',
        secondBadgeClass: 'bg-[#ffffff]/15 text-[#f3f3f3] ring-1 ring-[#ffffff]/30',
        operatorBadgeClass: 'bg-[#8f8f8f]/20 text-[#cccccc] ring-1 ring-[#8f8f8f]/35',
    },
]

function toDriverRole(info: Record<string, unknown>): F1DriverRole {
    return info.driverRole === 'SECOND' ? 'SECOND' : 'FIRST'
}

function toNormalizedPlayers(response: PublicTournamentPlayersResponse): NormalizedPlayer[] {
    return [...response.players]
        .sort((a, b) => a.order - b.order)
        .map((player) => {
            const info = typeof player.info === 'object' && player.info !== null ? (player.info as Record<string, unknown>) : {}
            return {
                id: player.id,
                nickname: player.nickname,
                avatarUrl: player.avatarUrl,
                isPartner: player.isPartner,
                driverRole: toDriverRole(info),
                qualifyingEliminated: player.qualifyingEliminated ?? info.qualifyingEliminated === true,
            }
        })
}

function toDraftDriver(player: NormalizedPlayer | undefined, role: F1DriverRole, index: number): F1DraftTeamDriver {
    if (player === undefined) {
        return {
            driverId: `placeholder-${role}-${index}`,
            name: role === 'FIRST' ? '퍼스트 미정' : '세컨드 미정',
            avatarUrl: null,
            isPartner: false,
            driverRole: role,
        }
    }
    return {
        driverId: String(player.id),
        name: player.nickname,
        avatarUrl: player.avatarUrl,
        isPartner: player.isPartner,
        driverRole: role,
    }
}

function toDraftDriverById({
    playerId,
    role,
    index,
    playersById,
}: {
    readonly playerId: number
    readonly role: F1DriverRole
    readonly index: number
    readonly playersById: ReadonlyMap<number, NormalizedPlayer>
}): {
    readonly driver: F1DraftTeamDriver
    readonly missingId: number | null
} {
    const matched = playersById.get(playerId)
    if (matched !== undefined) {
        return {
            driver: toDraftDriver(matched, role, index),
            missingId: null,
        }
    }
    return {
        driver: toDraftDriver(undefined, role, index),
        missingId: playerId,
    }
}

function toDraftOperator(player: NormalizedPlayer | undefined): F1DraftTeamOperator | null {
    if (player === undefined) return null
    return {
        driverId: String(player.id),
        name: player.nickname,
        avatarUrl: player.avatarUrl,
        isPartner: player.isPartner,
    }
}

function toDraftOperatorById({
    playerId,
    playersById,
}: {
    readonly playerId: number
    readonly playersById: ReadonlyMap<number, NormalizedPlayer>
}): {
    readonly operator: F1DraftTeamOperator | null
    readonly missingId: number | null
} {
    const matched = playersById.get(playerId)
    if (matched !== undefined) {
        return {
            operator: toDraftOperator(matched),
            missingId: null,
        }
    }
    return {
        operator: null,
        missingId: playerId,
    }
}

export function getF1TeamThemes(): readonly TeamTheme[] {
    return TEAM_THEMES
}

export function buildF1TeamDraftContentFromAssignments({
    response,
    assignments,
}: {
    readonly response: PublicTournamentPlayersResponse
    readonly assignments: readonly F1TeamAssignmentInput[]
}): {
    readonly content: F1TeamDraftContent
    readonly comparison: F1TeamAssignmentComparison
} {
    const normalized = toNormalizedPlayers(response)
    const playersById = new Map(normalized.map((player) => [player.id, player]))
    const missingPlayerIds = new Set<number>()
    const teams = TEAM_THEMES.map((team, index) => {
        const assignment = assignments[index]
        if (assignment === undefined) {
            return {
                id: `f1-team-${index + 1}`,
                teamName: team.teamName,
                firstDriver: toDraftDriver(undefined, 'FIRST', index),
                secondDriver: toDraftDriver(undefined, 'SECOND', index),
                operator: null,
                order: index,
            }
        }
        const first = toDraftDriverById({
            playerId: assignment.firstDriverId,
            role: 'FIRST',
            index,
            playersById,
        })
        if (first.missingId !== null) {
            missingPlayerIds.add(first.missingId)
        }
        const second = toDraftDriverById({
            playerId: assignment.secondDriverId,
            role: 'SECOND',
            index,
            playersById,
        })
        if (second.missingId !== null) {
            missingPlayerIds.add(second.missingId)
        }
        const operator =
            assignment.operatorId === null || assignment.operatorId === undefined
                ? {
                      operator: null,
                      missingId: null,
                  }
                : toDraftOperatorById({
                      playerId: assignment.operatorId,
                      playersById,
                  })
        if (operator.missingId !== null) {
            missingPlayerIds.add(operator.missingId)
        }
        return {
            id: `f1-team-${index + 1}`,
            teamName: team.teamName,
            firstDriver: first.driver,
            secondDriver: second.driver,
            operator: operator.operator,
            order: index,
        }
    })
    return {
        content: { teams },
        comparison: {
            missingPlayerIds: [...missingPlayerIds],
        },
    }
}

export function buildF1TeamDraftContentFromPlayers(response: PublicTournamentPlayersResponse): F1TeamDraftContent {
    if (F1_TEAM_ASSIGNMENTS.length > 0) {
        return buildF1TeamDraftContentFromAssignments({
            response,
            assignments: F1_TEAM_ASSIGNMENTS,
        }).content
    }
    const normalized = toNormalizedPlayers(response)
    const firstQualified = normalized.filter((player) => player.driverRole === 'FIRST' && player.qualifyingEliminated === false)
    const secondQualified = normalized.filter((player) => player.driverRole === 'SECOND' && player.qualifyingEliminated === false)
    const operatorCandidates = normalized.filter((player) => player.qualifyingEliminated)

    return {
        teams: TEAM_THEMES.map((team, index) => ({
            id: `f1-team-${index + 1}`,
            teamName: team.teamName,
            firstDriver: toDraftDriver(firstQualified[index], 'FIRST', index),
            secondDriver: toDraftDriver(secondQualified[index], 'SECOND', index),
            operator: toDraftOperator(operatorCandidates[index]),
            order: index,
        })),
    }
}
