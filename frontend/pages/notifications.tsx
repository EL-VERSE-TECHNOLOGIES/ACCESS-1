import { useEffect, useState } from 'react'
import { useSocket } from '../components/SocketProvider'
import api from '../lib/api'
import AuthShell from '../components/AuthShell'
import Link from 'next/link'

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  taskId?: string;
}

export default function NotificationsPage() {
  const { socket } = useSocket()
  const [items, setItems] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const res = await api.get('/notifications')
        setItems(res.data || [])
      } catch (e) {
        console.error('Failed to load notifications:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!socket) return
    const handler = (n: Notification) => setItems((prev) => [n, ...prev])
    socket.on('notification', handler)
    return () => {
      socket.off('notification', handler)
    }
  }, [socket])

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}`, { isRead: true })
      setItems(prev => prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      ))
    } catch (e) {
      console.error('Failed to mark notification as read:', e)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read')
      setItems(prev => prev.map(notif => ({ ...notif, isRead: true })))
    } catch (e) {
      console.error('Failed to mark all notifications as read:', e)
    }
  }

  const filteredItems = filter === 'all'
    ? items
    : items.filter(item => !item.isRead)

  const unreadCount = items.filter(item => !item.isRead).length

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  const getTypeBg = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-br from-emerald-900/20 to-emerald-800/20 border-emerald-700/50'
      case 'warning':
        return 'bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-yellow-700/50'
      case 'error':
        return 'bg-gradient-to-br from-red-900/20 to-red-800/20 border-red-700/50'
      default:
        return 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50'
    }
  }

  return (
    <AuthShell>
      <div className="min-h-screen bg-gradient-to-br from-dark-surface to-slate-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-accent/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent">
                  Notifications
                </h1>
                <p className="text-text-secondary mt-1">Stay updated with important alerts</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex bg-slate-800/70 rounded-xl p-1 backdrop-blur-sm border border-slate-700/50">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'all'
                        ? 'bg-gradient-to-r from-neon-accent to-emerald-400 text-dark-surface shadow-md shadow-neon-accent/20'
                        : 'text-text-secondary hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'unread'
                        ? 'bg-gradient-to-r from-neon-accent to-emerald-400 text-dark-surface shadow-md shadow-neon-accent/20 flex items-center'
                        : 'text-text-secondary hover:text-white flex items-center'
                    }`}
                  >
                    Unread
                    {unreadCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </div>

                <button
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    unreadCount === 0
                      ? 'bg-slate-700 text-text-secondary cursor-not-allowed'
                      : 'bg-gradient-to-r from-slate-700 to-slate-800 text-text-secondary hover:from-slate-600 hover:to-slate-700 hover:text-white'
                  }`}
                >
                  Mark All Read
                </button>
              </div>
            </div>
          </header>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-accent mb-4"></div>
              <p className="text-text-secondary">Loading notifications...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="mx-auto bg-slate-800/50 p-6 rounded-full w-24 h-24 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </h3>
              <p className="text-text-secondary max-w-md mx-auto">
                {filter === 'unread'
                  ? 'You\'ve caught up with all notifications!'
                  : 'You don\'t have any notifications yet. Check back later for updates.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-5 border backdrop-blur-sm transition-all duration-300 ${
                    !item.isRead ? 'border-slate-600/50 ring-1 ring-slate-700/30' : 'border-slate-700/50'
                  } ${getTypeBg(item.type)} animate-fade-in`}
                >
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg mr-4 ${item.isRead ? 'bg-slate-700/50' : 'bg-slate-700'}`}>
                      {getTypeIcon(item.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className={`font-semibold ${item.isRead ? 'text-text-secondary' : 'text-white'}`}>
                            {item.title}
                          </h3>
                          <p className={`mt-1 ${item.isRead ? 'text-text-secondary' : 'text-text-secondary'}`}>
                            {item.message}
                          </p>
                        </div>

                        {!item.isRead && (
                          <button
                            onClick={() => markAsRead(item.id)}
                            className="text-xs bg-slate-700 text-text-secondary px-2 py-1 rounded-lg hover:bg-slate-600 transition-colors"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="text-xs text-text-secondary">
                          {new Date(item.createdAt).toLocaleString()}
                        </div>

                        {item.taskId && (
                          <Link
                            href={`/tasks/${item.taskId}`}
                            className="text-xs text-neon-accent hover:underline"
                          >
                            View Task
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthShell>
  )
}
