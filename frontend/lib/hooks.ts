import { useState, useEffect } from 'react'
import useSWR from 'swr'
import api from './api'

// Check if we're using the mock API
const isMockApi = typeof (api as any).get === 'function' && !(api as any).defaults;

const fetcher = async (url: string) => {
  if (isMockApi) {
    const result = await (api as any).get(url);
    return result.data;
  } else {
    return api.get(url).then(r => r.data);
  }
};

export function useMe() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Only access localStorage in the browser
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('accessToken'));
    }
  }, []);

  const { data, error } = useSWR(token ? '/auth/me' : null, fetcher);
  return { user: data, loading: !error && !data && !!token, error };
}
