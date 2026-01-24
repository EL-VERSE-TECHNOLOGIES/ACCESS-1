import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

interface ConfettiAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
  particleCount?: number;
  recycle?: boolean;
}

const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({ 
  isActive, 
  onComplete, 
  particleCount = 150,
  recycle = false
}) => {
  const [dimensions, setDimensions] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 0, 
    height: typeof window !== 'undefined' ? window.innerHeight : 0 
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isActive && onComplete) {
      const timer = setTimeout(onComplete, 5000); // Confetti lasts 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <Confetti
      width={dimensions.width}
      height={dimensions.height}
      recycle={recycle}
      numberOfPieces={particleCount}
      gravity={0.1}
      colors={['#00FFC2', '#00e6b2', '#00cc99', '#00b38a', '#00997a']}
    />
  );
};

export default ConfettiAnimation;