# 深夜靈魂圖鑑 - Railway 部署指南

## 部署步驟

### 1. 在 Railway 新增 PostgreSQL 資料庫

1. 登入 [Railway](https://railway.app)
2. 進入你的 `sleep-mbti` 專案
3. 點擊 **+ New** → **Database** → **Add PostgreSQL**
4. 等待資料庫建立完成

### 2. 設定環境變數

在你的 Railway 服務中新增以下環境變數：

| 變數名稱 | 值 | 說明 |
|---------|---|------|
| `DATABASE_URL` | （自動從 PostgreSQL 取得）| 點擊 PostgreSQL 服務 → Variables → 複製 `DATABASE_URL` |
| `NODE_ENV` | `production` | 生產環境設定 |
| `BASE_URL` | `https://你的網域.up.railway.app` | 用於 OG meta tags |

**設定 DATABASE_URL 的方法：**
1. 點擊 PostgreSQL 服務
2. 進入 **Variables** 頁籤
3. 找到 `DATABASE_URL`，點擊複製
4. 回到你的主服務，進入 **Variables**
5. 新增 `DATABASE_URL` 並貼上剛才複製的值

或者使用 Railway 的變數引用：
- 在主服務的 Variables 中新增：`DATABASE_URL` = `${{Postgres.DATABASE_URL}}`

### 3. 更新部署設定

確認 Railway 服務設定：

- **Build Command**: `npm run build`
- **Start Command**: `npm start`

### 4. 推送程式碼

```bash
git add .
git commit -m "Add database and social sharing features"
git push
```

Railway 會自動偵測推送並重新部署。

### 5. 驗證部署

部署完成後，檢查：

1. 主頁面是否正常載入：`https://你的網域.up.railway.app`
2. API 是否正常：`https://你的網域.up.railway.app/api/results` (POST)
3. 分享功能是否正常運作

## OG 預覽圖片

為了讓社群分享有漂亮的預覽圖，需要準備 16 張 OG 圖片：

### 圖片規格
- 尺寸：1200 x 630 像素
- 格式：PNG
- 命名：`{MBTI類型}.png`（例如：`INTJ.png`, `ENFP.png`）

### 需要的圖片
放置於 `public/og-images/` 目錄：

```
public/og-images/
├── INTJ.png
├── INTP.png
├── ENTJ.png
├── ENTP.png
├── INFJ.png
├── INFP.png
├── ENFJ.png
├── ENFP.png
├── ISTJ.png
├── ISFJ.png
├── ESTJ.png
├── ESFJ.png
├── ISTP.png
├── ISFP.png
├── ESTP.png
└── ESFP.png
```

### 圖片內容建議
每張圖片可包含：
- 動物 emoji 或插圖
- 動物名稱
- 副標題
- 「深夜靈魂圖鑑」標誌

## 本地開發

### 啟動後端（需要 PostgreSQL）

```bash
# 設定環境變數
export DATABASE_URL="postgresql://localhost:5432/sleep_mbti"

# 啟動後端
cd server
npm install
npm run dev
```

### 啟動前端

```bash
# 在專案根目錄
npm run dev
```

### 同時開發
- 前端運行在 `http://localhost:5173`
- 後端運行在 `http://localhost:3000`
- 前端會自動將 API 請求代理到後端

## 故障排除

### 資料庫連線錯誤
- 確認 `DATABASE_URL` 環境變數已正確設定
- 確認 PostgreSQL 服務正在運行

### OG 預覽不顯示
- 確認圖片已上傳到 `public/og-images/`
- 使用 [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) 測試
- OG 圖片需要可公開存取

### 分享連結無法開啟
- 確認 `BASE_URL` 環境變數正確
- 檢查後端日誌是否有錯誤
