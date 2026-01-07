import useSWR from 'swr'
import axios from 'axios'
import Link from 'next/link'

const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then(r => r.data)

export default function Internships() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  const { data } = useSWR(base + '/api/access/internships', fetcher)

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Internships</h1>
        <div className="grid gap-3">
          {(data || []).map((it: any) => (
            <div key={it.id} className="p-4 bg-white rounded shadow">
              <h3 className="font-semibold">{it.title}</h3>
              <p className="text-sm">{it.description}</p>
              <div className="mt-2">
                <Link href={`/internships/${it.id}`} className="text-blue-600">Details</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
