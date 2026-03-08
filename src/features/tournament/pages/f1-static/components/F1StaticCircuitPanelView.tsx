import { useMemo, useState } from 'react'
import { Gauge, CornerUpRight, Clock, MapPin } from 'lucide-react'
import type { F1CircuitContent } from '../../../types'

interface Props {
    title?: string
    content: F1CircuitContent
    hideTitle?: boolean
}

type CircuitItem = F1CircuitContent['circuits'][number]

export function F1StaticCircuitPanelView({ title, content, hideTitle = false }: Props) {
    const circuits = useMemo(() => [...content.circuits].sort((a, b) => a.order - b.order), [content.circuits])
    const [activeIdx, setActiveIdx] = useState(0)

    const body =
        circuits.length === 0 ? (
            <p className="mt-6 text-sm text-[#6aadcc]/70">등록된 서킷이 없습니다.</p>
        ) : (
            <>
                {/* 탭 */}
                <div className="mt-5 flex flex-wrap gap-2">
                    {circuits.map((c, idx) => (
                        <button
                            key={c.id}
                            type="button"
                            onClick={() => setActiveIdx(idx)}
                            className={[
                                'cursor-pointer rounded-full px-3 py-1 text-xs font-bold transition',
                                idx === activeIdx
                                    ? 'bg-[#E10600]/20 text-[#E10600] ring-1 ring-[#E10600]/40'
                                    : 'text-[#6aadcc]/70 hover:bg-[#1a0608]/60 hover:text-[#6aadcc]',
                            ].join(' ')}
                        >
                            {idx + 1}. {c.circuitName}
                        </button>
                    ))}
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl">
                    <div
                        className="flex transition-transform duration-300 ease-out"
                        style={{ transform: `translateX(-${activeIdx * 100}%)` }}
                    >
                        {circuits.map((circuit) => (
                            <div key={circuit.id} className="min-w-full">
                                <CircuitCard circuit={circuit} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 닷 인디케이터 */}
                <div className="mt-4 flex justify-center gap-2">
                    {circuits.map((_, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveIdx(idx)}
                            aria-label={`${idx + 1}번 서킷`}
                            className={[
                                'h-1.5 cursor-pointer rounded-full transition-all duration-300',
                                idx === activeIdx ? 'w-6 bg-[#E10600]' : 'w-1.5 bg-[#6aadcc]/30 hover:bg-[#6aadcc]/50',
                            ].join(' ')}
                        />
                    ))}
                </div>
            </>
        )

    if (hideTitle) {
        return <div className="w-full">{body}</div>
    }

    return (
        <section className="mt-10 w-full">
            {/* 제목 */}
            <h2 className="font-f1 text-5xl font-black uppercase tracking-tight text-[#e8f4fd]">{title}</h2>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-[#E10600]/60 via-[#7a0300]/40 to-transparent" />
            {body}
        </section>
    )
}

interface CircuitCardProps {
    circuit: CircuitItem
}

function CircuitCard({ circuit }: CircuitCardProps) {
    const specs: Array<{ icon: React.ReactNode; label: string; value: string | null }> = [
        {
            icon: <Gauge className="h-4 w-4" />,
            label: '서킷 길이',
            value: circuit.length,
        },
        {
            icon: <CornerUpRight className="h-4 w-4" />,
            label: '코너 수',
            value: circuit.corners !== null ? `${circuit.corners}개` : null,
        },
        {
            icon: <Clock className="h-4 w-4" />,
            label: '랩 레코드',
            value: circuit.lapRecord,
        },
    ]

    return (
        <div className="overflow-hidden rounded-2xl border border-[#2e1a1a] bg-[#0d0205]">
            <div className="flex flex-col lg:flex-row">
                {/* 레이아웃 이미지 */}
                {circuit.layoutImageUrl !== null && (
                    <div className="flex items-center justify-center bg-[#080102] lg:w-[400px] lg:shrink-0">
                        <img
                            src={circuit.layoutImageUrl}
                            alt={`${circuit.circuitName} 레이아웃`}
                            className="max-h-[240px] w-full object-contain p-6 lg:max-h-[320px] lg:p-8"
                            loading="lazy"
                        />
                    </div>
                )}

                {/* 정보 */}
                <div className="flex flex-1 flex-col gap-5 p-6 lg:p-8">
                    {/* 헤더 */}
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E10600]">Circuit</p>
                        <h3 className="mt-1 font-f1 text-3xl font-black text-white">{circuit.circuitName}</h3>
                        <div className="mt-2 flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-[#6aadcc]/60" />
                            <span className="text-sm text-[#6aadcc]/80">{circuit.country}</span>
                        </div>
                    </div>

                    {/* 스펙 그리드 */}
                    <div className="grid grid-cols-3 gap-3">
                        {specs.map((spec) =>
                            spec.value !== null ? (
                                <div key={spec.label} className="rounded-xl border border-[#2e1a1a] bg-[#160408] px-4 py-3">
                                    <div className="mb-1.5 flex items-center gap-1.5 text-[#E10600]/60">
                                        {spec.icon}
                                        <span className="text-[10px] font-semibold uppercase tracking-wider">{spec.label}</span>
                                    </div>
                                    <p className="font-f1 text-lg font-black text-[#e8f4fd]">{spec.value}</p>
                                </div>
                            ) : null,
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
