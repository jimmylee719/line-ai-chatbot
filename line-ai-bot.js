const express = require('express');
const line = require('@line/bot-sdk');
const axios = require('axios');

const app = express();

// LINE Bot 設定
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);

// 中間件
app.use('/webhook', line.middleware(config));

// Webhook 處理
app.post('/webhook', (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// 處理訊息事件
async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const userMessage = event.message.text;
  console.log('收到使用者訊息:', userMessage);

  try {
    // 呼叫AI API獲取回覆
    const aiResponse = await getAIResponse(userMessage);
    
    // 回覆訊息
    const echo = {
      type: 'text',
      text: aiResponse
    };

    return client.replyMessage(event.replyToken, echo);
  } catch (error) {
    console.error('處理訊息時發生錯誤:', error);
    
    const errorMsg = {
      type: 'text',
      text: '抱歉，我現在無法回應您，請稍後再試。'
    };

    return client.replyMessage(event.replyToken, errorMsg);
  }
}

// AI回覆函數 - 使用免費的OpenAI替代方案
async function getAIResponse(message) {
  try {
    // 使用Hugging Face Inference API (免費)
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
      {
        inputs: message,
        options: {
          wait_for_model: true
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    if (response.data && response.data[0] && response.data[0].generated_text) {
      return response.data[0].generated_text.replace(message, '').trim();
    }
    
    // 如果API無回應，使用預設回覆
    return getDefaultResponse(message);
    
  } catch (error) {
    console.error('AI API錯誤:', error);
    return getDefaultResponse(message);
  }
}

// 預設回覆函數
function getDefaultResponse(message) {
  const responses = {
    '你好': '你好！很高興見到你！有什麼我可以幫助你的嗎？',
    '嗨': '嗨！希望你今天過得愉快！',
    '謝謝': '不客氣！很高興能幫助你！',
    '再見': '再見！期待下次與你聊天！',
    '天氣': '我無法查詢即時天氣，建議你使用天氣APP查看最新資訊。',
    '時間': `現在時間是 ${new Date().toLocaleString('zh-TW')}`,
    '幫助': '我是一個AI聊天機器人，可以和你聊天、回答問題。試著問我任何問題吧！'
  };

  // 關鍵字回覆
  for (const keyword in responses) {
    if (message.includes(keyword)) {
      return responses[keyword];
    }
  }

  // 智能回覆邏輯
  if (message.includes('？') || message.includes('?')) {
    return '這是個有趣的問題！讓我想想... 你覺得呢？';
  }
  
  if (message.includes('心情') || message.includes('感覺')) {
    return '聽起來你想聊聊心情，我很樂意聽你分享！';
  }
  
  if (message.includes('工作') || message.includes('上班')) {
    return '工作辛苦了！記得要適時休息，保持身心健康喔！';
  }

  // 預設回覆
  const defaultReplies = [
    '我理解你的意思，能告訴我更多嗎？',
    '有趣的觀點！我想聽聽你的想法。',
    '這個話題很不錯，我們可以繼續聊下去。',
    '你說得對，讓我們深入討論一下。',
    '我很好奇你的看法，能詳細說明嗎？'
  ];
  
  return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
}

// 健康檢查端點
app.get('/', (req, res) => {
  res.send('LINE AI聊天機器人正在運行中！');
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 啟動伺服器
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`伺服器運行在 port ${port}`);
  console.log('LINE AI聊天機器人已啟動！');
});

// 錯誤處理
process.on('uncaughtException', (err) => {
  console.error('未捕獲的例外:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未處理的Promise拒絕:', reason);
});