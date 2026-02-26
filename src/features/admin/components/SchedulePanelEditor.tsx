import { useState } from 'react'
import type {
    MatchStatus,
    ScheduleContent,
    ScheduleGroup,
    ScheduleMatch,
} from '../types'
import type { TournamentAdminTeam } from '../types'

interface SchedulePanelEditorProps {
    content: Record<string, unknown>
    teams: TournamentAdminTeam[]
    onSave: (content: ScheduleContent) => Promise<void>
    isSaving: boolean
}

function parseScheduleContent(raw: Record<string, unknown>): ScheduleContent {
    return {
        groups: Array.isArray(raw.groups)
            ? (raw.groups as ScheduleGroup[])
            : [],
    }
}

const MATCH_STATUS_LABELS: Record<MatchStatus, string> = {
    SCHEDULED: '예정',
    COMPLETED: '완료',
    CANCELLED: '취소',
}

export function SchedulePanelEditor({
    content,
    teams,
    onSave,
    isSaving,
}: SchedulePanelEditorProps) {
    const parsed = parseScheduleContent(content)
    const [groups, setGroups] = useState<ScheduleGroup[]>(parsed.groups)

    // ── 그룹 조작 ──────────────────────────────────────────
    function handleAddGroup() {
        const next: ScheduleGroup = {
            id: crypto.randomUUID(),
            title: `${groups.length + 1}라운드`,
            groupDate: null,
            order: groups.length,
            matches: [],
        }
        setGroups((prev) => [...prev, next])
    }

    function handleRemoveGroup(groupId: string) {
        if (!confirm('이 경기 그룹을 삭제할까요?')) return
        setGroups((prev) =>
            prev
                .filter((g) => g.id !== groupId)
                .map((g, i) => ({ ...g, order: i })),
        )
    }

    function handleUpdateGroup(
        groupId: string,
        field: keyof Pick<ScheduleGroup, 'title' | 'groupDate'>,
        value: string,
    ) {
        setGroups((prev) =>
            prev.map((g) =>
                g.id === groupId
                    ? { ...g, [field]: value.trim().length > 0 ? value : null }
                    : g,
            ),
        )
    }

    // ── 경기 조작 ──────────────────────────────────────────
    function handleAddMatch(groupId: string) {
        if (teams.length < 2) return
        setGroups((prev) =>
            prev.map((g) => {
                if (g.id !== groupId) return g
                const next: ScheduleMatch = {
                    id: crypto.randomUUID(),
                    teamAId: teams[0]?.id ?? 0,
                    teamBId: teams[1]?.id ?? 0,
                    mvpPlayerId: null,
                    status: 'SCHEDULED',
                    scoreA: null,
                    scoreB: null,
                    order: g.matches.length,
                }
                return { ...g, matches: [...g.matches, next] }
            }),
        )
    }

    function handleRemoveMatch(groupId: string, matchId: string) {
        setGroups((prev) =>
            prev.map((g) => {
                if (g.id !== groupId) return g
                return {
                    ...g,
                    matches: g.matches
                        .filter((m) => m.id !== matchId)
                        .map((m, i) => ({ ...m, order: i })),
                }
            }),
        )
    }

    function handleUpdateMatch(
        groupId: string,
        matchId: string,
        patch: Partial<ScheduleMatch>,
    ) {
        setGroups((prev) =>
            prev.map((g) => {
                if (g.id !== groupId) return g
                return {
                    ...g,
                    matches: g.matches.map((m) =>
                        m.id === matchId ? { ...m, ...patch } : m,
                    ),
                }
            }),
        )
    }

    async function handleSave() {
        await onSave({ groups })
    }

    function getMvpCandidates(match: ScheduleMatch) {
        const validTeamIds = new Set<number>([match.teamAId, match.teamBId])
        return teams
            .filter((team) => validTeamIds.has(team.id))
            .flatMap((team) =>
                team.members
                    .filter(
                        (member) =>
                            member.slot !== 'HEAD_COACH' &&
                            member.slot !== 'COACH',
                    )
                    .map((member) => ({
                        id: member.id,
                        name: member.name,
                        teamName: team.name,
                    })),
            )
    }

    if (teams.length < 2) {
        return (
            <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-900/10">
                <p className="text-xs text-amber-600 dark:text-amber-400">
                    일정 구성을 위해 팀이 2개 이상 필요합니다. 먼저 팀을
                    추가해주세요.
                </p>
            </div>
        )
    }

    return (
        <div className="mt-3 space-y-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-[#2e2e38] dark:bg-[#20202a]">
            {/* 경기 그룹 목록 */}
            {groups.length > 0 ? (
                <div className="space-y-4">
                    {groups.map((group) => (
                        <div
                            key={group.id}
                            className="rounded-xl border border-gray-200 bg-white p-4 dark:border-[#2e2e38] dark:bg-[#1a1a23]"
                        >
                            {/* 그룹 헤더 */}
                            <div className="mb-3 flex items-center gap-2">
                                <input
                                    type="text"
                                    value={group.title}
                                    onChange={(e) =>
                                        handleUpdateGroup(
                                            group.id,
                                            'title',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="그룹/라운드 이름"
                                    className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                />
                                <input
                                    type="date"
                                    value={group.groupDate ?? ''}
                                    onChange={(e) =>
                                        handleUpdateGroup(
                                            group.id,
                                            'groupDate',
                                            e.target.value,
                                        )
                                    }
                                    className="w-38 rounded-lg border border-gray-300 px-2 py-1.5 text-xs dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveGroup(group.id)}
                                    className="shrink-0 text-xs text-gray-400 transition hover:text-red-500 dark:text-[#6b6b7a]"
                                >
                                    그룹 삭제
                                </button>
                            </div>

                            {/* 경기 목록 */}
                            {group.matches.length > 0 ? (
                                <div className="mb-3 space-y-2">
                                    {group.matches.map((match) => {
                                        const mvpCandidates =
                                            getMvpCandidates(match)
                                        return (
                                            <div
                                                key={match.id}
                                                className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-[#2e2e38] dark:bg-[#20202a]"
                                            >
                                                {/* 팀 A vs 팀 B */}
                                                <div className="mb-2 flex items-center gap-2">
                                                    <select
                                                        value={match.teamAId}
                                                        onChange={(e) =>
                                                            handleUpdateMatch(
                                                                group.id,
                                                                match.id,
                                                                {
                                                                    teamAId:
                                                                        Number(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ),
                                                                },
                                                            )
                                                        }
                                                        className="flex-1 rounded-lg border border-gray-300 px-2 py-1.5 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                                    >
                                                        {teams.map((t) => (
                                                            <option
                                                                key={t.id}
                                                                value={t.id}
                                                            >
                                                                {t.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <span className="shrink-0 text-xs font-bold text-gray-400 dark:text-[#6b6b7a]">
                                                        VS
                                                    </span>
                                                    <select
                                                        value={match.teamBId}
                                                        onChange={(e) =>
                                                            handleUpdateMatch(
                                                                group.id,
                                                                match.id,
                                                                {
                                                                    teamBId:
                                                                        Number(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ),
                                                                },
                                                            )
                                                        }
                                                        className="flex-1 rounded-lg border border-gray-300 px-2 py-1.5 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                                    >
                                                        {teams.map((t) => (
                                                            <option
                                                                key={t.id}
                                                                value={t.id}
                                                            >
                                                                {t.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveMatch(
                                                                group.id,
                                                                match.id,
                                                            )
                                                        }
                                                        className="shrink-0 text-gray-300 transition hover:text-red-400 dark:text-[#3a3a44] dark:hover:text-red-500"
                                                        aria-label="경기 삭제"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2">
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        value={
                                                            match.scoreA ?? ''
                                                        }
                                                        onChange={(e) =>
                                                            handleUpdateMatch(
                                                                group.id,
                                                                match.id,
                                                                {
                                                                    scoreA:
                                                                        e.target
                                                                            .value
                                                                            .length >
                                                                        0
                                                                            ? Number(
                                                                                  e
                                                                                      .target
                                                                                      .value,
                                                                              )
                                                                            : null,
                                                                },
                                                            )
                                                        }
                                                        placeholder="A 스코어"
                                                        className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-center text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                                    />
                                                    <span className="text-xs text-gray-400">
                                                        :
                                                    </span>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        value={
                                                            match.scoreB ?? ''
                                                        }
                                                        onChange={(e) =>
                                                            handleUpdateMatch(
                                                                group.id,
                                                                match.id,
                                                                {
                                                                    scoreB:
                                                                        e.target
                                                                            .value
                                                                            .length >
                                                                        0
                                                                            ? Number(
                                                                                  e
                                                                                      .target
                                                                                      .value,
                                                                              )
                                                                            : null,
                                                                },
                                                            )
                                                        }
                                                        placeholder="B 스코어"
                                                        className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-center text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                                    />
                                                    <select
                                                        value={match.status}
                                                        onChange={(e) =>
                                                            handleUpdateMatch(
                                                                group.id,
                                                                match.id,
                                                                {
                                                                    status: e
                                                                        .target
                                                                        .value as MatchStatus,
                                                                },
                                                            )
                                                        }
                                                        className="rounded-lg border border-gray-300 px-2 py-1 text-xs dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                                    >
                                                        {(
                                                            Object.entries(
                                                                MATCH_STATUS_LABELS,
                                                            ) as [
                                                                MatchStatus,
                                                                string,
                                                            ][]
                                                        ).map(
                                                            ([val, label]) => (
                                                                <option
                                                                    key={val}
                                                                    value={val}
                                                                >
                                                                    {label}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                    <select
                                                        value={
                                                            match.mvpPlayerId ??
                                                            ''
                                                        }
                                                        onChange={(e) =>
                                                            handleUpdateMatch(
                                                                group.id,
                                                                match.id,
                                                                {
                                                                    mvpPlayerId:
                                                                        e.target
                                                                            .value
                                                                            .length >
                                                                        0
                                                                            ? Number(
                                                                                  e
                                                                                      .target
                                                                                      .value,
                                                                              )
                                                                            : null,
                                                                },
                                                            )
                                                        }
                                                        className="rounded-lg border border-gray-300 px-2 py-1 text-xs dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                                    >
                                                        <option value="">
                                                            MVP 미선택
                                                        </option>
                                                        {mvpCandidates.map(
                                                            (player) => (
                                                                <option
                                                                    key={
                                                                        player.id
                                                                    }
                                                                    value={
                                                                        player.id
                                                                    }
                                                                >
                                                                    {
                                                                        player.name
                                                                    }{' '}
                                                                    (
                                                                    {
                                                                        player.teamName
                                                                    }
                                                                    )
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <p className="mb-3 text-center text-xs text-gray-400 dark:text-[#6b6b7a]">
                                    경기가 없습니다.
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={() => handleAddMatch(group.id)}
                                className="w-full rounded-lg border border-dashed border-gray-300 py-1.5 text-xs text-gray-400 transition hover:border-blue-400 hover:text-blue-500 dark:border-[#3a3a44] dark:hover:border-blue-700 dark:hover:text-blue-400"
                            >
                                + 경기 추가
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-xs text-gray-400 dark:text-[#6b6b7a]">
                    경기 그룹이 없습니다.
                </p>
            )}

            {/* 그룹 추가 버튼 */}
            <button
                type="button"
                onClick={handleAddGroup}
                className="w-full rounded-xl border border-dashed border-gray-300 py-2 text-xs font-medium text-gray-400 transition hover:border-blue-400 hover:text-blue-500 dark:border-[#3a3a44] dark:hover:border-blue-700 dark:hover:text-blue-400"
            >
                + 경기 그룹 추가
            </button>

            {/* 저장 */}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => {
                        void handleSave()
                    }}
                    disabled={isSaving}
                    className="rounded-lg bg-blue-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
                >
                    {isSaving ? '저장 중...' : '일정 저장'}
                </button>
            </div>
        </div>
    )
}
