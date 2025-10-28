# 校园贴吧系统 - 安装指南

## 环境要求

- Node.js >= 16.0.0
- MongoDB >= 4.4
- npm >= 8.0.0

## 安装步骤

### 1. 安装项目依赖

```bash
# 安装根目录依赖
npm install

# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install

# 返回根目录
cd ..
```

或者使用快捷命令：
```bash
npm run install:all
```

### 2. 配置环境变量

1. 复制后端环境变量文件：
```bash
cp backend/.env.example backend/.env
```

2. 编辑 `backend/.env` 文件，配置以下参数：
```env
# 服务器配置
PORT=5000
NODE_ENV=development

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/campus_tieba

# JWT配置
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# 文件上传配置
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# CORS配置
FRONTEND_URL=http://localhost:3000

# 速率限制
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

### 3. 启动MongoDB服务

确保MongoDB服务正在运行：
```bash
# Windows (使用管理员权限)
net start MongoDB

# macOS
brew services start mongodb-community

# Linux (Ubuntu/Debian)
sudo systemctl start mongod
```

### 4. 启动应用

#### 开发模式（推荐）
```bash
# 同时启动前端和后端开发服务器
npm run dev
```

#### 分别启动
```bash
# 启动后端服务
npm run dev:backend

# 在新的终端窗口中启动前端服务
npm run dev:frontend
```

### 5. 访问应用

- 前端应用: http://localhost:3000
- 后端API: http://localhost:5000

## 项目结构说明

```
campus-tieba/
├── frontend/                 # 前端React应用
│   ├── src/
│   │   ├── components/       # 可复用组件
│   │   ├── pages/           # 页面组件
│   │   ├── store/           # 状态管理
│   │   ├── services/        # API服务
│   │   └── utils/           # 工具函数
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # 后端Node.js应用
│   ├── src/
│   │   ├── controllers/     # 控制器
│   │   ├── models/          # 数据模型
│   │   ├── routes/          # 路由
│   │   ├── middleware/       # 中间件
│   │   └── config/          # 配置
│   ├── package.json
│   └── .env.example
├── docs/                     # 项目文档
├── package.json             # 根目录配置
└── README.md               # 项目说明
```

## 开发命令

### 前端开发
```bash
cd frontend
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run test         # 运行测试
```

### 后端开发
```bash
cd backend
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run test         # 运行测试
```

## 常见问题

### 1. 端口被占用
如果3000或5000端口被占用，可以修改配置文件中的端口号：
- 前端端口：修改 `frontend/vite.config.ts` 中的 `server.port`
- 后端端口：修改 `backend/.env` 中的 `PORT`

### 2. MongoDB连接失败
确保MongoDB服务正在运行，并检查连接字符串是否正确。

### 3. 依赖安装失败
尝试清除缓存后重新安装：
```bash
npm cache clean --force
npm run install:all
```

### 4. 前端无法访问后端API
检查CORS配置，确保 `FRONTEND_URL` 正确指向前端地址。

## 生产环境部署

### 构建项目
```bash
npm run build
```

### 启动生产服务器
```bash
# 启动后端服务
cd backend
npm start
```

### 配置反向代理
使用Nginx配置反向代理，将前端静态文件和后端API分开处理。

---

如有其他问题，请查看项目文档或提交Issue。