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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md p-6 bg-white rounded shadow">
        <h2 className="text-xl font-medium mb-4">Login</h2>
        <label className="block mb-2">Email</label>
        <input {...register('email')} className="w-full p-2 border rounded mb-3" />
        <label className="block mb-2">Password</label>
        <input {...register('password')} type="password" className="w-full p-2 border rounded mb-4" />
        <button className="w-full py-2 bg-blue-600 text-white rounded">Sign in</button>
      </form>
    </div>
  )
}
