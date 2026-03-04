import { useState } from 'react'
import type { F1StandingEntry, F1StandingsContent } from '../types'

interface F1StandingsPanelEditorProps {
    content: Record<string, unknown>
    onSave: (content: F1StandingsContent) => Promise<void>
    isSaving: boolean
}

function parseF1StandingsContent(raw: Record<string, unknown>): F1StandingsContent {
    return {
        standings: Array.isArray(raw.standings)
            ? (raw.standings as unknown[]).map((s: unknown, index: number) => {
                  const entry = s as Record<string, unknown>
                  return {
                      driverId: typeof entry.driverId === 'string' ? entry.driverId : crypto.randomUUID(),
                      name: typeof entry.name === 'string' ? entry.name : '',
                      avatarUrl: typeof entry.avatarUrl === 'string' ? entry.avatarUrl : null,
                      rank: typeof entry.rank === 'number' ? entry.rank : index + 1,
                      totalPoints: typeof entry.totalPoints === 'number' ? entry.totalPoints : 0,
                      wins: typeof entry.wins === 'number' ? entry.wins : 0,
                      podiums: typeof entry.podiums === 'number' ? entry.podiums : 0,
                      fastestLaps: typeof entry.fastestLaps === 'number' ? entry.fastestLaps : 0,
                      note: typeof entry.note === 'string' ? entry.note : '',
                  } as F1StandingEntry
              })
            : [],
    }
}

export function F1StandingsPanelEditor({ content, onSave, isSaving }: F1StandingsPanelEditorProps) {
    const parsed = parseF1StandingsContent(content)
    const [standings, setStandings] = useState<F1StandingEntry[]>(parsed.standings)

    function handleAddEntry() {
        setStandings((prev) => [
            ...prev,
            {
                driverId: crypto.randomUUID(),
                name: '',
                avatarUrl: null,
                rank: prev.length + 1,
                totalPoints: 0,
                wins: 0,
                podiums: 0,
                fastestLaps: 0,
                note: '',
            },
        ])
    }

    function handleRemoveStanding(driverId: string) {
        setStandings((prev) => prev.filter((s) => s.driverId !== driverId).map((s, i) => ({ ...s, rank: i + 1 })))
    }

    function handleUpdateStanding(driverId: string, field: keyof Omit<F1StandingEntry, 'driverId' | 'avatarUrl'>, value: string) {
        setStandings((prev) =>
            prev.map((s) => {
                if (s.driverId !== driverId) return s
                if (field === 'note' || field === 'name') return { ...s, [field]: value }
                const parsed = parseInt(value, 10)
                return {
                    ...s,
                    [field]: value.length > 0 && !isNaN(parsed) ? parsed : 0,
                }
            }),
        )
    }

    function handleMoveUp(index: number) {
        if (index === 0) return
        setStandings((prev) => {
            const next = [...prev]
            const temp = next[index - 1]
            if (temp === undefined) return prev
            next[index - 1] = { ...next[index]!, rank: index }
            next[index] = { ...temp, rank: index + 1 }
            return next
        })
    }

    function handleMoveDown(index: number) {
        setStandings((prev) => {
            if (index >= prev.length - 1) return prev
            const next = [...prev]
            const temp = next[index + 1]
            if (temp === undefined) return prev
            next[index + 1] = { ...next[index]!, rank: index + 2 }
            next[index] = { ...temp, rank: index + 1 }
            return next
        })
    }

    async function handleSave() {
        await onSave({ standings })
    }

    return (
        <div className="mt-3 space-y-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-[#2e2e38] dark:bg-[#20202a]">
            {standings.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-[#2e2e38]">
                                <th className="pb-2 text-left text-gray-500 dark:text-[#adadb8]">순위</th>
                                <th className="pb-2 text-left text-gray-500 dark:text-[#adadb8]">이름</th>
                                <th className="pb-2 text-center text-gray-500 dark:text-[#adadb8]">총 포인트</th>
                                <th className="pb-2 text-center text-gray-500 dark:text-[#adadb8]">우승</th>
                                <th className="pb-2 text-center text-gray-500 dark:text-[#adadb8]">포디움</th>
                                <th className="pb-2 text-center text-gray-500 dark:text-[#adadb8]">FL</th>
                                <th className="pb-2 text-left text-gray-500 dark:text-[#adadb8]">메모</th>
                                <th className="pb-2" />
                            </tr>
                        </thead>
                        <tbody>
                            {standings.map((s, index) => (
                                <tr key={s.driverId} className="border-b border-gray-100 dark:border-[#2e2e38]">
                                    <td className="py-2 pr-2">
                                        <div className="flex items-center gap-1">
                                            <span className="w-5 text-center font-semibold text-gray-700 dark:text-[#efeff1]">
                                                {s.rank}
                                            </span>
                                            <div className="flex flex-col gap-0.5">
                                                <button
                                                    type="button"
                                                    onClick={() => handleMoveUp(index)}
                                                    disabled={index === 0}
                                                    className="cursor-pointer text-gray-300 leading-none transition hover:text-gray-500 disabled:opacity-20 dark:text-[#3a3a44]"
                                                >
                                                    ▲
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleMoveDown(index)}
                                                    disabled={index === standings.length - 1}
                                                    className="cursor-pointer text-gray-300 leading-none transition hover:text-gray-500 disabled:opacity-20 dark:text-[#3a3a44]"
                                                >
                                                    ▼
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2 pr-2">
                                        <input
                                            type="text"
                                            value={s.name}
                                            onChange={(e) => handleUpdateStanding(s.driverId, 'name', e.target.value)}
                                            placeholder="이름"
                                            className="w-24 rounded border border-gray-200 px-1 py-0.5 text-xs dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1] dark:placeholder-[#6b6b7a]"
                                        />
                                    </td>
                                    <td className="py-2 px-1">
                                        <input
                                            type="number"
                                            min={0}
                                            value={s.totalPoints}
                                            onChange={(e) => handleUpdateStanding(s.driverId, 'totalPoints', e.target.value)}
                                            className="w-14 rounded border border-gray-200 px-1 py-0.5 text-center dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                        />
                                    </td>
                                    <td className="py-2 px-1">
                                        <input
                                            type="number"
                                            min={0}
                                            value={s.wins}
                                            onChange={(e) => handleUpdateStanding(s.driverId, 'wins', e.target.value)}
                                            className="w-12 rounded border border-gray-200 px-1 py-0.5 text-center dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                        />
                                    </td>
                                    <td className="py-2 px-1">
                                        <input
                                            type="number"
                                            min={0}
                                            value={s.podiums}
                                            onChange={(e) => handleUpdateStanding(s.driverId, 'podiums', e.target.value)}
                                            className="w-12 rounded border border-gray-200 px-1 py-0.5 text-center dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                        />
                                    </td>
                                    <td className="py-2 px-1">
                                        <input
                                            type="number"
                                            min={0}
                                            value={s.fastestLaps}
                                            onChange={(e) => handleUpdateStanding(s.driverId, 'fastestLaps', e.target.value)}
                                            className="w-12 rounded border border-gray-200 px-1 py-0.5 text-center dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                        />
                                    </td>
                                    <td className="py-2 px-1">
                                        <input
                                            type="text"
                                            value={s.note}
                                            onChange={(e) => handleUpdateStanding(s.driverId, 'note', e.target.value)}
                                            placeholder="메모"
                                            className="w-24 rounded border border-gray-200 px-1 py-0.5 text-xs dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1] dark:placeholder-[#6b6b7a]"
                                        />
                                    </td>
                                    <td className="py-2 pl-2">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveStanding(s.driverId)}
                                            className="cursor-pointer text-gray-300 transition hover:text-red-400 dark:text-[#3a3a44] dark:hover:text-red-500"
                                            aria-label="드라이버 삭제"
                                        >
                                            ✕
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-xs text-gray-400 dark:text-[#6b6b7a]">순위 데이터가 없습니다.</p>
            )}

            <button
                type="button"
                onClick={handleAddEntry}
                className="cursor-pointer rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 transition hover:border-blue-300 hover:text-blue-600 dark:border-[#3a3a44] dark:text-[#adadb8] dark:hover:border-blue-700 dark:hover:text-blue-400"
            >
                + 드라이버 추가
            </button>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => {
                        void handleSave()
                    }}
                    disabled={isSaving}
                    className="cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
                >
                    {isSaving ? '저장 중...' : '순위 저장'}
                </button>
            </div>
        </div>
    )
}
