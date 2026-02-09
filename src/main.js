import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import PoisView from './views/PoisView.vue';
import ItineraryView from './views/ItineraryView.vue';
import BudgetView from './views/BudgetView.vue';
import MemosView from './views/MemosView.vue'; // 恢复正常使用备忘录组件

// 调试环境变量 - Webpack 方式
console.log('=== 环境变量调试信息 ===');
console.log('process.env:', process.env);
console.log('VUE_APP_API_BASE_URL:', process.env.VUE_APP_API_BASE_URL);
console.log('VUE_APP_AMAP_KEY:', process.env.VUE_APP_AMAP_KEY);
console.log('NODE_ENV:', process.env.NODE_ENV);

// 检查关键环境变量是否存在
if (!process.env.VUE_APP_API_BASE_URL) {
  console.warn('警告: VUE_APP_API_BASE_URL 未设置');
}
if (!process.env.VUE_APP_AMAP_KEY) {
  console.warn('警告: VUE_APP_AMAP_KEY 未设置');
}

// 路由配置 - 恢复正常使用备忘录组件
const routes = [
  { path: '/', redirect: '/pois' },
  { path: '/pois', component: PoisView, name: 'Pois' },
  { path: '/itinerary', component: ItineraryView, name: 'Itinerary' },
  { path: '/budget', component: BudgetView, name: 'Budget' },
  { path: '/memos', component: MemosView, name: 'Memos' } // 恢复正常使用
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// 创建应用实例
const app = createApp(App);
app.use(router);
app.mount('#app');

// 全局通知服务
window.notificationService = {
  showSuccess(message) {
    console.log('Success:', message);
  },
  showError(message) {
    console.log('Error:', message);
  }
};