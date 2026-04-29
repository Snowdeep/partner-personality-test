<template>
  <div class="result-page">
    <!-- 结果页容器 -->
    <div class="result-container">
      <!-- 屏幕 1: 标签展示 -->
      <div v-if="!showDetails" class="result-screen-1">
        <div class="label-display">
          <div class="label-emoji">🎯</div>
          <h1 class="label-name">{{ label?.name }}</h1>
          <p class="label-desc">
            {{ label?.combination.attitude }} · {{ label?.combination.traits }}
          </p>
          <p class="hint">向下滑动了解更多 ↓</p>
        </div>

        <button class="btn-detail" @click="showDetails = true">
          查看详情
        </button>
      </div>

      <!-- 屏幕 2: 详细解读 -->
      <div v-if="showDetails" class="result-screen-2">
        <button class="btn-back" @click="showDetails = false">← 返回</button>

        <div class="detail-content">
          <h2>{{ label?.name }}</h2>

          <!-- 人格概览 -->
          <section class="section">
            <h3>👤 人格概览</h3>
            <p>{{ label?.overview }}</p>
          </section>

          <!-- 恋爱风格 -->
          <section class="section">
            <h3>💕 恋爱风格</h3>
            <p>{{ label?.lovingStyle }}</p>
          </section>

          <!-- 相处建议 -->
          <section class="section">
            <h3>💡 相处建议</h3>
            <p>{{ label?.advice }}</p>
          </section>

          <!-- 注意事项 -->
          <section class="section">
            <h3>⚠️ 可能需要注意</h3>
            <p>{{ label?.caution }}</p>
          </section>

              <!-- 操作按钮 -->
          <div class="action-buttons">
            <button class="btn btn-share" @click="showShareOptions = true">
              📤 分享结果
            </button>
            <button class="btn btn-retry" @click="resetTest">
              🔄 重新测试
            </button>
            <button class="btn btn-home" @click="goHome">
              🏠 返回首页
            </button>
          </div>
        </div>
      </div>

      <!-- 分享选项弹窗 -->
      <div v-if="showShareOptions" class="share-modal">
        <div class="share-modal-content">
          <button class="close-btn" @click="showShareOptions = false">✕</button>
          <h3>分享你的结果</h3>

          <div class="share-options">
            <button class="share-option" @click="downloadImage">
              <span class="icon">🖼️</span>
              <span class="label">下载图片</span>
            </button>
            <button class="share-option" @click="copyShareLink">
              <span class="icon">🔗</span>
              <span class="label">复制链接</span>
            </button>
            <button class="share-option" @click="shareViaWebShare" v-if="supportsWebShare">
              <span class="icon">📱</span>
              <span class="label">分享到...</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 隐藏的结果卡片（用于生成图片） -->
      <div ref="cardElement" class="result-card-for-image">
        <div class="card-header">
          <div class="card-emoji">{{ label?.emoji || '🎯' }}</div>
          <h2 class="card-title">{{ label?.name }}</h2>
        </div>
        <div class="card-content">
          <p class="card-desc">{{ label?.combination.attitude }} · {{ label?.combination.traits }}</p>
          <p class="card-footer">来自 伴侣人格测试 💕</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getLabelByIdFromAPI } from '../../utils/calculator';
import type { FinalResult, PersonalityLabel } from '../../utils/types';
import html2canvas from 'html2canvas';

const router = useRouter();
const route = useRoute();

const showDetails = ref(false);
const showShareOptions = ref(false);
const result = ref<FinalResult | null>(null);
const label = ref<PersonalityLabel | null>(null);
const cardElement = ref<HTMLElement | null>(null);

const supportsWebShare = computed(() => {
  return typeof navigator !== 'undefined' && !!navigator.share;
});

onMounted(async () => {
  try {
    // 从路由状态中获取结果
    const state = history.state;
    if (state?.result) {
      result.value = state.result;
      label.value = await getLabelByIdFromAPI(result.value.labelId);
    }

    // 如果没有结果，重定向回首页
    if (!result.value) {
      router.push('/');
    }
  } catch (error) {
    alert(`加载标签详情失败：${(error as Error).message}`);
    router.push('/');
  }
});

const downloadImage = async () => {
  try {
    if (!cardElement.value) return;

    const canvas = await html2canvas(cardElement.value, {
      backgroundColor: '#ffffff',
      scale: 2,
    });

    // 将 canvas 转换为图片并下载
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `伴侣人格-${label.value?.name}-${Date.now()}.png`;
    link.click();

    showShareOptions.value = false;
    alert('图片已下载！');
  } catch (error) {
    alert(`生成图片失败：${(error as Error).message}`);
  }
};

const copyShareLink = () => {
  const shareText = `我的伴侣人格是"${label.value?.name}"！你的呢？\n${window.location.origin}?result=${result.value?.userId}`;

  navigator.clipboard.writeText(shareText).then(() => {
    showShareOptions.value = false;
    alert('已复制到剪贴板！');
  }).catch(() => {
    alert('复制失败，请重试');
  });
};

const shareViaWebShare = () => {
  if (!navigator.share) return;

  navigator.share({
    title: '伴侣人格测试',
    text: `我的伴侣人格是"${label.value?.name}"！你的呢？`,
    url: `${window.location.origin}?result=${result.value?.userId}`,
  }).then(() => {
    showShareOptions.value = false;
  }).catch(() => {
    // 用户取消分享，不需要显示错误
  });
};

const resetTest = () => {
  router.push('/');
};

const goHome = () => {
  router.push('/');
};

</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.result-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  overflow-x: hidden;
}

.result-container {
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  min-height: auto;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  margin: auto;
}

/* 屏幕 1: 标签展示 */
.result-screen-1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 30px 40px;
  min-height: auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.label-display {
  margin-bottom: 40px;
}

.label-emoji {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: bounce 0.6s ease-in-out;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.label-name {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 15px;
  letter-spacing: 1px;
}

.label-desc {
  font-size: 1rem;
  opacity: 0.95;
  margin-bottom: 20px;
  line-height: 1.6;
}

.hint {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 20px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

.btn-detail {
  padding: 14px 40px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-detail:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* 屏幕 2: 详细解读 */
.result-screen-2 {
  padding: 30px;
  overflow-y: auto;
  flex: 1;
}

.btn-back {
  background: none;
  border: none;
  color: #667eea;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
  transition: all 0.2s ease;
}

.btn-back:hover {
  transform: translateX(-3px);
}

.detail-content h2 {
  font-size: 2rem;
  color: #667eea;
  margin-bottom: 30px;
  text-align: center;
}

.section {
  margin-bottom: 25px;
}

.section h3 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
}

.section p {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.8;
  text-align: justify;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.btn {
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-share {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-share:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-retry {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(245, 87, 108, 0.4);
}

.btn-home {
  background: #e0e0e0;
  color: #333;
}

.btn-home:hover {
  background: #d0d0d0;
}

/* 结果卡片（用于生成图片） */
.result-card-for-image {
  position: fixed;
  top: -9999px;
  left: -9999px;
  width: 500px;
  padding: 40px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  text-align: center;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
}

.card-header {
  margin-bottom: 30px;
}

.card-emoji {
  font-size: 4rem;
  margin-bottom: 20px;
}

.card-title {
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: 1px;
}

.card-content {
  font-size: 1rem;
  line-height: 1.6;
}

.card-desc {
  margin-bottom: 20px;
  opacity: 0.95;
}

.card-footer {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* 分享选项模态框 */
.share-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.share-modal-content {
  background: white;
  border-radius: 20px;
  padding: 30px 20px;
  max-width: 400px;
  width: 100%;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-modal-content h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 25px;
  text-align: center;
}

.share-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.share-option {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.share-option:hover {
  border-color: #667eea;
  background: #f5f5ff;
  transform: translateX(5px);
}

.share-option .icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.share-option .label {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .result-page {
    padding: 10px;
    min-height: 100vh;
  }

  .result-container {
    max-height: 95vh;
  }

  .result-screen-1 {
    padding: 30px 20px 25px;
    min-height: auto;
  }

  .label-name {
    font-size: 2rem;
  }

  .label-emoji {
    font-size: 3rem;
  }

  .label-desc {
    font-size: 0.95rem;
  }

  .btn-detail {
    padding: 12px 25px;
    font-size: 0.9rem;
  }

  .result-screen-2 {
    padding: 20px;
  }

  .detail-content h2 {
    font-size: 1.3rem;
    margin-bottom: 20px;
  }

  .section {
    margin-bottom: 18px;
  }

  .section h3 {
    font-size: 1rem;
    margin-bottom: 8px;
  }

  .section p {
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .action-buttons {
    gap: 10px;
    margin-top: 25px;
    padding-top: 15px;
  }

  .btn {
    padding: 11px 14px;
    font-size: 0.85rem;
  }
}
</style>
