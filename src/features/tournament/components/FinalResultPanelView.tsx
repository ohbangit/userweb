import type { FinalResultContent, TournamentTeam } from '../types'

interface Props {
    title: string
    content: FinalResultContent
    teams: TournamentTeam[]
}

function getTeam(
    teams: TournamentTeam[],
    teamId: number,
): TournamentTeam | undefined {
    return teams.find((t) => t.id === teamId)
}

const MEDAL: Record<number, string> = {
    1: '🥇',
    2: '🥈',
    3: '🥉',
}

export function FinalResultPanelView({ title, content, teams }: Props) {
    const sorted = [...content.standings].sort((a, b) => a.rank - b.rank)

    return (
        <section className="w-full">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">{title}</h2>

            {sorted.length === 0 ? (
                <p className="text-sm text-gray-400">
                    최종 결과가 아직 없습니다.
                </p>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    {/* 테이블 헤더 */}
                    <div className="grid grid-cols-[3rem_1fr_3rem_3rem_3rem] items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3 text-xs font-medium text-gray-500 sm:grid-cols-[3rem_1fr_4rem_4rem_4rem]">
                        <span className="text-center">순위</span>
                        <span>팀</span>
                        <span className="text-center">승</span>
                        <span className="text-center">패</span>
                        <span className="text-center">점수</span>
                    </div>

                    {/* 테이블 로우 */}
                    <ul className="divide-y divide-gray-50">
                        {sorted.map((entry) => {
                            const team = getTeam(teams, entry.teamId)
                            return (
                                <li
                                    key={entry.teamId}
                                    className={`grid grid-cols-[3rem_1fr_3rem_3rem_3rem] items-center gap-2 px-4 py-3 sm:grid-cols-[3rem_1fr_4rem_4rem_4rem] ${entry.rank === 1 ? 'bg-yellow-50' : ''}`}
                                >
                                    {/* 순위 */}
                                    <span className="text-center text-base">
                                        {MEDAL[entry.rank] !== undefined ? (
                                            MEDAL[entry.rank]
                                        ) : (
                                            <span className="font-bold text-gray-600">
                                                {entry.rank}
                                            </span>
                                        )}
                                    </span>

                                    {/* 팀 */}
                                    <div className="flex min-w-0 items-center gap-2">
                                        {team?.logoUrl !== undefined &&
                                            team.logoUrl !== null && (
                                                <img
                                                    src={team.logoUrl}
                                                    alt={team.name}
                                                    className="h-6 w-6 shrink-0 rounded-full object-cover"
                                                />
                                            )}
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-gray-900">
                                                {team?.name ??
                                                    `팀 #${entry.teamId}`}
                                            </p>
                                            {entry.note.length > 0 && (
                                                <p className="truncate text-xs text-gray-400">
                                                    {entry.note}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* 승 */}
                                    <span className="text-center text-sm font-medium text-green-600">
                                        {entry.wins ?? '-'}
                                    </span>

                                    {/* 패 */}
                                    <span className="text-center text-sm font-medium text-red-500">
                                        {entry.losses ?? '-'}
                                    </span>

                                    {/* 점수 */}
                                    <span className="text-center text-sm font-bold text-gray-800">
                                        {entry.points ?? '-'}
                                    </span>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}
        </section>
    )
}
