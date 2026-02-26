import { useState } from 'react'
import { useAdminStreamerSearch } from '../hooks'
import type { DraftContent, DraftParticipant } from '../types'

interface DraftPanelEditorProps {
    content: Record<string, unknown>
    onSave: (content: DraftContent) => Promise<void>
    isSaving: boolean
}

function parseDraftContent(raw: Record<string, unknown>): DraftContent {
    const parsedParticipants = Array.isArray(raw.participants)
        ? (raw.participants as DraftParticipant[]).map(
              (participant, index) => ({
                  id: participant.id,
                  streamerId:
                      typeof participant.streamerId === 'number'
                          ? participant.streamerId
                          : null,
                  name: participant.name,
                  teamId:
                      typeof participant.teamId === 'number'
                          ? participant.teamId
                          : null,
                  seed:
                      typeof participant.seed === 'number'
                          ? participant.seed
                          : null,
                  order:
                      typeof participant.order === 'number'
                          ? participant.order
                          : index,
              }),
          )
        : []
    return {
        startsOn: typeof raw.startsOn === 'string' ? raw.startsOn : null,
        meta: typeof raw.meta === 'string' ? raw.meta : '',
        participants: parsedParticipants,
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
    const [searchInput, setSearchInput] = useState('')
    const [selectedStreamerId, setSelectedStreamerId] = useState<number>()
    const [selectedStreamerName, setSelectedStreamerName] = useState('')
    const showSuggestions =
        searchInput.trim().length > 0 && selectedStreamerId === undefined
    const { data: suggestions, isFetching } = useAdminStreamerSearch(
        selectedStreamerId === undefined ? searchInput : '',
    )

    function handleAddParticipant() {
        if (selectedStreamerId === undefined) return
        if (
            participants.some(
                (participant) => participant.streamerId === selectedStreamerId,
            )
        ) {
            return
        }
        const next: DraftParticipant = {
            id: crypto.randomUUID(),
            streamerId: selectedStreamerId,
            name: selectedStreamerName,
            teamId: null,
            seed: null,
            order: participants.length,
        }
        setParticipants((prev) => [...prev, next])
        setSearchInput('')
        setSelectedStreamerId(undefined)
        setSelectedStreamerName('')
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
                <div className="relative mb-2">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={
                                selectedStreamerId !== undefined
                                    ? selectedStreamerName
                                    : searchInput
                            }
                            onChange={(e) => {
                                setSearchInput(e.target.value)
                                setSelectedStreamerId(undefined)
                                setSelectedStreamerName('')
                            }}
                            readOnly={selectedStreamerId !== undefined}
                            placeholder="관리 스트리머 검색"
                            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1] dark:placeholder-[#6b6b7a]"
                        />
                        <button
                            type="button"
                            onClick={handleAddParticipant}
                            disabled={selectedStreamerId === undefined}
                            className="rounded-lg bg-blue-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-600 disabled:opacity-40"
                        >
                            추가
                        </button>
                    </div>
                    {selectedStreamerId !== undefined && (
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedStreamerId(undefined)
                                setSelectedStreamerName('')
                                setSearchInput('')
                            }}
                            className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                            aria-label="선택 해제"
                        >
                            ✕
                        </button>
                    )}
                    {showSuggestions && (
                        <div className="absolute z-50 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white dark:border-[#3a3a44] dark:bg-[#26262e]">
                            {isFetching && (
                                <p className="px-3 py-2 text-xs text-gray-500">
                                    검색 중...
                                </p>
                            )}
                            {!isFetching &&
                                (suggestions?.length ?? 0) === 0 && (
                                    <p className="px-3 py-2 text-xs text-gray-500">
                                        결과 없음
                                    </p>
                                )}
                            {!isFetching &&
                                suggestions?.map((streamer) => (
                                    <button
                                        key={streamer.id}
                                        type="button"
                                        onMouseDown={(event) =>
                                            event.preventDefault()
                                        }
                                        onClick={() => {
                                            setSelectedStreamerId(streamer.id)
                                            setSelectedStreamerName(
                                                streamer.name,
                                            )
                                            setSearchInput(streamer.name)
                                        }}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-gray-800 transition hover:bg-gray-50 dark:text-[#efeff1] dark:hover:bg-[#3a3a44]"
                                    >
                                        {streamer.channelImageUrl !== null ? (
                                            <img
                                                src={streamer.channelImageUrl}
                                                alt={streamer.name}
                                                className="h-5 w-5 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-5 w-5 rounded-full bg-gray-100 dark:bg-[#3a3a44]" />
                                        )}
                                        <span className="truncate">
                                            {streamer.name}
                                        </span>
                                    </button>
                                ))}
                        </div>
                    )}
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
