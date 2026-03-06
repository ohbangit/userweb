import { useState } from 'react'
import type { MatchStatus, OverwatchSetMap, ScheduleContent, ScheduleGroup, ScheduleMatch, TournamentOverwatchMapType } from '../types'
import type { TournamentAdminTeam } from '../types'

interface SchedulePanelEditorProps {
    content: Record<string, unknown>
    teams: TournamentAdminTeam[]
    onSave: (content: ScheduleContent) => Promise<void>
    isSaving: boolean
    isOverwatch?: boolean
}

const OVERWATCH_MAP_TYPES: readonly TournamentOverwatchMapType[] = ['쟁탈', '혼합', '밀기', '호위', '플레시포인트'] as const

const TOURNAMENT_OVERWATCH_MAP_OPTIONS: Record<TournamentOverwatchMapType, readonly string[]> = {
    쟁탈: ['남극반도', '네팔', '리장타워', '부산', '오아시스', '일리오스', '사모아'],
    혼합: ['눔바니', '미드타운', '블리자드월드', '아이헨발데', '할리우드', '파라이수', '왕의 길'],
    밀기: ['루나사피', '콜로세오', '이스페란사', '뉴 퀸 스트리트'],
    호위: ['66번 국도', '감시기지:지브롤터', '도라도', '리알토', '서킷 로얄', '삼발리 수도원', '쓰레기촌', '하바나'],
    플레시포인트: ['뉴 정크 시티', '수라바사', '아틀리스'],
}

const TOURNAMENT_OVERWATCH_MAP_ENTRIES = OVERWATCH_MAP_TYPES.flatMap((mapType) =>
    TOURNAMENT_OVERWATCH_MAP_OPTIONS[mapType].map((mapName) => ({
        mapType,
        mapName,
    })),
)

const TOURNAMENT_MAP_TYPE_BY_MAP_NAME: Record<string, TournamentOverwatchMapType> = TOURNAMENT_OVERWATCH_MAP_ENTRIES.reduce<
    Record<string, TournamentOverwatchMapType>
>((acc, entry) => {
    acc[entry.mapName] = entry.mapType
    return acc
}, {})

function toOverwatchMapType(value: unknown): TournamentOverwatchMapType | null {
    if (typeof value !== 'string') return null
    return OVERWATCH_MAP_TYPES.includes(value as TournamentOverwatchMapType) ? (value as TournamentOverwatchMapType) : null
}

function inferMapTypeFromMapName(mapName: string | null): TournamentOverwatchMapType | null {
    if (mapName === null) return null
    return TOURNAMENT_MAP_TYPE_BY_MAP_NAME[mapName] ?? null
}

function createDefaultSetMap(setNumber: number): OverwatchSetMap {
    return {
        setNumber,
        mapType: '쟁탈',
        mapName: null,
        scoreA: null,
        scoreB: null,
    }
}

function toSetMaps(match: Record<string, unknown>): OverwatchSetMap[] {
    if (Array.isArray(match.setMaps)) {
        return match.setMaps
            .map((value, index) => {
                if (typeof value !== 'object' || value === null) return null
                const set = value as Record<string, unknown>
                return {
                    setNumber: typeof set.setNumber === 'number' ? set.setNumber : index + 1,
                    mapType:
                        toOverwatchMapType(set.mapType) ??
                        inferMapTypeFromMapName(typeof set.mapName === 'string' ? set.mapName : null) ??
                        '쟁탈',
                    mapName: typeof set.mapName === 'string' ? set.mapName : null,
                    scoreA: typeof set.scoreA === 'number' ? set.scoreA : null,
                    scoreB: typeof set.scoreB === 'number' ? set.scoreB : null,
                }
            })
            .filter((set): set is OverwatchSetMap => set !== null)
    }

    const fallbackType = toOverwatchMapType(match.mapType)
    const fallbackName = typeof match.mapName === 'string' ? match.mapName : null

    if (fallbackType !== null || fallbackName !== null) {
        return [
            {
                setNumber: 1,
                mapType: fallbackType ?? inferMapTypeFromMapName(fallbackName) ?? '쟁탈',
                mapName: fallbackName,
                scoreA: null,
                scoreB: null,
            },
        ]
    }

    return []
}

function parseScheduleContent(raw: Record<string, unknown>): ScheduleContent {
    const rawGroups = Array.isArray(raw.groups) ? raw.groups : []
    return {
        groups: rawGroups.map((g: unknown) => {
            const group = g as Record<string, unknown>
            const rawMatches = Array.isArray(group.matches) ? (group.matches as unknown[]) : []
            return {
                ...group,
                matches: rawMatches.map((m: unknown) => {
                    const match = m as Record<string, unknown>
                    return {
                        ...match,
                        mvpPlayerIds: Array.isArray(match.mvpPlayerIds) ? (match.mvpPlayerIds as number[]) : [],
                        mapType: toOverwatchMapType(match.mapType),
                        mapName: typeof match.mapName === 'string' ? match.mapName : null,
                        setMaps: toSetMaps(match),
                    } as ScheduleMatch
                }),
            } as ScheduleGroup
        }),
    }
}

const MATCH_STATUS_LABELS: Record<MatchStatus, string> = {
    SCHEDULED: '예정',
    COMPLETED: '완료',
    CANCELLED: '취소',
}

export function SchedulePanelEditor({ content, teams, onSave, isSaving, isOverwatch = false }: SchedulePanelEditorProps) {
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
        setGroups((prev) => prev.filter((g) => g.id !== groupId).map((g, i) => ({ ...g, order: i })))
    }

    function handleUpdateGroup(groupId: string, field: keyof Pick<ScheduleGroup, 'title' | 'groupDate'>, value: string) {
        setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, [field]: value.trim().length > 0 ? value : null } : g)))
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
                    mvpPlayerIds: [],
                    status: 'SCHEDULED',
                    scoreA: null,
                    scoreB: null,
                    ...(isOverwatch && {
                        mapType: '쟁탈' as TournamentOverwatchMapType,
                        mapName: null,
                        setMaps: [],
                    }),
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
                    matches: g.matches.filter((m) => m.id !== matchId).map((m, i) => ({ ...m, order: i })),
                }
            }),
        )
    }

    function handleUpdateMatch(groupId: string, matchId: string, patch: Partial<ScheduleMatch>) {
        setGroups((prev) =>
            prev.map((g) => {
                if (g.id !== groupId) return g
                return {
                    ...g,
                    matches: g.matches.map((m) => (m.id === matchId ? { ...m, ...patch } : m)),
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
                    .filter((member) => member.slot !== 'HEAD_COACH' && member.slot !== 'COACH')
                    .map((member) => ({
                        id: member.id,
                        name: member.name,
                        teamName: team.name,
                    })),
            )
    }

    function upsertSetMap(match: ScheduleMatch, setIndex: number, patch: Partial<OverwatchSetMap>): OverwatchSetMap[] {
        const next = [...(match.setMaps ?? [])]
        const current = next[setIndex] ?? createDefaultSetMap(setIndex + 1)
        next[setIndex] = {
            ...current,
            ...patch,
            setNumber: setIndex + 1,
        }
        return next.map((setMap, index) => ({
            ...setMap,
            setNumber: index + 1,
        }))
    }

    if (teams.length < 2) {
        return (
            <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-900/10">
                <p className="text-xs text-amber-600 dark:text-amber-400">
                    일정 구성을 위해 팀이 2개 이상 필요합니다. 먼저 팀을 추가해주세요.
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
                                    onChange={(e) => handleUpdateGroup(group.id, 'title', e.target.value)}
                                    placeholder="그룹/라운드 이름"
                                    className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                />
                                <input
                                    type="date"
                                    value={group.groupDate ?? ''}
                                    onChange={(e) => handleUpdateGroup(group.id, 'groupDate', e.target.value)}
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
                                        const mvpCandidates = getMvpCandidates(match)
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
                                                            handleUpdateMatch(group.id, match.id, {
                                                                teamAId: Number(e.target.value),
                                                            })
                                                        }
                                                        className="flex-1 rounded-lg border border-gray-300 px-2 py-1.5 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                                    >
                                                        {teams.map((t) => (
                                                            <option key={t.id} value={t.id}>
                                                                {t.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <span className="shrink-0 text-xs font-bold text-gray-400 dark:text-[#6b6b7a]">VS</span>
                                                    <select
                                                        value={match.teamBId}
                                                        onChange={(e) =>
                                                            handleUpdateMatch(group.id, match.id, {
                                                                teamBId: Number(e.target.value),
                                                            })
                                                        }
                                                        className="flex-1 rounded-lg border border-gray-300 px-2 py-1.5 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                                    >
                                                        {teams.map((t) => (
                                                            <option key={t.id} value={t.id}>
                                                                {t.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveMatch(group.id, match.id)}
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
                                                        value={match.scoreA ?? ''}
                                                        onChange={(e) =>
                                                            handleUpdateMatch(group.id, match.id, {
                                                                scoreA: e.target.value.length > 0 ? Number(e.target.value) : null,
                                                            })
                                                        }
                                                        placeholder="A 스코어"
                                                        className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-center text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                                    />
                                                    <span className="text-xs text-gray-400">:</span>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        value={match.scoreB ?? ''}
                                                        onChange={(e) =>
                                                            handleUpdateMatch(group.id, match.id, {
                                                                scoreB: e.target.value.length > 0 ? Number(e.target.value) : null,
                                                            })
                                                        }
                                                        placeholder="B 스코어"
                                                        className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-center text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                                    />
                                                    <select
                                                        value={match.status}
                                                        onChange={(e) =>
                                                            handleUpdateMatch(group.id, match.id, {
                                                                status: e.target.value as MatchStatus,
                                                            })
                                                        }
                                                        className="rounded-lg border border-gray-300 px-2 py-1 text-xs dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                                    >
                                                        {(Object.entries(MATCH_STATUS_LABELS) as [MatchStatus, string][]).map(
                                                            ([val, label]) => (
                                                                <option key={val} value={val}>
                                                                    {label}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                    <div className="mt-2 w-full rounded-lg border border-gray-200 bg-white p-2.5 dark:border-[#2e2e38] dark:bg-[#1b1b24]">
                                                        <div className="mb-2 flex items-center justify-between">
                                                            <p className="text-[11px] font-semibold text-gray-500 dark:text-[#8f8fa3]">
                                                                세트별 설정
                                                            </p>
                                                            <span className="rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-500 dark:border-[#333341] dark:bg-[#23232e] dark:text-[#8f8fa3]">
                                                                {match.mvpPlayerIds.length}세트
                                                            </span>
                                                        </div>

                                                        {match.mvpPlayerIds.length === 0 ? (
                                                            <p className="rounded-md border border-dashed border-gray-200 bg-gray-50 px-2 py-1.5 text-[11px] text-gray-400 dark:border-[#333341] dark:bg-[#23232e] dark:text-[#6b6b7a]">
                                                                아직 세트 설정이 없습니다.
                                                            </p>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                {match.mvpPlayerIds.map((playerId, setIndex) => (
                                                                    <div
                                                                        key={setIndex}
                                                                        className="rounded-md border border-gray-200 bg-gray-50 px-2 py-2 dark:border-[#333341] dark:bg-[#23232e]"
                                                                    >
                                                                        <div className="mb-1.5 flex items-center justify-between">
                                                                            <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-300">
                                                                                SET {setIndex + 1}
                                                                            </span>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    const nextSetMaps = match.setMaps?.filter(
                                                                                        (_, i) => i !== setIndex,
                                                                                    )
                                                                                    handleUpdateMatch(group.id, match.id, {
                                                                                        mvpPlayerIds: match.mvpPlayerIds.filter(
                                                                                            (_, i) => i !== setIndex,
                                                                                        ),
                                                                                        ...(isOverwatch && {
                                                                                            setMaps:
                                                                                                nextSetMaps?.map((setMap, i) => ({
                                                                                                    ...setMap,
                                                                                                    setNumber: i + 1,
                                                                                                })) ?? [],
                                                                                        }),
                                                                                    })
                                                                                }}
                                                                                className="cursor-pointer rounded px-1 py-0.5 text-[10px] text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:text-[#6b6b7a] dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                                                            >
                                                                                삭제
                                                                            </button>
                                                                        </div>

                                                                        <div className="flex flex-wrap items-end gap-2">
                                                                            {isOverwatch && (
                                                                                <label className="min-w-[230px] flex-1 space-y-1">
                                                                                    <span className="block text-[10px] text-gray-400 dark:text-[#6b6b7a]">
                                                                                        맵
                                                                                    </span>
                                                                                    <select
                                                                                        value={match.setMaps?.[setIndex]?.mapName ?? ''}
                                                                                        onChange={(e) =>
                                                                                            (() => {
                                                                                                const mapName =
                                                                                                    e.target.value.length > 0
                                                                                                        ? e.target.value
                                                                                                        : null
                                                                                                const inferredType =
                                                                                                    inferMapTypeFromMapName(mapName)
                                                                                                handleUpdateMatch(group.id, match.id, {
                                                                                                    setMaps: upsertSetMap(match, setIndex, {
                                                                                                        mapName,
                                                                                                        ...(inferredType !== null && {
                                                                                                            mapType: inferredType,
                                                                                                        }),
                                                                                                    }),
                                                                                                })
                                                                                            })()
                                                                                        }
                                                                                        className="cursor-pointer w-full rounded border border-gray-300 px-2 py-1 text-xs dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                                                                    >
                                                                                        <option value="">TBD</option>
                                                                                        {TOURNAMENT_OVERWATCH_MAP_ENTRIES.map((entry) => (
                                                                                            <option
                                                                                                key={entry.mapName}
                                                                                                value={entry.mapName}
                                                                                            >
                                                                                                {entry.mapName}
                                                                                            </option>
                                                                                        ))}
                                                                                    </select>
                                                                                </label>
                                                                            )}

                                                                            {isOverwatch && (
                                                                                <label className="min-w-[140px] space-y-1">
                                                                                    <span className="block text-[10px] text-gray-400 dark:text-[#6b6b7a]">
                                                                                        세트 스코어
                                                                                    </span>
                                                                                    <div className="flex items-center gap-1.5">
                                                                                        <input
                                                                                            type="number"
                                                                                            min={0}
                                                                                            value={match.setMaps?.[setIndex]?.scoreA ?? ''}
                                                                                            onChange={(e) =>
                                                                                                handleUpdateMatch(group.id, match.id, {
                                                                                                    setMaps: upsertSetMap(match, setIndex, {
                                                                                                        scoreA:
                                                                                                            e.target.value.length > 0
                                                                                                                ? Number(e.target.value)
                                                                                                                : null,
                                                                                                    }),
                                                                                                })
                                                                                            }
                                                                                            className="w-14 rounded border border-gray-300 px-2 py-1 text-center text-xs dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                                                                        />
                                                                                        <span className="text-xs text-gray-400 dark:text-[#6b6b7a]">
                                                                                            :
                                                                                        </span>
                                                                                        <input
                                                                                            type="number"
                                                                                            min={0}
                                                                                            value={match.setMaps?.[setIndex]?.scoreB ?? ''}
                                                                                            onChange={(e) =>
                                                                                                handleUpdateMatch(group.id, match.id, {
                                                                                                    setMaps: upsertSetMap(match, setIndex, {
                                                                                                        scoreB:
                                                                                                            e.target.value.length > 0
                                                                                                                ? Number(e.target.value)
                                                                                                                : null,
                                                                                                    }),
                                                                                                })
                                                                                            }
                                                                                            className="w-14 rounded border border-gray-300 px-2 py-1 text-center text-xs dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                                                                        />
                                                                                    </div>
                                                                                </label>
                                                                            )}

                                                                            <label className="min-w-[190px] flex-1 space-y-1">
                                                                                <span className="block text-[10px] text-gray-400 dark:text-[#6b6b7a]">
                                                                                    세트 MVP
                                                                                </span>
                                                                                <select
                                                                                    value={playerId}
                                                                                    onChange={(e) => {
                                                                                        const newIds = [...match.mvpPlayerIds]
                                                                                        newIds[setIndex] = Number(e.target.value)
                                                                                        handleUpdateMatch(group.id, match.id, {
                                                                                            mvpPlayerIds: newIds,
                                                                                        })
                                                                                    }}
                                                                                    className="cursor-pointer w-full rounded border border-gray-300 px-2 py-1 text-xs dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                                                                >
                                                                                    {mvpCandidates.map((player) => (
                                                                                        <option key={player.id} value={player.id}>
                                                                                            {player.name} ({player.teamName})
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const firstId = mvpCandidates[0]?.id
                                                                if (firstId === undefined) {
                                                                    return
                                                                }
                                                                handleUpdateMatch(group.id, match.id, {
                                                                    mvpPlayerIds: [...match.mvpPlayerIds, firstId],
                                                                    ...(isOverwatch && {
                                                                        setMaps: [
                                                                            ...(match.setMaps ?? []),
                                                                            createDefaultSetMap(match.mvpPlayerIds.length + 1),
                                                                        ],
                                                                    }),
                                                                })
                                                            }}
                                                            disabled={mvpCandidates.length === 0}
                                                            className="cursor-pointer mt-2 w-full rounded-md border border-dashed border-blue-300 bg-blue-50/70 px-2 py-1.5 text-[11px] font-semibold text-blue-600 transition hover:border-blue-400 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-blue-800/40 dark:bg-blue-900/10 dark:text-blue-300"
                                                        >
                                                            + 세트 설정 추가
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <p className="mb-3 text-center text-xs text-gray-400 dark:text-[#6b6b7a]">경기가 없습니다.</p>
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
                <p className="text-center text-xs text-gray-400 dark:text-[#6b6b7a]">경기 그룹이 없습니다.</p>
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
