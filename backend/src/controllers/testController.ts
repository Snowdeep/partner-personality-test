import questions from '../../../data/questions.json' assert { type: 'json' };
import mappings from '../../../data/mappings.json' assert { type: 'json' };
import labels from '../../../data/labels.json' assert { type: 'json' };

export interface Question {
  id: number;
  gender: 'both' | 'male' | 'female';
  category: 'attitude' | 'traits' | 'interaction' | 'communication';
  question: string;
  emoji: string;
  options: Array<{
    text: string;
    weights: Record<string, string>;
  }>;
}

export interface ScoreResult {
  attitude: Record<string, number>;
  traits: Record<string, number>;
  interaction: Record<string, number>;
  communication: Record<string, number>;
}

export interface FinalResult {
  userId: string;
  gender: 'male' | 'female';
  scores: ScoreResult;
  result: {
    attitude: string;
    traits: string;
    interaction: string;
    communication: string;
  };
  labelId: string;
  labelName: string;
  timestamp: Date;
}

/**
 * 获取指定性别的题目
 */
export function getQuestions(gender: 'male' | 'female'): Question[] {
  return (questions.questions as Question[]).filter(
    (q) => q.gender === 'both' || q.gender === gender
  );
}

/**
 * 计算用户答题的最终结果
 */
export function calculateResult(
  answers: Record<number, number>,
  gender: 'male' | 'female'
): FinalResult {
  const questionsList = getQuestions(gender);

  // 初始化四个维度的得分
  const scores: ScoreResult = {
    attitude: {
      '专一深情': 0,
      '温柔暖男/暖女': 0,
      '浪漫花心': 0,
      '理性冷静': 0,
    },
    traits: {
      '甜蜜可爱': 0,
      '独立自信': 0,
      '幽默风趣': 0,
      '沉静深邃': 0,
    },
    interaction: {
      '粘人缠绵': 0,
      '陪伴贴心': 0,
      '自在独立': 0,
      '有点冷淡': 0,
    },
    communication: {
      '温言细语': 0,
      '直言快语': 0,
      '幽默逗趣': 0,
      '沉默寡言': 0,
    },
  };

  // 遍历所有答题
  let effectiveAnswerCount = 0;
  for (const [questionIdStr, optionIndex] of Object.entries(answers)) {
    const questionId = parseInt(questionIdStr);
    const question = questionsList.find((q) => q.id === questionId);

    if (!question) continue;

    // 跳过"不知道"选项（index 4）
    if (optionIndex === 4) continue;

    effectiveAnswerCount++;

    const selectedOption = question.options[optionIndex];
    if (!selectedOption) continue;

    // 根据选项的权重给各维度加分
    for (const [dimension, value] of Object.entries(selectedOption.weights)) {
      if (dimension in scores && typeof value === 'string') {
        scores[dimension as keyof ScoreResult][value] += 1;
      }
    }
  }

  // 检查维度有效性（至少回答了 3 题）
  if (effectiveAnswerCount < 3) {
    throw new Error(
      `答题不足，请重新测试。有效答题数：${effectiveAnswerCount}`
    );
  }

  // 确定每个维度的结果
  const result = {
    attitude: findMaxOption(scores.attitude),
    traits: findMaxOption(scores.traits),
    interaction: findMaxOption(scores.interaction),
    communication: findMaxOption(scores.communication),
  };

  // 查找对应的标签
  const labelId = findLabelByCombination(result);
  const label = labels.labels.find((l: any) => l.id === labelId);

  if (!label) {
    throw new Error(`找不到对应的人格标签`);
  }

  return {
    userId: generateUserId(),
    gender,
    scores,
    result,
    labelId,
    labelName: label.name,
    timestamp: new Date(),
  };
}

/**
 * 找到得分最高的选项
 */
function findMaxOption(optionsScores: Record<string, number>): string {
  let maxOption = '';
  let maxScore = -1;

  for (const [option, score] of Object.entries(optionsScores)) {
    if (score > maxScore) {
      maxScore = score;
      maxOption = option;
    }
  }

  if (maxOption === '') {
    throw new Error('No valid option found');
  }

  return maxOption;
}

/**
 * 根据四维度组合查找对应的标签 ID
 */
function findLabelByCombination(result: {
  attitude: string;
  traits: string;
  interaction: string;
  communication: string;
}): string {
  const key = JSON.stringify(result);
  const labelMappingsObj = mappings.labelMappings as Record<string, string>;
  const labelId = labelMappingsObj[key];

  if (!labelId) {
    // 如果找不到完全匹配的组合，返回默认标签（第 16 个）
    console.warn('找不到完全匹配的标签组合，使用默认标签');
    return '16';
  }

  return labelId;
}

/**
 * 根据 ID 获取标签详情
 */
export function getLabelById(labelId: string): any {
  return labels.labels.find((l: any) => l.id === labelId);
}

/**
 * 生成用户 ID
 */
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * 获取所有维度的选项
 */
export function getDimensionOptions(): any {
  return mappings.dimensionOptions;
}
