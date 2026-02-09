<template>
  <div class="simple-check">
    <h1>🔧 简易诊断页面</h1>
    
    <div class="check-section">
      <h2>基础检查</h2>
      <div class="check-item">
        <strong>Vue 是否加载:</strong> 
        <span class="status success">✅ 正常</span>
      </div>
      <div class="check-item">
        <strong>页面是否渲染:</strong> 
        <span class="status success">✅ 正常</span>
      </div>
    </div>

    <div class="check-section">
      <h2>环境变量检查</h2>
      <div class="check-item">
        <strong>API_BASE_URL:</strong> 
        <span class="value">{{ apiUrl }}</span>
      </div>
      <div class="check-item">
        <strong>AMAP_KEY:</strong> 
        <span class="value">{{ amapKey }}</span>
      </div>
      <div class="check-item">
        <strong>NODE_ENV:</strong> 
        <span class="value">{{ nodeEnv }}</span>
      </div>
    </div>

    <div class="check-section">
      <h2>JavaScript 功能测试</h2>
      <button @click="testFunction" class="test-btn">点击测试 JavaScript 功能</button>
      <div v-if="testResult" class="test-result">
        {{ testResult }}
      </div>
    </div>

    <div class="check-section">
      <h2>导航链接</h2>
      <div class="nav-links">
        <router-link to="/pois">📍 主应用</router-link>
        <router-link to="/deploy-check">📊 详细诊断</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SimpleCheck',
  data() {
    return {
      apiUrl: '未检测到',
      amapKey: '未检测到',
      nodeEnv: '未检测到',
      testResult: ''
    };
  },
  mounted() {
    console.log('🔧 简易诊断页面已加载');
    
    // 检查环境变量
    this.checkEnvironment();
    
    // 检查全局配置
    if (window.APP_CONFIG) {
      console.log('APP_CONFIG:', window.APP_CONFIG);
    } else {
      console.log('⚠️ APP_CONFIG 未定义');
    }
  },
  methods: {
    checkEnvironment() {
      try {
        this.apiUrl = process.env.VUE_APP_API_BASE_URL || '❌ 未设置';
        this.amapKey = process.env.VUE_APP_AMAP_KEY || '❌ 未设置';
        this.nodeEnv = process.env.NODE_ENV || '❌ 未设置';
        
        console.log('环境变量检查结果:');
        console.log('- API_BASE_URL:', this.apiUrl);
        console.log('- AMAP_KEY:', this.amapKey);
        console.log('- NODE_ENV:', this.nodeEnv);
      } catch (error) {
        console.error('环境变量检查出错:', error);
        this.apiUrl = '❌ 检查出错';
        this.amapKey = '❌ 检查出错';
        this.nodeEnv = '❌ 检查出错';
      }
    },
    
    testFunction() {
      try {
        // 测试基本 JavaScript 功能
        const testObj = { message: 'JavaScript 功能正常!' };
        this.testResult = testObj.message;
        
        // 测试控制台输出
        console.log('✅ JavaScript 测试通过');
        console.log('当前时间:', new Date().toLocaleString());
        
        // 测试路由功能
        console.log('当前路由:', this.$route.path);
        
      } catch (error) {
        this.testResult = `❌ 测试失败: ${error.message}`;
        console.error('JavaScript 测试失败:', error);
      }
    }
  }
};
</script>

<style scoped>
.simple-check {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.check-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.check-section h2 {
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.check-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.check-item:last-child {
  border-bottom: none;
}

.status.success {
  color: #28a745;
  font-weight: bold;
}

.value {
  font-family: monospace;
  word-break: break-all;
}

.test-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.test-btn:hover {
  background: #0056b3;
}

.test-result {
  margin-top: 15px;
  padding: 12px;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  color: #155724;
}

.nav-links {
  display: flex;
  gap: 15px;
}

.nav-links a {
  display: inline-block;
  padding: 10px 20px;
  background: #28a745;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.2s;
}

.nav-links a:hover {
  background: #218838;
}
</style>