# Vercel 部署指南

## 紧急故障排除

### 如果部署后页面仍然空白：

1. **立即访问诊断页面**：
   直接在浏览器中访问：`https://your-deployed-url.vercel.app/#/deploy-check`

2. **检查控制台错误**：
   - 按 F12 打开开发者工具
   - 查看 Console 面板的错误信息
   - 检查 Network 面板的请求状态

## 多环境配置说明

本项目支持三种环境配置：

### 1. 本地开发环境 (.env.development)
```bash
npm run dev
# 或
npm run build:dev
```

### 2. 生产环境 (.env.production)
```bash
npm run build
# 或
npm run build:prod
```

### 3. Vercel 部署环境
通过 Vercel Dashboard 配置环境变量

## 环境变量文件说明

### .env (默认配置)
包含所有环境的基础配置，作为 fallback 使用。

### .env.development (开发环境)
```
VUE_APP_API_BASE_URL=https://tripmasterbackend-production-78ff.up.railway.app
VUE_APP_AMAP_KEY=e953f2ed40d6ba23010ade13fe41d628
NODE_ENV=development
```

### .env.production (生产环境)
```
VUE_APP_API_BASE_URL=https://tripmasterbackend-production-78ff.up.railway.app
VUE_APP_AMAP_KEY=e953f2ed40d6ba23010ade13fe41d628
NODE_ENV=production
```

## 本地开发测试

### 1. 环境变量验证
在开发过程中，可以使用 EnvChecker 组件来验证环境变量配置：

```javascript
// 在需要的页面中引入
import EnvChecker from '@/components/EnvChecker.vue';

// 在模板中使用
<EnvChecker />
```

### 2. 构建测试
```bash
# 测试开发环境构建
npm run build:dev

# 测试生产环境构建
npm run build:prod

# 查看构建输出
ls dist/
```

## Vercel 部署配置

### 必需的环境变量
在 Vercel Dashboard → Settings → Environment Variables 中添加：

```
VUE_APP_API_BASE_URL=https://tripmasterbackend-production-78ff.up.railway.app
VUE_APP_AMAP_KEY=e953f2ed40d6ba23010ade13fe41d628
NODE_ENV=production
```

### 部署步骤

#### 方式一：Vercel CLI
```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 首次部署
vercel

# 生产环境部署
vercel --prod
```

#### 方式二：GitHub 集成
1. 推送代码到 GitHub
2. 在 Vercel Dashboard 创建项目
3. 选择 GitHub 仓库
4. 配置环境变量
5. 部署

## 故障排除

### 1. 环境变量未生效
- 检查环境变量名称是否正确（必须以 `VUE_APP_` 开头）
- 确认在正确的环境中配置了变量
- Vercel 部署后需要重新部署才能生效

### 2. 页面空白问题
使用诊断页面检查：
- 访问 `#/deploy-check` 查看详细状态
- 环境变量是否正确加载
- API 连接是否正常
- 控制台是否有错误信息

### 3. API 请求失败
- 验证 `VUE_APP_API_BASE_URL` 是否正确
- 检查后端服务是否在线
- 确认 CORS 配置

### 4. 地图功能异常
- 验证高德地图 API Key 是否有效
- 检查 Key 是否启用了相应的服务
- 确认域名白名单配置

## 调试工具

### DeployCheck 诊断页面
访问 `#/deploy-check` 可以获得：
- 应用基本信息
- 环境变量状态检查
- API 连接测试
- 通知系统测试
- 快速导航到各功能模块

### EnvChecker 组件功能
- 显示当前环境变量状态
- 测试 API 连接
- 实时刷新环境信息
- 提供详细的错误诊断

### 浏览器开发者工具
```javascript
// 在控制台中查看环境变量
console.log('API Base URL:', process.env.VUE_APP_API_BASE_URL);
console.log('AMAP Key:', process.env.VUE_APP_AMAP_KEY);
console.log('Node Env:', process.env.NODE_ENV);

// 查看全局配置
console.log('App Config:', window.APP_CONFIG);
```

## 最佳实践

1. **环境隔离**：不同环境使用不同的 API 地址和密钥
2. **安全配置**：敏感信息只在部署平台配置，不在代码中硬编码
3. **定期验证**：部署后及时验证各项功能是否正常
4. **监控日志**：关注控制台错误和网络请求状态

## 注意事项

- `.env` 文件不会被提交到版本控制系统
- Vercel 环境变量优先级高于本地 `.env` 文件
- 构建后环境变量会被内联到 JavaScript bundle 中
- 修改环境变量后需要重新部署才能生效