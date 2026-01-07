import { useState, useEffect } from 'react'
import { useMe } from '../lib/hooks'
import api from '../lib/api'
import AuthShell from '../components/AuthShell'

export default function ProfilePage() {
  const { user, loading } = useMe()
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '')
      setUsername(user.username || '')
    }
  }, [user])

  async function save() {
    try {
      await api.put('/auth/me', { fullName, username })
      alert('Profile updated')
    } catch (e) {
      console.error(e)
      alert('Update failed')
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <AuthShell>
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-semibold mb-4">Profile</h1>
          <label className="block mb-2">Full name</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-2 border rounded mb-3" />
          <label className="block mb-2">Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 border rounded mb-3" />
          <div className="flex gap-2">
            <button onClick={save} className="px-3 py-2 bg-blue-600 text-white rounded">Save</button>
          </div>
        </div>
      </div>
    </AuthShell>
  )
}
