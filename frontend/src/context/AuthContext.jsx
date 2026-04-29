import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const kullaniciAdi = localStorage.getItem('kullaniciAdi');
    return token ? { token, kullaniciAdi } : null;
  });

  const login = (token, kullaniciAdi) => {
    localStorage.setItem('token', token);
    localStorage.setItem('kullaniciAdi', kullaniciAdi);
    setAuth({ token, kullaniciAdi });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('kullaniciAdi');
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, isAuthenticated: !!auth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
