import API from "./config";

export async function checkVersion(version) {
    try {
        const res = await fetch(API.version.check, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                version
            })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.detail || "Ошибка проверки версии");
        }

        return data;
    } catch (error) {
        alert(error.message);
        return null;
    }
}
