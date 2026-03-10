/** 대회 드롭다운/모바일 메뉴에서 사용하는 대회 항목 */
export interface TournamentMenuItem {
    id: number
    slug: string
    name: string
}

/** TournamentDropdown props */
export interface TournamentDropdownProps {
    /** 대회 목록 */
    items: TournamentMenuItem[]
    /** 현재 경로가 대회 페이지인지 여부 */
    isActive: boolean
}

/** MobileMenu props */
export interface MobileMenuProps {
    /** 메뉴 열림 여부 */
    isOpen: boolean
    /** 메뉴 닫기 콜백 */
    onClose: () => void
    /** 대회 목록 */
    tournamentItems: TournamentMenuItem[]
}
