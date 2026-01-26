import { useState, useEffect } from 'react'
import useSWR from 'swr'
import api from './api'

const fetcher = (url: string) => api.get(url).then(r => r.data)

export function useMe() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Only access localStorage in the browser
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('accessToken'))
    }
  }, [])

  const { data, error } = useSWR(token ? '/auth/me' : null, fetcher)
  return { user: data, loading: !error && !data && !!token, error }
}
