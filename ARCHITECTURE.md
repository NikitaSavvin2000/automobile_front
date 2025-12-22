# Архитектура приложения

## Структура проекта

```
src/
├── api/                    # API слой
│   ├── auth.ts            # API авторизации
│   ├── cars.ts            # API автомобилей
│   ├── records.ts         # API записей истории
│   ├── index.ts           # Центральный экспорт
│   └── README.md          # Документация API
│
├── app/
│   ├── components/        # React компоненты
│   │   ├── auth-page.tsx
│   │   ├── bottom-nav.tsx
│   │   ├── car-selector.tsx
│   │   └── ...
│   │
│   ├── context/           # React контексты
│   │   └── theme-context.tsx
│   │
│   ├── hooks/             # Кастомные React хуки
│   │   ├── use-auth.ts
│   │   ├── use-cars.ts
│   │   ├── use-records.ts
│   │   ├── use-scroll.ts
│   │   ├── index.ts
│   │   └── README.md
│   │
│   ├── pages/             # Страницы приложения
│   │   ├── auth-page-wrapper.tsx
│   │   ├── history-page.tsx
│   │   ├── main-page.tsx
│   │   ├── index.ts
│   │   └── README.md
│   │
│   └── App.tsx            # Главный компонент (минимум кода)
│
├── styles/                # Глобальные стили
│   ├── fonts.css
│   └── theme.css
│
└── utils/                 # Утилиты
    └── token-refresher.ts

```

## Слои приложения

### 1. API Layer (`/src/api`)
Отвечает за взаимодействие с бэкендом. Содержит:
- Интерфейсы для запросов/ответов
- Функции для работы с API
- Mock данные для разработки

**Принцип**: Вся логика работы с данными изолирована в этом слое.

### 2. Hooks Layer (`/src/app/hooks`)
Содержит бизнес-логику приложения в виде кастомных хуков:
- `use-auth` - управление авторизацией
- `use-cars` - управление автомобилями
- `use-records` - управление записями
- `use-scroll` - отслеживание скролла

**Принцип**: Каждый хук инкапсулирует определенную бизнес-логику.

### 3. Pages Layer (`/src/app/pages`)
Страницы приложения, которые комбинируют компоненты и хуки:
- `auth-page-wrapper` - страница авторизации
- `main-page` - главная страница
- `history-page` - страница истории

**Принцип**: Страницы - это композиция компонентов и бизнес-логики.

### 4. Components Layer (`/src/app/components`)
Переиспользуемые UI компоненты:
- Диалоги
- Формы
- Карточки
- Навигация

**Принцип**: Компоненты максимально независимы и переиспользуемы.

### 5. App Layer (`/src/app/App.tsx`)
Точка входа приложения - минимальный код, только композиция:
```tsx
export default function App() {
  const auth = useAuth();
  const cars = useCars();
  const records = useRecords();

  return (
    <ThemeProvider>
      {!auth.isAuthenticated ? (
        <AuthPageWrapper {...auth} />
      ) : (
        <MainPage {...auth} {...cars} {...records} />
      )}
    </ThemeProvider>
  );
}
```

## Принципы

1. **Separation of Concerns** - каждый слой отвечает за свою область
2. **Single Responsibility** - каждый модуль делает одну вещь
3. **DRY** - код не дублируется
4. **Easy to Test** - каждый слой можно тестировать изолированно
5. **Scalability** - легко добавлять новые функции

## Поток данных

```
API Layer
   ↓
Hooks Layer (бизнес-логика)
   ↓
Pages Layer (композиция)
   ↓
Components Layer (UI)
```

## Добавление новой функциональности

1. Создайте API функции в `/src/api`
2. Создайте хук для бизнес-логики в `/src/app/hooks`
3. Создайте/обновите страницу в `/src/app/pages`
4. Создайте/переиспользуйте компоненты из `/src/app/components`
5. Обновите `App.tsx` если нужна новая страница

## Преимущества текущей архитектуры

- ✅ Легко найти нужный код
- ✅ Минимум кода в App.tsx
- ✅ Легко тестировать
- ✅ Легко масштабировать
- ✅ Переиспользуемые компоненты
- ✅ Изолированная бизнес-логика
- ✅ Готово к миграции на реальный API
