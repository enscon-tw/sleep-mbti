import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 文案生成的 prompt
const TEXT_SYSTEM_PROMPT = `你是一位擅長洞察人性的海洋生物學家，說話風格幽默、一針見血，但最後總會給予溫暖的支持。

任務：根據使用者的測驗回答，創造一個結合「現代人微情緒/文明病」的「海洋生物分身」。

命名風格範例：
- 深海社恐花園鰻
- deadline衝刺旗魚
- 躺平主義海獺
- 焦慮過載水母
- 拖延症海參

請用繁體中文回覆，並以 JSON 格式輸出：
{
  "animal": "角色名稱（現代文明病+海洋生物）",
  "subtitle": "副標題（4-8字的角色定位）",
  "icon": "一個代表該生物的 emoji",
  "tags": ["#標籤1", "#標籤2", "#標籤3"],
  "stats": {
    "sensitivity": 0-100的數字,
    "imagination": 0-100的數字,
    "ritual": 0-100的數字
  },
  "soulWhisper": "靈魂私語：先幽默吐槽用戶的回答特徵，再給予溫暖理解（80-120字）",
  "nightWeight": "夜晚的重量：描述這類人在深夜的心理狀態和掙扎（60-100字）",
  "sleepTip": "好眠處方箋：給予實用又帶點幽默的睡眠建議（60-100字）",
  "quote": "一句療癒或有共鳴的金句（15-25字）",
  "imagePrompt": "用英文描述這個海洋生物的外觀特徵，要融入現代元素，適合可愛插畫風格（30-50字英文）"
}`;

// 生成文案
export async function generateContent(answers) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const answersText = answers.map((a, i) => `問題${i + 1}: ${a}`).join('\n');

  const prompt = `${TEXT_SYSTEM_PROMPT}

使用者的測驗回答：
${answersText}

請根據這些回答，創造一個獨特的海洋生物分身。只輸出 JSON，不要有其他文字。`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // 解析 JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse JSON from response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Gemini text generation error:', error);
    throw error;
  }
}

// 生成圖片
export async function generateImage(imagePrompt) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image' });

  const stylePrompt = `Create an illustration of: ${imagePrompt}

Style: crayon drawing style, colored pencil texture, child's drawing, naive art, hand-drawn illustration, rough black outlines, waxy texture, imperfect coloring, flat colors, simple shapes, cute, minimalist off-white paper background.

The creature should look friendly and relatable, with a slightly tired or modern-life-stressed expression that's still endearing.`;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: stylePrompt }] }],
      generationConfig: {
        responseModalities: ['image', 'text'],
      },
    });

    const response = result.response;
    const parts = response.candidates[0].content.parts;

    // 找到圖片部分
    for (const part of parts) {
      if (part.inlineData) {
        return {
          mimeType: part.inlineData.mimeType,
          data: part.inlineData.data // base64 encoded
        };
      }
    }

    throw new Error('No image generated');
  } catch (error) {
    console.error('Gemini image generation error:', error);
    throw error;
  }
}

// 完整生成流程
export async function generateResult(answers) {
  // 1. 生成文案
  const content = await generateContent(answers);

  // 2. 生成圖片
  let image = null;
  try {
    image = await generateImage(content.imagePrompt);
  } catch (error) {
    console.error('Image generation failed, using emoji fallback');
  }

  return {
    ...content,
    generatedImage: image
  };
}
