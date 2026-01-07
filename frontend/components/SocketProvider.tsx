import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const SocketContext = createContext<{ socket?: Socket } | undefined>(undefined)

export function useSocket() {
  const ctx = useContext(SocketContext)
  if (!ctx) throw new Error('useSocket must be used within SocketProvider')
  return ctx
}

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | undefined>(undefined)

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_WS_URL || ''
    // try to read token from localStorage (fallback)
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
    const s = io(base, { auth: { token } })
    setSocket(s)
    return () => {
      s.disconnect()
    }
  }, [])

  const value = useMemo(() => ({ socket }), [socket])
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}
