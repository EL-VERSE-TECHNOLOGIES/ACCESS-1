import useSWR from 'swr'
import api from '../lib/api'
import AuthShell from '../components/AuthShell'
import StipendWallet from '../components/StipendWallet'
import Loader from '../components/Loader'
import { motion } from 'framer-motion'

const fetcher = (url: string) => api.get(url).then(r => r.data)

interface Transaction {
  id: string;
  amount: number;
  transaction_type: 'credit' | 'debit';
  transaction_subtype?: string;
  description: string;
  balance_after: number;
  created_at: string;
}

interface BalanceData {
  balance: number;
}

export default function WalletPage() {
  const { data: balanceData, error: balanceError } = useSWR<BalanceData>('/wallet/balance', fetcher)
  const { data: transactions, error: transError } = useSWR<Transaction[]>('/wallet/transactions', fetcher)
  const { data: dashboardData } = useSWR('/access/dashboard', fetcher)

  const loading = !balanceData || !transactions;
  const error = balanceError || transError;

  if (error) return (
    <AuthShell>
      <div className="p-6 text-text-secondary flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-500/10 p-6 rounded-xl border border-red-500/30 max-w-md w-full">
          <h3 className="text-xl font-bold text-white text-center">Failed to load wallet data</h3>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full px-6 py-3 bg-neon-accent text-dark-surface rounded-xl font-bold"
          >
            Try Again
          </button>
        </div>
      </div>
    </AuthShell>
  );

  if (loading) return (
    <AuthShell>
      <div className="p-6 flex flex-col items-center justify-center min-h-screen">
        <Loader size="lg" message="Synchronizing secure wallet..." />
      </div>
    </AuthShell>
  );

  const balance = balanceData.balance;
  const userStats = dashboardData?.user?.stipend || {
    weeklyEarnings: 0,
    pendingAmount: 0,
    dailyMultiplier: 1.0
  };

  return (
    <AuthShell>
      <div className="min-h-screen bg-gradient-to-br from-dark-surface to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-accent/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <header className="mb-12">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">
              Financial <span className="text-neon-accent">Command</span>
            </h1>
            <p className="text-text-secondary font-mono text-xs mt-2 uppercase tracking-widest">
              Secure Asset Management & Transaction Synchronization
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <StipendWallet
                  balance={balance}
                  weeklyEarnings={userStats.weeklyEarnings}
                  pendingAmount={userStats.pendingAmount}
                  dailyMultiplier={userStats.dailyMultiplier}
                />

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Security Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary uppercase">Biometric Link</span>
                      <span className="text-xs text-emerald-400 font-bold uppercase">Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary uppercase">Encryption</span>
                      <span className="text-xs text-emerald-400 font-bold uppercase">AES-256</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary uppercase">Last Sync</span>
                      <span className="text-xs text-slate-400 font-mono">Just now</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-dark-surface-variant/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold text-white uppercase italic">Transaction Synchronization</h2>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] text-slate-400 font-bold uppercase">All History</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {transactions.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl">
                      <p className="text-slate-600 uppercase font-bold text-xs tracking-widest">No transaction records found</p>
                    </div>
                  ) : (
                    transactions.map((t, i) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={t.id}
                        className="p-4 bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${
                            t.transaction_type === 'credit'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-red-500/10 text-red-500'
                          }`}>
                            {t.transaction_type === 'credit' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-neon-accent transition-colors">{t.description || 'System Synchronization'}</p>
                            <div className="flex gap-2 items-center mt-1">
                              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
                                {new Date(t.created_at).toLocaleDateString()} {new Date(t.created_at).toLocaleTimeString()}
                              </span>
                              {t.transaction_subtype && (
                                <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase font-black">
                                  {t.transaction_subtype}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-mono font-bold ${
                            t.transaction_type === 'credit' ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            {t.transaction_type === 'credit' ? '+' : '-'}{t.amount.toLocaleString()} WTH
                          </p>
                          <p className="text-[10px] text-slate-600 font-mono mt-1">
                            Balance: {t.balance_after.toLocaleString()}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthShell>
  )
}
