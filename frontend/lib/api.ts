// lib/api.ts
import axios, { AxiosRequestConfig } from 'axios'
import { getBackendUrl, getBackendUrlForService } from './backend-config'

// Create the API instance with the default backend configuration
export const api = axios.create({
  baseURL: getBackendUrl() + '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

export default api

// Determine which backend to use based on the service
function getBaseURLForEndpoint(url: string): string {
  if (url.includes('/notifications')) {
    return getBackendUrlForService('nodejs') + '/api';
  } else if (url.includes('/peer-help/chat') || url.includes('/peer-help/requests')) {
    return getBackendUrlForService('nodejs') + '/api';
  } else if (url.includes('/process-data') || url.includes('/analyze') || url.includes('/predict')) {
    return getBackendUrlForService('python') + '/api';
  } else {
    // Default to the Go backend for core services (Auth, User, Tasks, Wallet)
    return getBackendUrlForService('go') + '/api';
  }
}

// Request interceptor to route requests to appropriate backend
api.interceptors.request.use(
  (config) => {
    try {
      // Update the base URL based on the service needed
      if (config.url) {
        config.baseURL = getBaseURLForEndpoint(config.url);
      }

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