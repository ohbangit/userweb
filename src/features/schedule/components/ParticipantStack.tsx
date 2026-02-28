import { memo } from 'react'
import type { Participant } from '../types/schedule'
import { getInitial } from '../utils/participant'

export interface ParticipantStackProps {
    participants: Participant[]
}

function ParticipantStackComponent({ participants }: ParticipantStackProps) {
    const visible = participants.slice(0, 3)
    const remaining = participants.length - visible.length

    return (
        <div className="flex items-center">
            <div className="flex -space-x-2">
                {visible.map((participant, index) => (
                    <div
                        key={`${participant.nickname ?? participant.name}-${index}`}
                        className="relative h-6 w-6 overflow-hidden rounded-full border border-border/60 bg-bg-secondary text-[10px] font-semibold text-text"
                        title={participant.nickname ?? participant.name}
                    >
                        {participant.avatarUrl ? (
                            <img
                                src={participant.avatarUrl}
                                alt={participant.nickname ?? participant.name}
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <span className="flex h-full w-full items-center justify-center">
                                {getInitial(
                                    participant.nickname ?? participant.name,
                                )}
                            </span>
                        )}
                    </div>
                ))}
                {remaining > 0 && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border/60 bg-bg-secondary text-[10px] font-semibold text-text-dim">
                        +{remaining}
                    </div>
                )}
            </div>
        </div>
    )
}

export const ParticipantStack = memo(ParticipantStackComponent)
