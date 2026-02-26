import { useEffect, useRef, useState } from 'react'
import partnerMark from '../../../assets/mark.png'
import { ApiError } from '../../../lib/apiClient'
import {
    DraftPanelEditor,
    FinalResultPanelEditor,
    SchedulePanelEditor,
} from '../components'
import {
    useAdminStreamerSearch,
    useAdminToast,
    useAdminTournaments,
    useCreatePromotionConfig,
    useCreateTournament,
    useCreateTournamentTeam,
    useDeleteTournament,
    useDeleteTournamentMember,
    usePromotionConfig,
    useReorderPromotionPanels,
    useReorderTournamentTeams,
    useDeleteTournamentTeam,
    useTournamentTeams,
    useUpdatePromotionPanels,
    useUpdateTournament,
    useUpdateTournamentTeam,
    useUpsertTournamentMember,
} from '../hooks'
import type {
    CreateTournamentRequest,
    DraftContent,
    FinalResultContent,
    PromotionConfigRaw,
    PromotionPanelType,
    ScheduleContent,
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
    tournamentId: number
    teamId: number
    slot: SlotType
    onClose: () => void
}

function AssignDropdown({
    tournamentId,
    teamId,
    slot,
    onClose,
}: AssignDropdownProps) {
    const { addToast } = useAdminToast()
    const upsertMember = useUpsertTournamentMember(tournamentId, teamId)
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
    tournamentId: number
    teamId: number
    slot: SlotType
    label: string
    member: TournamentAdminMember | undefined
    isFirst: boolean
    isStaff: boolean
}

function MemberRow({
    tournamentId,
    teamId,
    slot,
    label,
    member,
    isFirst,
    isStaff,
}: MemberRowProps) {
    const { addToast } = useAdminToast()
    const deleteMember = useDeleteTournamentMember(tournamentId, teamId)
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
                                tournamentId={tournamentId}
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
    tournamentId: number
    team: TournamentAdminTeam
}

function TeamCard({ tournamentId, team }: TeamCardProps) {
    const { addToast } = useAdminToast()
    const updateTeam = useUpdateTournamentTeam(tournamentId, team.id)
    const deleteTeam = useDeleteTournamentTeam(tournamentId)

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
                            tournamentId={tournamentId}
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
                        tournamentId={tournamentId}
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
                            tournamentId={tournamentId}
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
                        tournamentId={tournamentId}
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
function AddTeamCard({ tournamentId }: { tournamentId: number }) {
    const { addToast } = useAdminToast()
    const createTeam = useCreateTournamentTeam(tournamentId)
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
    const [showMetaEditor, setShowMetaEditor] = useState(false)
    const [isRosterSectionCollapsed, setIsRosterSectionCollapsed] =
        useState(false)
    const [metaForm, setMetaForm] = useState({
        name: '',
        startedAt: '',
        endedAt: '',
        bannerUrl: '',
    })
    const [draggingTeamId, setDraggingTeamId] = useState<number | null>(null)
    const [hoveredTeamId, setHoveredTeamId] = useState<number | null>(null)
    const [draggingPanelId, setDraggingPanelId] = useState<number | null>(null)
    const [hoveredPanelId, setHoveredPanelId] = useState<number | null>(null)
    const [savingPanelId, setSavingPanelId] = useState<number | null>(null)
    const [collapsedPromotionEditors, setCollapsedPromotionEditors] = useState<
        Record<number, boolean>
    >({})

    const tournaments = tournamentsData?.tournaments ?? []
    const selectedTournament = tournaments.find((t) => t.slug === selectedSlug)
    const selectedTournamentId = selectedTournament?.id ?? null

    // 대회 목록이 로드되면 첫 번째 대회 자동 선택
    useEffect(() => {
        if (selectedSlug === null && tournaments.length > 0) {
            setSelectedSlug(tournaments[0].slug)
        }
    }, [selectedSlug, tournaments])

    useEffect(() => {
        if (selectedTournament === undefined) {
            setMetaForm({
                name: '',
                startedAt: '',
                endedAt: '',
                bannerUrl: '',
            })
            return
        }
        setMetaForm({
            name: selectedTournament.name,
            startedAt: selectedTournament.startedAt?.slice(0, 10) ?? '',
            endedAt: selectedTournament.endedAt?.slice(0, 10) ?? '',
            bannerUrl: selectedTournament.bannerUrl ?? '',
        })
    }, [selectedTournament])

    useEffect(() => {
        setShowMetaEditor(false)
        setCollapsedPromotionEditors({})
    }, [selectedSlug])

    const { data, isLoading, isError, error } =
        useTournamentTeams(selectedTournamentId)
    const reorderTeams = useReorderTournamentTeams(selectedTournamentId ?? 0)

    const { data: promotionData, isLoading: isPromotionLoading } =
        usePromotionConfig(selectedTournamentId)
    const createPromotionConfig = useCreatePromotionConfig(
        selectedTournamentId ?? 0,
    )
    const updatePromotionPanels = useUpdatePromotionPanels(
        selectedTournamentId ?? 0,
    )
    const reorderPromotionPanels = useReorderPromotionPanels(
        selectedTournamentId ?? 0,
    )
    const updateTournament = useUpdateTournament(selectedTournamentId)
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
        if (selectedTournamentId === null || selectedTournament === undefined)
            return
        if (
            !confirm(
                `'${selectedTournament.name}' 대회를 삭제할까요?\n하위 팀과 선수 데이터도 모두 삭제됩니다.`,
            )
        )
            return
        try {
            await deleteTournament.mutateAsync(selectedTournamentId)
            setSelectedSlug(null)
            addToast({ message: '대회가 삭제되었습니다.', variant: 'success' })
        } catch (error) {
            addToast({ message: getErrorMessage(error), variant: 'error' })
        }
    }

    async function handleUpdateTournamentMeta(e: React.FormEvent) {
        e.preventDefault()
        if (selectedTournament === undefined) return
        if (metaForm.name.trim().length === 0) {
            addToast({ message: '대회명을 입력해주세요.', variant: 'error' })
            return
        }
        try {
            await updateTournament.mutateAsync({
                name: metaForm.name.trim(),
                startedAt:
                    metaForm.startedAt.trim().length > 0
                        ? metaForm.startedAt
                        : undefined,
                endedAt:
                    metaForm.endedAt.trim().length > 0
                        ? metaForm.endedAt
                        : undefined,
                bannerUrl:
                    metaForm.bannerUrl.trim().length > 0
                        ? metaForm.bannerUrl.trim()
                        : undefined,
            })
            addToast({
                message: '대회 메타가 저장되었습니다.',
                variant: 'success',
            })
            setShowMetaEditor(false)
        } catch (error) {
            addToast({ message: getErrorMessage(error), variant: 'error' })
        }
    }

    const sortedTeams = [...(data?.teams ?? [])].sort((a, b) => {
        if (a.teamOrder === b.teamOrder) return a.id - b.id
        return a.teamOrder - b.teamOrder
    })

    const PANEL_LABELS: Record<PromotionPanelType, string> = {
        DRAFT: '드래프트 & 참가자',
        PLAYER_LIST: '선수 목록',
        SCHEDULE: '일정 & 결과',
        FINAL_RESULT: '최종 결과',
        TEAMS: '팀',
    }
    const PANEL_ICONS: Record<PromotionPanelType, string> = {
        DRAFT: '🎯',
        PLAYER_LIST: '👥',
        SCHEDULE: '🗓️',
        FINAL_RESULT: '🏆',
        TEAMS: '🛡️',
    }

    function getSortedPanels(config: PromotionConfigRaw) {
        return [...config.panels].sort((a, b) => a.order_index - b.order_index)
    }

    function getVisiblePanels(config: PromotionConfigRaw) {
        return getSortedPanels(config).filter(
            (panel) => panel.enabled && !panel.hidden,
        )
    }

    function isVisiblePanelType(
        config: PromotionConfigRaw,
        type: PromotionPanelType,
    ) {
        return getVisiblePanels(config).some((panel) => panel.type === type)
    }

    function shouldShowRosterEditor(config: PromotionConfigRaw) {
        return isVisiblePanelType(config, 'PLAYER_LIST')
    }

    async function handleDropPanel(targetPanelId: number) {
        if (draggingPanelId === null || draggingPanelId === targetPanelId)
            return
        if (promotionData === undefined) return
        const sorted = getSortedPanels(promotionData)
        const sourceIndex = sorted.findIndex((p) => p.id === draggingPanelId)
        const targetIndex = sorted.findIndex((p) => p.id === targetPanelId)
        if (sourceIndex < 0 || targetIndex < 0) return
        const next = [...sorted]
        const [dragged] = next.splice(sourceIndex, 1)
        if (dragged === undefined) return
        next.splice(targetIndex, 0, dragged)
        try {
            await reorderPromotionPanels.mutateAsync({
                panelIdsInOrder: next.map((p) => p.id),
            })
        } catch {
            addToast({
                message: '패널 순서 변경에 실패했습니다.',
                variant: 'error',
            })
        }
    }

    async function handleTogglePanelVisibility(panelId: number) {
        if (promotionData === undefined) return
        const panel = promotionData.panels.find((p) => p.id === panelId)
        if (panel === undefined) return
        const nextVisible = !(panel.enabled && !panel.hidden)
        try {
            await updatePromotionPanels.mutateAsync({
                panels: [
                    {
                        id: panelId,
                        enabled: nextVisible,
                        hidden: false,
                    },
                ],
            })
        } catch {
            addToast({
                message: '패널 설정 변경에 실패했습니다.',
                variant: 'error',
            })
        }
    }

    async function handleCreatePromotion() {
        try {
            await createPromotionConfig.mutateAsync({})
            addToast({
                message: '대회 구성 설정이 생성되었습니다.',
                variant: 'success',
            })
        } catch {
            addToast({
                message: '대회 구성 설정 생성에 실패했습니다.',
                variant: 'error',
            })
        }
    }

    async function handleSavePanelContent(
        panelId: number,
        content: DraftContent | ScheduleContent | FinalResultContent,
    ) {
        setSavingPanelId(panelId)
        try {
            await updatePromotionPanels.mutateAsync({
                panels: [
                    {
                        id: panelId,
                        content: content as unknown as Record<string, unknown>,
                    },
                ],
            })
            addToast({
                message: '패널 내용이 저장되었습니다.',
                variant: 'success',
            })
        } catch {
            addToast({ message: '패널 저장에 실패했습니다.', variant: 'error' })
        } finally {
            setSavingPanelId(null)
        }
    }

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

    const schedulePreview =
        metaForm.startedAt.length > 0 || metaForm.endedAt.length > 0
            ? `${metaForm.startedAt || '미정'} ~ ${metaForm.endedAt || '미정'}`
            : '미정 ~ 미정'

    return (
        <div className="space-y-6 [&_button:disabled]:cursor-not-allowed [&_button]:cursor-pointer">
            {/* 헤더 */}
            <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-[#efeff1]">
                    오버워치
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-[#adadb8]">
                    대회를 선택한 뒤 메타와 구성요소를 함께 관리합니다.
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

            {selectedSlug !== null && (
                <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-[#3a3a44] dark:bg-[#1a1a23]">
                    <div className="border-b border-gray-100 px-4 py-3 dark:border-[#2e2e38]">
                        <p className="text-sm font-semibold text-gray-700 dark:text-[#efeff1]">
                            대회 메타
                        </p>
                    </div>
                    <div className="space-y-3 p-4">
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
                                    onClick={() =>
                                        setShowMetaEditor((prev) => !prev)
                                    }
                                    className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500 transition hover:border-blue-200 hover:text-blue-600 dark:border-[#3a3a44] dark:text-[#adadb8] dark:hover:border-blue-700 dark:hover:text-blue-400"
                                >
                                    {showMetaEditor ? '메타 닫기' : '메타 편집'}
                                </button>
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

                        {selectedTournament !== undefined && showMetaEditor && (
                            <form
                                onSubmit={(e) => {
                                    void handleUpdateTournamentMeta(e)
                                }}
                                className="grid gap-3"
                            >
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <input
                                        type="text"
                                        value={metaForm.name}
                                        onChange={(e) =>
                                            setMetaForm((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }))
                                        }
                                        placeholder="대회명"
                                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                    />
                                    <input
                                        type="url"
                                        value={metaForm.bannerUrl}
                                        onChange={(e) =>
                                            setMetaForm((prev) => ({
                                                ...prev,
                                                bannerUrl: e.target.value,
                                            }))
                                        }
                                        placeholder="배너 URL (선택)"
                                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                    />
                                </div>
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-[#2e2e38] dark:bg-[#20202a]">
                                    <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-[#adadb8]">
                                        일정
                                    </p>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <input
                                            type="date"
                                            value={metaForm.startedAt}
                                            onChange={(e) =>
                                                setMetaForm((prev) => ({
                                                    ...prev,
                                                    startedAt: e.target.value,
                                                }))
                                            }
                                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                        />
                                        <input
                                            type="date"
                                            value={metaForm.endedAt}
                                            onChange={(e) =>
                                                setMetaForm((prev) => ({
                                                    ...prev,
                                                    endedAt: e.target.value,
                                                }))
                                            }
                                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-gray-400 dark:text-[#adadb8]">
                                        기간 미리보기: {schedulePreview}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-[#2e2e38] dark:bg-[#20202a]">
                                    <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-[#adadb8]">
                                        구성요소
                                    </p>
                                    {isPromotionLoading && (
                                        <p className="text-xs text-gray-400 dark:text-[#adadb8]">
                                            구성요소 불러오는 중...
                                        </p>
                                    )}
                                    {!isPromotionLoading &&
                                        promotionData === undefined && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    void handleCreatePromotion()
                                                }}
                                                disabled={
                                                    createPromotionConfig.isPending
                                                }
                                                className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-600 disabled:opacity-50"
                                            >
                                                {createPromotionConfig.isPending
                                                    ? '생성 중...'
                                                    : '대회 구성 설정 생성'}
                                            </button>
                                        )}
                                    {promotionData !== undefined && (
                                        <div className="flex gap-2 overflow-x-auto pb-1">
                                            {getSortedPanels(promotionData)
                                                .filter(
                                                    (panel) =>
                                                        panel.type !== 'TEAMS',
                                                )
                                                .map((panel) => (
                                                    <div
                                                        key={`picker-${panel.id}`}
                                                        draggable
                                                        onDragStart={() => {
                                                            setDraggingPanelId(
                                                                panel.id,
                                                            )
                                                        }}
                                                        onDragEnd={() => {
                                                            setDraggingPanelId(
                                                                null,
                                                            )
                                                            setHoveredPanelId(
                                                                null,
                                                            )
                                                        }}
                                                        onDragOver={(e) => {
                                                            e.preventDefault()
                                                            setHoveredPanelId(
                                                                panel.id,
                                                            )
                                                        }}
                                                        onDrop={(e) => {
                                                            e.preventDefault()
                                                            void handleDropPanel(
                                                                panel.id,
                                                            )
                                                        }}
                                                        className={[
                                                            'w-44 shrink-0 rounded-xl border px-3 py-2 transition',
                                                            'cursor-grab active:cursor-grabbing',
                                                            draggingPanelId ===
                                                            panel.id
                                                                ? 'opacity-50'
                                                                : '',
                                                            hoveredPanelId ===
                                                                panel.id &&
                                                            draggingPanelId !==
                                                                null &&
                                                            draggingPanelId !==
                                                                panel.id
                                                                ? 'border-blue-400 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/10'
                                                                : 'border-gray-200 bg-white dark:border-[#2e2e38] dark:bg-[#1a1a23]',
                                                        ].join(' ')}
                                                    >
                                                        <div className="mb-2 flex items-center gap-2">
                                                            <span className="text-base">
                                                                {
                                                                    PANEL_ICONS[
                                                                        panel.type as PromotionPanelType
                                                                    ]
                                                                }
                                                            </span>
                                                            <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-700 dark:text-[#efeff1]">
                                                                {
                                                                    PANEL_LABELS[
                                                                        panel.type as PromotionPanelType
                                                                    ]
                                                                }
                                                            </span>
                                                            <span className="text-[10px] text-gray-300 dark:text-[#3a3a44]">
                                                                ☰
                                                            </span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                void handleTogglePanelVisibility(
                                                                    panel.id,
                                                                )
                                                            }}
                                                            className={[
                                                                'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition',
                                                                panel.enabled &&
                                                                !panel.hidden
                                                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                                    : 'bg-gray-100 text-gray-500 dark:bg-[#2e2e38] dark:text-[#adadb8]',
                                                            ].join(' ')}
                                                        >
                                                            <span>
                                                                {panel.enabled &&
                                                                !panel.hidden
                                                                    ? 'ON'
                                                                    : 'OFF'}
                                                            </span>
                                                            <span>
                                                                {panel.enabled &&
                                                                !panel.hidden
                                                                    ? '노출'
                                                                    : '비노출'}
                                                            </span>
                                                        </button>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowMetaEditor(false)}
                                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-50 dark:border-[#3a3a44] dark:text-[#adadb8] dark:hover:bg-[#26262e]"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updateTournament.isPending}
                                        className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
                                    >
                                        {updateTournament.isPending
                                            ? '저장 중...'
                                            : '메타 저장'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </section>
            )}

            {selectedSlug !== null &&
                showMetaEditor &&
                promotionData !== undefined &&
                getVisiblePanels(promotionData)
                    .filter(
                        (panel) =>
                            panel.type !== 'PLAYER_LIST' &&
                            panel.type !== 'TEAMS',
                    )
                    .map((panel) => (
                        <section
                            key={`promotion-editor-${panel.id}`}
                            className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-[#3a3a44] dark:bg-[#1a1a23]"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setCollapsedPromotionEditors((prev) => ({
                                        ...prev,
                                        [panel.id]: !(prev[panel.id] ?? false),
                                    }))
                                }
                                aria-expanded={
                                    !(
                                        collapsedPromotionEditors[panel.id] ??
                                        false
                                    )
                                }
                                aria-controls={`promotion-editor-panel-${panel.id}`}
                                className={[
                                    'flex w-full items-center justify-between px-4 py-3 text-left',
                                    (collapsedPromotionEditors[panel.id] ??
                                    false)
                                        ? ''
                                        : 'border-b border-gray-100 dark:border-[#2e2e38]',
                                ].join(' ')}
                            >
                                <span>
                                    <p className="text-sm font-semibold text-gray-700 dark:text-[#efeff1]">
                                        {
                                            PANEL_LABELS[
                                                panel.type as PromotionPanelType
                                            ]
                                        }
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-[#adadb8]">
                                        선수 목록과 같은 레벨에서 편집하는
                                        섹션입니다.
                                    </p>
                                </span>
                                <span className="text-xs text-gray-500 dark:text-[#adadb8]">
                                    {(collapsedPromotionEditors[panel.id] ??
                                    false)
                                        ? '펼치기'
                                        : '접기'}
                                </span>
                            </button>
                            <div
                                id={`promotion-editor-panel-${panel.id}`}
                                className={
                                    (collapsedPromotionEditors[panel.id] ??
                                    false)
                                        ? 'hidden'
                                        : 'block'
                                }
                            >
                                <div className="p-4">
                                    {panel.type === 'DRAFT' && (
                                        <DraftPanelEditor
                                            content={panel.content}
                                            onSave={(c: DraftContent) =>
                                                handleSavePanelContent(
                                                    panel.id,
                                                    c,
                                                )
                                            }
                                            isSaving={
                                                savingPanelId === panel.id
                                            }
                                        />
                                    )}
                                    {panel.type === 'SCHEDULE' && (
                                        <SchedulePanelEditor
                                            content={panel.content}
                                            teams={sortedTeams}
                                            onSave={(c: ScheduleContent) =>
                                                handleSavePanelContent(
                                                    panel.id,
                                                    c,
                                                )
                                            }
                                            isSaving={
                                                savingPanelId === panel.id
                                            }
                                        />
                                    )}
                                    {panel.type === 'FINAL_RESULT' && (
                                        <FinalResultPanelEditor
                                            content={panel.content}
                                            teams={sortedTeams}
                                            onSave={(c: FinalResultContent) =>
                                                handleSavePanelContent(
                                                    panel.id,
                                                    c,
                                                )
                                            }
                                            isSaving={
                                                savingPanelId === panel.id
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        </section>
                    ))}

            {/* 팀 목록 */}
            {selectedSlug === null &&
                !isTournamentsLoading &&
                tournaments.length === 0 && (
                    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500 dark:border-[#3a3a44] dark:bg-[#1a1a23] dark:text-[#adadb8]">
                        대회가 없습니다. 먼저 대회를 추가해주세요.
                    </div>
                )}

            {selectedSlug !== null &&
                showMetaEditor &&
                promotionData === undefined &&
                !isPromotionLoading && (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-4 py-3 text-xs text-gray-500 dark:border-[#3a3a44] dark:bg-[#1a1a23] dark:text-[#adadb8]">
                        대회 구성 설정을 생성하고 구성요소에서 `선수 목록`을
                        ON으로 변경하면 아래 편집 섹션이 표시됩니다.
                    </div>
                )}

            {selectedSlug !== null &&
                showMetaEditor &&
                promotionData !== undefined &&
                !shouldShowRosterEditor(promotionData) && (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-4 py-3 text-xs text-gray-500 dark:border-[#3a3a44] dark:bg-[#1a1a23] dark:text-[#adadb8]">
                        대회 구성요소에서 `선수 목록`을 ON으로 변경하면 아래
                        선수 목록 섹션이 표시됩니다.
                    </div>
                )}

            {selectedSlug !== null &&
                showMetaEditor &&
                promotionData !== undefined &&
                shouldShowRosterEditor(promotionData) && (
                    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-[#3a3a44] dark:bg-[#1a1a23]">
                        <button
                            type="button"
                            onClick={() =>
                                setIsRosterSectionCollapsed((prev) => !prev)
                            }
                            aria-expanded={!isRosterSectionCollapsed}
                            aria-controls="tournament-roster-panel"
                            className={[
                                'flex w-full items-center justify-between px-4 py-3 text-left',
                                isRosterSectionCollapsed
                                    ? ''
                                    : 'border-b border-gray-100 dark:border-[#2e2e38]',
                            ].join(' ')}
                        >
                            <span>
                                <p className="text-sm font-semibold text-gray-700 dark:text-[#efeff1]">
                                    선수 목록 (대회 구성 연동)
                                </p>
                                <p className="text-xs text-gray-400 dark:text-[#adadb8]">
                                    팀 카드 드래그로 순서를 변경할 수 있습니다.
                                </p>
                            </span>
                            <span className="text-xs text-gray-500 dark:text-[#adadb8]">
                                {isRosterSectionCollapsed ? '펼치기' : '접기'}
                            </span>
                        </button>

                        <div
                            id="tournament-roster-panel"
                            className={
                                isRosterSectionCollapsed ? 'hidden' : 'block'
                            }
                        >
                            <div className="p-4">
                                {isLoading && (
                                    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500 dark:border-[#3a3a44] dark:bg-[#1a1a23] dark:text-[#adadb8]">
                                        불러오는 중...
                                    </div>
                                )}

                                {isError && (
                                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-10 text-center text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
                                        {getErrorMessage(error)}
                                    </div>
                                )}

                                {!isLoading && !isError && (
                                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                        {sortedTeams.map((team) => (
                                            <div
                                                key={team.id}
                                                draggable={
                                                    !reorderTeams.isPending
                                                }
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
                                                    if (
                                                        hoveredTeamId ===
                                                        team.id
                                                    )
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
                                                <TeamCard
                                                    tournamentId={
                                                        selectedTournamentId ??
                                                        0
                                                    }
                                                    team={team}
                                                />
                                            </div>
                                        ))}
                                        <AddTeamCard
                                            tournamentId={
                                                selectedTournamentId ?? 0
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
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
