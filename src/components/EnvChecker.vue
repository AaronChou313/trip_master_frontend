<template>
  <div class="env-checker">
    <h3>🔧 环境变量检查</h3>
    <div class="env-status">
      <div class="env-item" :class="{ 'success': hasApiUrl, 'error': !hasApiUrl }">
        <span class="label">API Base URL:</span>
        <span class="value">{{ apiUrlDisplay }}</span>
      </div>
      <div class="env-item" :class="{ 'success': hasAmapKey, 'error': !hasAmapKey }">
        <span class="label">高德地图 Key:</span>
        <span class="value">{{ amapKeyDisplay }}</span>
      </div>
      <div class="env-item">
        <span class="label">Node Environment:</span>
        <span class="value">{{ nodeEnv }}</span>
      </div>
    </div>
    
    <div class="actions">
      <button @click="refreshEnv" class="btn-refresh">刷新检查</button>
      <button @click="testApi" :disabled="!hasApiUrl" class="btn-test">测试 API</button>
    </div>
    
    <div v-if="apiTestResult" class="api-test-result">
      <h4>API 测试结果:</h4>
      <pre>{{ apiTestResult }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EnvChecker',
  data() {
    return {
      apiUrl: '',
      amapKey: '',
      nodeEnv: '',
      apiTestResult: ''
    };
  },
  computed: {
    hasApiUrl() {
      return !!this.apiUrl;
    },
    hasAmapKey() {
      return !!this.amapKey;
    },
    apiUrlDisplay() {
      return this.apiUrl || '❌ 未设置';
    },
    amapKeyDisplay() {
      if (!this.amapKey) return '❌ 未设置';
      return `${this.amapKey.substring(0, 8)}...`;
    }
  },
  mounted() {
    this.checkEnvironment();
  },
  methods: {
    checkEnvironment() {
      // 检查环境变量
      this.apiUrl = process.env.VUE_APP_API_BASE_URL || '';
      this.amapKey = process.env.VUE_APP_AMAP_KEY || '';
      this.nodeEnv = process.env.NODE_ENV || 'unknown';
      
      console.log('🔍 环境变量检查:');
      console.log('API URL:', this.apiUrl);
      console.log('AMAP Key:', this.amapKey ? `${this.amapKey.substring(0, 8)}...` : '未设置');
      console.log('Node Env:', this.nodeEnv);
    },
    
    refreshEnv() {
      this.checkEnvironment();
      this.apiTestResult = '';
    },
    
    async testApi() {
      if (!this.apiUrl) {
        this.apiTestResult = '❌ API Base URL 未配置';
        return;
      }
      
      try {
        this.apiTestResult = '⏳ 正在测试...';
        const response = await fetch(`${this.apiUrl}/health`);
        const data = await response.json();
        this.apiTestResult = `✅ 连接成功\n状态: ${response.status}\n数据: ${JSON.stringify(data, null, 2)}`;
      } catch (error) {
        this.apiTestResult = `❌ 连接失败: ${error.message}`;
      }
    }
  }
};
</script>

<style scoped>
.env-checker {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}

.env-checker h3 {
  margin-top: 0;
  color: #495057;
}

.env-status {
  margin: 15px 0;
}

.env-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
}

.env-item:last-child {
  border-bottom: none;
}

.env-item.success {
  color: #28a745;
}

.env-item.error {
  color: #dc3545;
  background-color: #f8d7da;
  padding: 8px;
  border-radius: 4px;
  margin: 4px 0;
}

.label {
  font-weight: bold;
  min-width: 120px;
}

.value {
  font-family: monospace;
  word-break: break-all;
}

.actions {
  margin: 15px 0;
}

.btn-refresh, .btn-test {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  margin-right: 10px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-refresh:hover, .btn-test:hover:not(:disabled) {
  background: #0056b3;
}

.btn-test:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.api-test-result {
  margin-top: 15px;
  padding: 12px;
  background: #e9ecef;
  border-radius: 4px;
}

.api-test-result h4 {
  margin: 0 0 10px 0;
  color: #495057;
}

.api-test-result pre {
  margin: 0;
  font-size: 12px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>