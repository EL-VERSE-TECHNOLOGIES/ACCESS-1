import { useForm } from 'react-hook-form'
import api from '../lib/api'
import { useRouter } from 'next/router'

type FormData = { email: string; password: string }

export default function Login() {
  const { register, handleSubmit } = useForm<FormData>()
  const router = useRouter()

  async function onSubmit(data: FormData) {
    try {
      const res = await api.post('/auth/login', data)
      const payload = res.data || {}
      const token = payload.accessToken || payload.token || payload.access_token || null
      if (token && typeof window !== 'undefined') {
        localStorage.setItem('accessToken', token)
      }
      router.push('/dashboard')
    } catch (err: any) {
      console.error(err)
      alert(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-surface relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-neon-accent/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-10">
          <div className="inline-block p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-neon mb-6">
            <Image
              src="/images/new_logo.jpg"
              alt="Logo"
              width={64}
              height={64}
              className="rounded-xl"
            />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-text-secondary mt-2">Enter your credentials to access EL ACCESS</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-dark-surface-variant/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
              <input
                {...register('email')}
                type="email"
                placeholder="name@example.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-accent/50 focus:border-neon-accent transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-text-secondary">Password</label>
                <a href="#" className="text-xs text-neon-accent hover:underline">Forgot password?</a>
              </div>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-accent/50 focus:border-neon-accent transition-all"
              />
            </div>

            <button className="w-full py-4 bg-neon-accent text-dark-surface font-bold rounded-xl hover:bg-neon-accent-hover transform active:scale-[0.98] transition-all shadow-neon mt-4">
              Sign In
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-text-secondary text-sm">
              Don't have an account? {' '}
              <Link href="/register" className="text-neon-accent font-semibold hover:underline">Create Account</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

import Image from 'next/image'
import Link from 'next/link'
