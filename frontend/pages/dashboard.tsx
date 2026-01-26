import useSWR from 'swr'
import api from '../lib/api'
import Link from 'next/link'
import { useState, useEffect } from 'react'
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
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'activity'>('overview');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Show confetti when tasks are completed
    if (data && data.user.progress.tasksCompleted > 0 && data.user.progress.tasksCompleted % 5 === 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [data]);

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
        <div className="bg-red-500/10 p-6 rounded-xl border border-red-500/30 max-w-md w-full transform transition-all duration-300 hover:scale-[1.02]">
          <div className="text-center">
            <div className="mx-auto bg-red-500/20 p-3 rounded-full w-16 h-16 flex items-center justify-center animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mt-4">Oops! Something went wrong</h3>
            <p className="text-text-secondary mt-2">{error?.message || 'Unknown error occurred'}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-neon-accent to-emerald-400 text-dark-surface rounded-xl hover:from-neon-accent-hover hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-neon-accent/20"
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
      <div className="min-h-screen bg-gradient-to-br from-dark-surface to-slate-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-accent/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Confetti effect for achievements */}
        {showConfetti && (
          <div className="fixed inset-0 z-50 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10"></div>
            {[...Array(150)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${-10 + Math.random() * 20}%`,
                  backgroundColor: ['#00ffc2', '#ff6b6b', '#4dabf7', '#ffd43b'][Math.floor(Math.random() * 4)],
                  animationDelay: `${i * 0.05}s`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  opacity: 0.7
                }}
              />
            ))}
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Header Section */}
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-accent to-emerald-400 p-1">
                      <div className="bg-dark-surface-variant rounded-full w-full h-full flex items-center justify-center text-xl font-bold text-neon-accent">
                        {user.name.charAt(0)}
                      </div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-dark-surface"></div>
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent">
                      Welcome Back, {user.name.split(' ')[0]} 👋
                    </h1>
                    <p className="text-text-secondary mt-1">Ready to level up your skills?</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-slate-800 to-slate-900 text-text-secondary border border-slate-700">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      user.tier === 'Management' ? 'bg-green-500' :
                      user.tier === 'Lead' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></span>
                    {user.tier} Level
                  </span>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-900/30 to-purple-800/30 text-purple-300 border border-purple-700/50">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                    Active Today
                  </span>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 text-emerald-300 border border-emerald-700/50">
                    🔥 Streak: {Math.floor(user.progress.tasksCompleted / 3)} days
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/tasks" className="px-5 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-text-secondary rounded-xl hover:from-slate-700 hover:to-slate-800 hover:text-white transition-all duration-300 border border-slate-700 transform hover:scale-105">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Tasks
                  </div>
                </Link>
                <Link href="/profile" className="px-5 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-text-secondary rounded-xl hover:from-slate-700 hover:to-slate-800 hover:text-white transition-all duration-300 border border-slate-700 transform hover:scale-105">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </div>
                </Link>
                <Link href="/notifications" className="px-5 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-text-secondary rounded-xl hover:from-slate-700 hover:to-slate-800 hover:text-white transition-all duration-300 border border-slate-700 relative transform hover:scale-105">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Notifications
                  </div>
                  {recentActivity.filter(a => !a.read).length > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-gradient-to-r from-red-500 to-red-600 text-xs text-white items-center justify-center">
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
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-text-secondary">Tasks Completed</h3>
                  <p className="text-3xl font-bold text-white">{user.progress.tasksCompleted}</p>
                  <div className="mt-1 w-full bg-slate-700 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-400 h-1.5 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${(user.progress.tasksCompleted / Math.max(user.progress.totalTasks, 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-text-secondary">Wallet Balance</h3>
                  <p className="text-3xl font-bold text-white">${(user.stipend.balance / 100).toFixed(2)}</p>
                  <div className="mt-1 text-xs text-green-400 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    +{(user.stipend.weeklyEarnings / 100).toFixed(2)}/week
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-text-secondary">Weekly Earnings</h3>
                  <p className="text-3xl font-bold text-white">${(user.stipend.weeklyEarnings / 100).toFixed(2)}</p>
                  <div className="mt-1 text-xs text-purple-400">This week</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-text-secondary">Daily Multiplier</h3>
                  <p className="text-3xl font-bold text-white">x{user.stipend.dailyMultiplier.toFixed(2)}</p>
                  <div className="mt-1 text-xs text-yellow-400">Active boost</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-700 mb-8">
            <button
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === 'overview'
                  ? 'text-neon-accent border-b-2 border-neon-accent'
                  : 'text-text-secondary hover:text-white'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === 'tasks'
                  ? 'text-neon-accent border-b-2 border-neon-accent'
                  : 'text-text-secondary hover:text-white'
              }`}
              onClick={() => setActiveTab('tasks')}
            >
              My Tasks
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === 'activity'
                  ? 'text-neon-accent border-b-2 border-neon-accent'
                  : 'text-text-secondary hover:text-white'
              }`}
              onClick={() => setActiveTab('activity')}
            >
              Activity
            </button>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Progress and Wallet */}
            <div className="lg:col-span-1 space-y-8">
              {/* Progress Card */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-neon-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Your Progress
                </h2>
                <div className="flex flex-col items-center">
                  <ProgressRing
                    percentage={user.progress.tasksCompleted / user.progress.totalTasks * 100}
                    label="Tasks Completed"
                    tasksCompleted={user.progress.tasksCompleted}
                    totalTasks={user.progress.totalTasks}
                  />
                  <p className="mt-4 text-center text-text-secondary text-sm">
                    {user.progress.tasksCompleted}/{user.progress.totalTasks} tasks completed<br/>
                    <span className="text-neon-accent font-medium">
                      {user.progress.totalTasks - user.progress.tasksCompleted} more to next level!
                    </span>
                  </p>

                  <div className="mt-6 w-full">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-secondary">Skill Level</span>
                      <span className="text-white">{user.tier}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-neon-accent to-emerald-400 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(user.progress.tasksCompleted / Math.max(user.progress.totalTasks, 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wallet Card */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-neon-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Wallet Summary
                </h2>
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
              {/* Conditional rendering based on active tab */}
              {activeTab === 'overview' && (
                <>
                  {/* Hot Tasks */}
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-white flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-neon-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Hot Tasks
                      </h2>
                      <Link href="/tasks" className="text-sm text-neon-accent hover:underline flex items-center">
                        View All
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                    <HotTasks tasks={hotTasks} />
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-neon-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Recent Activity
                    </h2>
                    <div className="space-y-4">
                      {recentActivity.slice(0, 5).map((activity, index) => (
                        <div key={index} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all duration-300 transform hover:scale-[1.02]">
                          <div className="flex items-start">
                            <div className="mr-4 mt-1">
                              <div className={`p-2 rounded-lg ${
                                activity.type === 'task_completed' ? 'bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 text-success' :
                                activity.type === 'time_remaining' ? 'bg-gradient-to-br from-blue-900/30 to-blue-800/30 text-neon-accent' :
                                'bg-gradient-to-br from-amber-900/30 to-amber-800/30 text-warning'
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
                                <p className="text-xs text-success mt-2 flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  +{activity.reward} WTH
                                </p>
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
                </>
              )}

              {activeTab === 'tasks' && (
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl">
                  <h2 className="text-xl font-bold text-white mb-6">Your Tasks</h2>
                  <TaskSubmission
                    submissions={submissions}
                    onNewSubmission={handleNewSubmission}
                    tasks={tasks}
                  />
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl">
                  <h2 className="text-xl font-bold text-white mb-6">All Activity</h2>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all duration-300">
                        <div className="flex items-start">
                          <div className="mr-4 mt-1">
                            <div className={`p-2 rounded-lg ${
                              activity.type === 'task_completed' ? 'bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 text-success' :
                              activity.type === 'time_remaining' ? 'bg-gradient-to-br from-blue-900/30 to-blue-800/30 text-neon-accent' :
                              'bg-gradient-to-br from-amber-900/30 to-amber-800/30 text-warning'
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
              )}
            </div>
          </div>
        </div>

        {/* Uno AI Floating Bubble */}
        <UnoAIBubble />

        {/* Global Styles for Animations */}
        <style jsx global>{`
          @keyframes confetti {
            0% { transform: translateY(0) rotate(0); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
          .animate-confetti {
            animation: confetti 5s linear forwards;
          }
        `}</style>
      </div>
    </AuthShell>
  )
}
