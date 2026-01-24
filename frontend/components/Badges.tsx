import React from 'react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  category: string; // e.g., 'task_completion', 'streak', 'skill', 'milestone'
}

interface BadgesProps {
  badges: Badge[];
}

const Badges: React.FC<BadgesProps> = ({ badges }) => {
  // Group badges by category
  const categories = [...new Set(badges.map(badge => badge.category))];
  const groupedBadges = categories.reduce((acc, category) => {
    acc[category] = badges.filter(badge => badge.category === category);
    return acc;
  }, {} as Record<string, Badge[]>);

  return (
    <div className="bg-dark-surface-variant rounded-xl p-6 border border-slate-700 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center">
        <span className="mr-2">🎖️</span> Achievements
      </h2>

      <div className="space-y-6">
        {categories.map(category => (
          <div key={category}>
            <h3 className="font-bold text-neon-accent mb-3 capitalize">{category.replace('_', ' ')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {groupedBadges[category].map(badge => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-lg text-center ${
                    badge.earned
                      ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700'
                      : 'bg-slate-800/30 border border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    <div className={`text-3xl ${badge.earned ? '' : 'grayscale'}`}>
                      {badge.icon.startsWith('/') ? (
                        <img src={badge.icon} alt={badge.name} className="w-8 h-8" />
                      ) : (
                        badge.icon
                      )}
                    </div>
                  </div>
                  <h3 className={`font-medium ${badge.earned ? 'text-white' : 'text-text-secondary'}`}>
                    {badge.name}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">{badge.description}</p>
                  {badge.earned && badge.earnedDate && (
                    <p className="text-xs text-success mt-2">Earned {badge.earnedDate}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Total badges earned:</span>
          <span className="font-bold text-neon-accent">
            {badges.filter(b => b.earned).length}/{badges.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Badges;