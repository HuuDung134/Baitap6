# Stage 1: Build
FROM node:20-alpine AS build-stage
WORKDIR /app

# Nhận biến từ docker-compose
ARG VITE_API_BASE_URL
ARG VITE_SOCKET_URL

# Truyền biến vào môi trường build của Vite
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve với Nginx
FROM nginx:stable-alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]