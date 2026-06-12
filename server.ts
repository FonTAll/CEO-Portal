import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Secure Google Apps Script backend proxy endpoint
app.post('/api/proxy-gas', async (req, res) => {
  const gasUrl = process.env.VITE_APPS_SCRIPT_URL;
  if (!gasUrl) {
    return res.status(400).json({
      status: 'error',
      message: 'VITE_APPS_SCRIPT_URL is not configured in the application Secrets. Please go to Settings > Secrets and add VITE_APPS_SCRIPT_URL.'
    });
  }

  try {
    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      return res.json(data);
    } catch (parseError) {
      console.error('Failed to parse Apps Script response:', text);
      return res.status(502).json({
        status: 'error',
        message: 'Invalid response format received from Google Apps Script. Please verify your web app deployment.'
      });
    }
  } catch (error: any) {
    console.error('GAS Proxy Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to connect to Google Apps Script. Error: ' + (error.message || String(error))
    });
  }
});

// API route for Copilot with Search Grounding
app.post('/api/gemini/copilot', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.json({
      text: `⚠️ **ระบบสำรอง (Offline Fallback Mode) ทำงานเนื่องจากยังไม่มีการกำหนดคีย์ระบบ**\n\nระบบตรวจจับความปลอดภัยพบว่ายังไม่ได้ตั้งค่า \`GEMINI_API_KEY\` ในเครื่องมือจัดการความลึกลับของแอปพลิเคชัน\n\n**วิธีการตั้งค่าและเปิดใช้งาน AI Copilot ค้นข้อมูลสดและลิงก์จริง:**\n1. ไปที่แถบเมนูด้านบน และเปิดส่วนตั้งค่า (Settings)\n2. จากแถบย่อย เลือกตัวเลือกความลับ (Secrets)\n3. เพิ่มตัวแปรชื่อ \`GEMINI_API_KEY\` และระบุ API Key จาก Google AI Studio ที่ได้มาลงไป\n\n**ผู้ช่วยอัจฉริยะแบบทำงานออฟไลน์ยังสามารถแนะนำแนวทางการจัดตารางและการจัดระเบียบตารางเบื้องต้นให้คุณได้ตามหัวข้อประเด็นสำคัญของระบบ!**`,
      offline: true,
      groundingChunks: []
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const mappedContents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: mappedContents,
      config: {
        systemInstruction: 'You are T All BOT, an intelligent HR Copilot assistant for the Meat Pro MES & HR Management system. Help the HR administrator with policies, statistics, guidelines, and document reviews. Because you have real-time Google Search grounding enabled, you should use Google Search to find actual up-to-date real-world facts, laws, guidelines, or software settings when requested. Always answer in Thai politely with rich and elegant formatting.',
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "ขออภัยด้วยค่ะ ฉันไม่สามารถสร้างคำตอบที่ต้องการได้ในขณะนี้";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return res.json({
      text,
      offline: false,
      groundingChunks
    });
  } catch (err: any) {
    console.error('Gemini error:', err);
    return res.status(500).json({ error: err.message || 'Error communicating with Gemini' });
  }
});

// Vite Middleware Integration
const startServer = async () => {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
};

startServer();
