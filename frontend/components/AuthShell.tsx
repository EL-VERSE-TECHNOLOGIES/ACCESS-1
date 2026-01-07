import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function AuthShell({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function check() {
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''
        await axios.get(base + '/api/auth/me', { withCredentials: true })
        setLoading(false)
      } catch (err) {
        router.push('/login')
      }
    }
    check()
  }, [])

  if (loading) return <div className="p-6">Checking auth...</div>
  return <>{children}</>
}
