import type { FinalResult, PersonalityLabel } from './types'

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

/**
 * 获取指定性别的题目 - 从后端 API 获取
 */
export async function getQuestionsFromAPI(gender: 'male' | 'female'): Promise<Question[]> {
  try {
    const response = await fetch(`http://localhost:7654/api/test/questions/${gender}`);
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    const data = await response.json();
    return data.data.questions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}

/**
 * 提交答题结果到后端计算
 */
export async function submitAnswersToAPI(
  gender: 'male' | 'female',
  answers: Record<number, number>
): Promise<FinalResult> {
  try {
    const response = await fetch('http://localhost:7654/api/test/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gender, answers }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit answers');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error submitting answers:', error);
    throw error;
  }
}

/**
 * 从后端获取所有标签
 */
export async function getLabelsFromAPI(): Promise<PersonalityLabel[]> {
  try {
    const response = await fetch('http://localhost:7654/api/test/labels');
    if (!response.ok) {
      throw new Error('Failed to fetch labels');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching labels:', error);
    throw error;
  }
}

/**
 * 根据 ID 从后端获取标签详情
 */
export async function getLabelByIdFromAPI(labelId: string): Promise<PersonalityLabel> {
  try {
    const response = await fetch(`http://localhost:7654/api/test/label/${labelId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch label');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching label:', error);
    throw error;
  }
}
