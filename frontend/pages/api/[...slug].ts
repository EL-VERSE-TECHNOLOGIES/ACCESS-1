// pages/api/[...slug].ts
import { NextApiRequest, NextApiResponse } from 'next';

// Mock data for API responses
const mockData: Record<string, any> = {
  '/health': { status: 'healthy', service: 'mock-api', timestamp: new Date().toISOString() },
  '/auth/me': { 
    id: 'user-123', 
    name: 'Demo User', 
    email: 'demo@example.com', 
    tier: 'Intern',
    progress: { tasksCompleted: 5, totalTasks: 20 },
    stipend: { balance: 500, weeklyEarnings: 100, pendingAmount: 25, dailyMultiplier: 1.0 }
  },
  '/access/dashboard': {
    user: { 
      id: 'user-123', 
      name: 'Demo User', 
      tier: 'Intern',
      progress: { tasksCompleted: 5, totalTasks: 20 },
      stipend: { balance: 500, weeklyEarnings: 100, pendingAmount: 25, dailyMultiplier: 1.0 }
    },
    hotTasks: [
      {
        id: 'task-1',
        title: 'Fix API endpoint',
        description: 'Fix the broken API endpoint',
        reward: 50,
        difficulty: 'silver',
        stack: ['TypeScript', 'Node.js'],
        status: 'OPEN'
      }
    ],
    recentActivity: [
      {
        type: 'task_completed',
        title: 'Completed API fix',
        description: 'Successfully fixed the API endpoint',
        reward: 50,
        timestamp: new Date().toISOString()
      }
    ],
    submissions: [],
    tasks: []
  },
  '/access/tasks': [
    {
      id: 'task-1',
      title: 'Fix API endpoint',
      description: 'Fix the broken API endpoint',
      reward: 50,
      difficulty: 'silver',
      stack: ['TypeScript', 'Node.js'],
      status: 'OPEN'
    }
  ],
  '/wallet/balance': { balance: 500 },
  '/notifications': []
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Extract the API path from the URL
  const { slug } = req.query;
  const path = `/${Array.isArray(slug) ? slug.join('/') : slug || ''}`;
  
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      // Return mock data for the requested path or a generic response
      const data = mockData[path] || { 
        message: `Mock GET response for ${path}`, 
        timestamp: new Date().toISOString(),
        success: true 
      };
      res.status(200).json(data);
      break;
      
    case 'POST':
      // Handle POST requests with mock responses
      if (path.includes('/auth/login')) {
        res.status(200).json({ 
          accessToken: 'mock-jwt-token-for-vercel',
          token_type: 'bearer'
        });
      } else if (path.includes('/auth/register')) {
        res.status(200).json({ 
          message: 'Registration successful',
          user: { id: 'user-456', name: req.body?.name, email: req.body?.email }
        });
      } else {
        res.status(200).json({ 
          message: `Mock POST response for ${path}`, 
          data: req.body,
          success: true 
        });
      }
      break;
      
    case 'PUT':
      res.status(200).json({ 
        message: `Mock PUT response for ${path}`, 
        data: req.body,
        success: true 
      });
      break;
      
    case 'DELETE':
      res.status(200).json({ 
        message: `Mock DELETE response for ${path}`, 
        success: true 
      });
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}