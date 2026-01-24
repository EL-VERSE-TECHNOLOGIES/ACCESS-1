import useSWR from 'swr'
import axios from 'axios'
import Link from 'next/link'
import AuthShell from '../components/AuthShell'
import Leaderboard from '../components/Leaderboard'
import Badges from '../components/Badges'
import ProgressRing from '../components/ProgressRing'
import StipendWallet from '../components/StipendWallet'
import TaskSubmission from '../components/TaskSubmission'

const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then(r => r.data)

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

  const handleNewSubmission = async (taskId: string, code: string) => {
    try {
      await axios.post(`${base}/api/access/tasks/${taskId}/submit`, {
        code,
        taskId
      }, { withCredentials: true });

      // Refresh the data after submission
      window.location.reload(); // Simple refresh for now
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Submission failed. Please try again.');
    }
  };

  if (error) return <div className="p-6 text-text-secondary">Failed to load profile</div>;
  if (!data) return <div className="p-6 text-text-secondary">Loading...</div>;

  const { user, badges, submissions, tasks, leaderboard } = data;

  return (
    <AuthShell>
      <div className="min-h-screen p-6 bg-dark-surface">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Profile</h1>
                <p className="text-text-secondary">Track your progress and achievements</p>
              </div>
              <nav className="flex gap-4">
                <Link href="/dashboard" className="px-4 py-2 bg-slate-800 text-text-secondary rounded-lg hover:text-white transition-colors">Dashboard</Link>
                <Link href="/tasks" className="px-4 py-2 bg-slate-800 text-text-secondary rounded-lg hover:text-white transition-colors">Tasks</Link>
              </nav>
            </div>
          </header>

          {/* Profile Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* User Info */}
            <div className="lg:col-span-1 bg-dark-surface-variant rounded-xl p-6 border border-slate-700 shadow-lg">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-accent to-emerald-400 p-1 mb-4">
                  <div className="bg-dark-surface-variant rounded-full w-full h-full flex items-center justify-center text-4xl">
                    {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" /> : '👤'}
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                <p className="text-text-secondary mb-4">Tier: {user.tier}</p>

                <div className="flex justify-center space-x-6 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{user.stats.tasksCompleted}</div>
                    <div className="text-xs text-text-secondary">Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{user.stats.points}</div>
                    <div className="text-xs text-text-secondary">Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{user.stats.streak}</div>
                    <div className="text-xs text-text-secondary">Day Streak</div>
                  </div>
                </div>

                <div className="w-full">
                  <ProgressRing
                    percentage={user.progress.levelProgress}
                    label="Level Progress"
                    tasksCompleted={user.stats.tasksCompleted}
                    totalTasks={user.progress.totalTasks}
                  />
                </div>
              </div>
            </div>

            {/* Wallet and Stats */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <StipendWallet
                balance={user.stipend.balance}
                weeklyEarnings={user.stipend.weeklyEarnings || 0}
                pendingAmount={user.stipend.pendingAmount || 0}
                dailyMultiplier={user.stipend.dailyMultiplier || 1.0}
              />

              <div className="bg-dark-surface-variant rounded-xl p-6 border border-slate-700 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-4">Learning Pathway</h3>
                <div className="space-y-3">
                  {user.learningPath.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${step.completed ? 'bg-success' : 'bg-slate-700'}`}>
                        {step.completed ? '✓' : index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white">{step.title}</div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-neon-accent h-2 rounded-full"
                            style={{width: `${step.progress}%`}}
                          ></div>
                        </div>
                      </div>
                      {step.completed && (
                        <span className="text-success">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Task Submission and Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TaskSubmission
              submissions={submissions}
              onNewSubmission={handleNewSubmission}
              tasks={tasks}
            />
            <Leaderboard entries={leaderboard} />
          </div>
        </div>
      </div>
    </AuthShell>
  )
}