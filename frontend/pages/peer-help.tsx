import { useState } from 'react'
import AuthShell from '../components/AuthShell'
import ChatList from '../components/ChatList'
import ChatWindow from '../components/ChatWindow'

export default function PeerHelp() {
  const [room, setRoom] = useState<string>('public')

  return (
    <AuthShell>
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <ChatList onSelect={(r) => setRoom(r)} />
          </div>
          <div className="md:col-span-3 bg-white p-4 rounded shadow">
            <h1 className="text-xl font-semibold mb-3">Peer Help — {room}</h1>
            <ChatWindow room={room} />
          </div>
        </div>
      </div>
    </AuthShell>
  )
}
