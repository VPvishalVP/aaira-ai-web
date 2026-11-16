/* ========================================================
   AAIRA AI • CLIENT CORE CONTROLLER (V2.1 - Master Vihuhuhu)
   Voice AI Conversation Hub • Voice-Triggered Dashboard • Live Sandbox
   ======================================================== */

(function() {
  'use strict';

  // Global State
  const state = {
    currentScreen: 'hub', // 'hub' | 'dashboard'
    autoListen: true,
    ttsEnabled: true,
    isListening: false,
    isSpeaking: false,
    chatHistory: [],
    currentCreationCode: null,
    currentCreationTitle: 'Untitled App',
    currentTrackIndex: 0,
    isPlayingAudio: false,
    audioInitialized: false,
    bestVoice: null
  };

  // Curated Royalty-Free Music Playlist
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

  // DOM Elements
  const DOM = {
    // Screen 1: Voice Hub
    voiceHubScreen: document.getElementById('voiceHubScreen'),
    autoListenToggle: document.getElementById('autoListenToggle'),
    hubGoDashboardBtn: document.getElementById('hubGoDashboardBtn'),
    hubOrbCanvas: document.getElementById('hubOrbCanvas'),
    hubOrbCore: document.getElementById('hubOrbCore'),
    hubOrbIcon: document.getElementById('hubOrbIcon'),
    hubOrbText: document.getElementById('hubOrbText'),
    dialogueState: document.getElementById('dialogueState'),
    dialogueContent: document.getElementById('dialogueContent'),
    hubCodeNotification: document.getElementById('hubCodeNotification'),
    hubCodeTitle: document.getElementById('hubCodeTitle'),
    hubRunInDashBtn: document.getElementById('hubRunInDashBtn'),
    hubMicBtn: document.getElementById('hubMicBtn'),
    hubTextInput: document.getElementById('hubTextInput'),
    hubSendBtn: document.getElementById('hubSendBtn'),
    voiceChips: document.querySelectorAll('.voice-chip'),

    // Screen 2: Dashboard
    dashboardScreen: document.getElementById('dashboardScreen'),
    backToHubBtn: document.getElementById('backToHubBtn'),
    ttsToggleBtn: document.getElementById('ttsToggleBtn'),
    toggleSandboxBtn: document.getElementById('toggleSandboxBtn'),
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
    videoPlayDirectBtn: document.getElementById('videoPlayDirectBtn'),
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
  let particles = [];

  function initOrbCanvas() {
    if (!DOM.hubOrbCanvas) return;
    orbCtx = DOM.hubOrbCanvas.getContext('2d');
    const width = DOM.hubOrbCanvas.width = 400;
    const height = DOM.hubOrbCanvas.height = 400;

    particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 65 + Math.random() * 95,
        speed: (0.006 + Math.random() * 0.018) * (Math.random() > 0.5 ? 1 : -1),
        size: 1.5 + Math.random() * 2.5,
        color: Math.random() > 0.4 ? '#00f0ff' : '#ff007f',
        alpha: 0.35 + Math.random() * 0.65
      });
    }

    renderOrb(0);
  }

  function renderOrb(time) {
    if (!orbCtx) return;
    const w = DOM.hubOrbCanvas.width;
    const h = DOM.hubOrbCanvas.height;
    const cx = w / 2;
    const cy = h / 2;

    orbCtx.clearRect(0, 0, w, h);
    const t = time * 0.001;

    // React to Speaking or Listening
    let pulseScale = 1 + Math.sin(t * 3.5) * 0.1;
    if (state.isSpeaking) {
      pulseScale = 1.15 + Math.sin(t * 8) * 0.22;
    } else if (state.isListening) {
      pulseScale = 1.1 + Math.sin(t * 6) * 0.16;
    }

    // Outer Cyber Ring with Tick Marks
    orbCtx.save();
    orbCtx.translate(cx, cy);
    orbCtx.rotate(t * 0.2);

    orbCtx.strokeStyle = state.isSpeaking ? 'rgba(255, 0, 127, 0.45)' : 'rgba(0, 240, 255, 0.35)';
    orbCtx.lineWidth = 1.5;
    orbCtx.beginPath();
    orbCtx.arc(0, 0, 145, 0, Math.PI * 2);
    orbCtx.stroke();

    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * Math.PI * 2;
      const r1 = i % 3 === 0 ? 152 : 147;
      const r2 = 145;
      orbCtx.beginPath();
      orbCtx.moveTo(Math.cos(angle) * r1, Math.sin(angle) * r1);
      orbCtx.lineTo(Math.cos(angle) * r2, Math.sin(angle) * r2);
      orbCtx.stroke();
    }
    orbCtx.restore();

    // Orbiting Elliptical Rings
    orbCtx.save();
    orbCtx.translate(cx, cy);
    orbCtx.rotate(-t * 0.3);
    orbCtx.strokeStyle = state.isListening ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255, 0, 127, 0.4)';
    orbCtx.lineWidth = 1.2;
    orbCtx.setLineDash([8, 12]);
    orbCtx.beginPath();
    orbCtx.ellipse(0, 0, 120, 80, t * 0.6, 0, Math.PI * 2);
    orbCtx.stroke();
    orbCtx.setLineDash([]);
    orbCtx.restore();

    orbCtx.save();
    orbCtx.translate(cx, cy);
    orbCtx.rotate(t * 0.35);
    orbCtx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
    orbCtx.lineWidth = 1.2;
    orbCtx.beginPath();
    orbCtx.ellipse(0, 0, 85, 115, -t * 0.4, 0, Math.PI * 2);
    orbCtx.stroke();
    orbCtx.restore();

    // Particles
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

    // Glowing Plasma Core
    const gradient = orbCtx.createRadialGradient(cx, cy, 6, cx, cy, 70 * pulseScale);
    if (state.isSpeaking) {
      gradient.addColorStop(0, 'rgba(255, 0, 127, 0.85)');
      gradient.addColorStop(0.4, 'rgba(255, 0, 127, 0.4)');
      gradient.addColorStop(0.8, 'rgba(168, 85, 247, 0.2)');
    } else if (state.isListening) {
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.85)');
      gradient.addColorStop(0.4, 'rgba(16, 185, 129, 0.4)');
      gradient.addColorStop(0.8, 'rgba(0, 240, 255, 0.2)');
    } else {
      gradient.addColorStop(0, 'rgba(0, 240, 255, 0.85)');
      gradient.addColorStop(0.4, 'rgba(0, 240, 255, 0.35)');
      gradient.addColorStop(0.8, 'rgba(168, 85, 247, 0.2)');
    }
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    orbCtx.fillStyle = gradient;
    orbCtx.beginPath();
    orbCtx.arc(cx, cy, 70 * pulseScale, 0, Math.PI * 2);
    orbCtx.fill();

    orbAnimId = requestAnimationFrame(renderOrb);
  }

  // Synthesize Web Audio Chimes
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
  // 2. NAVIGATION: VOICE HUB <-> DASHBOARD TRANSITIONS
  // ========================================================

  function openDashboard(autoMessage = null) {
    state.currentScreen = 'dashboard';
    DOM.voiceHubScreen.classList.add('fade-out');

    setTimeout(() => {
      DOM.voiceHubScreen.classList.add('hidden');
      DOM.dashboardScreen.classList.remove('hidden');
      initDashboardComponents();

      if (autoMessage) {
        handleSendPrompt(autoMessage);
      }
    }, 350);
  }

  function openVoiceHub() {
    state.currentScreen = 'hub';
    DOM.dashboardScreen.classList.add('hidden');
    DOM.voiceHubScreen.classList.remove('fade-out', 'hidden');
  }

  // ========================================================
  // 3. SUPERIOR NATURAL TTS VOICE ENGINE ("vaice achcha karo")
  // ========================================================

  function loadBestVoice() {
    if (!window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    // Prioritize natural female Hindi and Indian English voices
    state.bestVoice = 
      voices.find(v => v.lang.startsWith('hi') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Online'))) ||
      voices.find(v => v.lang.startsWith('hi')) ||
      voices.find(v => v.lang.includes('IN') && (v.name.includes('Google') || v.name.includes('Female') || v.name.includes('Natural'))) ||
      voices.find(v => v.lang.includes('IN')) ||
      voices.find(v => v.name.includes('Google UK English Female') || v.name.includes('Samantha') || v.name.includes('Zira')) ||
      voices.find(v => v.lang.startsWith('en') && v.name.includes('Female')) ||
      voices[0];

    console.log('[Voice] Selected Voice:', state.bestVoice ? state.bestVoice.name : 'Default');
  }

  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = loadBestVoice;
    loadBestVoice();
  }

  function speakText(rawText, onDone = null) {
    if (!state.ttsEnabled || !window.speechSynthesis) {
      if (onDone) onDone();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      // Clean text for natural speech: strip markdown, code blocks, URLs, and symbols
      let clean = rawText
        .replace(/```[\s\S]*?```/g, 'मैंने इसका पूरा कोड तैयार कर दिया है। आप इसे लाइव चला सकते हैं।')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/#+\s/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/https?:\/\/\S+/g, '')
        .replace(/[💠✨🚀🎮🧮🎵🎬🫡🙏]/g, '')
        .trim();

      if (!clean) {
        clean = "जी मास्टर विहुहुहु, मैंने काम कर दिया है!";
      }

      const utterance = new SpeechSynthesisUtterance(clean);
      if (state.bestVoice) utterance.voice = state.bestVoice;

      utterance.rate = 0.98; // Natural warm speaking speed
      utterance.pitch = 1.12; // Sweet, clear female companion tone

      utterance.onstart = () => {
        state.isSpeaking = true;
        DOM.hubOrbCore.classList.add('speaking');
        DOM.hubOrbText.textContent = 'SPEAKING...';
        DOM.dialogueState.textContent = 'Speaking... (बोल रही हूँ)';
      };

      utterance.onend = () => {
        state.isSpeaking = false;
        DOM.hubOrbCore.classList.remove('speaking');
        DOM.hubOrbText.textContent = 'TAP TO SPEAK';
        DOM.dialogueState.textContent = 'Ready • मास्टर, बोलिए...';

        if (onDone) onDone();

        // Auto-listen mode: automatically open mic after AAIRA speaks!
        if (state.autoListen && state.currentScreen === 'hub') {
          setTimeout(() => {
            if (!state.isSpeaking && !state.isListening) {
              startListening();
            }
          }, 400);
        }
      };

      utterance.onerror = () => {
        state.isSpeaking = false;
        DOM.hubOrbCore.classList.remove('speaking');
        DOM.hubOrbText.textContent = 'TAP TO SPEAK';
        if (onDone) onDone();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('[TTS Error]', e);
      if (onDone) onDone();
    }
  }

  // ========================================================
  // 4. SPEECH RECOGNITION (MIC & VOICE COMMANDS)
  // ========================================================
  let speechRecognizer = null;

  function initSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      console.warn('[Voice] Speech Recognition not supported in this browser');
      return;
    }

    speechRecognizer = new SpeechRec();
    speechRecognizer.continuous = false;
    speechRecognizer.interimResults = false;
    speechRecognizer.lang = 'hi-IN'; // Hindi + Hinglish

    speechRecognizer.onstart = () => {
      state.isListening = true;
      DOM.hubOrbCore.classList.add('listening');
      DOM.hubMicBtn.classList.add('listening');
      DOM.micBtn.classList.add('listening');
      DOM.hubOrbText.textContent = 'LISTENING...';
      DOM.dialogueState.textContent = 'Listening to Master Vihuhuhu... (सुन रही हूँ)';
      DOM.voiceStatusBar.classList.remove('hidden');
      DOM.voiceStatusText.textContent = 'Listening to Master Vihuhuhu... (बोलिए)';
      playAudioTone(880, 0.08);
    };

    speechRecognizer.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      console.log('[Voice Rec]', transcript);

      DOM.hubTextInput.value = transcript;
      DOM.promptInput.value = transcript;

      // Handle user voice input
      handleVoiceInput(transcript);
    };

    speechRecognizer.onerror = (err) => {
      console.warn('[Voice Error]', err);
      stopListening();
    };

    speechRecognizer.onend = () => {
      stopListening();
    };
  }

  function startListening() {
    if (!speechRecognizer) initSpeechRecognition();
    if (!speechRecognizer) {
      alert('Aapke browser me mic speech recognition support nahi hai.');
      return;
    }

    try {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      speechRecognizer.start();
    } catch (_) {}
  }

  function stopListening() {
    state.isListening = false;
    DOM.hubOrbCore.classList.remove('listening');
    DOM.hubMicBtn.classList.remove('listening');
    DOM.micBtn.classList.remove('listening');
    DOM.hubOrbText.textContent = 'TAP TO SPEAK';
    DOM.dialogueState.textContent = 'Ready • मास्टर, बोलिए...';
    DOM.voiceStatusBar.classList.add('hidden');
  }

  function toggleListening() {
    if (state.isListening) {
      if (speechRecognizer) speechRecognizer.stop();
    } else {
      startListening();
    }
  }

  // Interpret Voice Commands ("jab bolu ki dasbord tab dashbord pe jaye")
  function handleVoiceInput(text) {
    const lower = text.toLowerCase();

    // 1. DASHBOARD COMMAND ("jab bolu ki dasbord tab dashbord pe jaye")
    const dashboardTriggers = ['dashboard', 'डैशबोर्ड', 'dasbord', 'dash board', 'panel', 'open dashboard', 'dashboard kholo', 'dashboard pe jao', 'dashbord'];
    const isDashboardCmd = dashboardTriggers.some(t => lower.includes(t));

    if (isDashboardCmd) {
      updateHubDialogue(`Master: "${text}"`, `जी मास्टर VIHUHUHU! डैशबोर्ड खोल रही हूँ... 🚀`);
      speakText('जी मास्टर विहुहुहु, डैशबोर्ड खुल रहा है!', () => {
        openDashboard();
      });
      return;
    }

    // 2. MUSIC COMMAND ("gaana bajao" / "music chalao")
    if (lower.includes('gaana') || lower.includes('music') || lower.includes('song') || lower.includes('गाना') || lower.includes('गीत')) {
      toggleAudioPlay(true);
      updateHubDialogue(`Master: "${text}"`, `जी मास्टर! आपके लिए मस्त Lo-Fi Chill Beats शुरू कर दिए हैं। 🎶`);
      speakText('जी मास्टर! आपके लिए म्यूजिक चला दिया है!');
      return;
    }

    // 3. VIDEO COMMAND ("video chalao")
    if (lower.includes('video') || lower.includes('वीडियो')) {
      openDashboard();
      switchDockTab('video');
      playDirectVideo();
      speakText('जी मास्टर! वीडियो प्लेयर ओपन करके वीडियो चला दिया है!');
      return;
    }

    // 4. REGULAR AI QUERY OR "KUCH BANAO" COMMAND
    if (state.currentScreen === 'hub') {
      handleHubPrompt(text);
    } else {
      handleSendPrompt(text);
    }
  }

  // Update Hub Dialogue Card
  function updateHubDialogue(userMsg, aiMsg) {
    DOM.dialogueContent.innerHTML = `
      <p style="color: #38bdf8; margin-bottom: 6px;"><strong>${escapeHtml(userMsg)}</strong></p>
      <p style="color: #f1f5f9; line-height: 1.6;">${formatChatMarkdown(aiMsg)}</p>
    `;
  }

  // ========================================================
  // 5. AI GENERATIVE STUDIO ("जो बोलें वो तुरंत बन जाए")
  // ========================================================

  async function handleHubPrompt(text) {
    if (!text || !text.trim()) return;

    DOM.hubTextInput.value = '';
    DOM.dialogueState.textContent = 'Thinking & Generating... (सोच रही हूँ)';
    updateHubDialogue(`Master: "${text}"`, 'AAIRA soch rahi hai aur kaam kar rahi hai... ⚡');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: state.chatHistory.slice(-6)
        })
      });

      const data = await res.json();

      if (data && data.success) {
        state.chatHistory.push({ role: 'user', content: text });
        state.chatHistory.push({ role: 'assistant', content: data.reply });

        updateHubDialogue(`Master: "${text}"`, data.reply);

        // If Code is generated! ("cod aana chahiye")
        if (data.hasCode && data.code) {
          state.currentCreationCode = data.code;
          state.currentCreationTitle = data.title || text.slice(0, 25);

          // Show Notification Card on Hub
          DOM.hubCodeTitle.textContent = state.currentCreationTitle;
          DOM.hubCodeNotification.classList.remove('hidden');

          // Load into Sandbox
          loadIntoSandbox(data.code, state.currentCreationTitle);

          speakText(`जी मास्टर विहुहुहु, मैंने ${state.currentCreationTitle} का कोड तैयार कर दिया है! आप डैशबोर्ड में जाकर इसे लाइव खेल सकते हैं।`);
        } else {
          speakText(data.reply);
        }

      } else {
        updateHubDialogue(`Master: "${text}"`, data.error || 'Samasya aayi. Kripya punah prayas karein.');
      }
    } catch (err) {
      updateHubDialogue(`Master: "${text}"`, 'Connection error: ' + err.message);
    }
  }

  async function handleSendPrompt(customText = null) {
    const text = (customText !== null ? customText : DOM.promptInput.value).trim();
    if (!text) return;

    DOM.promptInput.value = '';
    DOM.promptInput.style.height = 'auto';

    appendUserMessage(text);
    state.chatHistory.push({ role: 'user', content: text });

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

        appendAssistantMessage(reply, data.code, data.title);

        // Auto-run in Sandbox if code is generated!
        if (data.hasCode && data.code) {
          state.currentCreationCode = data.code;
          state.currentCreationTitle = data.title || text.slice(0, 25);
          loadIntoSandbox(data.code, state.currentCreationTitle);
          switchDockTab('sandbox');
        }

        speakText(reply);

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

    let formattedHtml = formatChatMarkdown(rawText);

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

    parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    parsed = parsed.replace(/```([a-z0-9]*)\s*([\s\S]*?)\s*```/gi, (match, lang, codeBody) => {
      return `<pre style="background: rgba(0,0,0,0.6); padding: 10px; border-radius: 6px; overflow-x: auto; font-family: monospace; font-size: 11px; margin: 8px 0; border: 1px solid rgba(0,240,255,0.2);"><code>${escapeHtml(codeBody)}</code></pre>`;
    });

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
  // 6. LIVE CODE SANDBOX RUNNER
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
    font-family: 'Segoe UI', sans-serif;
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
  // 7. INTEGRATED MUSIC PLAYER & AUDIO SPECTRUM VISUALIZER
  // ========================================================

  let audioCtx = null;
  let audioAnalyser = null;
  let audioSourceNode = null;
  let visualizerAnimId = null;

  function initMusicPlayer() {
    renderPlaylist();
    loadTrack(0);

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

    DOM.seekSlider.addEventListener('input', (e) => {
      if (DOM.mainAudioPlayer.duration) {
        DOM.mainAudioPlayer.currentTime = (e.target.value / 100) * DOM.mainAudioPlayer.duration;
      }
    });

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
        for (let i = 0; i < 32; i++) {
          dataArray[i] = 80 + Math.sin(Date.now() * 0.005 + i) * 60;
        }
      }

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
  // 8. 100% RELIABLE VIDEO PLAYER ("video nhi chal rha tha" FIX)
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

    if (DOM.videoPlayDirectBtn) {
      DOM.videoPlayDirectBtn.addEventListener('click', () => {
        playDirectVideo();
      });
    }

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

      const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (ytMatch && ytMatch[1]) {
        const embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=0`;
        loadVideo('youtube', embedUrl, 'Custom YouTube Stream');
      } else {
        loadVideo('direct', url, 'Custom Video Stream');
      }
    });
  }

  function playDirectVideo() {
    DOM.youtubeVideoFrame.classList.add('hidden');
    DOM.dashboardVideo.classList.remove('hidden');
    DOM.dashboardVideo.play().then(() => {
      if (DOM.videoPlayDirectBtn) DOM.videoPlayDirectBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
    }).catch(e => {
      console.warn('[Video Play failed - attempting muted play]', e);
      DOM.dashboardVideo.muted = true;
      DOM.dashboardVideo.play();
    });
  }

  function loadVideo(type, src, title = 'Video Stream') {
    DOM.currentVideoTitle.textContent = title;

    if (type === 'youtube') {
      DOM.dashboardVideo.pause();
      DOM.dashboardVideo.classList.add('hidden');
      DOM.youtubeVideoFrame.classList.remove('hidden');
      DOM.youtubeVideoFrame.src = src;
      if (DOM.videoPlayDirectBtn) DOM.videoPlayDirectBtn.style.display = 'none';
    } else {
      DOM.youtubeVideoFrame.src = '';
      DOM.youtubeVideoFrame.classList.add('hidden');
      DOM.dashboardVideo.classList.remove('hidden');
      DOM.dashboardVideo.src = src;
      DOM.dashboardVideo.load();
      if (DOM.videoPlayDirectBtn) DOM.videoPlayDirectBtn.style.display = 'block';

      // Play video with audio, fallback to muted if browser blocks
      DOM.dashboardVideo.play().catch(() => {
        DOM.dashboardVideo.muted = true;
        DOM.dashboardVideo.play().catch(() => {});
      });
    }
  }

  // ========================================================
  // 9. CREATIONS VAULT (TURSO CLOUD DB)
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
  // 10. DOCK TABS & EVENT LISTENERS
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

    if (window.innerWidth <= 960) {
      DOM.mediaDock.classList.add('mobile-open');
    }
  }

  function setupEventListeners() {
    // Screen 1: Voice Hub
    DOM.hubOrbCore.addEventListener('click', toggleListening);
    DOM.hubMicBtn.addEventListener('click', toggleListening);

    DOM.hubSendBtn.addEventListener('click', () => {
      const val = DOM.hubTextInput.value.trim();
      if (val) handleVoiceInput(val);
    });

    DOM.hubTextInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = DOM.hubTextInput.value.trim();
        if (val) handleVoiceInput(val);
      }
    });

    // Auto-Listen Switch
    DOM.autoListenToggle.addEventListener('click', () => {
      state.autoListen = !state.autoListen;
      DOM.autoListenToggle.classList.toggle('active', state.autoListen);
      DOM.autoListenToggle.innerHTML = state.autoListen
        ? '<i class="fa-solid fa-ear-listen"></i> <span>AUTO-LISTEN: ON</span>'
        : '<i class="fa-solid fa-ear-deaf"></i> <span>AUTO-LISTEN: OFF</span>';
    });

    // Hub Go to Dashboard
    DOM.hubGoDashboardBtn.addEventListener('click', () => openDashboard());
    DOM.hubRunInDashBtn.addEventListener('click', () => {
      openDashboard();
      switchDockTab('sandbox');
    });

    // Hub Voice Chips
    DOM.voiceChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd');
        DOM.hubTextInput.value = cmd;
        handleVoiceInput(cmd);
      });
    });

    // Screen 2: Top Nav buttons
    DOM.backToHubBtn.addEventListener('click', openVoiceHub);

    DOM.ttsToggleBtn.addEventListener('click', () => {
      state.ttsEnabled = !state.ttsEnabled;
      DOM.ttsToggleBtn.classList.toggle('active', state.ttsEnabled);
      DOM.ttsToggleBtn.innerHTML = state.ttsEnabled
        ? '<i class="fa-solid fa-volume-high"></i> <span class="hide-mobile">VOICE ON</span>'
        : '<i class="fa-solid fa-volume-xmark"></i> <span class="hide-mobile">VOICE OFF</span>';
    });

    DOM.toggleSandboxBtn.addEventListener('click', () => switchDockTab('sandbox'));
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

    // Dashboard Chat input
    DOM.sendBtn.addEventListener('click', () => handleSendPrompt());
    DOM.promptInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendPrompt();
      }
    });

    DOM.promptInput.addEventListener('input', () => {
      DOM.promptInput.style.height = 'auto';
      DOM.promptInput.style.height = Math.min(DOM.promptInput.scrollHeight, 120) + 'px';
    });

    DOM.micBtn.addEventListener('click', toggleListening);

    // Dashboard Quick Prompts Ribbon
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
    initSpeechRecognition();
    setupEventListeners();
  });

})();
