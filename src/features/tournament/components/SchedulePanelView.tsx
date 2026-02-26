import type { ScheduleContent, ScheduleMatch, TournamentTeam } from '../types'

interface Props {
    title: string
    content: ScheduleContent
    teams: TournamentTeam[]
}

function getTeamName(teams: TournamentTeam[], teamId: number): string {
    return teams.find((t) => t.id === teamId)?.name ?? `팀 #${teamId}`
}

function getTeamLogo(teams: TournamentTeam[], teamId: number): string | null {
    return teams.find((t) => t.id === teamId)?.logoUrl ?? null
}

function getMemberInfo(teams: TournamentTeam[], memberId: number) {
    for (const team of teams) {
        const member = team.members.find((item) => item.id === memberId)
        if (member !== undefined) {
            return {
                name: member.name,
                teamName: team.name,
            }
        }
    }
    return null
}

interface MatchCardProps {
    match: ScheduleMatch
    teams: TournamentTeam[]
}

function MatchCard({ match, teams }: MatchCardProps) {
    const isCompleted = match.status === 'COMPLETED'
    const scoreA = match.scoreA ?? 0
    const scoreB = match.scoreB ?? 0
    const teamAWon = isCompleted && scoreA > scoreB
    const teamBWon = isCompleted && scoreB > scoreA

    const logoA = getTeamLogo(teams, match.teamAId)
    const logoB = getTeamLogo(teams, match.teamBId)
    const mvpInfo =
        match.mvpPlayerId !== null
            ? getMemberInfo(teams, match.mvpPlayerId)
            : null

    return (
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
                {/* 팀 A */}
                <div
                    className={`flex flex-1 flex-col items-center gap-1 ${teamAWon ? 'opacity-100' : isCompleted ? 'opacity-50' : ''}`}
                >
                    {logoA !== null && (
                        <img
                            src={logoA}
                            alt={getTeamName(teams, match.teamAId)}
                            className="h-8 w-8 rounded-full object-cover"
                        />
                    )}
                    <span className="text-center text-xs font-medium text-gray-800 sm:text-sm">
                        {getTeamName(teams, match.teamAId)}
                    </span>
                </div>

                {/* 스코어 */}
                <div className="flex shrink-0 items-center gap-2">
                    {isCompleted ? (
                        <>
                            <span
                                className={`text-xl font-bold ${teamAWon ? 'text-blue-600' : 'text-gray-400'}`}
                            >
                                {scoreA}
                            </span>
                            <span className="text-gray-300">:</span>
                            <span
                                className={`text-xl font-bold ${teamBWon ? 'text-blue-600' : 'text-gray-400'}`}
                            >
                                {scoreB}
                            </span>
                        </>
                    ) : (
                        <span className="text-sm font-medium text-gray-400">
                            vs
                        </span>
                    )}
                </div>

                {/* 팀 B */}
                <div
                    className={`flex flex-1 flex-col items-center gap-1 ${teamBWon ? 'opacity-100' : isCompleted ? 'opacity-50' : ''}`}
                >
                    {logoB !== null && (
                        <img
                            src={logoB}
                            alt={getTeamName(teams, match.teamBId)}
                            className="h-8 w-8 rounded-full object-cover"
                        />
                    )}
                    <span className="text-center text-xs font-medium text-gray-800 sm:text-sm">
                        {getTeamName(teams, match.teamBId)}
                    </span>
                </div>
            </div>
            {mvpInfo !== null && (
                <p className="mt-3 text-center text-xs font-medium text-amber-600">
                    MVP: {mvpInfo.name} ({mvpInfo.teamName})
                </p>
            )}
        </div>
    )
}

export function SchedulePanelView({ title, content, teams }: Props) {
    const sortedGroups = [...content.groups].sort((a, b) => a.order - b.order)

    return (
        <section className="w-full">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">{title}</h2>

            {sortedGroups.length === 0 ? (
                <p className="text-sm text-gray-400">등록된 일정이 없습니다.</p>
            ) : (
                <div className="flex flex-col gap-8">
                    {sortedGroups.map((group) => {
                        const sortedMatches = [...group.matches].sort(
                            (a, b) => a.order - b.order,
                        )
                        return (
                            <div key={group.id}>
                                {/* 그룹 헤더 */}
                                <div className="mb-3 flex items-baseline gap-3">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {group.title}
                                    </h3>
                                    {group.groupDate !== null && (
                                        <span className="text-sm text-gray-400">
                                            {new Date(
                                                group.groupDate,
                                            ).toLocaleDateString('ko-KR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    )}
                                </div>

                                {/* 경기 카드 그리드 */}
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {sortedMatches.map((match) => (
                                        <MatchCard
                                            key={match.id}
                                            match={match}
                                            teams={teams}
                                        />
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </section>
    )
}
