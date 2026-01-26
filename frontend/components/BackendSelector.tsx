import React, { useState } from 'react';
import { getAvailableBackends, setSelectedBackend, getSelectedBackend } from '../lib/backend-config';

const BackendSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const availableBackends = getAvailableBackends();
  const selectedBackend = getSelectedBackend();

  const handleSelect = (type: string) => {
    setSelectedBackend(type);
    setIsOpen(false);
    // Reload the page to apply the new backend configuration
    window.location.reload();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-800 text-text-secondary rounded-lg hover:text-white transition-colors text-sm"
      >
        <span>Backend: {selectedBackend.name}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <h3 className="text-xs uppercase text-text-secondary px-2 py-1">Select Backend</h3>
            {availableBackends.map((backend) => (
              <button
                key={backend.type}
                onClick={() => handleSelect(backend.type)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                  selectedBackend.type === backend.type
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-slate-700 text-text-secondary'
                }`}
              >
                <div className="font-medium">{backend.name}</div>
                <div className="text-xs opacity-75">{backend.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BackendSelector;