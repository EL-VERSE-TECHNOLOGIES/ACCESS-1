import dynamic from 'next/dynamic'
import { useState } from 'react'

const Editor = dynamic(() => import('@monaco-editor/react').then(m => m.default), { ssr: false })

export default function TaskEditor({ initial = '' }: { initial?: string }) {
  const [code, setCode] = useState(initial)
  return (
    <div>
      <div className="h-[360px] border rounded">
        <Editor height="100%" defaultLanguage="javascript" value={code} onChange={(v) => setCode(v || '')} />
      </div>
    </div>
  )
}
