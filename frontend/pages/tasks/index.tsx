import useSWR from 'swr'
import axios from 'axios'
import Link from 'next/link'
import { useState } from 'react'
import AuthShell from '../../components/AuthShell'

const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then(r => r.data)

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

  if (error) return <div className="p-6 text-text-secondary">Failed to load tasks</div>;
  if (!data) return <div className="p-6 text-text-secondary">Loading...</div>;

  const { tasks, userTier } = data;

  // Get unique stacks for filter
  const allStacks = Array.from(new Set(tasks.flatMap(task => task.stack)));

  // Filter tasks based on selected stack and search query
  const filteredTasks = tasks.filter(task => {
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
        return 'bg-amber-600';
      case 'silver':
        return 'bg-gray-400';
      case 'gold':
        return 'bg-yellow-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'OPEN':
        return 'bg-slate-600';
      case 'IN_PROGRESS':
        return 'bg-blue-600';
      case 'REVIEW':
        return 'bg-yellow-600';
      case 'DONE':
        return 'bg-green-600';
      default:
        return 'bg-slate-500';
    }
  };

  const handleClaimTask = async (taskId: string) => {
    try {
      await axios.post(`${base}/api/access/tasks/${taskId}/claim`, {}, { withCredentials: true });
      // Refresh the data after claiming
      window.location.reload(); // Simple refresh for now
    } catch (err) {
      console.error('Failed to claim task:', err);
      alert('Failed to claim task. Please try again.');
    }
  };

  return (
    <AuthShell>
      <div className="min-h-screen p-6 bg-dark-surface">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Task Center</h1>
                <p className="text-text-secondary">Browse and claim micro-gigs with instant pay</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-800 text-white rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-neon-accent"
                  />
                  <svg
                    className="w-5 h-5 text-text-secondary absolute left-3 top-2.5"
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
                  className="bg-slate-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-neon-accent"
                >
                  <option value="all">All Stacks</option>
                  {allStacks.map(stack => (
                    <option key={stack} value={stack}>{stack}</option>
                  ))}
                </select>

                <div className="flex bg-slate-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('kanban')}
                    className={`px-3 py-1 rounded-md text-sm ${
                      viewMode === 'kanban'
                        ? 'bg-neon-accent text-dark-surface'
                        : 'text-text-secondary hover:text-white'
                    }`}
                  >
                    Kanban
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 rounded-md text-sm ${
                      viewMode === 'list'
                        ? 'bg-neon-accent text-dark-surface'
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
            <div className="bg-slate-800 p-4 rounded-xl">
              <p className="text-text-secondary text-sm">Available</p>
              <p className="text-2xl font-bold text-white">{tasksByStatus.OPEN.length}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl">
              <p className="text-text-secondary text-sm">In Progress</p>
              <p className="text-2xl font-bold text-white">{tasksByStatus.IN_PROGRESS.length}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl">
              <p className="text-text-secondary text-sm">In Review</p>
              <p className="text-2xl font-bold text-white">{tasksByStatus.REVIEW.length}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl">
              <p className="text-text-secondary text-sm">Completed</p>
              <p className="text-2xl font-bold text-white">{tasksByStatus.DONE.length}</p>
            </div>
          </div>

          {/* Task View */}
          {viewMode === 'kanban' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* OPEN Column */}
              <div className="bg-slate-800/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${getStatusColor('OPEN')}`}></span>
                    Available
                  </h3>
                  <span className="bg-slate-700 text-text-secondary text-xs px-2 py-1 rounded-full">
                    {tasksByStatus.OPEN.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {tasksByStatus.OPEN.map(task => (
                    <TaskCard key={task.id} task={task} onClaim={handleClaimTask} userTier={userTier} />
                  ))}
                </div>
              </div>

              {/* IN_PROGRESS Column */}
              <div className="bg-slate-800/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${getStatusColor('IN_PROGRESS')}`}></span>
                    In Progress
                  </h3>
                  <span className="bg-slate-700 text-text-secondary text-xs px-2 py-1 rounded-full">
                    {tasksByStatus.IN_PROGRESS.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {tasksByStatus.IN_PROGRESS.map(task => (
                    <TaskCard key={task.id} task={task} onClaim={handleClaimTask} userTier={userTier} />
                  ))}
                </div>
              </div>

              {/* REVIEW Column */}
              <div className="bg-slate-800/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${getStatusColor('REVIEW')}`}></span>
                    Review
                  </h3>
                  <span className="bg-slate-700 text-text-secondary text-xs px-2 py-1 rounded-full">
                    {tasksByStatus.REVIEW.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {tasksByStatus.REVIEW.map(task => (
                    <TaskCard key={task.id} task={task} onClaim={handleClaimTask} userTier={userTier} />
                  ))}
                </div>
              </div>

              {/* DONE Column */}
              <div className="bg-slate-800/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${getStatusColor('DONE')}`}></span>
                    Done
                  </h3>
                  <span className="bg-slate-700 text-text-secondary text-xs px-2 py-1 rounded-full">
                    {tasksByStatus.DONE.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {tasksByStatus.DONE.map(task => (
                    <TaskCard key={task.id} task={task} onClaim={handleClaimTask} userTier={userTier} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // List View
            <div className="bg-slate-800/50 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="text-left py-3 px-4 text-text-secondary font-normal">Task</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-normal">Difficulty</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-normal">Stack</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-normal">Reward</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-normal">Status</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-normal">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map(task => (
                    <tr key={task.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-white">{task.title}</div>
                          <div className="text-sm text-text-secondary truncate max-w-xs">{task.description}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(task.difficulty)}`}>
                          {task.difficulty.charAt(0).toUpperCase() + task.difficulty.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {task.stack.map((tech, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-700 text-text-secondary">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-neon-accent">+{task.reward} WTH</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {task.assignedTo ? (
                          <Link href={`/tasks/${task.id}`} className="btn-neon text-sm">
                            View Task
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleClaimTask(task.id)}
                            className="btn-neon-primary text-sm"
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
        return 'bg-amber-600';
      case 'silver':
        return 'bg-gray-400';
      case 'gold':
        return 'bg-yellow-500';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <div className="bg-dark-surface-variant border border-slate-700 rounded-lg p-4 cursor-pointer hover:border-neon-accent transition-colors">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-white">{task.title}</h4>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(task.difficulty)}`}>
          {task.difficulty}
        </span>
      </div>
      <p className="text-sm text-text-secondary mt-2 line-clamp-2">{task.description}</p>

      <div className="mt-3 flex flex-wrap gap-1">
        {task.stack.map((tech, idx) => (
          <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-700 text-text-secondary">
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-3 flex justify-between items-center">
        <span className="font-bold text-neon-accent">+{task.reward} WTH</span>
        {task.assignedTo ? (
          <span className="text-xs bg-slate-700 text-text-secondary px-2 py-1 rounded">
            Assigned to: {task.assignedTo}
          </span>
        ) : (
          <button
            onClick={() => onClaim(task.id)}
            className="btn-neon-primary text-xs px-2 py-1"
          >
            Claim
          </button>
        )}
      </div>
    </div>
  );
};