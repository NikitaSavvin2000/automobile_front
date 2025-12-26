// @ts-ignore
import API from "./config";
export async function login(email, password) {
    try {
        const res = await fetch(API.auth.login, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.detail || "Ошибка при входе");
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

export async function register(email, password, name) {
    try {
        const res = await fetch(API.auth.register, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name }),
        });

        const data = await res.json(); // читаем один раз

        if (!res.ok) {
            throw new Error(data.detail || "Ошибка при регистрации");
        }

        if (data.access_token) {
            localStorage.setItem("token", data.access_token);
        }

        return data;
    } catch (error: any) {
        alert(error.message);
        return null;
    }
}

export const sendRegCode = async (name: string, email: string, password: string) => {
  try {
    const res = await fetch(API.auth.reg_code, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json(); // читаем тело ответа

    if (!res.ok) {
      // если бэкенд вернул ошибку, пробрасываем её в компонент
      throw new Error(data.message || data.detail || "Ошибка при отправке кода");
    }

    return data; // возвращаем данные, если все ок
  } catch (err: any) {
    console.error(err);
    throw err; // дальше ловим в компоненте
  }
};


export const registerUser = async (email: string, password: string, verify_code: number) => {
  try {
    const res = await fetch(API.auth.register, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, verify_code }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || data.detail || "Ошибка при регистрации");
    }

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
    }
    
    if (data.refresh_token) {
      localStorage.setItem("refresh_token", data.refresh_token);
    }

    return data;
  } catch (err: any) {
    console.error(err);
    throw err;
  }
};


export const sendChangePasswordCode = async (email: string) => {
  const res = await fetch(API.auth.change_code, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.detail || "Ошибка при отправке кода");
  }

  return data;
};


export const changePassword = async (
  email: string,
  password: string,
  verify_code: number
) => {
  const res = await fetch(API.auth.change_password, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      verify_code
    })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.detail || "Ошибка изменения пароля");
  }

  return data;
};

export const authApi = {
  login: async (email: string, password: string) => {
    return await login(email, password);
  },

  register: async (email: string, password: string, name: string) => {
    return await registerUser(email, password, Number(name));
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userEmail');
  },
};