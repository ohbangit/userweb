import { useEffect, useState } from 'react'
import { ApiError } from '../../../lib/apiClient'
import {
    useAdminToast,
    useCategories,
    useCrawlCategories,
    useCreateCategory,
    useDeleteCategory,
    useInsertCategories,
    useUpdateCategory,
} from '../hooks'
import type {
    CategoryItem,
    CrawledCategoryItem,
    UpdateCategoryRequest,
} from '../types'

function getErrorMessage(error: unknown): string | null {
    if (!(error instanceof Error)) return null
    return error instanceof ApiError ? error.message : '오류가 발생했습니다.'
}

interface CategoryThumbnailProps {
    src: string | null
    name: string
}

function CategoryThumbnail({ src, name }: CategoryThumbnailProps) {
    if (src !== null && src.length > 0) {
        return (
            <img
                src={src}
                alt={name}
                className="h-10 w-10 shrink-0 rounded-lg object-cover"
            />
        )
    }
    return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-[#26262e]">
            <svg
                className="h-5 w-5 text-gray-400 dark:text-[#848494]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
            </svg>
        </div>
    )
}

interface DeleteConfirmModalProps {
    category: CategoryItem
    onConfirm: () => void
    onCancel: () => void
    isPending: boolean
}

function DeleteConfirmModal({
    category,
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
                        카테고리 삭제
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-[#adadb8]">
                        <span className="font-semibold text-gray-800 dark:text-[#efeff1]">
                            {category.name}
                        </span>
                        을(를) 삭제하시겠습니까?
                        <br />
                        해당 카테고리가 연결된 방송이 있을 경우 카테고리가
                        해제됩니다.
                    </p>
                </div>
                <div className="flex gap-2 border-t border-gray-100 px-6 py-4 dark:border-[#3a3a44]">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isPending}
                        className="cursor-pointer flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-[#3a3a44] dark:text-[#adadb8] dark:hover:bg-[#26262e]"
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

interface AddCategoryFormProps {
    onSuccess: () => void
}

function AddCategoryForm({ onSuccess }: AddCategoryFormProps) {
    const [name, setName] = useState('')
    const [thumbnailUrl, setThumbnailUrl] = useState('')
    const { addToast } = useAdminToast()
    const createMutation = useCreateCategory()

    async function handleSubmit(e: React.FormEvent): Promise<void> {
        e.preventDefault()
        const trimmedName = name.trim()
        if (trimmedName.length === 0) {
            addToast({
                message: '카테고리 이름을 입력해주세요.',
                variant: 'error',
            })
            return
        }
        try {
            await createMutation.mutateAsync({
                name: trimmedName,
                thumbnailUrl:
                    thumbnailUrl.trim().length > 0
                        ? thumbnailUrl.trim()
                        : undefined,
            })
            addToast({
                message: '카테고리가 추가되었습니다.',
                variant: 'success',
            })
            setName('')
            setThumbnailUrl('')
            onSuccess()
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
            className="space-y-3 rounded-xl border border-gray-100 p-4 dark:border-[#3a3a44]"
        >
            <p className="text-xs font-semibold text-gray-500 dark:text-[#848494]">
                새 카테고리 추가
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                    <label className="text-[11px] font-medium text-gray-500 dark:text-[#adadb8]">
                        이름 <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="예: 발로란트, 리그 오브 레전드"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1] dark:placeholder-[#848494]"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[11px] font-medium text-gray-500 dark:text-[#adadb8]">
                        썸네일 URL (선택)
                    </label>
                    <input
                        type="url"
                        value={thumbnailUrl}
                        onChange={(e) => setThumbnailUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1] dark:placeholder-[#848494]"
                    />
                </div>
            </div>
            <button
                type="submit"
                disabled={createMutation.isPending}
                className="cursor-pointer w-full rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
            >
                {createMutation.isPending ? '추가 중...' : '카테고리 추가'}
            </button>
        </form>
    )
}

interface EditCategoryModalProps {
    category: CategoryItem
    onConfirm: (payload: UpdateCategoryRequest) => void
    onCancel: () => void
    isPending: boolean
}

function EditCategoryModal({
    category,
    onConfirm,
    onCancel,
    isPending,
}: EditCategoryModalProps) {
    const [name, setName] = useState(category.name)
    const [thumbnailUrl, setThumbnailUrl] = useState(
        category.thumbnailUrl ?? '',
    )
    const { addToast } = useAdminToast()

    useEffect(() => {
        setName(category.name)
        setThumbnailUrl(category.thumbnailUrl ?? '')
    }, [category])

    function handleSubmit(e: React.FormEvent): void {
        e.preventDefault()
        const trimmedName = name.trim()
        if (trimmedName.length === 0) {
            addToast({
                message: '카테고리 이름을 입력해주세요.',
                variant: 'error',
            })
            return
        }
        const trimmedThumbnailUrl = thumbnailUrl.trim()
        onConfirm({
            name: trimmedName,
            thumbnailUrl:
                trimmedThumbnailUrl.length > 0 ? trimmedThumbnailUrl : null,
        })
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 dark:bg-black/70"
            onClick={(e) => {
                if (e.target === e.currentTarget && !isPending) onCancel()
            }}
        >
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-[#1a1a23]">
                <form onSubmit={handleSubmit}>
                    <div className="px-6 py-5">
                        <h3 className="text-base font-bold text-gray-900 dark:text-[#efeff1]">
                            카테고리 수정
                        </h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-[#adadb8]">
                            카테고리 이름과 썸네일 URL을 수정합니다.
                        </p>

                        <div className="mt-4 space-y-3">
                            <div className="space-y-1">
                                <label className="text-[11px] font-medium text-gray-500 dark:text-[#adadb8]">
                                    이름 <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="예: 발로란트, 리그 오브 레전드"
                                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1] dark:placeholder-[#848494]"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-medium text-gray-500 dark:text-[#adadb8]">
                                    썸네일 URL (선택)
                                </label>
                                <input
                                    type="url"
                                    value={thumbnailUrl}
                                    onChange={(e) =>
                                        setThumbnailUrl(e.target.value)
                                    }
                                    placeholder="https://..."
                                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1] dark:placeholder-[#848494]"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 border-t border-gray-100 px-6 py-4 dark:border-[#3a3a44]">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isPending}
                            className="cursor-pointer flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-[#3a3a44] dark:text-[#adadb8] dark:hover:bg-[#26262e]"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="cursor-pointer flex-1 rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
                        >
                            {isPending ? '수정 중...' : '수정'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function CategoryManagePage() {
    const { data, isLoading, isError } = useCategories()
    const crawlMutation = useCrawlCategories()
    const insertMutation = useInsertCategories()
    const deleteMutation = useDeleteCategory()
    const updateMutation = useUpdateCategory()
    const { addToast } = useAdminToast()
    const [deletingCategory, setDeletingCategory] =
        useState<CategoryItem | null>(null)
    const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(
        null,
    )
    const [searchQuery, setSearchQuery] = useState('')
    const [crawledCategories, setCrawledCategories] = useState<
        CrawledCategoryItem[]
    >([])
    const [selectedCrawledIds, setSelectedCrawledIds] = useState<string[]>([])

    const categories = data?.categories ?? []
    const filteredCategories =
        searchQuery.trim().length > 0
            ? categories.filter((c) =>
                  c.name
                      .toLowerCase()
                      .includes(searchQuery.trim().toLowerCase()),
              )
            : categories

    async function handleDelete(): Promise<void> {
        if (deletingCategory === null) return
        try {
            await deleteMutation.mutateAsync(deletingCategory.id)
            addToast({
                message: `'${deletingCategory.name}' 카테고리가 삭제되었습니다.`,
                variant: 'success',
            })
            setDeletingCategory(null)
        } catch (error) {
            const message = getErrorMessage(error)
            if (message !== null) addToast({ message, variant: 'error' })
        }
    }

    async function handleUpdate(payload: UpdateCategoryRequest): Promise<void> {
        if (editingCategory === null) return
        try {
            await updateMutation.mutateAsync({
                id: editingCategory.id,
                body: payload,
            })
            addToast({
                message: `'${payload.name}' 카테고리가 수정되었습니다.`,
                variant: 'success',
            })
            setEditingCategory(null)
        } catch (error) {
            const message = getErrorMessage(error)
            if (message !== null) addToast({ message, variant: 'error' })
        }
    }

    async function handleCrawlCategories(): Promise<void> {
        try {
            const result = await crawlMutation.mutateAsync({ size: 50 })
            setCrawledCategories(result.categories)
            setSelectedCrawledIds([])
            addToast({
                message: `카테고리 ${result.categories.length}건을 가져왔습니다.`,
                variant: 'success',
            })
        } catch (error) {
            const message = getErrorMessage(error)
            if (message !== null) addToast({ message, variant: 'error' })
        }
    }

    async function handleInsertCategories(): Promise<void> {
        if (selectedCrawledIds.length === 0) return
        try {
            const selected = crawledCategories.filter((category) =>
                selectedCrawledIds.includes(category.categoryId),
            )
            const result = await insertMutation.mutateAsync({
                categories: selected,
            })
            const failedCount = Math.max(
                selected.length - result.insertedCount,
                0,
            )

            const insertedSet = new Set(selectedCrawledIds)
            setCrawledCategories((prev) =>
                prev.filter(
                    (category) => !insertedSet.has(category.categoryId),
                ),
            )
            setSelectedCrawledIds([])

            addToast({
                message:
                    failedCount === 0
                        ? `카테고리 ${result.insertedCount}건을 반영했습니다.`
                        : `반영 ${result.insertedCount}건, 실패 ${failedCount}건`,
                variant: failedCount === 0 ? 'success' : 'error',
            })
        } catch (error) {
            const message = getErrorMessage(error)
            if (message !== null) addToast({ message, variant: 'error' })
        }
    }

    function toggleCrawledSelected(categoryId: string): void {
        setSelectedCrawledIds((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId],
        )
    }

    const allCrawledChecked =
        crawledCategories.length > 0 &&
        selectedCrawledIds.length === crawledCategories.length

    return (
        <>
            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-900 dark:text-[#efeff1]">
                    카테고리 관리
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-[#adadb8]">
                    방송에 연결할 게임 및 콘텐츠 카테고리를 관리합니다.
                </p>
            </div>

            <div className="space-y-4">
                <div className="rounded-xl border border-gray-100 p-4 dark:border-[#3a3a44]">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 dark:text-[#848494]">
                                카테고리 크롤링
                            </p>
                            <p className="mt-1 text-xs text-gray-400 dark:text-[#848494]">
                                CHZZK 라이브 카테고리 API 기준 상위 50개를
                                조회합니다.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                void handleCrawlCategories()
                            }}
                            disabled={crawlMutation.isPending}
                            className="cursor-pointer rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
                        >
                            {crawlMutation.isPending
                                ? '크롤링 중...'
                                : '크롤링 실행'}
                        </button>
                    </div>

                    {crawledCategories.length > 0 && (
                        <>
                            <div className="mt-3 flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        void handleInsertCategories()
                                    }}
                                    disabled={
                                        selectedCrawledIds.length === 0 ||
                                        insertMutation.isPending
                                    }
                                    className="cursor-pointer rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-40"
                                >
                                    {insertMutation.isPending
                                        ? '반영 중...'
                                        : `선택 반영 (${selectedCrawledIds.length})`}
                                </button>
                                {selectedCrawledIds.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedCrawledIds([])
                                        }
                                        className="cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50 dark:border-[#3a3a44] dark:text-[#adadb8] dark:hover:bg-[#26262e]"
                                    >
                                        선택 해제
                                    </button>
                                )}
                            </div>

                            <div className="mt-3 overflow-hidden rounded-xl border border-gray-100 dark:border-[#3a3a44]">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50 dark:border-[#3a3a44] dark:bg-[#26262e]">
                                            <th className="w-10 px-3 py-2">
                                                <input
                                                    type="checkbox"
                                                    checked={allCrawledChecked}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedCrawledIds(
                                                                crawledCategories.map(
                                                                    (
                                                                        category,
                                                                    ) =>
                                                                        category.categoryId,
                                                                ),
                                                            )
                                                        } else {
                                                            setSelectedCrawledIds(
                                                                [],
                                                            )
                                                        }
                                                    }}
                                                    className="cursor-pointer"
                                                />
                                            </th>
                                            <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-500 dark:text-[#848494]">
                                                카테고리
                                            </th>
                                            <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-500 dark:text-[#848494]">
                                                라이브/시청자
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {crawledCategories.map((category) => (
                                            <tr
                                                key={category.categoryId}
                                                className="border-b border-gray-100 last:border-0 dark:border-[#3a3a44]"
                                            >
                                                <td className="px-3 py-2.5">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCrawledIds.includes(
                                                            category.categoryId,
                                                        )}
                                                        onChange={() =>
                                                            toggleCrawledSelected(
                                                                category.categoryId,
                                                            )
                                                        }
                                                        className="cursor-pointer"
                                                    />
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <CategoryThumbnail
                                                            src={
                                                                category.thumbnailUrl
                                                            }
                                                            name={category.name}
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-medium text-gray-800 dark:text-[#efeff1]">
                                                                {category.name}
                                                            </p>
                                                            <p className="truncate text-[11px] text-gray-400 dark:text-[#848494]">
                                                                {
                                                                    category.categoryType
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2.5 text-xs text-gray-500 dark:text-[#adadb8]">
                                                    {category.openLiveCount} /{' '}
                                                    {category.concurrentUserCount.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>

                <AddCategoryForm onSuccess={() => setSearchQuery('')} />

                <div className="rounded-xl border border-gray-100 dark:border-[#3a3a44]">
                    <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 dark:border-[#3a3a44]">
                        <div className="flex items-center gap-2">
                            <p className="text-xs font-semibold text-gray-500 dark:text-[#848494]">
                                카테고리 목록
                            </p>
                            {!isLoading && (
                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500 dark:bg-[#26262e] dark:text-[#848494]">
                                    {categories.length}개
                                </span>
                            )}
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="검색"
                            className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1] dark:placeholder-[#848494]"
                        />
                    </div>

                    {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                        </div>
                    )}

                    {isError && (
                        <div className="py-12 text-center text-sm text-red-500">
                            카테고리를 불러오는 중 오류가 발생했습니다.
                        </div>
                    )}

                    {!isLoading &&
                        !isError &&
                        filteredCategories.length === 0 && (
                            <div className="py-12 text-center text-sm text-gray-400 dark:text-[#848494]">
                                {searchQuery.trim().length > 0
                                    ? '검색 결과가 없습니다.'
                                    : '등록된 카테고리가 없습니다.'}
                            </div>
                        )}

                    {!isLoading &&
                        !isError &&
                        filteredCategories.length > 0 && (
                            <ul className="divide-y divide-gray-100 dark:divide-[#3a3a44]">
                                {filteredCategories.map((category) => (
                                    <li
                                        key={category.id}
                                        className="flex items-center gap-3 px-4 py-3"
                                    >
                                        <CategoryThumbnail
                                            src={category.thumbnailUrl}
                                            name={category.name}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-gray-800 dark:text-[#efeff1]">
                                                {category.name}
                                            </p>
                                            {category.thumbnailUrl !== null &&
                                                category.thumbnailUrl.length >
                                                    0 && (
                                                    <p className="mt-0.5 truncate text-[11px] text-gray-400 dark:text-[#848494]">
                                                        {category.thumbnailUrl}
                                                    </p>
                                                )}
                                        </div>
                                        <div className="flex shrink-0 items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setEditingCategory(category)
                                                }
                                                className="cursor-pointer rounded-lg border border-blue-100 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-50 dark:border-blue-900/30 dark:hover:bg-blue-900/10"
                                            >
                                                수정
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setDeletingCategory(
                                                        category,
                                                    )
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
            </div>

            {deletingCategory !== null && (
                <DeleteConfirmModal
                    category={deletingCategory}
                    onConfirm={() => {
                        void handleDelete()
                    }}
                    onCancel={() => setDeletingCategory(null)}
                    isPending={deleteMutation.isPending}
                />
            )}

            {editingCategory !== null && (
                <EditCategoryModal
                    category={editingCategory}
                    onConfirm={(payload) => {
                        void handleUpdate(payload)
                    }}
                    onCancel={() => setEditingCategory(null)}
                    isPending={updateMutation.isPending}
                />
            )}
        </>
    )
}
