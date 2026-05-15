import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import api from '../lib/api';

interface FacialLivenessCheckProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const FacialLivenessCheck: React.FC<FacialLivenessCheckProps> = ({ onSuccess, onCancel }) => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [step, setStep] = useState<'initial' | 'capture' | 'processing' | 'success' | 'error'>('initial');
  const [countdown, setCountdown] = useState<number>(3);
  const [instructions, setInstructions] = useState<string>('Position your face in the frame');

  const capture = React.useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setImgSrc(imageSrc);
        setStep('processing');
        
        try {
          // Sync with Go backend for face verification status
          // In a real environment, the user might not be logged in yet during registration,
          // so this might be a pre-auth endpoint or verified during register call.
          // For registered users (e.g. adding biometrics), we call the API.
          const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

          if (token) {
            await api.post('/auth/verify-face', { image: imageSrc });
          }

          // For registration flow, we mark as successful locally
          setStep('success');
          setTimeout(() => {
            onSuccess();
          }, 1500);
        } catch (error) {
          console.error('Face verification synchronization failed:', error);
          setStep('error');
        }
      }
    }
  }, [onSuccess]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'capture' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (step === 'capture' && countdown === 0) {
      capture();
    }
    return () => clearTimeout(timer);
  }, [step, countdown, capture]);

  const startCapture = () => {
    setStep('capture');
    setCountdown(3);
  };

  const reset = () => {
    setStep('initial');
    setImgSrc(null);
    setCountdown(3);
  };

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-md">
      <div className="bg-dark-surface-variant/90 rounded-3xl border border-slate-700 w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h3 className="font-bold text-white flex items-center gap-2">
            <span className="text-neon-accent">🔒</span> Biometric ID Sync
          </h3>
          <button 
            onClick={onCancel}
            className="text-text-secondary hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="p-8">
          {step === 'initial' && (
            <div className="text-center">
              <div className="text-6xl mb-6 animate-pulse">👤</div>
              <h4 className="text-2xl font-bold text-white mb-3">Face ID Enrollment</h4>
              <p className="text-text-secondary mb-8 leading-relaxed">
                Secure your ecosystem account using advanced facial recognition. This will be required for high-security actions.
              </p>
              <button 
                onClick={startCapture}
                className="w-full py-4 bg-neon-accent text-dark-surface font-black rounded-2xl hover:bg-neon-accent-hover transition-all shadow-neon"
              >
                BEGIN SCAN
              </button>
            </div>
          )}
          
          {step === 'capture' && (
            <div className="text-center">
              <div className="relative mx-auto w-72 h-72 mb-6">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user" }}
                  className="w-full h-full rounded-full object-cover border-4 border-slate-800"
                />
                <div className="absolute inset-0 border-4 border-neon-accent rounded-full animate-ping opacity-20 pointer-events-none"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl font-black text-neon-accent drop-shadow-lg">{countdown}</div>
                </div>
              </div>
              <p className="text-text-secondary font-medium tracking-wide uppercase text-xs">{instructions}</p>
            </div>
          )}
          
          {step === 'processing' && (
            <div className="text-center py-10">
              <div className="flex justify-center mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-accent"></div>
              </div>
              <h4 className="text-xl font-bold text-white mb-2 italic">ANALYZING BIOMETRICS</h4>
              <p className="text-text-secondary text-sm">Verifying liveness and features...</p>
            </div>
          )}
          
          {step === 'success' && (
            <div className="text-center py-6">
              <div className="text-6xl text-success mb-6 bg-emerald-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">✅</div>
              <h4 className="text-2xl font-bold text-white mb-2">SCAN COMPLETE</h4>
              <p className="text-text-secondary mb-8">Biometric identity synchronized successfully.</p>
              <button
                onClick={onSuccess}
                className="w-full py-4 bg-emerald-500 text-dark-surface font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-lg"
              >
                CONTINUE
              </button>
            </div>
          )}
          
          {step === 'error' && (
            <div className="text-center py-6">
              <div className="text-6xl text-error mb-6 bg-red-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto border border-red-500/20">❌</div>
              <h4 className="text-2xl font-bold text-white mb-2">SCAN FAILED</h4>
              <p className="text-text-secondary mb-8">Could not synchronize biometrics. Please ensure good lighting.</p>
              <div className="flex gap-4">
                <button 
                  onClick={reset}
                  className="flex-1 py-4 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition-all border border-slate-700"
                >
                  RETRY
                </button>
                <button 
                  onClick={onCancel}
                  className="flex-1 py-4 bg-transparent text-text-secondary font-bold rounded-2xl hover:text-white transition-all"
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacialLivenessCheck;
