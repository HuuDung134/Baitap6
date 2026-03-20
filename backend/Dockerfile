FROM node:20-alpine
# Nhảy vào thư mục backend bên trong container
WORKDIR /app
# Copy file từ thư mục backend của máy bạn vào /app của container
COPY package*.json ./
RUN npm install
COPY . .
# Lệnh chạy bây giờ sẽ tìm thấy server.js ngay tại /app/server.js của container
CMD ["node", "src/server.js"]