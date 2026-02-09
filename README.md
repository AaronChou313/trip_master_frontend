# TripMaster 旅行规划大师 - 前端

## 项目简介

TripMaster 是一个现代化的旅行规划工具，帮助用户轻松规划旅行路线、管理预算、记录备忘事项和探索景点。

## 功能特性

### 🗺️ 地点管理
- 搜索和添加兴趣点（POIs）
- 高德地图集成，直观展示地理位置
- 个人兴趣点收藏和管理

### 📅 行程规划
- 创建和编辑旅行行程
- 拖拽式景点排序
- 详细的交通和预算信息
- 路线可视化展示

### 💰 预算管理
- 分类预算跟踪（行程、交通、住宿、其他）
- 自动从行程同步预算数据
- 可视化图表展示预算分布
- 实时预算统计

### 📝 备忘事项
- Markdown格式支持
- 实时预览功能
- 个人备忘录管理
- 自动保存功能

### 🔐 用户认证
- 完整的用户注册/登录系统
- JWT Token认证
- 数据隐私保护
- 多用户数据隔离

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **路由管理**: Vue Router 4
- **构建工具**: Webpack 5
- **UI组件**: 原生CSS + 现代设计
- **地图服务**: 高德地图API
- **认证机制**: JWT Token
- **状态管理**: Vue响应式系统

## 安装和运行

### 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装依赖
```bash
npm install
```

### 开发环境运行
```bash
npm run dev
```
访问: http://localhost:8080

### 生产环境构建
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 环境配置

项目使用 `.env` 文件进行环境配置：

```env
# API基础URL配置
VUE_APP_API_BASE_URL=http://localhost:3000

# 开发环境配置
NODE_ENV=development
```

## 项目结构

```
src/
├── components/          # 可复用组件
│   ├── Login.vue       # 登录组件
│   ├── Register.vue    # 注册组件
│   └── Notification.vue # 通知组件
├── services/           # 业务服务层
│   ├── authService.js  # 认证服务
│   ├── poiService.js   # 兴趣点服务
│   ├── itineraryService.js # 行程服务
│   ├── budgetService.js # 预算服务
│   └── memoService.js  # 备忘录服务
├── utils/             # 工具函数
│   └── apiClient.js   # API客户端
├── views/             # 页面视图
│   ├── PoisView.vue   # 地点管理页面
│   ├── ItineraryView.vue # 行程规划页面
│   ├── BudgetView.vue # 预算管理页面
│   └── MemosView.vue  # 备忘事项页面
├── router/            # 路由配置
│   └── index.js
├── App.vue            # 根组件
└── main.js            # 入口文件
```

## API接口

后端API文档请参考 `API_DOCUMENTATION.md` 文件。

主要接口包括：
- `/api/auth/*` - 用户认证相关
- `/api/pois` - 兴趣点管理
- `/api/itineraries` - 行程管理
- `/api/budgets` - 预算管理
- `/api/memos` - 备忘录管理
- `/api/amap/*` - 高德地图代理

## 开发指南

### 代码规范
- 使用 Composition API
- 组件命名采用 PascalCase
- 文件命名采用 camelCase
- CSS类名使用 kebab-case

### 最佳实践
- 所有API调用通过服务层处理
- 统一的错误处理和通知机制
- 响应式数据管理
- 组件化开发

## 部署说明

### 生产环境部署
1. 构建项目：`npm run build`
2. 将 `dist` 目录部署到Web服务器
3. 配置反向代理指向后端API

### Docker部署（可选）
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 常见问题

### 地图不显示
- 检查网络连接
- 确认高德地图API密钥配置
- 查看浏览器控制台错误信息

### 登录失败
- 确认后端服务正常运行
- 检查API地址配置
- 验证用户名密码正确性

### 数据无法保存
- 检查用户是否已登录
- 确认JWT token有效
- 查看网络请求状态

## 版本历史

### v2.0.0 (当前版本)
- ✅ 新增用户认证系统
- ✅ 实现多用户数据隔离
- ✅ 升级到PostgreSQL数据库
- ✅ 完善API安全性
- ✅ 优化用户体验

### v1.0.0
- ✅ 基础功能实现
- ✅ 地点搜索和管理
- ✅ 行程规划功能
- ✅ 预算管理模块
- ✅ 备忘录功能

## 贡献指南

欢迎提交Issue和Pull Request！

## 许可证

MIT License