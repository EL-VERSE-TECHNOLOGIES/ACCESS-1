import { useState, useEffect } from 'react';
import api from '../lib/api';
import { getAvailableBackends, getSelectedBackend } from '../lib/backend-config';
import Loader from '../components/Loader';

export default function Health() {
  const [backendStatus, setBackendStatus] = useState<Record<string, { status: string; responseTime: number; error?: string }>>({});
  const [loading, setLoading] = useState(true);
  const [selectedBackend, setSelectedBackendState] = useState('');

  useEffect(() => {
    checkAllBackends();
  }, []);

  const checkBackend = async (backendType: string, url: string) => {
    const startTime = Date.now();
    try {
      // Temporarily change the API base URL to check this specific backend
      const originalBaseUrl = (api as any).defaults.baseURL;
      (api as any).defaults.baseURL = `${url}/api`;

      const response = await api.get('/health');
      const responseTime = Date.now() - startTime;

      // Restore original base URL
      (api as any).defaults.baseURL = originalBaseUrl;

      return {
        status: response.data?.status || 'unknown',
        responseTime,
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      // Restore original base URL
      (api as any).defaults.baseURL = `${window.location.origin}/api`;

      return {
        status: 'error',
        responseTime,
        error: error.response?.data?.message || error.message || 'Connection failed'
      };
    }
  };

  const checkAllBackends = async () => {
    setLoading(true);
    const backends = getAvailableBackends();
    const status: Record<string, { status: string; responseTime: number; error?: string }> = {};

    for (const backend of backends) {
      status[backend.type] = await checkBackend(backend.type, backend.url);
    }

    setBackendStatus(status);
    setSelectedBackendState(getSelectedBackend().type);
    setLoading(false);
  };

  const switchBackend = (type: string) => {
    localStorage.setItem('selectedBackend', type);
    window.location.reload();
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Backend Health Status</h1>
        <p className="text-gray-600 mb-8">Monitor the status of all backend implementations</p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader size="lg" message="Checking backend health..." />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Current Selection</h2>
              <div className="flex items-center gap-4">
                <span className="font-medium">Active Backend:</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {getSelectedBackend().name}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Backend Status</h2>
                <button 
                  onClick={checkAllBackends}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Refresh Status
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getAvailableBackends().map((backend) => {
                  const status = backendStatus[backend.type];
                  if (!status) return null;
                  
                  let statusColor = 'gray';
                  if (status.status === 'healthy') statusColor = 'green';
                  if (status.status === 'error') statusColor = 'red';
                  
                  return (
                    <div 
                      key={backend.type} 
                      className={`border rounded-lg p-4 ${
                        selectedBackend === backend.type 
                          ? 'border-blue-500 border-2' 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{backend.name}</h3>
                          <p className="text-sm text-gray-500">{backend.description}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusColor === 'green' ? 'bg-green-100 text-green-800' :
                          statusColor === 'red' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {status.status}
                        </span>
                      </div>
                      
                      <div className="mt-3 text-sm">
                        <p className="text-gray-600">Response Time: {status.responseTime}ms</p>
                        {status.error && (
                          <p className="text-red-600 mt-1 truncate" title={status.error}>
                            Error: {status.error}
                          </p>
                        )}
                      </div>
                      
                      <button
                        onClick={() => switchBackend(backend.type)}
                        disabled={selectedBackend === backend.type}
                        className={`mt-3 w-full py-2 text-sm rounded ${
                          selectedBackend === backend.type
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        {selectedBackend === backend.type ? 'Active' : 'Switch to this'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Health Check Details</h2>
              <div className="prose max-w-none">
                <p>
                  This page checks the health status of all available backend implementations:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Python (FastAPI)</strong>: Robust Python backend with async capabilities</li>
                  <li><strong>Go (Gin)</strong>: High-performance Go backend</li>
                  <li><strong>Node.js (NestJS)</strong>: Enterprise-grade Node.js backend</li>
                </ul>
                <p className="mt-3">
                  You can switch between backends using the "Switch to this" buttons. 
                  The active backend will be used for all API requests throughout the application.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}