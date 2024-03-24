# Utiliza la imagen oficial de Node.js 16 como base
FROM node:16-slim

# Configura el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo 'package.json' y 'package-lock.json' (si está disponible)
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia los archivos y directorios restantes al directorio de trabajo actual
COPY . .

# Expone el puerto en el que tu aplicación se ejecutará
EXPOSE 3009

# Comando para ejecutar tu aplicación
CMD ["node", "server.js"]
