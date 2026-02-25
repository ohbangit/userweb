import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    adminApiDelete,
    adminApiGet,
    adminApiPatch,
    adminApiPost,
} from '../../../lib/apiClient'
import type {
    CreateTournamentRequest,
    CreateTournamentTeamRequest,
    StreamerItem,
    TournamentAdminTeamsResponse,
    TournamentListResponse,
    UpdateTournamentRequest,
    UpdateTournamentTeamRequest,
    UpsertTournamentMemberRequest,
} from '../types'

type StreamerListResponse = {
    items: StreamerItem[]
    total: number
}

function tournamentTeamsKey(slug: string) {
    return ['admin', 'tournaments', slug, 'teams'] as const
}

export function useTournamentTeams(slug: string) {
    return useQuery({
        queryKey: tournamentTeamsKey(slug),
        queryFn: () =>
            adminApiGet<TournamentAdminTeamsResponse>(
                `/api/admin/tournaments/${slug}/teams`,
            ),
        enabled: slug.trim().length > 0,
    })
}

export function useAdminStreamerSearch(keyword: string) {
    const trimmedKeyword = keyword.trim()
    return useQuery({
        queryKey: ['admin', 'streamers', 'search', trimmedKeyword],
        queryFn: async () => {
            const response = await adminApiGet<StreamerListResponse>(
                '/api/admin/streamers',
                {
                    name: trimmedKeyword,
                    page: '1',
                    size: '8',
                    sort: 'name_asc',
                },
            )
            return response.items
        },
        enabled: trimmedKeyword.length > 0,
    })
}

export function useCreateTournamentTeam(slug: string) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (body: CreateTournamentTeamRequest) =>
            adminApiPost<{ id: number }>(
                `/api/admin/tournaments/${slug}/teams`,
                body,
            ),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: tournamentTeamsKey(slug),
            })
        },
    })
}

export function useUpdateTournamentTeam(slug: string, teamId: number) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (body: UpdateTournamentTeamRequest) =>
            adminApiPatch<{ id: number }>(
                `/api/admin/tournaments/teams/${teamId}`,
                body,
            ),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: tournamentTeamsKey(slug),
            })
        },
    })
}

export function useDeleteTournamentTeam(slug: string) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (teamId: number) =>
            adminApiDelete(`/api/admin/tournaments/teams/${teamId}`),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: tournamentTeamsKey(slug),
            })
        },
    })
}

type ReorderTournamentTeamInput = {
    readonly teamId: number
    readonly teamOrder: number
}

export function useReorderTournamentTeams(slug: string) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (items: readonly ReorderTournamentTeamInput[]) => {
            await Promise.all(
                items.map((item) =>
                    adminApiPatch<void>(
                        `/api/admin/tournaments/teams/${item.teamId}`,
                        { teamOrder: item.teamOrder },
                    ),
                ),
            )
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: tournamentTeamsKey(slug),
            })
        },
    })
}

export function useUpsertTournamentMember(slug: string, teamId: number) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (body: UpsertTournamentMemberRequest) =>
            adminApiPost<void>(
                `/api/admin/tournaments/teams/${teamId}/members`,
                body,
            ),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: tournamentTeamsKey(slug),
            })
        },
    })
}

export function useDeleteTournamentMember(slug: string, teamId: number) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ memberId }: { memberId: number }) =>
            adminApiDelete(
                `/api/admin/tournaments/teams/${teamId}/members/${memberId}`,
            ),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: tournamentTeamsKey(slug),
            })
        },
    })
}

function tournamentsKey() {
    return ['admin', 'tournaments'] as const
}

export function useAdminTournaments() {
    return useQuery({
        queryKey: tournamentsKey(),
        queryFn: () =>
            adminApiGet<TournamentListResponse>('/api/admin/tournaments'),
    })
}

export function useCreateTournament() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (body: CreateTournamentRequest) =>
            adminApiPost<{ slug: string }>('/api/admin/tournaments', body),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: tournamentsKey() })
        },
    })
}

export function useUpdateTournament(slug: string) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (body: UpdateTournamentRequest) =>
            adminApiPatch<{ slug: string }>(
                `/api/admin/tournaments/${slug}`,
                body,
            ),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: tournamentsKey() })
        },
    })
}

export function useDeleteTournament() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (targetSlug: string) =>
            adminApiDelete(`/api/admin/tournaments/${targetSlug}`),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: tournamentsKey() })
        },
    })
}
