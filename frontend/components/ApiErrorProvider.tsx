import { ReactNode, createContext, useContext, useState } from 'react';

interface ApiErrorContextType {
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const ApiErrorContext = createContext<ApiErrorContextType | undefined>(undefined);

export const ApiErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  return (
    <ApiErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button onClick={clearError} className="ml-4 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </ApiErrorContext.Provider>
  );
};

export const useApiError = () => {
  const context = useContext(ApiErrorContext);
  if (context === undefined) {
    throw new Error('useApiError must be used within an ApiErrorProvider');
  }
  return context;
};