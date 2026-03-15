import { useState } from 'react'
import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../../lib/cn'

interface Props {
    id?: string
    title: string
    defaultOpen?: boolean
    children: ReactNode
}

export function AccordionSection({ id, title, defaultOpen = true, children }: Props) {
    const [isOpen, setIsOpen] = useState(defaultOpen)
    const contentId = id != null ? `${id}-content` : undefined

    return (
        <section id={id} className="mt-10 w-full scroll-mt-24">
            <h2>
                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    className="group flex w-full cursor-pointer items-center justify-between gap-4"
                >
                    <span className="font-f1 text-left text-5xl font-black uppercase tracking-tight text-[#e8f4fd] transition-colors group-hover:text-white">
                        {title}
                    </span>
                    <ChevronDown
                        className={['h-7 w-7 shrink-0 text-[#E10600] transition-transform duration-300', isOpen ? 'rotate-180' : ''].join(
                            ' ',
                        )}
                    />
                </button>
            </h2>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-[#E10600]/60 via-[#7a0300]/40 to-transparent" />
            <div
                id={contentId}
                className={cn(
                    'overflow-hidden transition-all duration-300',
                    isOpen ? 'mt-6 max-h-[5000px] opacity-100' : 'max-h-0 opacity-0',
                )}
            >
                <div className="min-h-0 overflow-hidden">{children}</div>
            </div>
        </section>
    )
}
