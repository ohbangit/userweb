import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import type { MobileMenuProps } from './types'

/**
 * 모바일 네비게이션 메뉴 패널
 * 햄버거 버튼 클릭 시 헤더 아래로 펼쳐지는 풀스크린 오버레이 메뉴입니다.
 */
export function MobileMenu({ isOpen, onClose, items }: MobileMenuProps) {
    const [openParentId, setOpenParentId] = useState<number | null>(null)

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
                className="absolute left-0 right-0 top-full z-50 animate-fade-in border-b border-border/30 bg-bg shadow-lg lg:hidden"
            >
                <div className="flex flex-col py-2">
                    {items.map((item) => {
                        const hasChildren = item.children.length > 0

                        if (hasChildren) {
                            const isOpenParent = openParentId === item.id

                            return (
                                <div key={item.id} className="px-2">
                                    <button
                                        type="button"
                                        className="flex w-full cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-left text-base font-medium text-text transition-colors hover:bg-border/10"
                                        onClick={() => setOpenParentId((current) => (current === item.id ? null : item.id))}
                                        aria-expanded={isOpenParent}
                                    >
                                        <span>{item.label}</span>
                                        <ChevronRight className={cn('h-4 w-4 text-text-muted transition-transform', isOpenParent && 'rotate-90')} />
                                    </button>

                                    {isOpenParent && (
                                        <div className="flex animate-fade-in flex-col gap-1 pb-2 pl-4">
                                            {item.children.map((child) =>
                                                child.path ? (
                                                    <NavLink
                                                        key={child.id}
                                                        to={child.path}
                                                        end={child.path === '/'}
                                                        className={mobileNavItemClass}
                                                        onClick={onClose}
                                                    >
                                                        {child.label}
                                                        <ChevronRight className="h-4 w-4 text-text-muted" />
                                                    </NavLink>
                                                ) : (
                                                    <span
                                                        key={child.id}
                                                        className="flex w-full cursor-default items-center justify-between rounded-lg px-4 py-3 text-left text-base font-medium text-text-muted"
                                                    >
                                                        {child.label}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        }

                        if (item.path) {
                            return (
                                <div key={item.id} className="px-2">
                                    <NavLink to={item.path} end={item.path === '/'} className={mobileNavItemClass} onClick={onClose}>
                                        {item.label}
                                        <ChevronRight className="h-4 w-4 text-text-muted" />
                                    </NavLink>
                                </div>
                            )
                        }

                        return (
                            <div key={item.id} className="px-2">
                                <span className="flex w-full cursor-default items-center justify-between rounded-lg px-4 py-3 text-left text-base font-medium text-text-muted">
                                    {item.label}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
