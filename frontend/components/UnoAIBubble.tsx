import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
}

interface UnoAIBubbleProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const UnoAIBubble: React.FC<UnoAIBubbleProps> = ({ isOpen: propIsOpen, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'help' | 'pathway' | 'vibe_check'>('help');

  const base = process.env.NEXT_PUBLIC_API_BASE_URL || '';

  const toggleChat = () => {
    if (onToggle) {
      onToggle();
    } else {
      setIsOpen(!isOpen);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${base}/api/ai/chat`, {
        message: inputValue,
        mode: activeMode,
        userId: 'current_user_id' // This would come from auth context
      }, { withCredentials: true });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: response.data.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message to AI:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Initial greeting when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting: Message = {
        id: 'greeting',
        sender: 'ai',
        content: "Hello! I'm Uno AI, your learning companion. How can I assist you today?",
        timestamp: new Date().toISOString()
      };
      setMessages([greeting]);
    }
  }, [isOpen, messages.length]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-dark-surface-variant rounded-xl shadow-2xl border border-slate-700 mb-4 w-80 max-h-96 overflow-hidden flex flex-col"
          >
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 border-b border-slate-700">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-neon-accent flex items-center">
                  <span className="mr-2">🤖</span> Uno AI Mentor
                </h3>
                <button
                  onClick={toggleChat}
                  className="text-text-secondary hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="flex mt-2 space-x-2">
                <button
                  className={`text-xs px-2 py-1 rounded ${
                    activeMode === 'help'
                      ? 'bg-neon-accent text-dark-surface'
                      : 'bg-slate-700 text-text-secondary hover:text-white'
                  }`}
                  onClick={() => setActiveMode('help')}
                >
                  Help
                </button>
                <button
                  className={`text-xs px-2 py-1 rounded ${
                    activeMode === 'pathway'
                      ? 'bg-neon-accent text-dark-surface'
                      : 'bg-slate-700 text-text-secondary hover:text-white'
                  }`}
                  onClick={() => setActiveMode('pathway')}
                >
                  Pathway
                </button>
                <button
                  className={`text-xs px-2 py-1 rounded ${
                    activeMode === 'vibe_check'
                      ? 'bg-neon-accent text-dark-surface'
                      : 'bg-slate-700 text-text-secondary hover:text-white'
                  }`}
                  onClick={() => setActiveMode('vibe_check')}
                >
                  Vibe Check
                </button>
              </div>
            </div>
            <div className="p-4 flex-1 overflow-y-auto max-h-60">
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg max-w-[80%] ${
                      msg.sender === 'user'
                        ? 'bg-neon-accent text-dark-surface ml-auto'
                        : 'bg-slate-800 text-text-secondary'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
                {isLoading && (
                  <div className="bg-slate-800 p-3 rounded-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-3 border-t border-slate-700">
              <div className="flex">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask Uno AI..."
                  className="flex-1 bg-slate-800 text-white rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neon-accent"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-neon-accent text-dark-surface px-3 py-2 rounded-r-lg text-sm font-medium disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-neon-accent to-emerald-400 flex items-center justify-center shadow-lg shadow-neon-accent/30 hover:shadow-xl hover:shadow-neon-accent/50 uno-ai-bubble-btn"
      >
        <span className="text-xl">🤖</span>
      </motion.button>
    </div>
  );
};

export default UnoAIBubble;