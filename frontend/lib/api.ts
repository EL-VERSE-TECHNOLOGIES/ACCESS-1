import axios from 'axios'

const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''

export const api = axios.create({
  baseURL: base + '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

export default api

// Attach Authorization header from localStorage token if present
api.interceptors.request.use((config) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
  } catch (e) {
    // ignore
  }
  return config
})
