import { useState, useEffect } from 'react';
import api from '../lib/api';
import AuthShell from '../components/AuthShell';

interface User {
  id: string;
  name: string;
  stacks: string[];
  skills: string[];
}

export default function CommunityPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCommunity() {
      try {
        const res = await api.get('/community/users');
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch community:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCommunity();
  }, []);

  const groupByStack = () => {
    const groups: Record<string, User[]> = {};
    users.forEach(user => {
      const stacks = user.stacks || ['Other'];
      stacks.forEach(stack => {
        if (!groups[stack]) groups[stack] = [];
        groups[stack].push(user);
      });
    });
    return groups;
  };

  const stackGroups = groupByStack();

  return (
    <AuthShell>
      <div className="min-h-screen bg-dark-surface p-8">
        <h1 className="text-3xl font-bold text-white mb-8 border-b border-slate-800 pb-4">
          Meet Your Fellow <span className="text-neon-accent">EL ACCESS</span> Interns
        </h1>

        {loading ? (
          <div className="text-white">Loading community...</div>
        ) : (
          <div className="space-y-12">
            {Object.keys(stackGroups).map(stack => (
              <div key={stack}>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-neon-accent rounded-full"></span>
                  {stack}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stackGroups[stack].map(user => (
                    <div key={user.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-neon-accent transition-all">
                      <h3 className="text-lg font-bold text-white mb-2">{user.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {user.skills?.map(skill => (
                          <span key={skill} className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] uppercase font-bold rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthShell>
  );
}
