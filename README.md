# 伴侣人格测试小程序

一个帮助用户了解伴侣（或暗恋对象）人格特质的趣味测试小程序。通过30道精心设计的题目，分析用户对伴侣的认知，得出16种人格标签之一。

## 🚀 快速开始

### 本地开发

```bash
# 安装所有依赖
npm run install-all

# 同时启动前后端
npm run dev

# 或分别启动
cd frontend && npm run dev    # 前端: http://localhost:5176
cd backend && npm run dev     # 后端: http://localhost:7654
```

### 部署到公网

#### 方案 A：Railway + Vercel（推荐）

**后端部署 (Railway)**:
1. 在 https://railway.app 创建新项目
2. 连接 GitHub 仓库
3. Railway 自动构建并部署
4. 获得公网 URL

**前端部署 (Vercel)**:
1. 在 https://vercel.com 创建新项目
2. 配置 Root Directory: `frontend`
3. 添加环境变量：VITE_API_URL=<Railway URL>
4. 部署

#### 方案 B：Docker 一体化部署

```bash
docker build -t partner-test .
docker run -p 7654:7654 partner-test
```

---

## 🎯 功能特性

- ✅ 30 道精心设计的题目
- ✅ 16 种独特人格标签
- ✅ 加权计分算法
- ✅ 响应式设计
- ✅ 分享功能
- ✅ RESTful API

---

## 📁 项目结构

```
frontend/      # Vue 3 + Vite 前端
backend/       # Express.js 后端
data/          # 题库数据
```

---

## 🔌 API 端点

- `GET /api/test/questions/:gender` - 获取题目
- `POST /api/test/submit` - 提交答题结果
- `GET /api/test/labels` - 获取所有标签
- `GET /api/test/label/:id` - 获取标签详情

---

## 🛠 技术栈

- **前端**: Vue 3 + Vite + TypeScript
- **后端**: Node.js + Express + TypeScript
- **部署**: Docker + Railway/Vercel

---

## 📄 许可

MIT License
