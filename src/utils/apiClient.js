import authService from '../services/authService';

class ApiClient {
  constructor() {
    this.baseURL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
  }

  async request(endpoint, options = {}) {
    const token = authService.token;
    
    // 确保headers对象存在
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    // 只有在有token时才添加认证头
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
      ...options,
      headers
    };

    try {
      console.log(`API请求: ${this.baseURL}${endpoint}`, config);
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      console.log(`API响应状态: ${response.status}`);
      
      // 处理认证失效
      if (response.status === 401) {
        console.warn('认证失效，清除token并跳转到登录页');
        authService.logout();
        window.location.href = '/#/login';
        throw new Error('认证失效，请重新登录');
      }

      // 对于DELETE请求，可能没有响应体
      if (response.status === 204 || response.status === 200) {
        if (response.headers.get('content-length') === '0' || response.status === 204) {
          return {}; // 返回空对象而不是解析JSON
        }
      }

      const data = await response.json();
      console.log('API响应数据:', data);
      
      if (!response.ok) {
        throw new Error(data.error || data.message || '请求失败');
      }

      return data;
    } catch (error) {
      console.error('API请求错误:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('网络连接失败，请检查网络设置');
      }
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export default new ApiClient();