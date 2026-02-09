import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import PoisView from './views/PoisView.vue';
import ItineraryView from './views/ItineraryView.vue';
import BudgetView from './views/BudgetView.vue';
import MemosView from './views/MemosView.vue';
import DeployCheck from './views/DeployCheck.vue';

// 环境变量处理和默认值设置
const getEnvVar = (key, defaultValue = '') => {
  const value = process.env[key];
  if (!value && defaultValue) {
    console.warn(`环境变量 ${key} 未设置，使用默认值: ${defaultValue}`);
    return defaultValue;
  }
  return value || '';
};

// 获取环境变量，带默认值和验证
const API_BASE_URL = getEnvVar('VUE_APP_API_BASE_URL', 'https://tripmasterbackend-production-78ff.up.railway.app');
const AMAP_KEY = getEnvVar('VUE_APP_AMAP_KEY', 'e953f2ed40d6ba23010ade13fe41d628');
const NODE_ENV = getEnvVar('NODE_ENV', 'production');

// 全局环境变量配置
window.APP_CONFIG = {
  API_BASE_URL,
  AMAP_KEY,
  NODE_ENV,
  IS_DEVELOPMENT: NODE_ENV === 'development'
};

// 调试信息
console.group('🚀 应用环境配置');
console.log('API_BASE_URL:', API_BASE_URL);
console.log('AMAP_KEY:', AMAP_KEY ? `${AMAP_KEY.substring(0, 8)}...` : '❌ 未设置');
console.log('NODE_ENV:', NODE_ENV);
console.log('IS_DEVELOPMENT:', window.APP_CONFIG.IS_DEVELOPMENT);
console.log('Build Timestamp:', new Date().toISOString());
console.groupEnd();

// 验证关键配置
if (!API_BASE_URL) {
  console.error('❌ 致命错误: API_BASE_URL 未配置，应用可能无法正常工作');
}
if (!AMAP_KEY) {
  console.warn('⚠️ 警告: AMAP_KEY 未配置，地图功能可能受限');
}

// 路由配置
const routes = [
  { path: '/', redirect: '/pois' },
  { path: '/pois', component: PoisView, name: 'Pois' },
  { path: '/itinerary', component: ItineraryView, name: 'Itinerary' },
  { path: '/budget', component: BudgetView, name: 'Budget' },
  { path: '/memos', component: MemosView, name: 'Memos' },
  { path: '/deploy-check', component: DeployCheck, name: 'DeployCheck' }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// 创建应用实例
const app = createApp(App);

// 全局属性
app.config.globalProperties.$APP_CONFIG = window.APP_CONFIG;

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue 错误:', err);
  console.error('组件:', instance);
  console.error('错误信息:', info);
  
  // 显示用户友好的错误信息
  if (window.notificationService) {
    window.notificationService.showError(`应用出现错误: ${err.message}`);
  }
};

// 处理未捕获的 Promise 错误
window.addEventListener('unhandledrejection', event => {
  console.error('未处理的 Promise 错误:', event.reason);
  if (window.notificationService) {
    window.notificationService.showError(`异步操作失败: ${event.reason}`);
  }
});

// 处理 JavaScript 运行时错误
window.addEventListener('error', event => {
  console.error('JavaScript 运行时错误:', event.error);
  if (window.notificationService) {
    window.notificationService.showError(`脚本错误: ${event.error?.message || '未知错误'}`);
  }
});

app.use(router);

// 等待 DOM 准备就绪后再挂载
document.addEventListener('DOMContentLoaded', () => {
  try {
    app.mount('#app');
    console.log('🎉 Vue 应用初始化完成');
  } catch (error) {
    console.error('❌ 应用挂载失败:', error);
    // 创建简单的错误显示
    document.getElementById('app').innerHTML = `
      <div style="padding: 20px; text-align: center; color: #dc3545;">
        <h2>❌ 应用初始化失败</h2>
        <p>错误信息: ${error.message}</p>
        <p>请检查控制台获取更多详细信息</p>
        <button onclick="location.reload()" style="margin-top: 10px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
          重新加载
        </button>
      </div>
    `;
  }
});

// 全局通知服务
window.notificationService = {
  showSuccess(message) {
    console.log('✅ Success:', message);
    // 可以在这里添加实际的通知 UI
  },
  showError(message) {
    console.log('❌ Error:', message);
    // 可以在这里添加实际的通知 UI
  },
  showWarning(message) {
    console.log('⚠️ Warning:', message);
    // 可以在这里添加实际的通知 UI
  }
};

// 添加全局调试函数
window.debugApp = () => {
  console.group('🔍 应用调试信息');
  console.log('APP_CONFIG:', window.APP_CONFIG);
  console.log('Vue 实例:', app);
  console.log('路由:', router);
  console.log('当前路由:', router.currentRoute.value);
  console.groupEnd();
};