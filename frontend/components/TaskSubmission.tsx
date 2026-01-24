import React, { useState } from 'react';
import { motion } from 'framer-motion';

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

interface TaskSubmissionProps {
  submissions: Submission[];
  onNewSubmission: (taskId: string, code: string) => Promise<void>;
  tasks: Task[];
}

const TaskSubmission: React.FC<TaskSubmissionProps> = ({ submissions, onNewSubmission, tasks }) => {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !code.trim()) return;

    setIsSubmitting(true);
    try {
      await onNewSubmission(selectedTask, code);
      setCode('');
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-success';
      case 'rejected': return 'text-error';
      case 'reviewing': return 'text-warning';
      default: return 'text-text-secondary';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-slate-600';
      case 'reviewing': return 'bg-yellow-600';
      case 'approved': return 'bg-success';
      case 'rejected': return 'bg-error';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="bg-dark-surface-variant rounded-xl p-6 border border-slate-700 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center">
        <span className="mr-2">📤</span> Task Submissions
      </h2>

      <div className="flex border-b border-slate-700 mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'new'
              ? 'text-neon-accent border-b-2 border-neon-accent'
              : 'text-text-secondary hover:text-white'
          }`}
          onClick={() => setActiveTab('new')}
        >
          Submit New
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'history'
              ? 'text-neon-accent border-b-2 border-neon-accent'
              : 'text-text-secondary hover:text-white'
          }`}
          onClick={() => setActiveTab('history')}
        >
          Submission History
        </button>
      </div>

      {activeTab === 'new' ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-text-secondary mb-2">Select Task</label>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="w-full bg-slate-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-neon-accent"
              required
            >
              <option value="">Choose a task to submit</option>
              {tasks
                .filter(task => task.status !== 'DONE') // Only show non-completed tasks
                .map(task => (
                <option key={task.id} value={task.id}>
                  {task.title} (+{task.reward} WTH)
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-text-secondary mb-2">Solution Code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={8}
              className="w-full bg-slate-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-neon-accent font-mono text-sm"
              placeholder="// Enter your solution code here..."
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              {code.length} characters
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !selectedTask || !code.trim()}
              className="btn-neon-primary px-6 py-2.5"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Solution'}
            </button>
          </div>
        </form>
      ) : (
        <div>
          {submissions.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              <div className="text-5xl mb-4">📭</div>
              <p>No submissions yet</p>
              <p className="text-sm mt-2">Submit your first task to see it here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map(submission => (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-white">{submission.taskTitle}</h3>
                      <p className="text-sm text-text-secondary">ID: {submission.id.substring(0, 8)}...</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(submission.status)}`}>
                      {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                    </span>
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-sm text-text-secondary">
                      Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                    </span>

                    {submission.score && (
                      <span className="font-bold text-neon-accent">
                        Score: {submission.score}/100
                      </span>
                    )}
                  </div>

                  {submission.feedback && (
                    <div className="mt-3 p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-sm text-text-secondary">
                        <span className="font-medium">Feedback:</span> {submission.feedback}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskSubmission;