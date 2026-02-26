import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { SeoHead } from './components/SeoHead'
import SchedulePage from '../features/schedule/pages/SchedulePage'

const AdminRoutes = lazy(() => import('../features/admin/AdminRoutes'))
const TournamentPromotionPage = lazy(
    () => import('../features/tournament/pages/TournamentPromotionPage'),
)

function App() {
    return (
        <>
            <SeoHead />
            <Routes>
                <Route
                    path="/"
                    element={
                        <AppLayout>
                            <SchedulePage />
                        </AppLayout>
                    }
                />
                <Route
                    path="/admin/*"
                    element={
                        <Suspense fallback={null}>
                            <AdminRoutes />
                        </Suspense>
                    }
                />
                <Route
                    path="/tournament/:slug"
                    element={
                        <AppLayout>
                            <Suspense fallback={null}>
                                <TournamentPromotionPage />
                            </Suspense>
                        </AppLayout>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    )
}

export default App
