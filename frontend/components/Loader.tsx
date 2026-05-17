import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', message = 'Synchronizing Ecosystem...', fullScreen = false }) => {
  const sizeMap = {
    sm: 40,
    md: 80,
    lg: 120
  };

  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative">
        {/* Pulsing Outer Ring */}
        <motion.div
          className="absolute -inset-4 border-2 border-neon-accent/30 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Rotating Inner Ring */}
        <motion.div
          className="absolute -inset-2 border-t-2 border-b-2 border-blue-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative bg-slate-900 rounded-2xl p-2 shadow-neon-sm overflow-hidden">
          <Image
            src="/images/new_logo.jpg"
            alt="EL ACCESS"
            width={sizeMap[size]}
            height={sizeMap[size]}
            className="rounded-xl grayscale brightness-125"
          />
        </div>
      </div>

      {message && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-neon-accent font-black uppercase tracking-[0.2em] text-[10px] italic">
            {message}
          </p>
          <div className="flex gap-1 justify-center mt-2">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-1 h-1 bg-neon-accent rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-dark-surface flex items-center justify-center backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
