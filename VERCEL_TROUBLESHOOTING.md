# Vercel 部署故障排除指南

## 🚨 常见问题诊断

### 1. 页面完全空白
**症状**: 部署后访问页面显示空白，没有任何内容

**诊断步骤**:
1. 按 F12 打开开发者工具
2. 查看 Console 面板是否有错误信息
3. 检查 Network 面板中 JS/CSS 文件是否加载成功
4. 访问 `#/deploy-check` 诊断页面

**常见原因及解决方案**:

#### A. JavaScript 加载失败 ("Unexpected token '<'")
- **原因**: 静态资源路径配置错误
- **解决方案**: 
  - 检查 `webpack.config.js` 中的 `publicPath` 设置
  - 确保设置为 `publicPath: ''` (空字符串)
  - 重新构建并部署

#### B. 环境变量未正确加载
- **原因**: Vercel 环境变量配置错误
- **解决方案**:
  - 在 Vercel Dashboard → Settings → Environment Variables 中检查配置
  - 确保变量名为 `VUE_APP_API_BASE_URL` 和 `VUE_APP_AMAP_KEY`
  - 重新部署使配置生效

#### C. 构建失败但显示成功
- **原因**: 构建过程中出现警告被忽略
- **解决方案**:
  - 在 Vercel Logs 中查看详细构建日志
  - 确保所有依赖正确安装
  - 检查是否有 TypeScript 或 ESLint 错误

### 2. 地图功能不工作
**症状**: 地图区域显示空白或加载失败

**诊断步骤**:
1. 检查控制台是否有高德地图相关的错误
2. 验证 `VUE_APP_AMAP_KEY` 是否正确配置
3. 确认高德地图 API Key 是否在对应域名下启用

### 3. API 请求失败
**症状**: 数据无法加载，显示网络错误

**诊断步骤**:
1. 检查 `VUE_APP_API_BASE_URL` 配置是否正确
2. 验证后端服务是否在线
3. 检查 CORS 配置是否允许前端域名访问

## 🔧 紧急修复步骤

### 立即执行的检查清单

1. **访问诊断页面**
   ```
   https://your-app.vercel.app/#/deploy-check
   ```

2. **检查控制台错误**
   - 右键页面 → 检查 → Console
   - 记录所有红色错误信息

3. **验证网络请求**
   - 检查 Network 面板
   - 确认 JS/CSS 文件返回状态码 200

4. **检查环境变量**
   - Vercel Dashboard → Settings → Environment Variables
   - 确认以下变量存在且正确:
     ```
     VUE_APP_API_BASE_URL=https://your-backend-url.com
     VUE_APP_AMAP_KEY=your-amap-key-here
     NODE_ENV=production
     ```

## 🛠️ 技术解决方案

### 修正 webpack 配置
```javascript
// webpack.config.js
module.exports = {
  output: {
    publicPath: '', // 关键：使用相对路径
    // ... 其他配置
  }
};
```

### 修正 Vercel 配置
```json
// vercel.json
{
  "version": 2,
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 环境变量安全访问
```javascript
// main.js
const getEnvVar = (key, defaultValue = '') => {
  const value = process.env[key];
  if (!value && defaultValue) {
    console.warn(`环境变量 ${key} 未设置，使用默认值`);
    return defaultValue;
  }
  return value || '';
};
```

## 📊 部署验证清单

### 部署前检查
- [ ] 本地构建成功 (`npm run build`)
- [ ] 本地预览正常 (`npm run preview`)
- [ ] 所有环境变量已在 Vercel 配置
- [ ] `vercel.json` 配置正确
- [ ] package.json 包含 `vercel-build` 脚本

### 部署后验证
- [ ] 访问主页显示正常
- [ ] 控制台无严重错误
- [ ] 各功能模块可正常使用
- [ ] API 请求成功
- [ ] 地图功能正常

## ⚡ 快速恢复方案

如果遇到紧急问题，可以尝试:

1. **强制重新部署**
   ```bash
   # 清除构建缓存
   vercel --prod --force
   ```

2. **回滚到之前版本**
   - 在 Vercel Dashboard 中找到之前的部署
   - 点击 "Promote to Production"

3. **临时降级方案**
   - 使用 GitHub Pages 作为备用部署目标
   - 或使用 Netlify 等其他平台

## 📞 获取帮助

如果以上方案都无法解决问题，请提供:

1. 完整的控制台错误信息截图
2. Network 面板的请求详情
3. Vercel 构建日志
4. `vercel.json` 和 `webpack.config.js` 配置文件
5. 访问的具体 URL

## 🎯 预防措施

为避免类似问题再次发生:

1. 建立部署前的自动化测试
2. 配置监控和告警机制
3. 维护详细的部署文档
4. 定期验证所有环境配置
5. 建立回滚预案