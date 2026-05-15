import Head from 'next/head';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAvailableBackends, getSelectedBackend } from '../lib/backend-config';
import Loader from '../components/Loader';
import Layout from '../components/Layout';

export default function Health() {
  const [backendStatus, setBackendStatus] = useState<Record<string, { status: string; responseTime: number; error?: string }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAllBackends();
  }, []);

  const checkBackend = async (backendType: string, url: string) => {
    const startTime = Date.now();
    try {
      // Use a fresh axios instance to bypass any interceptors for health check
      const response = await axios.get(`${url}/api/health`, { timeout: 5000 });
      const responseTime = Date.now() - startTime;

      return {
        status: response.data?.status || 'unknown',
        responseTime,
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
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
    setLoading(false);
  };

  return (
    <Layout>
      <div className="min-h-screen p-6 bg-dark-surface">
        <Head>
          <title>System Health | EL ACCESS</title>
        </Head>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">System Health Status</h1>
          <p className="text-text-secondary mb-8">Monitoring all ecosystem backend services</p>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader size="lg" message="Checking system health..." />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-dark-surface-variant/40 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">Service Matrix</h2>
                  <button
                    onClick={checkAllBackends}
                    className="px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors border border-slate-700"
                  >
                    Refresh Matrix
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
                        className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 transition-all"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-white">{backend.name}</h3>
                            <p className="text-xs text-text-secondary">{backend.type === 'go' ? 'Core Services' : backend.type === 'nodejs' ? 'Social & Notify' : 'Analytics'}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            statusColor === 'green' ? 'bg-emerald-500/20 text-emerald-400' :
                            statusColor === 'red' ? 'bg-red-500/20 text-red-400' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {status.status}
                          </span>
                        </div>

                        <div className="mt-3 text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Latency:</span>
                            <span className="text-white font-mono">{status.responseTime}ms</span>
                          </div>
                          {status.error && (
                            <p className="text-red-400 mt-2 text-[10px] line-clamp-1" title={status.error}>
                              {status.error}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-dark-surface-variant/40 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-4">Architecture Sync</h2>
                <div className="prose prose-invert max-w-none text-sm text-text-secondary">
                  <p>
                    EL ACCESS uses a synchronized multi-backend architecture where each language handles specific domains:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                      <p className="font-bold text-neon-accent mb-1">Go (Gin)</p>
                      <p className="text-xs">Handles Auth, User Profiles, Tasks, and Wallet transactions. High-performance core.</p>
                    </div>
                    <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                      <p className="font-bold text-blue-400 mb-1">Node.js (NestJS)</p>
                      <p className="text-xs">Handles Notifications, Peer Help, and real-time Chat systems.</p>
                    </div>
                    <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                      <p className="font-bold text-purple-400 mb-1">Python (FastAPI)</p>
                      <p className="text-xs">Handles complex Data Processing, Analytics, and Prediction engines.</p>
                    </div>
                  </div>
                  <p className="mt-4">
                    All services are synchronized via shared JWT authentication and a unified database schema.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
