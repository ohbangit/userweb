import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminGuard } from './components'
import { AdminLayout } from './components'

const StreamersPage = lazy(() => import('./pages/StreamersPage'))

export default function AdminRoutes() {
    return (
        <AdminGuard>
            <AdminLayout>
                <Suspense fallback={null}>
                    <Routes>
                        <Route path="streamers" element={<StreamersPage />} />
                        <Route
                            path="*"
                            element={<Navigate to="streamers" replace />}
                        />
                    </Routes>
                </Suspense>
            </AdminLayout>
        </AdminGuard>
    )
}
