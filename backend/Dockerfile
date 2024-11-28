# Bước 1: Sử dụng image Node.js làm base image
FROM node:20-alpine

# Bước 2: Đặt thư mục làm việc trong container
WORKDIR /app

# Bước 3: Copy chỉ package.json và package-lock.json vào container trước
COPY backend/package*.json ./

# Bước 4: Cài đặt các phụ thuộc của dự án
RUN npm ci --production

# Bước 5: Copy toàn bộ mã nguồn vào container
COPY backend/ ./

# Expose port 5000 để có thể truy cập được từ ngoài
EXPOSE 5000

# Bước 6: Chạy ứng dụng backend
CMD ["npm", "start"]