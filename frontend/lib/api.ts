import axios from 'axios'
import { getBackendUrl } from './backend-config'
import { mockApi } from './mock-api'

// Check if we're in a Vercel deployment environment
const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');

export const api = isVercel
  ? {
      // Mock API implementation for Vercel deployment
      get: async (url: string) => mockApi.get(url),
      post: async (url: string, data?: any) => mockApi.post(url, data),
      put: async (url: string, data?: any) => mockApi.put(url, data),
      delete: async (url: string) => mockApi.delete(url),
    }
  : axios.create({
      baseURL: getBackendUrl() + '/api',
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    });

// For non-Vercel deployments, add the interceptors
if (!isVercel) {
  // Combined interceptor for both token and backend URL
  (api as any).interceptors.request.use(
    (config: any) => {
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
    (error: any) => {
      return Promise.reject(error)
    }
  );
}

export default api
