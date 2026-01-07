import { useState, useEffect } from 'react'
import { useSocket } from '../components/SocketProvider'

export default function PeerHelp() {
  const { socket } = useSocket()
  const AuthShell = require('../components/AuthShell').default
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState('')

  useEffect(() => {
    if (!socket) return
    const handler = (m: any) => setMessages((s) => [...s, m])
    socket.on('chat:message', handler)
    return () => { socket.off('chat:message', handler) }
  }, [socket])

  function send() {
    if (!text || !socket) return
    socket.emit('chat:message', { text })
    setText('')
  }

  return (
    <AuthShell>
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-3xl mx-auto bg-white p-4 rounded shadow">
          <h1 className="text-xl font-semibold mb-3">Peer Help / Chat</h1>
          <div className="h-64 overflow-auto p-2 border rounded mb-2">
            {messages.map((m, i) => <div key={i} className="mb-2"><b>{m.sender?.username || 'peer'}:</b> {m.text}</div>)}
          </div>
          <div className="flex gap-2">
            <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 p-2 border rounded" />
            <button onClick={send} className="px-3 py-2 bg-blue-600 text-white rounded">Send</button>
          </div>
        </div>
      </div>
    </AuthShell>
  )
}
