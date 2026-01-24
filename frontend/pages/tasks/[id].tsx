import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from 'axios'
import { useState, useEffect, useRef } from 'react'
import AuthShell from '../../components/AuthShell'
import UnoAIBubble from '../../components/UnoAIBubble'

const Editor = dynamic(() => import('@monaco-editor/react').then(m => m.default), { ssr: false })

interface Task {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  reward: number;
  difficulty: 'bronze' | 'silver' | 'gold';
  stack: string[];
  status: 'OPEN' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  language: string;
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  creator: string;
}

interface TaskData {
  task: Task;
  user: {
    id: string;
    name: string;
    tier: 'Intern' | 'Lead' | 'Management';
  };
}

const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then(r => r.data)

export default function TaskWorkspace() {
  const router = useRouter()
  const { id } = router.query
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  const { data, error } = useSWR<TaskData>(id ? `${base}/api/access/tasks/${id}` : null, fetcher)
  const [code, setCode] = useState<string>("")
  const [dirty, setDirty] = useState(false)
  const [activeTab, setActiveTab] = useState<'editor' | 'ai-review' | 'output'>('editor')
  const [aiResponse, setAiResponse] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [mediaIds, setMediaIds] = useState<string[]>([])
  const editorRef = useRef<any>(null)

  useEffect(() => {
    // load autosave
    if (!id) return
    const key = `task:${id}:autosave`
    const saved = typeof window !== 'undefined' ? localStorage.getItem(key) : null
    if (saved) setCode(saved)
  }, [id])

  useEffect(() => {
    const key = `task:${id}:autosave`
    const t = setTimeout(() => {
      if (dirty && typeof window !== 'undefined') {
        localStorage.setItem(key, code)
      }
    }, 1000)
    return () => clearTimeout(t)
  }, [code, dirty])

  const handleRunCode = async () => {
    // Simulate running code
    setIsLoading(true)
    setTimeout(() => {
      setAiResponse("Code executed successfully! No errors detected.")
      setIsLoading(false)
      setActiveTab('output')
    }, 1500)
  }

  const handleCodeReview = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post(`${base}/api/ai/review`, {
        taskId: id,
        code: code,
        userId: data?.user.id
      }, { withCredentials: true });

      setAiResponse(response.data.review);
      setIsLoading(false);
      setActiveTab('ai-review');
    } catch (err) {
      console.error('AI review failed:', err);
      setAiResponse("Sorry, the AI review service is temporarily unavailable.");
      setIsLoading(false);
      setActiveTab('ai-review');
    }
  }

  const handleSubmit = async () => {
    try {
      await axios.post(`${base}/api/access/tasks/${id}/submit`, {
        code,
        mediaIds,
        taskId: id
      }, { withCredentials: true });

      alert('Submitted successfully! Your stipend will be credited shortly.');
      router.push('/tasks');
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Submission failed. Please try again.');
    }
  }

  if (error) return <div className="p-6 text-text-secondary">Failed to load task</div>;
  if (!data) return <div className="p-6 text-text-secondary">Loading...</div>;

  const { task, user } = data;

  return (
    <AuthShell>
      <div className="min-h-screen bg-dark-surface">
        {/* Header */}
        <header className="p-4 border-b border-slate-700 bg-slate-900">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">{task.title}</h1>
              <p className="text-text-secondary text-sm">#{task.id} • {task.stack.join(', ')}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRunCode}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Run Code
              </button>
              <button
                onClick={handleSubmit}
                className="btn-neon-primary px-6 py-2"
              >
                Submit & Earn
              </button>
            </div>
          </div>
        </header>

        {/* Main Workspace */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Left Panel - Prompt Window */}
          <div className="lg:col-span-1 bg-dark-surface-variant rounded-xl border border-slate-700 shadow-lg h-[calc(100vh-180px)] flex flex-col">
            <div className="p-4 border-b border-slate-700">
              <h2 className="font-bold text-white flex items-center">
                <span className="mr-2">📋</span> Task Prompt
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                <p className="text-text-secondary mb-4">{task.description}</p>

                <div className="bg-slate-800/50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-neon-accent mb-2">Requirements:</h4>
                  <ul className="list-disc pl-5 text-text-secondary space-y-1">
                    {task.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-neon-accent mb-1">Reward:</h4>
                      <p className="text-xl font-bold text-success">+{task.reward} WTH</p>
                    </div>
                    <div className="text-right">
                      <h4 className="font-medium text-neon-accent mb-1">Difficulty:</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.difficulty === 'bronze' ? 'bg-amber-600' :
                        task.difficulty === 'silver' ? 'bg-gray-400' : 'bg-yellow-500'
                      }`}>
                        {task.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-lg mt-4">
                  <h4 className="font-medium text-neon-accent mb-2">Assigned To:</h4>
                  <p className="text-text-secondary">{task.assignedTo || 'Unassigned'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Editor and AI Review */}
          <div className="lg:col-span-2 flex flex-col h-[calc(100vh-180px)]">
            {/* Tabs */}
            <div className="flex border-b border-slate-700 mb-0">
              <button
                className={`px-4 py-3 font-medium text-sm ${
                  activeTab === 'editor'
                    ? 'text-neon-accent border-b-2 border-neon-accent'
                    : 'text-text-secondary hover:text-white'
                }`}
                onClick={() => setActiveTab('editor')}
              >
                Code Editor
              </button>
              <button
                className={`px-4 py-3 font-medium text-sm ${
                  activeTab === 'ai-review'
                    ? 'text-neon-accent border-b-2 border-neon-accent'
                    : 'text-text-secondary hover:text-white'
                }`}
                onClick={() => setActiveTab('ai-review')}
              >
                Uno AI Review
              </button>
              <button
                className={`px-4 py-3 font-medium text-sm ${
                  activeTab === 'output'
                    ? 'text-neon-accent border-b-2 border-neon-accent'
                    : 'text-text-secondary hover:text-white'
                }`}
                onClick={() => setActiveTab('output')}
              >
                Output
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 bg-dark-surface-variant rounded-b-xl border border-t-0 border-slate-700 shadow-lg overflow-hidden">
              {activeTab === 'editor' && (
                <div className="h-full flex flex-col">
                  <div className="p-2 border-b border-slate-700 bg-slate-800 flex items-center">
                    <div className="flex space-x-1.5">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="ml-3 text-xs text-text-secondary">scratchpad.{task.language.toLowerCase()}</span>
                  </div>
                  <div className="flex-1">
                    <Editor
                      height="100%"
                      defaultLanguage={task.language || 'javascript'}
                      value={code}
                      onChange={(v) => { setCode(v || ''); setDirty(true) }}
                      theme="vs-dark"
                      onMount={(editor) => {
                        editorRef.current = editor;
                      }}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                      }}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'ai-review' && (
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b border-slate-700 flex items-center">
                    <div className="mr-3 p-2 bg-slate-800 rounded-lg">
                      <span className="text-lg">🤖</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Uno AI Code Review</h3>
                      <p className="text-xs text-text-secondary">Analysis of your solution</p>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    {isLoading ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-accent"></div>
                      </div>
                    ) : aiResponse ? (
                      <div className="whitespace-pre-line text-text-secondary">
                        {aiResponse}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8 text-text-secondary">
                        <div className="text-5xl mb-4">🔍</div>
                        <h3 className="text-lg font-medium text-white mb-2">Request AI Review</h3>
                        <p className="mb-4">Get feedback on your code from Uno AI</p>
                        <button
                          onClick={handleCodeReview}
                          className="btn-neon-primary px-4 py-2"
                        >
                          Analyze My Code
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'output' && (
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b border-slate-700 flex items-center">
                    <div className="mr-3 p-2 bg-slate-800 rounded-lg">
                      <span className="text-lg">🖥️</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Console Output</h3>
                      <p className="text-xs text-text-secondary">Execution results</p>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 font-mono text-sm bg-slate-900">
                    {isLoading ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="animate-pulse">Running code...</div>
                      </div>
                    ) : aiResponse ? (
                      <pre className="whitespace-pre-wrap text-green-400">{aiResponse}</pre>
                    ) : (
                      <div className="h-full flex items-center justify-center text-text-secondary">
                        Click "Run Code" to see output
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Uno AI Floating Bubble */}
        <UnoAIBubble />
      </div>
    </AuthShell>
  )
}
