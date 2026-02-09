// API配置和工具函数
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

console.log('=== API配置信息 ===');
console.log('API_BASE_URL:', API_BASE_URL);
console.log('当前环境:', import.meta.env.VITE_APP_ENV);

// 创建axios实例
const apiClient = {
  async get(url, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${API_BASE_URL}${url}?${queryString}` : `${API_BASE_URL}${url}`;
    
    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API GET request failed:', error);
      throw error;
    }
  },

  async post(url, data = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API POST request failed:', error);
      throw error;
    }
  },

  async put(url, data = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API PUT request failed:', error);
      throw error;
    }
  },

  async delete(url) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API DELETE request failed:', error);
      throw error;
    }
  }
};

// API端点配置
export const apiEndpoints = {
  // POIs相关
  getPois: () => apiClient.get('/api/pois'),
  createPoi: (poiData) => apiClient.post('/api/pois', poiData),
  deletePoi: (id) => apiClient.delete(`/api/pois/${id}`),
  
  // 行程相关
  getItineraries: () => apiClient.get('/api/itineraries'),
  createItinerary: (itineraryData) => apiClient.post('/api/itineraries', itineraryData),
  updateItinerary: (id, itineraryData) => apiClient.put(`/api/itineraries/${id}`, itineraryData),
  deleteItinerary: (id) => apiClient.delete(`/api/itineraries/${id}`),
  
  // 预算相关
  getBudgets: () => apiClient.get('/api/budgets'),
  createBudget: (budgetData) => apiClient.post('/api/budgets', budgetData),
  updateBudget: (id, budgetData) => apiClient.put(`/api/budgets/${id}`, budgetData),
  deleteBudget: (id) => apiClient.delete(`/api/budgets/${id}`),
  
  // 备忘录相关
  getMemos: () => apiClient.get('/api/memos'),
  createMemo: (memoData) => apiClient.post('/api/memos', memoData),
  updateMemo: (id, memoData) => apiClient.put(`/api/memos/${id}`, memoData),
  deleteMemo: (id) => apiClient.delete(`/api/memos/${id}`),
  
  // 数据导入导出
  exportData: () => apiClient.get('/api/export'),
  importData: (data) => apiClient.post('/api/import', data),
  
  // 高德地图API代理
  searchPlaces: (keywords, city) => apiClient.get('/api/amap/place/text', { keywords, city })
};

export default apiClient;