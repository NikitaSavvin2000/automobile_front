import API from "./config";

export async function refreshToken(refreshToken: string) {
  try {
    const res = await fetch(API.auth.refresh_token, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMessage =
        data.detail || data.message || `HTTP ${res.status}: Ошибка при обновлении токена`;
      const error = new Error(errorMessage);
      (error as any).status = res.status;
      throw error;
    }

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
    }

    if (data.refresh_token) {
      localStorage.setItem("refresh_token", data.refresh_token);
    }

    return data;
  } catch (error: any) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      const networkError = new Error("Failed to fetch");
      throw networkError;
    }
    console.error("Ошибка обновления токена:", error);
    throw error;
  }
}
