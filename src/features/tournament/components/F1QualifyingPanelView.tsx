import partnerMark from '../../../assets/mark.png'
import type { F1QualifyingContent } from '../types'

interface Props {
    title: string
    content: F1QualifyingContent
}

export function F1QualifyingPanelView({ title, content }: Props) {
    const { description, firstDriverResults, secondDriverResults } = content

    const sortedFirst = [...firstDriverResults].sort((a, b) => (a.position ?? 999) - (b.position ?? 999))
    const sortedSecond = [...secondDriverResults].sort((a, b) => (a.position ?? 999) - (b.position ?? 999))

    return (
        <section className="w-full mt-10">
            <h2 className="font-f1 text-5xl font-black tracking-tight uppercase text-[#e8f4fd]">{title}</h2>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-[#E10600]/60 via-[#7a0300]/40 to-transparent" />

            {description.length > 0 && <p className="mt-4 text-base text-[#6aadcc]/80 whitespace-pre-wrap">{description}</p>}

            <div className="mt-6 grid gap-6 md:grid-cols-2">
                {/* 퍼스트 드라이버 */}
                <div>
                    <div className="mb-3 flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#E10600]" />
                        <h3 className="text-sm font-black tracking-widest text-[#E10600] uppercase">First Driver</h3>
                    </div>
                    <QualifyingTable drivers={sortedFirst} />
                </div>

                {/* 세컨드 드라이버 */}
                <div>
                    <div className="mb-3 flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#6aadcc]" />
                        <h3 className="text-sm font-black tracking-widest text-[#6aadcc] uppercase">Second Driver</h3>
                    </div>
                    <QualifyingTable drivers={sortedSecond} />
                </div>
            </div>
        </section>
    )
}

interface QualifyingTableProps {
    drivers: F1QualifyingContent['firstDriverResults']
}

function QualifyingTable({ drivers }: QualifyingTableProps) {
    if (drivers.length === 0) {
        return <p className="py-4 text-center text-sm text-[#6aadcc]/40">예선 결과가 없습니다.</p>
    }

    return (
        <ol className="space-y-1.5">
            {drivers.map((driver) => {
                const isQualified = driver.qualified
                const isDnq = !isQualified

                return (
                    <li
                        key={driver.driverId}
                        className={[
                            'flex items-center gap-3 rounded-xl border px-4 py-3 transition',
                            isDnq ? 'border-gray-700/30 bg-[#020d18]/60 opacity-50' : 'border-[#1e3a5f]/60 bg-[#041524]/70',
                        ].join(' ')}
                    >
                        {/* 순위 */}
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E10600]/10 ring-1 ring-[#E10600]/30">
                            <span className="text-xs font-black text-[#E10600]">{driver.position ?? '-'}</span>
                        </div>

                        {/* 아바타 */}
                        {driver.avatarUrl !== null ? (
                            <img
                                src={driver.avatarUrl}
                                alt={driver.name}
                                className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-[#E10600]/30"
                                loading="lazy"
                            />
                        ) : (
                            <div className="h-8 w-8 shrink-0 rounded-full bg-[#2e1a1a] ring-1 ring-[#E10600]/20" />
                        )}

                        {/* 이름 */}
                        <div className="flex min-w-0 flex-1 items-center gap-1.5">
                            <span
                                className={['truncate text-sm font-bold', isDnq ? 'text-gray-500 line-through' : 'text-[#e8f4fd]'].join(
                                    ' ',
                                )}
                            >
                                {driver.name}
                            </span>
                            {driver.isPartner && <img src={partnerMark} alt="파트너" className="h-3.5 w-3.5 shrink-0" loading="lazy" />}
                        </div>

                        {/* 랩타임 / 통과 여부 */}
                        <div className="shrink-0 text-right">
                            {driver.lapTime !== null && <span className="block text-xs font-mono text-[#6aadcc]/70">{driver.lapTime}</span>}
                            <span className={['text-xs font-semibold', isQualified ? 'text-[#4ade80]' : 'text-gray-500'].join(' ')}>
                                {isQualified ? 'Q' : 'DNQ'}
                            </span>
                        </div>
                    </li>
                )
            })}
        </ol>
    )
}
