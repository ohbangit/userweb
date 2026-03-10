import { ChevronRight } from 'lucide-react'
import { createPortal } from 'react-dom'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import type { MobileMenuProps } from './types'

/**
 * 모바일 네비게이션 메뉴 패널
 * 햄버거 버튼 클릭 시 헤더 아래로 펼쳐지는 풀스크린 오버레이 메뉴입니다.
 */
export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    if (!isOpen) return null

    const mobileNavItemClass = ({ isActive }: { isActive: boolean }) =>
        cn(
            'flex w-full cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-left text-base font-medium transition-colors',
            isActive ? 'bg-primary/10 text-primary' : 'text-text hover:bg-border/10',
        )

    return (
        <>
            {/* 배경 오버레이 */}
            {createPortal(
                <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" aria-hidden="true" onClick={onClose} />,
                document.body,
            )}

            {/* 메뉴 패널 */}
            <div
                id="mobile-nav-menu"
                role="navigation"
                aria-label="모바일 메뉴"
                className="absolute left-0 right-0 top-full z-50 border-b border-border/30 bg-bg shadow-lg md:hidden animate-fade-in"
            >
                <div className="flex flex-col py-2">
                    {/* 방송일정 */}
                    <NavLink to="/" end className={mobileNavItemClass} onClick={onClose}>
                        방송일정
                        <ChevronRight className="h-4 w-4 text-text-muted" />
                    </NavLink>

                    {/* 구분선 */}
                    <div className="mx-4 my-2 border-t border-border/30" />

                    <NavLink to="/tournament/overwatch-vs-talon" className={mobileNavItemClass} onClick={onClose}>
                        (구)오버워치 RIVAL CLASH
                        <ChevronRight className="h-4 w-4 text-text-muted" />
                    </NavLink>

                    {/* F1 레이싱 */}
                    <NavLink to="/tournament/chzzk-racing4th" className={mobileNavItemClass} onClick={onClose}>
                        2026 치레동 F1
                        <ChevronRight className="h-4 w-4 text-text-muted" />
                    </NavLink>
                </div>
            </div>
        </>
    )
}
