import { useState } from 'react'
import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
    Users,
    CalendarDays,
    FolderOpen,
    Gamepad2,
    Search,
    Radio,
    PanelLeftClose,
    PanelLeftOpen,
    LogOut,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAdminAuth } from '../hooks'
import { useTheme } from '../../../hooks/useTheme'
import { AdminToastProvider } from './AdminToastProvider'

interface AdminLayoutProps {
    children: ReactNode
}

interface NavItem {
    to: string
    label: string
    icon: LucideIcon
}

interface NavSection {
    title: string
    items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
    {
        title: '관리',
        items: [
            { to: '/admin/streamers', label: '스트리머 관리', icon: Users },
            { to: '/admin/schedule', label: '일정 관리', icon: CalendarDays },
            { to: '/admin/categories', label: '카테고리 관리', icon: FolderOpen },
        ],
    },
    {
        title: '대회',
        items: [{ to: '/admin/tournaments', label: '오버워치', icon: Gamepad2 }],
    },
    {
        title: '운영',
        items: [
            { to: '/admin/streamer-discovery', label: '스트리머 발굴', icon: Search },
            { to: '/admin/broadcast-crawl', label: '방송 크롤링', icon: Radio },
        ],
    },
]

export function AdminLayout({ children }: AdminLayoutProps) {
    const { logout } = useAdminAuth()
    const navigate = useNavigate()
    const { theme, toggleTheme } = useTheme()
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    function handleLogout() {
        logout()
        navigate('/admin', { replace: true })
    }

    return (
        <AdminToastProvider>
            <div className="flex min-h-screen bg-gray-50 dark:bg-[#0e0e10]">
                <aside
                    className={[
                        'flex flex-col border-r border-gray-300 bg-white transition-all duration-200 dark:border-[#3a3a44] dark:bg-[#1a1a23]',
                        sidebarCollapsed ? 'w-14' : 'w-56',
                    ].join(' ')}
                >
                    <div
                        className={[
                            'flex h-14 items-center border-b border-gray-300 dark:border-[#3a3a44]',
                            sidebarCollapsed ? 'justify-center px-0' : 'justify-between px-5',
                        ].join(' ')}
                    >
                        {!sidebarCollapsed && (
                            <span className="text-sm font-bold text-gray-900 dark:text-[#efeff1]">
                                어드민
                            </span>
                        )}
                        <div className="flex items-center gap-1">
                            {!sidebarCollapsed && (
                                <button
                                    onClick={toggleTheme}
                                    title={
                                        theme === 'dark'
                                            ? '라이트 모드로 전환'
                                            : '다크 모드로 전환'
                                    }
                                    className="cursor-pointer rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-[#adadb8] dark:hover:bg-[#2e2e38] dark:hover:text-[#efeff1]"
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
                            )}
                            <button
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                title={sidebarCollapsed ? '사이드바 열기' : '사이드바 닫기'}
                                className="cursor-pointer rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-[#adadb8] dark:hover:bg-[#2e2e38] dark:hover:text-[#efeff1]"
                            >
                                {sidebarCollapsed ? (
                                    <PanelLeftOpen className="h-4 w-4" />
                                ) : (
                                    <PanelLeftClose className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <nav className="flex flex-1 flex-col px-3 py-3">
                        {NAV_SECTIONS.map((section, sectionIndex) => (
                            <div
                                key={section.title}
                                className={[
                                    'space-y-1',
                                    sectionIndex > 0
                                        ? 'mt-3 border-t border-gray-300 pt-3 dark:border-[#3a3a44]'
                                        : '',
                                ].join(' ')}
                            >
                                {!sidebarCollapsed && (
                                    <div className="mb-2 px-3 text-xs font-semibold text-gray-400 dark:text-gray-500">
                                        {section.title}
                                    </div>
                                )}
                                {section.items.map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        title={sidebarCollapsed ? item.label : undefined}
                                        className={({ isActive }) =>
                                            [
                                                'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition',
                                                sidebarCollapsed ? 'justify-center' : 'gap-2',
                                                isActive
                                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-[#adadb8] dark:hover:bg-[#2e2e38] dark:hover:text-[#efeff1]',
                                ].join(' ')}
                                    >
                                        <item.icon className="h-4 w-4 shrink-0" />
                                        {!sidebarCollapsed && <span>{item.label}</span>}
                                    </NavLink>
                                ))}
                            </div>
                        ))}
                    </nav>

                    <div className="border-t border-gray-300 px-3 py-3 dark:border-[#3a3a44]">
                        <button
                            onClick={handleLogout}
                            title={sidebarCollapsed ? '로그아웃' : undefined}
                            className={[
                                'flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-[#adadb8] dark:hover:bg-[#2e2e38] dark:hover:text-[#efeff1]',
                                sidebarCollapsed ? 'justify-center' : 'gap-2',
                            ].join(' ')}
                        >
                            <LogOut className="h-4 w-4 shrink-0" />
                            {!sidebarCollapsed && <span>로그아웃</span>}
                        </button>
                    </div>
                </aside>

                <main className="flex-1 overflow-auto">
                    <div className="mx-auto max-w-5xl px-6 py-8">
                        {children}
                    </div>
                </main>
            </div>
        </AdminToastProvider>
    )
}
