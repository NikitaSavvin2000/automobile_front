# Hooks

Директория содержит все кастомные React хуки приложения.

## Структура

- `use-auth.ts` - хук для управления авторизацией пользователя
- `use-cars.ts` - хук для управления автомобилями
- `use-records.ts` - хук для управления записями истории
- `use-scroll.ts` - хук для отслеживания скролла
- `index.ts` - центральная точка экспорта всех хуков

## Использование

```tsx
import { useAuth, useCars, useRecords, useScroll } from './hooks';

// В компоненте
const { isAuthenticated, handleLogin, handleLogout } = useAuth();
const { cars, selectedCar, handleAddCar } = useCars();
const { records, handleAddRecord } = useRecords();
const { isScrolled, scrollContainerRef } = useScroll();
```
