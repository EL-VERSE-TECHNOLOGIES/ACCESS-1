import useSWR from 'swr'
import api from '../lib/api'

const fetcher = (url: string) => api.get(url).then(r => r.data)

export default function WalletPage() {
  const { data } = useSWR('/wallet', fetcher)

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Wallet</h1>
        <div className="p-4 bg-white rounded shadow mb-4">Balance: {data?.balance ?? '—'}</div>

        <h2 className="text-lg font-medium mb-2">Transactions</h2>
        <div className="space-y-2">
          {(data?.transactions || []).map((t: any) => (
            <div key={t.id} className="p-3 bg-white rounded shadow flex justify-between">
              <div>
                <div className="font-medium">{t.type}</div>
                <div className="text-sm text-gray-500">{t.description}</div>
              </div>
              <div className="text-right">{t.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
