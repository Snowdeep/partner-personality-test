import { Router, Request, Response } from 'express';
import { calculateResult, getQuestions, getLabelById } from '../controllers/testController.js';
import labels from '../../data/labels.json' assert { type: 'json' };

export const testRouter = Router();

/**
 * POST /api/test/submit
 * 提交用户答题结果，计算人格
 */
testRouter.post('/submit', (req: Request, res: Response) => {
  try {
    const { gender, answers } = req.body;

    // 验证输入
    if (!gender || !answers) {
      return res.status(400).json({
        error: '缺少必要参数: gender 和 answers',
      });
    }

    if (gender !== 'male' && gender !== 'female') {
      return res.status(400).json({
        error: '无效的性别参数，必须是 male 或 female',
      });
    }

    // 计算结果
    const result = calculateResult(answers, gender);

    // 返回结果
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({
      error: errorMessage,
    });
  }
});

/**
 * GET /api/test/labels
 * 获取所有人格标签定义
 */
testRouter.get('/labels', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: labels.labels,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch labels',
    });
  }
});

/**
 * GET /api/test/label/:id
 * 获取指定 ID 的标签详情
 */
testRouter.get('/label/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const label = labels.labels.find((l: any) => l.id === id);

    if (!label) {
      return res.status(404).json({
        error: `Label with id ${id} not found`,
      });
    }

    res.json({
      success: true,
      data: label,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch label',
    });
  }
});

/**
 * GET /api/test/questions/:gender
 * 获取指定性别的题库
 */
testRouter.get('/questions/:gender', (req: Request, res: Response) => {
  try {
    const { gender } = req.params;

    if (gender !== 'male' && gender !== 'female') {
      return res.status(400).json({
        error: '无效的性别参数，必须是 male 或 female',
      });
    }

    const questions = getQuestions(gender as 'male' | 'female');

    res.json({
      success: true,
      data: {
        gender,
        total: questions.length,
        questions,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      error: errorMessage,
    });
  }
});
