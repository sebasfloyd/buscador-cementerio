# Usar una imagen de Node.js como base
FROM node:16

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de configuración de la aplicación y instalar dependencias
COPY package.json package-lock.json ./
RUN npm install

# Copiar el resto del código fuente
COPY . .
