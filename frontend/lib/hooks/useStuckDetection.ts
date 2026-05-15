import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

interface StuckDetectionHook {
  isInactive: boolean;
  timeRemaining: number;
  triggerAssistance: (userId?: string) => void;
}

const useStuckDetection = (timeoutMinutes: number = 15): StuckDetectionHook => {
  const [isInactive, setIsInactive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeoutMinutes * 60); // in seconds
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || '';

  const resetTimer = () => {
    setIsInactive(false);
    setTimeRemaining(timeoutMinutes * 60);

    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Set new timeout to detect inactivity
    timeoutRef.current = setTimeout(() => {
      setIsInactive(true);
      // Trigger Uno AI assistance after timeout
      triggerAssistance();
    }, timeoutMinutes * 60 * 1000);

    // Set interval to update countdown
    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const triggerAssistance = async (userId: string = 'unknown') => {
    try {
      // Notify backend that user is stuck
      await axios.post(`${base}/api/access/stuck-detection`, {
        userId: userId,
        timestamp: new Date().toISOString(),
        reason: 'inactivity_timeout'
      }, { withCredentials: true });
    } catch (error) {
      console.error('Error reporting stuck state:', error);
    }
  };

  useEffect(() => {
    // Initialize the timer
    resetTimer();

    // Event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
    };
  }, []);

  return { isInactive, timeRemaining, triggerAssistance };
};

export default useStuckDetection;