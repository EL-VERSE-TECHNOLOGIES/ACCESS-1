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
          // Real facial recognition processing call
          await api.post('/auth/verify-face', { image: imageSrc });
          setStep('success');
          setTimeout(() => {
            onSuccess();
          }, 1500);
        } catch (error) {
          console.error('Face verification failed:', error);
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
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-surface-variant rounded-xl border border-slate-700 w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="font-bold text-white flex items-center">
            <span className="mr-2">🔒</span> Facial Liveness Check
          </h3>
          <button 
            onClick={onCancel}
            className="text-text-secondary hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          {step === 'initial' && (
            <div className="text-center">
              <div className="text-6xl mb-4">👤</div>
              <h4 className="text-xl font-bold text-white mb-2">Identity Verification</h4>
              <p className="text-text-secondary mb-6">
                We need to verify your identity using facial recognition for security purposes.
              </p>
              <button 
                onClick={startCapture}
                className="btn-neon-primary w-full py-3"
              >
                Start Verification
              </button>
            </div>
          )}
          
          {step === 'capture' && (
            <div className="text-center">
              <div className="relative mx-auto w-64 h-64 mb-4">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user" }}
                  className="w-full h-full rounded-lg"
                />
                <div className="absolute inset-0 border-4 border-neon-accent rounded-lg pointer-events-none"></div>
              </div>
              <div className="text-4xl font-bold text-neon-accent mb-2">{countdown}</div>
              <p className="text-text-secondary">{instructions}</p>
            </div>
          )}
          
          {step === 'processing' && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-accent"></div>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Verifying Identity</h4>
              <p className="text-text-secondary">Analyzing facial features...</p>
            </div>
          )}
          
          {step === 'success' && (
            <div className="text-center">
              <div className="text-6xl text-success mb-4">✅</div>
              <h4 className="text-xl font-bold text-white mb-2">Verification Successful</h4>
              <p className="text-text-secondary mb-4">Your identity has been verified</p>
              <div className="flex gap-3">
                <button 
                  onClick={onSuccess}
                  className="btn-neon-primary flex-1 py-3"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
          
          {step === 'error' && (
            <div className="text-center">
              <div className="text-6xl text-error mb-4">❌</div>
              <h4 className="text-xl font-bold text-white mb-2">Verification Failed</h4>
              <p className="text-text-secondary mb-4">Please try again</p>
              <div className="flex gap-3">
                <button 
                  onClick={reset}
                  className="btn-neon flex-1 py-3"
                >
                  Retry
                </button>
                <button 
                  onClick={onCancel}
                  className="btn-neon flex-1 py-3"
                >
                  Cancel
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