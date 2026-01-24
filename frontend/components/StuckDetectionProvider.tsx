import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import useStuckDetection from '../lib/hooks/useStuckDetection';

interface StuckDetectionContextType {
  isInactive: boolean;
  timeRemaining: number;
  showStuckNotification: boolean;
  setShowStuckNotification: (show: boolean) => void;
}

const StuckDetectionContext = createContext<StuckDetectionContextType | undefined>(undefined);

export function StuckDetectionProvider({ children }: { children: ReactNode }) {
  const { isInactive, timeRemaining, triggerAssistance } = useStuckDetection(15); // 15 minutes timeout
  const [showStuckNotification, setShowStuckNotification] = useState(false);

  useEffect(() => {
    if (isInactive && !showStuckNotification) {
      setShowStuckNotification(true);
    }
  }, [isInactive, showStuckNotification]);

  return (
    <StuckDetectionContext.Provider value={{
      isInactive,
      timeRemaining,
      showStuckNotification,
      setShowStuckNotification
    }}>
      {children}
      {showStuckNotification && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-lg max-w-sm">
          <div className="flex items-start">
            <div className="mr-3 text-xl">🤔</div>
            <div className="flex-1">
              <h4 className="font-bold text-white mb-1">Need help?</h4>
              <p className="text-text-secondary text-sm mb-3">
                We noticed you've been inactive for a while. Uno AI can help you get unstuck!
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowStuckNotification(false)}
                  className="text-xs px-3 py-1.5 bg-slate-700 text-text-secondary rounded hover:text-white"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    setShowStuckNotification(false);
                    // Trigger assistance
                    triggerAssistance();
                    // Open Uno AI chat
                    const bubbleButton = document.querySelector('.uno-ai-bubble-btn');
                    if (bubbleButton) {
                      (bubbleButton as HTMLElement).click();
                    }
                  }}
                  className="text-xs px-3 py-1.5 bg-neon-accent text-dark-surface rounded hover:bg-neon-accent-hover"
                >
                  Ask Uno AI
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </StuckDetectionContext.Provider>
  );
}

export function useStuckDetectionContext() {
  const context = useContext(StuckDetectionContext);
  if (context === undefined) {
    throw new Error('useStuckDetectionContext must be used within a StuckDetectionProvider');
  }
  return context;
}