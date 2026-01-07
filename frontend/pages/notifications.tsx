import { useEffect, useState } from 'react'
import { useSocket } from '../components/SocketProvider'
import api from '../lib/api'

export default function NotificationsPage() {
  const { socket } = useSocket()
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/notifications')
        setItems(res.data || [])
      } catch (e) {
        // ignore
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!socket) return
    const handler = (n: any) => setItems((s) => [n, ...s])
    socket.on('notification', handler)
    return () => {
      socket.off('notification', handler)
    }
  }, [socket])

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
        <div className="space-y-2">
          {items.map((it, idx) => (
            <div key={idx} className="p-3 bg-white rounded shadow">
              <div className="text-sm">{it.message || JSON.stringify(it)}</div>
              <div className="text-xs text-gray-400">{new Date(it.createdAt || Date.now()).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
