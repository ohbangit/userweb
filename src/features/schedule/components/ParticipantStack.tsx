import { memo } from 'react'
import type { Participant } from '../types/schedule'
import { getInitial } from '../utils/participant'
import { cn } from '../../../lib/cn'

export interface ParticipantStackProps {
    participants: Participant[]
    maxVisible?: number
    size?: 'sm' | 'md'
}

const sizeConfig = {
    sm: { avatar: 'h-6 w-6', text: 'text-[10px]', overlap: '-space-x-1.5' },
    md: { avatar: 'h-7 w-7', text: 'text-[11px]', overlap: '-space-x-2' },
}

function ParticipantStackComponent({ participants, maxVisible = 4, size = 'md' }: ParticipantStackProps) {
    const visible = participants.slice(0, maxVisible)
    const remaining = participants.length - visible.length
    const s = sizeConfig[size]

    return (
        <div className={cn('flex items-center', s.overlap)}>
            {visible.map((participant, index) => (
                <div
                    key={`${participant.nickname ?? participant.name}-${index}`}
                    className={cn(
                        'relative overflow-hidden rounded-full bg-bg-secondary ring-2 ring-card',
                        s.avatar,
                    )}
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
                        <span className={cn('flex h-full w-full items-center justify-center font-semibold text-text-dim', s.text)}>
                            {getInitial(participant.nickname ?? participant.name)}
                        </span>
                    )}
                </div>
            ))}
            {remaining > 0 && (
                <div
                    className={cn(
                        'flex items-center justify-center rounded-full bg-bg-secondary font-bold text-text-dim ring-2 ring-card',
                        s.avatar,
                        s.text,
                    )}
                >
                    +{remaining}
                </div>
            )}
        </div>
    )
}

export const ParticipantStack = memo(ParticipantStackComponent)
