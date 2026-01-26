// backend-config.ts
export interface BackendConfig {
  name: string;
  url: string;
  type: 'python' | 'go' | 'nodejs';
  description: string;
}

// Check if we're in a Vercel deployment environment
const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');

export const BACKEND_CONFIGS: Record<string, BackendConfig> = {
  python: {
    name: 'Python (FastAPI)',
    url: isVercel
      ? '/api' // Use local API route in Vercel
      : (process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL || 'http://localhost:8000'),
    type: 'python',
    description: 'Python backend using FastAPI framework'
  },
  go: {
    name: 'Go (Gin)',
    url: isVercel
      ? '/api' // Use local API route in Vercel
      : (process.env.NEXT_PUBLIC_GO_BACKEND_URL || 'http://localhost:8000'),
    type: 'go',
    description: 'Go backend using Gin framework'
  },
  nodejs: {
    name: 'Node.js (NestJS)',
    url: isVercel
      ? '/api' // Use local API route in Vercel
      : (process.env.NEXT_PUBLIC_NODEJS_BACKEND_URL || 'http://localhost:8001'),
    type: 'nodejs',
    description: 'Node.js backend using NestJS framework'
  }
};

export const DEFAULT_BACKEND = process.env.NEXT_PUBLIC_DEFAULT_BACKEND || 'python';

export function getBackendUrl(): string {
  if (typeof window !== 'undefined') {
    const backendType = localStorage.getItem('selectedBackend') || DEFAULT_BACKEND;
    return BACKEND_CONFIGS[backendType]?.url || BACKEND_CONFIGS.python.url;
  }
  // Default to python backend when server-side rendering
  return BACKEND_CONFIGS.python.url;
}

export function getAvailableBackends(): BackendConfig[] {
  return Object.values(BACKEND_CONFIGS);
}

export function setSelectedBackend(type: string): void {
  if (typeof window !== 'undefined' && BACKEND_CONFIGS[type]) {
    localStorage.setItem('selectedBackend', type);
  }
}

export function getSelectedBackend(): BackendConfig {
  if (typeof window !== 'undefined') {
    const selectedType = localStorage.getItem('selectedBackend') || DEFAULT_BACKEND;
    return BACKEND_CONFIGS[selectedType] || BACKEND_CONFIGS.python;
  }
  // Default to python backend when server-side rendering
  return BACKEND_CONFIGS.python;
}