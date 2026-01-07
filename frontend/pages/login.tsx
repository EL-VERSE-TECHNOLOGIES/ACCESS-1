import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useRouter } from 'next/router'

type FormData = { email: string; password: string }

export default function Login() {
  const { register, handleSubmit } = useForm<FormData>()
  const router = useRouter()

  async function onSubmit(data: FormData) {
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''
      const res = await axios.post(base + '/api/auth/login', data, { withCredentials: true })
      if (res.data) router.push('/dashboard')
    } catch (err) {
      console.error(err)
      alert('Login failed')
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
