import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Sun, Moon, ChevronDown, Trophy } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { useTournamentList } from '../../features/tournament/hooks/useTournamentList'
import logoDarkSrc from '../../assets/logo_dark.png'

export function Header() {
    const { theme, toggleTheme } = useTheme()
    const location = useLocation()
    const navigate = useNavigate()
    const { data: tournamentData } = useTournamentList()

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const isScheduleActive = location.pathname === '/'
    const isTournamentActive = location.pathname.startsWith('/tournament')

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
        <header className="sticky top-0 z-50 border-b border-border/30 bg-bg backdrop-blur-xl">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
                {/* 왼쪽: 로고 + 네비게이션 */}
                <div className="flex items-center gap-4">
                    <img
                        src={logoDarkSrc}
                        alt="오뱅잇"
                        className="h-7 w-auto"
                    />

                    {/* 네비게이션 */}
                    <nav className="flex items-center gap-1">
                    {/* 방송일정 */}
                    <button
                        type="button"
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
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
                            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
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
                            <div className="absolute left-0 top-full z-50 mt-1 w-52 overflow-hidden rounded-xl border border-border/40 bg-card shadow-xl">
                                {tournaments.length === 0 ? (
                                    <div className="flex items-center gap-2 px-4 py-3 text-sm text-text-muted">
                                        <Trophy className="h-4 w-4" />
                                        <span>등록된 대회가 없습니다</span>
                                    </div>
                                ) : (
                                    <ul role="menu">
                                        {tournaments.map((tournament) => (
                                            <li key={tournament.id} role="none">
                                                <button
                                                    type="button"
                                                    role="menuitem"
                                                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-text transition-colors hover:bg-border/10"
                                                    onClick={() => {
                                                        navigate(
                                                            `/tournament/${tournament.slug}`,
                                                        )
                                                        setDropdownOpen(false)
                                                    }}
                                                >
                                                    <Trophy className="h-3.5 w-3.5 shrink-0 text-text-muted" />
                                                    <span className="truncate">
                                                        {tournament.name}
                                                    </span>
                                                    {tournament.isActive && (
                                                        <span className="ml-auto shrink-0 rounded-full bg-red-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-red-400">
                                                            LIVE
                                                        </span>
                                                    )}
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

                {/* 테마 토글 */}
                <button
                    onClick={toggleTheme}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/40 bg-card text-text-muted transition-colors hover:border-border hover:text-text"
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
            </div>
        </header>
    )
}
