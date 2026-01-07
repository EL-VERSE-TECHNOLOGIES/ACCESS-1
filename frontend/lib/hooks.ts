import useSWR from 'swr'
import api from './api'

const fetcher = (url: string) => api.get(url).then(r => r.data)

export function useMe() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  const { data, error } = useSWR(token ? '/auth/me' : null, fetcher)
  return { user: data, loading: !error && !data && !!token, error }
}
