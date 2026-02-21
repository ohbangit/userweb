import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../hooks'
import { useTheme } from '../../../hooks/useTheme'

interface AdminLayoutProps {
    children: ReactNode
}

interface NavItem {
    to: string
    label: string
}

const NAV_ITEMS: NavItem[] = [
    { to: '/admin/streamers', label: '스트리머 관리' },
]

export function AdminLayout({ children }: AdminLayoutProps) {
    const { logout } = useAdminAuth()
    const navigate = useNavigate()
    const { theme, toggleTheme } = useTheme()

    function handleLogout() {
        logout()
        navigate('/admin', { replace: true })
    }

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-[#0e0e10]">
            <aside className="flex w-56 flex-col border-r border-gray-200 bg-white dark:border-[#3a3a44] dark:bg-[#1a1a23]">
                <div className="flex h-14 items-center justify-between border-b border-gray-200 px-5 dark:border-[#3a3a44]">
                    <span className="text-sm font-bold text-gray-900 dark:text-[#efeff1]">
                        어드민
                    </span>
                    <button
                        onClick={toggleTheme}
                        title={
                            theme === 'dark'
                                ? '라이트 모드로 전환'
                                : '다크 모드로 전환'
                        }
                        className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-[#adadb8] dark:hover:bg-[#2e2e38] dark:hover:text-[#efeff1]"
                    >
                        {theme === 'dark' ? (
                            <svg
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <circle cx="12" cy="12" r="5" />
                                <path
                                    strokeLinecap="round"
                                    d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                                />
                            </svg>
                        )}
                    </button>
                </div>

                <nav className="flex flex-1 flex-col gap-0.5 px-3 py-3">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                [
                                    'rounded-lg px-3 py-2 text-sm font-medium transition',
                                    isActive
                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-[#adadb8] dark:hover:bg-[#2e2e38] dark:hover:text-[#efeff1]',
                                ].join(' ')
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="border-t border-gray-200 px-3 py-3 dark:border-[#3a3a44]">
                    <button
                        onClick={handleLogout}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-[#adadb8] dark:hover:bg-[#2e2e38] dark:hover:text-[#efeff1]"
                    >
                        로그아웃
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-auto">
                <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
            </main>
        </div>
    )
}
