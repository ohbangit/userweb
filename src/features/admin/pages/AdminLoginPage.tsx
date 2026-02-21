import { useState } from 'react'
import { useAdminAuth } from '../hooks'

export default function AdminLoginPage() {
    const { login } = useAdminAuth()
    const [key, setKey] = useState('')
    const [error, setError] = useState('')

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (key.trim().length === 0) {
            setError('API 키를 입력해주세요.')
            return
        }
        login(key.trim())
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
                <div className="mb-8">
                    <h1 className="text-xl font-bold text-gray-900">
                        어드민 로그인
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        API 키를 입력해 어드민 페이지에 접근하세요.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="api-key"
                            className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            API 키
                        </label>
                        <input
                            id="api-key"
                            type="password"
                            value={key}
                            onChange={(e) => {
                                setKey(e.target.value)
                                setError('')
                            }}
                            placeholder="API 키 입력"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            autoComplete="current-password"
                        />
                        {error && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {error}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 active:bg-blue-700"
                    >
                        확인
                    </button>
                </form>
            </div>
        </div>
    )
}
