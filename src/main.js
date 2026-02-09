import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import PoisView from './views/PoisView.vue';
import ItineraryView from './views/ItineraryView.vue';
import BudgetView from './views/BudgetView.vue';
import MemosView from './views/MemosView.vue';

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
  { path: '/memos', component: MemosView, name: 'Memos' }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// 创建应用实例
const app = createApp(App);

// 全局属性
app.config.globalProperties.$APP_CONFIG = window.APP_CONFIG;

app.use(router);
app.mount('#app');

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue 错误:', err);
  console.error('组件:', instance);
  console.error('错误信息:', info);
};

// 全局通知服务
window.notificationService = {
  showSuccess(message) {
    console.log('✅ Success:', message);
  },
  showError(message) {
    console.log('❌ Error:', message);
  },
  showWarning(message) {
    console.log('⚠️ Warning:', message);
  }
};

console.log('🎉 Vue 应用初始化完成');