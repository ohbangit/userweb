import { ReactNode } from 'react'
import { Header } from '../components/Header'
import { ContactPanel } from '../../features/contact/components'

interface LayoutProps {
    children: ReactNode
}

export function AppLayout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-bg">
            <Header />
            <main className="mx-auto max-w-[1200px] px-4 py-4 sm:px-6 sm:py-6">
                {children}
            </main>
            <ContactPanel />
        </div>
    )
}
