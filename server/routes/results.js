import express from 'express';
import { saveResult, getResult } from '../db.js';

const router = express.Router();

// POST /api/results - 儲存測驗結果
router.post('/', async (req, res) => {
  try {
    const { mbtiType } = req.body;

    if (!mbtiType || !/^[EI][NS][TF][JP]$/.test(mbtiType)) {
      return res.status(400).json({ error: 'Invalid MBTI type' });
    }

    const id = await saveResult(mbtiType);
    res.json({ id, mbtiType });
  } catch (error) {
    console.error('Error saving result:', error);
    res.status(500).json({ error: 'Failed to save result' });
  }
});

// GET /api/results/:id - 取得測驗結果
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getResult(id);

    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error getting result:', error);
    res.status(500).json({ error: 'Failed to get result' });
  }
});

export default router;
