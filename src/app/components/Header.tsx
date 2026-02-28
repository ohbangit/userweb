import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Sun, Moon, ChevronDown, Trophy, Menu, X } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { useTournamentList } from '../../features/tournament/hooks/useTournamentList'
import logoDarkSrc from '../../assets/logo_dark.png'

export function Header() {
    const { theme, toggleTheme } = useTheme()
    const location = useLocation()
    const navigate = useNavigate()
    const { data: tournamentData } = useTournamentList()

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLElement>(null)

    const isScheduleActive = location.pathname === '/'
    const isTournamentActive = location.pathname.startsWith('/tournament')

    // 라우트 변경 시 모바일 메뉴 닫기
    useEffect(() => {
        setMobileMenuOpen(false)
    }, [location.pathname])

    // Escape 키로 모바일 메뉴 닫기
    useEffect(() => {
        if (!mobileMenuOpen) return

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                setMobileMenuOpen(false)
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [mobileMenuOpen])

    // 헤더 외부 클릭 시 모바일 메뉴 닫기
    useEffect(() => {
        if (!mobileMenuOpen) return

        function handleMouseDown(e: MouseEvent) {
            if (
                headerRef.current !== null &&
                !headerRef.current.contains(e.target as Node)
            ) {
                setMobileMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleMouseDown)
        return () => {
            document.removeEventListener('mousedown', handleMouseDown)
        }
    }, [mobileMenuOpen])

    // 외부 클릭 시 드롭다운 닫기
    useEffect(() => {
        function handleMouseDown(e: MouseEvent) {
            if (
                dropdownRef.current !== null &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleMouseDown)
        return () => {
            document.removeEventListener('mousedown', handleMouseDown)
        }
    }, [])

    const tournaments = tournamentData?.tournaments ?? []

    return (
        <header
            ref={headerRef}
            className="sticky top-0 z-50 border-b border-border/30 bg-bg backdrop-blur-xl"
        >
            <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 sm:px-6">
                {/* 왼쪽: 로고 + 네비게이션 */}
                <div className="flex items-center gap-4">
                    <img
                        src={logoDarkSrc}
                        alt="오뱅잇"
                        className="h-7 w-auto"
                    />

                    {/* 네비게이션 */}
                    <nav className="hidden md:flex items-center gap-1">
                        {/* 방송일정 */}
                        <button
                            type="button"
                            className={`cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                                isScheduleActive
                                    ? 'bg-border/20 text-text'
                                    : 'text-text-muted hover:bg-border/10 hover:text-text'
                            }`}
                            onClick={() => navigate('/')}
                        >
                            방송일정
                        </button>

                        {/* 대회 드롭다운 */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                className={`cursor-pointer flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                                    isTournamentActive
                                        ? 'bg-border/20 text-text'
                                        : 'text-text-muted hover:bg-border/10 hover:text-text'
                                }`}
                                onClick={() => setDropdownOpen((prev) => !prev)}
                                aria-expanded={dropdownOpen}
                                aria-haspopup="true"
                            >
                                대회
                                <ChevronDown
                                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                                        dropdownOpen ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>

                            {/* 드롭다운 패널 */}
                            {dropdownOpen && (
                                <div className="absolute left-0 top-full z-50 mt-1 w-auto min-w-55 overflow-hidden rounded-xl border border-border/40 bg-card shadow-xl">
                                    {tournaments.length === 0 ? (
                                        <div className="flex items-center gap-2 px-4 py-3 text-sm text-text-muted">
                                            <Trophy className="h-4 w-4" />
                                            <span>등록된 대회가 없습니다</span>
                                        </div>
                                    ) : (
                                        <ul role="menu">
                                            {tournaments.map((tournament) => (
                                                <li
                                                    key={tournament.id}
                                                    role="none"
                                                >
                                                    <button
                                                        type="button"
                                                        role="menuitem"
                                                        className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left text-sm text-text transition-colors hover:bg-border/10"
                                                        onClick={() => {
                                                            navigate(
                                                                `/tournament/${tournament.slug}`,
                                                            )
                                                            setDropdownOpen(
                                                                false,
                                                            )
                                                        }}
                                                    >
                                                        <Trophy className="h-3.5 w-3.5 shrink-0 text-text-muted" />
                                                        <span>
                                                            {tournament.name}
                                                        </span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    </nav>
                </div>

                {/* 오른쪽: 테마 토글 + 모바일 메뉴 버튼 */}
                <div className="flex items-center gap-2">
                    {/* 테마 토글 */}
                    <button
                        onClick={toggleTheme}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border/40 bg-card text-text-muted transition-colors hover:border-border hover:text-text"
                        aria-label={
                            theme === 'dark'
                                ? '라이트 모드로 전환'
                                : '다크 모드로 전환'
                        }
                    >
                        {theme === 'dark' ? (
                            <Sun className="h-4 w-4" />
                        ) : (
                            <Moon className="h-4 w-4" />
                        )}
                    </button>

                    {/* 모바일 메뉴 버튼 */}
                    <button
                        type="button"
                        className="md:hidden flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border/40 bg-card text-text-muted transition-colors hover:border-border hover:text-text"
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-nav-menu"
                        aria-label="모바일 메뉴"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* 모바일 메뉴 패널 */}
            {mobileMenuOpen && (
                <div
                    id="mobile-nav-menu"
                    role="navigation"
                    aria-label="모바일 메뉴"
                    className="absolute left-0 right-0 top-full z-50 border-b border-border/30 bg-bg shadow-lg md:hidden"
                >
                    <div className="flex flex-col px-4 py-2">
                        {/* 방송일정 */}
                        <button
                            type="button"
                            className={`flex w-full cursor-pointer items-center rounded-lg px-4 py-3 text-left text-base font-medium transition-colors ${
                                isScheduleActive
                                    ? 'bg-border/20 text-text'
                                    : 'text-text-muted hover:bg-border/10 hover:text-text'
                            }`}
                            onClick={() => {
                                navigate('/')
                                setMobileMenuOpen(false)
                            }}
                        >
                            방송일정
                        </button>

                        {/* 대회 섹션 */}
                        <div className="mt-2">
                            <div className="px-4 py-2 text-sm font-semibold text-text-muted">
                                대회
                            </div>
                            {tournaments.length === 0 ? (
                                <div className="flex items-center gap-2 px-4 py-3 text-sm text-text-muted">
                                    <Trophy className="h-4 w-4" />
                                    <span>등록된 대회가 없습니다</span>
                                </div>
                            ) : (
                                <ul className="flex flex-col">
                                    {tournaments.map((tournament) => {
                                        const isActive =
                                            location.pathname ===
                                            `/tournament/${tournament.slug}`
                                        return (
                                            <li key={tournament.id}>
                                                <button
                                                    type="button"
                                                    className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-4 py-3 text-left text-base transition-colors ${
                                                        isActive
                                                            ? 'bg-border/20 text-text'
                                                            : 'text-text-muted hover:bg-border/10 hover:text-text'
                                                    }`}
                                                    onClick={() => {
                                                        navigate(
                                                            `/tournament/${tournament.slug}`,
                                                        )
                                                        setMobileMenuOpen(false)
                                                    }}
                                                >
                                                    <Trophy className="h-4 w-4 shrink-0" />
                                                    <span>
                                                        {tournament.name}
                                                    </span>
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
