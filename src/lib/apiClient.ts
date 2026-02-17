const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

interface ApiErrorResponse {
    error: {
        code: string
        message: string
        details?: { field: string; reason: string }[]
    }
}

export class ApiError extends Error {
    readonly code: string
    readonly status: number
    readonly details?: { field: string; reason: string }[]

    constructor({
        code,
        message,
        status,
        details,
    }: {
        code: string
        message: string
        status: number
        details?: { field: string; reason: string }[]
    }) {
        super(message)
        this.name = 'ApiError'
        this.code = code
        this.status = status
        this.details = details
    }
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const body = await response.json().catch(() => null)
        const errorBody = body as ApiErrorResponse | null
        throw new ApiError({
            code: errorBody?.error?.code ?? 'UNKNOWN_ERROR',
            message:
                errorBody?.error?.message ??
                `HTTP ${response.status} 오류가 발생했습니다`,
            status: response.status,
            details: errorBody?.error?.details,
        })
    }
    return response.json() as Promise<T>
}

export async function apiGet<T>(
    path: string,
    params?: Record<string, string>,
): Promise<T> {
    const url = new URL(`${BASE_URL}${path}`, window.location.origin)
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.set(key, value)
        })
    }
    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    return handleResponse<T>(response)
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
    return handleResponse<T>(response)
}
