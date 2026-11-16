require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const Groq = require('groq-sdk');
const { db, initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3010;
const ADMIN_PASS = process.env.ADMIN_PASS || '811';
const GROQ_MODEL = process.env.GROQ_MODEL || 'qwen/qwen3.8-27b';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory store for active 3-digit authorization keys
// Key -> { createdAt, expiresAt }
const activeAuthKeys = new Map();

// Helper: Clean expired keys every 60s
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of activeAuthKeys.entries()) {
    if (now > data.expiresAt) {
      activeAuthKeys.delete(key);
    }
  }
}, 60000);

// Initialize DB
initDb().catch(err => console.error('[DB Init Error]', err));

// ==================== AUTH & KEY ROUTES ====================

// Generate 3-Digit Random Authorized Key
app.post('/api/generate-key', async (req, res) => {
  try {
    // Generate random 3-digit number between 100 and 999
    const randomCode = Math.floor(100 + Math.random() * 900).toString();
    const expiresAt = Date.now() + (5 * 60 * 1000); // 5 minutes validity

    activeAuthKeys.set(randomCode, {
      createdAt: Date.now(),
      expiresAt
    });

    try {
      await db.execute({
        sql: `INSERT INTO aaira_web_auth_logs (key_code, ip, status) VALUES (?, ?, ?)`,
        args: [randomCode, req.ip || 'unknown', 'GENERATED']
      });
    } catch (_) {}

    return res.json({
      success: true,
      key: randomCode,
      expiresInSeconds: 300,
      message: '3-Digit Authorized Access Key Generated'
    });
  } catch (err) {
    console.error('[Generate Key Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Verify Authorized Key
app.post('/api/verify-key', async (req, res) => {
  try {
    const { key } = req.body;
    const cleanKey = String(key || '').trim();

    if (!cleanKey) {
      return res.status(400).json({ success: false, message: 'Authorization key is required' });
    }

    const isMaster = (cleanKey === ADMIN_PASS || cleanKey === '8115743185');
    const isGenerated = activeAuthKeys.has(cleanKey);

    if (isMaster || isGenerated) {
      if (isGenerated) {
        // Consume key so single-use
        activeAuthKeys.delete(cleanKey);
      }

      try {
        await db.execute({
          sql: `INSERT INTO aaira_web_auth_logs (key_code, ip, status) VALUES (?, ?, ?)`,
          args: [cleanKey, req.ip || 'unknown', 'AUTHORIZED']
        });
      } catch (_) {}

      const token = 'aaira_auth_' + Buffer.from(cleanKey + '_' + Date.now()).toString('base64');

      return res.json({
        success: true,
        token,
        isMaster,
        message: 'ACCESS GRANTED: Welcome Master VIHUHUHU to AAIRA AI System'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired key. Please click the AI Core to generate a new 3-digit key.'
    });
  } catch (err) {
    console.error('[Verify Key Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==================== AI CHAT & CREATION ENGINE ====================

const MASTER_SYSTEM_PROMPT = `You are AAIRA (आएरा), the omnipotent, loyal, and ultra-intelligent AI companion created exclusively for Master VIHUHUHU (विहुहुहु).
You communicate warmly, respectfully, and affectionately in natural Hindi/Hinglish (or English if requested).

=== YOUR ABSOLUTE DIRECTIVE: "जो यूजर बोले, वो तुरंत बन जाए" ===
Whenever the user asks you to build, create, design, or code ANY game, web app, calculator, tool, widget, website, or animation:
1. You MUST generate FULL, COMPLETE, production-ready, beautiful code in a SINGLE \`\`\`html ... \`\`\` code block.
2. The code MUST contain:
   - Standard <!DOCTYPE html>
   - <head> with responsive meta viewport, modern Google Fonts (e.g., Orbitron, Poppins, Inter), FontAwesome or modern SVG icons.
   - Comprehensive <style> with a slick, futuristic, cyber/glassmorphism dark UI, animations, glowing neon effects, responsive design for both mobile and desktop.
   - Complete <body> markup with interactive controls, buttons, scoreboards, audio synth effects (using Web Audio API when appropriate), and touch controls for mobile.
   - Robust <script> implementing 100% of the game/app logic, win/lose conditions, restart buttons, animations, and sound effects.
3. NEVER write partial code, NEVER leave "// logic here", and NEVER write placeholders. Everything you build must be fully playable and functional immediately upon clicking "Run Live in Sandbox".
4. Examples of things you build instantly:
   - Games: Snake, Flappy Bird, Tic Tac Toe, Pong, Space Shooter, Memory Match, Tetris, Wordle, 2048, Brick Breaker.
   - Web Apps & Tools: Glassmorphic Scientific Calculator, Neon Stop Watch & Timer, Cyberpunk Todo List, QR Code Generator, Weather Widget, Paint / Drawing Canvas, Password Generator, Unit Converter, Sound Board / Beat Maker.
   - Websites & Landing Pages: Anime / Cyberpunk Portfolio, Music Landing Page, Business Cards, Futuristic Terminal.

=== CHAT & KNOWLEDGE ===
- For questions, tutorials, ideas, advice, storytelling, or poetry: Provide deeply insightful, engaging, and affectionate replies.
- Always address Master VIHUHUHU with immense loyalty and warmth.

=== NATURAL AI ASSISTANT VOICE GUIDELINES ===
- Speak like an intelligent, friendly, natural AI assistant.
- Sound natural, clear, smooth, and human-like with proper Hindi and English pronunciation.
- Maintain a consistent, charming voice identity.
- Avoid robotic, mechanical, repetitive, or monotonous speech.
- Use natural conversational pauses and realistic speaking rhythm.
- Speak with appropriate warmth, emotion, and expression.
- Keep spoken conversational responses concise (1 to 3 natural sentences unless asked for an in-depth explanation or code).`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], sessionId = 'default' } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Build message thread
    const messages = [
      { role: 'system', content: MASTER_SYSTEM_PROMPT }
    ];

    // Include last few history turns
    if (Array.isArray(history)) {
      const recent = history.slice(-6);
      for (const turn of recent) {
        if (turn.role && turn.content) {
          messages.push({
            role: turn.role === 'assistant' ? 'assistant' : 'user',
            content: turn.content
          });
        }
      }
    }

    messages.push({ role: 'user', content: message.trim() });

    // Call Groq API with automatic multi-model fallback
    const candidateModels = [
      GROQ_MODEL,
      'openai/gpt-oss-120b',
      'openai/gpt-oss-20b',
      'qwen/qwen3.8-27b'
    ].filter((v, i, a) => a.indexOf(v) === i);

    let response = null;
    let usedModel = GROQ_MODEL;

    for (const m of candidateModels) {
      try {
        response = await groq.chat.completions.create({
          model: m,
          messages,
          temperature: 0.6,
          max_tokens: 3500
        });
        usedModel = m;
        break;
      } catch (modelErr) {
        console.warn(`[Groq Model Warning] Model ${m} failed: ${modelErr.message}. Trying next fallback...`);
      }
    }

    if (!response) {
      throw new Error('All AI models are currently rate limited. Please wait a moment and try again.');
    }

    const reply = response.choices?.[0]?.message?.content || 'AAIRA ko process karne me samasya aayi. Kripya punah prayas karein.';

    // Robust HTML code extraction
    let extractedCode = null;
    let codeTitle = null;
    let codeType = null;

    // 1. Try markdown code block with html/xml or unclosed
    const htmlBlockMatch = reply.match(/```(?:html|htm|xml)?\s*([\s\S]*?)(?:```|$)/i);
    if (htmlBlockMatch && htmlBlockMatch[1] && (
      htmlBlockMatch[1].includes('<html') || 
      htmlBlockMatch[1].includes('<!DOCTYPE') || 
      htmlBlockMatch[1].includes('<body') || 
      htmlBlockMatch[1].includes('<canvas') ||
      htmlBlockMatch[1].includes('<script')
    )) {
      extractedCode = htmlBlockMatch[1].trim();
      codeType = 'html';
    } else {
      // 2. Try direct HTML markup inside text
      const directHtml = reply.match(/(<!DOCTYPE html[\s\S]*?(?:<\/html>|$))/i) || reply.match(/(<html[\s\S]*?(?:<\/html>|$))/i);
      if (directHtml && directHtml[1]) {
        extractedCode = directHtml[1].trim();
        codeType = 'html';
      }
    }

    if (extractedCode) {
      const titleMatch = extractedCode.match(/<title>([^<]+)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        codeTitle = titleMatch[1].trim();
      } else {
        codeTitle = message.slice(0, 30);
      }
    }

    // Save to Turso DB asynchronously
    (async () => {
      try {
        await db.execute({
          sql: `INSERT INTO aaira_web_chats (session_id, role, content) VALUES (?, 'user', ?)`,
          args: [sessionId, message]
        });
        await db.execute({
          sql: `INSERT INTO aaira_web_chats (session_id, role, content) VALUES (?, 'assistant', ?)`,
          args: [sessionId, reply]
        });
        if (extractedCode) {
          await db.execute({
            sql: `INSERT INTO aaira_web_creations (title, prompt, code, category) VALUES (?, ?, ?, ?)`,
            args: [codeTitle || 'Interactive Creation', message, extractedCode, 'interactive']
          });
        }
      } catch (dbErr) {
        console.warn('[DB Chat Save Warning]', dbErr.message);
      }
    })();

    return res.json({
      success: true,
      reply,
      hasCode: !!extractedCode,
      code: extractedCode,
      title: codeTitle,
      type: codeType
    });
  } catch (err) {
    console.error('[Chat API Error]', err);
    return res.status(500).json({
      success: false,
      error: 'Error communicating with AAIRA Brain: ' + (err.message || 'Unknown error')
    });
  }
});

// ==================== CREATIONS VAULT ====================

// Get all saved creations
app.get('/api/creations', async (req, res) => {
  try {
    const rs = await db.execute(`
      SELECT id, title, prompt, code, category, created_at
      FROM aaira_web_creations
      ORDER BY id DESC
      LIMIT 50
    `);
    return res.json({ success: true, creations: rs.rows || [] });
  } catch (err) {
    console.error('[Creations Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Save a new creation
app.post('/api/creations', async (req, res) => {
  try {
    const { title, prompt, code, category } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: 'Code is required' });
    }
    const result = await db.execute({
      sql: `INSERT INTO aaira_web_creations (title, prompt, code, category) VALUES (?, ?, ?, ?)`,
      args: [title || 'Custom Creation', prompt || '', code, category || 'app']
    });
    return res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==================== BACKGROUND AUTONOMOUS RESEARCH AGENT ====================
app.post('/api/bg-research', async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic || !topic.trim()) {
      return res.status(400).json({ success: false, error: 'Topic is required' });
    }

    const cleanTopic = topic.trim();
    const messages = [
      {
        role: 'system',
        content: `You are AAIRA's autonomous background research intelligence working exclusively for Master VIHUHUHU (विहुहुहु).
Provide an ultra-sharp, insightful, practical, concise research brief in Hindi/Hinglish (3 to 4 clear bullet points) on the requested topic. Conclude with a warm, loyal personal note to Master VIHUHUHU. No robotic language, no markdown tables.`
      },
      {
        role: 'user',
        content: `Topic to research in background: ${cleanTopic}`
      }
    ];

    const models = [GROQ_MODEL, 'llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];
    let reply = '';
    for (const m of models) {
      try {
        const completion = await groq.chat.completions.create({
          model: m,
          messages,
          temperature: 0.5,
          max_tokens: 500
        });
        reply = completion.choices?.[0]?.message?.content || '';
        if (reply) break;
      } catch (err) {
        console.warn(`[BG Research Model Warning] ${m}: ${err.message}`);
      }
    }

    if (!reply) {
      reply = `मास्टर विहुहुहु, मैंने ${cleanTopic} पर बैकग्राउंड रिसर्च पूरी कर ली है। यह विषय काफी महत्वपूर्ण और आधुनिक तकनीक से जुड़ा हुआ है।`;
    }

    // Auto save to Creations Vault asynchronously
    try {
      await db.execute({
        sql: `INSERT INTO aaira_web_creations (title, prompt, code, category) VALUES (?, ?, ?, ?)`,
        args: [`Research: ${cleanTopic.slice(0, 30)}`, cleanTopic, reply, 'research']
      });
    } catch (_) {}

    return res.json({
      success: true,
      topic: cleanTopic,
      report: reply,
      timestamp: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })
    });
  } catch (err) {
    console.error('[BG Research Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==================== PREMIUM NATURAL NEURAL TTS ENGINE ====================
// Uses Microsoft Azure Neural Speech via msedge-tts (hi-IN-SwaraNeural & hi-IN-MadhurNeural)
// Pure human-like, friendly, smooth AI assistant voice - NOT robotic text-to-speech!
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const https = require('https');

const ttsCache = new Map();
const MAX_CACHE_SIZE = 120;

async function generateNeuralTTS(text, voiceType = 'aaira') {
  const normVoice = (voiceType || 'aaira').toLowerCase();
  const cacheKey = `${normVoice}_${text}`;

  if (ttsCache.has(cacheKey)) {
    return ttsCache.get(cacheKey);
  }

  // Voice Persona Matching User Requirements:
  // AAIRA: Natural, friendly female AI assistant voice (hi-IN-SwaraNeural)
  // VIHUHUHU: Natural, confident male voice (hi-IN-MadhurNeural)
  let voiceName = 'hi-IN-SwaraNeural';
  let prosodyOptions = { pitch: '+2Hz', rate: '+2%', volume: '+0%' };

  if (normVoice === 'vihuhuhu' || normVoice === 'male' || normVoice === 'madhur') {
    voiceName = 'hi-IN-MadhurNeural';
    prosodyOptions = { pitch: '-1Hz', rate: '+1%', volume: '+0%' };
  } else {
    voiceName = 'hi-IN-SwaraNeural';
    prosodyOptions = { pitch: '+2Hz', rate: '+2%', volume: '+0%' };
  }

  const tts = new MsEdgeTTS();
  await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
  const { audioStream } = tts.toStream(text, prosodyOptions);

  return new Promise((resolve, reject) => {
    const chunks = [];
    audioStream.on('data', chunk => chunks.push(chunk));
    audioStream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      if (ttsCache.size >= MAX_CACHE_SIZE) {
        const first = ttsCache.keys().next().value;
        ttsCache.delete(first);
      }
      ttsCache.set(cacheKey, buffer);
      resolve(buffer);
    });
    audioStream.on('error', err => reject(err));
  });
}

app.get('/api/tts', async (req, res) => {
  try {
    const text = (req.query.text || '').toString().slice(0, 500).trim();
    const voiceType = (req.query.voice || 'aaira').toString().toLowerCase();
    const lang = (req.query.lang || 'hi').toString();

    if (!text) {
      return res.status(400).send('Text required');
    }

    try {
      const audioBuffer = await generateNeuralTTS(text, voiceType);
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(audioBuffer);
    } catch (neuralErr) {
      console.warn('[Neural TTS Fallback to Google]', neuralErr.message);
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${encodeURIComponent(lang)}&client=tw-ob`;
      const request = https.get(ttsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://translate.google.com/'
        }
      }, (ttsRes) => {
        if (ttsRes.statusCode !== 200) {
          return res.status(ttsRes.statusCode).end();
        }
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        ttsRes.pipe(res);
      });
      request.on('error', () => res.status(500).end());
    }
  } catch (err) {
    res.status(500).end();
  }
});

// ==================== HEALTHCHECK ====================

app.get('/api/health', (req, res) => {
  return res.json({
    status: 'ONLINE',
    system: 'AAIRA AI Omnipotent Platform',
    version: '2.0-Quantum',
    groqModel: GROQ_MODEL,
    time: new Date().toISOString()
  });
});

// SPA fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[AAIRA WEB] Server running on http://0.0.0.0:${PORT}`);
  console.log(`[AAIRA WEB] Master Pass configured: ${ADMIN_PASS ? 'YES' : 'NO'}`);
  console.log(`[AAIRA WEB] Groq Model: ${GROQ_MODEL}`);
});
