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
            <button class="btn btn-share" @click="handleShare">
              📤 分享这个结果
            </button>
            <button class="btn btn-retry" @click="goHome">
              🔄 重新测试
            </button>
            <button class="btn btn-home" @click="goHome">
              🏠 返回首页
            </button>
          </div>
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

const router = useRouter();
const route = useRoute();

const showDetails = ref(false);
const result = ref<FinalResult | null>(null);
const label = ref<PersonalityLabel | null>(null);

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

const handleShare = () => {
  // 生成分享文本
  const shareText = `我的伴侣人格是"${label.value?.name}"！你的呢？点击链接测一下吧～`;

  // 微信小程序分享（如果在小程序环境中）
  if (typeof wx !== 'undefined' && wx.shareAppMessage) {
    wx.shareAppMessage({
      title: shareText,
      path: `/pages/result/index?resultId=${result.value?.userId}`,
      imageUrl: 'https://example.com/share-image.jpg', // 需要替换为实际的分享图片URL
    });
  } else {
    // Web 环境分享
    const url = `${window.location.origin}?result=${result.value?.userId}`;
    const text = `${shareText}\n${url}`;

    if (navigator.share) {
      navigator.share({
        title: '伴侣人格测试',
        text: shareText,
        url: url,
      });
    } else {
      // 降级方案：复制到剪贴板
      navigator.clipboard.writeText(text).then(() => {
        alert('已复制到剪贴板！');
      });
    }
  }
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
