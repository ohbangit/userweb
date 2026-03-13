import { useMemo } from 'react'
import { Crown, Loader2 } from 'lucide-react'
import tnkIcon from '../../../../../assets/tnk.svg'
import dpsIcon from '../../../../../assets/dps.svg'
import sptIcon from '../../../../../assets/spt.svg'
import partnerMark from '../../../../../assets/mark.png'
import type { OWPlayerPosition, OWPlayerPublicItem } from '../types'

const POSITION_META: Record<OWPlayerPosition, { icon: string; label: string; order: number }> = {
    TNK: { icon: tnkIcon, label: 'TANK', order: 0 },
    DPS: { icon: dpsIcon, label: 'DPS', order: 1 },
    SPT: { icon: sptIcon, label: 'SUPPORT', order: 2 },
}

interface PositionGroup {
    position: OWPlayerPosition
    players: OWPlayerPublicItem[]
}

function groupByPosition(players: OWPlayerPublicItem[]): PositionGroup[] {
    const map = new Map<OWPlayerPosition, OWPlayerPublicItem[]>()
    for (const player of players) {
        const list = map.get(player.position) ?? []
        list.push(player)
        map.set(player.position, list)
    }
    return Array.from(map.entries())
        .map(([position, items]) => ({
            position,
            players: items,
        }))
        .sort((a, b) => POSITION_META[a.position].order - POSITION_META[b.position].order)
}

function PlayerLink({ player, className, children }: { player: OWPlayerPublicItem; className?: string; children: React.ReactNode }) {
    if (player.channelId) {
        return (
            <a
                href={`https://chzzk.naver.com/${player.channelId}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`group cursor-pointer ${className ?? ''}`}
                aria-label={`${player.name} 치지직 채널 열기`}
            >
                {children}
            </a>
        )
    }
    return <div className={className}>{children}</div>
}

function PlayerCard({ player }: { player: OWPlayerPublicItem }) {
    return (
        <PlayerLink player={player} className="flex flex-col items-center gap-2 transition-all duration-200 hover:scale-105">
            <div className="relative">
                <div
                    className={[
                        'rounded-full p-[3px] transition-shadow duration-200',
                        player.isCaptain
                            ? 'bg-gradient-to-b from-[#f99e1a] to-[#f99e1a]/40 shadow-[0_0_16px_rgba(249,158,26,0.25)] group-hover:shadow-[0_0_24px_rgba(249,158,26,0.4)]'
                            : 'bg-gradient-to-b from-white/20 to-white/[0.06] group-hover:from-white/30 group-hover:to-white/10',
                    ].join(' ')}
                >
                    <div className="h-[76px] w-[76px] shrink-0 overflow-hidden rounded-full bg-white/[0.06]">
                        {player.avatarUrl ? (
                            <img src={player.avatarUrl} alt={player.name} className="h-full w-full object-cover" loading="lazy" />
                        ) : (
                            <span className="flex h-full w-full items-center justify-center font-bold text-[#4b5563]">
                                {player.name.slice(0, 1)}
                            </span>
                        )}
                    </div>
                </div>
                {player.isCaptain && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                        <Crown className="h-4 w-4 fill-[#f99e1a] text-[#f99e1a] drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]" strokeWidth={2} />
                    </div>
                )}
            </div>
            <div className="flex items-center gap-1">
                <span className="truncate text-xs text-[#d1d5db] transition-colors group-hover:text-white">{player.name}</span>
                {player.isPartner && <img src={partnerMark} alt="파트너" className="h-3 w-3 shrink-0" loading="lazy" />}
            </div>
        </PlayerLink>
    )
}

interface OverwatchPlayerListProps {
    players: OWPlayerPublicItem[]
    isLoading: boolean
    error: Error | null
}

export function OverwatchPlayerList({ players, isLoading, error }: OverwatchPlayerListProps) {
    const groups = useMemo(() => groupByPosition(players), [players])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-[#6b7280]" />
            </div>
        )
    }

    if (error) {
        return <div className="py-10 text-center text-sm text-[#ff8f8f]">선수 목록을 불러오지 못했습니다.</div>
    }

    if (groups.length === 0) {
        return <div className="py-10 text-center text-sm text-[#6b7280]">등록된 선수가 없습니다.</div>
    }

    return (
        <div className="space-y-6">
            {groups.map((group) => {
                const meta = POSITION_META[group.position]
                return (
                    <div key={group.position}>
                        <div className="mb-2.5 flex items-center gap-3">
                            <div className="-skew-x-6 bg-white/[0.06] px-3 py-1">
                                <div className="flex skew-x-6 items-center gap-1.5">
                                    <img src={meta.icon} alt={meta.label} className="h-4 w-4 opacity-60" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6b7280]">{meta.label}</span>
                                </div>
                            </div>
                            <div className="h-px flex-1 bg-white/[0.06]" />
                            <span className="text-[10px] tabular-nums text-[#4b5563]">{group.players.length}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
                            {group.players.map((p) => (
                                <PlayerCard key={p.streamerId} player={p} />
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
