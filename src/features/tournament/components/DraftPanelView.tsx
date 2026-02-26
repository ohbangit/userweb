import type { DraftContent } from '../types'

interface Props {
    title: string
    content: DraftContent
}

function formatDate(dateStr: string | null): string {
    if (dateStr === null) return '-'
    const d = new Date(dateStr)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export function DraftPanelView({ title, content }: Props) {
    const sorted = [...content.participants].sort((a, b) => a.order - b.order)

    return (
        <section className="w-full">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">{title}</h2>

            {/* 메타 정보 */}
            <div className="mb-6 flex flex-wrap gap-4">
                {content.startsOn !== null && (
                    <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2 text-sm text-gray-600">
                        <span className="font-medium">일자</span>
                        <span>{formatDate(content.startsOn)}</span>
                    </div>
                )}
                {content.meta.length > 0 && (
                    <div className="rounded-lg bg-gray-50 px-4 py-2 text-sm text-gray-600">
                        {content.meta}
                    </div>
                )}
            </div>

            {/* 참가자 목록 */}
            {sorted.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {sorted.map((participant, idx) => (
                        <div
                            key={participant.id}
                            className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
                        >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                                {participant.seed ?? idx + 1}
                            </span>
                            <span className="truncate text-sm font-medium text-gray-800">
                                {participant.name}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-400">
                    등록된 참가자가 없습니다.
                </p>
            )}
        </section>
    )
}
