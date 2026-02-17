export function Footer() {
    return (
        <footer className="border-t border-border/30 bg-bg-secondary/60">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-text">
                            오뱅잇
                        </p>
                        <p className="text-xs text-text-muted">
                            스트리머 방송 스케줄을 한곳에서 확인
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-muted">
                        <span>이용약관</span>
                        <span>개인정보처리방침</span>
                        <a
                            className="hover:text-text"
                            href="mailto:help@ohbangit.kr"
                        >
                            문의: help@ohbangit.kr
                        </a>
                    </div>
                </div>
                <p className="mt-4 text-[11px] text-text-dim">
                    © 2026 오뱅잇. All rights reserved.
                </p>
            </div>
        </footer>
    )
}
