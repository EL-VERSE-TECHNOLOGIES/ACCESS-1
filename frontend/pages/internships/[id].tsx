import useSWR from 'swr'
import axios from 'axios'
import { useRouter } from 'next/router'

const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then(r => r.data)

export default function InternshipDetail() {
  const router = useRouter()
  const { id } = router.query
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  const { data } = useSWR(id ? `${base}/api/access/internships/${id}` : null, fetcher)

  if (!data) return <div className="p-6">Loading...</div>

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-2">{data.title}</h1>
        <p className="mb-4">{data.description}</p>
        <div className="flex gap-3">
          <a className="px-3 py-2 bg-blue-600 text-white rounded">Apply / Join</a>
        </div>
      </div>
    </div>
  )
}
