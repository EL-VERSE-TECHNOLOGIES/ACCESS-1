import { useState } from 'react'
import { initiateUpload, uploadToSignedUrl, completeUpload } from '../lib/media'

export default function UploadWidget({ onComplete }: { onComplete?: (mediaId: string) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [busy, setBusy] = useState(false)

  async function handleUpload() {
    if (!file) return
    setBusy(true)
    try {
      const init = await initiateUpload(file.name, file.type, file.size)
      await uploadToSignedUrl(init.signedUploadUrl, file, (p) => setProgress(p))
      await completeUpload(init.mediaId)
      setProgress(100)
      onComplete?.(init.mediaId)
      alert('Upload complete')
    } catch (err) {
      console.error(err)
      alert('Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="p-3 border rounded">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <div className="mt-2 flex gap-2">
        <button onClick={handleUpload} disabled={!file || busy} className="px-3 py-1 bg-blue-600 text-white rounded">Upload</button>
        <div className="flex-1">{progress}%</div>
      </div>
    </div>
  )
}
