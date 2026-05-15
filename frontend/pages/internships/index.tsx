import useSWR from 'swr'
import api from '../../lib/api'
import Link from 'next/link'
import { useState } from 'react'
import Layout from '../../components/Layout'
import Loader from '../../components/Loader'
import { useMe } from '../../lib/hooks'

const fetcher = (url: string) => api.get(url).then(r => r.data)

interface Internship {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  payment_rate: string;
  type: string;
  duration: string;
}

export default function Internships() {
  const { data, error, isLoading } = useSWR<Internship[]>('/access/internships', fetcher)
  const { user } = useMe()
  const [applyingId, setApplyingId] = useState<string | null>(null)

  const checkEligibility = (type: string) => {
    if (type === 'standard') return { eligible: true };

    if (!user || !user.internship_started_at) {
      return { eligible: false, reason: 'You must have an active internship history to apply for this division.' };
    }

    const startedAt = new Date(user.internship_started_at);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    if (startedAt > sixMonthsAgo) {
      return { eligible: false, reason: 'Requirement: At least 6 months of internship experience within EL VERSE is required.' };
    }

    return { eligible: true };
  }

  const handleApply = async (internship: Internship) => {
    const { eligible, reason } = checkEligibility(internship.type);
    if (!eligible) {
      alert(reason);
      return;
    }

    setApplyingId(internship.id);
    try {
      const res = await api.post(`/access/internships/${internship.id}/apply`);
      alert(res.data.message);

      if (res.data.redirect_url) {
        window.location.href = res.data.redirect_url;
      }
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to submit application. Please try again.');
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen p-8 bg-dark-surface relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-10 -left-20 w-96 h-96 bg-neon-accent/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-10 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
              Ecosystem <span className="text-neon-accent italic">Roles</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Advance your career within the EL VERSE ECOSYSTEM. Join specialized arms or standard growth programs.
            </p>
          </div>

          {error ? (
            <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-center">
              Failed to load ecosystem roles. Please ensure the synchronized backend is active.
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-20">
              <Loader size="lg" message="Synchronizing ecosystem data..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data?.map((it) => {
                const { eligible, reason } = checkEligibility(it.type);
                const isSpecial = it.type === 'coders' || it.type === 'space';

                return (
                  <div key={it.id} className={`flex flex-col bg-dark-surface-variant/40 backdrop-blur-xl rounded-3xl border ${isSpecial ? 'border-neon-accent/30 shadow-neon-sm' : 'border-slate-800'} p-8 transition-all hover:scale-[1.02] duration-300`}>
                    <div className="flex justify-between items-start mb-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isSpecial ? 'bg-neon-accent/20 text-neon-accent border border-neon-accent/30' : 'bg-slate-800 text-slate-400'}`}>
                        {it.type === 'standard' ? 'Growth' : 'Specialized'}
                      </span>
                      <span className="text-emerald-400 font-mono font-bold">{it.payment_rate}</span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-neon-accent">{it.title}</h3>
                    <p className="text-text-secondary text-sm mb-6 leading-relaxed flex-grow">{it.description}</p>

                    <div className="mb-8">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Tech Stack & Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {it.tech_stack.slice(0, 6).map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-slate-900/80 rounded-md text-[10px] text-slate-300 border border-slate-800">
                            {skill}
                          </span>
                        ))}
                        {it.tech_stack.length > 6 && (
                          <span className="px-2 py-1 bg-slate-900/80 rounded-md text-[10px] text-slate-500 border border-slate-800 italic">
                            +{it.tech_stack.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto space-y-4">
                      {isSpecial && !eligible && (
                        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          <p className="text-[10px] text-amber-500/80 leading-tight">{reason}</p>
                        </div>
                      )}

                      <button
                        onClick={() => handleApply(it)}
                        disabled={applyingId === it.id || (isSpecial && !eligible)}
                        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                          isSpecial
                            ? 'bg-neon-accent text-dark-surface shadow-neon hover:bg-neon-accent-hover active:scale-95'
                            : 'bg-slate-800 text-white hover:bg-slate-700'
                        } disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100`}
                      >
                        {applyingId === it.id ? 'Synchronizing...' : isSpecial ? 'Launch Application' : 'Join Internship'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
