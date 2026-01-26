import useSWR from 'swr'
import api from '../../lib/api'
import Link from 'next/link'
import { useState } from 'react'
import AuthShell from '../../components/AuthShell'

const fetcher = (url: string) => api.get(url).then(r => r.data)

// Define types
type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
type TaskDifficulty = 'bronze' | 'silver' | 'gold';

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  difficulty: TaskDifficulty;
  stack: string[];
  reward: number;
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  creator: string;
}

interface TasksData {
  tasks: Task[];
  userTier: 'Intern' | 'Lead' | 'Management';
}

export default function TaskCenter() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  const { data, error } = useSWR<TasksData>(base + '/api/access/tasks', fetcher)

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedStack, setSelectedStack] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'reward' | 'createdAt' | 'difficulty'>('reward');

  if (error) return (
    <AuthShell>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-surface to-slate-900 p-6">
        <div className="bg-red-500/10 p-8 rounded-2xl border border-red-500/30 max-w-md w-full text-center transform transition-all duration-300 hover:scale-[1.02]">
          <div className="mx-auto bg-red-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Failed to Load Tasks</h3>
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
          <p className="text-text-secondary text-lg">Loading tasks...</p>
        </div>
      </div>
    </AuthShell>
  );

  const { tasks, userTier } = data;

  // Get unique stacks for filter
  const allStacks = Array.from(new Set(tasks.flatMap(task => task.stack)));

  // Sort tasks based on selected criteria
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === 'reward') {
      return b.reward - a.reward;
    } else if (sortBy === 'createdAt') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'difficulty') {
      const difficultyOrder = { 'gold': 3, 'silver': 2, 'bronze': 1 };
      return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
    }
    return 0;
  });

  // Filter tasks based on selected stack and search query
  const filteredTasks = sortedTasks.filter(task => {
    const matchesStack = selectedStack === 'all' || task.stack.includes(selectedStack);
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStack && matchesSearch;
  });

  // Group tasks by status for Kanban view
  const tasksByStatus: Record<TaskStatus, Task[]> = {
    'OPEN': filteredTasks.filter(task => task.status === 'OPEN'),
    'IN_PROGRESS': filteredTasks.filter(task => task.status === 'IN_PROGRESS'),
    'REVIEW': filteredTasks.filter(task => task.status === 'REVIEW'),
    'DONE': filteredTasks.filter(task => task.status === 'DONE')
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'bronze':
        return 'bg-gradient-to-br from-amber-600 to-amber-700';
      case 'silver':
        return 'bg-gradient-to-br from-gray-400 to-gray-500';
      case 'gold':
        return 'bg-gradient-to-br from-yellow-500 to-yellow-600';
      default:
        return 'bg-gradient-to-br from-slate-500 to-slate-600';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'OPEN':
        return 'bg-gradient-to-br from-slate-600 to-slate-700';
      case 'IN_PROGRESS':
        return 'bg-gradient-to-br from-blue-600 to-blue-700';
      case 'REVIEW':
        return 'bg-gradient-to-br from-yellow-600 to-yellow-700';
      case 'DONE':
        return 'bg-gradient-to-br from-green-600 to-green-700';
      default:
        return 'bg-gradient-to-br from-slate-500 to-slate-600';
    }
  };

  const handleClaimTask = async (taskId: string) => {
    try {
      await api.post(`/access/tasks/${taskId}/claim`);
      // Refresh the data after claiming
      window.location.reload(); // Simple refresh for now
    } catch (err) {
      console.error('Failed to claim task:', err);
      alert('Failed to claim task. Please try again.');
    }
  };

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
                  Task Center
                </h1>
                <p className="text-text-secondary">Browse and claim micro-gigs with instant pay</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-800/70 text-white rounded-xl pl-10 pr-4 py-2.5 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-neon-accent/50 backdrop-blur-sm border border-slate-700/50"
                  />
                  <svg
                    className="w-5 h-5 text-text-secondary absolute left-3 top-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                <select
                  value={selectedStack}
                  onChange={(e) => setSelectedStack(e.target.value)}
                  className="bg-slate-800/70 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-neon-accent/50 backdrop-blur-sm border border-slate-700/50"
                >
                  <option value="all">All Stacks</option>
                  {allStacks.map(stack => (
                    <option key={stack} value={stack}>{stack}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'reward' | 'createdAt' | 'difficulty')}
                  className="bg-slate-800/70 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-neon-accent/50 backdrop-blur-sm border border-slate-700/50"
                >
                  <option value="reward">Sort by Reward</option>
                  <option value="createdAt">Sort by Newest</option>
                  <option value="difficulty">Sort by Difficulty</option>
                </select>

                <div className="flex bg-slate-800/70 rounded-xl p-1 backdrop-blur-sm border border-slate-700/50">
                  <button
                    onClick={() => setViewMode('kanban')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'kanban'
                        ? 'bg-gradient-to-r from-neon-accent to-emerald-400 text-dark-surface shadow-md shadow-neon-accent/20'
                        : 'text-text-secondary hover:text-white'
                    }`}
                  >
                    Kanban
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'list'
                        ? 'bg-gradient-to-r from-neon-accent to-emerald-400 text-dark-surface shadow-md shadow-neon-accent/20'
                        : 'text-text-secondary hover:text-white'
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-2xl border border-slate-700/50 shadow-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-text-secondary text-sm">Available</p>
                  <p className="text-2xl font-bold text-white">{tasksByStatus.OPEN.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-2xl border border-slate-700/50 shadow-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-text-secondary text-sm">In Progress</p>
                  <p className="text-2xl font-bold text-white">{tasksByStatus.IN_PROGRESS.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-2xl border border-slate-700/50 shadow-lg">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-text-secondary text-sm">In Review</p>
                  <p className="text-2xl font-bold text-white">{tasksByStatus.REVIEW.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-2xl border border-slate-700/50 shadow-lg">
              <div className="flex items-center">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-text-secondary text-sm">Completed</p>
                  <p className="text-2xl font-bold text-white">{tasksByStatus.DONE.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Task View */}
          {viewMode === 'kanban' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* OPEN Column */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-5 border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${getStatusColor('OPEN')}`}></span>
                    Available
                  </h3>
                  <span className="bg-slate-700/50 text-text-secondary text-xs px-3 py-1.5 rounded-full">
                    {tasksByStatus.OPEN.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {tasksByStatus.OPEN.map(task => (
                    <TaskCard key={task.id} task={task} onClaim={handleClaimTask} userTier={userTier} />
                  ))}
                </div>
              </div>

              {/* IN_PROGRESS Column */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-5 border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${getStatusColor('IN_PROGRESS')}`}></span>
                    In Progress
                  </h3>
                  <span className="bg-slate-700/50 text-text-secondary text-xs px-3 py-1.5 rounded-full">
                    {tasksByStatus.IN_PROGRESS.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {tasksByStatus.IN_PROGRESS.map(task => (
                    <TaskCard key={task.id} task={task} onClaim={handleClaimTask} userTier={userTier} />
                  ))}
                </div>
              </div>

              {/* REVIEW Column */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-5 border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${getStatusColor('REVIEW')}`}></span>
                    Review
                  </h3>
                  <span className="bg-slate-700/50 text-text-secondary text-xs px-3 py-1.5 rounded-full">
                    {tasksByStatus.REVIEW.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {tasksByStatus.REVIEW.map(task => (
                    <TaskCard key={task.id} task={task} onClaim={handleClaimTask} userTier={userTier} />
                  ))}
                </div>
              </div>

              {/* DONE Column */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-5 border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${getStatusColor('DONE')}`}></span>
                    Done
                  </h3>
                  <span className="bg-slate-700/50 text-text-secondary text-xs px-3 py-1.5 rounded-full">
                    {tasksByStatus.DONE.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {tasksByStatus.DONE.map(task => (
                    <TaskCard key={task.id} task={task} onClaim={handleClaimTask} userTier={userTier} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // List View
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl overflow-hidden border border-slate-700/50 backdrop-blur-sm shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/70">
                    <tr>
                      <th className="text-left py-4 px-6 text-text-secondary font-medium">Task</th>
                      <th className="text-left py-4 px-6 text-text-secondary font-medium">Difficulty</th>
                      <th className="text-left py-4 px-6 text-text-secondary font-medium">Stack</th>
                      <th className="text-left py-4 px-6 text-text-secondary font-medium">Reward</th>
                      <th className="text-left py-4 px-6 text-text-secondary font-medium">Status</th>
                      <th className="text-left py-4 px-6 text-text-secondary font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map(task => (
                      <tr key={task.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-medium text-white">{task.title}</div>
                            <div className="text-sm text-text-secondary mt-1 line-clamp-2">{task.description}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(task.difficulty)} text-white`}>
                            {task.difficulty.charAt(0).toUpperCase() + task.difficulty.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1.5">
                            {task.stack.map((tech, idx) => (
                              <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-slate-700 text-text-secondary">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-neon-accent text-lg">+{task.reward} WTH</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)} text-white`}>
                            {task.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {task.assignedTo ? (
                            <Link href={`/tasks/${task.id}`} className="px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-800 text-text-secondary rounded-lg hover:from-slate-600 hover:to-slate-700 hover:text-white transition-all duration-300 border border-slate-600 text-sm">
                              View Task
                            </Link>
                          ) : (
                            <button
                              onClick={() => handleClaimTask(task.id)}
                              className="px-4 py-2 bg-gradient-to-r from-neon-accent to-emerald-400 text-dark-surface rounded-lg hover:from-neon-accent-hover hover:to-emerald-500 transition-all duration-300 text-sm shadow-md shadow-neon-accent/20"
                            >
                              Claim Now
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthShell>
  )
}

// Task Card Component for Kanban View
const TaskCard = ({ task, onClaim, userTier }: { task: Task, onClaim: (id: string) => void, userTier: string }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'bronze':
        return 'bg-gradient-to-br from-amber-600 to-amber-700';
      case 'silver':
        return 'bg-gradient-to-br from-gray-400 to-gray-500';
      case 'gold':
        return 'bg-gradient-to-br from-yellow-500 to-yellow-600';
      default:
        return 'bg-gradient-to-br from-slate-500 to-slate-600';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl p-5 cursor-pointer hover:border-neon-accent transition-all duration-300 transform hover:scale-[1.02] shadow-lg">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-white text-lg">{task.title}</h4>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(task.difficulty)} text-white`}>
          {task.difficulty.charAt(0).toUpperCase() + task.difficulty.slice(1)}
        </span>
      </div>
      <p className="text-sm text-text-secondary mt-3 line-clamp-2">{task.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {task.stack.map((tech, idx) => (
          <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-slate-700/50 text-text-secondary border border-slate-600/50">
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-5 flex justify-between items-center">
        <span className="font-bold text-xl text-neon-accent">+{task.reward} WTH</span>
        {task.assignedTo ? (
          <span className="text-xs bg-slate-700/50 text-text-secondary px-3 py-1.5 rounded-full border border-slate-600/50">
            Claimed
          </span>
        ) : (
          <button
            onClick={() => onClaim(task.id)}
            className="px-4 py-2 bg-gradient-to-r from-neon-accent to-emerald-400 text-dark-surface rounded-lg hover:from-neon-accent-hover hover:to-emerald-500 transition-all duration-300 text-sm shadow-md shadow-neon-accent/20"
          >
            Claim Now
          </button>
        )}
      </div>
    </div>
  );
};