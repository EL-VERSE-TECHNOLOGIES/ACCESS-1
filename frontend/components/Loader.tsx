import React from 'react';
import Image from 'next/image';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-24 h-24'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        src="/images/loader.svg"
        alt="Loading..."
        width={size === 'sm' ? 24 : size === 'md' ? 48 : 96}
        height={size === 'sm' ? 24 : size === 'md' ? 48 : 96}
        className={`${sizeClasses[size]} animate-spin`}
      />
      {message && <p className="mt-2 text-gray-600">{message}</p>}
    </div>
  );
};

export default Loader;