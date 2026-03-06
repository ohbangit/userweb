import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    AddTeamCard,
    CreateTournamentModal,
    DraftPanelEditor,
    F1DriversPanelEditor,
    F1RaceResultPanelEditor,
    F1RaceSchedulePanelEditor,
    F1StandingsPanelEditor,
    FinalResultPanelEditor,
    ParticipantEditor,
    SchedulePanelEditor,
    TeamCard,
    TournamentSelector,
} from '../components'
import {
    useAdminStreamerSearch,
    useAdminToast,
    useAdminTournaments,
    useCreatePromotionConfig,
    useDeleteTournament,
    usePromotionConfig,
    useReorderPromotionPanels,
    useReorderTournamentTeams,
    useTournamentTeams,
    useUpdatePromotionPanels,
    useUpdateTournament,
} from '../hooks'
import type {
    CommentatorItem,
    DraftContent,
    DraftParticipant,
    F1DriversContent,
    F1RaceResultContent,
    F1RaceScheduleContent,
    F1StandingsContent,
    FinalResultContent,
    PromotionPanelType,
    ScheduleContent,
} from '../types'
import { getErrorMessage } from '../utils'

type TournamentManageMode = 'overwatch' | 'racing'

interface TournamentManagePageProps {
    mode?: TournamentManageMode
}

function isRacingGame(game: string): boolean {
    const normalized = game.trim().toUpperCase()
    return normalized === 'RACING'
}

function isOverwatchGame(game: string): boolean {
    const normalized = game.trim().toUpperCase()
    return normalized === 'OVERWATCH' || normalized === 'OW'
}

const PANEL_LABELS: Record<PromotionPanelType, string> = {
    DRAFT: '드래프트',
    PLAYER_LIST: '참여자 목록',
    SCHEDULE: '일정 & 결과',
    FINAL_RESULT: '최종 결과',
    TEAMS: '팀 정보',
    F1_DRIVERS: '드라이버',
    F1_RACE_SCHEDULE: '레이스 일정',
    F1_RACE_RESULT: '레이스 결과',
    F1_STANDINGS: '챔피언십 순위',
}

const PANEL_ICONS: Record<PromotionPanelType, string> = {
    DRAFT: '🎯',
    PLAYER_LIST: '👥',
    SCHEDULE: '🗓️',
    FINAL_RESULT: '🏆',
    TEAMS: '🛡️',
    F1_DRIVERS: '🏎️',
    F1_RACE_SCHEDULE: '🏁',
    F1_RACE_RESULT: '📊',
    F1_STANDINGS: '🥇',
}

export default function TournamentManagePage({ mode = 'overwatch' }: TournamentManagePageProps) {
    const { addToast } = useAdminToast()
    const { data: tournamentsData, isLoading: isTournamentsLoading } = useAdminTournaments()
    const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showMetaEditor, setShowMetaEditor] = useState(false)
    const [isRosterSectionCollapsed, setIsRosterSectionCollapsed] = useState(false)
    const [isParticipantSectionCollapsed, setIsParticipantSectionCollapsed] = useState(false)
    const [metaForm, setMetaForm] = useState({
        name: '',
        startedAt: '',
        endedAt: '',
        bannerUrl: '',
        tags: [] as string[],
        isChzzkSupport: false,
        hostName: '',
        hostAvatarUrl: '',
        hostChannelUrl: '',
        hostIsPartner: false,
        hostStreamerId: null as number | null,
        links: [] as { label: string; url: string }[],
        // 부가 설명
        description: '',
        showDescription: false,
        // 중계자
        broadcasterName: '',
        broadcasterAvatarUrl: '',
        broadcasterChannelUrl: '',
        broadcasterIsPartner: false,
        broadcasterStreamerId: null as number | null,
        // 해설진
        commentators: [] as CommentatorItem[],
    })
    const [tagInput, setTagInput] = useState('')
    const [hostSearchInput, setHostSearchInput] = useState('')
    const [hostSelectedId, setHostSelectedId] = useState<number | undefined>()
    // 중계자 검색
    const [broadcasterSearchInput, setBroadcasterSearchInput] = useState('')
    const [broadcasterSelectedId, setBroadcasterSelectedId] = useState<number | undefined>()
    // 해설진 추가 검색
    const [commentatorSearchInput, setCommentatorSearchInput] = useState('')
    const [commentatorSelectedId, setCommentatorSelectedId] = useState<number | undefined>()
    const [draggingTeamId, setDraggingTeamId] = useState<number | null>(null)
    const [hoveredTeamId, setHoveredTeamId] = useState<number | null>(null)
    const [draggingPanelId, setDraggingPanelId] = useState<number | null>(null)
    const [hoveredPanelId, setHoveredPanelId] = useState<number | null>(null)
    const [savingPanelId, setSavingPanelId] = useState<number | null>(null)
    const [collapsedPromotionEditors, setCollapsedPromotionEditors] = useState<Record<number, boolean>>({})

    const tournaments = useMemo(() => {
        const allTournaments = tournamentsData?.tournaments ?? []
        return allTournaments.filter((tournament) => (mode === 'racing' ? isRacingGame(tournament.game) : !isRacingGame(tournament.game)))
    }, [mode, tournamentsData])
    const selectedTournament = useMemo(() => tournaments.find((t) => t.slug === selectedSlug), [tournaments, selectedSlug])
    const selectedTournamentId = selectedTournament?.id ?? null
    const isSelectedOverwatchTournament = selectedTournament !== undefined && isOverwatchGame(selectedTournament.game)

    useEffect(() => {
        if (selectedSlug === null && tournaments.length > 0) {
            setSelectedSlug(tournaments[0].slug)
        }
    }, [selectedSlug, tournaments])

    useEffect(() => {
        if (selectedSlug === null) return
        if (tournaments.some((tournament) => tournament.slug === selectedSlug)) return
        setSelectedSlug(null)
    }, [selectedSlug, tournaments])

    useEffect(() => {
        if (selectedTournament === undefined) {
            setMetaForm({
                name: '',
                startedAt: '',
                endedAt: '',
                bannerUrl: '',
                tags: [],
                isChzzkSupport: false,
                hostName: '',
                hostAvatarUrl: '',
                hostChannelUrl: '',
                hostIsPartner: false,
                hostStreamerId: null,
                links: [],
                description: '',
                showDescription: false,
                broadcasterName: '',
                broadcasterAvatarUrl: '',
                broadcasterChannelUrl: '',
                broadcasterIsPartner: false,
                broadcasterStreamerId: null,
                commentators: [],
            })
            setTagInput('')
            setHostSearchInput('')
            setHostSelectedId(undefined)
            setBroadcasterSearchInput('')
            setBroadcasterSelectedId(undefined)
            setCommentatorSearchInput('')
            setCommentatorSelectedId(undefined)
            return
        }
        setMetaForm({
            name: selectedTournament.name,
            startedAt: selectedTournament.startedAt?.slice(0, 10) ?? '',
            endedAt: selectedTournament.endedAt?.slice(0, 10) ?? '',
            bannerUrl: selectedTournament.bannerUrl ?? '',
            tags: selectedTournament.tags ?? [],
            isChzzkSupport: selectedTournament.isChzzkSupport ?? false,
            hostName: selectedTournament.hostName ?? '',
            hostAvatarUrl: selectedTournament.hostAvatarUrl ?? '',
            hostChannelUrl: selectedTournament.hostChannelUrl ?? '',
            hostIsPartner: selectedTournament.hostIsPartner ?? false,
            hostStreamerId: selectedTournament.hostStreamerId ?? null,
            links: selectedTournament.links ?? [],
            description: selectedTournament.description ?? '',
            showDescription: selectedTournament.showDescription ?? false,
            broadcasterName: selectedTournament.broadcasterName ?? '',
            broadcasterAvatarUrl: selectedTournament.broadcasterAvatarUrl ?? '',
            broadcasterChannelUrl: selectedTournament.broadcasterChannelUrl ?? '',
            broadcasterIsPartner: selectedTournament.broadcasterIsPartner ?? false,
            broadcasterStreamerId: selectedTournament.broadcasterStreamerId ?? null,
            commentators: selectedTournament.commentators ?? [],
        })
        setTagInput('')
        setHostSearchInput('')
        setHostSelectedId(selectedTournament.hostStreamerId ?? undefined)
        setBroadcasterSearchInput('')
        setBroadcasterSelectedId(selectedTournament.broadcasterStreamerId ?? undefined)
        setCommentatorSearchInput('')
        setCommentatorSelectedId(undefined)
    }, [selectedTournament])

    useEffect(() => {
        setShowMetaEditor(false)
        setCollapsedPromotionEditors({})
    }, [selectedSlug])

    const { data, isLoading, isError, error } = useTournamentTeams(selectedTournamentId)
    const reorderTeams = useReorderTournamentTeams(selectedTournamentId ?? 0)
    const { data: hostSuggestions, isFetching: isHostFetching } = useAdminStreamerSearch(
        hostSelectedId === undefined ? hostSearchInput : '',
    )
    const { data: broadcasterSuggestions, isFetching: isBroadcasterFetching } = useAdminStreamerSearch(
        broadcasterSelectedId === undefined ? broadcasterSearchInput : '',
    )
    const { data: commentatorSuggestions, isFetching: isCommentatorFetching } = useAdminStreamerSearch(
        commentatorSelectedId === undefined ? commentatorSearchInput : '',
    )

    const { data: promotionData, isLoading: isPromotionLoading } = usePromotionConfig(selectedTournamentId)
    const createPromotionConfig = useCreatePromotionConfig(selectedTournamentId ?? 0)
    const updatePromotionPanels = useUpdatePromotionPanels(selectedTournamentId ?? 0)
    const reorderPromotionPanels = useReorderPromotionPanels(selectedTournamentId ?? 0)
    const updateTournament = useUpdateTournament(selectedTournamentId)
    const deleteTournament = useDeleteTournament()

    const sortedTeams = useMemo(
        () =>
            [...(data?.teams ?? [])].sort((a, b) => {
                if (a.teamOrder === b.teamOrder) return a.id - b.id
                return a.teamOrder - b.teamOrder
            }),
        [data?.teams],
    )

    const sortedPanels = useMemo(
        () => (promotionData === undefined ? [] : [...promotionData.panels].sort((a, b) => a.order_index - b.order_index)),
        [promotionData],
    )

    const visiblePanels = useMemo(() => sortedPanels.filter((panel) => panel.enabled && !panel.hidden), [sortedPanels])

    const isParticipantSectionVisible = useMemo(() => visiblePanels.some((panel) => panel.type === 'PLAYER_LIST'), [visiblePanels])

    const isRosterEditorVisible = useMemo(() => visiblePanels.some((panel) => panel.type === 'TEAMS'), [visiblePanels])

    const schedulePreview = useMemo(
        () =>
            metaForm.startedAt.length > 0 || metaForm.endedAt.length > 0
                ? `${metaForm.startedAt || '미정'} ~ ${metaForm.endedAt || '미정'}`
                : '미정 ~ 미정',
        [metaForm.endedAt, metaForm.startedAt],
    )

    const draftPanel = useMemo(() => promotionData?.panels.find((p) => p.type === 'DRAFT'), [promotionData?.panels])

    const handleCopySlug = useCallback(() => {
        if (selectedSlug !== null) {
            void navigator.clipboard.writeText(selectedSlug).then(() => {
                addToast({
                    message: '슬러그가 복사되었습니다.',
                    variant: 'success',
                })
            })
        }
    }, [addToast, selectedSlug])

    const handleToggleActive = useCallback(async () => {
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
    }, [addToast, selectedTournament, updateTournament])

    const handleDeleteTournament = useCallback(async () => {
        if (selectedTournamentId === null || selectedTournament === undefined) return
        if (!confirm(`'${selectedTournament.name}' 대회를 삭제할까요?\n하위 팀과 선수 데이터도 모두 삭제됩니다.`)) return
        try {
            await deleteTournament.mutateAsync(selectedTournamentId)
            setSelectedSlug(null)
            addToast({ message: '대회가 삭제되었습니다.', variant: 'success' })
        } catch (error) {
            addToast({ message: getErrorMessage(error), variant: 'error' })
        }
    }, [addToast, deleteTournament, selectedTournament, selectedTournamentId])

    const handleUpdateTournamentMeta = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()
            if (selectedTournament === undefined) return
            if (metaForm.name.trim().length === 0) {
                addToast({
                    message: '대회명을 입력해주세요.',
                    variant: 'error',
                })
                return
            }
            try {
                await updateTournament.mutateAsync({
                    name: metaForm.name.trim(),
                    startedAt: metaForm.startedAt.trim().length > 0 ? metaForm.startedAt : undefined,
                    endedAt: metaForm.endedAt.trim().length > 0 ? metaForm.endedAt : undefined,
                    bannerUrl: metaForm.bannerUrl.trim().length > 0 ? metaForm.bannerUrl.trim() : undefined,
                    tags: metaForm.tags,
                    isChzzkSupport: metaForm.isChzzkSupport,
                    hostName: metaForm.hostName.trim().length > 0 ? metaForm.hostName.trim() : null,
                    hostAvatarUrl: metaForm.hostAvatarUrl.trim().length > 0 ? metaForm.hostAvatarUrl.trim() : null,
                    hostChannelUrl: metaForm.hostChannelUrl.trim().length > 0 ? metaForm.hostChannelUrl.trim() : null,
                    hostIsPartner: metaForm.hostIsPartner,
                    hostStreamerId: metaForm.hostStreamerId,
                    links: metaForm.links,
                    description: metaForm.description.trim().length > 0 ? metaForm.description.trim() : null,
                    showDescription: metaForm.showDescription,
                    broadcasterName: metaForm.broadcasterName.trim().length > 0 ? metaForm.broadcasterName.trim() : null,
                    broadcasterAvatarUrl: metaForm.broadcasterAvatarUrl.trim().length > 0 ? metaForm.broadcasterAvatarUrl.trim() : null,
                    broadcasterChannelUrl: metaForm.broadcasterChannelUrl.trim().length > 0 ? metaForm.broadcasterChannelUrl.trim() : null,
                    broadcasterIsPartner: metaForm.broadcasterIsPartner,
                    broadcasterStreamerId: metaForm.broadcasterStreamerId,
                    commentators: metaForm.commentators,
                })
                addToast({
                    message: '대회 메타가 저장되었습니다.',
                    variant: 'success',
                })
                setShowMetaEditor(false)
            } catch (error) {
                addToast({ message: getErrorMessage(error), variant: 'error' })
            }
        },
        [addToast, metaForm, selectedTournament, updateTournament],
    )

    const handleCreatePromotion = useCallback(async () => {
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
    }, [addToast, createPromotionConfig])

    const handleDropPanel = useCallback(
        async (targetPanelId: number) => {
            if (draggingPanelId === null || draggingPanelId === targetPanelId) return
            const sourceIndex = sortedPanels.findIndex((p) => p.id === draggingPanelId)
            const targetIndex = sortedPanels.findIndex((p) => p.id === targetPanelId)
            if (sourceIndex < 0 || targetIndex < 0) return
            const next = [...sortedPanels]
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
        },
        [addToast, draggingPanelId, reorderPromotionPanels, sortedPanels],
    )

    const handleTogglePanelVisibility = useCallback(
        async (panelId: number) => {
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
        },
        [addToast, promotionData, updatePromotionPanels],
    )

    const handleTogglePanelDefaultExpanded = useCallback(
        async (panelId: number) => {
            if (promotionData === undefined) return
            const panel = promotionData.panels.find((p) => p.id === panelId)
            if (panel === undefined) return

            const currentContent = typeof panel.content === 'object' && panel.content !== null ? panel.content : {}
            const nextDefaultExpanded = currentContent.defaultExpanded !== true

            try {
                await updatePromotionPanels.mutateAsync({
                    panels: [
                        {
                            id: panelId,
                            content: {
                                ...currentContent,
                                defaultExpanded: nextDefaultExpanded,
                            },
                        },
                    ],
                })
            } catch {
                addToast({
                    message: '패널 기본 펼침 설정 변경에 실패했습니다.',
                    variant: 'error',
                })
            }
        },
        [addToast, promotionData, updatePromotionPanels],
    )

    const handleSavePanelContent = useCallback(
        async (
            panelId: number,
            content:
                | DraftContent
                | ScheduleContent
                | FinalResultContent
                | F1DriversContent
                | F1RaceScheduleContent
                | F1RaceResultContent
                | F1StandingsContent,
        ) => {
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
                addToast({
                    message: '패널 저장에 실패했습니다.',
                    variant: 'error',
                })
            } finally {
                setSavingPanelId(null)
            }
        },
        [addToast, updatePromotionPanels],
    )

    const handleDropTeam = useCallback(
        async (targetTeamId: number) => {
            if (draggingTeamId === null || draggingTeamId === targetTeamId) return
            const sourceIndex = sortedTeams.findIndex((team) => team.id === draggingTeamId)
            const targetIndex = sortedTeams.findIndex((team) => team.id === targetTeamId)
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
        },
        [addToast, draggingTeamId, reorderTeams, sortedTeams],
    )

    const renderSetupPanel = useCallback(() => {
        return (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-[#2e2e38] dark:bg-[#20202a]">
                <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-[#adadb8]">대회 구성요소</p>
                {isPromotionLoading && <p className="text-xs text-gray-400 dark:text-[#adadb8]">구성요소 불러오는 중...</p>}
                {!isPromotionLoading && promotionData === undefined && (
                    <button
                        type="button"
                        onClick={() => {
                            void handleCreatePromotion()
                        }}
                        disabled={createPromotionConfig.isPending}
                        className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-600 disabled:opacity-50"
                    >
                        {createPromotionConfig.isPending ? '생성 중...' : '대회 구성 설정 생성'}
                    </button>
                )}
                {promotionData !== undefined && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {sortedPanels.map((panel) => (
                            <div
                                key={`picker-${panel.id}`}
                                draggable
                                onDragStart={() => {
                                    setDraggingPanelId(panel.id)
                                }}
                                onDragEnd={() => {
                                    setDraggingPanelId(null)
                                    setHoveredPanelId(null)
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault()
                                    setHoveredPanelId(panel.id)
                                }}
                                onDrop={(e) => {
                                    e.preventDefault()
                                    void handleDropPanel(panel.id)
                                }}
                                className={[
                                    'w-44 shrink-0 rounded-xl border px-3 py-2 transition',
                                    'cursor-grab active:cursor-grabbing',
                                    draggingPanelId === panel.id ? 'opacity-50' : '',
                                    hoveredPanelId === panel.id && draggingPanelId !== null && draggingPanelId !== panel.id
                                        ? 'border-blue-400 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/10'
                                        : 'border-gray-200 bg-white dark:border-[#2e2e38] dark:bg-[#1a1a23]',
                                ].join(' ')}
                            >
                                <div className="mb-2 flex items-center gap-2">
                                    <span className="text-base">{PANEL_ICONS[panel.type as PromotionPanelType]}</span>
                                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-700 dark:text-[#efeff1]">
                                        {PANEL_LABELS[panel.type as PromotionPanelType]}
                                    </span>
                                    <span className="text-[10px] text-gray-300 dark:text-[#3a3a44]">☰</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        void handleTogglePanelVisibility(panel.id)
                                    }}
                                    className={[
                                        'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition',
                                        panel.enabled && !panel.hidden
                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                            : 'bg-gray-100 text-gray-500 dark:bg-[#2e2e38] dark:text-[#adadb8]',
                                    ].join(' ')}
                                >
                                    <span>{panel.enabled && !panel.hidden ? 'ON' : 'OFF'}</span>
                                    <span>{panel.enabled && !panel.hidden ? '노출' : '비노출'}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        void handleTogglePanelDefaultExpanded(panel.id)
                                    }}
                                    className={[
                                        'mt-1 flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition',
                                        panel.content.defaultExpanded === true
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                            : 'bg-gray-100 text-gray-500 dark:bg-[#2e2e38] dark:text-[#adadb8]',
                                    ].join(' ')}
                                >
                                    <span>기본 펼침</span>
                                    <span>{panel.content.defaultExpanded === true ? 'ON' : 'OFF'}</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    }, [
        createPromotionConfig.isPending,
        draggingPanelId,
        handleCreatePromotion,
        handleDropPanel,
        handleTogglePanelDefaultExpanded,
        handleTogglePanelVisibility,
        hoveredPanelId,
        isPromotionLoading,
        promotionData,
        sortedPanels,
    ])

    const pageTitle = mode === 'racing' ? '레이싱' : '오버워치'
    const pageDescription =
        mode === 'racing'
            ? '레이싱 대회를 선택한 뒤 메타와 구성요소를 함께 관리합니다.'
            : '대회를 선택한 뒤 메타와 구성요소를 함께 관리합니다.'
    const createTournamentDefaultGame = mode === 'racing' ? 'racing' : 'overwatch'

    return (
        <div className="space-y-6 [&_button:disabled]:cursor-not-allowed [&_button]:cursor-pointer">
            <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-[#efeff1]">{pageTitle}</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-[#adadb8]">{pageDescription}</p>
            </div>

            {isTournamentsLoading ? (
                <div className="text-sm text-gray-400 dark:text-[#adadb8]">대회 목록 불러오는 중...</div>
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
                        <p className="text-sm font-semibold text-gray-700 dark:text-[#efeff1]">대회 메타</p>
                    </div>
                    <div className="space-y-3 p-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-gray-400 dark:text-[#adadb8]">slug:</span>
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
                                    onClick={() => setShowMetaEditor((prev) => !prev)}
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
                                    {selectedTournament?.isActive === true ? '● 활성' : '○ 비활성'}
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
                                    <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-[#adadb8]">일정</p>
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
                                    <p className="mt-2 text-xs text-gray-400 dark:text-[#adadb8]">기간 미리보기: {schedulePreview}</p>
                                </div>
                                {/* 태그 섹션 */}
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-[#2e2e38] dark:bg-[#20202a]">
                                    <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-[#adadb8]">태그</p>
                                    {/* 치지직 제작지원 */}
                                    <label className="mb-3 flex cursor-pointer items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={metaForm.isChzzkSupport}
                                            onChange={(e) =>
                                                setMetaForm((prev) => ({
                                                    ...prev,
                                                    isChzzkSupport: e.target.checked,
                                                }))
                                            }
                                            className="rounded"
                                        />
                                        <span className="text-xs text-gray-600 dark:text-[#efeff1]">치지직 제작지원</span>
                                    </label>
                                    {/* 태그 칩 */}
                                    {metaForm.tags.length > 0 && (
                                        <div className="mb-2 flex flex-wrap gap-1.5">
                                            {metaForm.tags.map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setMetaForm((prev) => ({
                                                                ...prev,
                                                                tags: prev.tags.filter((_, idx) => idx !== i),
                                                            }))
                                                        }
                                                        className="ml-0.5 text-blue-400 hover:text-red-500"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {/* 태그 입력 */}
                                    <div className="flex gap-1.5">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && tagInput.trim().length > 0) {
                                                    e.preventDefault()
                                                    setMetaForm((prev) => ({
                                                        ...prev,
                                                        tags: [...prev.tags, tagInput.trim()],
                                                    }))
                                                    setTagInput('')
                                                }
                                            }}
                                            placeholder="태그 입력 후 Enter"
                                            className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (tagInput.trim().length > 0) {
                                                    setMetaForm((prev) => ({
                                                        ...prev,
                                                        tags: [...prev.tags, tagInput.trim()],
                                                    }))
                                                    setTagInput('')
                                                }
                                            }}
                                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-500 transition hover:bg-gray-100 dark:border-[#3a3a44] dark:text-[#adadb8] dark:hover:bg-[#26262e]"
                                        >
                                            추가
                                        </button>
                                    </div>
                                </div>
                                {/* 스트리머 섹션 (주최자 / 중계자 / 해설진) */}
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-[#2e2e38] dark:bg-[#20202a]">
                                    <p className="mb-3 text-xs font-semibold text-gray-500 dark:text-[#adadb8]">스트리머</p>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                        {/* 주최자 */}
                                        <div className="flex flex-col gap-1.5">
                                            <p className="text-[11px] font-medium text-gray-400 dark:text-[#6b6b7a]">주최자</p>
                                            {hostSelectedId !== undefined ? (
                                                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-[#3a3a44] dark:bg-[#1a1a23]">
                                                    <div className="flex min-w-0 items-center gap-2">
                                                        {metaForm.hostAvatarUrl.length > 0 && (
                                                            <img
                                                                src={metaForm.hostAvatarUrl}
                                                                alt={metaForm.hostName}
                                                                className="h-6 w-6 shrink-0 rounded-full"
                                                            />
                                                        )}
                                                        <span className="min-w-0 truncate text-sm font-medium text-gray-800 dark:text-[#efeff1]">
                                                            {metaForm.hostName}
                                                        </span>
                                                        {metaForm.hostIsPartner && (
                                                            <span className="shrink-0 rounded-full bg-purple-50 px-1.5 py-0.5 text-[10px] text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                                                                파트너
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setHostSelectedId(undefined)
                                                            setHostSearchInput('')
                                                            setMetaForm((prev) => ({
                                                                ...prev,
                                                                hostName: '',
                                                                hostAvatarUrl: '',
                                                                hostChannelUrl: '',
                                                                hostIsPartner: false,
                                                                hostStreamerId: null,
                                                            }))
                                                        }}
                                                        className="ml-2 shrink-0 cursor-pointer text-gray-400 hover:text-red-500"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={hostSearchInput}
                                                        onChange={(e) => setHostSearchInput(e.target.value)}
                                                        placeholder="스트리머 검색"
                                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                                    />
                                                    {hostSearchInput.trim().length > 0 && (
                                                        <div className="absolute z-50 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-[#3a3a44] dark:bg-[#26262e]">
                                                            {isHostFetching && (
                                                                <p className="px-3 py-2 text-xs text-gray-500">검색 중...</p>
                                                            )}
                                                            {!isHostFetching && (hostSuggestions?.length ?? 0) === 0 && (
                                                                <p className="px-3 py-2 text-xs text-gray-500">결과 없음</p>
                                                            )}
                                                            {!isHostFetching &&
                                                                hostSuggestions?.map((s) => (
                                                                    <button
                                                                        key={s.id}
                                                                        type="button"
                                                                        onMouseDown={(e) => e.preventDefault()}
                                                                        onClick={() => {
                                                                            setHostSelectedId(s.id)
                                                                            setHostSearchInput('')
                                                                            setMetaForm((prev) => ({
                                                                                ...prev,
                                                                                hostName: s.name,
                                                                                hostAvatarUrl: s.channelImageUrl ?? '',
                                                                                hostChannelUrl:
                                                                                    s.channelId !== null
                                                                                        ? `https://chzzk.naver.com/live/${s.channelId}`
                                                                                        : '',
                                                                                hostIsPartner: s.isPartner,
                                                                                hostStreamerId: s.id,
                                                                            }))
                                                                        }}
                                                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition hover:bg-gray-50 dark:hover:bg-[#3a3a44]"
                                                                    >
                                                                        {s.channelImageUrl !== null && (
                                                                            <img
                                                                                src={s.channelImageUrl}
                                                                                alt={s.name}
                                                                                className="h-5 w-5 rounded-full"
                                                                            />
                                                                        )}
                                                                        <span className="text-gray-800 dark:text-[#efeff1]">{s.name}</span>
                                                                        {s.isPartner && (
                                                                            <span className="ml-auto rounded-full bg-purple-50 px-1.5 py-0.5 text-[10px] text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                                                                                파트너
                                                                            </span>
                                                                        )}
                                                                    </button>
                                                                ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {/* 중계자 */}
                                        <div className="flex flex-col gap-1.5">
                                            <p className="text-[11px] font-medium text-gray-400 dark:text-[#6b6b7a]">
                                                중계자
                                                <span className="ml-1 font-normal opacity-60">(없으면 주최자 직접 중계)</span>
                                            </p>
                                            {broadcasterSelectedId !== undefined ? (
                                                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-[#3a3a44] dark:bg-[#1a1a23]">
                                                    <div className="flex min-w-0 items-center gap-2">
                                                        {metaForm.broadcasterAvatarUrl.length > 0 && (
                                                            <img
                                                                src={metaForm.broadcasterAvatarUrl}
                                                                alt={metaForm.broadcasterName}
                                                                className="h-6 w-6 shrink-0 rounded-full"
                                                            />
                                                        )}
                                                        <span className="min-w-0 truncate text-sm font-medium text-gray-800 dark:text-[#efeff1]">
                                                            {metaForm.broadcasterName}
                                                        </span>
                                                        {metaForm.broadcasterIsPartner && (
                                                            <span className="shrink-0 rounded-full bg-purple-50 px-1.5 py-0.5 text-[10px] text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                                                                파트너
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setBroadcasterSelectedId(undefined)
                                                            setBroadcasterSearchInput('')
                                                            setMetaForm((prev) => ({
                                                                ...prev,
                                                                broadcasterName: '',
                                                                broadcasterAvatarUrl: '',
                                                                broadcasterChannelUrl: '',
                                                                broadcasterIsPartner: false,
                                                                broadcasterStreamerId: null,
                                                            }))
                                                        }}
                                                        className="ml-2 shrink-0 cursor-pointer text-gray-400 hover:text-red-500"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={broadcasterSearchInput}
                                                        onChange={(e) => setBroadcasterSearchInput(e.target.value)}
                                                        placeholder="스트리머 검색"
                                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                                    />
                                                    {broadcasterSearchInput.trim().length > 0 && (
                                                        <div className="absolute z-50 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-[#3a3a44] dark:bg-[#26262e]">
                                                            {isBroadcasterFetching && (
                                                                <p className="px-3 py-2 text-xs text-gray-500">검색 중...</p>
                                                            )}
                                                            {!isBroadcasterFetching && (broadcasterSuggestions?.length ?? 0) === 0 && (
                                                                <p className="px-3 py-2 text-xs text-gray-500">결과 없음</p>
                                                            )}
                                                            {!isBroadcasterFetching &&
                                                                broadcasterSuggestions?.map((s) => (
                                                                    <button
                                                                        key={s.id}
                                                                        type="button"
                                                                        onMouseDown={(e) => e.preventDefault()}
                                                                        onClick={() => {
                                                                            setBroadcasterSelectedId(s.id)
                                                                            setBroadcasterSearchInput('')
                                                                            setMetaForm((prev) => ({
                                                                                ...prev,
                                                                                broadcasterName: s.name,
                                                                                broadcasterAvatarUrl: s.channelImageUrl ?? '',
                                                                                broadcasterChannelUrl:
                                                                                    s.channelId !== null
                                                                                        ? `https://chzzk.naver.com/live/${s.channelId}`
                                                                                        : '',
                                                                                broadcasterIsPartner: s.isPartner,
                                                                                broadcasterStreamerId: s.id,
                                                                            }))
                                                                        }}
                                                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition hover:bg-gray-50 dark:hover:bg-[#3a3a44]"
                                                                    >
                                                                        {s.channelImageUrl !== null && (
                                                                            <img
                                                                                src={s.channelImageUrl}
                                                                                alt={s.name}
                                                                                className="h-5 w-5 rounded-full"
                                                                            />
                                                                        )}
                                                                        <span className="text-gray-800 dark:text-[#efeff1]">{s.name}</span>
                                                                        {s.isPartner && (
                                                                            <span className="ml-auto rounded-full bg-purple-50 px-1.5 py-0.5 text-[10px] text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                                                                                파트너
                                                                            </span>
                                                                        )}
                                                                    </button>
                                                                ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {/* 해설진 */}
                                        <div className="flex flex-col gap-1.5">
                                            <p className="text-[11px] font-medium text-gray-400 dark:text-[#6b6b7a]">
                                                해설진
                                                <span className="ml-1 font-normal opacity-60">(선택)</span>
                                            </p>
                                            {metaForm.commentators.length > 0 && (
                                                <div className="space-y-1">
                                                    {metaForm.commentators.map((c, i) => (
                                                        <div
                                                            key={i}
                                                            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 dark:border-[#3a3a44] dark:bg-[#1a1a23]"
                                                        >
                                                            {c.avatarUrl !== null && c.avatarUrl.length > 0 && (
                                                                <img
                                                                    src={c.avatarUrl}
                                                                    alt={c.name}
                                                                    className="h-5 w-5 shrink-0 rounded-full"
                                                                />
                                                            )}
                                                            <span className="min-w-0 flex-1 truncate text-xs text-gray-700 dark:text-[#efeff1]">
                                                                {c.name}
                                                                {c.isPartner && (
                                                                    <span className="ml-1.5 text-[10px] text-purple-500">파트너</span>
                                                                )}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setMetaForm((prev) => ({
                                                                        ...prev,
                                                                        commentators: prev.commentators.filter((_, idx) => idx !== i),
                                                                    }))
                                                                }
                                                                className="shrink-0 text-gray-400 hover:text-red-500"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={commentatorSelectedId !== undefined ? '' : commentatorSearchInput}
                                                    onChange={(e) => {
                                                        setCommentatorSearchInput(e.target.value)
                                                        setCommentatorSelectedId(undefined)
                                                    }}
                                                    placeholder="추가할 스트리머 검색"
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                                />
                                                {commentatorSelectedId === undefined && commentatorSearchInput.trim().length > 0 && (
                                                    <div className="absolute z-50 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-[#3a3a44] dark:bg-[#26262e]">
                                                        {isCommentatorFetching && (
                                                            <p className="px-3 py-2 text-xs text-gray-500">검색 중...</p>
                                                        )}
                                                        {!isCommentatorFetching && (commentatorSuggestions?.length ?? 0) === 0 && (
                                                            <p className="px-3 py-2 text-xs text-gray-500">결과 없음</p>
                                                        )}
                                                        {!isCommentatorFetching &&
                                                            commentatorSuggestions?.map((s) => (
                                                                <button
                                                                    key={s.id}
                                                                    type="button"
                                                                    onMouseDown={(e) => e.preventDefault()}
                                                                    onClick={() => {
                                                                        const alreadyAdded = metaForm.commentators.some(
                                                                            (c) => c.streamerId === s.id,
                                                                        )
                                                                        if (!alreadyAdded) {
                                                                            setMetaForm((prev) => ({
                                                                                ...prev,
                                                                                commentators: [
                                                                                    ...prev.commentators,
                                                                                    {
                                                                                        name: s.name,
                                                                                        avatarUrl: s.channelImageUrl ?? null,
                                                                                        channelUrl:
                                                                                            s.channelId !== null
                                                                                                ? `https://chzzk.naver.com/live/${s.channelId}`
                                                                                                : null,
                                                                                        isPartner: s.isPartner,
                                                                                        streamerId: s.id,
                                                                                    },
                                                                                ],
                                                                            }))
                                                                        }
                                                                        setCommentatorSearchInput('')
                                                                        setCommentatorSelectedId(undefined)
                                                                    }}
                                                                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition hover:bg-gray-50 dark:hover:bg-[#3a3a44]"
                                                                >
                                                                    {s.channelImageUrl !== null && (
                                                                        <img
                                                                            src={s.channelImageUrl}
                                                                            alt={s.name}
                                                                            className="h-5 w-5 rounded-full"
                                                                        />
                                                                    )}
                                                                    <span className="text-gray-800 dark:text-[#efeff1]">{s.name}</span>
                                                                    {s.isPartner && (
                                                                        <span className="ml-auto rounded-full bg-purple-50 px-1.5 py-0.5 text-[10px] text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                                                                            파트너
                                                                        </span>
                                                                    )}
                                                                </button>
                                                            ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* 부가 설명 섹션 */}
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-[#2e2e38] dark:bg-[#20202a]">
                                    <div className="mb-2 flex items-center justify-between">
                                        <p className="text-xs font-semibold text-gray-500 dark:text-[#adadb8]">부가 설명</p>
                                        <label className="flex cursor-pointer items-center gap-1.5">
                                            <input
                                                type="checkbox"
                                                checked={metaForm.showDescription}
                                                onChange={(e) =>
                                                    setMetaForm((prev) => ({
                                                        ...prev,
                                                        showDescription: e.target.checked,
                                                    }))
                                                }
                                                className="rounded"
                                            />
                                            <span className="text-xs text-gray-600 dark:text-[#efeff1]">표시</span>
                                        </label>
                                    </div>
                                    <textarea
                                        value={metaForm.description}
                                        onChange={(e) =>
                                            setMetaForm((prev) => ({
                                                ...prev,
                                                description: e.target.value,
                                            }))
                                        }
                                        placeholder="대회 관련 부가 안내사항을 입력하세요 (선택)"
                                        rows={3}
                                        className="w-full resize-y rounded-xl border border-gray-300 px-3 py-2 text-sm dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                    />
                                </div>
                                {/* 추가 링크 섹션 */}
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-[#2e2e38] dark:bg-[#20202a]">
                                    <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-[#adadb8]">추가 링크</p>
                                    <div className="space-y-2">
                                        {metaForm.links.map((link, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={link.label}
                                                    onChange={(e) =>
                                                        setMetaForm((prev) => ({
                                                            ...prev,
                                                            links: prev.links.map((l, idx) =>
                                                                idx === i
                                                                    ? {
                                                                          ...l,
                                                                          label: e.target.value,
                                                                      }
                                                                    : l,
                                                            ),
                                                        }))
                                                    }
                                                    placeholder="레이블"
                                                    className="w-28 shrink-0 rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                                />
                                                <input
                                                    type="url"
                                                    value={link.url}
                                                    onChange={(e) =>
                                                        setMetaForm((prev) => ({
                                                            ...prev,
                                                            links: prev.links.map((l, idx) =>
                                                                idx === i
                                                                    ? {
                                                                          ...l,
                                                                          url: e.target.value,
                                                                      }
                                                                    : l,
                                                            ),
                                                        }))
                                                    }
                                                    placeholder="URL"
                                                    className="min-w-0 flex-1 rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs dark:border-[#3a3a44] dark:bg-[#26262e] dark:text-[#efeff1]"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setMetaForm((prev) => ({
                                                            ...prev,
                                                            links: prev.links.filter((_, idx) => idx !== i),
                                                        }))
                                                    }
                                                    className="shrink-0 text-gray-400 hover:text-red-500"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setMetaForm((prev) => ({
                                                    ...prev,
                                                    links: [...prev.links, { label: '', url: '' }],
                                                }))
                                            }
                                            className="mt-1 text-xs text-blue-500 hover:text-blue-600"
                                        >
                                            + 링크 추가
                                        </button>
                                    </div>
                                </div>
                                {renderSetupPanel()}
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
                                        {updateTournament.isPending ? '저장 중...' : '메타 저장'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </section>
            )}

            {selectedSlug !== null &&
                promotionData !== undefined &&
                visiblePanels
                    .filter((panel) => panel.type === 'DRAFT')
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
                                aria-expanded={!(collapsedPromotionEditors[panel.id] ?? false)}
                                aria-controls={`promotion-editor-panel-${panel.id}`}
                                className={[
                                    'flex w-full items-center justify-between px-4 py-3 text-left',
                                    (collapsedPromotionEditors[panel.id] ?? false) ? '' : 'border-b border-gray-100 dark:border-[#2e2e38]',
                                ].join(' ')}
                            >
                                <span>
                                    <p className="text-sm font-semibold text-gray-700 dark:text-[#efeff1]">
                                        {PANEL_LABELS[panel.type as PromotionPanelType]}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-[#adadb8]">
                                        선수 목록과 같은 레벨에서 편집하는 섹션입니다.
                                    </p>
                                </span>
                                <span className="text-xs text-gray-500 dark:text-[#adadb8]">
                                    {(collapsedPromotionEditors[panel.id] ?? false) ? '펼치기' : '접기'}
                                </span>
                            </button>
                            <div
                                id={`promotion-editor-panel-${panel.id}`}
                                className={(collapsedPromotionEditors[panel.id] ?? false) ? 'hidden' : 'block'}
                            >
                                <div className="p-4">
                                    {panel.type === 'DRAFT' && (
                                        <DraftPanelEditor
                                            content={panel.content}
                                            onSave={(c: DraftContent) => handleSavePanelContent(panel.id, c)}
                                            isSaving={savingPanelId === panel.id}
                                        />
                                    )}
                                    {panel.type === 'SCHEDULE' && (
                                        <SchedulePanelEditor
                                            content={panel.content}
                                            teams={sortedTeams}
                                            onSave={(c: ScheduleContent) => handleSavePanelContent(panel.id, c)}
                                            isSaving={savingPanelId === panel.id}
                                            isOverwatch={isSelectedOverwatchTournament}
                                        />
                                    )}
                                    {panel.type === 'FINAL_RESULT' && (
                                        <FinalResultPanelEditor
                                            content={panel.content}
                                            teams={sortedTeams}
                                            onSave={(c: FinalResultContent) => handleSavePanelContent(panel.id, c)}
                                            isSaving={savingPanelId === panel.id}
                                        />
                                    )}
                                </div>
                            </div>
                        </section>
                    ))}

            {selectedSlug === null && !isTournamentsLoading && tournaments.length === 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500 dark:border-[#3a3a44] dark:bg-[#1a1a23] dark:text-[#adadb8]">
                    대회가 없습니다. 먼저 대회를 추가해주세요.
                </div>
            )}

            {selectedSlug !== null && promotionData === undefined && !isPromotionLoading && (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-4 py-3 text-xs text-gray-500 dark:border-[#3a3a44] dark:bg-[#1a1a23] dark:text-[#adadb8]">
                    대회 구성 설정 생성 후 `참여자 목록`, `팀 정보` 패널을 필요에 맞게 ON/OFF로 제어하세요.
                </div>
            )}

            {selectedSlug !== null && promotionData !== undefined && isParticipantSectionVisible && (
                <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-[#3a3a44] dark:bg-[#1a1a23]">
                    <button
                        type="button"
                        onClick={() => setIsParticipantSectionCollapsed((prev) => !prev)}
                        aria-expanded={!isParticipantSectionCollapsed}
                        aria-controls="participant-editor-panel"
                        className={[
                            'flex w-full items-center justify-between px-4 py-3 text-left',
                            isParticipantSectionCollapsed ? '' : 'border-b border-gray-100 dark:border-[#2e2e38]',
                        ].join(' ')}
                    >
                        <span>
                            <p className="text-sm font-semibold text-gray-700 dark:text-[#efeff1]">참여자 목록</p>
                            <p className="text-xs text-gray-400 dark:text-[#adadb8]">
                                드래프트에 참여할 스트리머를 추가하고 포지션을 설정합니다.
                            </p>
                        </span>
                        <span className="text-xs text-gray-500 dark:text-[#adadb8]">
                            {isParticipantSectionCollapsed ? '펼치기' : '접기'}
                        </span>
                    </button>
                    <div id="participant-editor-panel" className={isParticipantSectionCollapsed ? 'hidden' : 'block'}>
                        <ParticipantEditor
                            participants={
                                Array.isArray((draftPanel?.content as Record<string, unknown> | undefined)?.participants)
                                    ? ((draftPanel!.content as Record<string, unknown>).participants as DraftParticipant[])
                                    : []
                            }
                            onSave={async (participants) => {
                                if (draftPanel === undefined) return
                                const c = draftPanel.content as Record<string, unknown>
                                await handleSavePanelContent(draftPanel.id, {
                                    startsOn: typeof c.startsOn === 'string' ? c.startsOn : null,
                                    meta: typeof c.meta === 'string' ? c.meta : '',
                                    participants,
                                })
                            }}
                            isSaving={savingPanelId === (draftPanel?.id ?? null)}
                        />
                    </div>
                </section>
            )}

            {selectedSlug !== null && promotionData !== undefined && isRosterEditorVisible && (
                <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-[#3a3a44] dark:bg-[#1a1a23]">
                    <button
                        type="button"
                        onClick={() => setIsRosterSectionCollapsed((prev) => !prev)}
                        aria-expanded={!isRosterSectionCollapsed}
                        aria-controls="tournament-roster-panel"
                        className={[
                            'flex w-full items-center justify-between px-4 py-3 text-left',
                            isRosterSectionCollapsed ? '' : 'border-b border-gray-100 dark:border-[#2e2e38]',
                        ].join(' ')}
                    >
                        <span>
                            <p className="text-sm font-semibold text-gray-700 dark:text-[#efeff1]">팀 정보</p>
                            <p className="text-xs text-gray-400 dark:text-[#adadb8]">팀 카드 드래그로 노출 순서를 변경할 수 있습니다.</p>
                        </span>
                        <span className="text-xs text-gray-500 dark:text-[#adadb8]">{isRosterSectionCollapsed ? '펼치기' : '접기'}</span>
                    </button>

                    <div id="tournament-roster-panel" className={isRosterSectionCollapsed ? 'hidden' : 'block'}>
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
                                                if (hoveredTeamId === team.id) setHoveredTeamId(null)
                                            }}
                                            onDrop={(e) => {
                                                e.preventDefault()
                                                void handleDropTeam(team.id)
                                            }}
                                            className={[
                                                'rounded-2xl transition',
                                                draggingTeamId === team.id ? 'opacity-60' : '',
                                                hoveredTeamId === team.id && draggingTeamId !== null && draggingTeamId !== team.id
                                                    ? 'ring-2 ring-blue-300 ring-offset-2 ring-offset-white dark:ring-blue-700 dark:ring-offset-[#111118]'
                                                    : '',
                                            ].join(' ')}
                                        >
                                            <TeamCard tournamentId={selectedTournamentId ?? 0} team={team} />
                                        </div>
                                    ))}
                                    <AddTeamCard tournamentId={selectedTournamentId ?? 0} />
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {selectedSlug !== null &&
                promotionData !== undefined &&
                visiblePanels
                    .filter((panel) => panel.type !== 'DRAFT' && panel.type !== 'PLAYER_LIST' && panel.type !== 'TEAMS')
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
                                aria-expanded={!(collapsedPromotionEditors[panel.id] ?? false)}
                                aria-controls={`promotion-editor-panel-${panel.id}`}
                                className={[
                                    'flex w-full items-center justify-between px-4 py-3 text-left',
                                    (collapsedPromotionEditors[panel.id] ?? false) ? '' : 'border-b border-gray-100 dark:border-[#2e2e38]',
                                ].join(' ')}
                            >
                                <span>
                                    <p className="text-sm font-semibold text-gray-700 dark:text-[#efeff1]">
                                        {PANEL_LABELS[panel.type as PromotionPanelType]}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-[#adadb8]">
                                        선수 목록과 같은 레벨에서 편집하는 섹션입니다.
                                    </p>
                                </span>
                                <span className="text-xs text-gray-500 dark:text-[#adadb8]">
                                    {(collapsedPromotionEditors[panel.id] ?? false) ? '펼치기' : '접기'}
                                </span>
                            </button>
                            <div
                                id={`promotion-editor-panel-${panel.id}`}
                                className={(collapsedPromotionEditors[panel.id] ?? false) ? 'hidden' : 'block'}
                            >
                                <div className="p-4">
                                    {panel.type === 'SCHEDULE' && (
                                        <SchedulePanelEditor
                                            content={panel.content}
                                            teams={sortedTeams}
                                            onSave={(c: ScheduleContent) => handleSavePanelContent(panel.id, c)}
                                            isSaving={savingPanelId === panel.id}
                                            isOverwatch={isSelectedOverwatchTournament}
                                        />
                                    )}
                                    {panel.type === 'FINAL_RESULT' && (
                                        <FinalResultPanelEditor
                                            content={panel.content}
                                            teams={sortedTeams}
                                            onSave={(c: FinalResultContent) => handleSavePanelContent(panel.id, c)}
                                            isSaving={savingPanelId === panel.id}
                                        />
                                    )}
                                    {panel.type === 'F1_DRIVERS' && (
                                        <F1DriversPanelEditor
                                            content={panel.content}
                                            onSave={(c: F1DriversContent) => handleSavePanelContent(panel.id, c)}
                                            isSaving={savingPanelId === panel.id}
                                        />
                                    )}
                                    {panel.type === 'F1_RACE_SCHEDULE' && (
                                        <F1RaceSchedulePanelEditor
                                            content={panel.content}
                                            onSave={(c: F1RaceScheduleContent) => handleSavePanelContent(panel.id, c)}
                                            isSaving={savingPanelId === panel.id}
                                        />
                                    )}
                                    {panel.type === 'F1_RACE_RESULT' && (
                                        <F1RaceResultPanelEditor
                                            content={panel.content}
                                            onSave={(c: F1RaceResultContent) => handleSavePanelContent(panel.id, c)}
                                            isSaving={savingPanelId === panel.id}
                                        />
                                    )}
                                    {panel.type === 'F1_STANDINGS' && (
                                        <F1StandingsPanelEditor
                                            content={panel.content}
                                            onSave={(c: F1StandingsContent) => handleSavePanelContent(panel.id, c)}
                                            isSaving={savingPanelId === panel.id}
                                        />
                                    )}
                                </div>
                            </div>
                        </section>
                    ))}

            {showCreateModal && (
                <CreateTournamentModal defaultGame={createTournamentDefaultGame} onClose={() => setShowCreateModal(false)} />
            )}
        </div>
    )
}
