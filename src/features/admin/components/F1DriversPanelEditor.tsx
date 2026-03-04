import { useState } from 'react'
import type { F1Driver, F1DriversContent } from '../types'

interface F1DriversPanelEditorProps {
    content: Record<string, unknown>
    onSave: (content: F1DriversContent) => Promise<void>
    isSaving: boolean
}

function parseF1DriversContent(raw: Record<string, unknown>): F1DriversContent {
    const rawParticipants = Array.isArray(raw.participants) ? (raw.participants as unknown[]) : []
    return {
        participants: rawParticipants.map((p: unknown, index: number) => {
            const driver = p as Record<string, unknown>
            return {
                id: typeof driver.id === 'string' ? driver.id : crypto.randomUUID(),
                streamerId: typeof driver.streamerId === 'number' ? driver.streamerId : null,
                name: typeof driver.name === 'string' ? driver.name : '',
                nickname: typeof driver.nickname === 'string' ? driver.nickname : undefined,
                avatarUrl: typeof driver.avatarUrl === 'string' ? driver.avatarUrl : null,
                channelUrl: typeof driver.channelUrl === 'string' ? driver.channelUrl : null,
                isPartner: driver.isPartner === true,
                carNumber: typeof driver.carNumber === 'number' ? driver.carNumber : null,
                order: typeof driver.order === 'number' ? driver.order : index,
            } as F1Driver
        }),
    }
}

export function F1DriversPanelEditor({ content, onSave, isSaving }: F1DriversPanelEditorProps) {
    const parsed = parseF1DriversContent(content)
    const [drivers, setDrivers] = useState<F1Driver[]>(parsed.participants)

    function handleAddDriver() {
        const next: F1Driver = {
            id: crypto.randomUUID(),
            streamerId: null,
            name: '',
            avatarUrl: null,
            channelUrl: null,
            isPartner: false,
            carNumber: null,
            order: drivers.length,
        }
        setDrivers((prev) => [...prev, next])
    }

    function handleRemoveDriver(driverId: string) {
        if (!confirm('이 드라이버를 삭제할까요?')) return
        setDrivers((prev) => prev.filter((d) => d.id !== driverId).map((d, i) => ({ ...d, order: i })))
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
        await onSave({ participants: drivers })
    }

    return (
        <div className="mt-3 space-y-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-[#2e2e38] dark:bg-[#20202a]">
            {drivers.length > 0 ? (
                <div className="space-y-3">
                    {drivers.map((driver, index) => (
                        <div
                            key={driver.id}
                            className="rounded-xl border border-gray-200 bg-white p-4 dark:border-[#2e2e38] dark:bg-[#1a1a23]"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
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
                                            disabled={index === drivers.length - 1}
                                            className="cursor-pointer text-gray-300 leading-none transition hover:text-gray-500 disabled:opacity-20 dark:text-[#3a3a44]"
                                        >
                                            ▼
                                        </button>
                                    </div>
                                    <span className="text-xs font-semibold text-gray-500 dark:text-[#adadb8]">#{index + 1}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveDriver(driver.id)}
                                    className="cursor-pointer shrink-0 text-xs text-gray-400 transition hover:text-red-500 dark:text-[#6b6b7a]"
                                >
                                    드라이버 삭제
                                </button>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2">
                                <input
                                    type="text"
                                    value={driver.name}
                                    onChange={(e) =>
                                        handleUpdateDriver(driver.id, {
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="이름"
                                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                />
                                <input
                                    type="text"
                                    value={driver.nickname ?? ''}
                                    onChange={(e) =>
                                        handleUpdateDriver(driver.id, {
                                            nickname: e.target.value.trim().length > 0 ? e.target.value : undefined,
                                        })
                                    }
                                    placeholder="닉네임 (선택)"
                                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                />
                                <input
                                    type="number"
                                    min={0}
                                    value={driver.carNumber ?? ''}
                                    onChange={(e) =>
                                        handleUpdateDriver(driver.id, {
                                            carNumber: e.target.value.length > 0 ? Number(e.target.value) : null,
                                        })
                                    }
                                    placeholder="카 번호 (선택)"
                                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                />
                                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]">
                                    <input
                                        type="checkbox"
                                        checked={driver.isPartner}
                                        onChange={(e) =>
                                            handleUpdateDriver(driver.id, {
                                                isPartner: e.target.checked,
                                            })
                                        }
                                        className="cursor-pointer rounded"
                                    />
                                    파트너
                                </label>
                                <input
                                    type="text"
                                    value={driver.avatarUrl ?? ''}
                                    onChange={(e) =>
                                        handleUpdateDriver(driver.id, {
                                            avatarUrl: e.target.value.trim().length > 0 ? e.target.value : null,
                                        })
                                    }
                                    placeholder="아바타 URL (선택)"
                                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                />
                                <input
                                    type="text"
                                    value={driver.channelUrl ?? ''}
                                    onChange={(e) =>
                                        handleUpdateDriver(driver.id, {
                                            channelUrl: e.target.value.trim().length > 0 ? e.target.value : null,
                                        })
                                    }
                                    placeholder="채널 URL (선택)"
                                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-xs text-gray-400 dark:text-[#6b6b7a]">등록된 드라이버가 없습니다.</p>
            )}

            <button
                type="button"
                onClick={handleAddDriver}
                className="cursor-pointer w-full rounded-xl border border-dashed border-gray-300 py-2 text-xs font-medium text-gray-400 transition hover:border-blue-400 hover:text-blue-500 dark:border-[#3a3a44] dark:hover:border-blue-700 dark:hover:text-blue-400"
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
                    {isSaving ? '저장 중...' : '드라이버 저장'}
                </button>
            </div>
        </div>
    )
}
