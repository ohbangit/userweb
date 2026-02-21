import type { ReactNode } from 'react'
import { useAdminAuth } from '../hooks'
import AdminLoginPage from '../pages/AdminLoginPage'

interface AdminGuardProps {
    children: ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
    const { isAuthenticated } = useAdminAuth()

    if (!isAuthenticated) {
        return <AdminLoginPage />
    }

    return <>{children}</>
}
