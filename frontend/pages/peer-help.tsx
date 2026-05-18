import { useState, useEffect } from 'react';
import api from '../lib/api';
import AuthShell from '../components/AuthShell';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';
import { useMe } from '../lib/hooks';

interface HelpRequest {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  user?: { name: string };
}

export default function PeerHelpPage() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useMe();

  const fetchRequests = async () => {
    try {
      const res = await api.get('/peer-help/requests');
      setRequests(res.data);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <AuthShell>
      <div className="min-h-screen bg-dark-surface p-8 relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">
                Peer <span className="text-neon-accent">Help</span> Hub
              </h1>
              <p className="text-text-secondary font-mono text-xs mt-2 uppercase tracking-widest">
                Collective Intelligence & Collaborative Synchronization
              </p>
            </div>
            <button className="px-8 py-3 bg-slate-900 border border-slate-700 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:border-neon-accent hover:text-neon-accent transition-all">
              Broadcast Request
            </button>
          </header>

          {loading ? (
            <Loader message="Synchronizing help network..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {requests.length === 0 ? (
                <div className="col-span-full text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
                  <p className="text-slate-600 uppercase font-black text-xs tracking-widest">Help Network Idle: No Active Requests</p>
                </div>
              ) : (
                requests.map((request, i) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    key={request.id}
                    className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl group hover:border-neon-accent/50 transition-all"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-neon-accent font-bold border border-slate-700">
                          {request.user?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="text-xs font-black text-white uppercase">{request.user?.name || 'Anonymous'}</p>
                          <p className="text-[8px] text-slate-500 font-mono uppercase">{new Date(request.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                        request.status === 'open' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-neon-accent transition-colors">{request.title}</h3>
                    <p className="text-text-secondary text-sm mb-8 leading-relaxed line-clamp-2 italic">{request.description}</p>
                    <div className="flex gap-3">
                      <button className="flex-1 py-3 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all">
                        Sync Details
                      </button>
                      <button className="flex-1 py-3 bg-neon-accent text-dark-surface rounded-xl text-[10px] font-black uppercase tracking-widest shadow-neon hover:bg-neon-accent-hover transition-all">
                        Initiate Chat
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </AuthShell>
  );
}
