import { useEffect, useState } from 'react'
import { useSocket } from './SocketProvider'

export default function ChatList({ onSelect }: { onSelect: (room: string) => void }) {
  const { socket } = useSocket()
  const [peers, setPeers] = useState<any[]>([])

  useEffect(() => {
    if (!socket) return
    const handler = (list: any[]) => setPeers(list)
    socket.on('presence:list', handler)
    socket.emit('presence:subscribe')
    return () => { socket.off('presence:list', handler) }
  }, [socket])

  return (
    <div className="p-2 border rounded h-64 overflow-auto">
      <h3 className="font-medium mb-2">Online</h3>
      {peers.length === 0 && <div className="text-sm text-gray-500">No peers online</div>}
      {peers.map((p) => (
        <div key={p.id} className="py-1 cursor-pointer hover:bg-gray-50" onClick={() => onSelect(p.room || p.id)}>
          {p.username || p.fullName || p.id}
        </div>
      ))}
    </div>
  )
}
