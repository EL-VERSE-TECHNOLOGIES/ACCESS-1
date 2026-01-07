import React from 'react'
import Link from 'next/link'
import { useMe } from '../lib/hooks'
import api from '../lib/api'
import { useRouter } from 'next/router'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useMe()
  const router = useRouter()

  async function logout() {
    try {
      await api.post('/auth/logout')
    } catch (e) {
      // ignore
    }
    if (typeof window !== 'undefined') localStorage.removeItem('accessToken')
    router.push('/login')
  }

  return (
    <div>
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-semibold">EL ACCESS</Link>
            <nav className="flex gap-3">
              <Link href="/internships">Internships</Link>
              <Link href="/peer-help">Peer Help</Link>
              <Link href="/wallet">Wallet</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/profile" className="text-sm">{user.username || user.fullName || 'Me'}</Link>
                <button onClick={logout} className="px-3 py-1 border rounded text-sm">Logout</button>
              </>
            ) : (
              <Link href="/login" className="px-3 py-1 border rounded text-sm">Login</Link>
            )}
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
