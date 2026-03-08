import partnerMark from '../../../assets/mark.png'
import { getF1TeamThemes } from '../data/f1TeamDraft'
import type { F1TeamDraftContent } from '../types'

interface Props {
    title?: string
    content: F1TeamDraftContent
    hideTitle?: boolean
}

export function F1TeamDraftPanelView({ title, content, hideTitle = false }: Props) {
    const themes = getF1TeamThemes()
    const sorted = [...content.teams].sort((a, b) => a.order - b.order)

    const body = (
        <>
            <div className="mt-4 rounded-xl border border-[#8a1b18]/30 bg-[#120607]/70 p-4">
                <p className="text-sm font-medium leading-relaxed text-[#e6f1f8]/85">
                    * 드라이버 변경 안내:
                    <span className="mx-1 inline-flex items-center rounded-md bg-[#2a0d10] px-2 py-0.5 text-xs font-bold text-[#ffb5b1] ring-1 ring-[#E10600]/45">
                        숀쟝
                    </span>
                    →
                    <span className="mx-1 inline-flex items-center rounded-md bg-[#0e1f13] px-2 py-0.5 text-xs font-bold text-[#9ff0b5] ring-1 ring-[#29b35f]/45">
                        푸후
                    </span>
                    (
                    <a
                        href="https://chzzk.naver.com/2cc562e9370970d567c1a25c5c7d0e77/community/detail/25187036"
                        target="_blank"
                        rel="noreferrer"
                        className="cursor-pointer underline underline-offset-2"
                    >
                        공지사항
                    </a>
                    )
                </p>
            </div>

            {sorted.length === 0 ? (
                <p className="mt-4 text-base text-[#6aadcc]/60">구성된 팀이 없습니다.</p>
            ) : (
                <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] justify-items-center gap-4">
                    {sorted.map((team, index) => {
                        const theme = themes[index % themes.length]
                        return (
                            <div
                                key={team.id}
                                className={`relative w-full max-w-[340px] overflow-hidden rounded-2xl border p-5 ${theme.cardClass}`}
                            >
                                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${theme.stripeClass}`} />

                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0 flex items-center gap-3">
                                        <div
                                            className={`flex h-8 w-14 shrink-0 items-center justify-center rounded-md p-1 md:h-9 md:w-16 ${theme.logoBgClass}`}
                                        >
                                            {theme.logoUrl !== null ? (
                                                <img
                                                    src={theme.logoUrl}
                                                    alt={`${team.teamName} 로고`}
                                                    className="h-full w-full object-contain"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <span className="text-[10px] font-black tracking-widest text-white">T{index + 1}</span>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black tracking-[0.15em] text-[#9fc2d8]/70">{theme.teamNameKo}</p>
                                            <h3 className="truncate text-base font-black text-[#f3fbff]">{team.teamName}</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <DriverSlot driver={team.firstDriver} />
                                    <DriverSlot driver={team.secondDriver} />
                                </div>

                                <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-2.5">
                                    <div className="mb-1.5">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[9px] font-black tracking-widest ${theme.operatorBadgeClass}`}
                                        >
                                            OPERATOR
                                        </span>
                                    </div>
                                    {team.operator === null ? (
                                        <p className="text-[11px] font-medium text-[#87a7bb]/70">-</p>
                                    ) : (
                                        <div className="flex min-w-0 items-center gap-2">
                                            {team.operator.avatarUrl !== null ? (
                                                <img
                                                    src={team.operator.avatarUrl}
                                                    alt={team.operator.name}
                                                    className="h-5 w-5 shrink-0 rounded-full object-cover ring-1 ring-white/20"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="h-5 w-5 shrink-0 rounded-full bg-[#2e1a1a] ring-1 ring-white/15" />
                                            )}
                                            <span className="truncate text-xs font-semibold text-[#dff1fb]">{team.operator.name}</span>
                                            {team.operator.isPartner && (
                                                <img src={partnerMark} alt="파트너" className="h-3 w-3 shrink-0" loading="lazy" />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </>
    )

    if (hideTitle) {
        return <div className="w-full">{body}</div>
    }

    return (
        <section className="w-full mt-10">
            <h2 className="font-f1 text-5xl font-black tracking-tight uppercase text-[#e8f4fd]">{title}</h2>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-[#E10600]/60 via-[#7a0300]/40 to-transparent" />
            {body}
        </section>
    )
}

interface DriverSlotProps {
    driver: F1TeamDraftContent['teams'][number]['firstDriver']
}

function DriverSlot({ driver }: DriverSlotProps) {
    return (
        <div className="rounded-xl border border-white/10 bg-black/25 p-3">
            <div className="flex flex-col items-center gap-2 text-center">
                {driver.avatarUrl !== null ? (
                    <img
                        src={driver.avatarUrl}
                        alt={driver.name}
                        className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-white/20"
                        loading="lazy"
                    />
                ) : (
                    <div className="h-12 w-12 shrink-0 rounded-full bg-[#2e1a1a] ring-1 ring-white/20" />
                )}
                <div className="flex w-full items-center justify-center gap-1.5">
                    <span className="truncate text-xs font-semibold text-[#e8f4fd]">{driver.name}</span>
                    {driver.isPartner && <img src={partnerMark} alt="파트너" className="h-3 w-3 shrink-0" loading="lazy" />}
                </div>
            </div>
        </div>
    )
}
