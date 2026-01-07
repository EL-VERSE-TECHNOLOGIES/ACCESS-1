import React from 'react'
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
          <Link href="/dashboard" className="font-semibold">EL ACCESS</Link>
          <nav className="flex gap-3">
            <Link href="/internships">Internships</Link>
            <Link href="/peer-help">Peer Help</Link>
            <Link href="/wallet">Wallet</Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
