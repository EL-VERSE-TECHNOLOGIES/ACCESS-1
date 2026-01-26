import { useState, useEffect } from 'react'
import useSWR from 'swr'
import api from './api'

// Define the User type
interface User {
  id: string;
  email: string;
  name: string;
  tier: 'Intern' | 'Lead' | 'Management'; // Add tier property
  created_at: string;
  is_active: boolean;
  face_verification_status: string;
  cv?: string;
  fingerprint_verified: boolean;
}

const fetcher = (url: string) => api.get(url).then(r => r.data)

export function useMe() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Only access localStorage in the browser
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('accessToken'))
    }
  }, [])

  const { data, error } = useSWR<User>(token ? '/auth/me' : null, fetcher)
  return { user: data, loading: !error && !data && !!token, error }
}
