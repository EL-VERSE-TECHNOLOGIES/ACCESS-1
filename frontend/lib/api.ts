import axios from 'axios'

const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''

export const api = axios.create({
  baseURL: base + '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

export default api
