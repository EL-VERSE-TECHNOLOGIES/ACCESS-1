import { useEffect, useState, useRef } from 'react'
import { useSocket } from './SocketProvider'

export default function ChatWindow({ room }: { room: string }) {
  const { socket } = useSocket()
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState('')
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!socket) return
    const handler = (m: any) => setMessages((s) => [...s, m])
    socket.on('chat:message', handler)
    return () => { socket.off('chat:message', handler) }
  }, [socket])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages])

  function send() {
    if (!socket || !text) return
    const payload = { room, text }
    socket.emit('chat:message', payload)
    setMessages((s) => [...s, { ...payload, local: true }])
    setText('')
  }

  return (
    <div className="flex flex-col h-full">
      <div ref={listRef} className="flex-1 overflow-auto p-2 border rounded mb-2 h-64">
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 ${m.local ? 'text-right' : ''}`}>
            <div className="inline-block bg-gray-100 p-2 rounded">{m.text}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 p-2 border rounded" />
        <button onClick={send} className="px-3 py-2 bg-blue-600 text-white rounded">Send</button>
      </div>
    </div>
  )
}
