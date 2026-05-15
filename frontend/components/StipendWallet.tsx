import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/api';
import WithdrawalGate from './WithdrawalGate';

interface StipendWalletProps {
  balance: number;
  weeklyEarnings: number;
  pendingAmount: number;
  dailyMultiplier: number;
  currency?: string;
}

const StipendWallet: React.FC<StipendWalletProps> = ({
  balance,
  weeklyEarnings,
  pendingAmount,
  dailyMultiplier,
  currency = 'WTH'
}) => {
  const [showGate, setShowGate] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdrawClick = () => {
    setShowGate(true);
  };

  const handleWithdrawSuccess = async (pin: string) => {
    setShowGate(false); // Close the popup immediately upon success
    setIsWithdrawing(true);
    try {
      await api.post('/wallet/withdraw', {
        amount: balance,
        pin: pin
      });
      alert('Withdrawal successful! Funds are being synchronized to your account.');
      window.location.reload();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Withdrawal failed. Please check your security credentials.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleWithdrawCancel = () => {
    setShowGate(false); // Ensure the popup is removed from the DOM
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl relative overflow-hidden"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-accent/5 rounded-full -translate-y-16 translate-x-16"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-text-secondary text-sm">Available Balance</p>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-neon-accent to-emerald-400 bg-clip-text text-transparent mt-1">
              {balance.toLocaleString()} {currency}
            </h3>
          </div>
          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neon-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 text-center">
            <p className="text-text-secondary text-[10px] uppercase">Pending</p>
            <p className="text-white font-bold">{pendingAmount.toLocaleString()} {currency}</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 text-center">
            <p className="text-text-secondary text-[10px] uppercase">Multiplier</p>
            <p className="text-neon-accent font-bold">x{dailyMultiplier.toFixed(2)}</p>
          </div>
        </div>

        <button
          onClick={handleWithdrawClick}
          disabled={isWithdrawing || balance <= 0}
          className="w-full py-4 text-center text-dark-surface rounded-xl bg-neon-accent hover:bg-neon-accent-hover transition-all duration-300 shadow-neon font-black text-sm uppercase tracking-widest disabled:opacity-50 disabled:shadow-none"
        >
          {isWithdrawing ? 'Synchronizing...' : 'Withdraw Funds'}
        </button>
      </div>

      {showGate && (
        <WithdrawalGate
          amount={balance}
          currencyFrom={currency}
          currencyTo="USD"
          onSuccess={handleWithdrawSuccess}
          onCancel={handleWithdrawCancel}
        />
      )}
    </motion.div>
  );
};

export default StipendWallet;
