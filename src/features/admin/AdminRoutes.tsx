import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminGuard } from './components'
import { AdminLayout } from './components'

const StreamersPage = lazy(() => import('./pages/StreamersPage'))
const DiscoveryPage = lazy(() => import('./pages/DiscoveryPage'))
const BroadcastCrawlPage = lazy(() => import('./pages/BroadcastCrawlPage'))
const BroadcastSchedulePage = lazy(
    () => import('./pages/BroadcastSchedulePage'),
)
const CategoryManagePage = lazy(() => import('./pages/CategoryManagePage'))

export default function AdminRoutes() {
    return (
        <AdminGuard>
            <AdminLayout>
                <Suspense fallback={null}>
                    <Routes>
                        <Route path="streamers" element={<StreamersPage />} />
                        <Route
                            path="streamer-discovery"
                            element={<DiscoveryPage />}
                        />
                        <Route
                            path="broadcast-crawl"
                            element={<BroadcastCrawlPage />}
                        />
                        <Route
                            path="schedule"
                            element={<BroadcastSchedulePage />}
                        />
                        <Route
                            path="categories"
                            element={<CategoryManagePage />}
                        />
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
