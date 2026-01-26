import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useMe } from '../lib/hooks'
import api from '../lib/api'
import { useRouter } from 'next/router'
import BackendSelector from './BackendSelector'

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

  // Check if user has management/admin privileges
  const isManagementOrAdmin = user && (user.tier === 'Management' || user.tier === 'Lead');

  return (
    <div>
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image
                src="/images/logo.svg"
                alt="EL ACCESS Logo"
                width={32}
                height={32}
                className="rounded-md"
              />
              <span className="font-semibold">EL ACCESS</span>
            </Link>
            <nav className="flex gap-3">
              <Link href="/internships">Internships</Link>
              <Link href="/peer-help">Peer Help</Link>
              <Link href="/wallet">Wallet</Link>
              {isManagementOrAdmin && <Link href="/health">Health Check</Link>}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <BackendSelector />
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
