// lib/mock-api.ts
export const mockApi = {
  async get(url: string) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
    
    // Mock responses based on URL
    const mockResponses: Record<string, any> = {
      '/auth/me': {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        tier: 'Intern',
        progress: {
          tasksCompleted: 12,
          totalTasks: 50
        },
        stipend: {
          balance: 1250,
          weeklyEarnings: 250,
          pendingAmount: 50,
          dailyMultiplier: 1.2
        }
      },
      '/access/dashboard': {
        user: {
          id: 'user-123',
          name: 'John Doe',
          tier: 'Intern',
          progress: {
            tasksCompleted: 12,
            totalTasks: 50
          },
          stipend: {
            balance: 1250,
            weeklyEarnings: 250,
            pendingAmount: 50,
            dailyMultiplier: 1.2
          }
        },
        hotTasks: [
          {
            id: 'task-1',
            title: 'Fix API endpoint bug',
            description: 'Resolve the issue with the user authentication endpoint',
            reward: 50,
            difficulty: 'silver',
            stack: ['TypeScript', 'Node.js'],
            status: 'OPEN'
          },
          {
            id: 'task-2',
            title: 'Implement dark mode',
            description: 'Add dark mode toggle to the application',
            reward: 75,
            difficulty: 'gold',
            stack: ['React', 'CSS'],
            status: 'OPEN'
          }
        ],
        recentActivity: [
          {
            type: 'task_completed',
            title: 'Fixed API endpoint bug',
            description: 'Successfully completed the task and earned 50 WTH',
            reward: 50,
            timestamp: new Date().toISOString()
          },
          {
            type: 'time_remaining',
            title: 'Daily streak bonus available',
            description: 'Complete a task today to maintain your 5-day streak',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          }
        ],
        submissions: [
          {
            id: 'sub-1',
            taskId: 'task-1',
            taskTitle: 'Fix API endpoint bug',
            submittedAt: new Date().toISOString(),
            status: 'approved',
            score: 100,
            feedback: 'Great work on fixing the bug!'
          }
        ],
        tasks: [
          {
            id: 'task-1',
            title: 'Fix API endpoint bug',
            description: 'Resolve the issue with the user authentication endpoint',
            reward: 50,
            difficulty: 'silver',
            stack: ['TypeScript', 'Node.js'],
            status: 'DONE'
          },
          {
            id: 'task-2',
            title: 'Implement dark mode',
            description: 'Add dark mode toggle to the application',
            reward: 75,
            difficulty: 'gold',
            stack: ['React', 'CSS'],
            status: 'OPEN'
          }
        ]
      },
      '/access/tasks': [
        {
          id: 'task-1',
          title: 'Fix API endpoint bug',
          description: 'Resolve the issue with the user authentication endpoint',
          reward: 50,
          difficulty: 'silver',
          stack: ['TypeScript', 'Node.js'],
          status: 'DONE'
        },
        {
          id: 'task-2',
          title: 'Implement dark mode',
          description: 'Add dark mode toggle to the application',
          reward: 75,
          difficulty: 'gold',
          stack: ['React', 'CSS'],
          status: 'OPEN'
        }
      ],
      '/wallet/balance': {
        balance: 1250
      },
      '/notifications': [
        {
          id: 'notif-1',
          title: 'Welcome to EL ACCESS',
          message: 'Thanks for joining our platform!',
          type: 'success',
          isRead: false,
          createdAt: new Date().toISOString()
        }
      ]
    };

    // Return the appropriate mock response or a generic response
    const response = mockResponses[url] || {
      message: `Mock response for GET ${url}`,
      timestamp: new Date().toISOString(),
      success: true
    };

    return { data: response };
  },

  async post(url: string, data?: any) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300));
    
    // Handle specific POST endpoints
    if (url.includes('/auth/login')) {
      return {
        data: {
          accessToken: 'mock-jwt-token-for-vercel-deployment',
          token_type: 'bearer'
        }
      };
    }
    
    if (url.includes('/auth/register')) {
      return {
        data: {
          message: 'Registration successful',
          user: { 
            id: 'user-' + Math.random().toString(36).substr(2, 9), 
            name: data?.name, 
            email: data?.email 
          }
        }
      };
    }
    
    if (url.includes('/tasks/') && url.includes('/submit')) {
      return {
        data: {
          id: 'sub-' + Math.random().toString(36).substr(2, 9),
          taskId: url.split('/')[2], // Extract task ID from URL
          status: 'pending',
          submittedAt: new Date().toISOString()
        }
      };
    }
    
    return {
      data: {
        message: `Mock response for POST to ${url}`,
        data: data,
        success: true
      }
    };
  },

  async put(url: string, data?: any) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 200));
    
    return {
      data: {
        message: `Mock response for PUT to ${url}`,
        data: data,
        success: true
      }
    };
  },

  async delete(url: string) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 200));
    
    return {
      data: {
        message: `Mock response for DELETE to ${url}`,
        success: true
      }
    };
  }
};