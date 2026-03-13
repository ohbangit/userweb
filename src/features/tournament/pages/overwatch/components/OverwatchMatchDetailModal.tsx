import { Zap } from 'lucide-react'
import { Modal } from '../../../../../components/ui/Modal'
import type { BracketMatch, BracketMatchSet, BracketMvp, BracketTeamSlot, OverwatchMapType } from '../types'
import controlSrc from '../../../../../assets/control.svg'
import escortSrc from '../../../../../assets/escort.svg'
import hybridSrc from '../../../../../assets/hybrid.svg'
import pushSrc from '../../../../../assets/push.webp'
import flashpointSrc from '../../../../../assets/flashpoint.svg'
import tnkSrc from '../../../../../assets/tnk.svg'
import dpsSrc from '../../../../../assets/dps.svg'
import sptSrc from '../../../../../assets/spt.svg'

const MAP_TYPE_ICON: Record<OverwatchMapType, string> = {
    쟁탈: controlSrc,
    혼합: hybridSrc,
    밀기: pushSrc,
    호위: escortSrc,
    플레시포인트: flashpointSrc,
}

const MAP_TYPE_STYLE: Record<OverwatchMapType, string> = {
    쟁탈: 'border-violet-400/30 bg-violet-500/15 text-violet-300',
    혼합: 'border-orange-400/30 bg-orange-500/15 text-orange-300',
    밀기: 'border-blue-400/30 bg-blue-500/15 text-blue-300',
    호위: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-300',
    플레시포인트: 'border-fuchsia-400/30 bg-fuchsia-500/15 text-fuchsia-300',
}

const MAP_FLAG: Record<string, string> = {
    남극반도: '🇦🇶',
    네팔: '🇳🇵',
    리장타워: '🇨🇳',
    '리장 타워': '🇨🇳',
    부산: '🇰🇷',
    오아시스: '🇮🇶',
    일리오스: '🇬🇷',
    사모아: '🇼🇸',
    눔바니: '🇳🇬',
    미드타운: '🇺🇸',
    블리자드월드: '🇺🇸',
    '블리자드 월드': '🇺🇸',
    아이헨발데: '🇩🇪',
    할리우드: '🇺🇸',
    파라이수: '🇧🇷',
    '왕의 길': '🇬🇧',
    '뉴 퀸 스트리트': '🇨🇦',
    이스페란사: '🇵🇹',
    루나사피: '🇲🇲',
    콜로세오: '🇮🇹',
    '66번 국도': '🇺🇸',
    '66번국도': '🇺🇸',
    도라도: '🇲🇽',
    리알토: '🇮🇹',
    '서킷 로얄': '🇲🇨',
    서킷로얄: '🇲🇨',
    쓰레기촌: '🇦🇺',
    하바나: '🇨🇺',
    '뉴 정크 시티': '🇦🇺',
    수라바사: '🇮🇳',
    아틀리스: '🇲🇦',
}

const ROLE_IMG: Record<string, string> = {
    TNK: tnkSrc,
    DPS: dpsSrc,
    SPT: sptSrc,
}

interface Props {
    match: BracketMatch
    roundLabel: string
    onClose: () => void
}

function TeamSide({ team, isWinner }: { team: BracketTeamSlot | null; isWinner: boolean }) {
    if (!team) {
        return (
            <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1">
                <span className="text-base font-bold text-[#4b5563]">TBD</span>
            </div>
        )
    }

    if (team.logoUrl) {
        return (
            <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white/[0.08]">
                    <img src={team.logoUrl} alt={team.name} className="h-full w-full object-cover" />
                </div>
                <span className={['text-center text-sm font-bold', isWinner ? 'text-white' : 'text-[#9ca3af]'].join(' ')}>{team.name}</span>
            </div>
        )
    }

    return (
        <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1">
            <span className={['text-center text-xl font-extrabold tracking-tight', isWinner ? 'text-white' : 'text-[#9ca3af]'].join(' ')}>
                {team.name}
            </span>
        </div>
    )
}

function ScoreHeader({ match }: { match: BracketMatch }) {
    const s1 = match.team1?.score ?? null
    const s2 = match.team2?.score ?? null
    const completed = match.status === 'COMPLETED'
    const t1Won = completed && s1 !== null && s2 !== null && s1 > s2
    const t2Won = completed && s1 !== null && s2 !== null && s2 > s1

    return (
        <div className="flex items-center justify-between gap-3 px-5 py-5">
            <TeamSide team={match.team1} isWinner={t1Won} />

            <div className="flex items-center gap-2.5">
                {s1 !== null && s2 !== null ? (
                    <>
                        <span
                            className={['text-4xl font-black italic tabular-nums', t1Won ? 'text-[#f99e1a]' : 'text-[#6b7280]'].join(' ')}
                        >
                            {s1}
                        </span>
                        <span className="text-lg text-[#4b5563]">:</span>
                        <span
                            className={['text-4xl font-black italic tabular-nums', t2Won ? 'text-[#f99e1a]' : 'text-[#6b7280]'].join(' ')}
                        >
                            {s2}
                        </span>
                    </>
                ) : (
                    <span className="text-xl font-black italic text-[#4b5563]">{match.isLive ? 'LIVE' : 'VS'}</span>
                )}
            </div>

            <TeamSide team={match.team2} isWinner={t2Won} />
        </div>
    )
}

function SetsGrid({ sets, team1Name, team2Name }: { sets: BracketMatchSet[]; team1Name: string; team2Name: string }) {
    return (
        <div className="grid grid-cols-[2rem_auto_1fr_2.5rem_auto] items-center gap-x-2">
            {sets.map((set, i) => {
                const hasScore = set.score1 !== null && set.score2 !== null
                const winnerName = set.winner === 'team1' ? team1Name : set.winner === 'team2' ? team2Name : null
                const flag = set.mapName ? (MAP_FLAG[set.mapName] ?? '🌐') : ''
                const rowBorder = i > 0 ? 'border-t border-white/[0.04]' : ''

                return (
                    <div key={set.setNumber} className="contents">
                        <span className={['py-2.5 text-[10px] font-bold tracking-wider text-[#6b7280]', rowBorder].join(' ')}>
                            {set.setNumber}
                        </span>

                        <span className={['py-2.5', rowBorder].join(' ')}>
                            <span
                                className={[
                                    'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold',
                                    MAP_TYPE_STYLE[set.mapType],
                                ].join(' ')}
                            >
                                <img src={MAP_TYPE_ICON[set.mapType]} alt="" aria-hidden="true" className="h-3 w-3 shrink-0" />
                                <span className="hidden sm:inline">{set.mapType}</span>
                            </span>
                        </span>

                        <span className={['min-w-0 truncate py-2.5 text-xs font-medium text-[#b9dfff]', rowBorder].join(' ')}>
                            {flag} {set.mapName ?? 'TBD'}
                        </span>

                        <span className={['py-2.5 text-center text-xs font-bold italic tabular-nums text-[#aab0b6]', rowBorder].join(' ')}>
                            {hasScore ? `${set.score1}:${set.score2}` : '–'}
                        </span>

                        <span className={['flex items-center gap-1.5 py-2.5 text-[11px]', rowBorder].join(' ')}>
                            {winnerName !== null && <span className="font-semibold text-[#f99e1a]">{winnerName} ✓</span>}
                            {set.roundScore != null && <span className="text-[#6b7280]">({set.roundScore})</span>}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}

const HEX_CLIP = 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)'

const ROLE_COLOR: Record<string, string> = {
    TNK: '#3b82f6',
    DPS: '#ef4444',
    SPT: '#22c55e',
}

function MvpCard({ mvp }: { mvp: BracketMvp }) {
    const color = ROLE_COLOR[mvp.position] ?? '#6b7280'
    const size = 40
    const border = 2
    const outer = size + border * 2
    const outerPx = `${outer}px`

    return (
        <div className="group relative flex w-[80px] flex-col items-center gap-0.5 rounded-lg py-2 transition-colors hover:bg-white/[0.06]">
            {ROLE_IMG[mvp.position] && (
                <div
                    className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${color}30` }}
                >
                    <img src={ROLE_IMG[mvp.position]} alt={mvp.position} className="h-3 w-3" />
                </div>
            )}

            <div className="relative shrink-0" style={{ width: outerPx, height: outerPx }}>
                <div
                    className="absolute -inset-1.5 rounded-full blur-[10px]"
                    style={{
                        background: `radial-gradient(circle, ${color} 0%, ${color}80 35%, transparent 65%)`,
                    }}
                />
                <div
                    className="relative"
                    style={{
                        width: outerPx,
                        height: outerPx,
                        clipPath: HEX_CLIP,
                        background: `linear-gradient(to bottom, ${color}, ${color}60)`,
                    }}
                >
                    <div
                        className="absolute overflow-hidden bg-white/[0.06]"
                        style={{
                            inset: `${border}px`,
                            clipPath: HEX_CLIP,
                        }}
                    >
                        {mvp.avatarUrl ? (
                            <img src={mvp.avatarUrl} alt={mvp.name} className="h-full w-full object-cover" loading="lazy" />
                        ) : (
                            <span className="flex h-full w-full items-center justify-center text-xs font-bold text-[#4b5563]">
                                {mvp.name.slice(0, 1)}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <span className="max-w-[72px] truncate pr-1 text-[11px] italic text-[#d1d5db] transition-colors group-hover:text-white">
                    {mvp.name}
                </span>
            </div>

            <div className="flex items-center gap-0.5">
                {Array.from({ length: mvp.count }).map((_, i) => (
                    <Zap key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                ))}
            </div>
        </div>
    )
}

function MvpSection({ mvps }: { mvps: BracketMvp[] }) {
    if (mvps.length === 0) return null

    return (
        <div className="space-y-3 border-t border-white/[0.06] px-5 py-4">
            <h4 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
                <Zap className="h-3 w-3 fill-amber-400 text-amber-400" />
                MVP
            </h4>
            <div className="flex justify-center gap-3">
                {mvps.map((mvp) => (
                    <MvpCard key={`${mvp.name}-${mvp.position}`} mvp={mvp} />
                ))}
            </div>
        </div>
    )
}

function formatDate(iso: string): string {
    const d = new Date(iso)
    const month = d.getMonth() + 1
    const day = d.getDate()
    const hour = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    return `${month}/${day} ${hour}:${min}`
}

export function OverwatchMatchDetailModal({ match, roundLabel, onClose }: Props) {
    const team1Name = match.team1?.name ?? 'TBD'
    const team2Name = match.team2?.name ?? 'TBD'
    const sets = match.sets ?? []
    const mvps = match.mvps ?? []
    const formatLabel = match.format?.toUpperCase() ?? ''
    const dateLabel = match.scheduledAt ? formatDate(match.scheduledAt) : ''

    const headerParts = [roundLabel, formatLabel, dateLabel].filter(Boolean)

    return (
        <Modal isOpen onClose={onClose} size="lg">
            <div className="border-b border-white/[0.06] px-5 py-3">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
                    {headerParts.map((part, i) => (
                        <span key={i} className="flex items-center gap-2">
                            {i > 0 && <span className="text-white/20">·</span>}
                            {part === 'LIVE' ? (
                                <span className="flex items-center gap-1 text-[#ef4444]">
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ef4444]" />
                                    LIVE
                                </span>
                            ) : (
                                part
                            )}
                        </span>
                    ))}
                    {match.isLive && !headerParts.includes('LIVE') && (
                        <span className="flex items-center gap-1 text-[#ef4444]">
                            <span className="text-white/20">·</span>
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ef4444]" />
                            LIVE
                        </span>
                    )}
                </div>
            </div>

            <ScoreHeader match={match} />

            {sets.length > 0 && (
                <div className="border-t border-white/[0.06] px-5 py-4">
                    <h4 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">세트 결과</h4>
                    <SetsGrid sets={sets} team1Name={team1Name} team2Name={team2Name} />
                </div>
            )}

            <MvpSection mvps={mvps} />

            {sets.length === 0 && mvps.length === 0 && match.status !== 'COMPLETED' && (
                <div className="px-5 py-8 text-center text-sm text-[#4b5563]">
                    {match.isLive ? '경기가 진행 중입니다.' : '아직 경기 정보가 없습니다.'}
                </div>
            )}
        </Modal>
    )
}
