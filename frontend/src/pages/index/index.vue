<template>
  <div class="index-page">
    <!-- 背景装饰 -->
    <div class="background-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <!-- 主容器 -->
    <div class="container">
      <!-- 标题部分 -->
      <div class="title-section">
        <h1 class="main-title">测一下</h1>
        <p class="subtitle">你暗恋/喜欢的 TA 是什么人格？</p>
      </div>

      <!-- 副标题 -->
      <div class="intro-text">
        <p>通过 30 道趣味问题，</p>
        <p>快速了解伴侣/暗恋对象的真实性格！</p>
      </div>

      <!-- 按钮组 -->
      <div class="button-group">
        <button class="btn btn-male" @click="goToTest('male')">
          <span class="icon">🚹</span>
          <span class="text">测他</span>
        </button>
        <button class="btn btn-female" @click="goToTest('female')">
          <span class="icon">🚺</span>
          <span class="text">测她</span>
        </button>
      </div>

      <!-- 底部提示 -->
      <div class="footer-text">
        <p>✨ 结果仅供娱乐，不代表真实性格评定</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToTest = (gender: 'male' | 'female') => {
  router.push({
    name: 'test',
    params: { gender },
  });
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.index-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}

/* 背景装饰 */
.background-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
}

.shape-1 {
  width: 300px;
  height: 300px;
  background: white;
  top: -100px;
  right: -100px;
}

.shape-2 {
  width: 200px;
  height: 200px;
  background: white;
  bottom: 50px;
  left: -50px;
}

.shape-3 {
  width: 150px;
  height: 150px;
  background: white;
  bottom: 150px;
  right: 10%;
}

/* 主容器 */
.container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 500px;
  padding: 40px 30px;
  text-align: center;
  color: white;
}

/* 标题部分 */
.title-section {
  margin-bottom: 40px;
}

.main-title {
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 10px;
  letter-spacing: 2px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.subtitle {
  font-size: 1.3rem;
  font-weight: 500;
  opacity: 0.95;
  line-height: 1.5;
}

/* 介绍文本 */
.intro-text {
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 50px;
  opacity: 0.9;
  font-weight: 300;
}

.intro-text p {
  margin: 5px 0;
}

/* 按钮组 */
.button-group {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  justify-content: center;
}

.btn {
  flex: 1;
  max-width: 140px;
  padding: 18px 30px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-male {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: 2px solid white;
}

.btn-male:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #5568d3 0%, #6a3b8d 100%);
}

.btn-male:active {
  transform: translateY(-1px);
}

.btn-female {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: 2px solid white;
}

.btn-female:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #e682ea 0%, #e4465b 100%);
}

.btn-female:active {
  transform: translateY(-1px);
}

.icon {
  font-size: 2rem;
}

.text {
  font-size: 1.1rem;
}

/* 底部文本 */
.footer-text {
  font-size: 0.9rem;
  opacity: 0.85;
  font-weight: 300;
}

.footer-text p {
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .container {
    padding: 30px 20px;
  }

  .main-title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .button-group {
    flex-direction: column;
    gap: 15px;
  }

  .btn {
    max-width: 100%;
  }
}
</style>
