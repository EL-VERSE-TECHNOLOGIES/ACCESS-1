import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from 'axios'
import { useState } from 'react'

const Editor = dynamic(() => import('@monaco-editor/react').then(m => m.default), { ssr: false })

const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then(r => r.data)

export default function TaskPage() {
  const router = useRouter()
  const { id } = router.query
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  const { data } = useSWR(id ? `${base}/api/access/tasks/${id}` : null, fetcher)
  const [code, setCode] = useState<string>("")

  async function submit() {
    try {
      await axios.post(`${base}/api/access/tasks/${id}/submit`, { code }, { withCredentials: true })
      alert('Submitted')
    } catch (err) {
      console.error(err)
      alert('Submit failed')
    }
  }

  if (!data) return <div className="p-6">Loading...</div>

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white p-4 rounded shadow">
          <h2 className="font-semibold">{data.title}</h2>
          <p className="text-sm mt-2">{data.description}</p>
        </div>

        <div className="md:col-span-2 bg-white p-4 rounded shadow">
          <div className="h-[400px]">
            <Editor height="100%" defaultLanguage="javascript" value={code} onChange={(v) => setCode(v || '')} />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={submit} className="px-4 py-2 bg-green-600 text-white rounded">Submit</button>
            <button className="px-4 py-2 border rounded">Request Hint</button>
          </div>
        </div>
      </div>
    </div>
  )
}
