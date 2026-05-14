import useSWR from 'swr'
import axios from 'axios'
import Link from 'next/link'

const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then(r => r.data)

export default function Internships() {
  const { data, error } = useSWR('/access/internships', fetcher)

  const ecosystems = [
    {
      id: 'coders',
      name: 'EL CODERS BY EL VERSE ECOSYSTEM',
      arm: 'Development Arm',
      description: 'Join our specialized development team and work on cutting-edge blockchain, AI, and web technologies.',
      color: 'from-blue-600 to-cyan-500',
      icon: 'code'
    },
    {
      id: 'space',
      name: 'EL SPACE BY EL VERSE ECOSYSTEM',
      arm: 'Freelance Arm',
      description: 'A flexible, decentralized marketplace for top-tier freelancers to collaborate on innovative projects.',
      color: 'from-purple-600 to-pink-500',
      icon: 'space'
    }
  ];

  return (
    <div className="min-h-screen p-8 bg-dark-surface">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
            Opportunities at <span className="text-neon-accent">EL VERSE</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Select an ecosystem arm to start your journey and apply for specialized roles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {ecosystems.map((eco) => (
            <div key={eco.id} className="relative group overflow-hidden rounded-2xl bg-dark-surface-variant border border-slate-800 p-8 hover:border-neon-accent transition-all duration-500 hover:shadow-neon-lg">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${eco.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`}></div>

              <div className="flex flex-col h-full relative z-10">
                <div className="mb-6">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-800 text-neon-accent border border-neon-accent/30">
                    {eco.arm}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-neon-accent transition-colors">
                  {eco.name}
                </h2>

                <p className="text-text-secondary mb-8 flex-grow">
                  {eco.description}
                </p>

                <button className="w-full py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl font-bold border border-slate-700 hover:border-neon-accent group-hover:from-neon-accent group-hover:to-emerald-400 group-hover:text-dark-surface transition-all duration-300">
                  Explore Roles
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-10">
          <h2 className="text-2xl font-bold text-white mb-8">Active Internships</h2>
          {error ? (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
              Failed to load internships. Please try again later.
            </div>
          ) : !data ? (
            <div className="grid gap-6 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-slate-800/50 rounded-xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6">
              {data.map((it: any) => (
                <div key={it.id} className="p-6 bg-dark-surface-variant rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-neon-accent">{it.title}</h3>
                      <p className="text-text-secondary mt-2 line-clamp-2">{it.description}</p>
                    </div>
                    <Link
                      href={`/internships/${it.id}`}
                      className="px-4 py-2 bg-slate-800 text-neon-accent rounded-lg text-sm font-semibold hover:bg-neon-accent hover:text-dark-surface transition-all"
                    >
                      Apply Now
                    </Link>
                  </div>
                  <div className="mt-4 flex gap-4">
                    <span className="text-xs text-text-secondary flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {it.duration || '3 Months'}
                    </span>
                    <span className="text-xs text-text-secondary flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.908 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Remote
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
