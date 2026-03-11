import { Helmet } from 'react-helmet-async'
import { AlertCircle } from 'lucide-react'
import { Header } from '../../../../components/layout'
import { toOWTournamentViewModel } from './adapters'
import { OverwatchMetaSection, OverwatchScheduleSection } from './components'
import { useOWTournamentDetail, useOWTournamentSchedule } from './hooks'

const OVERWATCH_TOURNAMENT_SLUG = 'overwatch-vs-talon'

function MetaSectionSkeleton() {
    return (
        <div className="overflow-hidden rounded-[32px] border border-[#1c3851] bg-[#03111d]/92 p-6 md:p-8">
            <div className="h-3 w-32 animate-pulse rounded-full bg-[#14324b]" />
            <div className="mt-4 h-12 w-2/3 animate-pulse rounded-2xl bg-[#12314a]" />
            <div className="mt-6 flex flex-wrap gap-2">
                <div className="h-8 w-20 animate-pulse rounded-full bg-[#14324b]" />
                <div className="h-8 w-24 animate-pulse rounded-full bg-[#14324b]" />
                <div className="h-8 w-16 animate-pulse rounded-full bg-[#14324b]" />
            </div>
            <div className="mt-6 space-y-3">
                <div className="h-4 w-full animate-pulse rounded-full bg-[#10283c]" />
                <div className="h-4 w-5/6 animate-pulse rounded-full bg-[#10283c]" />
                <div className="h-4 w-3/4 animate-pulse rounded-full bg-[#10283c]" />
            </div>
        </div>
    )
}

function ErrorState({ message }: { message: string }) {
    return (
        <div className="rounded-[28px] border border-[#5d2d2d] bg-[#1b0e12]/90 p-6 text-[#ffd4d4] shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
            <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#ff8f8f]" />
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-[#ff9d7a]">Meta Load Failed</p>
                    <p className="mt-2 text-sm leading-6 text-[#ffe6e6]/88">{message}</p>
                </div>
            </div>
        </div>
    )
}

export default function OverwatchTournamentPage() {
    const { data, isLoading, error } = useOWTournamentDetail(OVERWATCH_TOURNAMENT_SLUG)

    const meta = data ? toOWTournamentViewModel(data) : null
    const schedule = useOWTournamentSchedule(meta?.startDate ?? null, meta?.endDate ?? null)
    const title = meta?.title ?? 'Overwatch Rival Clash'
    const description = meta?.description ?? '오버워치 라이벌 클래시의 메타 정보와 운영진 정보를 확인할 수 있는 전용 페이지입니다.'

    return (
        <div className="min-h-screen bg-[#020d18] text-[#e8f4fd]">
            <Helmet>
                <title>{`${title} | 오뱅잇`}</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={`${title} | 오뱅잇`} />
                <meta property="og:description" content={description} />
                <meta name="robots" content="index,follow" />
            </Helmet>

            <Header />

            <main className="relative overflow-hidden px-4 pb-20 pt-10 md:px-6 md:pt-14">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,158,26,0.16),_transparent_28%),radial-gradient(circle_at_20%_30%,_rgba(50,139,203,0.14),_transparent_24%)]" />
                <div className="relative mx-auto max-w-6xl">
                    {isLoading && <MetaSectionSkeleton />}
                    {!isLoading && error instanceof Error && <ErrorState message={error.message} />}
                    {!isLoading && !error && meta && (
                        <>
                            <OverwatchMetaSection meta={meta} />
                            <OverwatchScheduleSection days={schedule.days} isLoading={schedule.isLoading} error={schedule.error} />
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
