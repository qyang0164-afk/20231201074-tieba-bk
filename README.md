# 校园贴吧系统

一个现代化的校园社区平台，支持帖子发布、评论、点赞、搜索等功能。

## 项目特色

- 🎯 **现代化技术栈**: React + Node.js + MongoDB
- 🔐 **安全认证**: JWT认证机制
- 📱 **响应式设计**: 支持移动端和桌面端
- ⚡ **高性能**: 前后端分离架构
- 🔍 **智能搜索**: 支持关键词搜索
- 💬 **实时互动**: 评论和点赞功能

## 功能特性

### 用户功能
- 用户注册/登录
- 个人信息管理
- 密码修改

### 帖子功能
- 发布新帖子
- 浏览帖子列表
- 帖子详情查看
- 帖子搜索
- 帖子编辑/删除

### 互动功能
- 评论帖子
- 点赞帖子/评论
- 回复评论

## 技术栈

### 前端
- React 18 + TypeScript
- Redux Toolkit (状态管理)
- React Router v6 (路由)
- Ant Design (UI组件)
- Axios (HTTP客户端)
- Vite (构建工具)

### 后端
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (认证)
- bcrypt (密码加密)
- Multer (文件上传)

## 快速开始

### 环境要求
- Node.js >= 16.0.0
- MongoDB >= 4.4
- npm >= 8.0.0

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd campus-tieba
```

2. **安装依赖**
```bash
npm run install:all
```

3. **配置环境变量**
```bash
# 复制后端环境变量文件
cp backend/.env.example backend/.env

# 编辑后端环境变量
# 配置数据库连接、JWT密钥等
```

4. **启动开发服务器**
```bash
npm run dev
```

5. **访问应用**
- 前端: http://localhost:3000
- 后端API: http://localhost:5000

## 项目结构

```
campus-tieba/
├── frontend/          # 前端React应用
│   ├── src/
│   │   ├── components/    # 可复用组件
│   │   ├── pages/         # 页面组件
│   │   ├── store/         # 状态管理
│   │   ├── services/      # API服务
│   │   └── utils/         # 工具函数
│   └── package.json
├── backend/           # 后端Node.js应用
│   ├── src/
│   │   ├── controllers/   # 控制器
│   │   ├── models/        # 数据模型
│   │   ├── routes/        # 路由
│   │   ├── middleware/    # 中间件
│   │   └── config/        # 配置
│   └── package.json
├── docs/              # 项目文档
└── README.md
```

## 开发指南

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

## API文档

详细的API接口文档请参考 [API文档](./docs/api.md)

## 部署

### 生产环境部署

1. **构建项目**
```bash
npm run build
```

2. **启动生产服务器**
```bash
# 启动后端服务
cd backend
npm start
```

3. **配置反向代理** (可选)
使用Nginx配置反向代理，将前端静态文件和后端API分开处理。

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

- 项目主页: [GitHub Repository]
- 问题反馈: [Issues]
- 邮箱: contact@example.com

---

**校园贴吧系统** - 让校园交流更便捷！