import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl w-full p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">EL ACCESS</h1>
        <p className="mb-6">Internship & growth portal frontend scaffold.</p>
        <div className="flex gap-3">
          <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded">Login</Link>
          <Link href="/dashboard" className="px-4 py-2 border rounded">Dashboard</Link>
        </div>
      </div>
    </div>
  )
}
