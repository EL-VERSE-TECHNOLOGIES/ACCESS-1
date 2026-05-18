import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
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

  // Check if user has management/admin privileges
  const isManagementOrAdmin = user && (user.tier === 'Management' || user.tier === 'Lead');

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-dark-surface border-b border-slate-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-neon-accent rounded-md blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
                <Image
                  src="/images/new_logo.jpg"
                  alt="EL ACCESS Logo"
                  width={36}
                  height={36}
                  className="rounded-md relative bg-white"
                />
              </div>
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-neon-accent transition-colors">EL ACCESS</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/internships" className="text-sm font-medium text-text-secondary hover:text-neon-accent transition-colors">Internships</Link>
              <Link href="/peer-help" className="text-sm font-medium text-text-secondary hover:text-neon-accent transition-colors">Peer Help</Link>
              <Link href="/wallet" className="text-sm font-medium text-text-secondary hover:text-neon-accent transition-colors">Wallet</Link>
              {isManagementOrAdmin && <Link href="/health" className="text-sm font-medium text-text-secondary hover:text-neon-accent transition-colors">Health Check</Link>}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/profile" className="text-sm">{user.name || 'Me'}</Link>
                <button onClick={logout} className="px-3 py-1 border rounded text-sm">Logout</button>
              </>
            ) : (
              <Link href="/login" className="px-3 py-1 border rounded text-sm">Login</Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="bg-dark-surface border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-500 text-sm font-medium">
            © 2024 EL VERSE TECHNOLOGIES. All Rights Reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/support" className="text-slate-500 hover:text-neon-accent text-sm transition-colors">Support</Link>
            <Link href="/community" className="text-slate-500 hover:text-neon-accent text-sm transition-colors">Community</Link>
            <Link href="/admin" className="text-slate-500 hover:text-neon-accent text-sm transition-colors font-bold border-l border-slate-800 pl-6">Admin Access</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
