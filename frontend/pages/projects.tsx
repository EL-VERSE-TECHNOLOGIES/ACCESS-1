import { useState, useEffect } from 'react';
import api from '../lib/api';
import AuthShell from '../components/AuthShell';

interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  budget: string;
  status: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await api.get('/projects/active');
        setProjects(res.data);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <AuthShell>
      <div className="min-h-screen bg-dark-surface p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Active Projects</h1>
        <p className="text-text-secondary mb-8">Exclusive ecosystem projects posted by Admin</p>

        {loading ? (
          <div className="text-white">Loading projects...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {projects.length === 0 ? (
              <div className="p-12 bg-slate-900 border border-slate-800 rounded-3xl text-center">
                <p className="text-text-secondary">No active projects available at the moment.</p>
              </div>
            ) : (
              projects.map(project => (
                <div key={project.id} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 hover:border-neon-accent transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-white group-hover:text-neon-accent transition-colors">{project.title}</h2>
                    <span className="px-4 py-1 bg-neon-accent/10 text-neon-accent text-xs font-bold uppercase rounded-full border border-neon-accent/20">
                      {project.status}
                    </span>
                  </div>
                  <p className="text-text-secondary mb-6 leading-relaxed max-w-3xl">{project.description}</p>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {project.stack?.map(tech => (
                      <span key={tech} className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg border border-slate-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                    <span className="text-white font-bold">Budget: <span className="text-neon-accent">{project.budget}</span></span>
                    <button className="px-6 py-2 bg-neon-accent text-dark-surface font-black rounded-xl hover:bg-neon-accent-hover transition-all uppercase text-xs">
                      Express Interest
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </AuthShell>
  );
}
