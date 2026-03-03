import type { AffiliationItem } from '../../../types/affiliation'

export type { AffiliationItem } from '../../../types/affiliation'
export { getAffiliationColor } from '../../../types/affiliation'

export interface ListAffiliationsResponse {
    affiliations: AffiliationItem[]
}

export interface CreateAffiliationRequest {
    name: string
}

export interface UpdateAffiliationRequest {
    name: string
}

export interface UpdateStreamerAffiliationsRequest {
    affiliationIds: number[]
}

export interface UpdateStreamerAffiliationsResponse {
    affiliations: AffiliationItem[]
}
