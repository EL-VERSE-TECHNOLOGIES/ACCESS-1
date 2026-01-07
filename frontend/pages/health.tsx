import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Health() {
  const [status, setStatus] = useState({ api: 'unknown', docs: 'unknown' })

  useEffect(() => {
    async function check() {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''
      try {
        const r = await axios.get(base + '/api/')
        setStatus((s) => ({ ...s, api: r.status + ' ' + r.statusText }))
      } catch (e: any) {
        setStatus((s) => ({ ...s, api: e?.message || 'error' }))
      }

      try {
        const r2 = await axios.get(base + '/docs')
        setStatus((s) => ({ ...s, docs: r2.status + ' ' + r2.statusText }))
      } catch (e: any) {
        setStatus((s) => ({ ...s, docs: e?.message || 'error' }))
      }
    }
    check()
  }, [])

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">Backend Health</h1>
        <div className="space-y-2">
          <div>API root: {status.api}</div>
          <div>Swagger docs: {status.docs}</div>
        </div>
      </div>
    </div>
  )
}
