import useSWR from 'swr'
import api from '../../lib/api'
import Link from 'next/link'
import { useState } from 'react'
import AuthShell from '../../components/AuthShell'
import Loader from '../../components/Loader'
import { motion, AnimatePresence } from 'framer-motion'

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
  const { data, error, isLoading } = useSWR<Task[]>('/tasks', fetcher)

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedStack, setSelectedStack] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'reward' | 'createdAt' | 'difficulty'>('reward');

  if (error) return (
    <AuthShell>
      <div className="min-h-screen flex items-center justify-center bg-dark-surface p-6">
        <div className="bg-red-500/10 p-8 rounded-3xl border border-red-500/30 max-w-md w-full text-center">
          <h3 className="text-xl font-bold text-white mb-2 uppercase">Sync Error</h3>
          <p className="text-text-secondary mb-6">Failed to synchronize with the task repository.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-black text-xs uppercase tracking-widest"
          >
            Reconnect
          </button>
        </div>
      </div>
    </AuthShell>
  );

  if (isLoading || !data) return (
    <AuthShell>
      <div className="min-h-screen flex items-center justify-center bg-dark-surface p-6">
        <Loader size="lg" message="Synchronizing task database..." />
      </div>
    </AuthShell>
  );

  const tasks = data;

  // Get unique stacks for filter
  const allStacks = Array.from(new Set(tasks.flatMap(task => task.stack || [])));

  // Sort tasks based on selected criteria
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === 'reward') {
      return b.reward - a.reward;
    } else if (sortBy === 'createdAt') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'difficulty') {
      const difficultyOrder = { 'gold': 3, 'silver': 2, 'bronze': 1 };
      return (difficultyOrder[b.difficulty] || 0) - (difficultyOrder[a.difficulty] || 0);
    }
    return 0;
  });

  // Filter tasks based on selected stack and search query
  const filteredTasks = sortedTasks.filter(task => {
    const matchesStack = selectedStack === 'all' || (task.stack && task.stack.includes(selectedStack));
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

  const handleClaimTask = async (taskId: string) => {
    try {
      await api.post(`/tasks/${taskId}/claim`);
      window.location.reload();
    } catch (err) {
      console.error('Failed to claim task:', err);
      alert('Task synchronization failed. Access may be restricted.');
    }
  };

  return (
    <AuthShell>
      <div className="min-h-screen bg-dark-surface relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-accent/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <header className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div>
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">
                  Task <span className="text-neon-accent">Repository</span>
                </h1>
                <p className="text-text-secondary font-mono text-xs mt-2 uppercase tracking-widest">
                  Browse micro-gigs and contribute to the ecosystem
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="SEARCH PROTOCOLS..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 w-full md:w-64 focus:outline-none focus:border-neon-accent text-white font-mono text-xs transition-all"
                  />
                  <svg className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <select
                  value={selectedStack}
                  onChange={(e) => setSelectedStack(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-neon-accent font-mono text-[10px] uppercase tracking-widest transition-all"
                >
                  <option value="all">ALL STACKS</option>
                  {allStacks.map(stack => (
                    <option key={stack} value={stack}>{stack.toUpperCase()}</option>
                  ))}
                </select>

                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setViewMode('kanban')}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all uppercase tracking-widest ${
                      viewMode === 'kanban' ? 'bg-neon-accent text-dark-surface shadow-neon' : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    Kanban
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all uppercase tracking-widest ${
                      viewMode === 'list' ? 'bg-neon-accent text-dark-surface shadow-neon' : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {viewMode === 'kanban' ? (
              <motion.div
                key="kanban"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {(['OPEN', 'IN_PROGRESS', 'REVIEW', 'DONE'] as TaskStatus[]).map(status => (
                  <div key={status} className="bg-slate-900/30 border border-slate-800/50 rounded-3xl p-5 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-6 px-1">
                      <h3 className="font-black text-white text-[10px] uppercase tracking-[0.2em] italic flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          status === 'OPEN' ? 'bg-blue-400' :
                          status === 'IN_PROGRESS' ? 'bg-amber-400' :
                          status === 'REVIEW' ? 'bg-purple-400' : 'bg-emerald-400'
                        }`}></span>
                        {status.replace('_', ' ')}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-600">{tasksByStatus[status].length}</span>
                    </div>
                    <div className="space-y-4">
                      {tasksByStatus[status].map(task => (
                        <TaskCard key={task.id} task={task} onClaim={handleClaimTask} />
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-dark-surface-variant/40 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-800/50 bg-slate-900/50">
                        <th className="py-5 px-8">Protocol Name</th>
                        <th className="py-5 px-6">Complexity</th>
                        <th className="py-5 px-6">Tech Stack</th>
                        <th className="py-5 px-6">Sync Reward</th>
                        <th className="py-5 px-8 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTasks.map(task => (
                        <tr key={task.id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors group">
                          <td className="py-6 px-8">
                            <div className="font-bold text-white group-hover:text-neon-accent transition-colors">{task.title}</div>
                            <div className="text-xs text-text-secondary mt-1 line-clamp-1 italic">{task.description}</div>
                          </td>
                          <td className="py-6 px-6">
                            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${
                              task.difficulty === 'gold' ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10' :
                              task.difficulty === 'silver' ? 'border-slate-400/50 text-slate-400 bg-slate-400/10' :
                              'border-amber-700/50 text-amber-700 bg-amber-700/10'
                            }`}>
                              {task.difficulty}
                            </span>
                          </td>
                          <td className="py-6 px-6">
                            <div className="flex gap-1.5 flex-wrap">
                              {task.stack?.slice(0, 3).map((s, idx) => (
                                <span key={idx} className="text-[8px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                                  {s.toUpperCase()}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-6 px-6 font-mono font-black text-neon-accent">+{task.reward} WTH</td>
                          <td className="py-6 px-8 text-right">
                            <Link
                              href={`/tasks/${task.id}`}
                              className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-neon-accent hover:text-dark-surface transition-all font-black text-[10px] uppercase tracking-widest"
                            >
                              Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AuthShell>
  )
}

const TaskCard = ({ task, onClaim }: { task: Task, onClaim: (id: string) => void }) => {
  return (
    <motion.div
      layout
      className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-neon-accent transition-all group cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-bold text-white group-hover:text-neon-accent transition-colors leading-tight">{task.title}</h4>
        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${
          task.difficulty === 'gold' ? 'border-yellow-500/50 text-yellow-500' :
          task.difficulty === 'silver' ? 'border-slate-400/50 text-slate-400' :
          'border-amber-700/50 text-amber-700'
        }`}>
          {task.difficulty}
        </span>
      </div>
      <p className="text-[10px] text-text-secondary line-clamp-2 leading-relaxed mb-4 italic">
        {task.description}
      </p>
      <div className="flex flex-wrap gap-1 mb-6">
        {task.stack?.slice(0, 3).map((s, i) => (
          <span key={i} className="text-[8px] font-mono text-slate-600 bg-slate-950 px-1.5 py-0.5 rounded">
            {s.toUpperCase()}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-slate-800/50">
        <span className="font-mono font-black text-neon-accent text-sm">+{task.reward} WTH</span>
        {task.status === 'OPEN' ? (
          <button
            onClick={(e) => { e.stopPropagation(); onClaim(task.id); }}
            className="text-[10px] font-black text-white hover:text-neon-accent uppercase tracking-widest"
          >
            Claim
          </button>
        ) : (
          <Link href={`/tasks/${task.id}`} className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest">
            View
          </Link>
        )}
      </div>
    </motion.div>
  );
};
