import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB, getResult } from './db.js';
import resultsRouter from './routes/results.js';
import { results as mbtiResults } from './results-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API 路由
app.use('/api/results', resultsRouter);

// 分享頁面 - 生成帶有 OG meta tags 的 HTML
app.get('/share/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getResult(id);

    if (!result) {
      return res.redirect('/');
    }

    const mbtiType = result.mbti_type;
    const mbtiData = mbtiResults[mbtiType];

    if (!mbtiData) {
      return res.redirect('/');
    }

    const baseUrl = process.env.BASE_URL || `https://${req.get('host')}`;
    const shareUrl = `${baseUrl}/share/${id}`;
    const ogImage = `${baseUrl}/og-images/${mbtiType}.png`;
    const title = `${mbtiData.icon} ${mbtiData.animal} - ${mbtiData.subtitle}`;
    const description = mbtiData.soulWhisper;

    // 生成帶有 OG tags 的 HTML，並自動重定向到前端應用
    const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | 深夜靈魂圖鑑</title>

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${shareUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:site_name" content="深夜靈魂圖鑑">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${shareUrl}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${ogImage}">

  <!-- LINE -->
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <!-- Redirect to app with result -->
  <meta http-equiv="refresh" content="0; url=/?result=${mbtiType}">
  <script>
    window.location.href = '/?result=${mbtiType}';
  </script>
</head>
<body>
  <p>正在載入你的深夜靈魂圖鑑結果...</p>
  <p><a href="/?result=${mbtiType}">點此查看結果</a></p>
</body>
</html>`;

    res.type('html').send(html);
  } catch (error) {
    console.error('Error serving share page:', error);
    res.redirect('/');
  }
});

// 靜態檔案服務（前端 build）
app.use(express.static(path.join(__dirname, '../dist')));

// SPA fallback - 所有其他路由都返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// 啟動伺服器
async function start() {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
