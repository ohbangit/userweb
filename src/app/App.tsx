import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Header } from '../components/layout'
import { SeoHead } from './components/SeoHead'
import { ContactPanel } from '../features/contact/components'
import SchedulePage from '../features/schedule/pages/SchedulePage'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { useGoogleAnalytics } from '../hooks/useGoogleAnalytics'

const AdminRoutes = lazy(() => import('../features/admin/AdminRoutes'))
const OverwatchTournamentPage = lazy(() => import('../features/tournament/pages/overwatch/OverwatchTournamentPage'))
const TournamentPromotionPage = lazy(() => import('../features/tournament/pages/TournamentPromotionPage'))
const F1StaticPage = lazy(() => import('../features/tournament/pages/F1StaticPage'))

function App() {
    useGoogleAnalytics()
    const { pathname } = useLocation()
    const isAdmin = pathname.startsWith('/admin')

    return (
        <div className="min-h-screen bg-bg">
            <SeoHead />
            <Analytics mode={import.meta.env.PROD ? 'production' : 'development'} debug={import.meta.env.DEV} />
            <SpeedInsights />

            {!isAdmin && <Header />}

            <Routes>
                <Route
                    path="/"
                    element={
                        <main className="mx-auto max-w-[1290px] px-4 py-4 sm:px-6 sm:py-6">
                            <SchedulePage />
                            <ContactPanel />
                        </main>
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
                    path="/tournament/overwatch-vs-talon"
                    element={
                        <Suspense fallback={null}>
                            <OverwatchTournamentPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/tournament/chzzk-racing4th"
                    element={
                        <Suspense fallback={null}>
                            <F1StaticPage />
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
        </div>
    )
}

export default App
