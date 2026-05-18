import useSWR from 'swr'
import api from '../lib/api'
import AuthShell from '../components/AuthShell'
import Loader from '../components/Loader'
import { motion } from 'framer-motion'

const fetcher = (url: string) => api.get(url).then(r => r.data)

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const { data, error, isLoading, mutate } = useSWR<Notification[]>('/notifications', fetcher)

  const markAllAsRead = async () => {
    // Logic to mark all as read
    mutate();
  };

  if (error) return (
    <AuthShell>
      <div className="p-6 text-text-secondary flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-500/10 p-6 rounded-xl border border-red-500/30 max-w-md w-full">
          <h3 className="text-xl font-bold text-white text-center uppercase">Sync Lost</h3>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full px-6 py-3 bg-red-600 text-white rounded-xl font-bold uppercase text-xs"
          >
            Reconnect
          </button>
        </div>
      </div>
    </AuthShell>
  );

  if (isLoading || !data) return (
    <AuthShell>
      <div className="p-6 flex flex-col items-center justify-center min-h-screen">
        <Loader size="lg" message="Synchronizing alert stream..." />
      </div>
    </AuthShell>
  );

  return (
    <AuthShell>
      <div className="min-h-screen bg-dark-surface p-8 relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-accent/5 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <header className="mb-12 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">
                Alert <span className="text-neon-accent">Stream</span>
              </h1>
              <p className="text-text-secondary font-mono text-xs mt-2 uppercase tracking-widest">
                Real-time ecosystem updates and task notifications
              </p>
            </div>
            <button
              onClick={markAllAsRead}
              className="text-[10px] font-black text-slate-500 hover:text-neon-accent uppercase tracking-widest transition-colors mb-1"
            >
              Clear Buffer
            </button>
          </header>

          <div className="space-y-4">
            {data.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
                <p className="text-slate-600 uppercase font-black text-xs tracking-[0.2em]">Stream Quiet: No Alerts</p>
              </div>
            ) : (
              data.map((n, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={n.id}
                  className={`p-6 rounded-2xl border transition-all flex items-start gap-5 ${
                    n.is_read
                      ? 'bg-slate-900/30 border-slate-800/50'
                      : 'bg-slate-900 border-slate-700 shadow-neon-sm'
                  }`}
                >
                  <div className={`mt-1 p-2 rounded-lg ${
                    n.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                    n.type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                    n.type === 'error' ? 'bg-red-500/10 text-red-500' :
                    'bg-blue-500/10 text-blue-500'
                  }`}>
                    {n.type === 'success' && <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                    {n.type === 'warning' && <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                    {n.type === 'error' && <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>}
                    {n.type === 'info' && <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-bold uppercase tracking-tight ${n.is_read ? 'text-slate-400' : 'text-white'}`}>{n.title}</h3>
                      <span className="text-[8px] font-mono text-slate-600 uppercase">{new Date(n.created_at).toLocaleString()}</span>
                    </div>
                    <p className={`text-sm leading-relaxed ${n.is_read ? 'text-slate-500' : 'text-text-secondary'}`}>{n.message}</p>
                  </div>
                  {!n.is_read && <div className="w-2 h-2 rounded-full bg-neon-accent mt-2"></div>}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </AuthShell>
  )
}
