import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { SeoHead } from './components/SeoHead'
import SchedulePage from '../features/schedule/pages/SchedulePage'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

const AdminRoutes = lazy(() => import('../features/admin/AdminRoutes'))
const TournamentPromotionPage = lazy(
    () => import('../features/tournament/pages/TournamentPromotionPage'),
)

function App() {
    return (
        <>
            <SeoHead />
            <Analytics
                mode={import.meta.env.PROD ? 'production' : 'development'}
                debug={import.meta.env.DEV}
            />
            <SpeedInsights />
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
                        <Suspense fallback={null}>
                            <TournamentPromotionPage />
                        </Suspense>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    )
}

export default App
