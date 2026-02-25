import { useEffect, useState } from 'react'
import partnerMark from '../../../assets/mark.png'
import {
    useStreamers,
    useRegisterStreamer,
    useSyncStreamer,
    useUpdateYoutubeUrl,
    useUpdateFanCafeUrl,
    useRefreshStreamer,
    useDeleteStreamer,
} from '../hooks'
import type { StreamerItem } from '../types'
import { ApiError } from '../../../lib/apiClient'

type TabType = 'all' | 'missing'
type EditingField = 'channel' | 'youtube' | 'fanCafe' | null

function errMsg(err: Error | null): string | null {
    if (err === null) return null
    return err instanceof ApiError ? err.message : '오류가 발생했습니다.'
}

interface AvatarProps {
    src?: string | null
    name: string
    size: number
}

function StreamerAvatar({ src, name, size }: AvatarProps) {
    if (src) {
        return (
            <img
                src={src}
                alt={name}
                width={size}
                height={size}
                className="rounded-full object-cover"
                style={{ width: size, height: size }}
            />
        )
    }
    return (
        <div
            className="flex shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-[#26262e]"
            style={{ width: size, height: size }}
        >
            <svg
                width={size * 0.5}
                height={size * 0.5}
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-gray-400 dark:text-[#848494]"
            >
                <path d="M12 12c2.67 0 4.8-2.13 4.8-4.8S14.67 2.4 12 2.4 7.2 4.53 7.2 7.2 9.33 12 12 12zm0 2.4c-3.2 0-9.6 1.61-9.6 4.8v2.4h19.2v-2.4c0-3.19-6.4-4.8-9.6-4.8z" />
            </svg>
        </div>
    )
}

interface InlineEditFormProps {
    value: string
    onChange: (v: string) => void
    onSave: (e: React.FormEvent) => void
    onCancel: () => void
    placeholder: string
    type?: string
    isPending: boolean
    saveLabel: string
    error: Error | null
}

function InlineEditForm({
    value,
    onChange,
    onSave,
    onCancel,
    placeholder,
    type = 'text',
    isPending,
    saveLabel,
    error,
}: InlineEditFormProps) {
    return (
        <form onSubmit={onSave} className="mt-1.5 space-y-2">
            <div className="flex items-center gap-1.5">
                <input
                    autoFocus
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="h-8 flex-1 rounded-md border border-gray-300 bg-gray-50 px-2.5 font-mono text-xs text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1] dark:placeholder-[#848494] dark:focus:border-[#848494] dark:focus:bg-[#2e2e38]"
                />
                <button
                    type="submit"
                    disabled={isPending || value.trim().length === 0}
                    className="h-8 rounded-md bg-gray-900 px-3 text-xs font-medium text-white transition hover:bg-gray-700 disabled:opacity-40 dark:bg-[#efeff1] dark:text-[#0e0e10] dark:hover:bg-[#adadb8]"
                >
                    {isPending ? '…' : saveLabel}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="h-8 rounded-md border border-gray-300 px-3 text-xs font-medium text-gray-500 transition hover:bg-gray-50 dark:border-[#3a3a44] dark:text-[#adadb8] dark:hover:bg-[#2e2e38]"
                >
                    취소
                </button>
            </div>
            {errMsg(error) && (
                <p className="text-[11px] text-red-500 dark:text-red-400">
                    {errMsg(error)}
                </p>
            )}
        </form>
    )
}

interface FieldRowProps {
    label: string
    children: React.ReactNode
}

function FieldRow({ label, children }: FieldRowProps) {
    return (
        <div className="px-5 py-3.5">
            <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-[#848494]">
                {label}
            </p>
            {children}
        </div>
    )
}

interface StreamerDetailModalProps {
    streamer: StreamerItem
    onClose: () => void
}

function StreamerDetailModal({ streamer, onClose }: StreamerDetailModalProps) {
    const [editing, setEditing] = useState<EditingField>(null)
    const [channelInput, setChannelInput] = useState('')
    const [youtubeInput, setYoutubeInput] = useState(streamer.youtubeUrl ?? '')
    const [fanCafeInput, setFanCafeInput] = useState(streamer.fanCafeUrl ?? '')

    const sync = useSyncStreamer(streamer.id)
    const updateYoutube = useUpdateYoutubeUrl(streamer.channelId ?? '')
    const updateFanCafe = useUpdateFanCafeUrl(streamer.channelId ?? '')

    function cancelEdit() {
        setEditing(null)
        setChannelInput('')
        setYoutubeInput(streamer.youtubeUrl ?? '')
        setFanCafeInput(streamer.fanCafeUrl ?? '')
        sync.reset()
        updateYoutube.reset()
        updateFanCafe.reset()
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 dark:bg-black/70"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div className="w-full max-w-md overflow-hidden rounded-xl border border-gray-300 bg-white shadow-2xl dark:border-[#3a3a44] dark:bg-[#1a1a23]">
                <div className="flex items-center gap-3.5 border-b border-gray-200 px-5 py-4 dark:border-[#3a3a44]">
                    <StreamerAvatar
                        src={streamer.channelImageUrl}
                        name={streamer.name}
                        size={48}
                    />
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                            <span className="truncate text-base font-semibold text-gray-900 dark:text-[#efeff1]">
                                {streamer.name}
                            </span>
                            {streamer.isPartner && (
                                <img
                                    src={partnerMark}
                                    alt="파트너"
                                    className="h-4 w-4 shrink-0"
                                />
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="shrink-0 rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:text-[#848494] dark:hover:bg-[#26262e] dark:hover:text-[#adadb8]"
                        aria-label="닫기"
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-[#3a3a44]">
                    <FieldRow label="채널 ID">
                        {editing === 'channel' ? (
                            <InlineEditForm
                                value={channelInput}
                                onChange={setChannelInput}
                                onSave={(e) => {
                                    e.preventDefault()
                                    if (channelInput.trim().length === 0) return
                                    sync.mutate(
                                        { channelId: channelInput.trim() },
                                        { onSuccess: onClose },
                                    )
                                }}
                                onCancel={cancelEdit}
                                placeholder="채널 ID 입력"
                                isPending={sync.isPending}
                                saveLabel="연결"
                                error={sync.error}
                            />
                        ) : (
                            <div className="flex items-center justify-between">
                                <span
                                    className={[
                                        'font-mono text-sm',
                                        streamer.channelId
                                            ? 'text-gray-900 dark:text-[#efeff1]'
                                            : 'text-red-400 dark:text-red-400',
                                    ].join(' ')}
                                >
                                    {streamer.channelId ?? '미연결'}
                                </span>
                                <button
                                    onClick={() => setEditing('channel')}
                                    className="ml-3 shrink-0 text-xs text-gray-400 transition hover:text-gray-700 dark:text-[#848494] dark:hover:text-[#efeff1]"
                                >
                                    {streamer.channelId
                                        ? '변경'
                                        : '채널 연결 →'}
                                </button>
                            </div>
                        )}
                    </FieldRow>

                    <FieldRow label="유튜브 URL">
                        {editing === 'youtube' ? (
                            <InlineEditForm
                                value={youtubeInput}
                                onChange={setYoutubeInput}
                                onSave={(e) => {
                                    e.preventDefault()
                                    updateYoutube.mutate(
                                        { youtubeUrl: youtubeInput.trim() },
                                        { onSuccess: () => setEditing(null) },
                                    )
                                }}
                                onCancel={cancelEdit}
                                placeholder="https://youtube.com/..."
                                type="url"
                                isPending={updateYoutube.isPending}
                                saveLabel="저장"
                                error={updateYoutube.error}
                            />
                        ) : (
                            <div className="flex items-center justify-between">
                                {streamer.youtubeUrl ? (
                                    <a
                                        href={streamer.youtubeUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="truncate font-mono text-xs text-blue-500 hover:underline dark:text-blue-400"
                                    >
                                        {streamer.youtubeUrl}
                                    </a>
                                ) : (
                                    <span className="text-sm text-gray-400 dark:text-[#848494]">
                                        —
                                    </span>
                                )}
                                {streamer.channelId && (
                                    <button
                                        onClick={() => setEditing('youtube')}
                                        className="ml-3 shrink-0 text-xs text-gray-400 transition hover:text-gray-700 dark:text-[#848494] dark:hover:text-[#efeff1]"
                                    >
                                        수정
                                    </button>
                                )}
                            </div>
                        )}
                    </FieldRow>

                    <FieldRow label="팬카페 URL">
                        {editing === 'fanCafe' ? (
                            <InlineEditForm
                                value={fanCafeInput}
                                onChange={setFanCafeInput}
                                onSave={(e) => {
                                    e.preventDefault()
                                    updateFanCafe.mutate(
                                        { fanCafeUrl: fanCafeInput.trim() },
                                        { onSuccess: () => setEditing(null) },
                                    )
                                }}
                                onCancel={cancelEdit}
                                placeholder="https://cafe.naver.com/..."
                                type="url"
                                isPending={updateFanCafe.isPending}
                                saveLabel="저장"
                                error={updateFanCafe.error}
                            />
                        ) : (
                            <div className="flex items-center justify-between">
                                {streamer.fanCafeUrl ? (
                                    <a
                                        href={streamer.fanCafeUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="truncate font-mono text-xs text-blue-500 hover:underline dark:text-blue-400"
                                    >
                                        {streamer.fanCafeUrl}
                                    </a>
                                ) : (
                                    <span className="text-sm text-gray-400 dark:text-[#848494]">
                                        —
                                    </span>
                                )}
                                {streamer.channelId && (
                                    <button
                                        onClick={() => setEditing('fanCafe')}
                                        className="ml-3 shrink-0 text-xs text-gray-400 transition hover:text-gray-700 dark:text-[#848494] dark:hover:text-[#efeff1]"
                                    >
                                        수정
                                    </button>
                                )}
                            </div>
                        )}
                    </FieldRow>

                    <FieldRow label="팔로워 수">
                        <span className="text-sm text-gray-900 dark:text-[#efeff1]">
                            {streamer.followerCount != null
                                ? streamer.followerCount.toLocaleString()
                                : '—'}
                        </span>
                    </FieldRow>

                    <FieldRow label="ID">
                        <span className="font-mono text-xs text-gray-400 dark:text-[#848494]">
                            {streamer.id}
                        </span>
                    </FieldRow>
                </div>
            </div>
        </div>
    )
}

interface RegisterModalProps {
    onClose: () => void
}

function RegisterModal({ onClose }: RegisterModalProps) {
    const [channelId, setChannelId] = useState('')
    const register = useRegisterStreamer()

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (channelId.trim().length === 0) return
        register.mutate({ channelId: channelId.trim() }, { onSuccess: onClose })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 dark:bg-black/70">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-[#1a1a23]">
                <h2 className="mb-1 text-base font-bold text-gray-900 dark:text-[#efeff1]">
                    스트리머 등록
                </h2>
                <p className="mb-4 text-sm text-gray-500 dark:text-[#adadb8]">
                    치지직 채널 ID로 스트리머를 등록합니다.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={channelId}
                        onChange={(e) => setChannelId(e.target.value)}
                        placeholder="채널 ID"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1] dark:placeholder-[#848494] dark:focus:border-blue-400 dark:focus:ring-blue-900/30"
                    />

                    {register.error && (
                        <p className="text-xs text-red-500 dark:text-red-400">
                            {errMsg(register.error)}
                        </p>
                    )}

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-gray-300 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-[#3a3a44] dark:text-[#adadb8] dark:hover:bg-[#26262e]"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={
                                register.isPending ||
                                channelId.trim().length === 0
                            }
                            className="flex-1 rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
                        >
                            {register.isPending ? '등록 중…' : '등록'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

interface StreamerRowProps {
    streamer: StreamerItem
    onClick: () => void
    onDeleted: () => void
}

function StreamerRow({ streamer, onClick, onDeleted }: StreamerRowProps) {
    const [confirmDelete, setConfirmDelete] = useState(false)
    const refresh = useRefreshStreamer(streamer.id)
    const remove = useDeleteStreamer()

    return (
        <tr
            className="border-b border-gray-200 last:border-0 transition hover:bg-gray-50 dark:border-[#3a3a44] dark:hover:bg-[#26262e]"
            onClick={() => {
                if (!confirmDelete) onClick()
            }}
        >
            <td className="cursor-pointer px-4 py-3.5">
                <div className="flex items-center gap-3">
                    <StreamerAvatar
                        src={streamer.channelImageUrl}
                        name={streamer.name}
                        size={36}
                    />
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium text-gray-900 dark:text-[#efeff1]">
                                {streamer.name}
                            </span>
                            {streamer.isPartner && (
                                <img
                                    src={partnerMark}
                                    alt="파트너"
                                    className="h-4 w-4"
                                />
                            )}
                        </div>
                        <span className="mt-0.5 block text-xs text-gray-400 dark:text-[#848494]">
                            팔로워{' '}
                            {streamer.followerCount != null
                                ? streamer.followerCount.toLocaleString()
                                : '—'}
                        </span>
                        {!streamer.channelId && (
                            <span className="mt-0.5 block text-xs text-red-400 dark:text-red-400">
                                채널 미연결
                            </span>
                        )}
                    </div>
                </div>
            </td>
            <td className="px-4 py-3.5 text-right">
                <div className="flex items-center justify-end gap-2">
                    {confirmDelete ? (
                        <>
                            <span className="text-xs text-gray-500 dark:text-[#adadb8]">
                                삭제할까요?
                            </span>
                            <button
                                type="button"
                                disabled={remove.isPending}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    remove.mutate(streamer.id, {
                                        onSuccess: onDeleted,
                                    })
                                }}
                                className="rounded-md bg-red-500 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-red-600 disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-500"
                            >
                                {remove.isPending ? '…' : '삭제'}
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setConfirmDelete(false)
                                    remove.reset()
                                }}
                                className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-50 dark:border-[#3a3a44] dark:text-[#adadb8] dark:hover:bg-[#2e2e38]"
                            >
                                취소
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                disabled={
                                    !streamer.channelId || refresh.isPending
                                }
                                onClick={(e) => {
                                    e.stopPropagation()
                                    refresh.mutate()
                                }}
                                title="채널 정보 갱신"
                                className="rounded-md border border-gray-300 p-1.5 text-gray-500 transition hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30 dark:border-[#3a3a44] dark:text-[#adadb8] dark:hover:border-[#848494] dark:hover:bg-[#2e2e38] dark:hover:text-[#efeff1]"
                            >
                                <svg
                                    className={[
                                        'h-4 w-4',
                                        refresh.isPending ? 'animate-spin' : '',
                                    ].join(' ')}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setConfirmDelete(true)
                                }}
                                title="스트리머 삭제"
                                className="rounded-md border border-gray-300 p-1.5 text-gray-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-500 dark:border-[#3a3a44] dark:text-[#adadb8] dark:hover:border-red-800 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                            >
                                <svg
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            </button>
                            <span className="text-xs text-gray-300 dark:text-[#848494]">
                                ›
                            </span>
                        </>
                    )}
                </div>
            </td>
        </tr>
    )
}

interface StreamerTableProps {
    streamers: StreamerItem[]
    emptyMessage?: string
    onSelect: (streamer: StreamerItem) => void
    onDeleted: () => void
}

function StreamerTable({
    streamers,
    emptyMessage = '스트리머가 없습니다.',
    onSelect,
    onDeleted,
}: StreamerTableProps) {
    if (streamers.length === 0) {
        return (
            <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-[#3a3a44]">
                <p className="text-sm text-gray-400 dark:text-[#848494]">
                    {emptyMessage}
                </p>
            </div>
        )
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-300 bg-white dark:border-[#3a3a44] dark:bg-[#1a1a23]">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-300 bg-gray-50 dark:border-[#3a3a44] dark:bg-[#26262e]">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#848494]">
                            스트리머
                        </th>
                        <th className="w-40" />
                    </tr>
                </thead>
                <tbody>
                    {streamers.map((s) => (
                        <StreamerRow
                            key={s.id}
                            streamer={s}
                            onClick={() => onSelect(s)}
                            onDeleted={onDeleted}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default function StreamersPage() {
    const [tab, setTab] = useState<TabType>('all')
    const [search, setSearch] = useState('')
    const [showRegister, setShowRegister] = useState(false)
    const [selected, setSelected] = useState<StreamerItem | null>(null)
    const [page, setPage] = useState(1)
    const [sort, setSort] = useState<
        'name_asc' | 'name_desc' | 'follower_desc'
    >('name_asc')
    const size = 20

    const queryParams =
        tab === 'missing'
            ? { hasChannel: false as const }
            : search.trim().length > 0
              ? { name: search.trim() }
              : {}

    const { data, isLoading, isError } = useStreamers({
        ...queryParams,
        page,
        size,
        sort,
    })
    const items = data?.items ?? []
    const total = data?.total ?? 0
    const totalPages = Math.max(1, Math.ceil(total / size))

    useEffect(() => {
        setPage(1)
    }, [tab, search, sort])

    const emptyMessage =
        tab === 'missing'
            ? '채널 ID 미등록 스트리머가 없습니다.'
            : search.trim().length > 0
              ? '검색 결과가 없습니다.'
              : '등록된 스트리머가 없습니다.'

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-[#efeff1]">
                        스트리머 관리
                    </h1>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-[#adadb8]">
                        스트리머 등록 및 채널 정보를 관리합니다.
                    </p>
                </div>
                <button
                    onClick={() => setShowRegister(true)}
                    className="rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                >
                    + 스트리머 등록
                </button>
            </div>

            <div className="mb-4 flex items-center gap-3">
                <div className="flex rounded-xl border border-gray-300 bg-white p-1 dark:border-[#3a3a44] dark:bg-[#1a1a23]">
                    {(['all', 'missing'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => {
                                setTab(t)
                                setSearch('')
                            }}
                            className={[
                                'rounded-lg px-3 py-1.5 text-sm font-medium transition',
                                tab === t
                                    ? 'bg-blue-500 text-white dark:bg-blue-600'
                                    : 'text-gray-600 hover:text-gray-900 dark:text-[#adadb8] dark:hover:text-[#efeff1]',
                            ].join(' ')}
                        >
                            {t === 'all' ? '전체' : '채널 미등록'}
                        </button>
                    ))}
                </div>

                {tab === 'all' && (
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="이름 검색"
                        className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-[#3a3a44] dark:bg-[#1a1a23] dark:text-[#efeff1] dark:placeholder-[#848494] dark:focus:border-blue-400 dark:focus:ring-blue-900/30"
                    />
                )}

                <div className="relative">
                    <select
                        value={sort}
                        onChange={(event) =>
                            setSort(
                                event.target.value as
                                    | 'name_asc'
                                    | 'name_desc'
                                    | 'follower_desc',
                            )
                        }
                        className="appearance-none rounded-xl border border-gray-300 bg-white px-4 py-2 pr-9 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-[#3a3a44] dark:bg-[#1a1a23] dark:text-[#efeff1] dark:focus:border-blue-400 dark:focus:ring-blue-900/30"
                    >
                        <option value="name_asc">이름순</option>
                        <option value="name_desc">이름 역순</option>
                        <option value="follower_desc">팔로워순</option>
                    </select>
                    <svg
                        className="pointer-events-none absolute inset-y-0 right-3 my-auto h-4 w-4 text-gray-400 dark:text-[#848494]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.1 1.02l-4.25 4.5a.75.75 0 01-1.1 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                    </svg>
                </div>
            </div>

            {isLoading && (
                <div className="flex h-32 items-center justify-center">
                    <p className="text-sm text-gray-400 dark:text-[#848494]">
                        불러오는 중…
                    </p>
                </div>
            )}

            {isError && (
                <div className="flex h-32 items-center justify-center rounded-2xl border border-red-100 bg-red-50 dark:border-red-900/20 dark:bg-red-900/10">
                    <p className="text-sm text-red-500 dark:text-red-400">
                        데이터를 불러오지 못했습니다.
                    </p>
                </div>
            )}

            {!isLoading && !isError && (
                <StreamerTable
                    streamers={items}
                    emptyMessage={emptyMessage}
                    onSelect={setSelected}
                    onDeleted={() => setSelected(null)}
                />
            )}

            {!isLoading && !isError && items.length > 0 && (
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-gray-400 dark:text-[#848494]">
                        총 {total.toLocaleString()}명 · {page} / {totalPages}{' '}
                        페이지
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setPage((prev) => Math.max(1, prev - 1))
                            }
                            disabled={page <= 1}
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 dark:border-[#3a3a44] dark:text-[#efeff1] dark:hover:bg-[#26262e]"
                        >
                            이전
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                setPage((prev) =>
                                    Math.min(totalPages, prev + 1),
                                )
                            }
                            disabled={page >= totalPages}
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 dark:border-[#3a3a44] dark:text-[#efeff1] dark:hover:bg-[#26262e]"
                        >
                            다음
                        </button>
                    </div>
                </div>
            )}

            {showRegister && (
                <RegisterModal onClose={() => setShowRegister(false)} />
            )}

            {selected && (
                <StreamerDetailModal
                    streamer={selected}
                    onClose={() => setSelected(null)}
                />
            )}
        </div>
    )
}
