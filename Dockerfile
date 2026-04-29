FROM node:20-alpine

WORKDIR /app

# 复制 package.json
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# 安装依赖
RUN npm install --omit=dev
RUN cd backend && npm install --omit=dev
RUN cd frontend && npm install --omit=dev

# 构建前端
WORKDIR /app/frontend
RUN npm run build

# 设置后端工作目录
WORKDIR /app/backend

# 构建后端
RUN npm run build

EXPOSE 7654

# 启动后端服务
CMD ["npm", "start"]
