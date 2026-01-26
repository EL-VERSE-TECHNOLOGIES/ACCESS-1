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
  // Calculate percentages for visual representation
  const totalBalance = balance + pendingAmount;
  const balancePercentage = totalBalance > 0 ? (balance / totalBalance) * 100 : 0;
  const pendingPercentage = totalBalance > 0 ? (pendingAmount / totalBalance) * 100 : 0;

  return (
    <motion.div
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-accent/5 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full translate-y-12 -translate-x-12"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-text-secondary text-sm">Current Balance</p>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-neon-accent to-emerald-400 bg-clip-text text-transparent mt-1">
              {balance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {currency}
            </h3>
          </div>
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 p-4 rounded-xl border border-slate-600/50">
            <div className="w-10 h-10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neon-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Balance breakdown visualization */}
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-text-secondary">Balance: {balancePercentage.toFixed(0)}%</span>
            <span className="text-text-secondary">Pending: {pendingPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div className="flex h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-neon-accent to-emerald-400 h-full"
                style={{ width: `${balancePercentage}%` }}
              ></div>
              <div
                className="bg-gradient-to-r from-yellow-500/50 to-yellow-600/50 h-full"
                style={{ width: `${pendingPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Detailed breakdown */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-neon-accent mr-2"></div>
              <span className="text-text-secondary">Available</span>
            </div>
            <span className="font-medium text-white">{balance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {currency}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-text-secondary">Pending</span>
            </div>
            <span className="font-medium text-white">{pendingAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {currency}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <p className="text-text-secondary text-xs">Weekly Earnings</p>
            <p className="text-success font-bold text-lg">+{weeklyEarnings.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {currency}</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <p className="text-text-secondary text-xs">Daily Multiplier</p>
            <p className="text-neon-accent font-bold text-lg">{dailyMultiplier.toFixed(2)}x</p>
          </div>
        </div>

        <Link href="/wallet" className="block w-full py-3 text-center text-white rounded-xl bg-gradient-to-r from-neon-accent to-emerald-400 hover:from-neon-accent-hover hover:to-emerald-500 transition-all duration-300 shadow-lg shadow-neon-accent/20 font-medium">
          View Full Wallet
        </Link>
      </div>
    </motion.div>
  );
};

export default StipendWallet;