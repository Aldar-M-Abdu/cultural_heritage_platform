import { useState, useCallback } from 'react';

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, options = {}) => {
    const { type = 'info', duration = 5000 } = options;
    const id = Date.now().toString();
    
    setToasts(prevToasts => [...prevToasts, { id, message, type, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const toast = useCallback(
    (message, options) => addToast(message, options),
    [addToast]
  );

  toast.success = useCallback(
    (message, options) => addToast(message, { ...options, type: 'success' }),
    [addToast]
  );

  toast.error = useCallback(
    (message, options) => addToast(message, { ...options, type: 'error' }),
    [addToast]
  );

  toast.info = useCallback(
    (message, options) => addToast(message, { ...options, type: 'info' }),
    [addToast]
  );

  toast.warning = useCallback(
    (message, options) => addToast(message, { ...options, type: 'warning' }),
    [addToast]
  );

  return {
    toasts,
    toast,
    removeToast,
  };
};

export default useToast;
