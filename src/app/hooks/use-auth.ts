import { useState, useEffect, useCallback } from 'react';
import { authApi } from '../../api/auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setUserName('');
    authApi.logout();
  }, []);

  useEffect(() => {
    const savedAccessToken = localStorage.getItem('token');
    const savedRefreshToken = localStorage.getItem('refresh_token');

    if (savedAccessToken && savedRefreshToken) {
      setIsAuthenticated(true);
      const email = localStorage.getItem('userEmail') || '';
      setUserName(email.split('@')[0] || 'Пользователь');
    }
    
    setIsInitialized(true);
  }, []);

  const handleLogin = (email: string, password: string, name?: string) => {
    setIsAuthenticated(true);
    setUserName(name || email.split('@')[0] || 'Пользователь');
    localStorage.setItem('userEmail', email);
  };

  return {
    isAuthenticated,
    userName,
    handleLogin,
    handleLogout,
    isInitialized,
  };
}