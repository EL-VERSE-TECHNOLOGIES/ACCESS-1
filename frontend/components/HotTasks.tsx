import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  difficulty: 'bronze' | 'silver' | 'gold';
  stack: string[];
  status: 'OPEN' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  assignedTo?: string;
}

interface HotTasksProps {
  tasks: Task[];
}

const HotTasks: React.FC<HotTasksProps> = ({ tasks }) => {
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

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'bronze':
        return 'Beginner';
      case 'silver':
        return 'Intermediate';
      case 'gold':
        return 'Advanced';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-dark-surface-variant rounded-xl p-6 border border-slate-700 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">🔥 Hot Tasks</h3>
        <span className="text-xs text-text-secondary bg-slate-800 px-2 py-1 rounded">
          {tasks.length} available
        </span>
      </div>

      <div className="space-y-4">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-slate-700 rounded-lg p-4 hover:border-neon-accent transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-white">{task.title}</h4>
                <p className="text-sm text-text-secondary mt-1 line-clamp-2">{task.description}</p>

                <div className="flex items-center mt-3 space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(task.difficulty)}`}>
                    {getDifficultyLabel(task.difficulty)}
                  </span>

                  {task.stack.map((tech, i) => (
                    <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-800 text-text-secondary">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold text-neon-accent">+{task.reward} WTH</div>
                {task.assignedTo ? (
                  <Link href={`/tasks/${task.id}`} className="mt-2 btn-neon text-sm px-3 py-1 inline-block">
                    View Task
                  </Link>
                ) : (
                  <Link href={`/tasks/${task.id}`} className="mt-2 btn-neon-primary text-sm px-3 py-1 inline-block">
                    Claim Now
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Link href="/tasks" className="w-full mt-4 py-2 text-center text-text-secondary hover:text-white border border-slate-700 rounded-lg hover:border-neon-accent transition-colors block">
        View All Tasks →
      </Link>
    </div>
  );
};

export default HotTasks;