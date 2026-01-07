import useSWR from 'swr'
import axios from 'axios'
import Link from 'next/link'

const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then(r => r.data)

export default function Dashboard() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  const { data, error } = useSWR(base + '/api/access/dashboard', fetcher)

  if (error) return <div className="p-6">Failed to load dashboard</div>
  if (!data) return <div className="p-6">Loading...</div>

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <nav className="flex gap-3">
            <Link href="/internships">Internships</Link>
            <Link href="/notifications">Notifications</Link>
          </nav>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded shadow">Wallet: {data.wallet?.balance ?? '—'}</div>
          <div className="p-4 bg-white rounded shadow">Active internships: {data.internships?.length ?? 0}</div>
          <div className="p-4 bg-white rounded shadow">Tasks due: {data.tasksDue ?? 0}</div>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-medium mb-3">Recent internships</h2>
          <div className="grid gap-3">
            {(data.internships || []).map((i: any) => (
              <div key={i.id} className="p-4 bg-white rounded shadow">
                <h3 className="font-semibold">{i.title}</h3>
                <p className="text-sm">{i.description}</p>
                <div className="mt-2">
                  <Link href={`/internships/${i.id}`} className="text-blue-600">View</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
