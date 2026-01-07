import useSWR from 'swr'
import api from './api'

const fetcher = (url: string) => api.get(url).then(r => r.data)

export function useMe() {
  const { data, error } = useSWR('/auth/me', fetcher)
  return { user: data, loading: !error && !data, error }
}
