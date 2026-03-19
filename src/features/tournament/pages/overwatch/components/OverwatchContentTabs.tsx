import { useState } from 'react'
import { Crown, Radio, Mic2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import partnerMark from '../../../../../assets/mark.png'
import { OverwatchBracket } from './OverwatchBracket'
import { OverwatchDraftPanel } from './OverwatchDraftPanel'
import { OverwatchFinalResultPanel } from './OverwatchFinalResultPanel'
import { OverwatchPlayerList } from './OverwatchPlayerList'
import { OverwatchTeamsPanel } from './OverwatchTeamsPanel'
import type { OWMetaGroupViewModel, OWPanelPublicItem, OWPanelType, OWPlayerPublicItem, OWStaffPublicItem } from '../types'
import { cn } from '../../../../../lib/cn'

const PANEL_TITLE: Record<OWPanelType, string> = {
    DRAFT: '드래프트',
    PLAYER_LIST: '참가자',
    TEAMS: '팀 정보',
    SCHEDULE: '일정 & 결과',
    FINAL_RESULT: '최종 결과',
}

const ROLE_META: Record<OWMetaGroupViewModel['id'], { icon: LucideIcon; label: string }> = {
    hosts: { icon: Crown, label: '주최' },
    broadcasters: { icon: Radio, label: '중계' },
    commentators: { icon: Mic2, label: '해설' },
}

interface Tab {
    id: string
    label: string
}

interface OverwatchContentTabsProps {
    slug: string
    panels: OWPanelPublicItem[]
    staffGroups: OWMetaGroupViewModel[]
    description: string | null
    players: OWPlayerPublicItem[]
    isPlayersLoading: boolean
    playersError: Error | null
}

function StaffItem({ item }: { item: OWStaffPublicItem }) {
    const avatar = (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/[0.08] text-xs font-semibold text-[#d1d5db] ring-1 ring-white/[0.12]">
            {item.avatarUrl ? (
                <img src={item.avatarUrl} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
            ) : (
                <span>{item.name.slice(0, 1)}</span>
            )}
        </div>
    )

    const content = (
        <div className="flex min-w-0 items-center gap-2">
            {avatar}
            <span className="truncate text-sm text-[#d1d5db] transition-colors group-hover:text-white">{item.name}</span>
            {item.isPartner && <img src={partnerMark} alt="파트너" className="h-3.5 w-3.5" loading="lazy" />}
        </div>
    )

    if (item.channelId) {
        return (
            <a
                href={`https://chzzk.naver.com/${item.channelId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-w-0 cursor-pointer"
                aria-label={`${item.name} 치지직 채널 열기`}
            >
                {content}
            </a>
        )
    }

    return <div className="inline-flex min-w-0">{content}</div>
}

function TournamentInfoSection({ description, groups }: { description: string | null; groups: OWMetaGroupViewModel[] }) {
    return (
        <div className="space-y-0">
            {description && <p className="whitespace-pre-line text-sm leading-relaxed text-[#aab0b6]">{description}</p>}

            {description && groups.length > 0 && <div className="my-5 h-px bg-white/[0.08]" />}

            {groups.length > 0 && (
                <div className="space-y-5">
                    {groups.map((group) => {
                        const roleMeta = ROLE_META[group.id]
                        const Icon = roleMeta.icon

                        return (
                            <div key={group.id}>
                                <div className="mb-3 flex items-center gap-1.5">
                                    <Icon className="h-3.5 w-3.5 text-[#6b7280]" strokeWidth={2} />
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#6b7280]">{roleMeta.label}</span>
                                </div>
                                <div className="flex flex-wrap gap-x-5 gap-y-3">
                                    {group.items.map((item) => (
                                        <StaffItem key={`${group.id}-${item.streamerId ?? item.name}`} item={item} />
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export function OverwatchContentTabs({
    slug,
    panels,
    staffGroups,
    description,
    players,
    isPlayersLoading,
    playersError,
}: OverwatchContentTabsProps) {
    const showInfoTab = staffGroups.length > 0 || !!description

    const tabs: Tab[] = [
        ...(showInfoTab ? [{ id: '_info', label: '대회 정보' }] : []),
        ...panels.map((panel) => ({
            id: panel.type === 'SCHEDULE' ? 'schedule' : String(panel.id),
            label: panel.titleOverride ?? PANEL_TITLE[panel.type],
        })),
    ]

    const [activeTabId, setActiveTabId] = useState<string>(tabs[0].id)

    const activePanel = panels.find((p) => String(p.id) === activeTabId)

    return (
        <div className="not-italic rounded-2xl border border-[#1e3a5f]/40 bg-gradient-to-b from-[#0c1e33]/50 to-[#060e1c]/60 p-5 backdrop-blur-md md:p-6">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTabId(tab.id)}
                        className={cn(
                            'shrink-0 cursor-pointer -skew-x-6 border-b-2 px-5 py-2.5 text-center text-sm font-bold uppercase tracking-wide transition-all duration-150',
                            activeTabId === tab.id
                                ? 'border-[#f99e1a] bg-[#f99e1a]/20 text-white'
                                : 'border-transparent bg-white/[0.06] text-[#6b7280] hover:bg-white/[0.10] hover:text-[#d1d5db]',
                        )}
                    >
                        <span className="inline-block skew-x-6">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="mt-5">
                {activeTabId === '_info' && <TournamentInfoSection description={description} groups={staffGroups} />}
                {activeTabId === 'schedule' && <OverwatchBracket slug={slug} />}
                {activePanel?.type === 'PLAYER_LIST' && (
                    <OverwatchPlayerList players={players} isLoading={isPlayersLoading} error={playersError} />
                )}
                {activePanel?.type === 'DRAFT' && (
                    <OverwatchDraftPanel players={players} isLoading={isPlayersLoading} error={playersError} />
                )}
                {activePanel?.type === 'TEAMS' && <OverwatchTeamsPanel slug={slug} />}
                {activePanel?.type === 'FINAL_RESULT' && <OverwatchFinalResultPanel slug={slug} />}
                {activePanel !== undefined &&
                    activePanel.type !== 'PLAYER_LIST' &&
                    activePanel.type !== 'DRAFT' &&
                    activePanel.type !== 'TEAMS' &&
                    activePanel.type !== 'SCHEDULE' &&
                    activePanel.type !== 'FINAL_RESULT' && (
                        <div className="flex flex-col items-center justify-center gap-3 py-20">
                            <span className="text-4xl">🔜</span>
                            <p className="text-sm text-[#6b7280]">준비 중입니다.</p>
                        </div>
                    )}
            </div>
        </div>
    )
}
