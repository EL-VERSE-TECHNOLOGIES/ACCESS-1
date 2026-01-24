import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

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
  return (
    <motion.div
      className="bg-dark-surface-variant rounded-xl p-6 border border-slate-700 shadow-lg"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-secondary text-sm">Current Balance</p>
          <h3 className="text-3xl font-bold text-neon-accent mt-1">
            {balance.toLocaleString()} {currency}
          </h3>
        </div>
        <div className="bg-slate-800 p-3 rounded-lg">
          <div className="w-10 h-10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neon-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Weekly Earnings:</span>
          <span className="text-success">+{weeklyEarnings.toLocaleString()} {currency}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-text-secondary">Pending:</span>
          <span className="text-warning">{pendingAmount.toLocaleString()} {currency}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-text-secondary">Daily Multiplier:</span>
          <span className="text-neon-accent">{dailyMultiplier.toFixed(1)}x</span>
        </div>
      </div>
      <Link href="/wallet" className="mt-4 block text-center py-2 text-sm text-neon-accent border border-neon-accent rounded-lg hover:bg-neon-accent/10 transition-colors">
        View Full Wallet
      </Link>
    </motion.div>
  );
};

export default StipendWallet;