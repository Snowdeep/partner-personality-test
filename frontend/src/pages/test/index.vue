<template>
  <div class="test-page">
    <!-- 进度条 -->
    <div class="progress-section">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
      <p class="progress-text">{{ currentQuestionIndex + 1 }}/{{ totalQuestions }}</p>
    </div>

    <!-- 题目容器 -->
    <div class="container">
      <!-- 题目 -->
      <div class="question-section" v-if="currentQuestion">
        <div class="emoji">{{ currentQuestion.emoji }}</div>
        <h2 class="question-text">{{ currentQuestion.question }}</h2>
      </div>

      <!-- 选项 -->
      <div class="options-section" v-if="currentQuestion">
        <button
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          class="option-button"
          :class="{ selected: selectedOptionIndex === index }"
          @click="selectOption(index)"
        >
          {{ option.text }}
        </button>
        <button
          class="option-button unknown"
          :class="{ selected: selectedOptionIndex === 4 }"
          @click="selectOption(4)"
        >
          🤔 不太了解/看情况
        </button>
      </div>

      <!-- 导航按钮 -->
      <div class="navigation-section">
        <button
          class="btn btn-prev"
          @click="prevQuestion"
          :disabled="currentQuestionIndex === 0"
        >
          ← 上一题
        </button>
        <button
          class="btn btn-next"
          @click="nextQuestion"
          :disabled="selectedOptionIndex === -1"
        >
          下一题 →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Question } from '../../utils/calculator';
import { getQuestions, calculateResult } from '../../utils/calculator';

const route = useRoute();
const router = useRouter();

const gender = computed(() => (route.params.gender as string) || 'male');
const questions = ref<Question[]>([]);
const currentQuestionIndex = ref(0);
const selectedOptionIndex = ref(-1);
const answers = ref<Record<number, number>>({});

onMounted(() => {
  questions.value = getQuestions(gender.value as 'male' | 'female');
});

const totalQuestions = computed(() => questions.value.length);
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
const progressPercent = computed(
  () => ((currentQuestionIndex.value + 1) / totalQuestions.value) * 100
);

const selectOption = (index: number) => {
  selectedOptionIndex.value = index;
  // 记录答题
  answers.value[currentQuestion.value.id] = index;
};

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
    selectedOptionIndex.value = answers.value[currentQuestion.value.id] ?? -1;
  }
};

const nextQuestion = async () => {
  if (selectedOptionIndex.value === -1) {
    alert('请选择一个选项');
    return;
  }

  // 记录答题
  answers.value[currentQuestion.value.id] = selectedOptionIndex.value;

  if (currentQuestionIndex.value < totalQuestions.value - 1) {
    // 进入下一题
    currentQuestionIndex.value++;
    selectedOptionIndex.value =
      answers.value[currentQuestion.value.id] ?? -1;
  } else {
    // 计算结果
    try {
      const result = calculateResult(answers.value, gender.value as 'male' | 'female');
      // 跳转到结果页
      router.push({
        name: 'result',
        params: {
          resultId: result.userId,
        },
        state: { result },
      });
    } catch (error) {
      alert(`计算结果出错：${(error as Error).message}`);
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.test-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}

/* 进度条 */
.progress-section {
  max-width: 500px;
  margin: 30px auto 20px;
  padding: 0 20px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #f093fb 100%);
  transition: width 0.3s ease;
  border-radius: 10px;
}

.progress-text {
  text-align: center;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
}

/* 容器 */
.container {
  max-width: 500px;
  margin: 20px auto;
  background: white;
  border-radius: 16px;
  padding: 40px 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

/* 题目部分 */
.question-section {
  text-align: center;
  margin-bottom: 40px;
}

.emoji {
  font-size: 3rem;
  margin-bottom: 20px;
}

.question-text {
  font-size: 1.3rem;
  color: #333;
  line-height: 1.6;
  font-weight: 600;
}

/* 选项部分 */
.options-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 40px;
}

.option-button {
  padding: 16px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  background: white;
  color: #333;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  line-height: 1.5;
}

.option-button:hover:not(:disabled) {
  border-color: #667eea;
  background: #f5f5ff;
  transform: translateX(5px);
}

.option-button.selected {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.option-button.unknown {
  margin-top: 10px;
  border-color: #ddd;
  color: #666;
}

.option-button.unknown.selected {
  border-color: #ffd700;
  background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
  color: white;
}

.option-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 导航按钮 */
.navigation-section {
  display: flex;
  gap: 15px;
  justify-content: space-between;
}

.btn {
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-prev {
  background: #e0e0e0;
  color: #333;
}

.btn-prev:hover:not(:disabled) {
  background: #d0d0d0;
}

.btn-next {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-next:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .container {
    padding: 30px 20px;
  }

  .question-text {
    font-size: 1.1rem;
  }

  .option-button {
    font-size: 0.9rem;
    padding: 14px 16px;
  }

  .navigation-section {
    flex-direction: column;
  }
}
</style>
