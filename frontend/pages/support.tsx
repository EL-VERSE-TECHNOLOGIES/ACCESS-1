import { useState, useEffect } from 'react';
import api from '../lib/api';
import AuthShell from '../components/AuthShell';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  type: string;
  createdAt: string;
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('support');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {
      const res = await api.get('/support/tickets');
      setTickets(res.data);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/support/tickets', { title, description, type });
      setTitle('');
      setDescription('');
      fetchTickets();
      alert('Ticket submitted successfully');
    } catch (err) {
      alert('Failed to submit ticket');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell>
      <div className="min-h-screen bg-dark-surface p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Support & Dispute Center</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-widest text-xs">New Ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Subject</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-neon-accent outline-none"
                  placeholder="Summarize your issue"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-neon-accent outline-none"
                >
                  <option value="support">General Support</option>
                  <option value="dispute">Payment Dispute</option>
                  <option value="bug">Technical Bug</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-neon-accent outline-none min-h-[150px]"
                  placeholder="Provide details..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-neon-accent text-dark-surface font-black rounded-xl hover:bg-neon-accent-hover transition-all uppercase text-sm"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-widest text-xs">Your History</h2>
            <div className="space-y-4">
              {tickets.length === 0 ? (
                <p className="text-text-secondary italic">No previous tickets.</p>
              ) : (
                tickets.map(ticket => (
                  <div key={ticket.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white">{ticket.title}</h3>
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                        ticket.status === 'open' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mb-4 line-clamp-2">{ticket.description}</p>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 uppercase">
                      <span>Type: {ticket.type}</span>
                      <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthShell>
  );
}
