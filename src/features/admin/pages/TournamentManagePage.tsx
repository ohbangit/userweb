import { useEffect, useRef, useState } from 'react'
import partnerMark from '../../../assets/mark.png'
import { ApiError } from '../../../lib/apiClient'
import {
    useAdminStreamerSearch,
    useAdminToast,
    useAdminTournaments,
    useCreateTournament,
    useCreateTournamentTeam,
    useDeleteTournament,
    useDeleteTournamentMember,
    useReorderTournamentTeams,
    useDeleteTournamentTeam,
    useTournamentTeams,
    useUpdateTournament,
    useUpdateTournamentTeam,
    useUpsertTournamentMember,
} from '../hooks'
import type {
    CreateTournamentRequest,
    SlotType,
    TournamentAdminMember,
    TournamentAdminTeam,
    TournamentItem,
} from '../types'

const PLAYER_ROWS: { slot: SlotType; label: string; index: number }[] = [
    { slot: 'TNK', label: 'TNK', index: 0 },
    { slot: 'DPS', label: 'DPS', index: 0 },
    { slot: 'DPS', label: 'DPS', index: 1 },
    { slot: 'SPT', label: 'SPT', index: 0 },
    { slot: 'SPT', label: 'SPT', index: 1 },
]

const HEAD_COACH_ROW: { slot: SlotType; label: string } = {
    slot: 'HEAD_COACH',
    label: '감독',
}

function getErrorMessage(error: unknown): string {
    if (error instanceof ApiError) return error.message
    if (error instanceof Error) return error.message
    return '오류가 발생했습니다.'
}

// ── 배정 드롭다운 ──────────────────────────────────────────
interface AssignDropdownProps {
    slug: string
    teamId: number
    slot: SlotType
    onClose: () => void
}

function AssignDropdown({ slug, teamId, slot, onClose }: AssignDropdownProps) {
    const { addToast } = useAdminToast()
    const upsertMember = useUpsertTournamentMember(slug, teamId)
    const ref = useRef<HTMLDivElement>(null)

    const [mode, setMode] = useState<'streamer' | 'external'>('streamer')
    const [searchInput, setSearchInput] = useState('')
    const [selectedId, setSelectedId] = useState<number>()
    const [selectedName, setSelectedName] = useState('')
    const [extName, setExtName] = useState('')
    const [extUrl, setExtUrl] = useState('')

    const showSuggestions =
        mode === 'streamer' &&
        searchInput.trim().length > 0 &&
        selectedId === undefined
    const { data: suggestions, isFetching } = useAdminStreamerSearch(
        selectedId === undefined ? searchInput : '',
    )

    useEffect(() => {
        function onOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node))
                onClose()
        }
        document.addEventListener('mousedown', onOutside)
        return () => document.removeEventListener('mousedown', onOutside)
    }, [onClose])

    async function handleSubmit() {
        try {
            if (mode === 'streamer') {
                if (selectedId === undefined) {
                    addToast({
                        message: '스트리머를 선택해주세요.',
                        variant: 'error',
                    })
                    return
                }
                await upsertMember.mutateAsync({ slot, streamerId: selectedId })
            } else {
                if (extName.trim().length === 0) {
                    addToast({
                        message: '이름을 입력해주세요.',
                        variant: 'error',
                    })
                    return
                }
                await upsertMember.mutateAsync({
                    slot,
                    name: extName.trim(),
                    profileUrl:
                        extUrl.trim().length > 0 ? extUrl.trim() : undefined,
                })
            }
            addToast({ message: '배정되었습니다.', variant: 'success' })
            onClose()
        } catch (error) {
            addToast({ message: getErrorMessage(error), variant: 'error' })
        }
    }

    return (
        <div
            ref={ref}
            className="absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-[#3a3a44] dark:bg-[#26262e]"
        >
            {/* 모드 토글 */}
            <div className="mb-3 flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-[#1a1a23]">
                {(['streamer', 'external'] as const).map((m) => (
                    <button
                        key={m}
                        type="button"
                        onClick={() => setMode(m)}
                        className={[
                            'flex-1 rounded-md py-1 text-xs font-medium transition',
                            mode === m
                                ? 'bg-white text-gray-900 shadow-sm dark:bg-[#2e2e38] dark:text-[#efeff1]'
                                : 'text-gray-500 dark:text-[#adadb8]',
                        ].join(' ')}
                    >
                        {m === 'streamer' ? '관리 스트리머' : '외부인사'}
                    </button>
                ))}
            </div>

            {mode === 'streamer' ? (
                <div className="relative">
                    <input
                        type="text"
                        value={
                            selectedId !== undefined
                                ? selectedName
                                : searchInput
                        }
                        onChange={(e) => {
                            setSearchInput(e.target.value)
                            setSelectedId(undefined)
                            setSelectedName('')
                        }}
                        readOnly={selectedId !== undefined}
                        autoFocus
                        placeholder="스트리머 검색"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-[#3a3a44] dark:bg-[#1a1a23] dark:text-[#efeff1]"
                    />
                    {selectedId !== undefined && (
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedId(undefined)
                                setSelectedName('')
                                setSearchInput('')
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    )}
                    {showSuggestions && (
                        <div className="absolute z-50 mt-1 max-h-36 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white dark:border-[#3a3a44] dark:bg-[#26262e]">
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
                                suggestions?.map((s) => (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => {
                                            setSelectedId(s.id)
                                            setSelectedName(s.name)
                                            setSearchInput(s.name)
                                        }}
                                        className="w-full px-3 py-2 text-left text-xs text-gray-800 hover:bg-gray-50 dark:text-[#efeff1] dark:hover:bg-[#3a3a44]"
                                    >
                                        {s.name}
                                    </button>
                                ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-2">
                    <input
                        type="text"
                        value={extName}
                        onChange={(e) => setExtName(e.target.value)}
                        autoFocus
                        placeholder="이름"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-[#3a3a44] dark:bg-[#1a1a23] dark:text-[#efeff1]"
                    />
                    <input
                        type="url"
                        value={extUrl}
                        onChange={(e) => setExtUrl(e.target.value)}
                        placeholder="프로필 URL (나무위키 등, 선택)"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-[#3a3a44] dark:bg-[#1a1a23] dark:text-[#efeff1]"
                    />
                </div>
            )}

            <button
                type="button"
                onClick={() => {
                    void handleSubmit()
                }}
                disabled={upsertMember.isPending}
                className="mt-3 w-full rounded-lg bg-blue-500 py-2 text-xs font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
            >
                {upsertMember.isPending ? '배정 중...' : '배정'}
            </button>
        </div>
    )
}

// ── 멤버 행 ────────────────────────────────────────────────
interface MemberRowProps {
    slug: string
    teamId: number
    slot: SlotType
    label: string
    member: TournamentAdminMember | undefined
    isFirst: boolean
    isStaff: boolean
}

function MemberRow({
    slug,
    teamId,
    slot,
    label,
    member,
    isFirst,
    isStaff,
}: MemberRowProps) {
    const { addToast } = useAdminToast()
    const deleteMember = useDeleteTournamentMember(slug, teamId)
    const [assignOpen, setAssignOpen] = useState(false)

    async function handleDelete(memberId: number) {
        try {
            await deleteMember.mutateAsync({ memberId })
            addToast({ message: '삭제되었습니다.', variant: 'success' })
        } catch (error) {
            addToast({ message: getErrorMessage(error), variant: 'error' })
        }
    }

    return (
        <tr
            className={[
                'group',
                !isFirst
                    ? 'border-t border-gray-100 dark:border-[#2e2e38]'
                    : '',
            ].join(' ')}
        >
            {/* 포지션 뱃지 */}
            <td className="w-16 py-2 pl-4 pr-2">
                <span
                    className={[
                        'inline-block rounded-md px-2 py-0.5 text-[11px] font-bold tracking-wide',
                        isStaff
                            ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300'
                            : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300',
                    ].join(' ')}
                >
                    {label}
                </span>
            </td>

            {/* 선수 정보 또는 빈 슬롯 */}
            <td className="relative py-2 pl-1 pr-2">
                {member !== undefined ? (
                    <div className="flex items-center gap-2">
                        {member.avatarUrl !== null ? (
                            <img
                                src={member.avatarUrl}
                                alt={member.name}
                                className="h-6 w-6 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-500 dark:bg-[#3a3a44]">
                                {member.name.charAt(0)}
                            </div>
                        )}
                        <span className="text-sm text-gray-900 dark:text-[#efeff1]">
                            {member.name}
                        </span>
                        {member.isPartner && (
                            <img
                                src={partnerMark}
                                alt="파트너"
                                className="h-3.5 w-3.5"
                            />
                        )}
                        {member.profileUrl !== null && (
                            <a
                                href={member.profileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="프로필 링크"
                                className="text-gray-300 transition hover:text-blue-500 dark:text-[#3a3a44] dark:hover:text-blue-400"
                            >
                                <svg
                                    className="h-3.5 w-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </a>
                        )}
                    </div>
                ) : (
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setAssignOpen((prev) => !prev)}
                            className="rounded-md border border-dashed border-gray-300 px-3 py-1 text-xs text-gray-400 transition hover:border-blue-300 hover:text-blue-500 dark:border-[#3a3a44] dark:text-[#848494] dark:hover:border-blue-700 dark:hover:text-blue-400"
                        >
                            + 배정
                        </button>
                        {assignOpen && (
                            <AssignDropdown
                                slug={slug}
                                teamId={teamId}
                                slot={slot}
                                onClose={() => setAssignOpen(false)}
                            />
                        )}
                    </div>
                )}
            </td>

            {/* 삭제 버튼 */}
            <td className="w-10 py-2 pr-3 text-right">
                {member !== undefined && (
                    <button
                        type="button"
                        onClick={() => {
                            void handleDelete(member.id)
                        }}
                        disabled={deleteMember.isPending}
                        title="삭제"
                        className="text-gray-200 opacity-0 transition group-hover:opacity-100 hover:text-red-400 disabled:opacity-40 dark:text-[#3a3a44] dark:hover:text-red-400"
                    >
                        <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
            </td>
        </tr>
    )
}

// ── 팀 카드 ────────────────────────────────────────────────
interface TeamCardProps {
    slug: string
    team: TournamentAdminTeam
}

function TeamCard({ slug, team }: TeamCardProps) {
    const { addToast } = useAdminToast()
    const updateTeam = useUpdateTournamentTeam(slug, team.id)
    const deleteTeam = useDeleteTournamentTeam(slug)

    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState(team.name)
    const [logoUrl, setLogoUrl] = useState(team.logoUrl ?? '')
    const [teamOrder, setTeamOrder] = useState(String(team.teamOrder))

    async function handleUpdateTeam(e: React.FormEvent) {
        e.preventDefault()
        if (name.trim().length === 0) {
            addToast({ message: '팀 이름을 입력해주세요.', variant: 'error' })
            return
        }
        try {
            await updateTeam.mutateAsync({
                name: name.trim(),
                logoUrl: logoUrl.trim().length > 0 ? logoUrl.trim() : undefined,
                teamOrder: Number(teamOrder),
            })
            addToast({ message: '저장되었습니다.', variant: 'success' })
            setIsEditing(false)
        } catch (error) {
            addToast({ message: getErrorMessage(error), variant: 'error' })
        }
    }

    async function handleDeleteTeam() {
        if (!confirm(`'${team.name}' 팀을 삭제할까요?`)) return
        try {
            await deleteTeam.mutateAsync(team.id)
            addToast({ message: '팀이 삭제되었습니다.', variant: 'success' })
        } catch (error) {
            addToast({ message: getErrorMessage(error), variant: 'error' })
        }
    }

    // 슬롯별 멤버 그루핑
    const bySlot = team.members.reduce<Record<string, TournamentAdminMember[]>>(
        (acc, m) => {
            acc[m.slot] = [...(acc[m.slot] ?? []), m]
            return acc
        },
        {},
    )

    const playerCount = ['TNK', 'DPS', 'SPT'].reduce(
        (sum, s) => sum + (bySlot[s]?.length ?? 0),
        0,
    )
    const coachMembers = bySlot.COACH ?? []

    return (
        <div className="overflow-visible rounded-2xl border border-gray-200 bg-white dark:border-[#3a3a44] dark:bg-[#1a1a23]">
            {/* 헤더 */}
            <div className="flex items-center gap-2.5 border-b border-gray-100 px-4 py-3 dark:border-[#2e2e38]">
                {team.logoUrl !== null ? (
                    <img
                        src={team.logoUrl}
                        alt={team.name}
                        className="h-8 w-8 rounded-lg object-cover"
                    />
                ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                        {team.name.charAt(0)}
                    </div>
                )}

                <p className="min-w-0 flex-1 truncate text-sm font-bold text-gray-900 dark:text-[#efeff1]">
                    {team.name}
                </p>

                <span
                    className={[
                        'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold',
                        playerCount >= 5
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                            : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
                    ].join(' ')}
                >
                    {playerCount}/5
                </span>

                <button
                    type="button"
                    onClick={() => setIsEditing((prev) => !prev)}
                    className="shrink-0 rounded-lg border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-500 transition hover:border-blue-200 hover:text-blue-600 dark:border-[#3a3a44] dark:text-[#adadb8] dark:hover:border-blue-700 dark:hover:text-blue-400"
                >
                    편집
                </button>
                <button
                    type="button"
                    onClick={() => {
                        void handleDeleteTeam()
                    }}
                    disabled={deleteTeam.isPending}
                    className="shrink-0 rounded-lg border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-500 transition hover:border-red-200 hover:text-red-500 disabled:opacity-40 dark:border-[#3a3a44] dark:text-[#adadb8] dark:hover:border-red-900/60 dark:hover:text-red-400"
                >
                    삭제
                </button>
            </div>

            {/* 편집 폼 */}
            {isEditing && (
                <form
                    onSubmit={(e) => {
                        void handleUpdateTeam(e)
                    }}
                    className="flex flex-wrap gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3 dark:border-[#2e2e38] dark:bg-[#111118]"
                >
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="팀 이름"
                        className="min-w-28 flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                    />
                    <input
                        type="url"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="로고 URL (선택)"
                        className="min-w-36 flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                    />
                    <input
                        type="number"
                        min={0}
                        value={teamOrder}
                        onChange={(e) => setTeamOrder(e.target.value)}
                        placeholder="순서"
                        className="w-14 rounded-lg border border-gray-300 px-2 py-1.5 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                    />
                    <button
                        type="submit"
                        disabled={updateTeam.isPending}
                        className="rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
                    >
                        {updateTeam.isPending ? '저장 중...' : '저장'}
                    </button>
                </form>
            )}

            {/* 선수 포지션 표 */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-2 dark:border-[#2e2e38] dark:bg-[#20202a]">
                <p className="text-[11px] font-semibold tracking-wide text-gray-500 dark:text-[#adadb8]">
                    선수 라인업
                </p>
                <span className="text-[11px] font-medium text-gray-400 dark:text-[#848494]">
                    5인 고정
                </span>
            </div>
            <table className="w-full">
                <tbody>
                    {PLAYER_ROWS.map((row, idx) => (
                        <MemberRow
                            key={`${row.slot}-${row.index}`}
                            slug={slug}
                            teamId={team.id}
                            slot={row.slot}
                            label={row.label}
                            member={bySlot[row.slot]?.[row.index]}
                            isFirst={idx === 0}
                            isStaff={false}
                        />
                    ))}
                </tbody>
            </table>

            {/* 스태프 구분선 */}
            <div className="mx-4 border-t border-dashed border-gray-200 dark:border-[#2e2e38]" />
            <div className="flex items-center justify-between border-y border-gray-100 bg-gray-50 px-4 py-2 dark:border-[#2e2e38] dark:bg-[#20202a]">
                <p className="text-[11px] font-semibold tracking-wide text-gray-500 dark:text-[#adadb8]">
                    코치진
                </p>
                <span className="text-[11px] font-medium text-gray-400 dark:text-[#848494]">
                    감독 1명 · 코치 다수
                </span>
            </div>

            {/* 감독·코치 */}
            <table className="w-full">
                <tbody>
                    <MemberRow
                        key={HEAD_COACH_ROW.slot}
                        slug={slug}
                        teamId={team.id}
                        slot={HEAD_COACH_ROW.slot}
                        label={HEAD_COACH_ROW.label}
                        member={bySlot[HEAD_COACH_ROW.slot]?.[0]}
                        isFirst={true}
                        isStaff={true}
                    />
                    {coachMembers.map((member) => (
                        <MemberRow
                            key={`coach-${member.id}`}
                            slug={slug}
                            teamId={team.id}
                            slot={'COACH'}
                            label={'코치'}
                            member={member}
                            isFirst={false}
                            isStaff={true}
                        />
                    ))}
                    <MemberRow
                        key="coach-add"
                        slug={slug}
                        teamId={team.id}
                        slot={'COACH'}
                        label={'코치'}
                        member={undefined}
                        isFirst={false}
                        isStaff={true}
                    />
                </tbody>
            </table>

            {/* 카드 하단 여백 */}
            <div className="h-1" />
        </div>
    )
}

// ── + 스켈레톤 카드 ────────────────────────────────────────
function AddTeamCard({ slug }: { slug: string }) {
    const { addToast } = useAdminToast()
    const createTeam = useCreateTournamentTeam(slug)
    const [isOpen, setIsOpen] = useState(false)
    const [newName, setNewName] = useState('')

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault()
        if (newName.trim().length === 0) {
            addToast({ message: '팀 이름을 입력해주세요.', variant: 'error' })
            return
        }
        try {
            await createTeam.mutateAsync({ name: newName.trim() })
            addToast({ message: '팀이 생성되었습니다.', variant: 'success' })
            setNewName('')
            setIsOpen(false)
        } catch (error) {
            addToast({ message: getErrorMessage(error), variant: 'error' })
        }
    }

    if (isOpen) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#3a3a44] dark:bg-[#1a1a23]">
                <form
                    onSubmit={(e) => {
                        void handleCreate(e)
                    }}
                    className="space-y-3"
                >
                    <p className="text-sm font-semibold text-gray-700 dark:text-[#adadb8]">
                        새 팀 추가
                    </p>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="팀 이름"
                        autoFocus
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={createTeam.isPending}
                            className="flex-1 rounded-xl bg-emerald-500 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                        >
                            {createTeam.isPending ? '생성 중...' : '생성'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsOpen(false)
                                setNewName('')
                            }}
                            className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-500 transition hover:bg-gray-50 dark:border-[#3a3a44] dark:text-[#adadb8] dark:hover:bg-[#26262e]"
                        >
                            취소
                        </button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group flex min-h-[280px] w-full items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-transparent transition-colors hover:border-blue-300 hover:bg-blue-50/30 dark:border-[#3a3a44] dark:hover:border-blue-700/60 dark:hover:bg-blue-900/10"
        >
            <div className="flex flex-col items-center gap-2 text-gray-300 transition-colors group-hover:text-blue-400 dark:text-[#3a3a44] dark:group-hover:text-blue-500">
                <svg
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                    />
                </svg>
                <span className="text-sm font-medium">팀 추가</span>
            </div>
        </button>
    )
}

// ── 대회 생성 모달 ────────────────────────────────────────
interface CreateTournamentModalProps {
    onClose: () => void
}

function CreateTournamentModal({ onClose }: CreateTournamentModalProps) {
    const { addToast } = useAdminToast()
    const createTournament = useCreateTournament()
    const [form, setForm] = useState<CreateTournamentRequest>({
        slug: '',
        name: '',
        game: 'overwatch',
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (form.slug.trim().length === 0 || form.name.trim().length === 0) {
            addToast({
                message: '슬러그와 이름을 입력해주세요.',
                variant: 'error',
            })
            return
        }
        try {
            await createTournament.mutateAsync(form)
            addToast({ message: '대회가 생성되었습니다.', variant: 'success' })
            onClose()
        } catch (error) {
            addToast({ message: getErrorMessage(error), variant: 'error' })
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 dark:border-[#3a3a44] dark:bg-[#1a1a23]">
                <h2 className="mb-4 text-base font-bold text-gray-900 dark:text-[#efeff1]">
                    대회 추가
                </h2>
                <form
                    onSubmit={(e) => {
                        void handleSubmit(e)
                    }}
                    className="space-y-3"
                >
                    <input
                        type="text"
                        value={form.slug}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                slug: e.target.value,
                            }))
                        }
                        placeholder="슬러그 (예: runner-league-2025)"
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                    />
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                        placeholder="대회명 (예: 런너 리그 2025)"
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={createTournament.isPending}
                            className="flex-1 rounded-xl bg-blue-500 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
                        >
                            {createTournament.isPending ? '생성 중...' : '생성'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-500 transition hover:bg-gray-50 dark:border-[#3a3a44] dark:text-[#adadb8] dark:hover:bg-[#26262e]"
                        >
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ── 대회 선택 탭 ─────────────────────────────────────────
interface TournamentSelectorProps {
    tournaments: TournamentItem[]
    selectedSlug: string | null
    onSelect: (slug: string) => void
    onAdd: () => void
}

function TournamentSelector({
    tournaments,
    selectedSlug,
    onSelect,
    onAdd,
}: TournamentSelectorProps) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {tournaments.map((t) => (
                <button
                    key={t.slug}
                    type="button"
                    onClick={() => onSelect(t.slug)}
                    className={[
                        'rounded-xl px-4 py-2 text-sm font-medium transition',
                        selectedSlug === t.slug
                            ? 'bg-blue-500 text-white shadow-sm'
                            : 'border border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-[#3a3a44] dark:text-[#adadb8] dark:hover:border-blue-700 dark:hover:text-blue-400',
                    ].join(' ')}
                >
                    {t.name}
                </button>
            ))}
            <button
                type="button"
                onClick={onAdd}
                className="rounded-xl border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-400 transition hover:border-blue-300 hover:text-blue-500 dark:border-[#3a3a44] dark:text-[#adadb8] dark:hover:border-blue-700 dark:hover:text-blue-400"
            >
                + 대회 추가
            </button>
        </div>
    )
}

// ── 메인 페이지 ───────────────────────────────────────────
export default function TournamentManagePage() {
    const { addToast } = useAdminToast()
    const { data: tournamentsData, isLoading: isTournamentsLoading } =
        useAdminTournaments()
    const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [draggingTeamId, setDraggingTeamId] = useState<number | null>(null)
    const [hoveredTeamId, setHoveredTeamId] = useState<number | null>(null)

    const tournaments = tournamentsData?.tournaments ?? []

    // 대회 목록이 로드되면 첫 번째 대회 자동 선택
    useEffect(() => {
        if (selectedSlug === null && tournaments.length > 0) {
            setSelectedSlug(tournaments[0].slug)
        }
    }, [selectedSlug, tournaments])

    const slug = selectedSlug ?? ''
    const { data, isLoading, isError, error } = useTournamentTeams(slug)
    const reorderTeams = useReorderTournamentTeams(slug)

    const selectedTournament = tournaments.find((t) => t.slug === selectedSlug)
    const updateTournament = useUpdateTournament(selectedSlug ?? '')
    const deleteTournament = useDeleteTournament()

    function handleCopySlug() {
        if (selectedSlug !== null) {
            void navigator.clipboard.writeText(selectedSlug).then(() => {
                addToast({
                    message: '슬러그가 복사되었습니다.',
                    variant: 'success',
                })
            })
        }
    }

    async function handleToggleActive() {
        if (selectedTournament === undefined) return
        try {
            await updateTournament.mutateAsync({
                isActive: !selectedTournament.isActive,
            })
            addToast({
                message: `대회가 ${!selectedTournament.isActive ? '활성화' : '비활성화'}되었습니다.`,
                variant: 'success',
            })
        } catch (error) {
            addToast({ message: getErrorMessage(error), variant: 'error' })
        }
    }

    async function handleDeleteTournament() {
        if (selectedSlug === null || selectedTournament === undefined) return
        if (
            !confirm(
                `'${selectedTournament.name}' 대회를 삭제할까요?\n하위 팀과 선수 데이터도 모두 삭제됩니다.`,
            )
        )
            return
        try {
            await deleteTournament.mutateAsync(selectedSlug)
            setSelectedSlug(null)
            addToast({ message: '대회가 삭제되었습니다.', variant: 'success' })
        } catch (error) {
            addToast({ message: getErrorMessage(error), variant: 'error' })
        }
    }

    const sortedTeams = [...(data?.teams ?? [])].sort((a, b) => {
        if (a.teamOrder === b.teamOrder) return a.id - b.id
        return a.teamOrder - b.teamOrder
    })

    async function handleDropTeam(targetTeamId: number) {
        if (draggingTeamId === null || draggingTeamId === targetTeamId) return
        const sourceIndex = sortedTeams.findIndex(
            (team) => team.id === draggingTeamId,
        )
        const targetIndex = sortedTeams.findIndex(
            (team) => team.id === targetTeamId,
        )
        if (sourceIndex < 0 || targetIndex < 0) return
        const nextOrder = [...sortedTeams]
        const [draggedTeam] = nextOrder.splice(sourceIndex, 1)
        if (draggedTeam === undefined) return
        nextOrder.splice(targetIndex, 0, draggedTeam)
        const changedOrders = nextOrder
            .map((team, index) => ({
                teamId: team.id,
                teamOrder: index,
                hasChanged: team.teamOrder !== index,
            }))
            .filter((item) => item.hasChanged)
            .map(({ teamId, teamOrder }) => ({ teamId, teamOrder }))
        if (changedOrders.length === 0) return
        try {
            await reorderTeams.mutateAsync(changedOrders)
            addToast({
                message: '팀 순서가 변경되었습니다.',
                variant: 'success',
            })
        } catch (error) {
            addToast({ message: getErrorMessage(error), variant: 'error' })
        } finally {
            setDraggingTeamId(null)
            setHoveredTeamId(null)
        }
    }

    return (
        <div className="space-y-6">
            {/* 헤더 */}
            <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-[#efeff1]">
                    오버워치
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-[#adadb8]">
                    대회를 선택한 뒤 팀 구성과 선수 배정을 관리합니다.
                </p>
            </div>

            {/* 대회 선택 탭 */}
            {isTournamentsLoading ? (
                <div className="text-sm text-gray-400 dark:text-[#adadb8]">
                    대회 목록 불러오는 중...
                </div>
            ) : (
                <TournamentSelector
                    tournaments={tournaments}
                    selectedSlug={selectedSlug}
                    onSelect={setSelectedSlug}
                    onAdd={() => setShowCreateModal(true)}
                />
            )}

            {/* 선택된 대회 슬러그 */}
            {selectedSlug !== null && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-400 dark:text-[#adadb8]">
                        slug:
                    </span>
                    <code className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-[#2e2e38] dark:text-[#adadb8]">
                        {selectedSlug}
                    </code>
                    <button
                        type="button"
                        onClick={handleCopySlug}
                        className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-[#efeff1]"
                    >
                        복사
                    </button>
                    <div className="ml-auto flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                void handleToggleActive()
                            }}
                            disabled={updateTournament.isPending}
                            className={[
                                'rounded-lg px-3 py-1 text-xs font-medium transition disabled:opacity-50',
                                selectedTournament?.isActive === true
                                    ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-[#2e2e38] dark:text-[#adadb8] dark:hover:bg-[#3a3a44]',
                            ].join(' ')}
                        >
                            {selectedTournament?.isActive === true
                                ? '● 활성'
                                : '○ 비활성'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                void handleDeleteTournament()
                            }}
                            disabled={deleteTournament.isPending}
                            className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-400 transition hover:border-red-200 hover:text-red-500 disabled:opacity-50 dark:border-[#3a3a44] dark:text-[#adadb8] dark:hover:border-red-900/60 dark:hover:text-red-400"
                        >
                            대회 삭제
                        </button>
                    </div>
                </div>
            )}

            {/* 팀 목록 */}
            {selectedSlug === null &&
                !isTournamentsLoading &&
                tournaments.length === 0 && (
                    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500 dark:border-[#3a3a44] dark:bg-[#1a1a23] dark:text-[#adadb8]">
                        대회가 없습니다. 먼저 대회를 추가해주세요.
                    </div>
                )}

            {selectedSlug !== null && isLoading && (
                <div className="rounded-2xl border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500 dark:border-[#3a3a44] dark:bg-[#1a1a23] dark:text-[#adadb8]">
                    불러오는 중...
                </div>
            )}

            {selectedSlug !== null && isError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-10 text-center text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
                    {getErrorMessage(error)}
                </div>
            )}

            {selectedSlug !== null && !isLoading && !isError && (
                <>
                    <p className="text-xs text-gray-400 dark:text-[#adadb8]">
                        팀 카드를 드래그해서 순서를 변경할 수 있습니다.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {sortedTeams.map((team) => (
                            <div
                                key={team.id}
                                draggable={!reorderTeams.isPending}
                                onDragStart={() => {
                                    setDraggingTeamId(team.id)
                                }}
                                onDragEnd={() => {
                                    setDraggingTeamId(null)
                                    setHoveredTeamId(null)
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault()
                                }}
                                onDragEnter={() => {
                                    setHoveredTeamId(team.id)
                                }}
                                onDragLeave={() => {
                                    if (hoveredTeamId === team.id)
                                        setHoveredTeamId(null)
                                }}
                                onDrop={(e) => {
                                    e.preventDefault()
                                    void handleDropTeam(team.id)
                                }}
                                className={[
                                    'rounded-2xl transition',
                                    draggingTeamId === team.id
                                        ? 'opacity-60'
                                        : '',
                                    hoveredTeamId === team.id &&
                                    draggingTeamId !== null &&
                                    draggingTeamId !== team.id
                                        ? 'ring-2 ring-blue-300 ring-offset-2 ring-offset-white dark:ring-blue-700 dark:ring-offset-[#111118]'
                                        : '',
                                ].join(' ')}
                            >
                                <TeamCard slug={slug} team={team} />
                            </div>
                        ))}
                        <AddTeamCard slug={slug} />
                    </div>
                </>
            )}

            {/* 대회 생성 모달 */}
            {showCreateModal && (
                <CreateTournamentModal
                    onClose={() => setShowCreateModal(false)}
                />
            )}
        </div>
    )
}
