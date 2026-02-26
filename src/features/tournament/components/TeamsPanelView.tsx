import type { TournamentTeam } from '../types'

interface Props {
    title: string
    teams: TournamentTeam[]
}

const SLOT_LABEL: Record<string, string> = {
    TNK: '탱커',
    DPS: 'DPS',
    SPT: '서포터',
    HEAD_COACH: '감독',
    COACH: '코치',
}

export function TeamsPanelView({ title, teams }: Props) {
    return (
        <section className="w-full">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">{title}</h2>

            {teams.length === 0 ? (
                <p className="text-sm text-gray-400">등록된 팀이 없습니다.</p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {teams.map((team) => (
                        <div
                            key={team.id}
                            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                        >
                            {/* 팀 헤더 */}
                            <div className="flex items-center gap-3 border-b border-gray-50 bg-gray-50 px-4 py-3">
                                {team.logoUrl !== null && (
                                    <img
                                        src={team.logoUrl}
                                        alt={team.name}
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                )}
                                <span className="font-semibold text-gray-900">
                                    {team.name}
                                </span>
                            </div>

                            {/* 멤버 목록 */}
                            <ul className="divide-y divide-gray-50 px-4">
                                {team.members.map((member) => (
                                    <li
                                        key={member.id}
                                        className="flex items-center gap-3 py-2.5"
                                    >
                                        {member.avatarUrl !== null ? (
                                            <img
                                                src={member.avatarUrl}
                                                alt={member.name}
                                                className="h-7 w-7 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-7 w-7 rounded-full bg-gray-100" />
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-gray-800">
                                                {member.name}
                                            </p>
                                        </div>
                                        <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                                            {SLOT_LABEL[member.slot] ??
                                                member.slot}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}
