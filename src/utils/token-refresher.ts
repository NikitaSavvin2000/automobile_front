import { useState, useEffect, useRef } from "react";
import { refreshToken } from "../api/refresh_token";

const REFRESH_INTERVAL = Number(import.meta.env.VITE_REFRESH_INTERVAL) || 7;

export function useAutoRefreshToken() {
  const [tokens, setTokens] = useState<{ access_token: string | null; refresh_token: string | null }>({
    access_token: null,
    refresh_token: null,
  });

  const tokensRef = useRef(tokens);

  // Сохраняем актуальные токены в ref
  useEffect(() => {
    tokensRef.current = tokens;
  }, [tokens]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const refresh_token = tokensRef.current.refresh_token;
      if (!refresh_token) return;

      try {
        const data = await refreshToken(refresh_token);
        if (data) {
          setTokens({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
          });
          console.log("Токены обновлены:", data);
        }
      } catch (err) {
        console.error("Ошибка обновления токена:", err);
        setTokens({ access_token: null, refresh_token: null });
      }
    }, REFRESH_INTERVAL * 1000);

    return () => clearInterval(interval);
  }, []); // запускаем один раз при монтировании

  return { tokens, setTokens };
}
