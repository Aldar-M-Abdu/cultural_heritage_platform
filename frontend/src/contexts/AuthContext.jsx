import React from 'react';

const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={null}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  throw new Error('useAuth must be used within an AuthProvider');
};