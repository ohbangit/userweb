import { useEffect, useState } from 'react'
import { Check, ChevronLeft, Image, Search } from 'lucide-react'
import { ApiError } from '../../../lib/apiClient'
import {
    useAdminToast,
    useBanners,
    useCreateBanner,
    useUpdateBanner,
    useDeleteBanner,
    useAdminTournaments,
} from '../hooks'
import type { AdminBanner, CreateBannerPayload } from '../types/banner'
import type { TournamentItem } from '../types'

// ────────────────────────────────────────────────────────────
// 상수 / 유틸
// ────────────────────────────────────────────────────────────

const BANNER_TYPES = ['tournament', 'collab', 'content', '내전'] as const
type BannerType = (typeof BANNER_TYPES)[number]

const TYPE_LABEL: Record<string, string> = {
    tournament: '대회',
    collab: '콜라보',
    content: '콘텐츠',
    내전: '내전',
}

const TYPE_COLOR: Record<string, string> = {
    tournament:
        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    collab: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    content: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
    내전: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
}

function getErrorMessage(error: unknown): string | null {
    if (!(error instanceof Error)) return null
    return error instanceof ApiError ? error.message : '오류가 발생했습니다.'
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) return '-'
    return dateStr.slice(0, 10)
}

const inputClass =
    'w-full rounded-xl border border-gray-300 px-3 py-2 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1] dark:placeholder-[#848494]'
const labelClass = 'text-[11px] font-medium text-gray-500 dark:text-[#adadb8]'

type InternalImageOption = {
    label: string
    url: string
}

const INTERNAL_IMAGE_MODULES = import.meta.glob(
    '../../../assets/banners/**/*.{png,jpg,jpeg,webp,gif,svg,avif}',
    {
        eager: true,
        import: 'default',
    },
) as Record<string, string>

const INTERNAL_IMAGE_OPTIONS: InternalImageOption[] = Object.entries(
    INTERNAL_IMAGE_MODULES,
)
    .map(([path, url]) => ({
        label: path
            .replace('../../../assets/banners/', '')
            .replace(/[-_]/g, ' '),
        url,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

// ────────────────────────────────────────────────────────────
// 삭제 확인 모달
// ────────────────────────────────────────────────────────────

interface DeleteConfirmModalProps {
    banner: AdminBanner
    onConfirm: () => void
    onCancel: () => void
    isPending: boolean
}

function DeleteConfirmModal({
    banner,
    onConfirm,
    onCancel,
    isPending,
}: DeleteConfirmModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 dark:bg-black/70"
            onClick={(e) => {
                if (e.target === e.currentTarget && !isPending) onCancel()
            }}
        >
            <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-[#1a1a23]">
                <div className="px-6 py-5">
                    <h3 className="text-base font-bold text-gray-900 dark:text-[#efeff1]">
                        배너 삭제
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-[#adadb8]">
                        <span className="font-semibold text-gray-800 dark:text-[#efeff1]">
                            {banner.title}
                        </span>
                        을(를) 삭제하시겠습니까?
                    </p>
                </div>
                <div className="flex gap-2 border-t border-gray-200 px-6 py-4 dark:border-[#3a3a44]">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isPending}
                        className="cursor-pointer flex-1 rounded-xl border border-gray-300 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-[#3a3a44] dark:text-[#adadb8] dark:hover:bg-[#26262e]"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isPending}
                        className="cursor-pointer flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                    >
                        {isPending ? '삭제 중...' : '삭제'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ────────────────────────────────────────────────────────────
// 대회 선택 카드 (Step 1)
// ────────────────────────────────────────────────────────────

interface TournamentCardProps {
    tournament: TournamentItem
    selected: boolean
    onClick: () => void
}

function TournamentCard({
    tournament,
    selected,
    onClick,
}: TournamentCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                'relative flex w-full flex-col overflow-hidden rounded-xl border text-left transition',
                selected
                    ? 'border-blue-500 ring-2 ring-blue-500/30 dark:border-blue-400'
                    : 'border-gray-200 hover:border-gray-300 dark:border-[#3a3a44] dark:hover:border-[#5a5a64]',
            ].join(' ')}
        >
            <div className="relative h-20 w-full bg-gray-100 dark:bg-[#26262e]">
                {tournament.bannerUrl ? (
                    <img
                        src={tournament.bannerUrl}
                        alt={tournament.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <Image className="h-6 w-6 text-gray-300 dark:text-[#5a5a64]" />
                    </div>
                )}
                {selected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-blue-500/30">
                        <div className="rounded-full bg-blue-500 p-1">
                            <Check className="h-4 w-4 text-white" />
                        </div>
                    </div>
                )}
            </div>
            <div className="px-2.5 py-2">
                <p className="truncate text-xs font-semibold text-gray-800 dark:text-[#efeff1]">
                    {tournament.name}
                </p>
                <p className="mt-0.5 text-[10px] text-gray-400 dark:text-[#848494]">
                    {formatDate(tournament.startedAt)} ~{' '}
                    {formatDate(tournament.endedAt)}
                </p>
            </div>
        </button>
    )
}

interface InternalImagePickerProps {
    selectedUrl: string
    onSelect: (url: string) => void
}

function InternalImagePicker({
    selectedUrl,
    onSelect,
}: InternalImagePickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')

    const filteredOptions =
        query.trim().length > 0
            ? INTERNAL_IMAGE_OPTIONS.filter((option) =>
                  option.label
                      .toLowerCase()
                      .includes(query.trim().toLowerCase()),
              )
            : INTERNAL_IMAGE_OPTIONS

    return (
        <div className="space-y-2">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-[#3a3a44] dark:text-[#adadb8] dark:hover:bg-[#26262e]"
            >
                {isOpen ? '내부 이미지 목록 닫기' : '내부 이미지에서 찾기'}
            </button>

            {isOpen && (
                <div className="rounded-xl border border-gray-200 p-2 dark:border-[#3a3a44]">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="파일명 검색"
                        className="mb-2 w-full rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1] dark:placeholder-[#848494]"
                    />

                    {filteredOptions.length === 0 ? (
                        <p className="py-3 text-center text-xs text-gray-400 dark:text-[#848494]">
                            내부 이미지가 없습니다.
                        </p>
                    ) : (
                        <div className="grid max-h-44 grid-cols-3 gap-2 overflow-y-auto">
                            {filteredOptions.map((option) => {
                                const isSelected = selectedUrl === option.url
                                return (
                                    <button
                                        key={option.url}
                                        type="button"
                                        onClick={() => {
                                            onSelect(option.url)
                                            setIsOpen(false)
                                        }}
                                        className={[
                                            'overflow-hidden rounded-lg border text-left transition',
                                            isSelected
                                                ? 'border-blue-500 ring-2 ring-blue-500/30'
                                                : 'border-gray-200 hover:border-gray-300 dark:border-[#3a3a44] dark:hover:border-[#5a5a64]',
                                        ].join(' ')}
                                    >
                                        <img
                                            src={option.url}
                                            alt={option.label}
                                            className="h-14 w-full bg-gray-100 object-cover dark:bg-[#26262e]"
                                        />
                                        <p className="truncate px-1.5 py-1 text-[10px] text-gray-500 dark:text-[#adadb8]">
                                            {option.label}
                                        </p>
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// ────────────────────────────────────────────────────────────
// Step 1 — 대회 선택
// ────────────────────────────────────────────────────────────

interface Step1Props {
    selected: TournamentItem | null
    onSelect: (t: TournamentItem) => void
    onNext: () => void
    onManual: () => void
}

function Step1TournamentPicker({
    selected,
    onSelect,
    onNext,
    onManual,
}: Step1Props) {
    const { data, isLoading } = useAdminTournaments()
    const [query, setQuery] = useState('')

    const tournaments = data?.tournaments ?? []
    const filtered =
        query.trim().length > 0
            ? tournaments.filter((t) =>
                  t.name.toLowerCase().includes(query.trim().toLowerCase()),
              )
            : tournaments

    return (
        <div className="flex flex-col">
            <div className="px-6 pt-5 pb-3">
                <h3 className="text-base font-bold text-gray-900 dark:text-[#efeff1]">
                    대회 선택
                </h3>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-[#adadb8]">
                    대회를 선택하면 제목·이미지·기간이 자동으로 채워집니다.
                </p>
            </div>

            <div className="px-6 pb-3">
                <div className="flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 dark:border-[#3a3a44] dark:bg-[#26262e]">
                    <Search className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-[#848494]" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="대회명 검색"
                        className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-[#efeff1] dark:placeholder:text-[#848494]"
                    />
                </div>
            </div>

            <div className="max-h-64 overflow-y-auto px-6">
                {isLoading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                    </div>
                )}
                {!isLoading && filtered.length === 0 && (
                    <p className="py-8 text-center text-sm text-gray-400 dark:text-[#848494]">
                        {query.trim().length > 0
                            ? '검색 결과가 없습니다.'
                            : '등록된 대회가 없습니다.'}
                    </p>
                )}
                {!isLoading && filtered.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 pb-2">
                        {filtered.map((t) => (
                            <TournamentCard
                                key={t.id}
                                tournament={t}
                                selected={selected?.id === t.id}
                                onClick={() => onSelect(t)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-[#3a3a44]">
                <button
                    type="button"
                    onClick={onManual}
                    className="cursor-pointer text-xs text-gray-400 underline-offset-2 hover:text-gray-600 hover:underline dark:text-[#848494] dark:hover:text-[#adadb8]"
                >
                    직접 입력
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    disabled={selected === null}
                    className="cursor-pointer rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-40"
                >
                    다음
                </button>
            </div>
        </div>
    )
}

// ────────────────────────────────────────────────────────────
// Step 2 — 자동 채움 + 간단 설정
// ────────────────────────────────────────────────────────────

interface Step2Props {
    tournament: TournamentItem
    onBack: () => void
    onClose: () => void
}

function Step2BannerConfig({ tournament, onBack, onClose }: Step2Props) {
    const { addToast } = useAdminToast()
    const createMutation = useCreateBanner()
    const [imageUrl, setImageUrl] = useState('')
    const [description, setDescription] = useState('')
    const [orderIndex, setOrderIndex] = useState('0')
    const [isActive, setIsActive] = useState(true)

    async function handleSubmit(): Promise<void> {
        if (!imageUrl.trim()) {
            addToast({
                message: '배너 이미지 URL을 입력해주세요.',
                variant: 'error',
            })
            return
        }
        const payload: CreateBannerPayload = {
            type: 'tournament',
            title: tournament.name,
            imageUrl: imageUrl.trim(),
            tournamentSlug: tournament.slug,
            startedAt: tournament.startedAt ?? undefined,
            endedAt: tournament.endedAt ?? undefined,
            linkUrl: `/tournament/${tournament.slug}`,
            description: description.trim() || undefined,
            orderIndex: Number(orderIndex) || 0,
            isActive,
        }
        try {
            await createMutation.mutateAsync(payload)
            addToast({ message: '배너가 등록되었습니다.', variant: 'success' })
            onClose()
        } catch (error) {
            const message = getErrorMessage(error)
            if (message !== null) addToast({ message, variant: 'error' })
        }
    }

    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-3 px-6 pt-5 pb-4">
                <button
                    type="button"
                    onClick={onBack}
                    className="cursor-pointer rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-[#26262e] dark:hover:text-[#adadb8]"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-[#efeff1]">
                        배너 설정
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-[#adadb8]">
                        배너 이미지를 입력하고 등록합니다.
                    </p>
                </div>
            </div>

            {/* 자동 채워진 대회 정보 (읽기 전용) */}
            <div className="mx-6 mb-4 rounded-xl bg-gray-50 p-3 dark:bg-[#26262e]">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-[#848494]">
                    자동 채움
                </p>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-gray-400 dark:text-[#848494]">
                            타이틀
                        </span>
                        <span className="truncate text-xs font-medium text-gray-700 dark:text-[#efeff1]">
                            {tournament.name}
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-gray-400 dark:text-[#848494]">
                            기간
                        </span>
                        <span className="text-xs text-gray-600 dark:text-[#adadb8]">
                            {formatDate(tournament.startedAt)} ~{' '}
                            {formatDate(tournament.endedAt)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-gray-400 dark:text-[#848494]">
                            링크
                        </span>
                        <span className="truncate text-[11px] text-gray-500 dark:text-[#848494]">
                            /tournament/{tournament.slug}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-3 px-6">
                {/* 배너 이미지 — 별도 입력 필수 */}
                <div className="space-y-1">
                    <label className={labelClass}>
                        배너 이미지 URL <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://... (대회 이미지와 별도 배너 이미지)"
                        className={inputClass}
                        autoFocus
                    />
                    <InternalImagePicker
                        selectedUrl={imageUrl}
                        onSelect={setImageUrl}
                    />
                    {imageUrl.trim().length > 0 && (
                        <div className="mt-1.5 overflow-hidden rounded-lg">
                            <img
                                src={imageUrl}
                                alt="배너 미리보기"
                                className="h-24 w-full object-cover"
                            />
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <label className={labelClass}>설명 (선택)</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="배너 서브 텍스트"
                        className={inputClass}
                    />
                </div>
                <div className="flex items-end gap-3">
                    <div className="flex-1 space-y-1">
                        <label className={labelClass}>노출 순서</label>
                        <input
                            type="number"
                            min={0}
                            value={orderIndex}
                            onChange={(e) => setOrderIndex(e.target.value)}
                            className={inputClass}
                        />
                    </div>
                    <label className="flex cursor-pointer items-center gap-2 pb-2">
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="h-4 w-4 cursor-pointer rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-[#adadb8]">
                            즉시 활성화
                        </span>
                    </label>
                </div>
            </div>

            <div className="mt-5 flex gap-2 border-t border-gray-200 px-6 py-4 dark:border-[#3a3a44]">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={createMutation.isPending}
                    className="cursor-pointer flex-1 rounded-xl border border-gray-300 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-[#3a3a44] dark:text-[#adadb8] dark:hover:bg-[#26262e]"
                >
                    취소
                </button>
                <button
                    type="button"
                    onClick={() => {
                        void handleSubmit()
                    }}
                    disabled={createMutation.isPending || !imageUrl.trim()}
                    className="cursor-pointer flex-1 rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
                >
                    {createMutation.isPending ? '등록 중...' : '배너 등록'}
                </button>
            </div>
        </div>
    )
}

// ────────────────────────────────────────────────────────────
// 직접 입력 / 수정 폼
// ────────────────────────────────────────────────────────────

interface ManualFormState {
    type: BannerType
    title: string
    description: string
    imageUrl: string
    linkUrl: string
    tournamentSlug: string
    startedAt: string
    endedAt: string
    orderIndex: string
    isActive: boolean
}

const EMPTY_FORM: ManualFormState = {
    type: 'tournament',
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    tournamentSlug: '',
    startedAt: '',
    endedAt: '',
    orderIndex: '0',
    isActive: true,
}

function bannerToForm(banner: AdminBanner): ManualFormState {
    return {
        type: (BANNER_TYPES.includes(banner.type as BannerType)
            ? banner.type
            : 'tournament') as BannerType,
        title: banner.title,
        description: banner.description ?? '',
        imageUrl: banner.imageUrl,
        linkUrl: banner.linkUrl ?? '',
        tournamentSlug: banner.tournamentSlug ?? '',
        startedAt: banner.startedAt ?? '',
        endedAt: banner.endedAt ?? '',
        orderIndex: String(banner.orderIndex),
        isActive: banner.isActive,
    }
}

interface ManualFormProps {
    initialData?: AdminBanner
    onBack?: () => void
    onClose: () => void
}

function ManualBannerForm({ initialData, onBack, onClose }: ManualFormProps) {
    const { addToast } = useAdminToast()
    const createMutation = useCreateBanner()
    const updateMutation = useUpdateBanner(initialData?.id ?? 0)
    const isEdit = initialData !== undefined
    const isPending = createMutation.isPending || updateMutation.isPending

    const [form, setForm] = useState<ManualFormState>(
        initialData ? bannerToForm(initialData) : EMPTY_FORM,
    )

    useEffect(() => {
        if (initialData) setForm(bannerToForm(initialData))
    }, [initialData])

    function setField<K extends keyof ManualFormState>(
        key: K,
        value: ManualFormState[K],
    ): void {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    async function handleSubmit(e: React.FormEvent): Promise<void> {
        e.preventDefault()
        if (!form.title.trim()) {
            addToast({ message: '타이틀을 입력해주세요.', variant: 'error' })
            return
        }
        if (!form.imageUrl.trim()) {
            addToast({
                message: '이미지 URL을 입력해주세요.',
                variant: 'error',
            })
            return
        }
        const payload: CreateBannerPayload = {
            type: form.type,
            title: form.title.trim(),
            imageUrl: form.imageUrl.trim(),
            description: form.description.trim() || undefined,
            linkUrl: form.linkUrl.trim() || undefined,
            tournamentSlug: form.tournamentSlug.trim() || undefined,
            startedAt: form.startedAt || undefined,
            endedAt: form.endedAt || undefined,
            orderIndex: Number(form.orderIndex) || 0,
            isActive: form.isActive,
        }
        try {
            if (isEdit) {
                await updateMutation.mutateAsync(payload)
                addToast({
                    message: '배너가 수정되었습니다.',
                    variant: 'success',
                })
            } else {
                await createMutation.mutateAsync(payload)
                addToast({
                    message: '배너가 등록되었습니다.',
                    variant: 'success',
                })
            }
            onClose()
        } catch (error) {
            const message = getErrorMessage(error)
            if (message !== null) addToast({ message, variant: 'error' })
        }
    }

    return (
        <form
            onSubmit={(e) => {
                void handleSubmit(e)
            }}
            className="flex flex-col"
        >
            <div className="flex items-center gap-3 px-6 pt-5 pb-4">
                {onBack !== undefined && (
                    <button
                        type="button"
                        onClick={onBack}
                        className="cursor-pointer rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-[#26262e] dark:hover:text-[#adadb8]"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                )}
                <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-[#efeff1]">
                        {isEdit ? '배너 수정' : '직접 입력'}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-[#adadb8]">
                        {isEdit
                            ? '배너 정보를 수정합니다.'
                            : '모든 항목을 직접 입력합니다.'}
                    </p>
                </div>
            </div>

            <div className="space-y-3 px-6">
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className={labelClass}>타입</label>
                        <select
                            value={form.type}
                            onChange={(e) =>
                                setField('type', e.target.value as BannerType)
                            }
                            className={inputClass}
                        >
                            {BANNER_TYPES.map((t) => (
                                <option key={t} value={t}>
                                    {TYPE_LABEL[t] ?? t}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className={labelClass}>순서</label>
                        <input
                            type="number"
                            min={0}
                            value={form.orderIndex}
                            onChange={(e) =>
                                setField('orderIndex', e.target.value)
                            }
                            className={inputClass}
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className={labelClass}>
                        타이틀 <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setField('title', e.target.value)}
                        placeholder="배너 타이틀"
                        className={inputClass}
                    />
                </div>
                <div className="space-y-1">
                    <label className={labelClass}>설명 (선택)</label>
                    <input
                        type="text"
                        value={form.description}
                        onChange={(e) =>
                            setField('description', e.target.value)
                        }
                        placeholder="서브 텍스트"
                        className={inputClass}
                    />
                </div>
                <div className="space-y-1">
                    <label className={labelClass}>
                        이미지 URL <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={form.imageUrl}
                        onChange={(e) => setField('imageUrl', e.target.value)}
                        placeholder="https://... 또는 /assets/..."
                        className={inputClass}
                    />
                    <InternalImagePicker
                        selectedUrl={form.imageUrl}
                        onSelect={(url) => setField('imageUrl', url)}
                    />
                </div>
                <div className="space-y-1">
                    <label className={labelClass}>링크 URL (선택)</label>
                    <input
                        type="text"
                        value={form.linkUrl}
                        onChange={(e) => setField('linkUrl', e.target.value)}
                        placeholder="/tournament/slug 또는 https://..."
                        className={inputClass}
                    />
                </div>
                <div className="space-y-1">
                    <label className={labelClass}>대회 슬러그 (선택)</label>
                    <input
                        type="text"
                        value={form.tournamentSlug}
                        onChange={(e) =>
                            setField('tournamentSlug', e.target.value)
                        }
                        placeholder="tournament-slug"
                        className={inputClass}
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className={labelClass}>시작일</label>
                        <input
                            type="date"
                            value={form.startedAt}
                            onChange={(e) =>
                                setField('startedAt', e.target.value)
                            }
                            className={inputClass}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className={labelClass}>종료일</label>
                        <input
                            type="date"
                            value={form.endedAt}
                            onChange={(e) =>
                                setField('endedAt', e.target.value)
                            }
                            className={inputClass}
                        />
                    </div>
                </div>
                <label className="flex cursor-pointer items-center gap-2 pb-1">
                    <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) => setField('isActive', e.target.checked)}
                        className="h-4 w-4 cursor-pointer rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-[#adadb8]">
                        즉시 활성화
                    </span>
                </label>
            </div>

            <div className="mt-4 flex gap-2 border-t border-gray-200 px-6 py-4 dark:border-[#3a3a44]">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isPending}
                    className="cursor-pointer flex-1 rounded-xl border border-gray-300 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-[#3a3a44] dark:text-[#adadb8] dark:hover:bg-[#26262e]"
                >
                    취소
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="cursor-pointer flex-1 rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
                >
                    {isPending
                        ? isEdit
                            ? '수정 중...'
                            : '등록 중...'
                        : isEdit
                          ? '수정 완료'
                          : '배너 등록'}
                </button>
            </div>
        </form>
    )
}

// ────────────────────────────────────────────────────────────
// 배너 추가 모달 (Step 관리)
// ────────────────────────────────────────────────────────────

type CreateStep = 'pick' | 'config' | 'manual'

interface CreateBannerModalProps {
    onClose: () => void
}

function CreateBannerModal({ onClose }: CreateBannerModalProps) {
    const [step, setStep] = useState<CreateStep>('pick')
    const [selectedTournament, setSelectedTournament] =
        useState<TournamentItem | null>(null)

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 dark:bg-black/70"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-[#1a1a23]">
                {step === 'pick' && (
                    <Step1TournamentPicker
                        selected={selectedTournament}
                        onSelect={setSelectedTournament}
                        onNext={() => {
                            if (selectedTournament !== null) setStep('config')
                        }}
                        onManual={() => setStep('manual')}
                    />
                )}
                {step === 'config' && selectedTournament !== null && (
                    <Step2BannerConfig
                        tournament={selectedTournament}
                        onBack={() => setStep('pick')}
                        onClose={onClose}
                    />
                )}
                {step === 'manual' && (
                    <ManualBannerForm
                        onBack={() => setStep('pick')}
                        onClose={onClose}
                    />
                )}
            </div>
        </div>
    )
}

// ────────────────────────────────────────────────────────────
// 메인 페이지
// ────────────────────────────────────────────────────────────

export default function BannerManagePage() {
    const { data, isLoading, isError } = useBanners()
    const deleteMutation = useDeleteBanner()
    const { addToast } = useAdminToast()
    const [deletingBanner, setDeletingBanner] = useState<AdminBanner | null>(
        null,
    )
    const [editingBanner, setEditingBanner] = useState<AdminBanner | null>(null)
    const [showCreateModal, setShowCreateModal] = useState(false)

    const banners = data?.banners ?? []

    async function handleDelete(): Promise<void> {
        if (deletingBanner === null) return
        try {
            await deleteMutation.mutateAsync(deletingBanner.id)
            addToast({
                message: `'${deletingBanner.title}' 배너가 삭제되었습니다.`,
                variant: 'success',
            })
            setDeletingBanner(null)
        } catch (error) {
            const message = getErrorMessage(error)
            if (message !== null) addToast({ message, variant: 'error' })
        }
    }

    return (
        <>
            <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-[#efeff1]">
                        배너 관리
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-[#adadb8]">
                        메인 페이지 상단 캐러셀 배너를 관리합니다.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="cursor-pointer flex items-center gap-1.5 rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                >
                    <Image className="h-4 w-4" />
                    배너 추가
                </button>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-[#3a3a44]">
                <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-[#3a3a44]">
                    <p className="text-xs font-semibold text-gray-500 dark:text-[#848494]">
                        배너 목록
                    </p>
                    {!isLoading && (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500 dark:bg-[#26262e] dark:text-[#848494]">
                            {banners.length}개
                        </span>
                    )}
                </div>

                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                    </div>
                )}
                {isError && (
                    <div className="py-12 text-center text-sm text-red-500">
                        배너를 불러오는 중 오류가 발생했습니다.
                    </div>
                )}
                {!isLoading && !isError && banners.length === 0 && (
                    <div className="py-12 text-center text-sm text-gray-400 dark:text-[#848494]">
                        등록된 배너가 없습니다.
                    </div>
                )}
                {!isLoading && !isError && banners.length > 0 && (
                    <ul className="divide-y divide-gray-100 dark:divide-[#3a3a44]">
                        {banners.map((banner) => (
                            <li
                                key={banner.id}
                                className="flex items-center gap-3 px-4 py-3"
                            >
                                <div className="h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-[#26262e]">
                                    {banner.imageUrl ? (
                                        <img
                                            src={banner.imageUrl}
                                            alt={banner.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <Image className="h-5 w-5 text-gray-300 dark:text-[#5a5a64]" />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <span
                                            className={[
                                                'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                                                TYPE_COLOR[banner.type] ??
                                                    'bg-gray-100 text-gray-600 dark:bg-[#26262e] dark:text-[#adadb8]',
                                            ].join(' ')}
                                        >
                                            {TYPE_LABEL[banner.type] ??
                                                banner.type}
                                        </span>
                                        {!banner.isActive && (
                                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-400 dark:bg-[#26262e] dark:text-[#848494]">
                                                비활성
                                            </span>
                                        )}
                                        <span className="text-[10px] text-gray-300 dark:text-[#5a5a64]">
                                            #{banner.orderIndex}
                                        </span>
                                    </div>
                                    <p className="mt-0.5 truncate text-sm font-medium text-gray-800 dark:text-[#efeff1]">
                                        {banner.title}
                                    </p>
                                    <p className="text-[11px] text-gray-400 dark:text-[#848494]">
                                        {formatDate(banner.startedAt)} ~{' '}
                                        {formatDate(banner.endedAt)}
                                    </p>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingBanner(banner)}
                                        className="cursor-pointer rounded-lg border border-blue-100 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-50 dark:border-blue-900/30 dark:hover:bg-blue-900/10"
                                    >
                                        수정
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setDeletingBanner(banner)
                                        }
                                        className="cursor-pointer rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/10"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {showCreateModal && (
                <CreateBannerModal onClose={() => setShowCreateModal(false)} />
            )}

            {editingBanner !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 dark:bg-black/70"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setEditingBanner(null)
                    }}
                >
                    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-[#1a1a23]">
                        <ManualBannerForm
                            initialData={editingBanner}
                            onClose={() => setEditingBanner(null)}
                        />
                    </div>
                </div>
            )}

            {deletingBanner !== null && (
                <DeleteConfirmModal
                    banner={deletingBanner}
                    onConfirm={() => {
                        void handleDelete()
                    }}
                    onCancel={() => setDeletingBanner(null)}
                    isPending={deleteMutation.isPending}
                />
            )}
        </>
    )
}
