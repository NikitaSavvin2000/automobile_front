const BASE_URL = import.meta.env.VITE_API_URL || "http://0.0.0.0:7079/auth_mobile/api/v1";

const API_ENDPOINTS = {
    auth: {
        login: `${BASE_URL}/auth/login`,
        refresh_token: `${BASE_URL}/auth/refresh`,
        logout: `${BASE_URL}/auth/logout`,
        register: `${BASE_URL}/register/user`,
        reg_code: `${BASE_URL}/register/send_reg_code`,
        change_code: `${BASE_URL}/register/send_change_code`,
        change_password: `${BASE_URL}/register/change_password`,
    },
    cars: {
        create: `${BASE_URL}/cars/create`,
        list: `${BASE_URL}/cars/list`,
        update: (id) => `${BASE_URL}/cars/update/${id}`,
        delete: (id) => `${BASE_URL}/cars/delete/${id}`,
    },
    users: {
        list: `${BASE_URL}/users/`,
        detail: (id) => `${BASE_URL}/users/${id}/`,
    },
    posts: {
        list: `${BASE_URL}/posts/`,
        detail: (id) => `${BASE_URL}/posts/${id}/`,
    },
    cars_records: {
        create: `${BASE_URL}/cars_records/create`,
        update: `${BASE_URL}/cars_records/update`,
        delete: (id) => `${BASE_URL}/cars_records/delete/${id}`,
        delete_image: (carId, imageId) => `${BASE_URL}/cars_records/delete_image/${carId}/${imageId}`,
        list: (carId) => `${BASE_URL}/cars_records/list?car_id=${carId}`,
        info: (car, recordId) => `${BASE_URL}/cars_records/info/${car}/${recordId}?car_id=${car}&car_record_id=${recordId}`,
    }
};

export default API_ENDPOINTS;

