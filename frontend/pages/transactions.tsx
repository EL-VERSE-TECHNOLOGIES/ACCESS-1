import useSWR from 'swr'
import api from '../lib/api'
import AuthShell from '../components/AuthShell'

const fetcher = (url: string) => api.get(url).then(r => r.data)

export default function TransactionsPage() {
  const { data } = useSWR('/wallet/transactions', fetcher)

  return (
    <AuthShell>
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto bg-white p-4 rounded shadow">
          <h1 className="text-2xl font-semibold mb-4">Transactions</h1>
          <div className="space-y-2">
            {(data || []).map((t: any) => (
              <div key={t.id} className="p-3 border rounded flex justify-between">
                <div>
                  <div className="font-medium">{t.type}</div>
                  <div className="text-sm text-gray-500">{t.description}</div>
                </div>
                <div className="text-right">{t.amount}</div>
              </div>
            ))}
            {(!data || data.length === 0) && <div className="text-sm text-gray-500">No transactions found.</div>}
          </div>
        </div>
      </div>
    </AuthShell>
  )
}
