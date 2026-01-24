import React from 'react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  tasksCompleted: number;
  streak: number;
  tier: 'Intern' | 'Lead' | 'Management';
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserRank?: number;
  currentUserPoints?: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries, currentUserRank, currentUserPoints }) => {
  return (
    <div className="bg-dark-surface-variant rounded-xl p-6 border border-slate-700 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <span className="mr-2">🏆</span> Top Interns
        </h2>
        <span className="text-sm text-text-secondary">Updated daily</span>
      </div>

      <div className="space-y-4">
        {entries.map((entry, index) => (
          <div
            key={entry.rank}
            className={`flex items-center p-3 rounded-lg ${
              entry.rank <= 3
                ? 'bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700'
                : entry.rank === currentUserRank
                  ? 'bg-gradient-to-r from-slate-700/30 to-slate-800/30 border border-neon-accent'
                  : 'bg-slate-800/30'
            }`}
          >
            <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
              entry.rank === 1
                ? 'bg-yellow-500/20 text-yellow-400'
                : entry.rank === 2
                  ? 'bg-gray-400/20 text-gray-300'
                  : entry.rank === 3
                    ? 'bg-amber-700/20 text-amber-400'
                    : entry.rank === currentUserRank
                      ? 'bg-neon-accent/20 text-neon-accent'
                      : 'bg-slate-700 text-text-secondary'
            }`}>
              {entry.rank}
            </div>

            <img
              src={entry.avatar}
              alt={entry.name}
              className="w-10 h-10 rounded-full mr-3 border-2 border-slate-600"
            />

            <div className="flex-1">
              <div className="flex items-center">
                <h3 className="font-medium text-white">{entry.name}</h3>
                <span className="ml-2 text-xs px-2 py-0.5 bg-slate-700 rounded-full text-text-secondary">
                  {entry.tier}
                </span>
              </div>
              <div className="flex text-xs text-text-secondary">
                <span className="mr-3">Tasks: {entry.tasksCompleted}</span>
                <span>Streak: {entry.streak} days</span>
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold text-neon-accent">{entry.points} pts</div>
              <div className="text-xs text-text-secondary">WTH earned</div>
            </div>
          </div>
        ))}
      </div>

      {currentUserRank && currentUserPoints && (
        <div className="mt-6 pt-4 border-t border-slate-700">
          <div className="flex items-center justify-center text-text-secondary text-sm">
            <span>📊 Your rank: #{currentUserRank}</span>
            <span className="mx-2">•</span>
            <span>Points: {currentUserPoints}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;