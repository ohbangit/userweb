import { ChevronLeft, ChevronRight } from 'lucide-react'

interface NavButtonProps {
    direction: 'prev' | 'next'
    onClick: () => void
}

export function NavButton({ direction, onClick }: NavButtonProps) {
    return (
        <button
            onClick={onClick}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-border/40 bg-card text-text-muted transition-colors hover:border-border hover:text-text sm:h-8 sm:w-8"
        >
            {direction === 'prev' ? (
                <ChevronLeft className="h-4 w-4" />
            ) : (
                <ChevronRight className="h-4 w-4" />
            )}
        </button>
    )
}
