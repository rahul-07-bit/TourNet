import { createContext, useCallback, useState } from 'react';

export const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center px-4 w-full max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-fade-in-up w-full text-center text-sm font-medium px-4 py-2.5 rounded-full shadow-lg backdrop-blur-md border ${
              t.type === 'error'
                ? 'bg-red-500/15 border-red-500/30 text-red-200'
                : t.type === 'success'
                ? 'bg-horizon/15 border-horizon/30 text-horizon'
                : 'bg-dusk-800/90 border-dusk-600 text-sand'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
