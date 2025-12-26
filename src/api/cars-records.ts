// @ts-ignore
import API from "./config";

export async function createCarRecord({
    car_id,
    record_type,
    mileage,
    name,
    cost,
    files, // массив File объектов
    record_date,
    description,
    service_place
}) {
    try {
        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("car_id", car_id);
        formData.append("record_type", record_type);
        formData.append("mileage", mileage);
        formData.append("name", name);
        formData.append("cost", cost);
        formData.append("record_date", record_date);
        formData.append("description", description);
        formData.append("service_place", service_place);

        if (files && files.length) {
            files.forEach((file) => {
                formData.append("files", file);
            });
        }

        const res = await fetch(API.cars_records.create, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("Ошибка создания записи автомобиля", data);
            throw new Error(data.detail || "Ошибка при создании записи автомобиля");
        }

        console.log("Запись автомобиля успешно создана", data);
        return data;
    } catch (error) {
        console.error("Исключение при создании записи автомобиля", error);
        alert(error.message);
        return null;
    }
}

export async function deleteCarRecord(id) {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(API.cars_records.delete(id), {
            method: "DELETE",
            headers: {
                "accept": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("Ошибка удаления записи автомобиля", data);
            throw new Error(data.detail || "Ошибка при удалении записи автомобиля");
        }

        console.log("Запись автомобиля успешно удалена", data);
        return data;
    } catch (error) {
        console.error("Исключение при удалении записи автомобиля", error);
        alert(error.message);
        return null;
    }
}

export async function updateCarRecord({
    car_id,
    record_type,
    mileage,
    name,
    cost,
    files, // массив File объектов
    record_date,
    description,
    service_place,
    car_record_id
}) {
    try {
        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("car_id", car_id);
        formData.append("record_type", record_type);
        formData.append("mileage", mileage);
        formData.append("name", name);
        formData.append("cost", cost);
        formData.append("record_date", record_date);
        formData.append("description", description);
        formData.append("service_place", service_place);
        formData.append("car_record_id", car_record_id);

        if (files && files.length) {
            files.forEach((file) => {
                formData.append("files", file);
            });
        }

        const res = await fetch(API.cars_records.update, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("Ошибка обновления записи автомобиля", data);
            throw new Error(data.detail || "Ошибка при обновлении записи автомобиля");
        }

        console.log("Запись автомобиля успешно обновлена", data);
        return data;
    } catch (error) {
        console.error("Исключение при обновлении записи автомобиля", error);
        alert(error.message);
        return null;
    }
}

export async function deleteCarRecordImage(carId, imageId) {
    try {
        const token = localStorage.getItem("token");

        console.log('🗑️ Удаление изображения:', { carId, imageId });

        const res = await fetch(API.cars_records.delete_image(carId, imageId), {
            method: "DELETE",
            headers: {
                "accept": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("Ошибка удаления изображения записи автомобиля", data);
            throw new Error(data.detail || "Ошибка при удалении изображения");
        }

        console.log("✅ Изображение записи автомобиля успешно удалено", data);
        return data;
    } catch (error) {
        console.error("Исключение при удалении изображения записи автомобиля", error);
        alert(error.message);
        return null;
    }
}

export async function listCarRecords(carId) {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(API.cars_records.list(carId), {
            method: "GET",
            headers: {
                "accept": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("Ошибка получения списка записей автомобиля", data);
            throw new Error(data.detail || "Ошибка при получении списка записей");
        }

        console.log("📡 API - Список записей автомобиля получен:", data);
        console.log("📡 API - Первая запись (если есть):", data[0]);
        return data;
    } catch (error) {
        console.error("Исключение при получении списка записей автомобиля", error);
        alert(error.message);
        return null;
    }
}

export async function getCarRecordInfo(car, recordId) {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(API.cars_records.info(car, recordId), {
            method: "GET",
            headers: {
                "accept": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("Ошибка получения информации о записи автомобиля", data);
            throw new Error(data.detail || "Ошибка при получении информации о записи");
        }

        console.log("Информация о записи автомобиля получена", data);
        return data;
    } catch (error) {
        console.error("Исключение при получении информации о записи автомобиля", error);
        alert(error.message);
        return null;
    }
}