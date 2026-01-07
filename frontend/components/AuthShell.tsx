import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMe } from '../lib/hooks'

export default function AuthShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, loading } = useMe()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user])

  if (loading) return <div className="p-6">Checking auth...</div>
  return <>{children}</>
}
