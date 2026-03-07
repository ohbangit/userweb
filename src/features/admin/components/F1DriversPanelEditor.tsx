import { useState } from 'react'
import { Star } from 'lucide-react'
import { useAdminStreamerSearch } from '../hooks'
import type { F1Driver, F1DriversContent, F1DriverRole } from '../types'

interface F1DriversPanelEditorProps {
    content: Record<string, unknown>
    onSave: (content: F1DriversContent) => Promise<void>
    isSaving: boolean
}

type SelectedStreamer = {
    id: number
    name: string
    nickname: string
    channelId: string | null
    channelImageUrl: string | null
    isPartner: boolean
}

const TIER_FORMAT_REGEX = /^([1-6])성(\+)?$/
const MAX_TIER_STARS = 6

function parseF1DriversContent(raw: Record<string, unknown>): F1DriversContent {
    const rawParticipants = Array.isArray(raw.participants) ? (raw.participants as unknown[]) : []

    return {
        participants: rawParticipants.map((p: unknown, index: number) => {
            const driver = (typeof p === 'object' && p !== null ? p : {}) as Record<string, unknown>

            return {
                id: typeof driver.id === 'string' ? driver.id : crypto.randomUUID(),
                streamerId: typeof driver.streamerId === 'number' ? driver.streamerId : null,
                name: typeof driver.name === 'string' ? driver.name : '',
                nickname: typeof driver.nickname === 'string' ? driver.nickname : undefined,
                avatarUrl: typeof driver.avatarUrl === 'string' ? driver.avatarUrl : null,
                channelUrl: typeof driver.channelUrl === 'string' ? driver.channelUrl : null,
                isPartner: driver.isPartner === true,
                driverRole: driver.driverRole === 'SECOND' ? 'SECOND' : 'FIRST',
                tier: typeof driver.tier === 'string' ? driver.tier : null,
                ranking: typeof driver.ranking === 'number' ? driver.ranking : null,
                participationCount: typeof driver.participationCount === 'number' ? driver.participationCount : 0,
                winCount: typeof driver.winCount === 'number' ? driver.winCount : 0,
                carNumber: typeof driver.carNumber === 'number' ? driver.carNumber : null,
                secondGroup: driver.secondGroup === 'A' || driver.secondGroup === 'B' ? driver.secondGroup : null,
                qualifyingEliminated: driver.qualifyingEliminated === true,
                order: typeof driver.order === 'number' ? driver.order : index,
            } satisfies F1Driver
        }),
    }
}

function normalizeTier(value: string): string | null {
    const compact = value.trim().replace(/\s+/g, '')
    if (compact.length === 0) return null

    const match = compact.match(TIER_FORMAT_REGEX)
    if (match === null) return null

    const stars = match[1]
    const plus = match[2] === '+' ? '+' : ''
    return `${stars}성${plus}`
}

function tierStringToValue(value: string | null): number | null {
    if (value === null) return null
    const normalized = normalizeTier(value)
    if (normalized === null) return null

    const match = normalized.match(TIER_FORMAT_REGEX)
    if (match === null) return null

    const stars = Number(match[1])
    const hasPlus = match[2] === '+'
    return stars + (hasPlus ? 0.5 : 0)
}

function tierValueToString(value: number | null): string | null {
    if (value === null || value <= 0) return null

    const full = Math.floor(value)
    const hasHalf = value - full >= 0.5
    if (full < 1 || full > MAX_TIER_STARS) return null

    return `${full}성${hasHalf ? '+' : ''}`
}

function isValidTier(value: string | null): boolean {
    if (value === null) return true
    return TIER_FORMAT_REGEX.test(value.trim().replace(/\s+/g, ''))
}

export function F1DriversPanelEditor({ content, onSave, isSaving }: F1DriversPanelEditorProps) {
    const parsed = parseF1DriversContent(content)
    const [drivers, setDrivers] = useState<F1Driver[]>(parsed.participants)

    const [selectedRole, setSelectedRole] = useState<F1DriverRole>('FIRST')
    const [searchInput, setSearchInput] = useState('')
    const [selectedStreamer, setSelectedStreamer] = useState<SelectedStreamer | null>(null)
    const [isFirstExpanded, setIsFirstExpanded] = useState(true)
    const [isSecondExpanded, setIsSecondExpanded] = useState(true)
    const [expandedDriverIds, setExpandedDriverIds] = useState<Record<string, boolean>>({})

    const showSuggestions = selectedStreamer === null && searchInput.trim().length > 0
    const { data: suggestions, isFetching } = useAdminStreamerSearch(selectedStreamer === null ? searchInput : '')

    function handleSelectStreamer(streamer: SelectedStreamer) {
        setSelectedStreamer(streamer)
        setSearchInput(streamer.nickname)
    }

    function handleClearSelectedStreamer() {
        setSelectedStreamer(null)
        setSearchInput('')
    }

    function handleAddDriver() {
        if (selectedStreamer === null) return

        const exists = drivers.some((d) => d.streamerId === selectedStreamer.id)
        if (exists) {
            alert('이미 추가된 스트리머입니다.')
            return
        }

        const next: F1Driver = {
            id: crypto.randomUUID(),
            streamerId: selectedStreamer.id,
            name: selectedStreamer.name,
            nickname: selectedStreamer.nickname,
            avatarUrl: selectedStreamer.channelImageUrl,
            channelUrl: selectedStreamer.channelId !== null ? `https://chzzk.naver.com/live/${selectedStreamer.channelId}` : null,
            isPartner: selectedStreamer.isPartner,
            driverRole: selectedRole,
            tier: null,
            ranking: null,
            participationCount: 0,
            winCount: 0,
            carNumber: null,
            secondGroup: null,
            qualifyingEliminated: false,
            order: drivers.length,
        }

        setDrivers((prev) => [...prev, next])
        setSelectedStreamer(null)
        setSearchInput('')
    }

    function handleRemoveDriver(driverId: string) {
        if (!confirm('이 드라이버를 삭제할까요?')) return
        setDrivers((prev) => prev.filter((d) => d.id !== driverId).map((d, i) => ({ ...d, order: i })))
        setExpandedDriverIds((prev) => {
            const next = { ...prev }
            delete next[driverId]
            return next
        })
    }

    function handleUpdateDriver(driverId: string, patch: Partial<F1Driver>) {
        setDrivers((prev) => prev.map((d) => (d.id === driverId ? { ...d, ...patch } : d)))
    }

    function handleMoveUp(index: number) {
        if (index === 0) return
        setDrivers((prev) => {
            const next = [...prev]
            const temp = next[index - 1]
            if (temp === undefined) return prev
            next[index - 1] = { ...next[index]!, order: index - 1 }
            next[index] = { ...temp, order: index }
            return next
        })
    }

    function handleMoveDown(index: number) {
        setDrivers((prev) => {
            if (index >= prev.length - 1) return prev
            const next = [...prev]
            const temp = next[index + 1]
            if (temp === undefined) return prev
            next[index + 1] = { ...next[index]!, order: index + 1 }
            next[index] = { ...temp, order: index }
            return next
        })
    }

    async function handleSave() {
        const invalidTierDriver = drivers.find((d) => !isValidTier(d.tier))
        if (invalidTierDriver !== undefined) {
            alert('티어 형식은 "1성~6성" 또는 "4성+" 형태로 입력해주세요.')
            return
        }

        const normalizedDrivers = drivers.map((d) => ({
            ...d,
            tier: d.tier === null ? null : (normalizeTier(d.tier) ?? d.tier.trim()),
        }))

        await onSave({ participants: normalizedDrivers })
    }

    const firstDrivers = drivers.filter((d) => d.driverRole === 'FIRST')
    const secondDrivers = drivers.filter((d) => d.driverRole === 'SECOND')

    function renderDriverCard(driver: F1Driver, groupIndex: number) {
        const originalIndex = drivers.findIndex((d) => d.id === driver.id)
        const tierValue = tierStringToValue(driver.tier)
        const tierInvalid = driver.tier !== null && !isValidTier(driver.tier)
        const isExpanded = expandedDriverIds[driver.id] ?? false

        return (
            <div key={driver.id} className="rounded-xl border border-gray-200 bg-white p-3 dark:border-[#2e2e38] dark:bg-[#1a1a23]">
                <div className="mb-3 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-[#2e2e38] dark:bg-[#20202a]">
                    <span className="shrink-0 text-xs font-semibold text-gray-500 dark:text-[#adadb8]">#{groupIndex}</span>

                    <button
                        type="button"
                        onClick={() =>
                            setExpandedDriverIds((prev) => ({
                                ...prev,
                                [driver.id]: !(prev[driver.id] ?? false),
                            }))
                        }
                        className="cursor-pointer flex min-w-0 flex-1 items-center gap-2 text-left"
                        aria-expanded={isExpanded}
                    >
                        {driver.avatarUrl !== null ? (
                            <img
                                src={driver.avatarUrl}
                                alt={driver.nickname ?? driver.name}
                                className="h-8 w-8 shrink-0 rounded-full object-cover"
                            />
                        ) : (
                            <div className="h-8 w-8 shrink-0 rounded-full bg-gray-100 dark:bg-[#3a3a44]" />
                        )}

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-gray-800 dark:text-[#efeff1]">
                                {driver.nickname ?? driver.name}
                            </p>
                            {driver.nickname !== undefined && (
                                <p className="truncate text-[11px] text-gray-400 dark:text-[#6b6b7a]">{driver.name}</p>
                            )}
                        </div>

                        {driver.isPartner && (
                            <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                                파트너
                            </span>
                        )}

                        <span className="ml-1 shrink-0 text-xs text-gray-400 dark:text-[#adadb8]">{isExpanded ? '▾' : '▸'}</span>
                    </button>

                    <div className="ml-1 flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => handleMoveUp(originalIndex)}
                            disabled={originalIndex <= 0}
                            className="cursor-pointer rounded-md border border-gray-300 px-1.5 py-0.5 text-[10px] text-gray-500 transition hover:text-gray-700 disabled:opacity-30 dark:border-[#3a3a44] dark:text-[#adadb8]"
                        >
                            ▲
                        </button>
                        <button
                            type="button"
                            onClick={() => handleMoveDown(originalIndex)}
                            disabled={originalIndex >= drivers.length - 1}
                            className="cursor-pointer rounded-md border border-gray-300 px-1.5 py-0.5 text-[10px] text-gray-500 transition hover:text-gray-700 disabled:opacity-30 dark:border-[#3a3a44] dark:text-[#adadb8]"
                        >
                            ▼
                        </button>
                        <button
                            type="button"
                            onClick={() => handleRemoveDriver(driver.id)}
                            className="cursor-pointer rounded-md border border-red-200 px-1.5 py-0.5 text-[10px] text-red-500 transition hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"
                        >
                            삭제
                        </button>
                    </div>
                </div>

                {isExpanded && (
                    <div className="flex flex-wrap gap-2">
                        <div className="min-w-[260px] flex-1 rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-[#2e2e38] dark:bg-[#20202a]">
                            <label className="mb-1 block text-[11px] font-medium text-gray-500 dark:text-[#adadb8]">티어</label>
                            <div className="flex items-center gap-1 overflow-x-auto">
                                {Array.from({ length: MAX_TIER_STARS }, (_, i) => i + 1).map((starIndex) => (
                                    <HalfStarButton
                                        key={starIndex}
                                        starIndex={starIndex}
                                        value={tierValue}
                                        onSelect={(next) =>
                                            handleUpdateDriver(driver.id, {
                                                tier: tierValueToString(next),
                                            })
                                        }
                                    />
                                ))}
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleUpdateDriver(driver.id, {
                                            tier: null,
                                        })
                                    }
                                    className="cursor-pointer ml-1 shrink-0 rounded-md border border-gray-300 px-1.5 py-0.5 text-[10px] text-gray-500 transition hover:text-red-500 dark:border-[#3a3a44] dark:text-[#adadb8]"
                                >
                                    초기화
                                </button>
                                <span className="ml-1 shrink-0 text-[10px] text-gray-500 dark:text-[#adadb8]">{driver.tier ?? '-'}</span>
                            </div>
                            {tierInvalid && (
                                <p className="mt-1 text-[10px] text-red-500">
                                    기존 티어 값 형식이 올바르지 않습니다. 별을 눌러 다시 설정해주세요.
                                </p>
                            )}
                        </div>

                        <div className="w-[110px] rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-[#2e2e38] dark:bg-[#20202a]">
                            <label className="mb-1 block text-[11px] font-medium text-gray-500 dark:text-[#adadb8]">랭킹</label>
                            <input
                                type="number"
                                min={1}
                                value={driver.ranking ?? ''}
                                onChange={(e) =>
                                    handleUpdateDriver(driver.id, {
                                        ranking: e.target.value.length > 0 ? Number(e.target.value) : null,
                                    })
                                }
                                placeholder="-"
                                className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                            />
                        </div>

                        <div className="w-[110px] rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-[#2e2e38] dark:bg-[#20202a]">
                            <label className="mb-1 block text-[11px] font-medium text-gray-500 dark:text-[#adadb8]">참가</label>
                            <input
                                type="number"
                                min={0}
                                value={driver.participationCount}
                                onChange={(e) =>
                                    handleUpdateDriver(driver.id, {
                                        participationCount: Number(e.target.value),
                                    })
                                }
                                placeholder="0"
                                className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                            />
                        </div>

                        <div className="w-[110px] rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-[#2e2e38] dark:bg-[#20202a]">
                            <label className="mb-1 block text-[11px] font-medium text-gray-500 dark:text-[#adadb8]">우승</label>
                            <input
                                type="number"
                                min={0}
                                value={driver.winCount}
                                onChange={(e) =>
                                    handleUpdateDriver(driver.id, {
                                        winCount: Number(e.target.value),
                                    })
                                }
                                placeholder="0"
                                className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                            />
                        </div>

                        {driver.driverRole === 'SECOND' && (
                            <div className="w-[160px] rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-[#2e2e38] dark:bg-[#20202a]">
                                <label className="mb-1 block text-[11px] font-medium text-gray-500 dark:text-[#adadb8]">세컨드 조</label>
                                <div className="flex items-center gap-3 text-xs">
                                    <label className="flex cursor-pointer items-center gap-1 text-gray-600 dark:text-[#efeff1]">
                                        <input
                                            type="checkbox"
                                            checked={driver.secondGroup === 'A'}
                                            onChange={(e) =>
                                                handleUpdateDriver(driver.id, {
                                                    secondGroup: e.target.checked ? 'A' : null,
                                                })
                                            }
                                            className="cursor-pointer"
                                        />
                                        A조
                                    </label>
                                    <label className="flex cursor-pointer items-center gap-1 text-gray-600 dark:text-[#efeff1]">
                                        <input
                                            type="checkbox"
                                            checked={driver.secondGroup === 'B'}
                                            onChange={(e) =>
                                                handleUpdateDriver(driver.id, {
                                                    secondGroup: e.target.checked ? 'B' : null,
                                                })
                                            }
                                            className="cursor-pointer"
                                        />
                                        B조
                                    </label>
                                </div>
                            </div>
                        )}

                        <div className="w-[160px] rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-[#2e2e38] dark:bg-[#20202a]">
                            <label className="mb-1 block text-[11px] font-medium text-gray-500 dark:text-[#adadb8]">예선 결과</label>
                            <label className="flex cursor-pointer items-center gap-1 text-xs text-gray-600 dark:text-[#efeff1]">
                                <input
                                    type="checkbox"
                                    checked={driver.qualifyingEliminated === true}
                                    onChange={(e) =>
                                        handleUpdateDriver(driver.id, {
                                            qualifyingEliminated: e.target.checked,
                                        })
                                    }
                                    className="cursor-pointer"
                                />
                                예선 탈락
                            </label>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="mt-3 space-y-4 rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-[#2e2e38] dark:bg-[#20202a]">
            <div className="rounded-xl border border-gray-200 bg-white p-2.5 dark:border-[#2e2e38] dark:bg-[#1a1a23]">
                <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-[#adadb8]">관리 스트리머로 드라이버 추가</p>

                <div className="relative space-y-2">
                    <div className="grid gap-2 md:grid-cols-[140px_1fr_auto]">
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value as F1DriverRole)}
                            className="cursor-pointer w-full rounded-lg border border-gray-300 px-2 py-2 text-xs dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                        >
                            <option value="FIRST">퍼스트</option>
                            <option value="SECOND">세컨드</option>
                        </select>

                        <div className="relative">
                            <input
                                type="text"
                                value={selectedStreamer !== null ? selectedStreamer.nickname : searchInput}
                                onChange={(e) => {
                                    setSearchInput(e.target.value)
                                    setSelectedStreamer(null)
                                }}
                                readOnly={selectedStreamer !== null}
                                placeholder="관리 스트리머 검색"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                            />

                            {selectedStreamer !== null && (
                                <button
                                    type="button"
                                    onClick={handleClearSelectedStreamer}
                                    className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                                    aria-label="선택 해제"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleAddDriver}
                            disabled={selectedStreamer === null}
                            className="cursor-pointer w-full rounded-lg bg-blue-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-600 disabled:opacity-40 md:w-auto"
                        >
                            드라이버 추가
                        </button>
                    </div>

                    {showSuggestions && (
                        <div className="absolute z-50 mt-1 max-h-44 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-[#3a3a44] dark:bg-[#26262e]">
                            {isFetching && <p className="px-3 py-2 text-xs text-gray-500">검색 중...</p>}

                            {!isFetching && (suggestions?.length ?? 0) === 0 && (
                                <p className="px-3 py-2 text-xs text-gray-500">결과 없음</p>
                            )}

                            {!isFetching &&
                                suggestions?.map((s) => (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => {
                                            handleSelectStreamer({
                                                id: s.id,
                                                name: s.name,
                                                nickname: s.nickname,
                                                channelId: s.channelId,
                                                channelImageUrl: s.channelImageUrl,
                                                isPartner: s.isPartner,
                                            })
                                        }}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-gray-800 transition hover:bg-gray-50 dark:text-[#efeff1] dark:hover:bg-[#3a3a44]"
                                    >
                                        {s.channelImageUrl !== null ? (
                                            <img src={s.channelImageUrl} alt={s.nickname} className="h-5 w-5 rounded-full object-cover" />
                                        ) : (
                                            <div className="h-5 w-5 rounded-full bg-gray-100 dark:bg-[#3a3a44]" />
                                        )}
                                        <span className="min-w-0 flex-1 truncate">{s.nickname}</span>
                                        {s.isPartner && <span className="text-[10px] text-amber-500">파트너</span>}
                                    </button>
                                ))}
                        </div>
                    )}

                    <p className="text-[11px] text-gray-400 dark:text-[#6b6b7a]">모든 드라이버는 관리 스트리머 검색으로 추가합니다.</p>
                </div>
            </div>

            {drivers.length > 0 ? (
                <div className="space-y-4">
                    <div>
                        <button
                            type="button"
                            onClick={() => setIsFirstExpanded((prev) => !prev)}
                            className="cursor-pointer mb-2 flex w-full items-center gap-2"
                            aria-expanded={isFirstExpanded}
                        >
                            <span className="h-2 w-2 rounded-full bg-[#E10600]" />
                            <p className="text-xs font-black tracking-widest text-[#E10600] uppercase">
                                First Driver ({firstDrivers.length})
                            </p>
                            <span className="ml-auto text-xs text-[#E10600]">{isFirstExpanded ? '▾' : '▸'}</span>
                        </button>
                        {isFirstExpanded && (
                            <div className="space-y-3">{firstDrivers.map((driver, idx) => renderDriverCard(driver, idx + 1))}</div>
                        )}
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={() => setIsSecondExpanded((prev) => !prev)}
                            className="cursor-pointer mb-2 flex w-full items-center gap-2"
                            aria-expanded={isSecondExpanded}
                        >
                            <span className="h-2 w-2 rounded-full bg-[#6aadcc]" />
                            <p className="text-xs font-black tracking-widest text-[#6aadcc] uppercase">
                                Second Driver ({secondDrivers.length})
                            </p>
                            <span className="ml-auto text-xs text-[#6aadcc]">{isSecondExpanded ? '▾' : '▸'}</span>
                        </button>
                        {isSecondExpanded && (
                            <div className="space-y-3">{secondDrivers.map((driver, idx) => renderDriverCard(driver, idx + 1))}</div>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-center text-xs text-gray-400 dark:text-[#6b6b7a]">등록된 드라이버가 없습니다.</p>
            )}

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => {
                        void handleSave()
                    }}
                    disabled={isSaving}
                    className="cursor-pointer w-full rounded-lg bg-blue-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50 sm:w-auto"
                >
                    {isSaving ? '저장 중...' : '드라이버 저장'}
                </button>
            </div>
        </div>
    )
}

interface HalfStarButtonProps {
    starIndex: number
    value: number | null
    onSelect: (value: number) => void
}

function HalfStarButton({ starIndex, value, onSelect }: HalfStarButtonProps) {
    const filledPercent = value === null ? 0 : Math.max(0, Math.min(100, (value - (starIndex - 1)) * 100))

    return (
        <div className="relative h-5 w-5 shrink-0">
            <button
                type="button"
                onClick={() => onSelect(starIndex - 0.5)}
                className="cursor-pointer absolute left-0 top-0 z-10 h-full w-1/2"
                aria-label={`${starIndex}번째 별 반개`}
            />
            <button
                type="button"
                onClick={() => onSelect(starIndex)}
                className="cursor-pointer absolute right-0 top-0 z-10 h-full w-1/2"
                aria-label={`${starIndex}번째 별 한개`}
            />

            <Star className="h-5 w-5 text-gray-300 dark:text-[#3a3a44]" />

            {filledPercent > 0 && (
                <span className="pointer-events-none absolute left-0 top-0 overflow-hidden" style={{ width: `${filledPercent}%` }}>
                    <Star className="h-5 w-5 fill-[#F5C842] text-[#F5C842]" />
                </span>
            )}
        </div>
    )
}
