import { useState, useEffect } from 'react';
import api from '../lib/api';
import AuthShell from '../components/AuthShell';
import Loader from '../components/Loader';
import { motion, AnimatePresence } from 'framer-motion';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_review' | 'resolved' | 'closed';
  type: 'support' | 'dispute';
  created_at: string;
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: '', description: '', type: 'support' });

  const fetchTickets = async () => {
    try {
      const res = await api.get('/support/tickets');
      setTickets(res.data);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/support/tickets', newTicket);
      setShowModal(false);
      setNewTicket({ title: '', description: '', type: 'support' });
      fetchTickets();
    } catch (err) {
      alert('Failed to submit synchronization request.');
    }
  };

  return (
    <AuthShell>
      <div className="min-h-screen bg-dark-surface p-8 relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">
                Support <span className="text-neon-accent">& Disputes</span>
              </h1>
              <p className="text-text-secondary font-mono text-xs mt-2 uppercase tracking-widest">
                Ecosystem integrity & synchronization assistance
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-8 py-3 bg-neon-accent text-dark-surface font-black text-xs uppercase tracking-widest rounded-xl hover:bg-neon-accent-hover transition-all shadow-neon"
            >
              Open New Case
            </button>
          </header>

          {loading ? (
            <Loader message="Accessing support database..." />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {tickets.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
                  <p className="text-slate-600 uppercase font-black text-xs tracking-widest">No active cases found</p>
                </div>
              ) : (
                tickets.map((ticket, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={ticket.id}
                    className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-slate-700 transition-all"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                          ticket.type === 'dispute' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                        }`}>
                          {ticket.type}
                        </span>
                        <h3 className="font-bold text-white group-hover:text-neon-accent transition-colors">{ticket.title}</h3>
                      </div>
                      <p className="text-text-secondary text-sm line-clamp-1 italic">{ticket.description}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden md:block">
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Synchronized At</p>
                        <p className="text-xs text-slate-400 font-mono">{new Date(ticket.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        ticket.status === 'open' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                        ticket.status === 'in_review' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {ticket.status.replace('_', ' ')}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-dark-surface/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl"
              >
                <h2 className="text-2xl font-black text-white uppercase italic mb-6">Initialize New Case</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Subject</label>
                    <input
                      required
                      value={newTicket.title}
                      onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-neon-accent outline-none transition-all"
                      placeholder="Enter concise subject..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Case Type</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setNewTicket({ ...newTicket, type: 'support' })}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          newTicket.type === 'support' ? 'bg-blue-500/10 text-blue-400 border-blue-500/50' : 'bg-slate-950 text-slate-500 border-slate-800'
                        }`}
                      >
                        Technical Support
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewTicket({ ...newTicket, type: 'dispute' })}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          newTicket.type === 'dispute' ? 'bg-red-500/10 text-red-400 border-red-500/50' : 'bg-slate-950 text-slate-500 border-slate-800'
                        }`}
                      >
                        Payment Dispute
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Description</label>
                    <textarea
                      required
                      rows={4}
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-neon-accent outline-none transition-all resize-none"
                      placeholder="Describe the synchronization issue in detail..."
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all"
                    >
                      Abort
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-4 bg-neon-accent text-dark-surface rounded-xl text-[10px] font-black uppercase tracking-widest shadow-neon hover:bg-neon-accent-hover transition-all"
                    >
                      Synchronize Case
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AuthShell>
  );
}
