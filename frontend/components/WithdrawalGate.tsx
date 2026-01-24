import React, { useState } from 'react';

interface WithdrawalGateProps {
  onSuccess: () => void;
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
  const [verificationMethod, setVerificationMethod] = useState<'fingerprint' | 'pin'>('fingerprint');
  const [pin, setPin] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFingerprintVerify = () => {
    setIsProcessing(true);
    setError(null);
    
    // Simulate fingerprint verification
    setTimeout(() => {
      setIsProcessing(false);
      // Randomly simulate success/failure for demo
      if (Math.random() > 0.3) {
        onSuccess();
      } else {
        setError('Fingerprint not recognized. Please try again.');
      }
    }, 2000);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    
    // Simulate PIN verification
    setTimeout(() => {
      setIsProcessing(false);
      // For demo, accept any 4-digit PIN
      if (pin.length === 4 && /^\d+$/.test(pin)) {
        onSuccess();
      } else {
        setError('Invalid PIN. Please try again.');
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-surface-variant rounded-xl border border-slate-700 w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="font-bold text-white flex items-center">
            <span className="mr-2">💳</span> Secure Transaction
          </h3>
          <button 
            onClick={onCancel}
            className="text-text-secondary hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🔐</div>
            <h4 className="text-xl font-bold text-white mb-2">Verify Transaction</h4>
            <p className="text-text-secondary">
              Convert <span className="text-neon-accent font-bold">{amount} {currencyFrom}</span> to{' '}
              <span className="text-success font-bold">{currencyTo}</span>
            </p>
          </div>
          
          <div className="mb-6">
            <div className="flex bg-slate-800 rounded-lg p-1 mb-4">
              <button
                className={`flex-1 py-2 rounded-md text-sm ${
                  verificationMethod === 'fingerprint' 
                    ? 'bg-neon-accent text-dark-surface' 
                    : 'text-text-secondary hover:text-white'
                }`}
                onClick={() => setVerificationMethod('fingerprint')}
              >
                Fingerprint
              </button>
              <button
                className={`flex-1 py-2 rounded-md text-sm ${
                  verificationMethod === 'pin' 
                    ? 'bg-neon-accent text-dark-surface' 
                    : 'text-text-secondary hover:text-white'
                }`}
                onClick={() => setVerificationMethod('pin')}
              >
                PIN
              </button>
            </div>
            
            {verificationMethod === 'fingerprint' && (
              <div className="text-center">
                <div className="inline-block p-6 bg-slate-800/50 rounded-full mb-4">
                  <div className="text-5xl">👆</div>
                </div>
                <p className="text-text-secondary mb-4">Place your finger on the scanner</p>
                <button
                  onClick={handleFingerprintVerify}
                  disabled={isProcessing}
                  className="btn-neon-primary w-full py-3"
                >
                  {isProcessing ? 'Verifying...' : 'Scan Fingerprint'}
                </button>
              </div>
            )}
            
            {verificationMethod === 'pin' && (
              <form onSubmit={handlePinSubmit}>
                <div className="mb-4">
                  <label className="block text-text-secondary mb-2">Enter your 4-digit PIN</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="w-full bg-slate-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-neon-accent"
                    placeholder="••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isProcessing || pin.length !== 4}
                  className="btn-neon-primary w-full py-3"
                >
                  {isProcessing ? 'Verifying...' : 'Verify PIN'}
                </button>
              </form>
            )}
            
            {error && (
              <div className="mt-4 p-3 bg-error/20 text-error rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>
          
          <div className="text-xs text-text-secondary text-center">
            <p>Your funds are secure. This transaction requires biometric or PIN verification.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalGate;