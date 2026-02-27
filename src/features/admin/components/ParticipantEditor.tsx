import { useState } from 'react'
import { useAdminStreamerSearch } from '../hooks'
import type { DraftParticipant, OverwatchRole } from '../types'

const POSITIONS: { role: OverwatchRole; label: string }[] = [
    { role: 'TNK', label: 'TNK' },
    { role: 'DPS', label: 'DPS' },
    { role: 'SPT', label: 'SPT' },
]

const POSITION_COLORS: Record<OverwatchRole, string> = {
    TNK: 'bg-blue-500 text-white',
    DPS: 'bg-red-500 text-white',
    SPT: 'bg-green-500 text-white',
}

interface ParticipantEditorProps {
    participants: DraftParticipant[]
    onSave: (participants: DraftParticipant[]) => Promise<void>
    isSaving: boolean
}

export function ParticipantEditor({
    participants: initialParticipants,
    onSave,
    isSaving,
}: ParticipantEditorProps) {
    const [participants, setParticipants] =
        useState<DraftParticipant[]>(initialParticipants)
    const [searchInput, setSearchInput] = useState('')
    const [selectedStreamerId, setSelectedStreamerId] = useState<number>()
    const [selectedStreamerName, setSelectedStreamerName] = useState('')
    const [selectedStreamerAvatarUrl, setSelectedStreamerAvatarUrl] =
        useState<string | null>(null)
    const [selectedStreamerIsPartner, setSelectedStreamerIsPartner] =
        useState(false)

    const showSuggestions =
        searchInput.trim().length > 0 && selectedStreamerId === undefined
    const { data: suggestions, isFetching } = useAdminStreamerSearch(
        selectedStreamerId === undefined ? searchInput : '',
    )

    function handleAddParticipant() {
        if (selectedStreamerId === undefined) return
        if (participants.some((p) => p.streamerId === selectedStreamerId))
            return
        const next: DraftParticipant = {
            id: crypto.randomUUID(),
            streamerId: selectedStreamerId,
            name: selectedStreamerName,
            teamId: null,
            position: null,
            avatarUrl: selectedStreamerAvatarUrl,
            isPartner: selectedStreamerIsPartner,
            order: participants.length,
        }
        setParticipants((prev) => [...prev, next])
        setSearchInput('')
        setSelectedStreamerId(undefined)
        setSelectedStreamerName('')
        setSelectedStreamerAvatarUrl(null)
        setSelectedStreamerIsPartner(false)
    }

    function handleRemoveParticipant(id: string) {
        setParticipants((prev) =>
            prev.filter((p) => p.id !== id).map((p, i) => ({ ...p, order: i })),
        )
    }

    function handleUpdatePosition(id: string, role: OverwatchRole) {
        setParticipants((prev) =>
            prev.map((p) =>
                p.id === id
                    ? { ...p, position: p.position === role ? null : role }
                    : p,
            ),
        )
    }

    return (
        <div className="p-4">
            <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-[#2e2e38] dark:bg-[#20202a]">
                <p className="text-xs font-semibold text-gray-500 dark:text-[#adadb8]">
                    참여자 ({participants.length}명)
                </p>

                {/* 검색 + 추가 */}
                <div className="relative">
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
                                setSelectedStreamerAvatarUrl(null)
                                setSelectedStreamerIsPartner(false)
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
                                setSelectedStreamerAvatarUrl(null)
                                setSelectedStreamerIsPartner(false)
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
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => {
                                            setSelectedStreamerId(streamer.id)
                                            setSelectedStreamerName(streamer.name)
                                            setSelectedStreamerAvatarUrl(
                                                streamer.channelImageUrl,
                                            )
                                            setSelectedStreamerIsPartner(
                                                streamer.isPartner,
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
                                        <span className="flex-1 truncate">
                                            {streamer.name}
                                        </span>
                                        {streamer.isPartner && (
                                            <span className="text-[10px] text-amber-500">
                                                파트너
                                            </span>
                                        )}
                                    </button>
                                ))}
                        </div>
                    )}
                </div>

                {/* 참여자 목록 */}
                {participants.length > 0 ? (
                    <div className="space-y-1.5">
                        {participants.map((p, i) => (
                            <div
                                key={p.id}
                                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-[#2e2e38] dark:bg-[#1a1a23]"
                            >
                                <span className="w-5 shrink-0 text-center text-xs text-gray-400 dark:text-[#6b6b7a]">
                                    {i + 1}
                                </span>
                                {p.avatarUrl !== null ? (
                                    <img
                                        src={p.avatarUrl}
                                        alt={p.name}
                                        className="h-6 w-6 shrink-0 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="h-6 w-6 shrink-0 rounded-full bg-gray-100 dark:bg-[#2e2e38]" />
                                )}
                                <span className="flex-1 truncate text-sm text-gray-700 dark:text-[#efeff1]">
                                    {p.name}
                                </span>
                                {/* 포지션 토글 */}
                                <div className="flex gap-1">
                                    {POSITIONS.map(({ role, label }) => (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() =>
                                                handleUpdatePosition(p.id, role)
                                            }
                                            className={[
                                                'rounded px-1.5 py-0.5 text-[10px] font-semibold transition',
                                                p.position === role
                                                    ? POSITION_COLORS[role]
                                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-[#2e2e38] dark:text-[#6b6b7a] dark:hover:bg-[#3a3a44]',
                                            ].join(' ')}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveParticipant(p.id)}
                                    className="shrink-0 text-gray-300 transition hover:text-red-400 dark:text-[#3a3a44] dark:hover:text-red-500"
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

                {/* 저장 */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => {
                            void onSave(participants)
                        }}
                        disabled={isSaving}
                        className="rounded-lg bg-blue-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isSaving ? '저장 중...' : '참여자 저장'}
                    </button>
                </div>
            </div>
        </div>
    )
}
