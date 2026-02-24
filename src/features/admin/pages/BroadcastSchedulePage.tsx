import { useEffect, useState } from 'react'
import partnerMark from '../../../assets/mark.png'
import { ApiError } from '../../../lib/apiClient'
import {
    useAdminToast,
    useCategories,
    useCreateBroadcast,
    useDeleteBroadcast,
    useScheduleBroadcasts,
    useStreamers,
    useUpdateBroadcast,
} from '../hooks'
import type {
    AdminBroadcastParticipantInput,
    CreateBroadcastRequest,
    UpdateBroadcastRequest,
} from '../types'
import type { Broadcast, Participant } from '../../schedule/types'
import type {
    ScheduleMonthlyResponse,
    ScheduleWeeklyResponse,
} from '../../schedule/types'

type ViewMode = 'weekly' | 'monthly'

type DraftParticipant = {
    name: string
    streamerId?: number
    isHost?: boolean
    avatarUrl?: string
    isPartner?: boolean
}

const BROADCAST_TYPES = ['합방', '대회', '콘텐츠', '내전'] as const

function readTypeGradientClass(type?: string | null): string {
    if (type === '대회') {
        return 'bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-950/20 dark:to-orange-950/20'
    }
    if (type === '콘텐츠') {
        return 'bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950/20 dark:to-cyan-950/20'
    }
    if (type === '내전') {
        return 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20'
    }
    return 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20'
}

function getErrorMessage(error: unknown): string | null {
    if (!(error instanceof Error)) return null
    return error instanceof ApiError ? error.message : '오류가 발생했습니다.'
}

function toDateString(date: Date): string {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

function formatDisplayDate(isoString: string): string {
    const d = new Date(isoString)
    const dayNames = ['일', '월', '화', '수', '목', '금', '토']
    return `${d.getMonth() + 1}월 ${d.getDate()}일 (${dayNames[d.getDay()]})`
}

function formatTime(isoString: string): string {
    const d = new Date(isoString)
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function toLocalDatetimeInput(isoString: string): string {
    const d = new Date(isoString)
    const y = d.getFullYear()
    const mo = String(d.getMonth() + 1).padStart(2, '0')
    const da = String(d.getDate()).padStart(2, '0')
    const h = String(d.getHours()).padStart(2, '0')
    const mi = String(d.getMinutes()).padStart(2, '0')
    return `${y}-${mo}-${da}T${h}:${mi}`
}

function localDatetimeToISO(local: string): string {
    return new Date(local).toISOString()
}

function collectBroadcasts(
    data: ScheduleWeeklyResponse | ScheduleMonthlyResponse | undefined,
): { date: string; broadcasts: Broadcast[] }[] {
    if (data === undefined) return []
    return data.days.map((day) => ({ date: day.date, broadcasts: day.items }))
}

function toParticipantDrafts(
    participants: Participant[] | undefined,
): DraftParticipant[] {
    if (participants === undefined) return []
    return participants.map((participant) => ({
        name: participant.name,
        streamerId:
            participant.streamerId !== undefined &&
            participant.streamerId !== null
                ? participant.streamerId
                : undefined,
        isHost: participant.isHost ?? false,
        avatarUrl: participant.avatarUrl ?? undefined,
        isPartner: participant.isPartner ?? false,
    }))
}

interface BroadcastFormState {
    title: string
    broadcastType: string
    categoryId: number | null
    startTime: string
    endTime: string
    tags: string
    isVisible: boolean
    participants: DraftParticipant[]
}

function initFormState(broadcast?: Broadcast): BroadcastFormState {
    if (broadcast === undefined) {
        return {
            title: '',
            broadcastType: '합방',
            categoryId: null,
            startTime: '',
            endTime: '',
            tags: '',
            isVisible: false,
            participants: [],
        }
    }
    return {
        title: broadcast.title,
        broadcastType: broadcast.broadcastType ?? '합방',
        categoryId: broadcast.category?.id ?? null,
        startTime: toLocalDatetimeInput(broadcast.startTime),
        endTime:
            broadcast.endTime !== undefined && broadcast.endTime !== null
                ? toLocalDatetimeInput(broadcast.endTime)
                : '',
        tags: (broadcast.tags ?? []).join(', '),
        isVisible: broadcast.isVisible ?? true,
        participants: toParticipantDrafts(broadcast.participants),
    }
}

interface BroadcastFormModalProps {
    mode: 'create' | 'edit'
    broadcast?: Broadcast
    onClose: () => void
    onSuccess: () => void
}

function BroadcastFormModal({
    mode,
    broadcast,
    onClose,
    onSuccess,
}: BroadcastFormModalProps) {
    const [form, setForm] = useState<BroadcastFormState>(() =>
        initFormState(broadcast),
    )
    const [participantNameInput, setParticipantNameInput] = useState('')
    const [participantStreamerId, setParticipantStreamerId] = useState<number>()
    const [participantAvatarUrl, setParticipantAvatarUrl] = useState<string>()
    const [participantIsPartner, setParticipantIsPartner] = useState(false)
    const [editingParticipantName, setEditingParticipantName] = useState<
        string | null
    >(null)
    const [editingInput, setEditingInput] = useState('')
    const [categorySearch, setCategorySearch] = useState('')
    const [isCategoryOpen, setIsCategoryOpen] = useState(false)
    const { addToast } = useAdminToast()
    const createMutation = useCreateBroadcast()
    const updateMutation = useUpdateBroadcast(broadcast?.id ?? '')
    const showParticipantSuggestions =
        participantNameInput.trim().length > 0 &&
        participantStreamerId === undefined
    const participantStreamerQuery = useStreamers(
        showParticipantSuggestions
            ? { name: participantNameInput.trim(), size: 5 }
            : { size: 0 },
    )
    const showEditSuggestions =
        editingParticipantName !== null && editingInput.trim().length > 0
    const editStreamerQuery = useStreamers(
        showEditSuggestions
            ? { name: editingInput.trim(), size: 5 }
            : { size: 0 },
    )
    const { data: categoriesData } = useCategories()
    const categories = categoriesData?.categories ?? []
    const isPending = createMutation.isPending || updateMutation.isPending
    const [initialFormSnapshot] = useState<string>(() =>
        JSON.stringify(initFormState(broadcast)),
    )

    const hasUnsavedChanges =
        JSON.stringify(form) !== initialFormSnapshot ||
        participantNameInput.trim().length > 0 ||
        participantStreamerId !== undefined ||
        editingParticipantName !== null ||
        editingInput.trim().length > 0

    function requestClose(): void {
        if (isPending) {
            return
        }
        if (!hasUnsavedChanges) {
            onClose()
            return
        }
        const shouldClose = window.confirm(
            '저장하지 않은 변경사항이 있습니다. 닫을까요?',
        )
        if (shouldClose) {
            onClose()
        }
    }

    function updateField<K extends keyof BroadcastFormState>(
        key: K,
        value: BroadcastFormState[K],
    ) {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    function addParticipant(): void {
        const name = participantNameInput.trim()
        if (name.length === 0) return
        if (
            form.participants.some((participant) => participant.name === name)
        ) {
            addToast({ message: '이미 추가된 참석자입니다.', variant: 'error' })
            return
        }
        setForm((prev) => ({
            ...prev,
            participants: [
                ...prev.participants,
                {
                    name,
                    streamerId: participantStreamerId,
                    isHost: false,
                    avatarUrl: participantAvatarUrl,
                    isPartner: participantIsPartner,
                },
            ],
        }))
        setParticipantNameInput('')
        setParticipantStreamerId(undefined)
        setParticipantAvatarUrl(undefined)
        setParticipantIsPartner(false)
    }

    function startEditing(name: string): void {
        setEditingParticipantName(name)
        setEditingInput(name)
    }

    function cancelEditing(): void {
        setEditingParticipantName(null)
        setEditingInput('')
    }

    function commitNameEdit(originalName: string): void {
        const normalized = editingInput.trim()
        if (normalized.length === 0) {
            addToast({ message: '이름을 입력해주세요.', variant: 'error' })
            return
        }
        if (
            normalized !== originalName &&
            form.participants.some(
                (participant) => participant.name === normalized,
            )
        ) {
            addToast({
                message: '이미 존재하는 참석자 이름입니다.',
                variant: 'error',
            })
            return
        }
        if (normalized !== originalName) {
            setForm((prev) => ({
                ...prev,
                participants: prev.participants.map((participant) =>
                    participant.name === originalName
                        ? { ...participant, name: normalized }
                        : participant,
                ),
            }))
        }
        cancelEditing()
    }

    function commitStreamerEdit({
        originalName,
        streamerId,
        streamerName,
        avatarUrl,
        isPartner,
    }: {
        originalName: string
        streamerId: number
        streamerName: string
        avatarUrl?: string
        isPartner: boolean
    }): void {
        setForm((prev) => ({
            ...prev,
            participants: prev.participants.map((participant) =>
                participant.name === originalName
                    ? {
                          ...participant,
                          name: streamerName,
                          streamerId,
                          avatarUrl,
                          isPartner,
                      }
                    : participant,
            ),
        }))
        cancelEditing()
    }

    function removeParticipant(name: string): void {
        setForm((prev) => ({
            ...prev,
            participants: prev.participants.filter(
                (participant) => participant.name !== name,
            ),
        }))
    }

    function setHost(name: string): void {
        setForm((prev) => ({
            ...prev,
            participants: prev.participants.map((participant) => ({
                ...participant,
                isHost: participant.name === name,
            })),
        }))
    }

    function clearHost(): void {
        setForm((prev) => ({
            ...prev,
            participants: prev.participants.map((participant) => ({
                ...participant,
                isHost: false,
            })),
        }))
    }

    async function handleSubmit(e: React.FormEvent): Promise<void> {
        e.preventDefault()
        if (form.title.trim().length === 0) {
            addToast({ message: '제목을 입력해주세요.', variant: 'error' })
            return
        }
        if (form.startTime.length === 0) {
            addToast({ message: '시작 시간을 입력해주세요.', variant: 'error' })
            return
        }
        const tags = form.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
        const participants: AdminBroadcastParticipantInput[] =
            form.participants.map((participant) => ({
                name: participant.name,
                ...(participant.streamerId !== undefined && {
                    streamerId: participant.streamerId,
                }),
                ...(participant.isHost !== undefined && {
                    isHost: participant.isHost,
                }),
            }))
        try {
            if (mode === 'create') {
                const body: CreateBroadcastRequest = {
                    title: form.title.trim(),
                    startTime: localDatetimeToISO(form.startTime),
                    broadcastType: form.broadcastType,
                    isVisible: form.isVisible,
                    ...(form.categoryId !== null && {
                        categoryId: form.categoryId,
                    }),
                    ...(form.endTime.length > 0 && {
                        endTime: localDatetimeToISO(form.endTime),
                    }),
                    ...(tags.length > 0 && { tags }),
                    participants,
                }
                await createMutation.mutateAsync(body)
                addToast({
                    message: '방송이 추가되었습니다.',
                    variant: 'success',
                })
            } else {
                const body: UpdateBroadcastRequest = {
                    title: form.title.trim(),
                    startTime: localDatetimeToISO(form.startTime),
                    broadcastType: form.broadcastType,
                    isVisible: form.isVisible,
                    categoryId:
                        form.categoryId !== null ? form.categoryId : undefined,
                    endTime:
                        form.endTime.length > 0
                            ? localDatetimeToISO(form.endTime)
                            : null,
                    tags,
                    participants,
                }
                await updateMutation.mutateAsync(body)
                addToast({
                    message: '방송이 수정되었습니다.',
                    variant: 'success',
                })
            }
            onSuccess()
            onClose()
        } catch (error) {
            const message = getErrorMessage(error)
            if (message !== null) addToast({ message, variant: 'error' })
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 dark:bg-black/70"
            onClick={(e) => {
                if (e.target === e.currentTarget) requestClose()
            }}
        >
            <div className="my-8 w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-[#1a1a23]">
                <div className="flex flex-col gap-3 border-b border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-[#3a3a44]">
                    <h2 className="text-base font-bold text-gray-900 dark:text-[#efeff1]">
                        {mode === 'create' ? '방송 추가' : '방송 수정'}
                    </h2>
                    <div className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 px-3 py-2 sm:justify-start dark:border-[#3a3a44]">
                        <span className="text-xs font-medium text-gray-500 dark:text-[#adadb8]">
                            유저 웹 노출
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                updateField('isVisible', !form.isVisible)
                            }
                            className={[
                                'cursor-pointer flex h-6 w-12 shrink-0 items-center rounded-full px-0.5 transition-colors',
                                form.isVisible
                                    ? 'justify-end'
                                    : 'justify-start',
                                form.isVisible
                                    ? 'bg-emerald-500'
                                    : 'bg-gray-300 dark:bg-[#3a3a44]',
                            ].join(' ')}
                        >
                            <span className="h-5 w-5 rounded-full bg-white shadow" />
                        </button>
                    </div>
                </div>
                <form
                    onSubmit={(e) => {
                        void handleSubmit(e)
                    }}
                    className="space-y-4 px-6 py-4"
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <section className="space-y-3 rounded-xl border border-gray-100 p-4 dark:border-[#3a3a44]">
                            <p className="text-xs font-semibold text-gray-500 dark:text-[#848494]">
                                기본 정보
                            </p>
                            <p className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 dark:text-[#adadb8]">
                                <svg
                                    className="h-3.5 w-3.5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M4 4.75A1.75 1.75 0 015.75 3h7.586c.464 0 .909.184 1.237.513l.914.914A1.75 1.75 0 0116 5.664V15.25A1.75 1.75 0 0114.25 17h-8.5A1.75 1.75 0 014 15.25v-10.5zM6.5 7a.75.75 0 000 1.5h7a.75.75 0 000-1.5h-7zm0 3a.75.75 0 000 1.5h5a.75.75 0 000-1.5h-5z" />
                                </svg>
                                제목
                            </p>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) =>
                                    updateField('title', e.target.value)
                                }
                                placeholder="제목"
                                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                            />
                            <p className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 dark:text-[#adadb8]">
                                <svg
                                    className="h-3.5 w-3.5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M2.5 4A1.5 1.5 0 014 2.5h12A1.5 1.5 0 0117.5 4v2A1.5 1.5 0 0116 7.5H4A1.5 1.5 0 012.5 6V4zm0 6A1.5 1.5 0 014 8.5h12a1.5 1.5 0 011.5 1.5v2A1.5 1.5 0 0116 13.5H4A1.5 1.5 0 012.5 12v-2zm1.5 5.5A1.5 1.5 0 002.5 17v1.5h15V17a1.5 1.5 0 00-1.5-1.5H4z" />
                                </svg>
                                타입
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {BROADCAST_TYPES.map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() =>
                                            updateField('broadcastType', type)
                                        }
                                        className={[
                                            'cursor-pointer rounded-lg border px-2 py-1.5 text-xs font-medium',
                                            form.broadcastType === type
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                                : 'border-gray-200 text-gray-500 dark:border-[#3a3a44] dark:text-[#adadb8]',
                                        ].join(' ')}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                            <p className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 dark:text-[#adadb8]">
                                <svg
                                    className="h-3.5 w-3.5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M5.5 6A3.5 3.5 0 002 9.5v1A3.5 3.5 0 005.5 14h9a3.5 3.5 0 003.5-3.5v-1A3.5 3.5 0 0014.5 6h-9zM6 8.5a.75.75 0 01.75.75V10H7.5a.75.75 0 010 1.5h-.75v.75a.75.75 0 01-1.5 0v-.75H4.5a.75.75 0 010-1.5h.75v-.75A.75.75 0 016 8.5zm8.25.75a1 1 0 100 2 1 1 0 000-2zm-2.5 1a1 1 0 102 0 1 1 0 00-2 0z" />
                                </svg>
                                게임 / 카테고리
                            </p>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={
                                        isCategoryOpen
                                            ? categorySearch
                                            : (form.categoryId !== null
                                                  ? (categories.find(
                                                        (c) =>
                                                            c.id ===
                                                            form.categoryId,
                                                    )?.name ?? '')
                                                  : '')
                                    }
                                    onChange={(e) => {
                                        setCategorySearch(e.target.value)
                                        if (!isCategoryOpen) {
                                            setIsCategoryOpen(true)
                                        }
                                    }}
                                    onFocus={() => {
                                        setIsCategoryOpen(true)
                                        setCategorySearch('')
                                    }}
                                    onBlur={() => {
                                        setTimeout(() => {
                                            setIsCategoryOpen(false)
                                            setCategorySearch('')
                                        }, 150)
                                    }}
                                    placeholder="카테고리 검색"
                                    className="w-full rounded-xl border border-gray-200 px-3 py-2 pr-9 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                />
                                <svg
                                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-[#848494]"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.1 1.02l-4.25 4.5a.75.75 0 01-1.1 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                                </svg>
                                {isCategoryOpen && (
                                    <div className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white dark:border-[#3a3a44] dark:bg-[#26262e]">
                                        <button
                                            type="button"
                                            onMouseDown={(e) =>
                                                e.preventDefault()
                                            }
                                            onClick={() => {
                                                updateField(
                                                    'categoryId',
                                                    null,
                                                )
                                                setIsCategoryOpen(false)
                                                setCategorySearch('')
                                            }}
                                            className="flex w-full cursor-pointer items-center px-3 py-1.5 text-left text-xs text-gray-400 hover:bg-gray-50 dark:text-[#848494] dark:hover:bg-[#3a3a44]"
                                        >
                                            카테고리 없음
                                        </button>
                                        {categories
                                            .filter((c) =>
                                                c.name
                                                    .toLowerCase()
                                                    .includes(
                                                        categorySearch
                                                            .trim()
                                                            .toLowerCase(),
                                                    ),
                                            )
                                            .map((category) => (
                                                <button
                                                    key={category.id}
                                                    type="button"
                                                    onMouseDown={(e) =>
                                                        e.preventDefault()
                                                    }
                                                    onClick={() => {
                                                        updateField(
                                                            'categoryId',
                                                            category.id,
                                                        )
                                                        setIsCategoryOpen(
                                                            false,
                                                        )
                                                        setCategorySearch(
                                                            '',
                                                        )
                                                    }}
                                                    className={[
                                                        'flex w-full cursor-pointer items-center px-3 py-1.5 text-left text-xs hover:bg-gray-50 dark:hover:bg-[#3a3a44]',
                                                        form.categoryId ===
                                                            category.id
                                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                                            : 'text-gray-800 dark:text-[#efeff1]',
                                                    ].join(' ')}
                                                >
                                                    {category.name}
                                                </button>
                                            ))}
                                    </div>
                                )}
                            </div>
                            <p className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 dark:text-[#adadb8]">
                                <svg
                                    className="h-3.5 w-3.5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm.75 4.5a.75.75 0 00-1.5 0v3.69c0 .2.08.39.22.53l2.4 2.4a.75.75 0 101.06-1.06l-2.18-2.18V6.5z" />
                                </svg>
                                시간
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-medium text-gray-400 dark:text-[#848494]">
                                        시작
                                    </p>
                                    <div className="relative">
                                        <input
                                            type="datetime-local"
                                            step="1800"
                                            value={form.startTime}
                                            onChange={(e) =>
                                                updateField(
                                                    'startTime',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-gray-200 px-3 py-2 pr-9 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateField('startTime', '')
                                            }
                                            disabled={
                                                form.startTime.length === 0
                                            }
                                            className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-40 dark:text-[#848494] dark:hover:bg-[#2f2f39] dark:hover:text-[#adadb8]"
                                            aria-label="시작 시간 초기화"
                                        >
                                            <svg
                                                className="h-3.5 w-3.5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path d="M6.28 5.22a.75.75 0 10-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 10-1.06-1.06L10 8.94 6.28 5.22z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-medium text-gray-400 dark:text-[#848494]">
                                        종료
                                    </p>
                                    <div className="relative">
                                        <input
                                            type="datetime-local"
                                            step="1800"
                                            value={form.endTime}
                                            onChange={(e) =>
                                                updateField(
                                                    'endTime',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-gray-200 px-3 py-2 pr-9 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateField('endTime', '')
                                            }
                                            disabled={form.endTime.length === 0}
                                            className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-40 dark:text-[#848494] dark:hover:bg-[#2f2f39] dark:hover:text-[#adadb8]"
                                            aria-label="종료 시간 초기화"
                                        >
                                            <svg
                                                className="h-3.5 w-3.5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path d="M6.28 5.22a.75.75 0 10-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 10-1.06-1.06L10 8.94 6.28 5.22z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 dark:text-[#adadb8]">
                                <svg
                                    className="h-3.5 w-3.5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M2 6.5A2.5 2.5 0 014.5 4h4.964c.663 0 1.299.264 1.768.732l5.036 5.036a2.5 2.5 0 010 3.536l-2.964 2.964a2.5 2.5 0 01-3.536 0L4.732 11.232A2.5 2.5 0 014 9.464V6.5zM7 6.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" />
                                </svg>
                                태그
                            </p>
                            <input
                                type="text"
                                value={form.tags}
                                onChange={(e) =>
                                    updateField('tags', e.target.value)
                                }
                                placeholder="태그 (쉼표 구분)"
                                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                            />
                        </section>

                        <section className="space-y-3 rounded-xl border border-gray-100 p-4 dark:border-[#3a3a44]">
                            <p className="text-xs font-semibold text-gray-500 dark:text-[#848494]">
                                참석자 관리
                            </p>
                            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                                {form.participants.length === 0 && (
                                    <p className="rounded-lg border border-dashed border-gray-200 px-3 py-5 text-center text-xs text-gray-400 dark:border-[#3a3a44] dark:text-[#848494]">
                                        참석자를 먼저 추가해주세요
                                    </p>
                                )}
                                {form.participants.map((participant) => {
                                    const isEditing =
                                        editingParticipantName ===
                                        participant.name
                                    return (
                                        <div
                                            key={participant.name}
                                            className={[
                                                'overflow-hidden rounded-lg border',
                                                participant.streamerId !==
                                                undefined
                                                    ? 'border-l-[3px] border-l-emerald-400 border-gray-100 dark:border-gray-100/0 dark:border-l-emerald-400 dark:bg-[#1a1a23]'
                                                    : 'border-l-[3px] border-l-amber-400 border-gray-100 dark:border-gray-100/0 dark:border-l-amber-400 dark:bg-[#1a1a23]',
                                            ].join(' ')}
                                        >
                                            <div className="flex items-center justify-between gap-2 px-3 py-2">
                                                <div className="flex min-w-0 flex-1 items-center gap-2">
                                                    {participant.streamerId !==
                                                        undefined &&
                                                    participant.avatarUrl !==
                                                        undefined ? (
                                                        <img
                                                            src={
                                                                participant.avatarUrl
                                                            }
                                                            alt={
                                                                participant.name
                                                            }
                                                            className="h-7 w-7 shrink-0 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-[#3a3a44]">
                                                            <svg
                                                                className="h-3.5 w-3.5 text-gray-400 dark:text-[#848494]"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 1114 0H3z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <div className="relative min-w-0 flex-1">
                                                        {isEditing ? (
                                                            <>
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        editingInput
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setEditingInput(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    onKeyDown={(
                                                                        e,
                                                                    ) => {
                                                                        if (
                                                                            e.key ===
                                                                            'Enter'
                                                                        ) {
                                                                            e.preventDefault()
                                                                            commitNameEdit(
                                                                                participant.name,
                                                                            )
                                                                        }
                                                                        if (
                                                                            e.key ===
                                                                            'Escape'
                                                                        ) {
                                                                            cancelEditing()
                                                                        }
                                                                    }}
                                                                    autoFocus
                                                                    className="w-full rounded-md border border-blue-400 px-2 py-1 text-sm text-gray-800 outline-none dark:border-blue-500 dark:bg-[#26262e] dark:text-[#efeff1]"
                                                                />
                                                                {showEditSuggestions &&
                                                                    editStreamerQuery.data !==
                                                                        undefined &&
                                                                    editStreamerQuery
                                                                        .data
                                                                        .items
                                                                        .length >
                                                                        0 && (
                                                                        <div className="mt-1 max-h-32 overflow-y-auto rounded-lg border border-gray-200 bg-white dark:border-[#3a3a44] dark:bg-[#26262e]">
                                                                            {editStreamerQuery.data.items.map(
                                                                                (
                                                                                    streamer,
                                                                                ) => (
                                                                                    <button
                                                                                        key={
                                                                                            streamer.id
                                                                                        }
                                                                                        type="button"
                                                                                        onMouseDown={(
                                                                                            e,
                                                                                        ) =>
                                                                                            e.preventDefault()
                                                                                        }
                                                                                        onClick={() =>
                                                                                            commitStreamerEdit(
                                                                                                {
                                                                                                    originalName:
                                                                                                        participant.name,
                                                                                                    streamerId:
                                                                                                        streamer.id,
                                                                                                    streamerName:
                                                                                                        streamer.name,
                                                                                                    avatarUrl:
                                                                                                        streamer.channelImageUrl ??
                                                                                                        undefined,
                                                                                                    isPartner:
                                                                                                        streamer.isPartner,
                                                                                                },
                                                                                            )
                                                                                        }
                                                                                        className="cursor-pointer flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-gray-50 dark:hover:bg-[#3a3a44]"
                                                                                    >
                                                                                        <span className="text-gray-800 dark:text-[#efeff1]">
                                                                                            {
                                                                                                streamer.name
                                                                                            }
                                                                                        </span>
                                                                                        <span className="text-[10px] text-gray-400 dark:text-[#848494]">
                                                                                            스트리머
                                                                                            연결
                                                                                        </span>
                                                                                    </button>
                                                                                ),
                                                                            )}
                                                                        </div>
                                                                    )}
                                                            </>
                                                        ) : (
                                                            <div
                                                                className="flex cursor-pointer items-center gap-1"
                                                                onClick={() =>
                                                                    startEditing(
                                                                        participant.name,
                                                                    )
                                                                }
                                                            >
                                                                <p className="truncate text-sm font-medium text-gray-800 hover:text-blue-600 dark:text-[#efeff1] dark:hover:text-blue-400">
                                                                    {
                                                                        participant.name
                                                                    }
                                                                </p>
                                                                {participant.isPartner && (
                                                                    <img
                                                                        src={
                                                                            partnerMark
                                                                        }
                                                                        alt="파트너"
                                                                        className="h-3.5 w-3.5 shrink-0"
                                                                    />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex shrink-0 items-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setHost(
                                                                participant.name,
                                                            )
                                                        }
                                                        className={[
                                                            'cursor-pointer rounded-md px-2 py-1 text-[11px] font-semibold',
                                                            participant.isHost
                                                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                                                : 'bg-gray-100 text-gray-500 dark:bg-[#26262e] dark:text-[#848494]',
                                                        ].join(' ')}
                                                    >
                                                        주최
                                                    </button>
                                                    {participant.isHost && (
                                                        <button
                                                            type="button"
                                                            onClick={clearHost}
                                                            className="cursor-pointer rounded-md px-2 py-1 text-[11px] font-semibold text-gray-500 dark:text-[#848494]"
                                                        >
                                                            해제
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeParticipant(
                                                                participant.name,
                                                            )
                                                        }
                                                        className="cursor-pointer rounded-md border border-red-100 px-2 py-1 text-[11px] text-red-500"
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="space-y-2 rounded-lg border border-gray-100 p-3 dark:border-[#3a3a44]">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={participantNameInput}
                                        onChange={(e) => {
                                            setParticipantNameInput(
                                                e.target.value,
                                            )
                                            if (
                                                participantStreamerId !==
                                                undefined
                                            ) {
                                                setParticipantStreamerId(
                                                    undefined,
                                                )
                                                setParticipantAvatarUrl(
                                                    undefined,
                                                )
                                                setParticipantIsPartner(false)
                                            }
                                        }}
                                        placeholder="참석자 이름 또는 스트리머 검색"
                                        className={[
                                            'w-full rounded-lg border border-gray-200 py-2 pl-3 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]',
                                            participantStreamerId !== undefined
                                                ? 'pr-14'
                                                : 'pr-3',
                                        ].join(' ')}
                                    />
                                    {participantStreamerId !== undefined && (
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                                            연결됨
                                        </span>
                                    )}
                                    {showParticipantSuggestions &&
                                        participantStreamerQuery.data !==
                                            undefined &&
                                        participantStreamerQuery.data.items
                                            .length > 0 && (
                                            <div className="mt-1 max-h-32 overflow-y-auto rounded-lg border border-gray-200 bg-white dark:border-[#3a3a44] dark:bg-[#26262e]">
                                                {participantStreamerQuery.data.items.map(
                                                    (streamer) => (
                                                        <button
                                                            key={streamer.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setParticipantNameInput(
                                                                    streamer.name,
                                                                )
                                                                setParticipantStreamerId(
                                                                    streamer.id,
                                                                )
                                                                setParticipantAvatarUrl(
                                                                    streamer.channelImageUrl ??
                                                                        undefined,
                                                                )
                                                                setParticipantIsPartner(
                                                                    streamer.isPartner,
                                                                )
                                                            }}
                                                            className="cursor-pointer flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-gray-50 dark:hover:bg-[#3a3a44]"
                                                        >
                                                            <span className="text-gray-800 dark:text-[#efeff1]">
                                                                {streamer.name}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400 dark:text-[#848494]">
                                                                스트리머 연결
                                                            </span>
                                                        </button>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                </div>
                                <button
                                    type="button"
                                    onClick={addParticipant}
                                    className="cursor-pointer w-full rounded-lg bg-blue-500 py-2 text-xs font-semibold text-white hover:bg-blue-600"
                                >
                                    참석자 추가
                                </button>
                            </div>
                        </section>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={requestClose}
                            className="cursor-pointer flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-[#3a3a44] dark:text-[#adadb8] dark:hover:bg-[#26262e]"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="cursor-pointer flex-1 rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
                        >
                            {isPending
                                ? '저장 중…'
                                : mode === 'create'
                                  ? '추가'
                                  : '저장'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

interface DeleteConfirmModalProps {
    broadcast: Broadcast
    onClose: () => void
    onSuccess: () => void
}

function DeleteConfirmModal({
    broadcast,
    onClose,
    onSuccess,
}: DeleteConfirmModalProps) {
    const { addToast } = useAdminToast()
    const deleteMutation = useDeleteBroadcast()

    async function handleDelete(): Promise<void> {
        try {
            await deleteMutation.mutateAsync(broadcast.id)
            addToast({ message: '방송이 삭제되었습니다.', variant: 'success' })
            onSuccess()
            onClose()
        } catch (error) {
            const message = getErrorMessage(error)
            if (message !== null) addToast({ message, variant: 'error' })
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 dark:bg-black/70">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-[#1a1a23]">
                <p className="text-sm text-gray-600 dark:text-[#adadb8]">
                    <span className="font-semibold text-gray-900 dark:text-[#efeff1]">
                        {broadcast.title}
                    </span>{' '}
                    방송을 삭제합니다.
                </p>
                <div className="mt-4 flex gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer flex-1 rounded-xl border border-gray-200 py-2 text-sm dark:border-[#3a3a44]"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            void handleDelete()
                        }}
                        className="cursor-pointer flex-1 rounded-xl bg-red-500 py-2 text-sm font-semibold text-white"
                    >
                        삭제
                    </button>
                </div>
            </div>
        </div>
    )
}

interface BroadcastCardProps {
    broadcast: Broadcast
    onEdit: (broadcast: Broadcast) => void
    onDelete: (broadcast: Broadcast) => void
}

function BroadcastCard({ broadcast, onEdit, onDelete }: BroadcastCardProps) {
    const hasRepresentativeStreamer = broadcast.streamerName.trim().length > 0
    const tags = broadcast.tags ?? []
    const typeGradientClass = readTypeGradientClass(broadcast.broadcastType)
    const isVisible = broadcast.isVisible ?? true

    return (
        <div
            className={[
                'cursor-pointer rounded-xl border border-gray-100 px-4 py-3 transition hover:border-blue-200 dark:border-[#3a3a44] dark:hover:border-blue-900/40',
                typeGradientClass,
            ].join(' ')}
            onClick={() => onEdit(broadcast)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onEdit(broadcast)
                }
            }}
            role="button"
            tabIndex={0}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-[#efeff1]">
                        {broadcast.title}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-[#848494]">
                        {formatTime(broadcast.startTime)}
                        {broadcast.endTime
                            ? ` - ${formatTime(broadcast.endTime)}`
                            : ''}
                        {hasRepresentativeStreamer
                            ? ` · ${broadcast.streamerName}`
                            : ''}
                    </p>
                    {tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {tags.slice(0, 4).map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-1.5">
                    <span
                        className={[
                            'inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium',
                            isVisible
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                                : 'bg-gray-100 text-gray-600 dark:bg-[#26262e] dark:text-[#adadb8]',
                        ].join(' ')}
                    >
                        {isVisible ? '노출' : '비노출'}
                    </span>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete(broadcast)
                        }}
                        className="cursor-pointer rounded-md border border-red-100 px-2 py-1 text-[11px] text-red-500"
                    >
                        삭제
                    </button>
                </div>
            </div>
            {broadcast.participants !== undefined &&
                broadcast.participants.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {broadcast.participants
                            .slice(0, 6)
                            .map((participant) => (
                                <span
                                    key={participant.name}
                                    className="rounded-full bg-gray-50 px-2 py-0.5 text-[11px] text-gray-600 dark:bg-[#26262e] dark:text-[#adadb8]"
                                >
                                    {participant.isHost ? '★ ' : ''}
                                    {participant.name}
                                </span>
                            ))}
                    </div>
                )}
        </div>
    )
}

export default function BroadcastSchedulePage() {
    const [view, setView] = useState<ViewMode>('weekly')
    const [baseDate, setBaseDate] = useState<Date>(() => new Date())
    const [pendingScrollDate, setPendingScrollDate] = useState<string | null>(
        null,
    )
    const [editingBroadcast, setEditingBroadcast] = useState<Broadcast | null>(
        null,
    )
    const [deletingBroadcast, setDeletingBroadcast] =
        useState<Broadcast | null>(null)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const { data, isLoading, refetch } = useScheduleBroadcasts({
        view,
        date: toDateString(baseDate),
    })
    const dateGroups = collectBroadcasts(data)
    const totalCount = dateGroups.reduce(
        (acc, group) => acc + group.broadcasts.length,
        0,
    )

    useEffect(() => {
        if (pendingScrollDate === null || isLoading) {
            return
        }
        const target = document.querySelector<HTMLElement>(
            `[data-date="${pendingScrollDate}"]`,
        )
        if (target !== null) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        setPendingScrollDate(null)
    }, [pendingScrollDate, isLoading, dateGroups])

    function navigatePrev(): void {
        setBaseDate((prev) => {
            const next = new Date(prev)
            next.setDate(next.getDate() - (view === 'weekly' ? 7 : 30))
            return next
        })
    }

    function navigateNext(): void {
        setBaseDate((prev) => {
            const next = new Date(prev)
            next.setDate(next.getDate() + (view === 'weekly' ? 7 : 30))
            return next
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-[#efeff1]">
                        일정 관리
                    </h1>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-[#adadb8]">
                        참여자/주최자/노출 상태까지 함께 관리합니다.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="cursor-pointer rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white"
                >
                    + 방송 추가
                </button>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex overflow-hidden rounded-xl border border-gray-200 dark:border-[#3a3a44]">
                    {(['weekly', 'monthly'] as const).map((mode) => (
                        <button
                            key={mode}
                            type="button"
                            onClick={() => setView(mode)}
                            className={[
                                'cursor-pointer px-4 py-2 text-sm font-medium',
                                view === mode
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-gray-600 dark:bg-[#1a1a23] dark:text-[#adadb8]',
                            ].join(' ')}
                        >
                            {mode === 'weekly' ? '주간' : '월간'}
                        </button>
                    ))}
                </div>
                <div className="flex overflow-hidden rounded-lg border border-gray-200 dark:border-[#3a3a44]">
                    <button
                        type="button"
                        onClick={navigatePrev}
                        className="cursor-pointer border-r border-gray-200 px-3 py-2 dark:border-[#3a3a44]"
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const today = new Date()
                            setBaseDate(today)
                            setPendingScrollDate(toDateString(today))
                        }}
                        className="cursor-pointer border-r border-gray-200 px-3 py-2 text-xs dark:border-[#3a3a44]"
                    >
                        오늘
                    </button>
                    <button
                        type="button"
                        onClick={navigateNext}
                        className="cursor-pointer px-3 py-2"
                    >
                        ›
                    </button>
                </div>
            </div>

            {isLoading && (
                <div className="py-10 text-center text-sm text-gray-400">
                    불러오는 중…
                </div>
            )}

            {!isLoading && (
                <div className="space-y-5">
                    {dateGroups.map((group) => (
                        <section
                            key={group.date}
                            data-date={group.date}
                            className="scroll-mt-4 space-y-2"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-gray-600 dark:text-[#adadb8]">
                                    {formatDisplayDate(group.date)}
                                </span>
                                <div className="h-px flex-1 bg-gray-100 dark:bg-[#3a3a44]" />
                                <span className="text-[11px] text-gray-400 dark:text-[#848494]">
                                    {group.broadcasts.length}건
                                </span>
                            </div>
                            <div className="space-y-2">
                                {group.broadcasts.map((broadcast) => (
                                    <BroadcastCard
                                        key={broadcast.id}
                                        broadcast={broadcast}
                                        onEdit={setEditingBroadcast}
                                        onDelete={setDeletingBroadcast}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                    {totalCount === 0 && (
                        <div className="rounded-2xl border border-dashed border-gray-200 py-10 text-center text-sm text-gray-400 dark:border-[#3a3a44] dark:text-[#848494]">
                            해당 기간 방송이 없습니다.
                        </div>
                    )}
                </div>
            )}

            {showCreateModal && (
                <BroadcastFormModal
                    mode="create"
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        void refetch()
                    }}
                />
            )}
            {editingBroadcast !== null && (
                <BroadcastFormModal
                    mode="edit"
                    broadcast={editingBroadcast}
                    onClose={() => setEditingBroadcast(null)}
                    onSuccess={() => {
                        void refetch()
                    }}
                />
            )}
            {deletingBroadcast !== null && (
                <DeleteConfirmModal
                    broadcast={deletingBroadcast}
                    onClose={() => setDeletingBroadcast(null)}
                    onSuccess={() => {
                        void refetch()
                    }}
                />
            )}
        </div>
    )
}
