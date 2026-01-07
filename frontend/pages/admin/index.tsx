import { useState } from 'react'
import AuthShell from '../../components/AuthShell'
import api from '../../lib/api'

export default function Admin() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  async function create() {
    try {
      await api.post('/access/internships', { title, description })
      alert('Created')
      setTitle('')
      setDescription('')
    } catch (e) {
      console.error(e)
      alert('Create failed')
    }
  }

  return (
    <AuthShell>
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-3xl mx-auto bg-white p-4 rounded shadow">
          <h1 className="text-2xl font-semibold mb-3">Admin — Create Internship</h1>
          <label className="block mb-2">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded mb-3" />
          <label className="block mb-2">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded mb-3" />
          <div>
            <button onClick={create} className="px-3 py-2 bg-green-600 text-white rounded">Create</button>
          </div>
        </div>
      </div>
    </AuthShell>
  )
}
