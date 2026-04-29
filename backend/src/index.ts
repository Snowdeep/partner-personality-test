import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { testRouter } from './routes/test.js';

const app: Express = express();
const PORT = process.env.PORT || 8888;

// 中间件
app.use(cors());
app.use(express.json());

// 日志中间件
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// 路由
app.use('/api/test', testRouter);

// 健康检查
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 根路由
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'Partner Personality Test API',
    version: '1.0.0',
    endpoints: [
      'POST /api/test/submit - 提交答题',
      'GET /api/test/labels - 获取所有标签',
      'GET /health - 健康检查',
    ],
  });
});

// 错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: err.message || 'Internal Server Error',
  });
});

// 404 处理
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
  });
});

app.listen(PORT, () => {
  console.log(`✨ Server running on http://localhost:${PORT}`);
});
