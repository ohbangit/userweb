import type { OverwatchMatchInfo } from '../../types/overwatch'
import { MatchScoreHeader } from './MatchScoreHeader'
import { MatchSetRow } from './MatchSetRow'

interface MatchSetsPanelProps {
    match: OverwatchMatchInfo
}

export function MatchSetsPanel({ match }: MatchSetsPanelProps) {
    return (
        <div className="space-y-2">
            <MatchScoreHeader match={match} />
            <div className="divide-y divide-border/20">
                {match.sets.map((set) => (
                    <MatchSetRow key={set.setNumber} set={set} homeTeam={match.homeTeam} awayTeam={match.awayTeam} />
                ))}
            </div>
        </div>
    )
}
