import Link from 'next/link'

import Image from 'next/image'
import Head from 'next/head'

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-surface flex flex-col items-center justify-center relative overflow-hidden">
      <Head>
        <title>EL ACCESS | EL VERSE ECOSYSTEM</title>
      </Head>

      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-accent/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full px-6 text-center">
        <div className="mb-10 inline-block p-4 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl shadow-neon animate-scale-in">
          <Image
            src="/images/new_logo.jpg"
            alt="EL ACCESS Logo"
            width={120}
            height={120}
            className="rounded-2xl shadow-2xl"
          />
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-tight animate-fade-in">
          EL <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-accent to-blue-400">ACCESS</span>
        </h1>

        <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in delay-200">
          Empowering the next generation of builders. Join the EL VERSE Ecosystem through specialized internships and growth opportunities.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in delay-300">
          <Link
            href="/login"
            className="group relative px-10 py-5 w-full sm:w-auto bg-neon-accent text-dark-surface font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-neon"
          >
            Launch Portal
            <span className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </Link>

          <Link
            href="/internships"
            className="px-10 py-5 w-full sm:w-auto bg-slate-900 text-white font-bold text-lg rounded-2xl border border-slate-800 transition-all duration-300 hover:bg-slate-800 hover:border-neon-accent"
          >
            View Opportunities
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-slate-800/50 pt-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="flex flex-col items-center">
            <span className="text-xs uppercase font-bold tracking-widest text-neon-accent mb-2">Development</span>
            <p className="text-white font-medium">EL CODERS</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs uppercase font-bold tracking-widest text-blue-400 mb-2">Freelance</span>
            <p className="text-white font-medium">EL SPACE</p>
          </div>
          <div className="hidden md:flex flex-col items-center">
            <span className="text-xs uppercase font-bold tracking-widest text-purple-400 mb-2">Network</span>
            <p className="text-white font-medium">EL VERSE</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 text-slate-600 text-sm font-medium flex gap-4 items-center">
        <span>© 2024 EL VERSE TECHNOLOGIES. All Rights Reserved.</span>
        <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
        <Link href="/admin" className="hover:text-neon-accent transition-colors">Admin Access</Link>
      </div>
    </div>
  )
}
