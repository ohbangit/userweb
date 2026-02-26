import { useState } from 'react'
import type { DraftContent, DraftParticipant } from '../types'

interface DraftPanelEditorProps {
    content: Record<string, unknown>
    onSave: (content: DraftContent) => Promise<void>
    isSaving: boolean
}

function parseDraftContent(raw: Record<string, unknown>): DraftContent {
    return {
        startsOn: typeof raw.startsOn === 'string' ? raw.startsOn : null,
        meta: typeof raw.meta === 'string' ? raw.meta : '',
        participants: Array.isArray(raw.participants)
            ? (raw.participants as DraftParticipant[])
            : [],
    }
}

export function DraftPanelEditor({
    content,
    onSave,
    isSaving,
}: DraftPanelEditorProps) {
    const parsed = parseDraftContent(content)
    const [startsOn, setStartsOn] = useState(parsed.startsOn ?? '')
    const [meta, setMeta] = useState(parsed.meta)
    const [participants, setParticipants] = useState<DraftParticipant[]>(
        parsed.participants,
    )
    const [newName, setNewName] = useState('')

    function handleAddParticipant() {
        const trimmed = newName.trim()
        if (trimmed.length === 0) return
        const next: DraftParticipant = {
            id: crypto.randomUUID(),
            name: trimmed,
            teamId: null,
            seed: null,
            order: participants.length,
        }
        setParticipants((prev) => [...prev, next])
        setNewName('')
    }

    function handleRemoveParticipant(id: string) {
        setParticipants((prev) =>
            prev.filter((p) => p.id !== id).map((p, i) => ({ ...p, order: i })),
        )
    }

    function handleUpdateSeed(id: string, seed: string) {
        const parsed = parseInt(seed, 10)
        setParticipants((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, seed: isNaN(parsed) ? null : parsed } : p,
            ),
        )
    }

    async function handleSave() {
        await onSave({
            startsOn: startsOn.trim().length > 0 ? startsOn : null,
            meta,
            participants,
        })
    }

    return (
        <div className="mt-3 space-y-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-[#2e2e38] dark:bg-[#20202a]">
            {/* 드래프트 일정 */}
            <div>
                <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-[#adadb8]">
                    드래프트 일자
                </p>
                <div>
                    <label className="mb-1 block text-xs text-gray-400 dark:text-[#6b6b7a]">
                        진행일
                    </label>
                    <input
                        type="date"
                        value={startsOn}
                        onChange={(e) => setStartsOn(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                    />
                </div>
            </div>

            {/* 메타 메모 */}
            <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500 dark:text-[#adadb8]">
                    메모 (선택)
                </label>
                <textarea
                    value={meta}
                    onChange={(e) => setMeta(e.target.value)}
                    rows={2}
                    placeholder="드래프트 관련 추가 설명"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1] dark:placeholder-[#6b6b7a]"
                />
            </div>

            {/* 참여자 목록 */}
            <div>
                <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-[#adadb8]">
                    참여자 ({participants.length}명)
                </p>
                <div className="mb-2 flex gap-2">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                handleAddParticipant()
                            }
                        }}
                        placeholder="참여자 이름 입력"
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1] dark:placeholder-[#6b6b7a]"
                    />
                    <button
                        type="button"
                        onClick={handleAddParticipant}
                        disabled={newName.trim().length === 0}
                        className="rounded-lg bg-blue-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-600 disabled:opacity-40"
                    >
                        추가
                    </button>
                </div>
                {participants.length > 0 ? (
                    <div className="space-y-1.5">
                        {participants.map((p, i) => (
                            <div
                                key={p.id}
                                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-[#2e2e38] dark:bg-[#1a1a23]"
                            >
                                <span className="w-5 text-center text-xs text-gray-400 dark:text-[#6b6b7a]">
                                    {i + 1}
                                </span>
                                <span className="flex-1 text-sm text-gray-700 dark:text-[#efeff1]">
                                    {p.name}
                                </span>
                                <input
                                    type="number"
                                    min={1}
                                    value={p.seed ?? ''}
                                    onChange={(e) =>
                                        handleUpdateSeed(p.id, e.target.value)
                                    }
                                    placeholder="시드"
                                    className="w-16 rounded border border-gray-200 px-2 py-1 text-center text-xs dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1] dark:placeholder-[#6b6b7a]"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveParticipant(p.id)
                                    }
                                    className="text-gray-300 transition hover:text-red-400 dark:text-[#3a3a44] dark:hover:text-red-500"
                                    aria-label="참여자 삭제"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-xs text-gray-400 dark:text-[#6b6b7a]">
                        참여자가 없습니다.
                    </p>
                )}
            </div>

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
                    {isSaving ? '저장 중...' : '드래프트 저장'}
                </button>
            </div>
        </div>
    )
}
