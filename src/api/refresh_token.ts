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
            throw new Error(data.detail || "Ошибка при обновлении токена");
        }

        if (data.access_token) {
            localStorage.setItem("token", data.access_token);
        }

        if (data.refresh_token) {
            localStorage.setItem("refresh_token", data.refresh_token);
        }

        return data;
    } catch (error: any) {
        alert(error.message);
        return null;
    }
}
