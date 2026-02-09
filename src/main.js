import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// 使用环境变量配置API基础URL - Webpack dotenv方式
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'

// 配置axios默认设置
axios.defaults.baseURL = API_BASE_URL
axios.defaults.timeout = 10000

// 请求拦截器
axios.interceptors.request.use(
  config => {
    console.log('API Request:', config.method?.toUpperCase(), config.url)
    return config
  },
  error => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.config.url)
    return response
  },
  error => {
    console.error('Response Error:', error.response?.status, error.message)
    return Promise.reject(error)
  }
)

// 调试环境变量 - 仅在开发环境显示
if (process.env.VUE_APP_DEBUG === 'true') {
  console.log('=== 环境变量调试信息 ===')
  console.log('API_BASE_URL:', API_BASE_URL)
  console.log('NODE_ENV:', process.env.VUE_APP_NODE_ENV)
  console.log('DEBUG MODE:', process.env.VUE_APP_DEBUG)
  console.log('所有VUE_APP_环境变量:')
  Object.keys(process.env).forEach(key => {
    if (key.startsWith('VUE_APP_')) {
      console.log(`${key}:`, process.env[key])
    }
  })
}

const app = createApp(App)

// 将axios挂载到全局属性
app.config.globalProperties.$http = axios

app.use(router).mount('#app')