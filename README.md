
  # Мобильное приложение для истории

  This is a code bundle for Мобильное приложение для истории. The original project is available at https://www.figma.com/design/pHfX1hGVnEl8NH3UPKSjdI/%D0%9C%D0%BE%D0%B1%D0%B8%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5-%D0%BF%D1%80%D0%B8%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5-%D0%B4%D0%BB%D1%8F-%D0%B8%D1%81%D1%82%D0%BE%D1%80%D0%B8%D0%B8.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.


Вот подробный пошаговый **README** для сборки Node.js мобильного приложения под iOS с установкой на свой iPhone. Я делаю его универсальным для проектов на Capacitor/Cordova.

---
Проблема в том, что **то, что ты видишь через `npm run dev` (Vite dev server), и то, что Capacitor копирует в iOS проект, — это разные вещи**.

* `npm run dev` запускает **сервак для разработки**, файлы остаются в памяти и на диске часто не отражают финальную сборку.
* Capacitor берет **собранные файлы из `dist`** (то, что генерируется командой сборки), а не файлы dev сервера.

---

### Правильный процесс для обновления iOS приложения

1. **Собираем финальную версию веб-приложения**

```bash
npm run build
```

* Эта команда создаёт папку `dist` с готовыми файлами для продакшн.

2. **Копируем файлы в iOS проект**

```bash
rm -rf ios     
npx cap add ios
npx cap copy ios
npx cap sync ios
```

3. **Открываем Xcode**

```bash
npx cap open ios
```

4. **Очистка старой сборки в Xcode**

* В Xcode: `Product → Clean Build Folder` (Shift + Cmd + K)

5. **Собираем и запускаем на устройстве**

* Выбираем iPhone → `Product → Run` (Cmd + R)

---
