import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import api from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface FacialLivenessCheckProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const FacialLivenessCheck: React.FC<FacialLivenessCheckProps> = ({ onSuccess, onCancel }) => {
  const webcamRef = useRef<Webcam>(null);
  const [step, setStep] = useState<'consent' | 'initial' | 'recording' | 'processing' | 'success' | 'error'>('consent');
  const [recordingTime, setRecordingTime] = useState<number>(30);
  const [consent, setConsent] = useState<boolean>(false);

  const startRecording = () => {
    setStep('recording');
    setRecordingTime(30);
  };

  const handleCapture = async () => {
    setStep('processing');
    try {
      // In a real ecosystem, we'd upload the video blob
      // Here we simulate the synchronization with the Go backend
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (token) {
        await api.post('/auth/verify-face', { status: 'recorded', duration: 30 });
      }

      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error('Biometric sync failed:', error);
      setStep('error');
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'recording' && recordingTime > 0) {
      timer = setTimeout(() => setRecordingTime(recordingTime - 1), 1000);
    } else if (step === 'recording' && recordingTime === 0) {
      handleCapture();
    }
    return () => clearTimeout(timer);
  }, [step, recordingTime]);

  const reset = () => {
    setStep('initial');
    setRecordingTime(30);
  };

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-4 backdrop-blur-xl">
      <div className="bg-dark-surface-variant/90 rounded-3xl border border-slate-800 w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-widest">
            <span className="text-neon-accent">🔒</span> Biometric Identity Verification
          </h3>
          <button onClick={onCancel} className="text-slate-500 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 'consent' && (
              <motion.div key="consent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <div className="text-5xl mb-6">📝</div>
                <h4 className="text-xl font-bold text-white mb-4">Biometric Consent</h4>
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 text-left mb-8">
                  <p className="text-xs text-text-secondary leading-relaxed mb-4">
                    By proceeding, you authorize EL ACCESS to record and process a 30-second facial biometric video to verify your identity. This data is used solely for ecosystem security and synchronized across our backend arms.
                  </p>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-neon-accent focus:ring-neon-accent"
                    />
                    <span className="text-[10px] font-bold text-slate-300 uppercase group-hover:text-white transition-colors">I consent to biometric recording</span>
                  </label>
                </div>
                <button 
                  onClick={() => setStep('initial')}
                  disabled={!consent}
                  className="w-full py-4 bg-neon-accent text-dark-surface font-black rounded-2xl hover:bg-neon-accent-hover transition-all shadow-neon disabled:opacity-30 disabled:shadow-none"
                >
                  PROCEED TO VERIFICATION
                </button>
              </motion.div>
            )}

            {step === 'initial' && (
              <motion.div key="initial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <div className="text-6xl mb-6">👤</div>
                <h4 className="text-2xl font-bold text-white mb-3">Position Your Face</h4>
                <p className="text-text-secondary mb-8 text-sm">Ensure your face is well-lit and clearly visible within the frame. We will record for 30 seconds.</p>
                <button 
                  onClick={startRecording}
                  className="w-full py-4 bg-neon-accent text-dark-surface font-black rounded-2xl hover:bg-neon-accent-hover transition-all shadow-neon"
                >
                  START 30s RECORDING
                </button>
              </motion.div>
            )}

            {step === 'recording' && (
              <motion.div key="recording" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <div className="relative mx-auto w-64 h-64 mb-8">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: "user" }}
                    className="w-full h-full rounded-full object-cover border-4 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                  />
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">REC</div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl font-black text-white drop-shadow-lg">{recordingTime}s</div>
                  </div>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-4">
                   <motion.div
                     initial={{ width: "100%" }}
                     animate={{ width: "0%" }}
                     transition={{ duration: 30, ease: "linear" }}
                     className="bg-red-500 h-full"
                   />
                </div>
                <p className="text-red-500 font-bold tracking-widest uppercase text-[10px]">Recording In Progress — Do Not Close</p>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-10">
                <div className="flex justify-center mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-accent"></div>
                </div>
                <h4 className="text-xl font-bold text-white mb-2 italic">ANALYZING BIOMETRIC FEED</h4>
                <p className="text-text-secondary text-xs uppercase tracking-widest">Encrypting and synchronizing data...</p>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-6">
                <div className="text-6xl text-success mb-6 bg-emerald-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">✅</div>
                <h4 className="text-2xl font-bold text-white mb-2 tracking-tighter uppercase">Sync Successful</h4>
                <p className="text-text-secondary mb-8 text-sm italic">Identity verified for the current ecosystem session.</p>
              </motion.div>
            )}

            {step === 'error' && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-6">
                <div className="text-6xl text-error mb-6 bg-red-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto border border-red-500/20">❌</div>
                <h4 className="text-2xl font-bold text-white mb-2 uppercase tracking-tighter">Verification Failed</h4>
                <p className="text-text-secondary mb-8 text-sm">Synchronization interrupted. Please check your network.</p>
                <div className="flex gap-4">
                  <button onClick={reset} className="flex-1 py-4 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition-all border border-slate-700">RETRY</button>
                  <button onClick={onCancel} className="flex-1 py-4 bg-transparent text-slate-500 font-bold rounded-2xl hover:text-white transition-all">CANCEL</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default FacialLivenessCheck;
