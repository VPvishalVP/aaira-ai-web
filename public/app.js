/* ========================================================
   AAIRA AI • CLIENT CORE CONTROLLER
   Quantum AI Gateway • Live Code Sandbox • Music & Video
   Master VIHUHUHU Special Edition
   ======================================================== */

(function() {
  'use strict';

  // State Management
  const state = {
    authToken: localStorage.getItem('aaira_auth_token') || null,
    generatedKey: null,
    keyExpiresTimer: null,
    ttsEnabled: true,
    isListening: false,
    chatHistory: [],
    currentCreationCode: null,
    currentCreationTitle: 'Untitled App',
    currentTrackIndex: 0,
    isPlayingAudio: false,
    audioInitialized: false
  };

  // Curated Royalty-Free Music Playlist (High-speed reliable audio)
  const PLAYLIST = [
    {
      title: 'Midnight Lo-Fi Chill Beats',
      artist: 'AAIRA Cyber Lofi Stream',
      url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3'
    },
    {
      title: 'Cyberpunk Synthwave Neon Pulse',
      artist: 'Retro Wave Cyber Core',
      url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=synthwave-80s-110045.mp3'
    },
    {
      title: 'Anime Sunset Lo-Fi',
      artist: 'Tokyo Chill Melodies',
      url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=spirit-blossom-15285.mp3'
    },
    {
      title: 'Deep Focus Coding Flow',
      artist: 'Ambient Binaural Beats',
      url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3?filename=ambient-piano-amp-strings-10711.mp3'
    }
  ];

  // DOM Elements Cache
  const DOM = {
    // Screen 1: Auth Gateway
    authScreen: document.getElementById('authScreen'),
    orbCanvas: document.getElementById('orbCanvas'),
    orbCenterBtn: document.getElementById('orbCenterBtn'),
    authCard: document.getElementById('authCard'),
    slot0: document.getElementById('slot0'),
    slot1: document.getElementById('slot1'),
    slot2: document.getElementById('slot2'),
    keyInput: document.getElementById('keyInput'),
    copyKeyBtn: document.getElementById('copyKeyBtn'),
    unlockBtn: document.getElementById('unlockBtn'),
    keyTimer: document.getElementById('keyTimer'),
    authMessage: document.getElementById('authMessage'),

    // Screen 2: Dashboard
    dashboardScreen: document.getElementById('dashboardScreen'),
    lockSystemBtn: document.getElementById('lockSystemBtn'),
    ttsToggleBtn: document.getElementById('ttsToggleBtn'),
    toggleMusicBtn: document.getElementById('toggleMusicBtn'),
    toggleVideoBtn: document.getElementById('toggleVideoBtn'),
    toggleVaultBtn: document.getElementById('toggleVaultBtn'),

    // Mini Nav Player
    miniTrackTitle: document.getElementById('miniTrackTitle'),
    miniPrevBtn: document.getElementById('miniPrevBtn'),
    miniPlayBtn: document.getElementById('miniPlayBtn'),
    miniNextBtn: document.getElementById('miniNextBtn'),
    navVisualizer: document.getElementById('navVisualizer'),

    // AI Chat Studio
    chatContainer: document.getElementById('chatContainer'),
    promptInput: document.getElementById('promptInput'),
    sendBtn: document.getElementById('sendBtn'),
    micBtn: document.getElementById('micBtn'),
    voiceStatusBar: document.getElementById('voiceStatusBar'),
    voiceStatusText: document.getElementById('voiceStatusText'),
    promptsScroll: document.querySelector('.prompts-scroll'),

    // Right Media Dock
    mediaDock: document.getElementById('mediaDock'),
    dockTabs: document.querySelectorAll('.dock-tab'),
    dockViewSandbox: document.getElementById('dockViewSandbox'),
    dockViewMusic: document.getElementById('dockViewMusic'),
    dockViewVideo: document.getElementById('dockViewVideo'),
    dockViewVault: document.getElementById('dockViewVault'),
    vaultCount: document.getElementById('vaultCount'),

    // Live Sandbox
    sandboxTitle: document.getElementById('sandboxTitle'),
    sandboxReloadBtn: document.getElementById('sandboxReloadBtn'),
    sandboxSaveBtn: document.getElementById('sandboxSaveBtn'),
    sandboxFullscreenBtn: document.getElementById('sandboxFullscreenBtn'),
    sandboxPlaceholder: document.getElementById('sandboxPlaceholder'),
    sandboxIframe: document.getElementById('sandboxIframe'),
    demoAppBtn: document.getElementById('demoAppBtn'),

    // Music Player
    mainAudioPlayer: document.getElementById('mainAudioPlayer'),
    musicSpectrumCanvas: document.getElementById('musicSpectrumCanvas'),
    vinylRecord: document.getElementById('vinylRecord'),
    currentTrackName: document.getElementById('currentTrackName'),
    currentTrackArtist: document.getElementById('currentTrackArtist'),
    currentTime: document.getElementById('currentTime'),
    totalDuration: document.getElementById('totalDuration'),
    seekSlider: document.getElementById('seekSlider'),
    audioPrevBtn: document.getElementById('audioPrevBtn'),
    audioPlayBtn: document.getElementById('audioPlayBtn'),
    audioNextBtn: document.getElementById('audioNextBtn'),
    volumeSlider: document.getElementById('volumeSlider'),
    playlistUl: document.getElementById('playlistUl'),
    customAudioUrl: document.getElementById('customAudioUrl'),
    loadCustomAudioBtn: document.getElementById('loadCustomAudioBtn'),

    // Video Player
    dashboardVideo: document.getElementById('dashboardVideo'),
    youtubeVideoFrame: document.getElementById('youtubeVideoFrame'),
    currentVideoTitle: document.getElementById('currentVideoTitle'),
    videoFullscreenBtn: document.getElementById('videoFullscreenBtn'),
    videoChips: document.querySelectorAll('.video-chip'),
    customVideoUrl: document.getElementById('customVideoUrl'),
    loadCustomVideoBtn: document.getElementById('loadCustomVideoBtn'),

    // Vault
    vaultList: document.getElementById('vaultList')
  };

  // ========================================================
  // 1. QUANTUM ORB CANVAS RENDERING (Screen 1)
  // ========================================================
  let orbCtx = null;
  let orbAnimId = null;
  let orbShockwave = 0;
  let particles = [];

  function initOrbCanvas() {
    if (!DOM.orbCanvas) return;
    orbCtx = DOM.orbCanvas.getContext('2d');
    const width = DOM.orbCanvas.width = 380;
    const height = DOM.orbCanvas.height = 380;

    // Generate orbiting particles
    particles = [];
    for (let i = 0; i < 48; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 65 + Math.random() * 85,
        speed: (0.005 + Math.random() * 0.015) * (Math.random() > 0.5 ? 1 : -1),
        size: 1.5 + Math.random() * 2.5,
        color: Math.random() > 0.4 ? '#00f0ff' : '#ff007f',
        alpha: 0.3 + Math.random() * 0.7
      });
    }

    renderOrb(0);
  }

  function renderOrb(time) {
    if (!orbCtx) return;
    const w = DOM.orbCanvas.width;
    const h = DOM.orbCanvas.height;
    const cx = w / 2;
    const cy = h / 2;

    orbCtx.clearRect(0, 0, w, h);

    const t = time * 0.001;

    // Draw Outer Cyber Ring with Tick Marks
    orbCtx.save();
    orbCtx.translate(cx, cy);
    orbCtx.rotate(t * 0.2);

    orbCtx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
    orbCtx.lineWidth = 1.5;
    orbCtx.beginPath();
    orbCtx.arc(0, 0, 140, 0, Math.PI * 2);
    orbCtx.stroke();

    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * Math.PI * 2;
      const r1 = i % 3 === 0 ? 146 : 142;
      const r2 = 140;
      orbCtx.beginPath();
      orbCtx.moveTo(Math.cos(angle) * r1, Math.sin(angle) * r1);
      orbCtx.lineTo(Math.cos(angle) * r2, Math.sin(angle) * r2);
      orbCtx.stroke();
    }
    orbCtx.restore();

    // Draw Inner Counter-Rotating Rings
    orbCtx.save();
    orbCtx.translate(cx, cy);
    orbCtx.rotate(-t * 0.35);
    orbCtx.strokeStyle = 'rgba(255, 0, 127, 0.35)';
    orbCtx.lineWidth = 1;
    orbCtx.setLineDash([8, 12]);
    orbCtx.beginPath();
    orbCtx.ellipse(0, 0, 115, 75, t * 0.5, 0, Math.PI * 2);
    orbCtx.stroke();
    orbCtx.setLineDash([]);
    orbCtx.restore();

    orbCtx.save();
    orbCtx.translate(cx, cy);
    orbCtx.rotate(t * 0.4);
    orbCtx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    orbCtx.lineWidth = 1.2;
    orbCtx.beginPath();
    orbCtx.ellipse(0, 0, 80, 110, -t * 0.4, 0, Math.PI * 2);
    orbCtx.stroke();
    orbCtx.restore();

    // Draw Orbiting Particles
    for (const p of particles) {
      p.angle += p.speed;
      const px = cx + Math.cos(p.angle) * p.radius;
      const py = cy + Math.sin(p.angle) * p.radius;

      orbCtx.fillStyle = p.color;
      orbCtx.globalAlpha = p.alpha;
      orbCtx.shadowColor = p.color;
      orbCtx.shadowBlur = 8;
      orbCtx.beginPath();
      orbCtx.arc(px, py, p.size, 0, Math.PI * 2);
      orbCtx.fill();
    }
    orbCtx.globalAlpha = 1;
    orbCtx.shadowBlur = 0;

    // Center Core Pulsing Plasma Glow
    const pulse = 1 + Math.sin(t * 3) * 0.12;
    const gradient = orbCtx.createRadialGradient(cx, cy, 5, cx, cy, 65 * pulse);
    gradient.addColorStop(0, 'rgba(0, 240, 255, 0.85)');
    gradient.addColorStop(0.35, 'rgba(0, 240, 255, 0.35)');
    gradient.addColorStop(0.75, 'rgba(168, 85, 247, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    orbCtx.fillStyle = gradient;
    orbCtx.beginPath();
    orbCtx.arc(cx, cy, 65 * pulse, 0, Math.PI * 2);
    orbCtx.fill();

    // Shockwave ripple animation if triggered
    if (orbShockwave > 0) {
      orbCtx.save();
      orbCtx.strokeStyle = `rgba(0, 240, 255, ${Math.max(0, 1 - orbShockwave / 160)})`;
      orbCtx.lineWidth = 3;
      orbCtx.shadowColor = '#00f0ff';
      orbCtx.shadowBlur = 15;
      orbCtx.beginPath();
      orbCtx.arc(cx, cy, orbShockwave, 0, Math.PI * 2);
      orbCtx.stroke();
      orbCtx.restore();

      orbShockwave += 5;
      if (orbShockwave > 170) orbShockwave = 0;
    }

    orbAnimId = requestAnimationFrame(renderOrb);
  }

  // Synthesize Web Audio Chimes & Beeps
  function playAudioTone(freq = 880, duration = 0.15, type = 'sine') {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (_) {}
  }

  // ========================================================
  // 2. 3-DIGIT AUTHORIZED KEY GENERATION & UNLOCK LOGIC
  // ========================================================

  async function handleOrbClick() {
    // Trigger visual shockwave & audio beep
    orbShockwave = 20;
    playAudioTone(720, 0.1, 'sine');
    setTimeout(() => playAudioTone(1140, 0.2, 'triangle'), 100);

    try {
      // Call server to generate authorized 3-digit key
      const res = await fetch('/api/generate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();

      let keyStr = '742';
      if (data && data.success && data.key) {
        keyStr = String(data.key);
      } else {
        // Fallback local 3-digit number
        keyStr = Math.floor(100 + Math.random() * 900).toString();
      }

      state.generatedKey = keyStr;
      displayGeneratedKey(keyStr);

      // Start Countdown Timer (5:00)
      startKeyTimer(300);

    } catch (err) {
      console.warn('[Key Gen Warning]', err);
      const fallbackKey = Math.floor(100 + Math.random() * 900).toString();
      state.generatedKey = fallbackKey;
      displayGeneratedKey(fallbackKey);
      startKeyTimer(300);
    }
  }

  function displayGeneratedKey(key) {
    if (!key || key.length < 3) return;
    DOM.slot0.textContent = key[0];
    DOM.slot1.textContent = key[1];
    DOM.slot2.textContent = key[2];

    DOM.keyInput.value = key;
    DOM.authCard.classList.remove('hidden');

    showAuthMessage(`Key Generated: ${key}. Click Authorize to unlock!`, 'success');
  }

  function startKeyTimer(seconds) {
    clearInterval(state.keyExpiresTimer);
    let remaining = seconds;
    updateTimerDisplay(remaining);

    state.keyExpiresTimer = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        clearInterval(state.keyExpiresTimer);
        DOM.keyTimer.innerHTML = '<i class="fa-regular fa-clock"></i> Expired';
        showAuthMessage('Key expired. Tap core to generate a new key.', 'error');
      } else {
        updateTimerDisplay(remaining);
      }
    }, 1000);
  }

  function updateTimerDisplay(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    DOM.keyTimer.innerHTML = `<i class="fa-regular fa-clock"></i> ${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function showAuthMessage(text, type = 'error') {
    DOM.authMessage.textContent = text;
    DOM.authMessage.className = `auth-message ${type}`;
    DOM.authMessage.style.display = 'block';
  }

  async function verifyAndUnlock() {
    const inputVal = DOM.keyInput.value.trim();
    if (!inputVal) {
      showAuthMessage('Kripya 3-Digit Authorized Key enter karein!', 'error');
      return;
    }

    try {
      const res = await fetch('/api/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: inputVal })
      });
      const data = await res.json();

      if (data && data.success) {
        showAuthMessage('ACCESS GRANTED! Welcome Master VIHUHUHU...', 'success');
        playAudioTone(523.25, 0.15);
        setTimeout(() => playAudioTone(659.25, 0.15), 150);
        setTimeout(() => playAudioTone(783.99, 0.3), 300);

        if (data.token) {
          state.authToken = data.token;
          localStorage.setItem('aaira_auth_token', data.token);
        }

        // Voice Welcome
        speakReply('Welcome Master Vihuhuhu! AAIRA quantum core unlocked.');

        // Transition from Auth to Dashboard
        setTimeout(() => {
          DOM.authScreen.classList.add('dissolve');
          setTimeout(() => {
            DOM.authScreen.classList.add('hidden');
            DOM.dashboardScreen.classList.remove('hidden');
            initDashboardComponents();
          }, 450);
        }, 500);

      } else {
        playAudioTone(200, 0.3, 'sawtooth');
        showAuthMessage(data.message || 'Invalid Authorized Key!', 'error');
      }
    } catch (err) {
      // Local Master fallback
      if (inputVal === '811' || inputVal === state.generatedKey) {
        showAuthMessage('OFFLINE VERIFIED: Welcome Master VIHUHUHU!', 'success');
        setTimeout(() => {
          DOM.authScreen.classList.add('hidden');
          DOM.dashboardScreen.classList.remove('hidden');
          initDashboardComponents();
        }, 500);
      } else {
        showAuthMessage('Verification failed. Kripya punah prayas karein.', 'error');
      }
    }
  }

  function lockSystem() {
    state.authToken = null;
    localStorage.removeItem('aaira_auth_token');
    DOM.dashboardScreen.classList.add('hidden');
    DOM.authScreen.classList.remove('dissolve', 'hidden');
    DOM.authCard.classList.add('hidden');
    DOM.keyInput.value = '';
    DOM.slot0.textContent = '-';
    DOM.slot1.textContent = '-';
    DOM.slot2.textContent = '-';
  }

  // ========================================================
  // 3. AI CHAT STUDIO & "JO MAI BOLU VO BAN JAYE" ENGINE
  // ========================================================

  async function handleSendPrompt(customText = null) {
    const text = (customText !== null ? customText : DOM.promptInput.value).trim();
    if (!text) return;

    // Reset input
    DOM.promptInput.value = '';
    DOM.promptInput.style.height = 'auto';

    // Append User Message to UI
    appendUserMessage(text);
    state.chatHistory.push({ role: 'user', content: text });

    // Show AAIRA Typing Indicator
    const typingMsgElem = appendTypingIndicator();
    scrollToBottom();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: state.chatHistory.slice(-8)
        })
      });

      const data = await res.json();
      typingMsgElem.remove();

      if (data && data.success) {
        const reply = data.reply;
        state.chatHistory.push({ role: 'assistant', content: reply });

        // Render Assistant Bubble
        appendAssistantMessage(reply, data.code, data.title);

        // Auto-Run in Live Sandbox if code is generated!
        if (data.hasCode && data.code) {
          state.currentCreationCode = data.code;
          state.currentCreationTitle = data.title || text.slice(0, 25);
          loadIntoSandbox(data.code, state.currentCreationTitle);
          switchDockTab('sandbox');
        }

        // Voice TTS
        if (state.ttsEnabled) {
          // Clean code blocks before speaking
          const speakable = reply.replace(/```[\s\S]*?```/g, 'Code ban gaya hai Master, aap live sandbox me dekh sakte hain.').slice(0, 200);
          speakReply(speakable);
        }

      } else {
        appendAssistantMessage(data.error || 'Samasya aayi. Kripya punah prayas karein.');
      }
    } catch (err) {
      typingMsgElem.remove();
      appendAssistantMessage('Connection error: ' + err.message);
    }

    scrollToBottom();
  }

  function appendUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'chat-message user-message';
    div.innerHTML = `
      <div class="msg-avatar"><span>👤</span></div>
      <div class="msg-bubble">
        <div class="msg-header">
          <span class="sender-name">MASTER VIHUHUHU</span>
          <span class="msg-time">${getFormattedTime()}</span>
        </div>
        <div class="msg-text">${escapeHtml(text)}</div>
      </div>
    `;
    DOM.chatContainer.appendChild(div);
  }

  function appendTypingIndicator() {
    const div = document.createElement('div');
    div.className = 'chat-message assistant-message typing-indicator';
    div.innerHTML = `
      <div class="msg-avatar"><span>💠</span></div>
      <div class="msg-bubble">
        <div class="msg-header">
          <span class="sender-name">AAIRA AI (आएरा)</span>
          <span class="msg-time">Generating...</span>
        </div>
        <div class="msg-text" style="color: #00f0ff; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-spinner fa-spin"></i> AAIRA soch rahi hai aur code bana rahi hai...
        </div>
      </div>
    `;
    DOM.chatContainer.appendChild(div);
    return div;
  }

  function appendAssistantMessage(rawText, code = null, codeTitle = null) {
    const div = document.createElement('div');
    div.className = 'chat-message assistant-message';

    // Format text and detect code blocks
    let formattedHtml = formatChatMarkdown(rawText);

    // If code exists, add interactive Action Bar
    let actionBoxHtml = '';
    if (code) {
      actionBoxHtml = `
        <div class="code-action-box">
          <div class="code-action-header">
            <span class="code-title"><i class="fa-solid fa-laptop-code"></i> ${escapeHtml(codeTitle || 'Generated App / Game')}</span>
            <div class="code-buttons-row">
              <button class="btn-run-live action-run-btn" data-code="${encodeURIComponent(code)}" data-title="${escapeHtml(codeTitle || 'Creation')}">
                <i class="fa-solid fa-play"></i> ▶️ Run Live in Sandbox
              </button>
              <button class="btn-save-creation action-save-btn" data-code="${encodeURIComponent(code)}" data-title="${escapeHtml(codeTitle || 'Creation')}">
                <i class="fa-regular fa-bookmark"></i> Save
              </button>
            </div>
          </div>
        </div>
      `;
    }

    div.innerHTML = `
      <div class="msg-avatar">
        <div class="avatar-ring"></div>
        <span>💠</span>
      </div>
      <div class="msg-bubble">
        <div class="msg-header">
          <span class="sender-name">AAIRA AI (आएरा)</span>
          <span class="msg-time">${getFormattedTime()}</span>
        </div>
        <div class="msg-text">${formattedHtml}</div>
        ${actionBoxHtml}
      </div>
    `;

    DOM.chatContainer.appendChild(div);

    // Attach click handlers to Run and Save buttons
    const runBtn = div.querySelector('.action-run-btn');
    if (runBtn) {
      runBtn.addEventListener('click', () => {
        const decodedCode = decodeURIComponent(runBtn.getAttribute('data-code'));
        const title = runBtn.getAttribute('data-title');
        loadIntoSandbox(decodedCode, title);
        switchDockTab('sandbox');
      });
    }

    const saveBtn = div.querySelector('.action-save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        const decodedCode = decodeURIComponent(saveBtn.getAttribute('data-code'));
        const title = saveBtn.getAttribute('data-title');
        await saveCreationToVault(title, decodedCode);
        saveBtn.innerHTML = '<i class="fa-solid fa-check"></i> Saved!';
        saveBtn.style.color = '#10b981';
      });
    }
  }

  function formatChatMarkdown(text) {
    if (!text) return '';
    let parsed = text;

    // Convert bold **text**
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Code blocks ```html ... ``` or ``` ... ```
    parsed = parsed.replace(/```([a-z0-9]*)\s*([\s\S]*?)\s*```/gi, (match, lang, codeBody) => {
      return `<pre style="background: rgba(0,0,0,0.6); padding: 10px; border-radius: 6px; overflow-x: auto; font-family: monospace; font-size: 11px; margin: 8px 0; border: 1px solid rgba(0,240,255,0.2);"><code>${escapeHtml(codeBody)}</code></pre>`;
    });

    // Paragraphs / Linebreaks
    parsed = parsed.replace(/\n\n/g, '<br><br>');
    parsed = parsed.replace(/\n/g, '<br>');

    return parsed;
  }

  function scrollToBottom() {
    DOM.chatContainer.scrollTop = DOM.chatContainer.scrollHeight;
  }

  function getFormattedTime() {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ========================================================
  // 4. MULTIMODAL VOICE SPEECH RECOGNITION & TTS
  // ========================================================

  let speechRecognizer = null;

  function initSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      console.warn('[Voice] Speech Recognition not supported in this browser');
      DOM.micBtn.style.display = 'none';
      return;
    }

    speechRecognizer = new SpeechRec();
    speechRecognizer.continuous = false;
    speechRecognizer.interimResults = false;
    speechRecognizer.lang = 'hi-IN'; // Natural Hindi / Hinglish

    speechRecognizer.onstart = () => {
      state.isListening = true;
      DOM.micBtn.classList.add('listening');
      DOM.voiceStatusBar.classList.remove('hidden');
      DOM.voiceStatusText.textContent = 'Listening to Master Vihuhuhu... (बोलिए)';
      playAudioTone(880, 0.08);
    };

    speechRecognizer.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      DOM.promptInput.value = transcript;
      DOM.voiceStatusText.textContent = `Aapne bola: "${transcript}"`;
      setTimeout(() => {
        handleSendPrompt(transcript);
      }, 400);
    };

    speechRecognizer.onerror = (err) => {
      console.warn('[Voice Rec Error]', err);
      stopListening();
    };

    speechRecognizer.onend = () => {
      stopListening();
    };
  }

  function toggleSpeechListening() {
    if (!speechRecognizer) {
      initSpeechRecognition();
      if (!speechRecognizer) {
        alert('Aapke browser me speech recognition support nahi hai.');
        return;
      }
    }

    if (state.isListening) {
      speechRecognizer.stop();
    } else {
      try {
        speechRecognizer.start();
      } catch (_) {}
    }
  }

  function stopListening() {
    state.isListening = false;
    DOM.micBtn.classList.remove('listening');
    DOM.voiceStatusBar.classList.add('hidden');
  }

  function speakReply(text) {
    if (!state.ttsEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.1; // Female sweet tone

      // Pick Hindi or Indian English voice if available
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => v.lang.startsWith('hi') || v.name.includes('India') || v.name.includes('Hindi'));
      if (hindiVoice) utterance.voice = hindiVoice;

      window.speechSynthesis.speak(utterance);
    } catch (_) {}
  }

  // ========================================================
  // 5. LIVE CODE SANDBOX RUNNER
  // ========================================================

  function loadIntoSandbox(code, title = 'Interactive App') {
    if (!code) return;
    state.currentCreationCode = code;
    state.currentCreationTitle = title;

    DOM.sandboxTitle.textContent = title;
    DOM.sandboxPlaceholder.classList.add('hidden');
    DOM.sandboxIframe.classList.remove('hidden');

    DOM.sandboxIframe.srcdoc = code;
  }

  function reloadSandbox() {
    if (state.currentCreationCode) {
      DOM.sandboxIframe.srcdoc = state.currentCreationCode;
    }
  }

  function toggleSandboxFullscreen() {
    const wrap = DOM.sandboxFrameWrap;
    if (!document.fullscreenElement) {
      wrap.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  // Demo Cyber Tic-Tac-Toe
  function loadDemoApp() {
    const demoCode = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cyber Tic-Tac-Toe • AAIRA</title>
<style>
  body {
    margin: 0;
    background: #070913;
    color: #00f0ff;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    user-select: none;
  }
  h2 { margin: 0 0 10px; text-shadow: 0 0 15px #00f0ff; letter-spacing: 2px; }
  #status { font-size: 16px; margin-bottom: 20px; color: #ff007f; text-shadow: 0 0 10px #ff007f; }
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 90px);
    grid-template-rows: repeat(3, 90px);
    gap: 10px;
    background: rgba(0, 240, 255, 0.2);
    padding: 10px;
    border-radius: 14px;
    box-shadow: 0 0 30px rgba(0, 240, 255, 0.4);
  }
  .cell {
    background: #0d1426;
    border: 2px solid #00f0ff;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 42px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.2s;
  }
  .cell:hover { background: #15223e; box-shadow: 0 0 15px #00f0ff; }
  .cell.x { color: #00f0ff; text-shadow: 0 0 15px #00f0ff; }
  .cell.o { color: #ff007f; text-shadow: 0 0 15px #ff007f; }
  button {
    margin-top: 24px;
    background: linear-gradient(135deg, #00f0ff, #ff007f);
    border: none;
    color: #000;
    font-weight: bold;
    padding: 10px 24px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    box-shadow: 0 0 15px #00f0ff;
  }
</style>
</head>
<body>
  <h2>CYBER TIC-TAC-TOE</h2>
  <div id="status">Turn: Player X</div>
  <div class="grid" id="grid"></div>
  <button onclick="resetGame()">RESTART MATCH</button>
  <script>
    let board = Array(9).fill('');
    let turn = 'X';
    let active = true;
    const grid = document.getElementById('grid');
    const status = document.getElementById('status');

    function createGrid() {
      grid.innerHTML = '';
      for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.onclick = () => makeMove(i);
        grid.appendChild(cell);
      }
    }

    function makeMove(i) {
      if (!active || board[i]) return;
      board[i] = turn;
      const cell = grid.children[i];
      cell.textContent = turn;
      cell.classList.add(turn.toLowerCase());

      if (checkWin()) {
        status.textContent = '🎉 PLAYER ' + turn + ' WINS!';
        active = false;
        return;
      }
      if (board.every(c => c)) {
        status.textContent = 'GAME DRAW!';
        active = false;
        return;
      }

      turn = turn === 'X' ? 'O' : 'X';
      status.textContent = 'Turn: Player ' + turn;
    }

    function checkWin() {
      const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
      ];
      return wins.some(([a,b,c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
    }

    function resetGame() {
      board = Array(9).fill('');
      turn = 'X';
      active = true;
      status.textContent = 'Turn: Player X';
      createGrid();
    }
    createGrid();
  </script>
</body>
</html>`;
    loadIntoSandbox(demoCode, 'Demo Cyber Tic-Tac-Toe');
  }

  // ========================================================
  // 6. INTEGRATED MUSIC PLAYER & AUDIO SPECTRUM VISUALIZER
  // ========================================================

  let audioCtx = null;
  let audioAnalyser = null;
  let audioSourceNode = null;
  let visualizerAnimId = null;

  function initMusicPlayer() {
    renderPlaylist();
    loadTrack(0);

    // Audio Player Events
    DOM.mainAudioPlayer.addEventListener('timeupdate', updateAudioProgress);
    DOM.mainAudioPlayer.addEventListener('ended', playNextTrack);
    DOM.mainAudioPlayer.addEventListener('play', () => {
      state.isPlayingAudio = true;
      updatePlayButtons(true);
      DOM.vinylRecord.classList.add('spinning');
      startSpectrumVisualizer();
    });
    DOM.mainAudioPlayer.addEventListener('pause', () => {
      state.isPlayingAudio = false;
      updatePlayButtons(false);
      DOM.vinylRecord.classList.remove('spinning');
    });

    // Seek slider
    DOM.seekSlider.addEventListener('input', (e) => {
      if (DOM.mainAudioPlayer.duration) {
        DOM.mainAudioPlayer.currentTime = (e.target.value / 100) * DOM.mainAudioPlayer.duration;
      }
    });

    // Volume slider
    DOM.volumeSlider.addEventListener('input', (e) => {
      DOM.mainAudioPlayer.volume = parseFloat(e.target.value);
    });
  }

  function renderPlaylist() {
    DOM.playlistUl.innerHTML = '';
    PLAYLIST.forEach((track, idx) => {
      const li = document.createElement('li');
      li.className = `playlist-item ${idx === state.currentTrackIndex ? 'active' : ''}`;
      li.innerHTML = `
        <span><i class="fa-solid fa-music"></i> ${track.title}</span>
        <span style="font-size: 10px; color: #94a3b8;">${track.artist}</span>
      `;
      li.onclick = () => {
        loadTrack(idx);
        toggleAudioPlay(true);
      };
      DOM.playlistUl.appendChild(li);
    });
  }

  function loadTrack(index) {
    if (index < 0 || index >= PLAYLIST.length) return;
    state.currentTrackIndex = index;
    const track = PLAYLIST[index];

    DOM.mainAudioPlayer.src = track.url;
    DOM.currentTrackName.textContent = track.title;
    DOM.currentTrackArtist.textContent = track.artist;
    DOM.miniTrackTitle.textContent = track.title;

    renderPlaylist();
  }

  function toggleAudioPlay(forcePlay = null) {
    setupWebAudioContext();

    if (forcePlay === true || (!state.isPlayingAudio && forcePlay === null)) {
      DOM.mainAudioPlayer.play().catch(e => console.warn('[Audio Play]', e));
    } else {
      DOM.mainAudioPlayer.pause();
    }
  }

  function playNextTrack() {
    let next = state.currentTrackIndex + 1;
    if (next >= PLAYLIST.length) next = 0;
    loadTrack(next);
    toggleAudioPlay(true);
  }

  function playPrevTrack() {
    let prev = state.currentTrackIndex - 1;
    if (prev < 0) prev = PLAYLIST.length - 1;
    loadTrack(prev);
    toggleAudioPlay(true);
  }

  function updatePlayButtons(isPlaying) {
    const icon = isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
    DOM.audioPlayBtn.innerHTML = icon;
    DOM.miniPlayBtn.innerHTML = icon;
  }

  function updateAudioProgress() {
    const cur = DOM.mainAudioPlayer.currentTime;
    const dur = DOM.mainAudioPlayer.duration;
    if (dur) {
      DOM.seekSlider.value = (cur / dur) * 100;
      DOM.currentTime.textContent = formatDuration(cur);
      DOM.totalDuration.textContent = formatDuration(dur);
    }
  }

  function formatDuration(sec) {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function setupWebAudioContext() {
    if (state.audioInitialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      audioCtx = new AudioCtx();
      audioAnalyser = audioCtx.createAnalyser();
      audioAnalyser.fftSize = 64;

      // Note: createMediaElementSource requires CORS headers on audio stream
      try {
        audioSourceNode = audioCtx.createMediaElementSource(DOM.mainAudioPlayer);
        audioSourceNode.connect(audioAnalyser);
        audioAnalyser.connect(audioCtx.destination);
      } catch (_) {}

      state.audioInitialized = true;
    } catch (_) {}
  }

  function startSpectrumVisualizer() {
    cancelAnimationFrame(visualizerAnimId);

    const canvas = DOM.musicSpectrumCanvas;
    const ctx = canvas.getContext('2d');
    const navCanvas = DOM.navVisualizer;
    const navCtx = navCanvas ? navCanvas.getContext('2d') : null;

    const dataArray = new Uint8Array(32);

    function draw() {
      if (!state.isPlayingAudio) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (navCtx) navCtx.clearRect(0, 0, navCanvas.width, navCanvas.height);
        return;
      }

      visualizerAnimId = requestAnimationFrame(draw);

      if (audioAnalyser) {
        audioAnalyser.getByteFrequencyData(dataArray);
      } else {
        // Simulated rhythmic bounce if audio is restricted
        for (let i = 0; i < 32; i++) {
          dataArray[i] = 80 + Math.sin(Date.now() * 0.005 + i) * 60;
        }
      }

      // Draw Main Visualizer
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / 32) * 1.5;
      let x = 0;

      for (let i = 0; i < 24; i++) {
        const barHeight = (dataArray[i] / 255) * (canvas.height * 0.85);

        const grad = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
        grad.addColorStop(0, '#00f0ff');
        grad.addColorStop(1, '#ff007f');

        ctx.fillStyle = grad;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
        x += barWidth;
      }

      // Draw Mini Nav Visualizer
      if (navCtx) {
        navCtx.clearRect(0, 0, navCanvas.width, navCanvas.height);
        const miniW = navCanvas.width / 12;
        for (let j = 0; j < 12; j++) {
          const h = (dataArray[j * 2] / 255) * navCanvas.height;
          navCtx.fillStyle = '#00f0ff';
          navCtx.fillRect(j * miniW, navCanvas.height - h, miniW - 2, h);
        }
      }
    }

    draw();
  }

  // ========================================================
  // 7. INTEGRATED VIDEO PLAYER ("vahi dashbord pe chale video bhi")
  // ========================================================

  function initVideoPlayer() {
    DOM.videoChips.forEach(chip => {
      chip.addEventListener('click', () => {
        DOM.videoChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const type = chip.getAttribute('data-type');
        const src = chip.getAttribute('data-src');
        const title = chip.getAttribute('data-title');

        loadVideo(type, src, title);
      });
    });

    DOM.videoFullscreenBtn.addEventListener('click', () => {
      const wrap = document.querySelector('.video-screen-wrap');
      if (!document.fullscreenElement) {
        wrap.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    DOM.loadCustomVideoBtn.addEventListener('click', () => {
      const url = DOM.customVideoUrl.value.trim();
      if (!url) return;

      // Detect YouTube URL
      const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (ytMatch && ytMatch[1]) {
        const embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
        loadVideo('youtube', embedUrl, 'Custom YouTube Stream');
      } else {
        loadVideo('direct', url, 'Custom Video Stream');
      }
    });
  }

  function loadVideo(type, src, title = 'Video Player') {
    DOM.currentVideoTitle.textContent = title;

    if (type === 'youtube') {
      DOM.dashboardVideo.pause();
      DOM.dashboardVideo.classList.add('hidden');
      DOM.youtubeVideoFrame.classList.remove('hidden');
      DOM.youtubeVideoFrame.src = src;
    } else {
      DOM.youtubeVideoFrame.src = '';
      DOM.youtubeVideoFrame.classList.add('hidden');
      DOM.dashboardVideo.classList.remove('hidden');
      DOM.dashboardVideo.src = src;
      DOM.dashboardVideo.play().catch(() => {});
    }
  }

  // ========================================================
  // 8. CREATIONS VAULT (TURSO CLOUD DB)
  // ========================================================

  async function loadCreationsVault() {
    try {
      const res = await fetch('/api/creations');
      const data = await res.json();
      if (data && data.success && Array.isArray(data.creations)) {
        DOM.vaultCount.textContent = data.creations.length;
        renderVaultList(data.creations);
      }
    } catch (_) {}
  }

  function renderVaultList(creations) {
    if (!creations.length) {
      DOM.vaultList.innerHTML = '<div class="vault-empty">Abhi koi creation saved nahi hai. AAIRA se kuch banwayein aur save karein!</div>';
      return;
    }

    DOM.vaultList.innerHTML = '';
    creations.forEach(item => {
      const div = document.createElement('div');
      div.className = 'vault-item';
      div.innerHTML = `
        <div class="vault-info">
          <div class="vault-info-title"><i class="fa-solid fa-code"></i> ${escapeHtml(item.title)}</div>
          <div class="vault-info-date">${new Date(item.created_at).toLocaleDateString()}</div>
        </div>
        <button class="vault-run-btn" data-code="${encodeURIComponent(item.code)}" data-title="${escapeHtml(item.title)}">
          <i class="fa-solid fa-play"></i> RUN
        </button>
      `;
      div.querySelector('.vault-run-btn').addEventListener('click', (e) => {
        const code = decodeURIComponent(e.currentTarget.getAttribute('data-code'));
        const title = e.currentTarget.getAttribute('data-title');
        loadIntoSandbox(code, title);
        switchDockTab('sandbox');
      });
      DOM.vaultList.appendChild(div);
    });
  }

  async function saveCreationToVault(title, code) {
    try {
      await fetch('/api/creations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, code, category: 'app' })
      });
      loadCreationsVault();
    } catch (_) {}
  }

  // ========================================================
  // 9. DOCK TABS & EVENT LISTENERS
  // ========================================================

  function switchDockTab(tabName) {
    DOM.dockTabs.forEach(t => {
      if (t.getAttribute('data-dock') === tabName) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    DOM.dockViewSandbox.classList.remove('active');
    DOM.dockViewMusic.classList.remove('active');
    DOM.dockViewVideo.classList.remove('active');
    DOM.dockViewVault.classList.remove('active');

    if (tabName === 'sandbox') DOM.dockViewSandbox.classList.add('active');
    if (tabName === 'music') DOM.dockViewMusic.classList.add('active');
    if (tabName === 'video') DOM.dockViewVideo.classList.add('active');
    if (tabName === 'vault') {
      DOM.dockViewVault.classList.add('active');
      loadCreationsVault();
    }

    // Handle mobile panel open
    if (window.innerWidth <= 960) {
      DOM.mediaDock.classList.add('mobile-open');
    }
  }

  function setupEventListeners() {
    // Screen 1: Orb tap & Key Authorization
    DOM.orbCenterBtn.addEventListener('click', handleOrbClick);
    DOM.unlockBtn.addEventListener('click', verifyAndUnlock);
    DOM.keyInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') verifyAndUnlock();
    });
    DOM.copyKeyBtn.addEventListener('click', () => {
      if (state.generatedKey) {
        navigator.clipboard.writeText(state.generatedKey);
        showAuthMessage(`Key ${state.generatedKey} copied to clipboard!`, 'success');
      }
    });

    // Screen 2: Top Nav buttons
    DOM.lockSystemBtn.addEventListener('click', lockSystem);
    DOM.ttsToggleBtn.addEventListener('click', () => {
      state.ttsEnabled = !state.ttsEnabled;
      DOM.ttsToggleBtn.classList.toggle('active', state.ttsEnabled);
      DOM.ttsToggleBtn.innerHTML = state.ttsEnabled
        ? '<i class="fa-solid fa-volume-high"></i> <span class="hide-mobile">VOICE ON</span>'
        : '<i class="fa-solid fa-volume-xmark"></i> <span class="hide-mobile">VOICE OFF</span>';
    });

    DOM.toggleMusicBtn.addEventListener('click', () => switchDockTab('music'));
    DOM.toggleVideoBtn.addEventListener('click', () => switchDockTab('video'));
    DOM.toggleVaultBtn.addEventListener('click', () => switchDockTab('vault'));

    // Mini Player
    DOM.miniPlayBtn.addEventListener('click', () => toggleAudioPlay());
    DOM.miniNextBtn.addEventListener('click', playNextTrack);
    DOM.miniPrevBtn.addEventListener('click', playPrevTrack);

    // Audio Player View
    DOM.audioPlayBtn.addEventListener('click', () => toggleAudioPlay());
    DOM.audioNextBtn.addEventListener('click', playNextTrack);
    DOM.audioPrevBtn.addEventListener('click', playPrevTrack);

    DOM.loadCustomAudioBtn.addEventListener('click', () => {
      const url = DOM.customAudioUrl.value.trim();
      if (!url) return;
      DOM.mainAudioPlayer.src = url;
      DOM.currentTrackName.textContent = 'Custom Audio Stream';
      DOM.currentTrackArtist.textContent = 'User Audio URL';
      DOM.miniTrackTitle.textContent = 'Custom Audio Stream';
      toggleAudioPlay(true);
    });

    // Dock Tabs click
    DOM.dockTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        switchDockTab(tab.getAttribute('data-dock'));
      });
    });

    // Chat prompt input
    DOM.sendBtn.addEventListener('click', () => handleSendPrompt());
    DOM.promptInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendPrompt();
      }
    });

    // Auto-grow textarea
    DOM.promptInput.addEventListener('input', () => {
      DOM.promptInput.style.height = 'auto';
      DOM.promptInput.style.height = Math.min(DOM.promptInput.scrollHeight, 120) + 'px';
    });

    // Mic Voice Recognition
    DOM.micBtn.addEventListener('click', toggleSpeechListening);

    // Quick Prompts Ribbon
    document.querySelectorAll('.quick-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const prompt = chip.getAttribute('data-prompt');
        DOM.promptInput.value = prompt;
        handleSendPrompt(prompt);
      });
    });

    // Sandbox toolbar buttons
    DOM.sandboxReloadBtn.addEventListener('click', reloadSandbox);
    DOM.sandboxFullscreenBtn.addEventListener('click', toggleSandboxFullscreen);
    DOM.demoAppBtn.addEventListener('click', loadDemoApp);
    DOM.sandboxSaveBtn.addEventListener('click', async () => {
      if (state.currentCreationCode) {
        await saveCreationToVault(state.currentCreationTitle, state.currentCreationCode);
        alert('App Creations Vault me save ho gaya!');
      }
    });
  }

  function initDashboardComponents() {
    initMusicPlayer();
    initVideoPlayer();
    loadCreationsVault();
  }

  // ========================================================
  // INITIALIZATION ON LOAD
  // ========================================================
  window.addEventListener('DOMContentLoaded', () => {
    initOrbCanvas();
    setupEventListeners();

    // Check if user already has an active authorized session
    if (state.authToken) {
      DOM.authScreen.classList.add('hidden');
      DOM.dashboardScreen.classList.remove('hidden');
      initDashboardComponents();
    }
  });

})();
