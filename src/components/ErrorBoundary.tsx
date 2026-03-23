import { Component, type ReactNode } from 'react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(): State {
        return { hasError: true }
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback
            return (
                <div className="flex min-h-[200px] items-center justify-center">
                    <div className="text-center">
                        <p className="text-lg font-semibold text-text-secondary">오류가 발생했습니다</p>
                        <button
                            type="button"
                            onClick={() => this.setState({ hasError: false })}
                            className="mt-3 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/20"
                        >
                            다시 시도
                        </button>
                    </div>
                </div>
            )
        }
        return this.props.children
    }
}
