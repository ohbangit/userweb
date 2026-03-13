import type { OWMetaGroupViewModel, OWMetaSectionViewModel, OWPublicResponse } from '../types'

function formatDate(value: string | null): string | null {
    if (!value) return null

    return new Date(value).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

function buildDateLabel(startDate: string | null, endDate: string | null): string | null {
    const start = formatDate(startDate)
    const end = formatDate(endDate)

    if (start && end) return `${start} - ${end}`
    if (start) return start
    if (end) return end

    return null
}

function buildGroups(data: OWPublicResponse): OWMetaGroupViewModel[] {
    const groups: OWMetaGroupViewModel[] = [
        { id: 'hosts', label: 'Hosts', items: [...data.hosts] },
        { id: 'broadcasters', label: 'Broadcast', items: [...data.broadcasters] },
        { id: 'commentators', label: 'Commentary', items: [...data.commentators] },
    ]

    return groups.filter((group) => group.items.length > 0)
}

export function toOWTournamentViewModel(data: OWPublicResponse): OWMetaSectionViewModel {
    return {
        slug: data.slug,
        title: data.title,
        bannerUrl: data.bannerUrl,
        startDate: data.startDate,
        endDate: data.endDate,
        dateLabel: buildDateLabel(data.startDate, data.endDate),
        description: data.description,
        tags: [...data.tags],
        links: [...data.links],
        isChzzkSupport: data.isChzzkSupport,
        groups: buildGroups(data),
    }
}
