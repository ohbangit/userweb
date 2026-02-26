import type { TournamentTeam } from '../types'

interface Props {
    title: string
    teams: TournamentTeam[]
}

const SLOT_LABEL: Record<string, string> = {
    TNK: '탱커',
    DPS: '딜러',
    SPT: '서포터',
    HEAD_COACH: '감독',
    COACH: '코치',
}

export function PlayerListPanelView({ title, teams }: Props) {
    const players = teams
        .flatMap((team) =>
            team.members.map((member) => ({
                ...member,
                teamId: team.id,
                teamName: team.name,
                teamLogoUrl: team.logoUrl,
            })),
        )
        .filter(
            (member) => member.slot !== 'HEAD_COACH' && member.slot !== 'COACH',
        )

    return (
        <section className="w-full">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">{title}</h2>

            {players.length === 0 ? (
                <p className="text-sm text-gray-400">등록된 선수가 없습니다.</p>
            ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {players.map((player) => (
                        <div
                            key={`${player.teamId}-${player.id}`}
                            className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
                        >
                            <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
                                {player.teamLogoUrl !== null ? (
                                    <img
                                        src={player.teamLogoUrl}
                                        alt={player.teamName}
                                        className="h-5 w-5 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="h-5 w-5 rounded-full bg-gray-100" />
                                )}
                                <span className="truncate">
                                    {player.teamName}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                {player.avatarUrl !== null ? (
                                    <img
                                        src={player.avatarUrl}
                                        alt={player.name}
                                        className="h-9 w-9 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="h-9 w-9 rounded-full bg-gray-100" />
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-gray-800">
                                        {player.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {SLOT_LABEL[player.slot] ?? player.slot}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}
