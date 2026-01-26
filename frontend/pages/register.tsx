import { useForm } from 'react-hook-form'
import api from '../lib/api'
import { useRouter } from 'next/router'

type FormData = { email: string; username: string; password: string; fullName: string }

export default function Register() {
  const { register, handleSubmit } = useForm<FormData>()
  const router = useRouter()

  async function onSubmit(data: FormData) {
    try {
      await api.post('/auth/register', { ...data, app: 'EL_ACCESS' })
      alert('Registered — please login')
      router.push('/login')
    } catch (err: any) {
      console.error(err)
      alert(err?.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md p-6 bg-white rounded shadow">
        <h2 className="text-xl font-medium mb-4">Register</h2>
        <label className="block mb-2">Full name</label>
        <input {...register('fullName')} className="w-full p-2 border rounded mb-3" />
        <label className="block mb-2">Username</label>
        <input {...register('username')} className="w-full p-2 border rounded mb-3" />
        <label className="block mb-2">Email</label>
        <input {...register('email')} className="w-full p-2 border rounded mb-3" />
        <label className="block mb-2">Password</label>
        <input {...register('password')} type="password" className="w-full p-2 border rounded mb-4" />
        <button className="w-full py-2 bg-blue-600 text-white rounded">Register</button>
      </form>
    </div>
  )
}
