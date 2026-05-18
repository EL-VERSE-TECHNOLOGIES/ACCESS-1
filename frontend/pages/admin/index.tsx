import { useState, useEffect } from 'react'
import api from '../../lib/api'
import Layout from '../../components/Layout'
import Loader from '../../components/Loader'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import { useMe } from '../../lib/hooks'

export default function AdminDashboard() {
  const { user, loading: meLoading } = useMe()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'users' | 'cv-approval' | 'tasks' | 'finance' | 'tickets' | 'projects'>('users')
  const [users, setUsers] = useState<any[]>([])
  const [pendingCVs, setPendingCVs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const isManagementOrLead = user && (user.tier === 'Management' || user.tier === 'Lead');

  useEffect(() => {
    if (!meLoading && !isManagementOrLead) {
      router.push('/dashboard')
    } else if (isManagementOrLead) {
      fetchUsers()
      fetchPendingCVs()
    }
  }, [meLoading, isManagementOrLead])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await api.get('/community/users')
      setUsers(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingCVs = async () => {
    try {
      const res = await api.get('/admin/pending-cvs')
      setPendingCVs(res.data)
    } catch (e) {
      console.error(e)
    }
  }

  const handleCVAction = async (userId: string, status: 'approved' | 'rejected') => {
    try {
      await api.put(`/admin/approve-cv/${userId}`, { status })
      fetchPendingCVs()
      fetchUsers()
    } catch (e) {
      alert('Failed to update CV status')
    }
  }

  if (meLoading || !isManagementOrLead) {
    return (
      <div className="min-h-screen bg-dark-surface flex items-center justify-center">
        <Loader message="Verifying Administrative Clearance..." />
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
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto">
              {['users', 'cv-approval', 'tasks', 'finance', 'tickets', 'projects'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                >
                  {tab.replace('-', ' ').toUpperCase()}
                  {tab === 'cv-approval' && pendingCVs.length > 0 && (
                    <span className="ml-2 bg-white text-red-600 px-1.5 py-0.5 rounded-full text-[8px]">{pendingCVs.length}</span>
                  )}
                </button>
              ))}
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
                          <th className="pb-4">CV Status</th>
                          <th className="pb-4">Biometrics</th>
                          <th className="pb-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {users.map((u, i) => (
                          <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                            <td className="py-4 text-white font-bold">{u.name}</td>
                            <td className="py-4"><span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-[10px] font-bold uppercase">{u.tier}</span></td>
                            <td className="py-4">
                              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                u.cv_status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                                u.cv_status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {u.cv_status || 'PENDING'}
                              </span>
                            </td>
                            <td className="py-4">
                               <div className="flex gap-2">
                                 <span className={`w-2 h-2 rounded-full ${u.face_verification_status === 'verified' ? 'bg-emerald-500' : 'bg-slate-700'}`} title="Face Scan"></span>
                                 <span className={`w-2 h-2 rounded-full ${u.fingerprint_verified ? 'bg-emerald-500' : 'bg-slate-700'}`} title="Fingerprint"></span>
                               </div>
                            </td>
                            <td className="py-4 text-right">
                              <button className="text-[10px] font-black text-red-500 hover:text-red-400 transition-colors uppercase mr-4">Manage</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'cv-approval' && (
              <motion.div
                key="cv-approval"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-dark-surface-variant/40 border border-slate-800 rounded-3xl p-8"
              >
                <h2 className="text-xl font-bold text-white uppercase italic mb-8">Pending CV Approval</h2>
                {pendingCVs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-600 border-2 border-dashed border-slate-800 rounded-3xl">
                    <p className="text-xs font-bold uppercase tracking-widest">No pending CVs for review</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingCVs.map((u) => (
                      <div key={u.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                        <div>
                          <p className="text-white font-bold">{u.name}</p>
                          <p className="text-xs text-slate-500 mt-1">{u.email}</p>
                          <a href={u.cv} target="_blank" rel="noopener noreferrer" className="text-xs text-neon-accent hover:underline mt-2 inline-block">View Attached CV Document</a>
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleCVAction(u.id, 'rejected')}
                            className="px-6 py-2 bg-red-600/10 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleCVAction(u.id, 'approved')}
                            className="px-6 py-2 bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-lg shadow-emerald-600/10"
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    ))}
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
                  <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Total Payouts</p>
                    <p className="text-2xl font-black text-emerald-500 font-mono">-bash.00</p>
                  </div>
                  <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Active Escrow</p>
                    <p className="text-2xl font-black text-blue-500 font-mono">-bash.00</p>
                  </div>
                  <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl text-center">
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
                <div className="flex flex-col items-center justify-center py-20 text-slate-600 border-2 border-dashed border-slate-800 rounded-3xl text-center">
                  <p className="text-xs font-bold uppercase tracking-widest">No active tickets</p>
                </div>
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
                <button className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl mb-8 uppercase text-xs shadow-lg shadow-red-600/20">Post New Project</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  )
}
