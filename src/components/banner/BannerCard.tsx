import { cn } from '../../lib/cn'
import { TYPE_BADGE, TYPE_CARD_TINT, TYPE_LABEL } from './constants'
import type { BannerCardProps } from './types'
import { isBannerEnded, formatScheduleText } from './utils'

export function BannerCard({ banner, isLargeImage, isPriorityImage = false, onClick, onImageLoad, innerRef }: BannerCardProps) {
    const badgeClass = TYPE_BADGE[banner.type] ?? 'bg-primary/90 text-white'
    const cardTintClass = TYPE_CARD_TINT[banner.type] ?? 'bg-[linear-gradient(270deg,rgba(16,185,129,0.07)_0%,rgba(16,185,129,0.01)_100%)]'
    const typeLabel = TYPE_LABEL[banner.type] ?? banner.type
    const scheduleText = formatScheduleText(banner)
    const ended = isBannerEnded(banner)

    return (
        <article ref={innerRef} className="relative h-[90px] snap-start overflow-hidden rounded-xl border border-border/50">
            <button
                type="button"
                onClick={() => onClick(banner)}
                className="group relative h-full w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
                <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    loading={isPriorityImage ? 'eager' : 'lazy'}
                    fetchPriority={isPriorityImage ? 'high' : 'auto'}
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    onLoad={(e) => onImageLoad(banner.id, e.currentTarget)}
                />

                <div className={cn('absolute inset-0', cardTintClass)} />
                <div className="absolute inset-0 bg-gradient-to-br from-black/72 via-black/50 to-black/22" />

                {isLargeImage && (
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.32)_0%,rgba(255,255,255,0)_28%,rgba(0,0,0,0.36)_100%)]" />
                )}

                <div className="relative z-10 flex h-full flex-col justify-between py-2.5 pl-4 pr-2.5">
                    <div className="flex min-w-0 flex-col gap-1">
                        <p className="truncate text-[18px] font-extrabold leading-tight tracking-tight text-white">{banner.title}</p>
                        <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-[11px] text-white/90">{banner.description?.trim().length ? banner.description : '주요 콘텐츠 안내'}</p>
                            <span className={cn('shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold', badgeClass)}>{typeLabel}</span>
                        </div>
                    </div>

                    <span className={cn('truncate text-[11px] font-semibold', ended ? 'text-rose-300' : 'text-white')}>{scheduleText}</span>
                </div>
            </button>
        </article>
    )
}
