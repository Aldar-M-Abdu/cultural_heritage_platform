import React, { createContext, useContext } from 'react';
import useToast from '../hooks/useToast';
import { ToastContainer } from '../components/common/Toast';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const { toasts, toast, removeToast } = useToast();
  
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => useContext(ToastContext);
