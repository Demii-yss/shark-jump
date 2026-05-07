# 📦 將鯊魚 JUMP 推送到 GitHub 並部署到 Vercel

您的專案已經準備好了！現在請按照以下步驟操作：

---

## 🎯 步驟 1：在 GitHub 建立新倉庫

### 1.1 前往 GitHub
在瀏覽器中開啟：**https://github.com/new**

### 1.2 填寫倉庫資訊
- **Repository name**（倉庫名稱）：輸入 `boboli` 或 `shark-jump`（您喜歡的名稱）
- **Description**（描述）：可選填，例如：「鯊魚 JUMP 漫畫網站」
- **Public / Private**：選擇 **Public**（公開）
- ⚠️ **重要**：**不要勾選** "Add a README file"
- ⚠️ **重要**：**不要勾選** "Add .gitignore"
- ⚠️ **重要**：**不要勾選** "Choose a license"

### 1.3 點擊「Create repository」按鈕

建立完成後，GitHub 會顯示一個頁面，上面有您的倉庫網址，類似：
```
https://github.com/您的帳號/boboli.git
```

**請複製這個網址！** 👆

---

## 🚀 步驟 2：推送專案到 GitHub

### 2.1 回到這個終端機視窗

### 2.2 執行以下指令（請將網址換成您的）

```bash
# 設定 GitHub 倉庫（將下面的網址換成您剛才複製的網址）
git remote add origin https://github.com/您的帳號/您的倉庫名稱.git

# 將分支改名為 main
git branch -M main

# 推送到 GitHub
git push -u origin main
```

執行完成後，重新整理 GitHub 網頁，您應該會看到所有檔案都已上傳！

---

## 🌐 步驟 3：在 Vercel 部署

### 3.1 前往 Vercel
在瀏覽器中開啟：**https://vercel.com/new**

### 3.2 登入或註冊
- 點擊「Continue with GitHub」使用 GitHub 帳號登入
- 如果是第一次使用，需要授權 Vercel 存取您的 GitHub

### 3.3 匯入專案
1. 在「Import Git Repository」頁面中，找到您剛才建立的倉庫（boboli 或 shark-jump）
2. 點擊該倉庫旁的「Import」按鈕

### 3.4 設定專案（通常不需要改動）
Vercel 會自動偵測到這是 Next.js 專案，並自動設定：
- **Framework Preset**: Next.js
- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Install Command**: 自動偵測（npm 或 pnpm）

✅ **直接使用預設值即可！**

### 3.5 點擊「Deploy」按鈕

部署開始！您會看到：
- 📦 安裝依賴套件...
- 🔨 建置專案...
- 🚀 部署中...

通常 **1-3 分鐘**就會完成！

---

## 🎉 步驟 4：查看您的網站

部署完成後，Vercel 會顯示：
- ✅ **恭喜畫面**
- 🔗 **您的網站網址**（例如：https://boboli-xxx.vercel.app）

點擊「Visit」或直接點擊網址，就能看到您的「鯊魚 JUMP」網站上線了！🦈

---

## 📝 下一步（可選）

### 自動化部署（已自動設定）
現在每次您執行 `git push`，Vercel 都會自動重新部署網站！

### 自訂網域名稱
1. 在 Vercel Dashboard 中，進入您的專案
2. 點擊「Settings」→「Domains」
3. 輸入您的網域名稱
4. 按照指示設定 DNS

### 查看部署記錄
在 Vercel Dashboard 的「Deployments」頁面，可以看到：
- 每次部署的記錄
- 部署時間
- 建置日誌
- 預覽網址

---

## 🆘 如果遇到問題

### GitHub 推送失敗
```bash
# 檢查 remote 是否設定正確
git remote -v

# 如果設定錯誤，刪除後重新設定
git remote remove origin
git remote add origin https://github.com/您的帳號/您的倉庫名稱.git
```

### Vercel 建置失敗
- 查看 Vercel 的建置日誌（Build Logs）
- 通常錯誤訊息會很清楚
- 本專案已經在本地測試通過，應該不會有問題

### 需要重新部署
在 Vercel Dashboard 中：
1. 進入專案
2. 點擊「Deployments」
3. 點擊最新的部署
4. 點擊右上角的「···」→「Redeploy」

---

## ✅ 檢查清單

完成以後，您應該有：
- ✅ GitHub 倉庫（可以在 github.com/您的帳號 看到）
- ✅ Vercel 專案（可以在 vercel.com/dashboard 看到）
- ✅ 線上網站（可以透過 .vercel.app 網址訪問）
- ✅ 自動部署（每次 git push 自動更新）

---

## 🎯 快速指令總結

```bash
# 1. 設定 GitHub remote（記得換成您的網址）
git remote add origin https://github.com/您的帳號/boboli.git

# 2. 改名分支為 main
git branch -M main

# 3. 推送到 GitHub
git push -u origin main
```

然後前往 **https://vercel.com/new** 匯入並部署！

---

**祝您部署順利！** 🚀🦈✨

如果有任何問題，請隨時詢問！

