import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        {toasts.map(({ id, message, type }) => (
          <div
            key={id}
            className="animate-fade-in-up cyber-panel px-4 py-3 flex items-center gap-2 shadow-cyber-lg"
          >
            {type === 'success' && <span className="text-safe text-lg">✓</span>}
            {type === 'error' && <span className="text-phishing text-lg">✕</span>}
            <span className="text-sm text-slate-200">{message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  return ctx || { addToast: () => {} };
}
