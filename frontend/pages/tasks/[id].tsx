import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from 'axios'
import { useState, useEffect } from 'react'
import HintModal from '../../components/HintModal'
import UploadWidget from '../../components/UploadWidget'

const Editor = dynamic(() => import('@monaco-editor/react').then(m => m.default), { ssr: false })

const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then(r => r.data)

export default function TaskPage() {
  const router = useRouter()
  const { id } = router.query
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  const { data } = useSWR(id ? `${base}/api/access/tasks/${id}` : null, fetcher)
  const [code, setCode] = useState<string>("")
  const [dirty, setDirty] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [mediaIds, setMediaIds] = useState<string[]>([])

  useEffect(() => {
    // load autosave
    if (!id) return
    const key = `task:${id}:autosave`
    const saved = typeof window !== 'undefined' ? localStorage.getItem(key) : null
    if (saved) setCode(saved)
  }, [id])

  useEffect(() => {
    const key = `task:${id}:autosave`
    const t = setTimeout(() => {
      if (dirty && typeof window !== 'undefined') {
        localStorage.setItem(key, code)
      }
    }, 1000)
    return () => clearTimeout(t)
  }, [code, dirty])

  async function submit() {
    try {
      await axios.post(`${base}/api/access/tasks/${id}/submit`, { code, mediaIds }, { withCredentials: true })
      alert('Submitted')
    } catch (err) {
      console.error(err)
      alert('Submit failed')
    }
  }

  if (!data) return <div className="p-6">Loading...</div>

  // require auth
  const AuthShell = require('../../components/AuthShell').default

  return (
    <AuthShell>
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white p-4 rounded shadow">
            <h2 className="font-semibold">{data.title}</h2>
            <p className="text-sm mt-2">{data.description}</p>
          </div>

          <div className="md:col-span-2 bg-white p-4 rounded shadow">
            <div className="h-[360px]">
              <Editor height="100%" defaultLanguage={data.language || 'javascript'} value={code} onChange={(v) => { setCode(v || ''); setDirty(true) }} />
            </div>
            <div className="mt-3 flex gap-2 items-center">
              <button onClick={submit} className="px-4 py-2 bg-green-600 text-white rounded">Submit</button>
              <button onClick={() => setShowHint(true)} className="px-4 py-2 border rounded">Uno Hint</button>
              <div className="ml-auto w-64">
                <UploadWidget onComplete={(id) => setMediaIds((s) => [...s, id])} />
              </div>
            </div>
          </div>
        </div>

        {showHint && <HintModal taskId={id as string} onClose={() => setShowHint(false)} />}
      </div>
    </AuthShell>
  )
}
