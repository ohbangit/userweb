/** MobileMenu props */
export interface MobileMenuProps {
    /** 메뉴 열림 여부 */
    isOpen: boolean
    /** 메뉴 닫기 콜백 */
    onClose: () => void
    items: readonly MenuItem[]
}

export type MenuItem = {
    id: number
    label: string
    path: string | null
    icon: string | null
    isExternal: boolean
    children: MenuItem[]
}
