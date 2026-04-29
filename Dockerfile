# ============ 构建阶段 ============
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package.json
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# 安装所有依赖（包括 devDependencies，用于构建）
RUN npm install
RUN cd backend && npm install
RUN cd frontend && npm install

# 复制源代码
COPY . .

# 构建前端
WORKDIR /app/frontend
RUN npm run build

# 构建后端
WORKDIR /app/backend
RUN npm run build

# ============ 生产阶段 ============
FROM node:20-alpine

WORKDIR /app/backend

# 复制 package.json（仅生产阶段需要）
COPY backend/package*.json ./

# 仅安装生产依赖
RUN npm install --omit=dev

# 从构建阶段复制编译后的文件
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/frontend/dist ../frontend/dist

# 数据文件
COPY data/ ../data/

EXPOSE 8080

# 启动后端服务
CMD ["npm", "start"]
