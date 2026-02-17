import { useCallback, useEffect, useState } from 'react'
import { MessageSquare, X } from 'lucide-react'
import { useSubmitInquiry, mapInquiryType } from '../hooks/useSubmitInquiry'

const inquiryTypes = ['일정 제보', '기타 건의'] as const

interface FormErrors {
    title?: string
    content?: string
}

function validateForm(title: string, content: string): FormErrors {
    const errors: FormErrors = {}
    if (title.length < 2 || title.length > 80) {
        errors.title = '제목은 2~80자여야 합니다'
    }
    if (content.length < 10 || content.length > 2000) {
        errors.content = '내용은 10~2000자여야 합니다'
    }
    return errors
}

export function ContactPanel() {
    const [isOpen, setIsOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [email, setEmail] = useState('')
    const [type, setType] = useState<string>(inquiryTypes[0])
    const [content, setContent] = useState('')
    const [errors, setErrors] = useState<FormErrors>({})
    const [showSuccess, setShowSuccess] = useState(false)
    const mutation = useSubmitInquiry()

    const resetForm = useCallback(() => {
        setTitle('')
        setEmail('')
        setType(inquiryTypes[0])
        setContent('')
        setErrors({})
    }, [])

    useEffect(() => {
        if (!showSuccess) return
        const timer = setTimeout(() => setShowSuccess(false), 3000)
        return () => clearTimeout(timer)
    }, [showSuccess])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const validationErrors = validateForm(title, content)
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }
        setErrors({})
        mutation.mutate(
            {
                title,
                email: email || undefined,
                inquiryType: mapInquiryType(type),
                content,
            },
            {
                onSuccess: () => {
                    resetForm()
                    setShowSuccess(true)
                },
            },
        )
    }

    return (
        <div className="fixed bottom-5 right-5 z-[60] sm:bottom-8 sm:right-8">
            {isOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
                    aria-label="문의하기 닫기"
                    onClick={() => setIsOpen(false)}
                />
            )}
            <div
                className={[
                    'fixed bottom-16 left-5 right-5 z-[70] origin-bottom transition-all duration-200 ease-out sm:bottom-20 sm:left-auto sm:right-8 sm:w-[360px] sm:origin-bottom-right',
                    isOpen
                        ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                        : 'pointer-events-none translate-y-3 scale-95 opacity-0',
                ].join(' ')}
            >
                <div className="overflow-hidden rounded-2xl border border-border/40 bg-bg shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
                    <div className="border-b border-border/30 px-4 py-3">
                        <h2 className="text-sm font-semibold text-text">
                            문의하기
                        </h2>
                    </div>
                    <form
                        className="flex flex-col gap-3 px-4 py-4"
                        onSubmit={handleSubmit}
                    >
                        {showSuccess && (
                            <div className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-medium text-primary">
                                문의가 전송되었습니다
                            </div>
                        )}
                        {mutation.isError && (
                            <div className="rounded-xl border border-live/30 bg-live/10 px-3 py-2 text-xs font-medium text-live">
                                전송에 실패했습니다. 다시 시도해 주세요
                            </div>
                        )}
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="contact-title"
                                className="text-xs text-text-dim"
                            >
                                제목
                            </label>
                            <input
                                id="contact-title"
                                name="title"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="문의 제목을 입력해 주세요"
                                className="w-full rounded-xl border border-border/40 bg-bg-secondary/60 px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-primary/50 focus:outline-none"
                            />
                            {errors.title && (
                                <p className="text-xs text-live">
                                    {errors.title}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="contact-email"
                                className="text-xs text-text-dim"
                            >
                                이메일 (선택)
                            </label>
                            <input
                                id="contact-email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="회신 받을 이메일"
                                className="w-full rounded-xl border border-border/40 bg-bg-secondary/60 px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-primary/50 focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="contact-type"
                                className="text-xs text-text-dim"
                            >
                                문의 유형
                            </label>
                            <select
                                id="contact-type"
                                name="type"
                                className="w-full rounded-xl border border-border/40 bg-bg-secondary/60 px-3 py-2 text-sm text-text focus:border-primary/50 focus:outline-none"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                {inquiryTypes.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="contact-message"
                                className="text-xs text-text-dim"
                            >
                                내용
                            </label>
                            <textarea
                                id="contact-message"
                                name="message"
                                required
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="문의 내용을 입력해 주세요"
                                className="min-h-[120px] w-full resize-none rounded-xl border border-border/40 bg-bg-secondary/60 px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-primary/50 focus:outline-none"
                            />
                            {errors.content && (
                                <p className="text-xs text-live">
                                    {errors.content}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full cursor-pointer rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dim disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {mutation.isPending ? '전송 중...' : '문의 보내기'}
                        </button>
                    </form>
                </div>
            </div>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="relative z-[70] flex h-12 w-12 items-center justify-center rounded-full border border-border/40 bg-primary text-text shadow-[0_12px_30px_rgba(0,0,0,0.2)] transition-transform hover:scale-105"
                aria-label={isOpen ? '문의하기 닫기' : '문의하기 열기'}
            >
                {isOpen ? (
                    <X className="h-5 w-5" />
                ) : (
                    <MessageSquare className="h-5 w-5" />
                )}
            </button>
        </div>
    )
}
