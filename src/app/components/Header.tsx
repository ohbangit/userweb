import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import logoDarkSrc from '../../assets/logo_dark.png'

export function Header() {
    const { theme, toggleTheme } = useTheme()

    return (
        <header className="sticky top-0 z-50 border-b border-border/30 bg-bg/80 backdrop-blur-xl">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
                <div className="flex items-center">
                    <img src={logoDarkSrc} alt="오뱅잇" className="h-7 w-auto" />
                    {/*<span className="ml-3 text-xs text-text-muted">*/}
                    {/*</span>*/}
                </div>
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
