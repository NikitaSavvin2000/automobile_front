# API

Директория содержит все API модули для работы с данными.

## Структура

- `config.js` - конфигурация API endpoints
- `auth.ts` - API для авторизации и аутентификации
- `cars.ts` - API для работы с автомобилями
- `records.ts` - API для работы с записями истории
- `refresh_token.ts` - обновление токенов
- `index.ts` - центральная точка экспорта всех API

## Конфигурация

Создайте файл `.env` в корне проекта:

```env
VITE_API_URL=http://0.0.0.0:7079/auth_mobile/api/v1
```

## Использование

### Авторизация

```tsx
import { login, registerUser, sendRegCode } from '../api/auth';

// Вход
const result = await login(email, password);

// Отправка кода регистрации
await sendRegCode(name, email, password);

// Регистрация
const result = await registerUser(email, password, verifyCode);

// Смена пароля
await sendChangePasswordCode(email);
await changePassword(email, newPassword, verifyCode);
```

### Автомобили

```tsx
import { getCars, createCar } from '../api/cars';

// Получить список автомобилей
const cars = await getCars();

// Создать автомобиль
const car = await createCar(brand, model, year, mileage, color);
```

### Токены

```tsx
import { refreshToken } from '../api/refresh_token';

// Обновить токен
const newTokens = await refreshToken(currentRefreshToken);
```

## Endpoints

### Auth
- `POST /auth/login` - вход
- `POST /auth/refresh` - обновление токена
- `POST /register/send_reg_code` - отправка кода регистрации
- `POST /register/user` - регистрация пользователя
- `POST /register/send_change_code` - отправка кода смены пароля
- `POST /register/change_password` - смена пароля

### Cars
- `GET /cars/list` - список автомобилей
- `POST /cars/create` - создание автомобиля
- `PUT /cars/update/{id}` - обновление автомобиля
- `DELETE /cars/delete/{id}` - удаление автомобиля

## Обработка ошибок

Все функции API обрабатывают ошибки и выбрасывают исключения с понятными сообщениями:

```tsx
try {
  const result = await login(email, password);
  if (!result) {
    // Обработка ошибки
  }
} catch (err) {
  console.error(err.message);
}
```

## Хранение токенов

Токены автоматически сохраняются в localStorage:
- `token` - access token
- `refresh_token` - refresh token
- `userEmail` - email пользователя
