import partnerMark from '../../../assets/mark.png'
import { Star, Trophy, Users } from 'lucide-react'
import type { F1DriversContent, F1Driver } from '../types'
import { cn } from '../../../lib/cn'

interface Props {
    title: string
    content: F1DriversContent
}

const TIER_COLORS: Record<string, string> = {
    '6': '#F5C842',
    '5': '#ff7b72',
    '4': '#E10600',
    '3': '#ff9f43',
    '2': '#6aadcc',
    '1': '#6b7280',
    S: '#F5C842',
    A: '#E10600',
    B: '#6aadcc',
    C: '#a855f7',
    D: '#6b7280',
}

function getTierColor(tier: string | null): string {
    if (tier === null) return '#6b7280'
    const normalized = tier.replace(/\s/g, '').toUpperCase()
    const numeric = normalized.match(/[1-6]/)?.[0]

    if (numeric !== undefined) {
        return TIER_COLORS[numeric] ?? '#6b7280'
    }

    return TIER_COLORS[normalized] ?? '#6b7280'
}

function parseTierStars(tier: string | null): { count: number; hasPlus: boolean } {
    if (tier === null) return { count: 0, hasPlus: false }

    const normalized = tier.replace(/\s/g, '').toUpperCase()
    const match = normalized.match(/([1-6])/)

    if (match === null) return { count: 0, hasPlus: false }

    return {
        count: Number(match[1]),
        hasPlus: normalized.includes('+'),
    }
}

export function F1DriversPanelView({ title, content }: Props) {
    const allDrivers = [...content.participants].sort((a, b) => a.order - b.order)
    const firstDrivers = allDrivers.filter((d) => d.driverRole === 'FIRST')
    const secondADrivers = allDrivers.filter((d) => d.driverRole === 'SECOND' && d.secondGroup === 'A')
    const secondBDrivers = allDrivers.filter((d) => d.driverRole === 'SECOND' && d.secondGroup === 'B')

    return (
        <section className="mt-10 w-full">
            <h2 className="font-f1 text-5xl font-black uppercase tracking-tight text-[#e8f4fd]">{title}</h2>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-[#E10600]/60 via-[#7a0300]/40 to-transparent" />

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                <DriverColumn label="FIRST" color="#E10600" drivers={firstDrivers} />
                <DriverColumn label="SECOND A" color="#6aadcc" drivers={secondADrivers} />
                <DriverColumn label="SECOND B" color="#4fb8f0" drivers={secondBDrivers} />
            </div>
        </section>
    )
}

interface DriverColumnProps {
    label: string
    color: string
    drivers: F1Driver[]
}

function DriverColumn({ label, color, drivers }: DriverColumnProps) {
    return (
        <div>
            {/* 컬럼 헤더 */}
            <div
                className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider"
                style={{
                    backgroundColor: `${color}20`,
                    color,
                    boxShadow: `0 0 0 1px ${color}40`,
                }}
            >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                {label}
            </div>

            {drivers.length === 0 ? (
                <p className="mt-2 text-sm text-[#6aadcc]/40">등록된 드라이버가 없습니다.</p>
            ) : (
                <ul className="space-y-2">
                    {drivers.map((driver) => (
                        <DriverCard key={driver.id} driver={driver} color={color} />
                    ))}
                </ul>
            )}
        </div>
    )
}

interface DriverCardProps {
    driver: F1Driver
    color: string
}

function DriverCard({ driver, color }: DriverCardProps) {
    const tierColor = getTierColor(driver.tier)
    const tierStars = parseTierStars(driver.tier)
    const isQualifyingEliminated = driver.qualifyingEliminated === true

    const inner = (
        <div
            className={cn(
                'group relative flex items-center gap-3 rounded-xl border border-[#2e1a1a] bg-[#0d0205] px-3 py-3 transition hover:border-[#E10600]/30 hover:bg-[#130407]',
                isQualifyingEliminated ? 'opacity-55' : '',
            )}
        >
            {isQualifyingEliminated && (
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/25">
                    <span className="rounded-full border border-[#E10600]/60 bg-[#220608]/80 px-3 py-1 text-[10px] font-black tracking-wider text-[#ffb3af]">
                        예선 탈락
                    </span>
                </div>
            )}
            <div className="flex w-10 shrink-0 flex-col items-center gap-1.5">
                <span className="font-f1 text-base font-black leading-none text-[#e8f4fd]/60">
                    {driver.ranking !== null ? `#${driver.ranking}` : '—'}
                </span>
            </div>

            {/* 가운데: 썸네일 */}
            <div className="shrink-0">
                {driver.channelUrl !== null ? (
                    <a
                        href={driver.channelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block cursor-pointer"
                        aria-label={`${driver.nickname ?? driver.name} 채널 열기`}
                    >
                        {driver.avatarUrl !== null ? (
                            <img
                                src={driver.avatarUrl}
                                alt={driver.name}
                                className="h-15 w-15 rounded-full object-cover transition-opacity hover:opacity-90 md:h-16 md:w-16"
                                style={{ boxShadow: `0 0 0 2px ${color}50` }}
                                loading="lazy"
                            />
                        ) : (
                            <div
                                className="h-15 w-15 rounded-full transition-opacity hover:opacity-90 md:h-16 md:w-16"
                                style={{
                                    backgroundColor: `${color}10`,
                                    boxShadow: `0 0 0 2px ${color}30`,
                                }}
                            />
                        )}
                    </a>
                ) : driver.avatarUrl !== null ? (
                    <img
                        src={driver.avatarUrl}
                        alt={driver.name}
                        className="h-15 w-15 rounded-full object-cover md:h-16 md:w-16"
                        style={{ boxShadow: `0 0 0 2px ${color}50` }}
                        loading="lazy"
                    />
                ) : (
                    <div
                        className="h-15 w-15 rounded-full md:h-16 md:w-16"
                        style={{
                            backgroundColor: `${color}10`,
                            boxShadow: `0 0 0 2px ${color}30`,
                        }}
                    />
                )}
            </div>

            {/* 오른쪽: 이름 + 스탯 */}
            <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-1" style={{ color: tierColor }}>
                    {tierStars.count > 0 ? (
                        <>
                            {Array.from({ length: tierStars.count }).map((_, index) => (
                                <Star
                                    key={index}
                                    className="h-2.5 w-2.5"
                                    style={{
                                        fill: tierColor,
                                        filter: `drop-shadow(0 0 2px ${tierColor}66)`,
                                    }}
                                    aria-hidden="true"
                                />
                            ))}
                            {tierStars.hasPlus && (
                                <Star
                                    className="ml-0.5 h-2.5 w-2.5 opacity-70"
                                    style={{
                                        fill: tierColor,
                                        filter: `drop-shadow(0 0 2px ${tierColor}66)`,
                                    }}
                                    aria-hidden="true"
                                />
                            )}
                        </>
                    ) : (
                        <Star className="h-2.5 w-2.5 text-[#6b7280]/60" aria-hidden="true" />
                    )}
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="truncate text-lg font-black leading-tight text-[#e8f4fd] group-hover:text-white">
                        {driver.nickname ?? driver.name}
                    </span>
                    {driver.isPartner && <img src={partnerMark} alt="파트너" className="h-3.5 w-3.5 shrink-0" loading="lazy" />}
                </div>
                <div className="mt-1 flex items-center gap-2.5">
                    <span className="inline-flex items-center gap-1 text-[9px] text-[#6aadcc]/50">
                        <Users className="h-3 w-3 text-[#6aadcc]/65" aria-hidden="true" />
                        <span className="font-bold text-[#e8f4fd]/70">{driver.participationCount}</span>
                        <span className="sr-only">참가 횟수</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[9px] text-[#6aadcc]/50">
                        <Trophy className="h-3 w-3 text-[#F5C842]/80" aria-hidden="true" />
                        <span className="font-bold text-[#F5C842]/85">{driver.winCount}</span>
                        <span className="sr-only">우승 횟수</span>
                    </span>
                </div>
            </div>
        </div>
    )

    return <li>{inner}</li>
}
