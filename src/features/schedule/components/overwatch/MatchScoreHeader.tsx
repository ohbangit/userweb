import type { OverwatchMatchInfo } from '../../types/overwatch'

interface MatchScoreHeaderProps {
    match: OverwatchMatchInfo
}

export function MatchScoreHeader({ match }: MatchScoreHeaderProps) {
    const { homeTeam, awayTeam, homeWins, awayWins, format } = match

    const formatLabel = format.toUpperCase() // BO3, BO5, BO7
    const statusLabel = match.isCompleted ? '완료' : `${homeWins} : ${awayWins} 진행 중`

    return (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-bg-secondary/60 px-3 py-2.5">
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider text-text-dim">{formatLabel}</span>
                <span className="text-[10px] text-text-dim">·</span>
                <span className={['text-[10px] font-medium', match.isCompleted ? 'text-text-dim' : 'text-primary'].join(' ')}>
                    {statusLabel}
                </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
                <span className="text-text">{homeTeam}</span>
                <span className="text-base font-bold tabular-nums text-primary">
                    {homeWins} : {awayWins}
                </span>
                <span className="text-text">{awayTeam}</span>
            </div>
        </div>
    )
}
