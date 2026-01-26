import useSWR from 'swr'
import api from '../lib/api'
import Link from 'next/link'
import AuthShell from '../components/AuthShell'
import ProgressRing from '../components/ProgressRing'
import StipendWallet from '../components/StipendWallet'
import HotTasks from '../components/HotTasks'
import UnoAIBubble from '../components/UnoAIBubble'
import TaskSubmission from '../components/TaskSubmission'
import Loader from '../components/Loader'

const fetcher = (url: string) => api.get(url).then(r => r.data)

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  difficulty: 'bronze' | 'silver' | 'gold';
  stack: string[];
  status: 'OPEN' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
}

interface Submission {
  id: string;
  taskId: string;
  taskTitle: string;
  submittedAt: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  score?: number;
  feedback?: string;
}

interface DashboardData {
  user: {
    id: string;
    name: string;
    tier: 'Intern' | 'Lead' | 'Management';
    progress: {
      tasksCompleted: number;
      totalTasks: number;
    };
    stipend: {
      balance: number;
      weeklyEarnings: number;
      pendingAmount: number;
      dailyMultiplier: number;
    };
  };
  hotTasks: Task[];
  recentActivity: Array<{
    type: string;
    title: string;
    description: string;
    reward?: number;
    timestamp: string;
    read?: boolean;
  }>;
  submissions: Submission[];
  tasks: Task[];
}

export default function Dashboard() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  const { data, error } = useSWR<DashboardData>(base + '/api/access/dashboard', fetcher)

  const handleNewSubmission = async (taskId: string, code: string) => {
    try {
      await api.post(`/access/tasks/${taskId}/submit`, {
        code,
        taskId
      });

      // Refresh the data after submission
      window.location.reload(); // Simple refresh for now
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Submission failed. Please try again.');
    }
  };

  if (error) return (
    <AuthShell>
      <div className="p-6 text-text-secondary flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-500/10 p-6 rounded-xl border border-red-500/30 max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto bg-red-500/20 p-3 rounded-full w-12 h-12 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mt-4">Oops! Something went wrong</h3>
            <p className="text-text-secondary mt-2">{error?.message || 'Unknown error occurred'}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-neon-accent text-dark-surface rounded-lg hover:bg-neon-accent-hover transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </AuthShell>
  );

  if (!data) return (
    <AuthShell>
      <div className="p-6 flex flex-col items-center justify-center min-h-screen">
        <Loader size="lg" message="Loading your personalized dashboard..." />
      </div>
    </AuthShell>
  );

  const { user, hotTasks, recentActivity, submissions, tasks } = data;

  return (
    <AuthShell>
      <div className="min-h-screen bg-gradient-to-br from-dark-surface to-slate-900">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-accent/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent">
                  Welcome Back, {user.name.split(' ')[0]} 👋
                </h1>
                <div className="flex items-center mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-800 text-text-secondary">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      user.tier === 'Management' ? 'bg-green-500' :
                      user.tier === 'Lead' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></span>
                    {user.tier} Level
                  </span>
                  <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-900/30 text-purple-300 border border-purple-700/50">
                    Active Today
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/tasks" className="px-4 py-2 bg-slate-800 text-text-secondary rounded-lg hover:bg-slate-700 hover:text-white transition-colors border border-slate-700">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Tasks
                  </div>
                </Link>
                <Link href="/profile" className="px-4 py-2 bg-slate-800 text-text-secondary rounded-lg hover:bg-slate-700 hover:text-white transition-colors border border-slate-700">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </div>
                </Link>
                <Link href="/notifications" className="px-4 py-2 bg-slate-800 text-text-secondary rounded-lg hover:bg-slate-700 hover:text-white transition-colors border border-slate-700 relative">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Notifications
                  </div>
                  {recentActivity.filter(a => !a.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-xs text-white items-center justify-center">
                        {recentActivity.filter(a => !a.read).length}
                      </span>
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </header>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-text-secondary">Tasks Completed</h3>
                  <p className="text-2xl font-bold text-white">{user.progress.tasksCompleted}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-text-secondary">Wallet Balance</h3>
                  <p className="text-2xl font-bold text-white">${(user.stipend.balance / 100).toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-text-secondary">Weekly Earnings</h3>
                  <p className="text-2xl font-bold text-white">${(user.stipend.weeklyEarnings / 100).toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-text-secondary">Daily Multiplier</h3>
                  <p className="text-2xl font-bold text-white">x{user.stipend.dailyMultiplier.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Progress and Wallet */}
            <div className="lg:col-span-1 space-y-8">
              {/* Progress Card */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-6">Your Progress</h2>
                <div className="flex flex-col items-center">
                  <ProgressRing
                    percentage={user.progress.tasksCompleted / user.progress.totalTasks * 100}
                    label="Tasks Completed"
                    tasksCompleted={user.progress.tasksCompleted}
                    totalTasks={user.progress.totalTasks}
                  />
                  <p className="mt-4 text-center text-text-secondary text-sm">
                    {user.progress.tasksCompleted}/{user.progress.totalTasks} tasks completed<br/>
                    <span className="text-neon-accent">
                      {user.progress.totalTasks - user.progress.tasksCompleted} more to next level!
                    </span>
                  </p>
                </div>
              </div>

              {/* Wallet Card */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-6">Wallet Summary</h2>
                <StipendWallet
                  balance={user.stipend.balance}
                  weeklyEarnings={user.stipend.weeklyEarnings || 0}
                  pendingAmount={user.stipend.pendingAmount || 0}
                  dailyMultiplier={user.stipend.dailyMultiplier || 1.0}
                />
              </div>
            </div>

            {/* Right Column - Tasks and Activity */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hot Tasks */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Hot Tasks</h2>
                  <Link href="/tasks" className="text-sm text-neon-accent hover:underline">View All</Link>
                </div>
                <HotTasks tasks={hotTasks} />
              </div>

              {/* Recent Activity */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivity.slice(0, 5).map((activity, index) => (
                    <div key={index} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors">
                      <div className="flex items-start">
                        <div className="mr-4 mt-1">
                          <div className={`p-2 rounded-lg ${
                            activity.type === 'task_completed' ? 'bg-emerald-900/30 text-success' :
                            activity.type === 'time_remaining' ? 'bg-blue-900/30 text-neon-accent' :
                            'bg-amber-900/30 text-warning'
                          }`}>
                            {activity.type === 'task_completed' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : activity.type === 'time_remaining' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white">{activity.title}</p>
                          <p className="text-sm text-text-secondary mt-1">{activity.description}</p>
                          {activity.reward && (
                            <p className="text-xs text-success mt-2">+{activity.reward} WTH</p>
                          )}
                        </div>
                        <div className="text-xs text-text-secondary">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Uno AI Floating Bubble */}
        <UnoAIBubble />
      </div>
    </AuthShell>
  )
}
