import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// 导入路由
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import userRoutes from './routes/users.js';

// 导入中间件
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';

// 加载环境变量
dotenv.config();

const app = express();

// 安全中间件
app.use(helmet());
app.use(compression());

// CORS配置
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// 速率限制
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15分钟
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // 限制每个IP每15分钟最多100个请求
  message: {
    error: '请求过于频繁，请稍后再试'
  }
});
app.use(limiter);

// 日志中间件
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 解析请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/uploads', express.static('uploads'));

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: '校园贴吧系统 API',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// 404处理
app.use(notFound);

// 错误处理中间件
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 服务器运行在端口 ${PORT}`);
  console.log(`📊 环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 前端地址: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

export default app;