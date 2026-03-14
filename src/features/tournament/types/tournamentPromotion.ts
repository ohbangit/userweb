import type { DraftParticipant, PublicPromotionPanel, PublicTournamentPlayersResponse } from './promotion'

export type TournamentStatus = 'before' | 'ongoing' | 'ended'

export interface PanelRendererProps {
    panel: PublicPromotionPanel
    slug: string
    isOverwatch: boolean
    playersData?: PublicTournamentPlayersResponse
    draftParticipants: DraftParticipant[]
}
