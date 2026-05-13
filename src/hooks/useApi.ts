import { useState, useCallback } from "react"

const API_BASE = "http://localhost:5000/api"

function getToken() {
  return localStorage.getItem("admin_token") || ""
}

function authHeaders(isFormData = false): HeadersInit {
  const h: Record<string, string> = {
    Authorization: `Bearer ${getToken()}`,
  }
  if (!isFormData) h["Content-Type"] = "application/json"
  return h
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const isFormData = options.body instanceof FormData
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...authHeaders(isFormData),
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || "Request failed")
  }
  if (res.status === 204) return null as T
  return res.json()
}

// Generic async hook
export function useApiCall<T>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const call = useCallback(
    async (fn: () => Promise<T>): Promise<T | null> => {
      setLoading(true)
      setError(null)
      try {
        const result = await fn()
        return result
      } catch (e: any) {
        setError(e.message)
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { loading, error, call }
}
