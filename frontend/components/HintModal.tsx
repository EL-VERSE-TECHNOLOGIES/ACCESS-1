import { useState } from 'react'
import api from '../lib/api'

export default function HintModal({ taskId, onClose }: { taskId: string | number; onClose: () => void }) {
  const [messages, setMessages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  async function requestHint() {
    setLoading(true)
    try {
      const res = await api.get(`/access/tasks/${taskId}/hint`)
      setMessages((m) => [...m, res.data?.hint || JSON.stringify(res.data)])
    } catch (e) {
      setMessages((m) => [...m, 'Failed to get hint'])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Uno Hint</h3>
          <button onClick={onClose} className="text-sm">Close</button>
        </div>
        <div className="h-48 overflow-auto p-2 border rounded mb-2">
          {messages.length === 0 ? <div className="text-sm text-gray-500">No hints yet.</div> : messages.map((m, i) => <div key={i} className="mb-2">{m}</div>)}
        </div>
        <div className="flex gap-2">
          <button onClick={requestHint} disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded">Request Hint</button>
          <button onClick={onClose} className="px-3 py-1 border rounded">Close</button>
        </div>
      </div>
    </div>
  )
}
