import axios from 'axios'
import { getBackendUrl } from './backend-config'

export const api = axios.create({
  baseURL: getBackendUrl() + '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

export default api

// Combined interceptor for both token and backend URL
api.interceptors.request.use(
  (config) => {
    try {
      // Update the base URL based on selected backend
      config.baseURL = getBackendUrl() + '/api'

      // Attach Authorization header from localStorage token if present
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken')
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`
        }
      }
    } catch (e) {
      // ignore
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
