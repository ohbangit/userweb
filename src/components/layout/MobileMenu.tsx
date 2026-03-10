import { ChevronRight, Trophy } from 'lucide-react'
import { createPortal } from 'react-dom'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { trackEvent } from '../../utils/analytics'
import type { MobileMenuProps } from './types'

/**
 * 모바일 네비게이션 메뉴 패널
 * 햄버거 버튼 클릭 시 헤더 아래로 펼쳐지는 풀스크린 오버레이 메뉴입니다.
 */
export function MobileMenu({ isOpen, onClose, tournamentItems }: MobileMenuProps) {
    const navigate = useNavigate()
    const location = useLocation()

    if (!isOpen) return null

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
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            cn(
                                'flex w-full cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-left text-base font-medium transition-colors',
                                isActive ? 'bg-primary/10 text-primary' : 'text-text hover:bg-border/10',
                            )
                        }
                        onClick={onClose}
                    >
                        방송일정
                        <ChevronRight className="h-4 w-4 text-text-muted" />
                    </NavLink>

                    {/* 구분선 */}
                    <div className="mx-4 my-2 border-t border-border/30" />

                    {/* 대회 섹션 */}
                    <div>
                        <div className="px-4 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-widest text-text-muted">대회</div>
                        {tournamentItems.length === 0 ? (
                            <div className="flex items-center gap-2 px-4 py-3 text-sm text-text-muted">
                                <Trophy className="h-4 w-4" />
                                <span>등록된 대회가 없습니다</span>
                            </div>
                        ) : (
                            <ul className="flex flex-col">
                                {tournamentItems.map((tournament) => {
                                    const isActive = location.pathname === `/tournament/${tournament.slug}`
                                    return (
                                        <li key={tournament.id}>
                                            <button
                                                type="button"
                                                className={cn(
                                                    'flex w-full cursor-pointer items-center gap-2 rounded-lg px-4 py-3 text-left text-base transition-colors',
                                                    isActive ? 'bg-primary/10 text-primary' : 'text-text hover:bg-border/10',
                                                )}
                                                onClick={() => {
                                                    trackEvent('tournament_enter', {
                                                        slug: tournament.slug,
                                                        tournament_name: tournament.name,
                                                        source: 'mobile_menu',
                                                    })
                                                    navigate(`/tournament/${tournament.slug}`)
                                                    onClose()
                                                }}
                                            >
                                                <Trophy className="h-4 w-4 shrink-0 text-text-muted" />
                                                <span className="flex-1">{tournament.name}</span>
                                                <ChevronRight className="h-4 w-4 text-text-muted" />
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
