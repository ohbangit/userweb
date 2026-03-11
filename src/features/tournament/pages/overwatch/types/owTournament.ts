export interface OWLinkItem {
    label: string
    url: string
    type: string | null
}

export interface OWStaffPublicItem {
    streamerId: number | null
    name: string
    avatarUrl: string | null
    channelId: string | null
    isPartner: boolean
}

export interface OWPublicResponse {
    slug: string
    title: string
    bannerUrl: string | null
    startDate: string | null
    endDate: string | null
    description: string | null
    tags: string[]
    links: OWLinkItem[]
    isChzzkSupport: boolean
    hosts: OWStaffPublicItem[]
    broadcasters: OWStaffPublicItem[]
    commentators: OWStaffPublicItem[]
}

export interface OWMetaGroupViewModel {
    id: 'hosts' | 'broadcasters' | 'commentators'
    label: string
    items: OWStaffPublicItem[]
}

export interface OWMetaSectionViewModel {
    slug: string
    title: string
    bannerUrl: string | null
    startDate: string | null
    endDate: string | null
    dateLabel: string | null
    description: string | null
    tags: string[]
    links: OWLinkItem[]
    isChzzkSupport: boolean
    groups: OWMetaGroupViewModel[]
}
