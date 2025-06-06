LINE AI聊天機器人
一個使用Node.js開發的LINE智慧聊天機器人，具備AI回覆功能。

功能特色
🤖 智能AI回覆
💬 關鍵字回覆
🔄 自動部署
🌐 24/7運行
🆓 完全免費
快速開始
1. 建立LINE Bot
前往 LINE Developers Console
建立新的Provider和Messaging API Channel
取得Channel Access Token和Channel Secret
2. 部署到Render
Fork這個專案到你的GitHub
前往 Render.com 註冊
建立新的Web Service
連接你的GitHub倉庫
設定環境變數
3. 設定環境變數
在Render的Environment Variables中設定：

LINE_CHANNEL_ACCESS_TOKEN=你的存取權杖
LINE_CHANNEL_SECRET=你的頻道密鑰
HUGGINGFACE_API_KEY=你的HuggingFace API Key (可選)
PORT=10000
4. 設定Webhook
在LINE Developers Console中設定：

Webhook URL: https://你的app名稱.onrender.com/webhook
啟用 Use webhook
本地開發
安裝依賴
npm install
設定環境變數
cp .env.example .env
# 編輯 .env 檔案並填入你的設定
啟動開發伺服器
npm run dev
測試伺服器
npm start
API端點
GET / - 健康檢查
GET /health - 詳細健康狀態
POST /webhook - LINE Webhook端點
聊天機器人功能
關鍵字回覆
你好 → 問候回覆
謝謝 → 感謝回應
時間 → 顯示當前時間
幫助 → 使用說明
AI智能回覆
使用Hugging Face免費API
支援中文對話
上下文理解
預設回覆
智能問題識別
情境感知回覆
隨機友善回應
部署說明
Render.com部署
自動從GitHub部署
支援環境變數設定
SSL憑證自動配置
免費方案每月750小時
環境需求
Node.js 14+
LINE Messaging API
網路連線
故障排除
常見問題
Webhook驗證失敗

檢查Channel Secret是否正確
確認Webhook URL正確設定
機器人無回應

檢查Channel Access Token
查看Render日誌錯誤訊息
確認服務正在運行
AI回覆無效

檢查Hugging Face API Key
網路連線問題會使用預設回覆
檢查服務狀態
curl https://你的app名稱.onrender.com/health
擴展功能
添加新的回覆邏輯
在 getDefaultResponse 函數中添加：

if (message.includes('新關鍵字')) {
    return '新的回覆內容';
}
整合其他AI服務
替換 getAIResponse 函數中的API調用。

添加Rich Message
使用LINE Bot SDK的豐富訊息功能。

授權
MIT License

貢獻
歡迎提交Issue和Pull Request！

聯絡
如有問題，請建立Issue或聯絡開發者。
