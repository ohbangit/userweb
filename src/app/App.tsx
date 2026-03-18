import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Header } from '../components/layout'
import { SeoHead } from './components/SeoHead'
import { ContactPanel } from '../features/contact/components'
import SchedulePage from '../features/schedule/pages/SchedulePage'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { useGoogleAnalytics } from '../hooks/useGoogleAnalytics'

const OverwatchTournamentPage = lazy(() => import('../features/tournament/pages/overwatch/OverwatchTournamentPage'))

function App() {
    useGoogleAnalytics()

    return (
        <div className="min-h-screen bg-bg">
            <SeoHead />
            <Analytics mode={import.meta.env.PROD ? 'production' : 'development'} debug={import.meta.env.DEV} />
            <SpeedInsights />

            <Header />

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
                    path="/tournament/overwatch-vs-talon"
                    element={
                        <Suspense fallback={null}>
                            <OverwatchTournamentPage />
                        </Suspense>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    )
}

export default App
