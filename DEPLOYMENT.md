# 鯊魚 JUMP - 部署指南

本專案使用 Next.js 16，可以部署到多個平台。以下是推薦的部署方式：

## 🚀 方式一：Vercel（最推薦）

Vercel 是 Next.js 的官方平台，部署最簡單且功能最完整。

### 步驟：

1. **安裝 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登入 Vercel**
   ```bash
   vercel login
   ```
   - 選擇您偏好的登入方式（GitHub、GitLab、Bitbucket 或 Email）

3. **部署**
   ```bash
   vercel
   ```
   - 第一次執行時會詢問幾個問題，通常直接按 Enter 使用預設值即可
   - 部署完成後會得到一個預覽網址

4. **部署到正式環境**
   ```bash
   vercel --prod
   ```

### 使用 Vercel Dashboard 部署（無需 CLI）：

1. 前往 [vercel.com](https://vercel.com)
2. 使用 GitHub/GitLab/Bitbucket 帳號註冊登入
3. 點擊「Add New Project」
4. 匯入您的 Git 倉庫（需先將專案推送到 GitHub/GitLab/Bitbucket）
5. Vercel 會自動偵測 Next.js 專案並配置
6. 點擊「Deploy」即可！

**優點：**
- ✅ 零配置，自動偵測 Next.js 設定
- ✅ 自動 SSL 憑證
- ✅ 全球 CDN
- ✅ 每次 git push 自動部署
- ✅ 預覽網址（每個分支和 PR 都有獨立網址）
- ✅ 免費方案足夠個人專案使用

---

## 🌐 方式二：Netlify

Netlify 也是很受歡迎的選擇，操作簡單。

### 步驟：

1. 前往 [netlify.com](https://netlify.com)
2. 註冊並登入
3. 點擊「Add new site」→「Import an existing project」
4. 連接您的 Git 倉庫
5. Build 設定：
   - Build command: `npm run build` 或 `pnpm build`
   - Publish directory: `.next`
6. 點擊「Deploy」

**優點：**
- ✅ 介面友善
- ✅ 免費方案慷慨
- ✅ 自動部署

---

## 📦 方式三：GitHub Pages（靜態匯出）

如果要完全免費且使用 GitHub Pages，需要將 Next.js 專案匯出為靜態網站。

### 步驟：

1. **修改 `next.config.mjs`**，加入 `output: 'export'`：
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     typescript: {
       ignoreBuildErrors: true,
     },
     images: {
       unoptimized: true,
     },
   }
   
   export default nextConfig
   ```

2. **修改 `package.json`**，加入 export 指令：
   ```json
   "scripts": {
     "dev": "next dev",
     "build": "next build",
     "start": "next start",
     "lint": "eslint .",
     "export": "next build"
   }
   ```

3. **建置靜態檔案**：
   ```bash
   npm run build
   ```

4. **部署到 GitHub Pages**：
   - 將 `out` 資料夾的內容推送到 `gh-pages` 分支
   - 或使用 GitHub Actions 自動化部署

**限制：**
- ⚠️ 僅支援靜態功能（SSR、API Routes 無法使用）
- ⚠️ 需要手動處理路由

---

## 🐳 方式四：Docker + 雲端平台

適合需要更多控制權的情況。

### 建立 Dockerfile：

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable pnpm && pnpm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]
```

可以部署到：
- AWS (ECS, EC2, App Runner)
- Google Cloud Run
- Azure Container Apps
- Railway
- Render

---

## 🎯 推薦選擇

| 平台 | 適合情境 | 難度 |
|------|---------|------|
| **Vercel** | Next.js 專案首選 | ⭐ 簡單 |
| **Netlify** | 想要簡單部署 | ⭐ 簡單 |
| **GitHub Pages** | 完全免費，僅靜態內容 | ⭐⭐ 中等 |
| **Docker + 雲端** | 需要完全控制 | ⭐⭐⭐ 困難 |

## 📝 部署前檢查清單

- [ ] 確認所有變更已提交到 Git
- [ ] 測試本地建置：`npm run build && npm start`
- [ ] 檢查環境變數（如果有使用）
- [ ] 確認 `.gitignore` 正確設定
- [ ] 移除敏感資訊（API keys、密碼等）

## 🔗 將專案推送到 GitHub（如需要）

如果您還沒有將專案推送到 GitHub：

```bash
# 在 GitHub 建立新的倉庫後
git remote add origin https://github.com/你的帳號/boboli.git
git branch -M main
git push -u origin main
```

---

## 💡 建議

對於「鯊魚 JUMP」這個專案，**強烈推薦使用 Vercel**：
1. 最簡單快速
2. 免費且功能完整
3. 已經安裝了 `@vercel/analytics`
4. 自動處理 Next.js 的所有功能

只需要 3 個指令就能完成部署：
```bash
npm install -g vercel  # 安裝 Vercel CLI
vercel login           # 登入
vercel --prod          # 部署到正式環境
```

