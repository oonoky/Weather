# Используем node:latest как базовый образ
FROM node:latest

# Устанавливаем рабочую директорию в /app
WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копируем все файлы в текущую директорию в образ
COPY . .

# Открываем порт 4000
EXPOSE 4000

# Команда для запуска сервера
CMD ["node", "app.js"]