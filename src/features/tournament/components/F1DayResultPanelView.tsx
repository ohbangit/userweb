import partnerMark from '../../../assets/mark.png'
import { getF1TeamThemes } from '../data/f1TeamDraft'
import type { F1DayQualifyingEntry, F1DayRaceEntry, F1DayDriverStanding, F1DayTeamStanding, F1DayResultContent, F1Driver } from '../types'

interface Props {
    title: string
    content: F1DayResultContent
    drivers: F1Driver[]
    showRace2?: boolean
}

// ── 유틸 ──────────────────────────────────────────────────────────────────

function getRankColor(rank: number | null, dnf: boolean): string {
    if (dnf || rank === null) return 'text-gray-500'
    if (rank === 1) return 'text-[#F5C842]'
    if (rank === 2) return 'text-gray-300'
    if (rank === 3) return 'text-amber-600'
    return 'text-[#e8f4fd]'
}


// ── 공용 서브컴포넌트 ─────────────────────────────────────────────────────

function RankBadge({ rank, dnf }: { rank: number | null; dnf?: boolean }) {
    const isDnf = dnf ?? false
    return (
        <span className={['text-center text-sm font-black tabular-nums', getRankColor(rank, isDnf)].join(' ')}>
            {isDnf ? 'DNF' : (rank ?? '-')}
        </span>
    )
}

interface DriverCellProps {
    driver: F1Driver | undefined
    dnf?: boolean
}

function DriverCell({ driver, dnf }: DriverCellProps) {
    const isDnf = dnf ?? false
    return (
        <div className="flex min-w-0 items-center gap-1.5">
            {driver?.avatarUrl != null ? (
                <img
                    src={driver.avatarUrl}
                    alt={driver.nickname ?? driver.name}
                    className="h-6 w-6 shrink-0 rounded-full object-cover ring-1 ring-[#1e3a5f]"
                    loading="lazy"
                />
            ) : (
                <div className="h-6 w-6 shrink-0 rounded-full bg-[#1e3a5f]/60" />
            )}
            <span className={['truncate text-xs font-semibold', isDnf ? 'text-gray-500 line-through' : 'text-[#e8f4fd]'].join(' ')}>
                {driver != null ? (driver.nickname ?? driver.name) : '—'}
            </span>
            {driver?.isPartner === true && <img src={partnerMark} alt="파트너" className="h-3 w-3 shrink-0" loading="lazy" />}
        </div>
    )
}

function TeamIcon({ teamIndex }: { teamIndex: number }) {
    const themes = getF1TeamThemes()
    const theme = themes[teamIndex]
    if (theme == null) {
        return <div className="h-6 w-6 shrink-0 rounded-full bg-[#1e3a5f]/60" />
    }
    if (theme.logoUrl != null) {
        return (
            <div
                className={['h-6 w-6 shrink-0 rounded-full flex items-center justify-center overflow-hidden', theme.logoBgClass].join(' ')}
            >
                <img src={theme.logoUrl} alt={theme.teamNameKo} className="h-5 w-5 object-contain" loading="lazy" />
            </div>
        )
    }
    return <div className={['h-6 w-6 shrink-0 rounded-full', theme.logoBgClass].join(' ')} />
}

function EmptyResult({ label }: { label: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#1e3a5f]/40 bg-[#041524]/30 py-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#6aadcc]/30">{label}</span>
            <p className="text-xs text-[#6aadcc]/40">결과 준비 중</p>
        </div>
    )
}

function SectionHeader({ label }: { label: string }) {
    return (
        <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#E10600]" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#E10600]">{label}</h3>
        </div>
    )
}

// ── 퀄리파잉 테이블 ───────────────────────────────────────────────────────

interface QualifyingTableProps {
    entries: F1DayQualifyingEntry[]
    driversById: Map<string, F1Driver>
}

function QualifyingTable({ entries, driversById }: QualifyingTableProps) {
    const sorted = [...entries].sort((a, b) => (a.position ?? 999) - (b.position ?? 999))

    if (sorted.length === 0) {
        return <EmptyResult label="Qualifying" />
    }

    return (
        <div className="overflow-hidden rounded-xl border border-[#1e3a5f]/60">
            <div className="grid grid-cols-[1.8rem_1fr_1.8rem_5rem] items-center gap-1 bg-[#041524]/80 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#6aadcc]/60">
                <span className="text-center">P</span>
                <span>드라이버</span>
                <span className="text-center">팀</span>
                <span className="text-right">기록</span>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-[#E10600]/40 via-[#7a0300]/20 to-transparent" />
            <ul>
                {sorted.map((entry, index) => {
                    const driver = driversById.get(String(entry.driverId))
                    return (
                        <li key={entry.driverId}>
                            {index > 0 && <div className="h-px w-full bg-gradient-to-r from-transparent via-[#1e3a5f]/30 to-transparent" />}
                            <div className="grid grid-cols-[1.8rem_1fr_1.8rem_5rem] items-center gap-1 px-3 py-2">
                                <RankBadge rank={entry.position} />
                                <DriverCell driver={driver} />
                                <div className="flex justify-center">
                                    <TeamIcon teamIndex={entry.teamIndex} />
                                </div>
                                <span className="text-right font-mono text-xs text-[#e8f4fd]/60">{entry.lapTime ?? '—'}</span>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

// ── 레이스 테이블 ─────────────────────────────────────────────────────────

interface RaceTableProps {
    entries: F1DayRaceEntry[]
    driversById: Map<string, F1Driver>
    label: string
}

function RaceTable({ entries, driversById, label }: RaceTableProps) {
    const sorted = [...entries].sort((a, b) => {
        if (a.dnf && !b.dnf) return 1
        if (!a.dnf && b.dnf) return -1
        return (a.position ?? 999) - (b.position ?? 999)
    })

    if (sorted.length === 0) {
        return <EmptyResult label={label} />
    }

    return (
        <div className="overflow-hidden rounded-xl border border-[#1e3a5f]/60">
            <div className="grid grid-cols-[1.8rem_1fr_1.8rem_1.6rem_5rem] items-center gap-1 bg-[#041524]/80 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#6aadcc]/60">
                <span className="text-center">P</span>
                <span>드라이버</span>
                <span className="text-center">팀</span>
                <span className="text-center">GRD</span>
                <span className="text-right">기록</span>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-[#E10600]/40 via-[#7a0300]/20 to-transparent" />
            <ul>
                {sorted.map((entry, index) => {
                    const driver = driversById.get(String(entry.driverId))
                    return (
                        <li key={entry.driverId} className={entry.dnf ? 'opacity-60' : ''}>
                            {index > 0 && <div className="h-px w-full bg-gradient-to-r from-transparent via-[#1e3a5f]/30 to-transparent" />}
                            <div className="grid grid-cols-[1.8rem_1fr_1.8rem_1.6rem_5rem] items-center gap-1 px-3 py-2">
                                <RankBadge rank={entry.position} dnf={entry.dnf ?? false} />
                                <DriverCell driver={driver} dnf={entry.dnf ?? false} />
                                <div className="flex justify-center">
                                    <TeamIcon teamIndex={entry.teamIndex} />
                                </div>
                                <span className="text-center text-[10px] text-[#6aadcc]/60 tabular-nums">{entry.grid ?? '—'}</span>
                                <span
                                    className={[
                                        'text-right font-mono text-xs',
                                        entry.fastestLap ? 'text-[#a855f7]' : 'text-[#e8f4fd]/60',
                                    ].join(' ')}
                                >
                                    {entry.lapTime ?? '—'}
                                </span>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

// ── 팀 성적 카드 ──────────────────────────────────────────────────────────

function TeamStandingCard({ standing }: { standing: F1DayTeamStanding }) {
    const themes = getF1TeamThemes()
    const theme = themes[standing.teamIndex]
    if (theme == null) return null

    const isFirst = standing.rank === 1

    return (
        <div className={['relative overflow-hidden rounded-xl', isFirst ? 'ring-1 ring-white/20' : ''].join(' ')}>
            {/* 그라디언트 배경 레이어 */}
            <div className={['absolute inset-0 bg-gradient-to-r opacity-30', theme.stripeClass].join(' ')} />
            {/* 어두운 dim 레이어 */}
            <div className="absolute inset-0 bg-[#020d18]/65" />

            {/* 콘텐츠 */}
            <div className={['relative grid items-center gap-3 px-4 py-3', standing.r1Points != null || standing.r2Points != null ? 'grid-cols-[2rem_1fr_3.5rem_auto]' : 'grid-cols-[2rem_1fr_3.5rem]'].join(' ')}>
                {/* 등수 */}
                <span
                    className={[
                        'text-xl font-black tabular-nums text-center',
                        isFirst ? 'text-[#F5C842]' : 'text-[#e8f4fd]/50',
                    ].join(' ')}
                >
                    {standing.rank}
                </span>

                {/* 팀 로고 + 팀명 */}
                <div className="flex min-w-0 items-center gap-2">
                    {theme.logoUrl != null ? (
                        <div
                            className={[
                                'h-8 w-8 shrink-0 rounded-full flex items-center justify-center overflow-hidden',
                                theme.logoBgClass,
                            ].join(' ')}
                        >
                            <img src={theme.logoUrl} alt={theme.teamNameKo} className="h-6 w-6 object-contain" loading="lazy" />
                        </div>
                    ) : (
                        <div className={['h-8 w-8 shrink-0 rounded-full', theme.logoBgClass].join(' ')} />
                    )}
                    <span className="truncate text-sm font-bold text-[#e8f4fd]">{theme.teamNameKo}</span>
                </div>

                {/* 총 포인트 */}
                <div className="text-center">
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-[#6aadcc]/60">PTS</span>
                    <span
                        className={[
                            'text-xl font-black tabular-nums',
                            isFirst ? 'text-[#F5C842]' : 'text-[#e8f4fd]',
                        ].join(' ')}
                    >
                        {standing.totalPoints}
                    </span>
                </div>

                {/* R1 / R2 포인트 — 라운드가 있는 경우만 렌더링 */}
                {(standing.r1Points != null || standing.r2Points != null) && (
                    <div className="flex flex-col gap-1">
                        {standing.r1Points != null && (
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#6aadcc]/50">R1</span>
                                <span className="text-sm font-black tabular-nums text-[#e8f4fd]/80">{standing.r1Points}</span>
                            </div>
                        )}
                        {standing.r2Points != null && (
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#6aadcc]/50">R2</span>
                                <span className="text-sm font-black tabular-nums text-[#e8f4fd]/80">{standing.r2Points}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

// ── 개인 성적 테이블 ──────────────────────────────────────────────────────

interface DriverStandingsTableProps {
    standings: F1DayDriverStanding[]
    driversById: Map<string, F1Driver>
}

function DriverStandingsTable({ standings, driversById }: DriverStandingsTableProps) {
    const themes = getF1TeamThemes()

    if (standings.length === 0) {
        return <EmptyResult label="드라이버 성적" />
    }

    return (
        <div className="overflow-hidden rounded-xl border border-[#1e3a5f]/60">
            <div className="grid grid-cols-[2.5rem_1fr_3rem_3.5rem] items-center gap-2 bg-[#041524]/80 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#6aadcc]/60">
                <span className="text-center">순위</span>
                <span>드라이버</span>
                <span className="text-center">팀</span>
                <span className="text-center">PTS</span>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-[#E10600]/40 via-[#7a0300]/20 to-transparent" />
            <ul>
                {standings.map((standing, index) => {
                    const driver = driversById.get(String(standing.driverId))
                    const theme = themes[standing.teamIndex]
                    const rank = index + 1
                    return (
                        <li key={standing.driverId}>
                            {index > 0 && <div className="h-px w-full bg-gradient-to-r from-transparent via-[#1e3a5f]/40 to-transparent" />}
                            <div className="grid grid-cols-[2.5rem_1fr_3rem_3.5rem] items-center gap-2 px-4 py-2.5">
                                {/* 순위 */}
                                <span className={['text-center text-sm font-black tabular-nums', getRankColor(rank, false)].join(' ')}>
                                    {rank}
                                </span>

                                {/* 드라이버 */}
                                <div className="flex min-w-0 items-center gap-2">
                                    {driver?.avatarUrl != null ? (
                                        <img
                                            src={driver.avatarUrl}
                                            alt={driver.nickname ?? driver.name}
                                            className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-[#1e3a5f]"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="h-8 w-8 shrink-0 rounded-full bg-[#1e3a5f]/60" />
                                    )}
                                    <div className="flex min-w-0 flex-col">
                                        <div className="flex items-center gap-1">
                                            <span className="truncate text-sm font-bold text-[#e8f4fd]">
                                                {driver != null ? (driver.nickname ?? driver.name) : '—'}
                                            </span>
                                            {driver?.isPartner === true && (
                                                <img src={partnerMark} alt="파트너" className="h-3 w-3 shrink-0" loading="lazy" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 팀 로고 */}
                                <div className="flex justify-center">
                                    {theme != null ? (
                                        theme.logoUrl != null ? (
                                            <div
                                                className={[
                                                    'h-7 w-7 rounded-full flex items-center justify-center overflow-hidden',
                                                    theme.logoBgClass,
                                                ].join(' ')}
                                            >
                                                <img
                                                    src={theme.logoUrl}
                                                    alt={theme.teamNameKo}
                                                    className="h-5 w-5 object-contain"
                                                    loading="lazy"
                                                />
                                            </div>
                                        ) : (
                                            <div className={['h-7 w-7 rounded-full', theme.logoBgClass].join(' ')} />
                                        )
                                    ) : (
                                        <div className="h-7 w-7 rounded-full bg-[#1e3a5f]/40" />
                                    )}
                                </div>

                                {/* 포인트 */}
                                <span
                                    className={[
                                        'text-center text-base font-black tabular-nums',
                                        rank <= 3 ? 'text-[#F5C842]' : 'text-[#e8f4fd]',
                                    ].join(' ')}
                                >
                                    {standing.points}
                                </span>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────

export function F1DayResultPanelView({ title, content, drivers, showRace2 = true }: Props) {
    // F1Driver.id = String(TournamentPlayerPublic.id) 이므로 string 키로 저장
    const driversById = new Map(drivers.map((d) => [d.id, d]))

    const sortedTeamStandings = [...content.teamStandings].sort((a, b) => a.rank - b.rank)

    const hasAnyData = content.qualifying.length > 0 || content.race1.length > 0 || (showRace2 && content.race2.length > 0)

    return (
        <section className="w-full mt-10">
            {/* 섹션 제목 */}
            <h2 className="font-f1 text-5xl font-black tracking-tight uppercase text-[#e8f4fd]">{title}</h2>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-[#E10600]/60 via-[#7a0300]/40 to-transparent" />

            {!hasAnyData ? (
                <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#2e1a1a]/60 bg-[#120608]/30 py-16">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E10600]/30 bg-[#E10600]/10">
                        <span className="text-xl">🏁</span>
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-[#6aadcc]/50">결과 준비 중입니다</p>
                </div>
            ) : (
                <>
                    {/* ── 1. 레이스 결과 3열 ── */}
                    <div className={['mt-8 grid grid-cols-1 gap-6', showRace2 ? 'md:grid-cols-3' : 'md:grid-cols-2'].join(' ')}>
                        <div>
                            <SectionHeader label="Qualifying" />
                            <QualifyingTable entries={content.qualifying} driversById={driversById} />
                        </div>
                        <div>
                            <SectionHeader label="Round 1" />
                            <RaceTable entries={content.race1} driversById={driversById} label="Round 1" />
                        </div>
                        {showRace2 && (
                            <div>
                                <SectionHeader label="Round 2" />
                                <RaceTable entries={content.race2} driversById={driversById} label="Round 2" />
                            </div>
                        )}
                    </div>

                    {/* ── 2. 팀 성적 카드 ── */}
                    {sortedTeamStandings.length > 0 && (
                        <div className="mt-12">
                            <h3 className="font-f1 text-2xl font-black uppercase tracking-tight text-[#e8f4fd]">{content.label} 팀 성적</h3>
                            <div className="mt-4 h-px w-full bg-gradient-to-r from-[#E10600]/40 via-[#7a0300]/20 to-transparent" />
                            <div className="mt-4 flex flex-col gap-2">
                                {sortedTeamStandings.map((standing) => (
                                    <TeamStandingCard key={standing.teamIndex} standing={standing} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── 3. 개인 성적 테이블 ── */}
                    {content.driverStandings.length > 0 && (
                        <div className="mt-12">
                            <h3 className="font-f1 text-2xl font-black uppercase tracking-tight text-[#e8f4fd]">드라이버 성적</h3>
                            <div className="mt-4 h-px w-full bg-gradient-to-r from-[#E10600]/40 via-[#7a0300]/20 to-transparent" />
                            <div className="mt-4">
                                <DriverStandingsTable standings={content.driverStandings} driversById={driversById} />
                            </div>
                        </div>
                    )}
                </>
            )}
        </section>
    )
}
