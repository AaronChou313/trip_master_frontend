<template>
  <div id="app">
    <!-- 环境信息显示 -->
    <div v-if="showEnvInfo" class="env-info">
      <div class="env-banner">
        <span class="env-tag">{{ environment }}</span>
        <button @click="toggleEnvInfo" class="close-btn">×</button>
      </div>
      <div class="env-details">
        <p><strong>API地址:</strong> {{ apiUrl }}</p>
        <p><strong>高德Key:</strong> {{ amapKey ? '已配置' : '未配置' }}</p>
        <p><strong>构建时间:</strong> {{ buildTime }}</p>
      </div>
    </div>

    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-brand">
        <h1>TripMaster</h1>
        <span class="version">v1.0</span>
      </div>
      <ul class="nav-links">
        <li><router-link to="/pois">兴趣点</router-link></li>
        <li><router-link to="/itinerary">行程</router-link></li>
        <li><router-link to="/budget">预算</router-link></li>
        <li><router-link to="/memos">备忘录</router-link></li>
      </ul>
      <div class="nav-actions">
        <button @click="toggleEnvInfo" class="env-toggle-btn">
          {{ showEnvInfo ? '隐藏' : '环境' }}
        </button>
      </div>
    </nav>

    <!-- 主内容区域 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 全局通知组件 -->
    <Notification />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Notification from './components/Notification.vue';

export default {
  name: 'App',
  components: {
    Notification
  },
  setup() {
    const showEnvInfo = ref(false);
    const environment = ref(import.meta.env.VITE_APP_ENV || 'unknown');
    const apiUrl = ref(import.meta.env.VITE_API_BASE_URL || 'not configured');
    const amapKey = ref(import.meta.env.VITE_AMAP_KEY || '');
    const buildTime = ref(new Date().toLocaleString());

    const toggleEnvInfo = () => {
      showEnvInfo.value = !showEnvInfo.value;
    };

    // 页面加载时的初始化
    onMounted(() => {
      console.log('=== TripMaster 应用启动 ===');
      console.log('环境:', environment.value);
      console.log('API地址:', apiUrl.value);
      console.log('构建时间:', buildTime.value);
      
      // 检查API连接
      setTimeout(() => {
        fetch(`${apiUrl.value}/api/pois`)
          .then(response => {
            if (response.ok) {
              console.log('✅ API连接正常');
            } else {
              console.warn('⚠️ API连接异常:', response.status);
            }
          })
          .catch(error => {
            console.error('❌ API连接失败:', error.message);
          });
      }, 1000);
    });

    return {
      showEnvInfo,
      environment,
      apiUrl,
      amapKey,
      buildTime,
      toggleEnvInfo
    };
  }
};
</script>

<style>
/* 基础样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  color: #333;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 环境信息样式 */
.env-info {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  margin-bottom: 1rem;
  position: relative;
}

.env-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.env-tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: bold;
  text-transform: uppercase;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.env-details p {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  opacity: 0.9;
}

/* 导航栏样式 */
.navbar {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-brand h1 {
  color: #667eea;
  font-size: 1.5rem;
  font-weight: 700;
}

.version {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-links a {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.nav-links a.router-link-active,
.nav-links a:hover {
  background: #667eea;
  color: white;
}

.nav-actions {
  display: flex;
  gap: 1rem;
}

.env-toggle-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.env-toggle-btn:hover {
  background: #5a6fd8;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .nav-links {
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .env-details {
    font-size: 0.75rem;
  }
}

/* 加载动画 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

#app {
  animation: fadeIn 0.5s ease-out;
}
</style>