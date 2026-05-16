import { useState, useEffect } from 'react'
import api from '../../lib/api'
import Layout from '../../components/Layout'
import Loader from '../../components/Loader'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'users' | 'tasks' | 'finance' | 'tickets' | 'projects'>('users')
  const [users, setUsers] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'Access12345@') {
      setIsAuthenticated(true)
      setError('')
      fetchUsers()
    } else {
      setError('Invalid Administrative Credentials')
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      // Functional routing: Go backend handles user management
      const res = await api.get('/users/profile') // Placeholder for list-all if endpoint exists, otherwise use mock
      setUsers([res.data]) // Demo: showing current user as a list item
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-surface flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-dark-surface-variant p-10 rounded-3xl border border-slate-800 shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-red-500/10 rounded-2xl mb-4 border border-red-500/20 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Admin Terminal</h1>
            <p className="text-text-secondary text-sm mt-2 font-mono">Restricted access ecosystem arm</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ENTER ADMIN PIN"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 text-center text-white font-mono tracking-[0.5em] focus:outline-none focus:border-red-500 transition-all"
              />
            </div>
            {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}
            <button className="w-full py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 uppercase tracking-widest text-xs">
              Authorize Access
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-dark-surface p-8">
        <div className="max-w-7xl mx-auto">
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Ecosystem Command</h1>
              <p className="text-text-secondary font-mono text-xs">Management & Oversight Portal v2.0</p>
            </div>
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'users' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                USERS
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'tasks' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                SUBMISSIONS
              </button>
              <button
                onClick={() => setActiveTab('finance')}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'finance' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                FINANCE
              </button>
              <button
                onClick={() => setActiveTab('tickets')}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'tickets' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                TICKETS
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'projects' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                PROJECTS
              </button>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-dark-surface-variant/40 border border-slate-800 rounded-3xl p-8"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold text-white uppercase italic">Internship Tenure Management</h2>
                  <button onClick={fetchUsers} className="text-xs text-red-500 font-bold hover:underline">REFRESH DATA</button>
                </div>

                {loading ? <Loader /> : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-800">
                          <th className="pb-4">Name</th>
                          <th className="pb-4">Tier</th>
                          <th className="pb-4">Started At</th>
                          <th className="pb-4">Status</th>
                          <th className="pb-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {users.map((u, i) => (
                          <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                            <td className="py-4 text-white font-bold">{u.name}</td>
                            <td className="py-4"><span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-[10px] font-bold uppercase">{u.tier}</span></td>
                            <td className="py-4 text-slate-400 font-mono text-xs">{u.internship_started_at || 'NOT STARTED'}</td>
                            <td className="py-4">
                               <span className={`w-2 h-2 inline-block rounded-full mr-2 ${u.is_active ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                               <span className="text-xs text-slate-300 uppercase font-medium">{u.is_active ? 'Active' : 'Suspended'}</span>
                            </td>
                            <td className="py-4 text-right">
                              <button className="text-[10px] font-black text-red-500 hover:text-red-400 transition-colors uppercase mr-4">Manage Tenure</button>
                              <button className="text-[10px] font-black text-white/50 hover:text-white transition-colors uppercase">Edit</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'tasks' && (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-dark-surface-variant/40 border border-slate-800 rounded-3xl p-8"
              >
                <h2 className="text-xl font-bold text-white uppercase italic mb-8">Task Submission Review</h2>
                <div className="flex flex-col items-center justify-center py-20 text-slate-600 border-2 border-dashed border-slate-800 rounded-3xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-xs font-bold uppercase tracking-widest">No pending submissions for review</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'finance' && (
              <motion.div
                key="finance"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-dark-surface-variant/40 border border-slate-800 rounded-3xl p-8"
              >
                <h2 className="text-xl font-bold text-white uppercase italic mb-8">Ecosystem Transaction Logs</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Total Payouts</p>
                    <p className="text-2xl font-black text-emerald-500 font-mono">$0.00</p>
                  </div>
                  <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Active Escrow</p>
                    <p className="text-2xl font-black text-blue-500 font-mono">$0.00</p>
                  </div>
                  <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">System Transactions</p>
                    <p className="text-2xl font-black text-white font-mono">0</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'tickets' && (
              <motion.div
                key="tickets"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-dark-surface-variant/40 border border-slate-800 rounded-3xl p-8"
              >
                <h2 className="text-xl font-bold text-white uppercase italic mb-8">Support & Dispute Management</h2>
                <p className="text-slate-400">Review and resolve ecosystem tickets.</p>
              </motion.div>
            )}

            {activeTab === 'projects' && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-dark-surface-variant/40 border border-slate-800 rounded-3xl p-8"
              >
                <h2 className="text-xl font-bold text-white uppercase italic mb-8">Active Project Deployment</h2>
                <button className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl mb-8 uppercase text-xs">Post New Project</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  )
}
