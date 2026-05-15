import React, { useState } from 'react';
import api from '../lib/api';

interface WithdrawalGateProps {
  onSuccess: (pin: string) => void;
  onCancel: () => void;
  amount: number;
  currencyFrom: string;
  currencyTo: string;
}

const WithdrawalGate: React.FC<WithdrawalGateProps> = ({ 
  onSuccess, 
  onCancel, 
  amount, 
  currencyFrom, 
  currencyTo 
}) => {
  const [step, setStep] = useState<'fingerprint' | 'pin'>('fingerprint');
  const [pin, setPin] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFingerprintVerify = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Simulate biometric capture and call backend to verify sync
      await api.post('/auth/verify-fingerprint');

      setTimeout(() => {
        setIsProcessing(false);
        setStep('pin'); // Proceed to next security layer
      }, 1500);
    } catch (err: any) {
      setIsProcessing(false);
      setError(err?.response?.data?.error || 'Fingerprint verification failed. Please try again.');
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) return;
    
    // Pass the PIN back to the parent so it can perform the actual withdrawal call
    onSuccess(pin);
  };

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-xl">
      <div className="bg-dark-surface-variant/90 rounded-3xl border border-slate-700 w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h3 className="font-bold text-white flex items-center gap-2">
            <span className="text-neon-accent">🛡️</span> Multi-Factor Security
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
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-slate-900 rounded-2xl mb-4 border border-slate-800 shadow-inner">
              <p className="text-xs text-text-secondary uppercase tracking-widest mb-1">Total Withdrawal</p>
              <h4 className="text-2xl font-black text-white italic">
                {amount} {currencyFrom} → <span className="text-success">{currencyTo}</span>
              </h4>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="flex gap-2 mb-8">
              <div className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step === 'fingerprint' ? 'bg-neon-accent shadow-neon' : 'bg-emerald-500'}`}></div>
              <div className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step === 'pin' ? 'bg-neon-accent shadow-neon' : 'bg-slate-700'}`}></div>
            </div>
            
            {step === 'fingerprint' && (
              <div className="text-center animate-fade-in">
                <div className="relative inline-block mb-6">
                  <div className="text-6xl p-6 bg-slate-800/50 rounded-full border border-slate-700">👆</div>
                  {isProcessing && (
                    <div className="absolute inset-0 border-2 border-neon-accent rounded-full animate-ping"></div>
                  )}
                </div>
                <p className="text-white font-bold mb-2">Biometric Verification</p>
                <p className="text-text-secondary text-sm mb-8 leading-relaxed">Please place your finger on the sensor to synchronize your identity for this transaction.</p>
                <button
                  onClick={handleFingerprintVerify}
                  disabled={isProcessing}
                  className="w-full py-4 bg-neon-accent text-dark-surface font-black rounded-2xl hover:bg-neon-accent-hover transition-all shadow-neon disabled:opacity-50"
                >
                  {isProcessing ? 'SCANNING...' : 'SCAN BIOMETRIC'}
                </button>
              </div>
            )}
            
            {step === 'pin' && (
              <form onSubmit={handlePinSubmit} className="animate-fade-in">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">🔢</div>
                  <p className="text-white font-bold mb-2">Transaction PIN</p>
                  <p className="text-text-secondary text-sm">Enter your secure 4-digit PIN to authorize.</p>
                </div>

                <div className="mb-8">
                  <input
                    type="password"
                    inputMode="numeric"
                    autoFocus
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-2xl px-4 py-5 text-center text-3xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-neon-accent/50 focus:border-neon-accent transition-all"
                    placeholder="••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || pin.length !== 4}
                  className="w-full py-4 bg-neon-accent text-dark-surface font-black rounded-2xl hover:bg-neon-accent-hover transition-all shadow-neon disabled:opacity-50"
                >
                  {isProcessing ? 'VALIDATING...' : 'AUTHORIZE TRANSACTION'}
                </button>
              </form>
            )}
            
            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
          </div>
          
          <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest font-black opacity-50">
            Secure Ecosystem Sync Protocol v2.4
          </p>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalGate;
