FROM node:22-alpine

WORKDIR /app

# 複製 package files
COPY package*.json ./
COPY server/package*.json ./server/

# 安裝根目錄依賴
RUN npm ci

# 安裝 server 依賴
WORKDIR /app/server
RUN npm ci

WORKDIR /app

# 複製所有檔案
COPY . .

# 建置前端
RUN npm run build

# 設定環境變數
ENV NODE_ENV=production

# 暴露 port
EXPOSE 3000

# 啟動服務
CMD ["npm", "run", "start"]
