import type { DraftContent } from '../types'

function formatDate(dateStr: string | null): string {
    if (dateStr === null) return '-'
    const [datePart, timePart] = dateStr.split(' ')
    const d = new Date(datePart)
    const dateFormatted = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
    return timePart ? `${dateFormatted} ${timePart}` : dateFormatted
}

interface Props {
    title: string
    content: DraftContent
}

export function DraftPanelView({ title, content }: Props) {
    return (
        <section className="w-full space-y-6">
            <div className="space-y-1">
                <h2 className="text-3xl font-bold text-[#e8f4fd]">{title}</h2>
                {/* 디바이더 */}
                <div className="mt-3 h-px w-full bg-gradient-to-r from-[#0596e8]/60 via-[#1e3a5f]/40 to-transparent" />
                {(content.startsOn !== null || content.meta.length > 0) && (
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xl text-[#6aadcc]">
                        {content.startsOn !== null && (
                            <span>{formatDate(content.startsOn)}</span>
                        )}
                        {content.startsOn !== null &&
                            content.meta.length > 0 && (
                                <span className="opacity-30">/</span>
                            )}
                        {content.meta.length > 0 && (
                            <span className="opacity-70">{content.meta}</span>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}
