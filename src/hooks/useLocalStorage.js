import { useState, useEffect, useCallback } from 'react'

// Helper to safely parse JSON, or return the value as-is if it's a string
const parseJSON = (value, fallback) => {
  try {
    if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
      return JSON.parse(value)
    }
    return value
  } catch {
    return fallback
  }
}

// Core useLocalStorage hook
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue
    const item = window.localStorage.getItem(key)
    if (item === null) {
      window.localStorage.setItem(key, JSON.stringify(initialValue))
      return initialValue
    }
    return parseJSON(item, initialValue)
  })

  const setValue = useCallback(
    (value) => {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)

      if (typeof window !== 'undefined') {
        if (typeof valueToStore === 'string') {
          window.localStorage.setItem(key, valueToStore) // store strings as-is
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      }
    },
    [key, storedValue]
  )

  const removeValue = useCallback(() => {
    setStoredValue(initialValue)
    if (typeof window !== 'undefined') window.localStorage.removeItem(key)
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

// Token-specific hook
export const useTokenStorage = () => {
  const [token, setToken, removeToken] = useLocalStorage('token', null)
  const [refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage('refresh_token', null)

  const setTokens = useCallback((newToken, newRefreshToken = null) => {
    setToken(newToken)
    if (newRefreshToken) setRefreshToken(newRefreshToken)
  }, [setToken, setRefreshToken])

  const removeTokens = useCallback(() => {
    removeToken()
    removeRefreshToken()
  }, [removeToken, removeRefreshToken])

  const isValidToken = useCallback(() => {
    if (!token) return false
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 > Date.now()
    } catch {
      return false
    }
  }, [token])

  const getTokenPayload = useCallback(() => {
    if (!token) return null
    try {
      return JSON.parse(atob(token.split('.')[1]))
    } catch {
      return null
    }
  }, [token])

  return {
    token,
    refreshToken,
    setToken,
    setRefreshToken,
    setTokens,
    removeToken,
    removeRefreshToken,
    removeTokens,
    isValidToken,
    getTokenPayload
  }
}

export default useLocalStorage
