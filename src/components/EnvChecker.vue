<template>
  <div class="env-checker">
    <h2>环境变量检查器</h2>
    <div class="env-status" :class="{ 'env-ok': isConfigured, 'env-error': !isConfigured }">
      <h3>{{ isConfigured ? '✅ 环境配置正常' : '❌ 环境配置异常' }}</h3>
    </div>
    
    <div class="env-details">
      <h4>当前环境信息：</h4>
      <div class="env-item">
        <strong>API基础URL:</strong> {{ apiUrl }}
      </div>
      <div class="env-item">
        <strong>运行环境:</strong> {{ nodeEnv }}
      </div>
      <div class="env-item">
        <strong>调试模式:</strong> {{ debugMode }}
      </div>
      <div class="env-item">
        <strong>高德API Key:</strong> {{ amapKeyDisplay }}
      </div>
    </div>

    <div class="env-variables">
      <h4>所有环境变量:</h4>
      <div class="env-list">
        <div 
          v-for="(value, key) in envVars" 
          :key="key" 
          class="env-var-item"
        >
          <span class="env-key">{{ key }}:</span>
          <span class="env-value">{{ value }}</span>
        </div>
      </div>
    </div>

    <div class="test-section">
      <h4>API连接测试:</h4>
      <button @click="testApiConnection" :disabled="testing" class="test-btn">
        {{ testing ? '测试中...' : '测试API连接' }}
      </button>
      <div v-if="testResult" class="test-result" :class="testResult.success ? 'success' : 'error'">
        {{ testResult.message }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EnvChecker',
  data() {
    return {
      testing: false,
      testResult: null
    }
  },
  computed: {
    // 检查环境是否正确配置
    isConfigured() {
      return !!process.env.VUE_APP_API_BASE_URL
    },
    // API基础URL
    apiUrl() {
      return process.env.VUE_APP_API_BASE_URL || '未配置'
    },
    // 运行环境
    nodeEnv() {
      return process.env.VUE_APP_NODE_ENV || process.env.NODE_ENV || 'unknown'
    },
    // 调试模式
    debugMode() {
      return process.env.VUE_APP_DEBUG === 'true' ? '开启' : '关闭'
    },
    // 高德API Key显示（隐藏敏感信息）
    amapKeyDisplay() {
      const key = process.env.VUE_APP_AMAP_API_KEY
      if (!key || key === 'your_development_amap_key_here' || key === 'your_production_amap_key_here') {
        return '未配置或使用默认值'
      }
      return key.substring(0, 8) + '...' + key.substring(key.length - 4)
    },
    // 所有环境变量
    envVars() {
      const vars = {}
      Object.keys(process.env).forEach(key => {
        if (key.startsWith('VUE_APP_')) {
          vars[key] = process.env[key]
        }
      })
      return vars
    }
  },
  mounted() {
    console.log('=== EnvChecker 组件初始化 ===')
    console.log('process.env:', process.env)
    console.log('API URL:', this.apiUrl)
    console.log('=============================')
  },
  methods: {
    async testApiConnection() {
      this.testing = true
      this.testResult = null
      
      try {
        const response = await this.$http.get('/health')
        this.testResult = {
          success: true,
          message: `连接成功！状态码: ${response.status}`
        }
      } catch (error) {
        this.testResult = {
          success: false,
          message: `连接失败: ${error.message}`
        }
      } finally {
        this.testing = false
      }
    }
  }
}
</script>

<style scoped>
.env-checker {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 20px;
  font-family: Arial, sans-serif;
}

.env-status h3 {
  margin: 0;
  padding: 10px;
  border-radius: 4px;
}

.env-ok {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.env-error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.env-details, .env-variables, .test-section {
  margin-top: 20px;
  padding: 15px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.env-item {
  margin: 8px 0;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 3px;
}

.env-list {
  max-height: 200px;
  overflow-y: auto;
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
}

.env-var-item {
  display: flex;
  margin: 5px 0;
  padding: 5px;
  background: white;
  border-radius: 3px;
}

.env-key {
  font-weight: bold;
  min-width: 200px;
  color: #495057;
}

.env-value {
  flex: 1;
  word-break: break-all;
  color: #6c757d;
}

.test-btn {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.test-btn:hover:not(:disabled) {
  background: #0056b3;
}

.test-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.test-result {
  margin-top: 10px;
  padding: 10px;
  border-radius: 4px;
  font-weight: bold;
}

.test-result.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.test-result.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>