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

// Check if we're using the mock API
const isMockApi = typeof (api as any).get === 'function' && !(api as any).defaults;

const fetcher = async (url: string) => {
  if (isMockApi) {
    const result = await (api as any).get(url);
    return result.data;
  } else {
    return api.get(url).then(r => r.data);
  }
};

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
  }>;
  submissions: Submission[];
  tasks: Task[];
}

export default function Dashboard() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  const { data, error } = useSWR<DashboardData>(base + '/api/access/dashboard', fetcher)

  const handleNewSubmission = async (taskId: string, code: string) => {
    try {
      if (isMockApi) {
        await (api as any).post(`/access/tasks/${taskId}/submit`, {
          code,
          taskId
        });
      } else {
        await api.post(`/access/tasks/${taskId}/submit`, {
          code,
          taskId
        });
      }

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
        <p>Failed to load dashboard</p>
        <p className="text-sm mt-2 text-red-500">{error?.message || 'Unknown error'}</p>
      </div>
    </AuthShell>
  );

  if (!data) return (
    <AuthShell>
      <div className="p-6 flex flex-col items-center justify-center min-h-screen">
        <Loader size="lg" message="Loading your dashboard..." />
      </div>
    </AuthShell>
  );

  const { user, hotTasks, recentActivity, submissions, tasks } = data;

  return (
    <AuthShell>
      <div className="min-h-screen p-6 bg-dark-surface">
        <div className="max-w-7xl mx-auto">
          <header className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-text-secondary">Welcome back, {user.name}! Ready to level up your skills?</p>
            </div>
            <nav className="flex gap-4">
              <Link href="/tasks" className="px-4 py-2 bg-slate-800 text-text-secondary rounded-lg hover:text-white transition-colors">Tasks</Link>
              <Link href="/profile" className="px-4 py-2 bg-slate-800 text-text-secondary rounded-lg hover:text-white transition-colors">Profile</Link>
              <Link href="/notifications" className="px-4 py-2 bg-slate-800 text-text-secondary rounded-lg hover:text-white transition-colors">Notifications</Link>
            </nav>
          </header>

          {/* Gamified Widgets Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Progression Ring Widget */}
            <div className="lg:col-span-1 bg-dark-surface-variant rounded-xl p-6 border border-slate-700 shadow-lg flex flex-col items-center">
              <h3 className="text-lg font-bold text-white mb-4">Progress</h3>
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

            {/* Stipend Wallet Widget */}
            <div className="lg:col-span-1">
              <StipendWallet
                balance={user.stipend.balance}
                weeklyEarnings={user.stipend.weeklyEarnings || 0}
                pendingAmount={user.stipend.pendingAmount || 0}
                dailyMultiplier={user.stipend.dailyMultiplier || 1.0}
              />
            </div>

            {/* Hot Tasks Widget */}
            <div className="lg:col-span-2">
              <HotTasks tasks={hotTasks} />
            </div>
          </div>

          {/* Task Submission and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <TaskSubmission
              submissions={submissions}
              onNewSubmission={handleNewSubmission}
              tasks={tasks}
            />

            {/* Recent Activity Section */}
            <section className="bg-dark-surface-variant rounded-xl p-6 border border-slate-700 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="p-4 bg-slate-800 rounded-lg">
                    <div className="flex items-center">
                      <div className="mr-3 p-2 bg-emerald-900/30 rounded-lg">
                        {activity.type === 'task_completed' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : activity.type === 'time_remaining' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neon-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{activity.title}</p>
                        <p className="text-sm text-text-secondary">{activity.description}</p>
                        {activity.reward && (
                          <p className="text-xs text-success">+{activity.reward} WTH</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Uno AI Floating Bubble */}
        <UnoAIBubble />
      </div>
    </AuthShell>
  )
}
