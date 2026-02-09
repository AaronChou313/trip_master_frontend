# Vercel 部署指南

## 部署准备

### 1. 项目配置已完成
- ✅ 已添加 `vercel.json` 配置文件
- ✅ 已更新 `package.json` 构建脚本
- ✅ Webpack 配置支持生产环境构建

### 2. 环境变量设置
在 Vercel 项目设置中需要配置以下环境变量：

```
VUE_APP_API_BASE_URL=https://your-backend-api-url.com
VUE_APP_AMAP_KEY=your_amap_api_key
NODE_ENV=production
```

## 部署方式

### 方式一：通过 Vercel CLI（推荐）

1. 安装 Vercel CLI：
```bash
npm install -g vercel
```

2. 登录 Vercel：
```bash
vercel login
```

3. 部署项目：
```bash
vercel
```

4. 后续部署：
```bash
vercel --prod
```

### 方式二：通过 GitHub 集成

1. 将代码推送到 GitHub 仓库
2. 在 [Vercel Dashboard](https://vercel.com/dashboard) 创建新项目
3. 选择对应的 GitHub 仓库
4. Vercel 会自动检测并配置构建设置
5. 添加环境变量
6. 点击部署

### 方式三：手动上传

1. 构建项目：
```bash
npm run build
```

2. 将 `dist` 目录内容上传到 Vercel

## 重要注意事项

### 1. API 代理配置
由于这是 SPA 应用，API 请求需要直接指向后端服务，而不是通过代理。

### 2. 路由配置
已配置 `historyApiFallback`，支持 Vue Router 的 History 模式。

### 3. 环境变量
- 确保 `VUE_APP_API_BASE_URL` 指向正确的后端 API 地址
- 高德地图 API Key 需要是有效的生产环境密钥

### 4. 域名配置
部署后可以在 Vercel 控制台配置自定义域名。

## 常见问题

### Q: 部署后页面空白？
A: 检查浏览器控制台错误，确认环境变量是否正确设置。

### Q: API 请求失败？
A: 确认 `VUE_APP_API_BASE_URL` 环境变量指向正确的后端地址。

### Q: 地图无法显示？
A: 检查高德地图 API Key 是否有效且已启用相应服务。

## 后续维护

- 每次代码更新后重新部署
- 定期检查环境变量是否过期
- 监控 Vercel 提供的性能指标