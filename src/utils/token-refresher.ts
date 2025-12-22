import { useState, useEffect, useCallback } from 'react';
import { refreshToken } from '../api/refresh_token';

interface Tokens {
  access_token: string;
  refresh_token: string;
}

export function useAutoRefreshToken() {
  const [tokens, setTokens] = useState<Tokens>(() => {
    // Инициализируем токены из localStorage при создании
    const savedAccessToken = localStorage.getItem('token');
    const savedRefreshToken = localStorage.getItem('refresh_token');
    
    return {
      access_token: savedAccessToken || '',
      refresh_token: savedRefreshToken || '',
    };
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshToken = useCallback(async () => {
    const currentRefreshToken = localStorage.getItem('refresh_token');
    
    if (!currentRefreshToken || isRefreshing) {
      return;
    }

    setIsRefreshing(true);

    try {
      console.log('Обновление токенов...');
      const newTokens = await refreshToken(currentRefreshToken);
      
      if (newTokens?.access_token) {
        setTokens({
          access_token: newTokens.access_token,
          refresh_token: newTokens.refresh_token || currentRefreshToken,
        });
        console.log('Токены успешно обновлены');
      }
    } catch (error) {
      console.error('Ошибка обновления токена:', error);
      // Если не удалось обновить токен, очищаем все
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('userEmail');
      setTokens({
        access_token: '',
        refresh_token: '',
      });
      // Перезагружаем страницу для возврата на экран логина
      window.location.reload();
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  // Автоматическое обновление токена по интервалу из .env
  useEffect(() => {
    const refreshInterval = Number(import.meta.env.VITE_REFRESH_INTERVAL) || 300; // По умолчанию 300 секунд (5 минут)
    const intervalMs = refreshInterval * 1000;

    const interval = setInterval(() => {
      const refreshTokenValue = localStorage.getItem('refresh_token');
      const accessTokenValue = localStorage.getItem('token');
      
      if (refreshTokenValue && accessTokenValue) {
        handleRefreshToken();
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [handleRefreshToken]);

  // Обновляем токены сразу после логина (через 5 секунд для стабилизации)
  useEffect(() => {
    if (tokens.access_token && tokens.refresh_token && !isRefreshing) {
      const timer = setTimeout(() => {
        handleRefreshToken();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [tokens.access_token, tokens.refresh_token, handleRefreshToken, isRefreshing]);

  return {
    tokens,
    setTokens,
    refreshToken: handleRefreshToken,
  };
}