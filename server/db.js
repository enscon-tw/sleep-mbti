import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// 初始化資料庫表格
export async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS results (
        id VARCHAR(8) PRIMARY KEY,
        mbti_type VARCHAR(4) NOT NULL,
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

export default pool;
