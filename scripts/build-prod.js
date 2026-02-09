const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始生产环境构建...');

try {
  // 检查环境变量文件
  const envFile = path.join(__dirname, '..', '.env.production');
  if (!fs.existsSync(envFile)) {
    console.error('❌ 未找到 .env.production 文件');
    process.exit(1);
  }

  // 读取环境变量
  const envContent = fs.readFileSync(envFile, 'utf8');
  console.log('✅ 环境变量文件加载成功');
  
  // 显示关键配置
  const apiBaseUrl = envContent.match(/VUE_APP_API_BASE_URL=(.*)/);
  const amapKey = envContent.match(/VUE_APP_AMAP_API_KEY=(.*)/);
  
  console.log('🔧 构建配置:');
  console.log('  API基础URL:', apiBaseUrl ? apiBaseUrl[1] : '未配置');
  console.log('  高德API Key:', amapKey ? (amapKey[1].substring(0, 8) + '...') : '未配置');

  // 执行构建
  console.log('🔨 执行 webpack 构建...');
  execSync('webpack --mode production', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  // 验证构建结果
  const distPath = path.join(__dirname, '..', 'dist');
  if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath);
    console.log('✅ 构建完成，生成文件:');
    files.forEach(file => {
      const stats = fs.statSync(path.join(distPath, file));
      console.log(`  ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
    });
  } else {
    console.error('❌ 构建失败，未找到 dist 目录');
    process.exit(1);
  }

  console.log('🎉 生产环境构建成功完成！');

} catch (error) {
  console.error('❌ 构建过程中出现错误:', error.message);
  process.exit(1);
}