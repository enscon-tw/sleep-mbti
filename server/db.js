import pg from 'pg';

const { Pool } = pg;

// Debug: 顯示環境變數狀態
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

if (!process.env.DATABASE_URL) {
  console.error('WARNING: DATABASE_URL is not set!');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// 初始化資料庫表格
export async function initDB() {
  const client = await pool.connect();
  try {
    // 舊的 results 表（保留向下相容）
    await client.query(`
      CREATE TABLE IF NOT EXISTS results (
        id VARCHAR(8) PRIMARY KEY,
        mbti_type VARCHAR(4) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // 新的 generated_results 表（存放 AI 生成的結果）
    await client.query(`
      CREATE TABLE IF NOT EXISTS generated_results (
        id VARCHAR(8) PRIMARY KEY,
        animal VARCHAR(100) NOT NULL,
        subtitle VARCHAR(100),
        icon VARCHAR(10),
        tags JSONB,
        stats JSONB,
        soul_whisper TEXT,
        night_weight TEXT,
        sleep_tip TEXT,
        quote TEXT,
        image_prompt TEXT,
        generated_image TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('Database initialized');
  } finally {
    client.release();
  }
}

// 生成 8 字元短碼
function generateId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

// 儲存結果
export async function saveResult(mbtiType) {
  const id = generateId();
  await pool.query(
    'INSERT INTO results (id, mbti_type) VALUES ($1, $2)',
    [id, mbtiType]
  );
  return id;
}

// 取得結果
export async function getResult(id) {
  const result = await pool.query(
    'SELECT * FROM results WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

// 儲存 AI 生成的結果
export async function saveGeneratedResult(result) {
  const id = generateId();

  // 將圖片轉為 base64 字串儲存
  console.log('saveGeneratedResult - generatedImage exists:', !!result.generatedImage);
  if (result.generatedImage) {
    console.log('generatedImage mimeType:', result.generatedImage.mimeType);
    console.log('generatedImage data length:', result.generatedImage.data?.length || 0);
  }

  const imageData = result.generatedImage
    ? `data:${result.generatedImage.mimeType};base64,${result.generatedImage.data}`
    : null;

  console.log('imageData length:', imageData?.length || 0);

  await pool.query(
    `INSERT INTO generated_results
     (id, animal, subtitle, icon, tags, stats, soul_whisper, night_weight, sleep_tip, quote, image_prompt, generated_image)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
    [
      id,
      result.animal,
      result.subtitle,
      result.icon,
      JSON.stringify(result.tags),
      JSON.stringify(result.stats),
      result.soulWhisper,
      result.nightWeight,
      result.sleepTip,
      result.quote,
      result.imagePrompt,
      imageData
    ]
  );

  return id;
}

// 取得 AI 生成的結果
export async function getGeneratedResult(id) {
  const result = await pool.query(
    'SELECT * FROM generated_results WHERE id = $1',
    [id]
  );

  if (!result.rows[0]) return null;

  const row = result.rows[0];
  return {
    id: row.id,
    animal: row.animal,
    subtitle: row.subtitle,
    icon: row.icon,
    tags: row.tags,
    stats: row.stats,
    soulWhisper: row.soul_whisper,
    nightWeight: row.night_weight,
    sleepTip: row.sleep_tip,
    quote: row.quote,
    imagePrompt: row.image_prompt,
    generatedImage: row.generated_image,
    createdAt: row.created_at
  };
}

export default pool;
