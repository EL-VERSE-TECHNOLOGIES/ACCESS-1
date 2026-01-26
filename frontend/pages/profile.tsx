import useSWR from 'swr'
import api from '../lib/api'
import Link from 'next/link'
import { useState } from 'react'
import AuthShell from '../components/AuthShell'
import Leaderboard from '../components/Leaderboard'
import Badges from '../components/Badges'
import ProgressRing from '../components/ProgressRing'
import StipendWallet from '../components/StipendWallet'
import TaskSubmission from '../components/TaskSubmission'

const fetcher = (url: string) => api.get(url).then(r => r.data)

interface User {
  id: string;
  name: string;
  email: string;
  tier: 'Intern' | 'Lead' | 'Management';
  avatar: string;
  stats: {
    tasksCompleted: number;
    points: number;
    streak: number;
  };
  progress: {
    level: number;
    levelProgress: number; // percentage
    totalTasks: number;
  };
  stipend: {
    balance: number;
    weeklyEarnings: number;
    pendingAmount: number;
    dailyMultiplier: number;
  };
  learningPath: Array<{
    id: number;
    title: string;
    completed: boolean;
    progress: number; // percentage
  }>;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
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

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  difficulty: 'bronze' | 'silver' | 'gold';
  stack: string[];
  status: 'OPEN' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  tasksCompleted: number;
  streak: number;
  tier: 'Intern' | 'Lead' | 'Management';
}

interface ProfileData {
  user: User;
  badges: Badge[];
  submissions: Submission[];
  tasks: Task[];
  leaderboard: LeaderboardEntry[];
}

export default function Profile() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  const { data, error } = useSWR<ProfileData>(base + '/api/access/profile', fetcher)
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'learning' | 'history'>('overview');

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-surface to-slate-900 p-6">
        <div className="bg-red-500/10 p-8 rounded-2xl border border-red-500/30 max-w-md w-full text-center transform transition-all duration-300 hover:scale-[1.02]">
          <div className="mx-auto bg-red-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Failed to Load Profile</h3>
          <p className="text-text-secondary mb-6">{error?.message || 'An unexpected error occurred'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-neon-accent to-emerald-400 text-dark-surface rounded-xl hover:from-neon-accent-hover hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-neon-accent/20"
          >
            Retry
          </button>
        </div>
      </div>
    </AuthShell>
  );

  if (!data) return (
    <AuthShell>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-surface to-slate-900 p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-accent mb-4"></div>
          <p className="text-text-secondary text-lg">Loading your profile...</p>
        </div>
      </div>
    </AuthShell>
  );

  const { user, badges, submissions, tasks, leaderboard } = data;

  return (
    <AuthShell>
      <div className="min-h-screen bg-gradient-to-br from-dark-surface to-slate-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-accent/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Header Section */}
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent mb-2">
                  Your Profile
                </h1>
                <p className="text-text-secondary">Track your progress and achievements</p>
              </div>
              <nav className="flex gap-3">
                <Link href="/dashboard" className="px-5 py-2.5 bg-gradient-to-r from-slate-800 to-slate-900 text-text-secondary rounded-xl hover:from-slate-700 hover:to-slate-800 hover:text-white transition-all duration-300 border border-slate-700 transform hover:scale-105">
                  Dashboard
                </Link>
                <Link href="/tasks" className="px-5 py-2.5 bg-gradient-to-r from-slate-800 to-slate-900 text-text-secondary rounded-xl hover:from-slate-700 hover:to-slate-800 hover:text-white transition-all duration-300 border border-slate-700 transform hover:scale-105">
                  Tasks
                </Link>
              </nav>
            </div>
          </header>

          {/* Profile Header */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-neon-accent to-emerald-400 p-1">
                  <div className="bg-dark-surface-variant rounded-full w-full h-full flex items-center justify-center text-5xl font-bold text-neon-accent">
                    {user.name.charAt(0)}
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-dark-surface flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-dark-surface" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-2">{user.name}</h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
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
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="text-2xl font-bold text-white">{user.stats.tasksCompleted}</div>
                    <div className="text-text-secondary text-sm">Tasks Done</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="text-2xl font-bold text-white">{user.stats.points}</div>
                    <div className="text-text-secondary text-sm">Points</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="text-2xl font-bold text-white">{user.stats.streak}</div>
                    <div className="text-text-secondary text-sm">Day Streak</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="text-2xl font-bold text-white">#{leaderboard.findIndex(entry => entry.name === user.name) + 1}</div>
                    <div className="text-text-secondary text-sm">Rank</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-700 mb-8">
            <button
              className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === 'overview'
                  ? 'text-neon-accent border-b-2 border-neon-accent'
                  : 'text-text-secondary hover:text-white'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === 'badges'
                  ? 'text-neon-accent border-b-2 border-neon-accent'
                  : 'text-text-secondary hover:text-white'
              }`}
              onClick={() => setActiveTab('badges')}
            >
              Achievements
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === 'learning'
                  ? 'text-neon-accent border-b-2 border-neon-accent'
                  : 'text-text-secondary hover:text-white'
              }`}
              onClick={() => setActiveTab('learning')}
            >
              Learning Path
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === 'history'
                  ? 'text-neon-accent border-b-2 border-neon-accent'
                  : 'text-text-secondary hover:text-white'
              }`}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Progress Card */}
                <div className="lg:col-span-1 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-neon-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Your Progress
                  </h3>
                  <div className="flex flex-col items-center">
                    <ProgressRing
                      percentage={user.progress.levelProgress}
                      label="Level Progress"
                      tasksCompleted={user.stats.tasksCompleted}
                      totalTasks={user.progress.totalTasks}
                    />
                    <p className="mt-4 text-center text-text-secondary text-sm">
                      {user.stats.tasksCompleted}/{user.progress.totalTasks} tasks completed<br/>
                      <span className="text-neon-accent font-medium">
                        {user.progress.totalTasks - user.stats.tasksCompleted} more to next level!
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
                          style={{ width: `${user.progress.levelProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wallet Card */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-neon-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Wallet Summary
                    </h3>
                    <StipendWallet
                      balance={user.stipend.balance}
                      weeklyEarnings={user.stipend.weeklyEarnings || 0}
                      pendingAmount={user.stipend.pendingAmount || 0}
                      dailyMultiplier={user.stipend.dailyMultiplier || 1.0}
                    />
                  </div>

                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6">Recent Submissions</h3>
                    <div className="space-y-4">
                      {submissions.slice(0, 3).map((submission, index) => (
                        <div key={index} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-white">{submission.taskTitle}</p>
                              <p className="text-sm text-text-secondary">{new Date(submission.submittedAt).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              submission.status === 'approved' ? 'bg-green-900/30 text-green-400 border border-green-700/50' :
                              submission.status === 'rejected' ? 'bg-red-900/30 text-red-400 border border-red-700/50' :
                              submission.status === 'reviewing' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/50' :
                              'bg-blue-900/30 text-blue-400 border border-blue-700/50'
                            }`}>
                              {submission.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'badges' && (
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-6">Your Achievements</h3>
                <Badges badges={badges} />
              </div>
            )}

            {activeTab === 'learning' && (
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-6">Learning Pathway</h3>
                <div className="space-y-4">
                  {user.learningPath.map((step, index) => (
                    <div key={step.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                          step.completed ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : 'bg-slate-700'
                        }`}>
                          {step.completed ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-white font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white">{step.title}</div>
                          <div className="w-full bg-slate-700 rounded-full h-2.5 mt-2">
                            <div
                              className={`h-2.5 rounded-full ${
                                step.completed ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-neon-accent to-emerald-400'
                              }`}
                              style={{ width: `${step.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        {step.completed && (
                          <span className="text-emerald-400 font-medium">Completed</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-6">Submission History</h3>
                  <div className="space-y-4">
                    {submissions.map((submission, index) => (
                      <div key={index} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-white">{submission.taskTitle}</p>
                            <p className="text-sm text-text-secondary">{new Date(submission.submittedAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            submission.status === 'approved' ? 'bg-green-900/30 text-green-400 border border-green-700/50' :
                            submission.status === 'rejected' ? 'bg-red-900/30 text-red-400 border border-red-700/50' :
                            submission.status === 'reviewing' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/50' :
                            'bg-blue-900/30 text-blue-400 border border-blue-700/50'
                          }`}>
                            {submission.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-6">Leaderboard</h3>
                  <Leaderboard entries={leaderboard} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthShell>
  )
}