<template>
  <div class="itinerary-container">
    <!-- 左侧行程列表 -->
    <div class="itinerary-list-section">
      <div class="section-header">
        <h2>行程列表</h2>
        <button @click="createNewItinerary" class="btn btn-primary">+ 新建行程</button>
      </div>
      
      <div class="itinerary-list">
        <div 
          v-for="itin in itineraries" 
          :key="itin.id"
          class="itinerary-item"
          :class="{ active: selectedItinerary?.id === itin.id }"
          @click="selectItinerary(itin)"
        >
          <div class="itinerary-info">
            <h3>{{ itin.name || '未命名行程' }}</h3>
            <p>{{ itin.date || '未设置日期' }}</p>
            <span class="poi-count">{{ itin.pois?.length || 0 }} 个景点</span>
          </div>
          <div class="itinerary-actions">
            <button @click.stop="deleteItinerary(itin.id)" class="btn-icon delete">🗑️</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 右侧主要内容区 -->
    <div class="main-content">
      <!-- 行程编辑区域 -->
      <div class="edit-section">
        <div v-if="selectedItinerary" class="itinerary-editor">
          <div class="editor-header">
            <input 
              v-model="selectedItinerary.name" 
              placeholder="行程名称"
              class="itinerary-name-input"
            >
            <input 
              v-model="selectedItinerary.date" 
              type="date"
              class="itinerary-date-input"
            >
            <div class="view-toggle">
              <button 
                @click="currentView = 'edit'"
                :class="{ active: currentView === 'edit' }"
                class="toggle-btn"
              >编辑</button>
              <button 
                @click="currentView = 'preview'"
                :class="{ active: currentView === 'preview' }"
                class="toggle-btn"
              >预览</button>
            </div>
            <button @click="saveItinerary" class="btn btn-success">保存</button>
          </div>
          
          <textarea 
            v-model="selectedItinerary.description"
            placeholder="行程描述..."
            class="itinerary-description"
          ></textarea>
          
          <!-- 编辑视图 -->
          <div v-if="currentView === 'edit'" class="edit-view">
            <div class="section-title">
              <h3>行程景点</h3>
              <span>共 {{ selectedItinerary.pois?.length || 0 }} 个</span>
            </div>
            
            <!-- 景点编辑和可用景点左右排布 -->
            <div class="pois-layout">
              <!-- 已添加的景点列表 -->
              <div class="pois-in-itinerary-section">
                <div class="pois-in-itinerary">
                  <div 
                    v-for="(poi, index) in selectedItinerary.pois" 
                    :key="poi.id"
                    class="poi-in-itinerary-item"
                  >
                    <div class="poi-order">{{ index + 1 }}</div>
                    <div class="poi-details">
                      <h4>{{ poi.name || '未命名景点' }}</h4>
                      <textarea 
                        v-model="poi.description"
                        placeholder="景点描述..."
                        class="poi-description"
                      ></textarea>
                      <input 
                        v-model.number="poi.budget"
                        type="number"
                        placeholder="预算"
                        class="poi-budget"
                      >
                      
                      <!-- 交通安排（除了最后一个景点） -->
                      <div v-if="index < selectedItinerary.pois.length - 1" class="transport-section">
                        <h5>前往下一景点的交通</h5>
                        <select v-model="poi.transport_type" class="transport-type">
                          <option value="">选择交通方式</option>
                          <option value="driving">驾车</option>
                          <option value="riding">骑行</option>
                          <option value="walking">步行</option>
                          <option value="bus">公交</option>
                          <option value="train">火车</option>
                          <option value="flight">飞机</option>
                        </select>
                        <input 
                          v-model="poi.transport_duration"
                          type="text"
                          placeholder="预计时间（如：30分钟）"
                          class="transport-duration"
                        >
                        <input 
                          v-model.number="poi.transport_budget"
                          type="number"
                          placeholder="交通预算"
                          class="transport-budget"
                        >
                        <textarea 
                          v-model="poi.transport_description"
                          placeholder="交通描述..."
                          class="transport-description"
                        ></textarea>
                      </div>
                    </div>
                    <div class="poi-actions">
                      <button 
                        @click="movePoiUp(index)" 
                        :disabled="index === 0"
                        class="btn-icon move-up"
                      >⬆️</button>
                      <button 
                        @click="movePoiDown(index)" 
                        :disabled="index === (selectedItinerary.pois?.length || 0) - 1"
                        class="btn-icon move-down"
                      >⬇️</button>
                      <button 
                        @click="removePoiFromItinerary(index)"
                        class="btn-icon delete"
                      >🗑️</button>
                    </div>
                  </div>
                  
                  <div v-if="!(selectedItinerary.pois?.length > 0)" class="empty-state">
                    请从右侧选择景点添加到行程中
                  </div>
                </div>
              </div>
              
              <!-- 可添加的景点列表 -->
              <div class="available-pois-section">
                <div class="available-pois">
                  <h3>可添加的景点</h3>
                  <div class="available-pois-list">
                    <div 
                      v-for="poi in availablePois" 
                      :key="poi.id"
                      class="available-poi-item"
                      @click="addPoiToItinerary(poi)"
                    >
                      <span>{{ poi.name }}</span>
                      <button class="btn-icon add">+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 预览视图 -->
          <div v-else class="preview-view">
            <div class="timeline">
              <div 
                v-for="(poi, index) in (selectedItinerary.pois || [])" 
                :key="poi.id || index"
                class="timeline-item"
              >
                <div class="timeline-marker">{{ index + 1 }}</div>
                <div class="timeline-content">
                  <h4>{{ poi.name || '未命名景点' }}</h4>
                  <p v-if="poi.description">{{ poi.description }}</p>
                  <div class="timeline-budget" v-if="poi.budget">
                    预算: ¥{{ poi.budget }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="no-selection">
          请选择一个行程或创建新行程
        </div>
      </div>
      
      <!-- 地图显示区域 -->
      <div class="map-section">
        <div id="itinerary-map" ref="mapContainer"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import itineraryService from '../services/itineraryService';
import poiService from '../services/poiService';

export default {
  name: 'ItineraryView',
  setup() {
    const itineraries = ref([]);
    const selectedItinerary = ref(null);
    const availablePois = ref([]);
    const currentView = ref('edit');
    const isLoading = ref(false);
    const mapContainer = ref(null);
    let mapInstance = null;

    // 加载所有行程
    const loadItineraries = async () => {
      try {
        isLoading.value = true;
        console.log('=== 开始加载行程数据 ===');
        const data = await itineraryService.getAll();
        console.log('原始后端数据:', JSON.stringify(data, null, 2));
        console.log('数据类型:', Array.isArray(data) ? '数组' : typeof data);
        
        // 确保数据是数组格式并安全处理POIs字段
        const processedData = Array.isArray(data) ? data.map((itin, index) => {
          console.log(`\n--- 处理第${index + 1}个行程 ---`);
          console.log('原始行程数据:', itin);
          
          const processedItin = {
            ...itin,
            pois: Array.isArray(itin.pois) ? itin.pois.map((poiItem, poiIndex) => {
              console.log(`  处理第${poiIndex + 1}个POI项:`);
              console.log('    原始POI项数据:', poiItem);
              
              // 关键修复：正确提取嵌套的poi对象数据
              const actualPoi = poiItem.poi || {};
              console.log('    实际POI数据:', actualPoi);
              
              const processedPoi = {
                // 保留原始POI项的ID和其他字段
                ...poiItem,
                // 覆盖或添加实际POI的核心信息
                id: actualPoi.id || poiItem.poi_id || poiItem.id,
                name: actualPoi.name || '未命名景点',
                location: actualPoi.location || poiItem.location,
                address: actualPoi.address || poiItem.address,
                tel: actualPoi.tel || poiItem.tel,
                type: actualPoi.type || poiItem.type,
                typecode: actualPoi.typecode || poiItem.typecode,
                // 保留transport相关信息
                transport: {
                  type: poiItem.transport_type || '',
                  description: poiItem.transport_description || '',
                  budget: poiItem.transport_budget || 0
                }
              };
              
              console.log('    处理后POI数据:', processedPoi);
              console.log('    POI ID:', processedPoi.id);
              console.log('    POI Name:', processedPoi.name);
              console.log('    POI Location:', processedPoi.location);
              return processedPoi;
            }) : []
          };
          
          console.log('处理后行程数据:', processedItin);
          return processedItin;
        }) : [];
        
        itineraries.value = processedData;
        console.log('\n=== 最终行程列表 ===');
        console.log('行程数量:', itineraries.value.length);
        itineraries.value.forEach((itin, index) => {
          console.log(`行程${index + 1}:`, {
            id: itin.id,
            name: itin.name,
            poisCount: itin.pois?.length || 0
          });
          if (itin.pois) {
            itin.pois.forEach((poi, poiIndex) => {
              console.log(`  POI${poiIndex + 1}:`, {
                id: poi.id,
                name: poi.name,
                location: poi.location
              });
            });
          }
        });
        
      } catch (error) {
        console.error('加载行程失败:', error);
        window.notificationService?.showError(`加载行程失败: ${error.message}`);
        itineraries.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    // 加载可用的POIs
    const loadAvailablePois = async () => {
      try {
        const data = await poiService.getAll();
        // 确保POI数据包含正确的位置信息结构
        availablePois.value = Array.isArray(data) ? data.map(poi => {
          // 如果location是字符串格式"x,y"，转换为对象格式
          if (typeof poi.location === 'string' && poi.location.includes(',')) {
            const [lng, lat] = poi.location.split(',').map(coord => parseFloat(coord.trim()));
            return {
              ...poi,
              location: { lng, lat }
            };
          }
          return poi;
        }) : [];
        console.log('加载的可用POIs:', availablePois.value);
      } catch (error) {
        console.error('加载POIs失败:', error);
        availablePois.value = [];
      }
    };

    // 选择行程
    const selectItinerary = (itinerary) => {
      console.log('选择行程:', itinerary);
      // 深拷贝并确保POIs字段安全，同时完整保留POI数据
      selectedItinerary.value = {
        ...itinerary,
        pois: Array.isArray(itinerary.pois) ? itinerary.pois.map(poi => {
          // 完整保留POI的所有原始属性，不做任何修改
          const processedPoi = {
            ...poi,
            transport: poi.transport || { type: '', duration: 0 }
          };
          
          console.log(`POI数据 - ID: ${poi.id}, Name: ${poi.name}, Location:`, poi.location);
          return processedPoi;
        }) : []
      };
      
      console.log('选中的行程详情:', selectedItinerary.value);
      console.log('选中行程的POIs:', selectedItinerary.value.pois);
      
      // 延迟初始化地图，确保DOM已渲染
      setTimeout(() => {
        initializeMap();
      }, 100);
    };

    // 初始化地图
    const initializeMap = () => {
      if (!mapContainer.value || !selectedItinerary.value) {
        console.log('地图容器或选中行程不存在');
        return;
      }

      try {
        // 清除之前的地图实例
        if (mapInstance) {
          mapInstance.destroy();
        }

        // 创建新的地图实例
        mapInstance = new AMap.Map(mapContainer.value, {
          zoom: 10,
          center: [116.397428, 39.90923] // 默认北京中心
        });

        const pois = selectedItinerary.value.pois || [];
        console.log('=== 地图初始化开始 ===');
        console.log('要在地图上显示的POIs数量:', pois.length);
        console.log('POIs原始数据:', pois);

        if (pois.length > 0) {
          const markers = [];
          const positions = [];
          const pathPoints = []; // 用于绘制路线的点集合

          pois.forEach((poi, index) => {
            console.log(`\n--- 处理第${index + 1}个POI ---`);
            console.log('POI完整数据:', poi);
            console.log('POI name:', poi.name);
            console.log('POI location:', poi.location);
            console.log('POI location类型:', typeof poi.location);
            
            // 处理不同格式的位置信息
            let position = null;
            let locationInfo = null;
            
            if (poi.location) {
              console.log('开始解析位置信息...');
              
              if (poi.location.lng && poi.location.lat) {
                // 对象格式 {lng: x, lat: y}
                console.log('检测到对象格式位置信息');
                position = [parseFloat(poi.location.lng), parseFloat(poi.location.lat)];
                locationInfo = `对象格式: ${poi.location.lng}, ${poi.location.lat}`;
              } else if (Array.isArray(poi.location) && poi.location.length >= 2) {
                // 数组格式 [lng, lat]
                console.log('检测到数组格式位置信息');
                position = [parseFloat(poi.location[0]), parseFloat(poi.location[1])];
                locationInfo = `数组格式: ${poi.location[0]}, ${poi.location[1]}`;
              } else if (typeof poi.location === 'string' && poi.location.includes(',')) {
                // 字符串格式 "lng,lat"
                console.log('检测到字符串格式位置信息');
                const coords = poi.location.split(',');
                if (coords.length >= 2) {
                  const lng = parseFloat(coords[0].trim());
                  const lat = parseFloat(coords[1].trim());
                  position = [lng, lat];
                  locationInfo = `字符串格式: ${lng}, ${lat}`;
                  console.log('解析后的坐标:', lng, lat);
                }
              } else {
                console.log('未知的位置信息格式:', typeof poi.location, poi.location);
                locationInfo = `未知格式: ${typeof poi.location}`;
              }
            } else {
              console.log('POI缺少location字段');
              locationInfo = '缺少location字段';
            }
            
            console.log('解析后的位置:', position);
            console.log('位置信息描述:', locationInfo);
            
            if (position && position.length === 2 && 
                !isNaN(position[0]) && !isNaN(position[1])) {
              positions.push(position);
              pathPoints.push(position); // 收集路线点
              
              const marker = new AMap.Marker({
                position: position,
                title: poi.name || `景点${index + 1}`,
                label: {
                  content: poi.name || `景点${index + 1}`,
                  offset: new AMap.Pixel(0, -20)
                }
              });
              
              markers.push(marker);
              mapInstance.add(marker);
              console.log(`✅ 成功添加标记: ${poi.name || `景点${index + 1}`}`, position);
            } else {
              console.warn(`❌ POI ${poi.name || `索引${index}`} 位置信息无效:`, poi.location);
              console.warn('  原始数据:', poi);
              console.warn('  解析结果:', position);
            }
          });

          console.log('\n=== POI处理完成 ===');
          console.log('有效位置点数量:', positions.length);
          console.log('路线点数量:', pathPoints.length);

          // 绘制行程路线
          if (pathPoints.length > 1) {
            const polyline = new AMap.Polyline({
              path: pathPoints,
              strokeColor: "#3366FF", // 线条颜色
              strokeWeight: 4,       // 线条宽度
              strokeOpacity: 0.8,    // 线条透明度
              isOutline: true,
              outlineColor: '#ffffff',
              borderWeight: 1,
              showDir: true,
              dirColor: "#FFFFFF",  // 白色箭头
              dirSize: 10,          // 箭头大小
              geodesic: true,       // 使用大地曲线绘制
            });
            
            mapInstance.add(polyline);
            console.log('✅ 行程路线已绘制，包含点数:', pathPoints.length);
          } else {
            console.log('ℹ️  路线点不足2个，跳过路线绘制');
          }

          // 调整地图视野以包含所有标记和路线
          if (positions.length > 0) {
            mapInstance.setFitView([...markers]); // 包含所有标记
            console.log('✅ 地图视野已调整，包含所有标记和路线');
          } else {
            console.log('ℹ️  没有有效标记，使用默认视野');
          }
        } else {
          console.log('ℹ️  没有POI数据，显示默认地图');
        }

        console.log('=== 地图初始化结束 ===\n');

      } catch (error) {
        console.error('地图初始化失败:', error);
        console.error('错误堆栈:', error.stack);
        window.notificationService?.showError('地图加载失败，请检查网络连接');
      }
    };

    // 创建新行程
    const createNewItinerary = async () => {
      try {
        const newItinerary = {
          name: '新行程',
          date: new Date().toISOString().split('T')[0],
          description: '',
          pois: []
        };
        
        const created = await itineraryService.create(newItinerary);
        await loadItineraries();
        selectItinerary(created);
        window.notificationService?.showSuccess('行程创建成功');
      } catch (error) {
        console.error('创建行程失败:', error);
        window.notificationService?.showError(`创建行程失败: ${error.message}`);
      }
    };

    // 保存行程
    const saveItinerary = async () => {
      if (!selectedItinerary.value) return;
      
      try {
        console.log('=== 准备保存行程 ===');
        console.log('要保存的行程数据:', selectedItinerary.value);
        console.log('行程POIs:', selectedItinerary.value.pois);
        
        // 确保POIs数据格式正确，处理位置信息
        const itineraryToSave = {
          ...selectedItinerary.value,
          pois: Array.isArray(selectedItinerary.value.pois) 
            ? selectedItinerary.value.pois.map(poi => {
                console.log('处理要保存的POI:', poi);
                
                // 确保位置信息格式正确（转换为字符串格式存储）
                let location = poi.location;
                if (poi.location && poi.location.lng && poi.location.lat) {
                  location = `${poi.location.lng},${poi.location.lat}`;
                } else if (Array.isArray(poi.location) && poi.location.length >= 2) {
                  location = `${poi.location[0]},${poi.location[1]}`;
                }
                
                const processedPoi = {
                  ...poi,
                  location,
                  transport: poi.transport || { type: '', duration: 0 }
                };
                
                console.log('处理后的POI用于保存:', processedPoi);
                return processedPoi;
              })
            : []
        };
        
        console.log('发送到后端的数据:', itineraryToSave);
        
        await itineraryService.update(itineraryToSave.id, itineraryToSave);
        console.log('保存成功，重新加载数据...');
        await loadItineraries(); // 重新加载以获取最新数据
        window.notificationService?.showSuccess('行程保存成功');
      } catch (error) {
        console.error('保存行程失败:', error);
        window.notificationService?.showError(`保存行程失败: ${error.message}`);
      }
    };

    // 删除行程
    const deleteItinerary = async (id) => {
      if (!confirm('确定要删除这个行程吗？')) return;
      
      try {
        await itineraryService.delete(id);
        await loadItineraries();
        if (selectedItinerary.value?.id === id) {
          selectedItinerary.value = null;
        }
        window.notificationService?.showSuccess('行程删除成功');
      } catch (error) {
        console.error('删除行程失败:', error);
        window.notificationService?.showError(`删除行程失败: ${error.message}`);
      }
    };

    // 添加POI到行程
    const addPoiToItinerary = (poi) => {
      if (!selectedItinerary.value) return;
      
      console.log('=== 手动添加POI到行程 ===');
      console.log('要添加的POI原始数据:', poi);
      console.log('当前选中行程:', selectedItinerary.value?.id);
      
      // 检查是否已存在
      if (selectedItinerary.value.pois.some(p => p.id === poi.id)) {
        window.notificationService?.showError('该景点已在行程中');
        return;
      }
      
      // 确保添加的POI位置信息格式正确
      const newPoi = {
        ...poi,
        transport: { type: '', duration: 0 }
      };
      
      console.log('处理后的POI数据:', newPoi);
      
      selectedItinerary.value.pois.push(newPoi);
      console.log('添加POI后的行程POIs:', selectedItinerary.value.pois);
      
      // 更新地图
      setTimeout(() => {
        initializeMap();
      }, 100);
      
      window.notificationService?.showSuccess('景点添加成功');
    };

    // 从行程中移除POI
    const removePoiFromItinerary = (index) => {
      if (!selectedItinerary.value || !selectedItinerary.value.pois) return;
      selectedItinerary.value.pois.splice(index, 1);
      
      // 更新地图
      setTimeout(() => {
        initializeMap();
      }, 100);
    };

    // 移动POI位置
    const movePoiUp = (index) => {
      if (index <= 0 || !selectedItinerary.value.pois) return;
      const pois = selectedItinerary.value.pois;
      [pois[index - 1], pois[index]] = [pois[index], pois[index - 1]];
      
      // 更新地图
      setTimeout(() => {
        initializeMap();
      }, 100);
    };

    const movePoiDown = (index) => {
      if (!selectedItinerary.value.pois || index >= selectedItinerary.value.pois.length - 1) return;
      const pois = selectedItinerary.value.pois;
      [pois[index], pois[index + 1]] = [pois[index + 1], pois[index]];
      
      // 更新地图
      setTimeout(() => {
        initializeMap();
      }, 100);
    };

    // 监听选中行程的变化
    watch(selectedItinerary, (newVal) => {
      if (newVal) {
        console.log('选中行程发生变化:', newVal);
        setTimeout(() => {
          initializeMap();
        }, 100);
      }
    });

    // 组件挂载时加载数据
    onMounted(async () => {
      console.log('行程页面挂载，开始加载数据...');
      await Promise.all([
        loadItineraries(),
        loadAvailablePois()
      ]);
      console.log('数据加载完成');
    });

    return {
      itineraries,
      selectedItinerary,
      availablePois,
      currentView,
      isLoading,
      mapContainer,
      selectItinerary,
      createNewItinerary,
      saveItinerary,
      deleteItinerary,
      addPoiToItinerary,
      removePoiFromItinerary,
      movePoiUp,
      movePoiDown,
      loadItineraries
    };
  }
};
</script>

<style scoped>
.itinerary-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  height: calc(100vh - 120px);
  gap: 1rem;
  padding: 1rem;
  overflow: hidden; /* 防止整个容器滚动 */
}

.itinerary-list-section {
  background: white;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  height: 100%; /* 占满整个高度 */
  overflow: hidden; /* 防止溢出 */
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-shrink: 0; /* 防止头部被压缩 */
}

.section-header h2 {
  color: #333;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  flex-shrink: 0; /* 防止按钮被压缩 */
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-success {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
}

.btn:hover {
  transform: translateY(-2px);
}

.itinerary-list {
  flex: 1;
  overflow-y: auto;
  min-height: 0; /* 允许flex子元素收缩 */
}

.itinerary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.itinerary-item:hover {
  background-color: #f8f9fa;
}

.itinerary-item.active {
  background-color: #e3f2fd;
  border-color: #667eea;
}

.itinerary-info h3 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
  color: #333;
}

.itinerary-info p {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.poi-count {
  font-size: 0.75rem;
  color: #999;
  background: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

.btn-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; /* 防止按钮被压缩 */
}

.btn-icon:hover {
  transform: scale(1.1);
}

.btn-icon.delete:hover {
  background: #ff6b6b;
  color: white;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  height: 100%; /* 占满剩余高度 */
  overflow: hidden; /* 防止主内容区域滚动 */
}

.edit-section {
  background: white;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  height: 100%; /* 占满整个高度 */
  overflow: hidden; /* 防止溢出 */
}

.itinerary-editor {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 关键：允许flex子元素收缩 */
  overflow-y: auto; /* 关键：在编辑器内部启用滚动 */
}

.editor-header {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
  flex-wrap: wrap;
  flex-shrink: 0; /* 防止头部被压缩 */
}

.itinerary-name-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
  font-size: 1.25rem;
  font-weight: 600;
}

.itinerary-date-input {
  padding: 0.75rem;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
}

.view-toggle {
  display: flex;
  background: #f5f5f5;
  border-radius: 25px;
  padding: 2px;
  flex-shrink: 0; /* 防止切换按钮被压缩 */
}

.toggle-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.toggle-btn.active {
  background: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.itinerary-description {
  width: 100%;
  min-height: 80px;
  padding: 1rem;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
  margin-bottom: 1rem;
  resize: vertical;
  font-family: inherit;
  flex-shrink: 0; /* 防止描述框被过度压缩 */
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-shrink: 0; /* 防止标题被压缩 */
}

.section-title h3 {
  color: #333;
}

/* 景点编辑区域左右排布 */
.edit-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.pois-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  flex: 1;
  min-height: 0;
}

.pois-in-itinerary-section {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.pois-in-itinerary {
  flex: 1;
  overflow-y: auto;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
}

.poi-in-itinerary-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  background: white;
}

.poi-order {
  width: 30px;
  height: 30px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.poi-details {
  flex: 1;
}

.poi-details h4 {
  margin-bottom: 0.5rem;
  color: #333;
}

.poi-description {
  width: 100%;
  min-height: 60px;
  padding: 0.5rem;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  resize: vertical;
  font-family: inherit;
  font-size: 0.9rem;
}

.poi-budget {
  width: 120px;
  padding: 0.5rem;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
}

/* 交通安排样式 */
.transport-section {
  margin-top: 1rem;
  padding: 1rem;
  background: #e3f2fd;
  border-radius: 6px;
  border-left: 3px solid #2196F3;
}

.transport-section h5 {
  margin-bottom: 0.5rem;
  color: #1976D2;
  font-size: 0.9rem;
}

.transport-type {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #bbdefb;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  background: white;
}

.transport-duration {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #bbdefb;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  background: white;
}

.transport-budget {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #bbdefb;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  background: white;
}

.transport-description {
  width: 100%;
  min-height: 40px;
  padding: 0.5rem;
  border: 1px solid #bbdefb;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  resize: vertical;
  font-family: inherit;
  font-size: 0.85rem;
}

.poi-actions {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-style: italic;
}

.available-pois-section {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.available-pois {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  min-height: 0;
}

.available-pois h3 {
  margin-bottom: 1rem;
  color: #333;
  flex-shrink: 0; /* 防止标题被压缩 */
}

.available-pois-list {
  flex: 1;
  overflow-y: auto;
}

.available-poi-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #eee;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  background: white;
}

.available-poi-item:hover {
  background-color: #e3f2fd;
}

.preview-view {
  padding: 1rem 0;
  flex: 1;
  overflow-y: auto;
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 14px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #667eea;
}

.timeline-item {
  position: relative;
  margin-bottom: 2rem;
}

.timeline-marker {
  position: absolute;
  left: -24px;
  top: 0;
  width: 30px;
  height: 30px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.875rem;
}

.timeline-content {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid #667eea;
}

.timeline-content h4 {
  margin-bottom: 0.5rem;
  color: #333;
}

.timeline-content p {
  margin-bottom: 0.5rem;
  color: #666;
  line-height: 1.5;
}

.timeline-budget {
  font-weight: 600;
  color: #4CAF50;
}

.no-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 1.25rem;
}

.map-section {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  height: 100%; /* 占满整个高度 */
}

#itinerary-map {
  width: 100%;
  height: 100%;
}
</style>