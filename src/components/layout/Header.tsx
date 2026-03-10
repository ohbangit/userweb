import { Menu, Moon, Sun, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import logoDarkSrc from '../../assets/logo_dark.png'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import { useScrolled } from '../../hooks/useScrolled'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../lib/cn'
import { MobileMenu } from './MobileMenu'

/**
 * GNB (Global Navigation Bar)
 * 로고, 메인 네비게이션(방송일정/OW 라이벌 클래시/F1 레이싱), 테마 토글, 모바일 메뉴 버튼을 포함합니다.
 * 스크롤 시 border/shadow가 강화되어 콘텐츠 위 떠 있는 느낌을 줍니다.
 */
export function Header() {
    const { theme, toggleTheme } = useTheme()
    const location = useLocation()
    const scrolled = useScrolled()

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const headerRef = useRef<HTMLElement>(null)

    // 라우트 변경 시 모바일 메뉴 닫기
    useEffect(() => {
        setMobileMenuOpen(false)
    }, [location.pathname])

    // Escape 키로 모바일 메뉴 닫기
    useEffect(() => {
        if (!mobileMenuOpen) return

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') setMobileMenuOpen(false)
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [mobileMenuOpen])

    // 헤더 외부 클릭 시 모바일 메뉴 닫기
    useOutsideClick(headerRef, () => setMobileMenuOpen(false), mobileMenuOpen)

    const navItemClass = ({ isActive }: { isActive: boolean }) =>
        cn(
            'cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
            isActive ? 'bg-border/20 text-text' : 'text-text-muted hover:bg-border/10 hover:text-text',
        )

    return (
        <header
            ref={headerRef}
            className={cn(
                'sticky top-0 z-50 bg-bg/95 backdrop-blur-xl transition-[border-color,box-shadow] duration-200',
                scrolled ? 'border-b border-border/60 shadow-card' : 'border-b border-border/30',
            )}
        >
            <div className="mx-auto flex h-14 max-w-[1290px] items-center justify-between px-6 sm:px-8">
                {/* 왼쪽: 로고 + 데스크톱 네비게이션 */}
                <div className="flex items-center gap-4">
                    <NavLink to="/" aria-label="오뱅잇 홈으로 이동">
                        <img src={logoDarkSrc} alt="오뱅잇" className="h-7 w-auto" />
                    </NavLink>

                    {/* 데스크톱 네비게이션 */}
                    <nav className="hidden items-center gap-1 md:flex">
                        <NavLink to="/" end className={navItemClass}>
                            방송일정
                        </NavLink>
                        <NavLink to="/tournament/overwatch-vs-talon" className={navItemClass}>
                            (구)오버워치 RIVAL CLASH
                        </NavLink>
                        <NavLink to="/tournament/chzzk-racing4th" className={navItemClass}>
                            2026 치레동 F1
                        </NavLink>
                    </nav>
                </div>

                {/* 오른쪽: 테마 토글 + 모바일 메뉴 버튼 */}
                <div className="flex items-center gap-2">
                    {/* 테마 토글 */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border/40 bg-card text-text-muted transition-colors hover:border-border hover:text-text"
                        aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
                    >
                        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>

                    {/* 모바일 메뉴 버튼 */}
                    <button
                        type="button"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border/40 bg-card text-text-muted transition-colors hover:border-border hover:text-text md:hidden"
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-nav-menu"
                        aria-label="모바일 메뉴"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* 모바일 메뉴 */}
            <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </header>
    )
}
