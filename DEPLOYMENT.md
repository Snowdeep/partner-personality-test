# 部署指南

## 三种部署方案

### 方案 A：最简单 - Railway 一键部署（推荐）

Railway 支持直接从 GitHub 仓库部署，自动检测 Node.js 应用。

#### 步骤：

1. **注册 Railway**
   - 访问 https://railway.app
   - 用 GitHub 账号注册登录

2. **创建项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 授权 Railway 访问你的 GitHub

3. **选择仓库**
   - 找到 `partner-personality-test` 仓库
   - 点击连接

4. **配置**
   - **Root Directory**: `backend` （因为后端是主应用）
   - **Environment**: 保持默认
   - 点击 "Deploy"

5. **获取 URL**
   - Railway 会自动构建和部署
   - 在 "Deployments" 中获得公网 URL
   - 示例：`https://partner-test-production.up.railway.app`

6. **分享链接**
   - 部署完成！
   - 直接分享 URL 给别人
   - 前端和后端都在同一个 URL 下

---

### 方案 B：分离部署 - Railway (后端) + Vercel (前端)

这个方案的优点是前后端分离，可以独立扩展。

#### 步骤 1：部署后端到 Railway

1. 在 Railway 创建新项目（同方案 A）
2. **Root Directory**: `backend`
3. 部署完成后，获得 URL：`https://partner-api.up.railway.app`

#### 步骤 2：部署前端到 Vercel

1. **注册 Vercel**
   - 访问 https://vercel.com
   - 用 GitHub 账号注册登录

2. **创建项目**
   - 点击 "New Project"
   - "Import Git Repository"
   - 选择 `partner-personality-test`

3. **配置构建**
   - **Framework**: Vue
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **环境变量**
   - 添加环境变量：
     ```
     VITE_API_URL=https://partner-api.up.railway.app
     ```
   - 替换为实际的 Railway URL

5. **部署**
   - 点击 "Deploy"
   - Vercel 会自动构建并部署
   - 获得 URL：`https://partner-test.vercel.app`

6. **分享**
   - 分享 Vercel 的 URL 给别人

---

### 方案 C：Docker 容器化部署

适合需要完全控制的场景。

#### 本地测试 Docker

```bash
# 构建镜像
docker build -t partner-test .

# 运行容器
docker run -p 7654:7654 partner-test

# 访问 http://localhost:7654
```

#### 部署到云平台

**部署到 Railway**:
1. 在 Railway 中连接 GitHub 仓库
2. Railway 自动检测到 Dockerfile
3. 自动构建和部署 Docker 镜像

**部署到其他平台**:
- Render: https://render.com
- Heroku: https://heroku.com (需要 Procfile)
- AWS: https://aws.amazon.com
- 阿里云: https://aliyun.com

---

## 🎯 推荐方案总结

| 需求 | 推荐方案 | 优点 |
|------|--------|------|
| 最快速 | Railway 一体化 | 一键部署，无需配置 |
| 独立扩展 | Railway + Vercel | 前后端各自优化 |
| 完全控制 | Docker | 完全自定义 |

---

## ⚙️ 环境变量配置

### 前端 (frontend/.env.production)
```
VITE_API_URL=https://your-backend-url.com
```

### 后端 (backend/.env)
```
PORT=7654
NODE_ENV=production
```

---

## 🔗 部署检查清单

- [ ] 代码已提交到 GitHub
- [ ] README.md 已更新
- [ ] 环境变量已配置
- [ ] 前端构建成功 (`npm run build`)
- [ ] 后端可以启动 (`npm start`)
- [ ] CORS 已启用（已在代码中配置）
- [ ] API 端点正确响应
- [ ] 分享链接可以在浏览器中打开
- [ ] 跨域请求正常工作

---

## 🚨 常见问题

### Q: 部署后打不开页面？
A: 检查：
1. 部署是否成功（查看平台的 Logs）
2. 环境变量是否正确设置
3. 后端 API 是否可访问

### Q: 前端打开了但无法提交答题？
A: 检查：
1. 后端是否在线（访问 /health 端点）
2. VITE_API_URL 是否正确
3. 浏览器控制台是否有 CORS 错误

### Q: 如何查看部署日志？
A: 
- Railway: Dashboard → Logs
- Vercel: Deployment → Logs
- Docker: `docker logs <container_id>`

---

## 📞 部署支持

如果遇到问题，可以：
1. 查看平台的官方文档
2. 检查环境变量和配置
3. 查看部署日志找错误信息
