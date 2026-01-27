import express from 'express';
import { generateResult } from '../gemini.js';
import { saveGeneratedResult, getGeneratedResult } from '../db.js';

const router = express.Router();

// POST /api/generate - 生成隨機結果
router.post('/', async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers array is required' });
    }

    console.log('Generating result for answers:', answers);

    // 呼叫 Gemini 生成結果
    const result = await generateResult(answers);

    // 儲存到資料庫
    const id = await saveGeneratedResult(result);

    // 將圖片轉為 data URL 格式給前端
    const generatedImage = result.generatedImage
      ? `data:${result.generatedImage.mimeType};base64,${result.generatedImage.data}`
      : null;

    res.json({
      id,
      ...result,
      generatedImage
    });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ error: 'Failed to generate result', details: error.message });
  }
});

// GET /api/generate/:id - 取得生成的結果
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getGeneratedResult(id);

    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Get generated result error:', error);
    res.status(500).json({ error: 'Failed to get result' });
  }
});

export default router;
