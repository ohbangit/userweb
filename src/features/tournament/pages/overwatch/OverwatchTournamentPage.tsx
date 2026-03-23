import { Helmet } from 'react-helmet-async'
import { AlertCircle } from 'lucide-react'
import { ErrorBoundary } from '../../../../components/ErrorBoundary'
import { toOWTournamentViewModel } from './adapters'
import { OverwatchMetaSection, OverwatchContentTabs } from './components'
import { useOWTournamentDetail, useOWTournamentPlayers } from './hooks'

function MetaSectionSkeleton() {
    return (
        <div>
            {/* 배너 스켈레톤 */}
            <div className="h-[100px] w-full animate-pulse bg-white/[0.03] md:h-[140px]" />
            {/* 패널 스켈레톤 */}
            <div className="relative z-10 mx-auto -mt-8 max-w-5xl px-4 md:-mt-12">
                <div className="rounded-2xl border border-[#1e3a5f]/50 bg-gradient-to-b from-[#0c1e33]/90 to-[#060e1c]/95 p-5 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="h-9 w-36 animate-pulse rounded-lg bg-white/[0.06]" />
                        <div className="h-6 w-14 animate-pulse rounded-full bg-white/[0.06]" />
                    </div>
                    <div className="mt-3 h-8 w-3/4 animate-pulse rounded-lg bg-white/[0.05]" />
                    <div className="mt-2.5 h-4 w-48 animate-pulse rounded bg-white/[0.04]" />
                    <div className="mt-5 h-px bg-white/[0.08]" />
                    <div className="mt-4 space-y-3">
                        <div className="h-7 w-64 animate-pulse rounded bg-white/[0.05]" />
                        <div className="h-7 w-56 animate-pulse rounded bg-white/[0.05]" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function ErrorState({ message }: { message: string }) {
    return (
        <div className="px-4 py-10">
            <div className="mx-auto max-w-5xl rounded-[28px] border border-[#5d2d2d] bg-[#1b0e12]/90 p-6 text-[#ffd4d4] shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
                <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#ff8f8f]" />
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#ff9d7a]">Meta Load Failed</p>
                        <p className="mt-2 text-sm leading-6 text-[#ffe6e6]/88">{message}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function OverwatchTournamentPage() {
    const { data, isLoading, error } = useOWTournamentDetail()
    const playersQuery = useOWTournamentPlayers()

    const meta = data ? toOWTournamentViewModel(data) : null
    const title = meta?.title ?? 'Overwatch Rival Clash'
    const description = meta?.description ?? '오버워치 라이벌 클래시의 메타 정보와 운영진 정보를 확인할 수 있는 전용 페이지입니다.'

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(249,158,26,0.16),_transparent_24%),linear-gradient(135deg,#04192b_0%,#03111d_45%,#020d18_100%)] text-[#e8f4fd]">
            <Helmet>
                <title>{`${title} | 오뱅잇`}</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={`${title} | 오뱅잇`} />
                <meta property="og:description" content={description} />
                <meta name="robots" content="index,follow" />
            </Helmet>

            <div className="font-koverwatch italic">
                <ErrorBoundary>
                    {isLoading && <MetaSectionSkeleton />}
                    {!isLoading && error instanceof Error && <ErrorState message={error.message} />}
                    {!isLoading && !error && meta && (
                        <>
                            <OverwatchMetaSection meta={meta} />
                            <div className="mx-auto max-w-5xl px-4 pb-8 pt-6">
                                <OverwatchContentTabs
                                    panels={data?.panels ?? []}
                                    staffGroups={meta.groups}
                                    description={meta.description}
                                    players={playersQuery.data?.players ?? []}
                                    isPlayersLoading={playersQuery.isLoading}
                                    playersError={playersQuery.error instanceof Error ? playersQuery.error : null}
                                />
                            </div>
                        </>
                    )}
                </ErrorBoundary>
            </div>
        </div>
    )
}
