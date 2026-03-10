import { ChevronDown, Trophy } from 'lucide-react'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import { cn } from '../../lib/cn'
import { trackEvent } from '../../utils/analytics'
import type { TournamentDropdownProps } from './types'

/**
 * 대회 드롭다운 메뉴 (데스크톱)
 * 네비게이션 바 내 대회 목록을 드롭다운 패널로 표시합니다.
 */
export function TournamentDropdown({ items, isActive }: TournamentDropdownProps) {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    // 외부 클릭 시 드롭다운 닫기
    useOutsideClick(ref, () => setOpen(false))

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                className={cn(
                    'cursor-pointer flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                    isActive ? 'bg-border/20 text-text' : 'text-text-muted hover:bg-border/10 hover:text-text',
                )}
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
                aria-haspopup="true"
            >
                대회
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', open && 'rotate-180')} />
            </button>

            {/* 드롭다운 패널 */}
            {open && (
                <div className="absolute left-0 top-full z-50 mt-1.5 w-auto min-w-56 overflow-hidden rounded-xl border border-border/40 bg-card shadow-modal-center animate-fade-in">
                    {items.length === 0 ? (
                        <div className="flex items-center gap-2 px-4 py-3.5 text-sm text-text-muted">
                            <Trophy className="h-4 w-4" />
                            <span>등록된 대회가 없습니다</span>
                        </div>
                    ) : (
                        <ul role="menu" className="py-1.5">
                            {items.map((tournament) => (
                                <li key={tournament.id} role="none">
                                    <button
                                        type="button"
                                        role="menuitem"
                                        className="group flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm text-text transition-colors hover:bg-border/10"
                                        onClick={() => {
                                            trackEvent('tournament_enter', {
                                                slug: tournament.slug,
                                                tournament_name: tournament.name,
                                                source: 'desktop_dropdown',
                                            })
                                            navigate(`/tournament/${tournament.slug}`)
                                            setOpen(false)
                                        }}
                                    >
                                        <Trophy className="h-3.5 w-3.5 shrink-0 text-text-muted transition-colors group-hover:text-primary" />
                                        <span>{tournament.name}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}
