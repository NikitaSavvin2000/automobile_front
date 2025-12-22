import API from "./config";

export async function createCar(brand, model, year, mileage, color) {
    try {
        const token = localStorage.getItem("token");

        console.log("Создание автомобиля", { brand, model, year, mileage, color });

        const res = await fetch(API.cars.create, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                brand,
                model,
                year,
                mileage,
                color,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("Ошибка создания автомобиля", data);
            throw new Error(data.detail || "Ошибка при создании автомобиля");
        }

        console.log("Автомобиль успешно создан", data);

        return data;
    } catch (error) {
        console.error("Исключение при создании автомобиля", error);
        alert(error.message);
        return null;
    }
}

export async function getCars() {
    try {
        const token = localStorage.getItem("token");

        console.log("Запрос списка автомобилей");

        const res = await fetch(API.cars.list, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("Ошибка получения списка автомобилей", data);
            throw new Error(data.detail || "Ошибка при получении автомобилей");
        }

        console.log("Список автомобилей получен", data);

        return data.cars;
    } catch (error) {
        console.error("Исключение при получении автомобилей", error);
        alert(error.message);
        return null;
    }
}

export async function updateCar(id, brand, model, year, mileage, color) {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(API.cars.update(id), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                brand,
                model,
                year,
                mileage,
                color,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.detail || "Ошибка при обновлении автомобиля");
        }

        return data;
    } catch (error) {
        alert(error.message);
        return null;
    }
}

export async function deleteCar(id) {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(API.cars.delete(id), {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                accept: "application/json",
            },
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.detail || "Ошибка при удалении автомобиля");
        }

        return data;
    } catch (error) {
        alert(error.message);
        return null;
    }
}
