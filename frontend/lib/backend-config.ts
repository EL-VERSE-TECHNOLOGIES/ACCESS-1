// backend-config.ts
export interface BackendConfig {
  name: string;
  url: string;
  type: 'python' | 'go' | 'nodejs';
  description: string;
}

export const BACKEND_CONFIGS: Record<string, BackendConfig> = {
  python: {
    name: 'Python (FastAPI)',
    url: process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL || 'http://localhost:8001',
    type: 'python',
    description: 'Python backend using FastAPI framework'
  },
  go: {
    name: 'Go (Gin)',
    url: process.env.NEXT_PUBLIC_GO_BACKEND_URL || 'http://localhost:8000',
    type: 'go',
    description: 'Go backend using Gin framework'
  },
  nodejs: {
    name: 'Node.js (NestJS)',
    url: process.env.NEXT_PUBLIC_NODEJS_BACKEND_URL || 'http://localhost:8002',
    type: 'nodejs',
    description: 'Node.js backend using NestJS framework'
  }
};

export const DEFAULT_BACKEND = 'go';

export function getBackendUrl(): string {
  return BACKEND_CONFIGS.go.url;
}

export function getAvailableBackends(): BackendConfig[] {
  return Object.values(BACKEND_CONFIGS);
}

export function setSelectedBackend(type: string): void {
  // Manual switching is now disabled to ensure system synchronization
  console.warn('Manual backend switching is disabled. System uses functional routing.');
}

export function getSelectedBackend(): BackendConfig {
  // Always return Go as the primary/default backend configuration
  return BACKEND_CONFIGS.go;
}

export function getBackendUrlForService(service: 'python' | 'go' | 'nodejs'): string {
  return BACKEND_CONFIGS[service]?.url || BACKEND_CONFIGS.go.url;
}
