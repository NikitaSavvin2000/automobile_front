import { useState, useEffect, useRef } from "react";
import { refreshToken } from "../api/refresh_token";

const REFRESH_INTERVAL = Number(import.meta.env.VITE_REFRESH_INTERVAL) || 7;

export function useAutoRefreshToken() {
  const [tokens, setTokens] = useState<{
    access_token: string | null;
    refresh_token: string | null;
  }>(() => {
    const savedAccessToken = localStorage.getItem("token");
    const savedRefreshToken = localStorage.getItem("refresh_token");
    return {
      access_token: savedAccessToken || null,
      refresh_token: savedRefreshToken || null,
    };
  });

  const tokensRef = useRef(tokens);

  // Сохраняем актуальные токены в ref
  useEffect(() => {
    tokensRef.current = tokens;
  }, [tokens]);

  useEffect(() => {
    const refresh_token = tokensRef.current.refresh_token;
    if (!refresh_token) {
      return;
    }

    const interval = setInterval(async () => {
      const currentRefreshToken = tokensRef.current.refresh_token;
      if (!currentRefreshToken) {
        return;
      }

      try {
        const data = await refreshToken(currentRefreshToken);
        if (data && (data.access_token || data.refresh_token)) {
          setTokens({
            access_token: data.access_token || tokensRef.current.access_token,
            refresh_token: data.refresh_token || tokensRef.current.refresh_token,
          });
          console.log("Токены обновлены успешно");
        } else {
          console.warn("Обновление токена вернуло пустой ответ, сохраняем текущие токены");
        }
      } catch (err: any) {
        console.error("Ошибка обновления токена:", err);
        if (err instanceof Error) {
          const status = (err as any).status;
          if (err.message.includes("Failed to fetch")) {
            console.warn("Сеть недоступна, повторная попытка при следующем обновлении");
          } else if (
            status === 401 ||
            status === 403 ||
            err.message.toLowerCase().includes("invalid") ||
            err.message.toLowerCase().includes("expired") ||
            err.message.toLowerCase().includes("unauthorized")
          ) {
            console.error("Refresh token невалидный или истек, требуется повторный вход");
            setTokens({ access_token: null, refresh_token: null });
          } else {
            console.warn(
              "Ошибка обновления токена (статус:",
              status,
              "), но сохраняем текущие токены:",
              err.message
            );
          }
        }
      }
    }, REFRESH_INTERVAL * 1000);

    return () => clearInterval(interval);
  }, [tokens.refresh_token]);

  return { tokens, setTokens };
}
