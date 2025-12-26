import { useEffect, useState } from "react";
import { checkVersion } from "../../api/version";

const REFRESH_INTERVAL = Number(import.meta.env.VITE_CHECK_REFRESH_VERSION || 300) * 1000;

export function useVersionCheck(version: string) {
  const [result, setResult] = useState<any>(null);

  const fetchVersion = async () => {
    try {
      const res = await checkVersion(version);
      console.log(res);
      if (res && res.is_actual === false) {
        setResult(res);

      } else {
        setResult(null);
      }
    } catch {
      setResult(null);
    }
  };

  useEffect(() => {
    fetchVersion(); // проверка при старте
    const interval = setInterval(fetchVersion, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [version]);

  return result;
}
