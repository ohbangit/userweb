import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../hooks'

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

    function handleLogout() {
        logout()
        navigate('/admin', { replace: true })
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <aside className="flex w-56 flex-col border-r border-gray-200 bg-white">
                <div className="flex h-14 items-center border-b border-gray-200 px-5">
                    <span className="text-sm font-bold text-gray-900">
                        어드민
                    </span>
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
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                                ].join(' ')
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="border-t border-gray-200 px-3 py-3">
                    <button
                        onClick={handleLogout}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
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
