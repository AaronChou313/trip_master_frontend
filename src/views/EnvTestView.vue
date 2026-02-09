<template>
  <div class="env-test-view">
    <h1>环境配置测试</h1>
    <EnvChecker />
  </div>
</template>

<script>
import EnvChecker from '@/components/EnvChecker.vue'

export default {
  name: 'EnvTestView',
  components: {
    EnvChecker
  }
}
</script>

<style scoped>
.env-test-view {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.env-test-view h1 {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}
</style>