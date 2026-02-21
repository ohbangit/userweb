import { useState } from 'react'
import {
    getAdminApiKey,
    setAdminApiKey,
    clearAdminApiKey,
} from '../../../lib/apiClient'

export function useAdminAuth() {
    const [apiKey, setApiKeyState] = useState<string>(() => getAdminApiKey())

    function login(key: string) {
        setAdminApiKey(key)
        setApiKeyState(key)
    }

    function logout() {
        clearAdminApiKey()
        setApiKeyState('')
    }

    return {
        apiKey,
        isAuthenticated: apiKey.length > 0,
        login,
        logout,
    }
}
