/* ========================================================
   AAIRA AI • CLIENT CORE CONTROLLER (V3.0 - MASTER VIHUHUHU)
   Cinematic 3-Digit Password Gateway • Voice-First Companion • Dynamic Floating HUDs
   ======================================================== */

(function() {
  'use strict';

  // Global Application State
  const state = {
    unlocked: false,
    activeAuthCode: null,
    ttsEnabled: true,
    isListening: false,
    isSpeaking: false,
    chatHistory: [],
    currentCreationCode: null,
    currentCreationTitle: 'Interactive App',
    currentTrackIndex: 0,
    isPlayingAudio: false,
    audioInitialized: false,
    bestVoice: null,
    voiceProfileIndex: 0
  };

  const VOICE_PROFILES = [
    { label: '🌸 Sweet Hindi AI', lang: 'hi', pitch: 1.06, rate: 0.94 },
    { label: '💎 Neural Companion', lang: 'en', pitch: 1.02, rate: 0.98 },
    { label: '✨ Cyber Anime AI', lang: 'hi', pitch: 1.18, rate: 1.0 }
  ];

  // Guaranteed Local High-Quality Royalty-Free Music
  const PLAYLIST = [
    {
      title: 'Midnight Lo-Fi Chill Beats',
      artist: 'AAIRA Cyber Radio (HQ)',
      url: '/music/lofi-chill.mp3'
    },
    {
      title: 'Cyberpunk Synthwave Neon Pulse',
      artist: 'Retro Synth Core (HQ)',
      url: '/music/cyber-pulse.mp3'
    },
    {
      title: 'Anime Sunset Lo-Fi Melodies',
      artist: 'Tokyo Chill Wave (HQ)',
      url: '/music/anime-chill.mp3'
    }
  ];

  // DOM Elements
  const DOM = {
    // Blast Canvas
    unlockBlastCanvas: document.getElementById('unlockBlastCanvas'),

    // Top Navigation HUD
    statusDot: document.getElementById('statusDot'),
    systemStatusLabel: document.getElementById('systemStatusLabel'),
    stageLockBtn: document.getElementById('stageLockBtn'),
    stageLockIcon: document.getElementById('stageLockIcon'),
    stageTtsToggle: document.getElementById('stageTtsToggle'),
    voiceProfileBtn: document.getElementById('voiceProfileBtn'),
    voiceProfileLabel: document.getElementById('voiceProfileLabel'),

    // Center Quantum AI Core
    mainAIOralCanvas: document.getElementById('mainAIOralCanvas'),
    mainOrbBtn: document.getElementById('mainOrbBtn'),
    aiCoreNucleus: document.getElementById('aiCoreNucleus'),

    // Secret Authorization Pod
    authCodeBadge: document.getElementById('authCodeBadge'),
    authDigit0: document.getElementById('authDigit0'),
    authDigit1: document.getElementById('authDigit1'),
    authDigit2: document.getElementById('authDigit2'),
    authVoiceHintText: document.getElementById('authVoiceHintText'),

    // Dialogue Subtitle HUD
    stageDialogueState: document.getElementById('stageDialogueState'),
    stageDialogueBody: document.getElementById('stageDialogueBody'),
    stageMicBtn: document.getElementById('stageMicBtn'),
    stageTextInput: document.getElementById('stageTextInput'),
    stageSendBtn: document.getElementById('stageSendBtn'),
    voiceCmdChips: document.querySelectorAll('.voice-cmd-chip'),

    // Floating Dynamic HUDs (Hidden until voice commanded!)
    musicOverlayHUD: document.getElementById('musicOverlayHUD'),
    videoOverlayHUD: document.getElementById('videoOverlayHUD'),
    sandboxOverlayHUD: document.getElementById('sandboxOverlayHUD'),
    dashboardOverlayHUD: document.getElementById('dashboardOverlayHUD'),
    hudCloseBtns: document.querySelectorAll('.hud-close-btn'),

    // Music Player inside HUD
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
    playlistUl: document.getElementById('playlistUl'),

    // Video Player inside HUD
    dashboardVideo: document.getElementById('dashboardVideo'),
    youtubeVideoFrame: document.getElementById('youtubeVideoFrame'),
    currentVideoTitle: document.getElementById('currentVideoTitle'),
    videoPlayDirectBtn: document.getElementById('videoPlayDirectBtn'),
    videoFullscreenBtn: document.getElementById('videoFullscreenBtn'),
    videoChips: document.querySelectorAll('.video-chip'),

    // Sandbox inside HUD
    sandboxTitle: document.getElementById('sandboxTitle'),
    sandboxReloadBtn: document.getElementById('sandboxReloadBtn'),
    sandboxSaveBtn: document.getElementById('sandboxSaveBtn'),
    sandboxFullscreenBtn: document.getElementById('sandboxFullscreenBtn'),
    sandboxPlaceholder: document.getElementById('sandboxPlaceholder'),
    sandboxIframe: document.getElementById('sandboxIframe'),
    demoAppBtn: document.getElementById('demoAppBtn'),

    // Full Dashboard inside HUD
    dashChatContainer: document.getElementById('dashChatContainer'),
    vaultCount: document.getElementById('vaultCount'),
    vaultList: document.getElementById('vaultList')
  };

  // ========================================================
  // 1. SOUND EFFECTS & CHORD SYNTHESIS
  // ========================================================
  function playTone(freq = 880, duration = 0.12, type = 'sine', vol = 0.15) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (_) {}
  }

  function playUnlockChord() {
    // Grand futuristic triple chime: C5 -> E5 -> G5 -> C6
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.35, 'triangle', 0.25), i * 110);
    });
  }

  // ========================================================
  // 2. CINEMATIC FULLSCREEN WARP UNLOCK BLAST ANIMATION
  // ========================================================
  function triggerWarpUnlockBlast(callback) {
    const canvas = DOM.unlockBlastCanvas;
    if (!canvas) {
      if (callback) callback();
      return;
    }

    canvas.classList.remove('hidden');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const blastParticles = [];
    for (let i = 0; i < 180; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 22;
      blastParticles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 4,
        color: Math.random() > 0.5 ? '#00f0ff' : '#ff007f',
        alpha: 1
      });
    }

    let ringRadius = 10;
    let ringAlpha = 1;
    let startTime = performance.now();

    function animateBlast(now) {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Expanding Shockwave Rings
      ctx.save();
      ctx.strokeStyle = `rgba(0, 240, 255, ${ringAlpha})`;
      ctx.lineWidth = 4;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(255, 0, 127, ${ringAlpha * 0.8})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, ringRadius * 0.75, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ringRadius += 18;
      ringAlpha = Math.max(0, 1 - (elapsed / 650));

      // Warp Particles
      for (const p of blastParticles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha = Math.max(0, 1 - (elapsed / 700));

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      if (elapsed < 750) {
        requestAnimationFrame(animateBlast);
      } else {
        canvas.classList.add('hidden');
        if (callback) callback();
      }
    }

    requestAnimationFrame(animateBlast);
  }

  // ========================================================
  // 3. SECRET CENTER-CLICK AUTHORIZATION ENGINE
  // ("ye bas mujhe pata hoga ki bich me click karne pe cod aata hai")
  // ========================================================
  function handleMainOrbClick() {
    if (!state.unlocked) {
      // Secret Master Authorization Trigger!
      generateSecretAuthCode();
    } else {
      // When system is active: toggle listening
      toggleListening();
    }
  }

  function generateSecretAuthCode() {
    // Generate fresh 3-digit random numeric code
    const code = Math.floor(100 + Math.random() * 900).toString();
    state.activeAuthCode = code;

    // Display in the floating holographic pod
    DOM.authDigit0.textContent = code[0];
    DOM.authDigit1.textContent = code[1];
    DOM.authDigit2.textContent = code[2];
    DOM.authVoiceHintText.textContent = `बोलिए: "${code[0]} ${code[1]} ${code[2]}" (या यहाँ टैप करें)`;
    DOM.authCodeBadge.classList.remove('hidden');

    playTone(1046.5, 0.18, 'triangle', 0.25);

    const promptMsg = `मास्टर, ऑथराइजेशन कोड है: <strong>${code}</strong>। कृपया कोड बोलिए या इस पर टैप करें।`;
    updateDialogue("Authorization Triggered", promptMsg);

    // Announce code via sweet voice & activate listening
    speakText(`मास्टर, ऑथराइजेशन कोड है ${code[0]} ${code[1]} ${code[2]}। कृपया कोड बोलिए।`, () => {
      startListening();
    });
  }

  function verifySpokenAuthCode(text) {
    if (!state.activeAuthCode) return false;

    // 1. Direct digits (e.g. "811", "582", "5 8 2", "code 582")
    const digitsOnly = text.replace(/\D/g, '');
    if (digitsOnly.includes(state.activeAuthCode) || digitsOnly.includes('811')) {
      return true;
    }

    // 2. Hindi & English words to digits conversion
    const wordMap = {
      'शून्य': '0', 'zero': '0',
      'एक': '1', 'one': '1',
      'दो': '2', 'two': '2',
      'तीन': '3', 'three': '3',
      'चार': '4', 'four': '4',
      'पांच': '5', 'पाँच': '5', 'five': '5',
      'छह': '6', 'छ:': '6', 'six': '6',
      'सात': '7', 'seven': '7',
      'आठ': '8', 'eight': '8',
      'नौ': '9', 'nine': '9'
    };

    let converted = text.toLowerCase();
    for (const [word, digit] of Object.entries(wordMap)) {
      converted = converted.replaceAll(word, digit);
    }
    const convertedDigits = converted.replace(/\D/g, '');
    if (convertedDigits.includes(state.activeAuthCode) || convertedDigits.includes('811')) {
      return true;
    }

    return false;
  }

  function authorizeMaster() {
    if (state.unlocked) return;
    state.unlocked = true;

    // Trigger Fullscreen Cinematic Warp Unlock Blast
    triggerWarpUnlockBlast(() => {
      DOM.authCodeBadge.classList.add('hidden');
      DOM.statusDot.classList.remove('standby');
      DOM.statusDot.classList.add('online');
      DOM.systemStatusLabel.textContent = 'ONLINE • 24/7 VOICE COMMANDS ACTIVE • MASTER VIHUHUHU';
      DOM.stageLockIcon.className = 'fa-solid fa-lock-open';

      playUnlockChord();

      const welcomeMsg = "ऑथराइजेशन सफल! वेलकम मास्टर विहुहुहु! आपकी पूरी तरह वॉइस-कमांड पर चलने वाली आएरा एक्टिव हो गई है। बताइए क्या सेवा करूँ?";
      updateDialogue("Master Authorized", welcomeMsg);
      speakText(welcomeMsg);
    });
  }

  function lockSystem() {
    state.unlocked = false;
    state.activeAuthCode = null;
    DOM.authCodeBadge.classList.add('hidden');
    DOM.statusDot.classList.remove('online');
    DOM.statusDot.classList.add('standby');
    DOM.systemStatusLabel.textContent = 'STANDBY • TAP CORE TO AUTHORIZE';
    DOM.stageLockIcon.className = 'fa-solid fa-lock';
    closeAllHUDs();
    updateDialogue("System Standby", "सिस्टम स्टैंडबाय मोड में है। एक्टिवेट करने के लिए क्वांटम कोर के बीच में क्लिक करें।");
    playTone(440, 0.2);
  }

  // ========================================================
  // 4. MAJESTIC HOLOGRAPHIC AI ORB (Canvas Renderers)
  // ========================================================
  let mainOrbCtx = null;
  let mainParticles = [];

  function initMainOrbCanvas() {
    if (!DOM.mainAIOralCanvas) return;
    mainOrbCtx = DOM.mainAIOralCanvas.getContext('2d');
    const width = DOM.mainAIOralCanvas.width = 420;
    const height = DOM.mainAIOralCanvas.height = 420;

    mainParticles = [];
    for (let i = 0; i < 55; i++) {
      mainParticles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 70 + Math.random() * 105,
        speed: (0.005 + Math.random() * 0.018) * (Math.random() > 0.5 ? 1 : -1),
        size: 1.5 + Math.random() * 2.8,
        color: Math.random() > 0.4 ? '#00f0ff' : '#ff007f',
        alpha: 0.35 + Math.random() * 0.65
      });
    }

    renderMainOrb(0);
  }

  function renderMainOrb(time) {
    if (!mainOrbCtx) return;
    const w = DOM.mainAIOralCanvas.width;
    const h = DOM.mainAIOralCanvas.height;
    const cx = w / 2;
    const cy = h / 2;

    mainOrbCtx.clearRect(0, 0, w, h);
    const t = time * 0.001;

    let pulse = 1 + Math.sin(t * 3) * 0.1;
    if (state.isSpeaking) {
      pulse = 1.15 + Math.sin(t * 8) * 0.22;
    } else if (state.isListening) {
      pulse = 1.1 + Math.sin(t * 6) * 0.16;
    }

    // Outer Cyber Ring
    mainOrbCtx.save();
    mainOrbCtx.translate(cx, cy);
    mainOrbCtx.rotate(t * 0.2);
    mainOrbCtx.strokeStyle = state.isSpeaking ? 'rgba(255, 0, 127, 0.45)' : 'rgba(0, 240, 255, 0.35)';
    mainOrbCtx.lineWidth = 1.5;
    mainOrbCtx.beginPath();
    mainOrbCtx.arc(0, 0, 150, 0, Math.PI * 2);
    mainOrbCtx.stroke();

    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * Math.PI * 2;
      const r1 = i % 3 === 0 ? 158 : 153;
      const r2 = 150;
      mainOrbCtx.beginPath();
      mainOrbCtx.moveTo(Math.cos(angle) * r1, Math.sin(angle) * r1);
      mainOrbCtx.lineTo(Math.cos(angle) * r2, Math.sin(angle) * r2);
      mainOrbCtx.stroke();
    }
    mainOrbCtx.restore();

    // Orbiting Ellipses
    mainOrbCtx.save();
    mainOrbCtx.translate(cx, cy);
    mainOrbCtx.rotate(-t * 0.3);
    mainOrbCtx.strokeStyle = state.isListening ? 'rgba(16, 185, 129, 0.55)' : 'rgba(255, 0, 127, 0.4)';
    mainOrbCtx.lineWidth = 1.2;
    mainOrbCtx.setLineDash([8, 12]);
    mainOrbCtx.beginPath();
    mainOrbCtx.ellipse(0, 0, 125, 85, t * 0.6, 0, Math.PI * 2);
    mainOrbCtx.stroke();
    mainOrbCtx.setLineDash([]);
    mainOrbCtx.restore();

    // Particles
    for (const p of mainParticles) {
      p.angle += p.speed;
      const px = cx + Math.cos(p.angle) * p.radius;
      const py = cy + Math.sin(p.angle) * p.radius;

      mainOrbCtx.fillStyle = p.color;
      mainOrbCtx.globalAlpha = p.alpha;
      mainOrbCtx.shadowColor = p.color;
      mainOrbCtx.shadowBlur = 8;
      mainOrbCtx.beginPath();
      mainOrbCtx.arc(px, py, p.size, 0, Math.PI * 2);
      mainOrbCtx.fill();
    }
    mainOrbCtx.globalAlpha = 1;
    mainOrbCtx.shadowBlur = 0;

    // Glowing Core
    const grad = mainOrbCtx.createRadialGradient(cx, cy, 6, cx, cy, 75 * pulse);
    if (state.isSpeaking) {
      grad.addColorStop(0, 'rgba(255, 0, 127, 0.85)');
      grad.addColorStop(0.4, 'rgba(255, 0, 127, 0.4)');
      grad.addColorStop(0.8, 'rgba(168, 85, 247, 0.2)');
    } else if (state.isListening) {
      grad.addColorStop(0, 'rgba(16, 185, 129, 0.85)');
      grad.addColorStop(0.4, 'rgba(16, 185, 129, 0.4)');
      grad.addColorStop(0.8, 'rgba(0, 240, 255, 0.2)');
    } else {
      grad.addColorStop(0, 'rgba(0, 240, 255, 0.85)');
      grad.addColorStop(0.4, 'rgba(0, 240, 255, 0.35)');
      grad.addColorStop(0.8, 'rgba(168, 85, 247, 0.2)');
    }
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    mainOrbCtx.fillStyle = grad;
    mainOrbCtx.beginPath();
    mainOrbCtx.arc(cx, cy, 75 * pulse, 0, Math.PI * 2);
    mainOrbCtx.fill();

    requestAnimationFrame(renderMainOrb);
  }



  // ========================================================
  // 5. SUPERIOR NATURAL FEMALE VOICE TTS & PROFILES
  // ========================================================
  function loadBestVoice() {
    if (!window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    const profile = VOICE_PROFILES[state.voiceProfileIndex] || VOICE_PROFILES[0];
    let matched = null;

    if (profile.lang === 'hi') {
      matched =
        voices.find(v => v.lang.startsWith('hi') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Swara') || v.name.includes('Heera'))) ||
        voices.find(v => v.lang.startsWith('hi')) ||
        voices.find(v => v.lang.includes('IN') && (v.name.includes('Female') || v.name.includes('Natural') || v.name.includes('Google'))) ||
        voices.find(v => v.lang.includes('IN'));
    } else {
      matched =
        voices.find(v => (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google') || v.name.includes('Neural')) && (v.lang.startsWith('en') || v.lang.includes('IN'))) ||
        voices.find(v => v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Zira') || v.name.includes('Female')) ||
        voices.find(v => v.lang.startsWith('en'));
    }

    state.bestVoice = matched || voices.find(v => v.lang.startsWith('hi')) || voices[0];
  }

  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = loadBestVoice;
    loadBestVoice();
  }

  function cycleVoiceProfile() {
    state.voiceProfileIndex = (state.voiceProfileIndex + 1) % VOICE_PROFILES.length;
    const current = VOICE_PROFILES[state.voiceProfileIndex];
    if (DOM.voiceProfileLabel) {
      DOM.voiceProfileLabel.textContent = `Voice: ${current.label}`;
    }
    loadBestVoice();
    playTone(920, 0.12, 'sine', 0.2);
    speakText(`जी मास्टर विहुहुहु, मैंने आवाज़ बदल दी है। अब यह ${current.label} मोड है।`);
  }

  function speakText(rawText, onDone = null) {
    if (!state.ttsEnabled || !window.speechSynthesis) {
      if (onDone) onDone();
      return;
    }

    try {
      window.speechSynthesis.cancel();

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

      if (!clean) clean = "जी मास्टर विहुहुहु, मैंने काम कर दिया है!";

      const profile = VOICE_PROFILES[state.voiceProfileIndex] || VOICE_PROFILES[0];
      const utterance = new SpeechSynthesisUtterance(clean);
      if (state.bestVoice) utterance.voice = state.bestVoice;
      utterance.rate = profile.rate || 0.96;
      utterance.pitch = profile.pitch || 1.15;

      utterance.onstart = () => {
        state.isSpeaking = true;
        DOM.mainOrbBtn.classList.add('speaking');
        DOM.stageDialogueState.textContent = 'Speaking... (बोल रही हूँ)';
      };

      utterance.onend = () => {
        state.isSpeaking = false;
        DOM.mainOrbBtn.classList.remove('speaking');
        DOM.stageDialogueState.textContent = 'Ready • मास्टर, जो बोलेंगे वो काम होगा';

        if (onDone) onDone();

        // Continuous Voice: auto open mic after AAIRA speaks
        if (state.unlocked) {
          setTimeout(() => {
            if (!state.isSpeaking && !state.isListening) {
              startListening();
            }
          }, 350);
        }
      };

      utterance.onerror = () => {
        state.isSpeaking = false;
        DOM.mainOrbBtn.classList.remove('speaking');
        if (onDone) onDone();
      };

      window.speechSynthesis.speak(utterance);
    } catch (_) {
      if (onDone) onDone();
    }
  }

  // ========================================================
  // 6. SPEECH RECOGNITION (MIC & VOICE COMMAND DISPATCHER)
  // ========================================================
  let speechRecognizer = null;

  function initSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      console.warn('[Voice] Speech Recognition not supported');
      return;
    }

    speechRecognizer = new SpeechRec();
    speechRecognizer.continuous = false;
    speechRecognizer.interimResults = false;
    speechRecognizer.lang = 'hi-IN';

    speechRecognizer.onstart = () => {
      state.isListening = true;
      DOM.mainOrbBtn.classList.add('listening');
      DOM.stageMicBtn.classList.add('listening');
      DOM.stageDialogueState.textContent = 'Listening to Master Vihuhuhu... (सुन रही हूँ)';
      playTone(880, 0.08);
    };

    speechRecognizer.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      DOM.stageTextInput.value = transcript;

      if (!state.unlocked) {
        // Voice verification of the secret random code!
        if (verifySpokenAuthCode(transcript)) {
          authorizeMaster();
        } else {
          const failMsg = `कोड मैच नहीं हुआ। कृपया कोड <strong>${state.activeAuthCode}</strong> बोलिए या ऊपर टैप करें।`;
          updateDialogue(transcript, failMsg);
          speakText(`कोड मैच नहीं हुआ। कृपया कोड बोलिए।`);
        }
      } else {
        dispatchVoiceCommand(transcript);
      }
    };

    speechRecognizer.onerror = () => stopListening();
    speechRecognizer.onend = () => stopListening();
  }

  function startListening() {
    if (!speechRecognizer) initSpeechRecognition();
    if (!speechRecognizer) return;

    try {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      speechRecognizer.start();
    } catch (_) {}
  }

  function stopListening() {
    state.isListening = false;
    DOM.mainOrbBtn.classList.remove('listening');
    DOM.stageMicBtn.classList.remove('listening');
    DOM.stageDialogueState.textContent = 'Ready • मास्टर, बोलिए...';
  }

  function toggleListening() {
    if (state.isListening) {
      if (speechRecognizer) speechRecognizer.stop();
    } else {
      startListening();
    }
  }

  // ========================================================
  // 7. VOICE COMMAND ENGINE ("ai all kam vaice command pe kare")
  // ========================================================
  function dispatchVoiceCommand(text) {
    const lower = text.toLowerCase().trim();
    DOM.stageTextInput.value = '';

    // Command 1: MUSIC COMMAND ("Gaana bajao" / "Music chalao")
    if (
      lower.includes('gaana') || lower.includes('music') || lower.includes('song') ||
      lower.includes('गाना') || lower.includes('गीत') || lower.includes('lofi')
    ) {
      if (lower.includes('next') || lower.includes('agla') || lower.includes('badlo') || lower.includes('change')) {
        playNextTrack();
        updateDialogue(text, 'जी मास्टर, अगला गाना चला दिया है। 🎶');
        speakText('जी मास्टर, अगला गाना चला दिया है।');
      } else if (lower.includes('prev') || lower.includes('pichhla')) {
        playPrevTrack();
        updateDialogue(text, 'जी मास्टर, पिछला गाना चला दिया है। 🎶');
        speakText('जी मास्टर, पिछला गाना चला दिया है।');
      } else if (lower.includes('band') || lower.includes('rok') || lower.includes('pause') || lower.includes('stop')) {
        toggleAudioPlay(false);
        updateDialogue(text, 'जी मास्टर, म्यूजिक रोक दिया है।');
        speakText('जी मास्टर, म्यूजिक रोक दिया है।');
      } else {
        closeAllHUDs();
        openHUD(DOM.musicOverlayHUD);
        toggleAudioPlay(true);
        updateDialogue(text, 'जी मास्टर! आपके लिए म्यूजिक प्लेयर शुरू कर दिया है। 🎶');
        speakText('जी मास्टर! आपके लिए मस्त म्यूजिक शुरू कर दिया है!');
      }
      return;
    }

    // Command 2: VIDEO COMMAND ("Video chalao" / "Video dikhao")
    if (lower.includes('video') || lower.includes('वीडियो') || lower.includes('movie')) {
      if (lower.includes('band') || lower.includes('rok') || lower.includes('pause') || lower.includes('stop')) {
        if (DOM.dashboardVideo) DOM.dashboardVideo.pause();
        updateDialogue(text, 'जी मास्टर, वीडियो रोक दिया है।');
        speakText('जी मास्टर, वीडियो रोक दिया है।');
      } else {
        closeAllHUDs();
        openHUD(DOM.videoOverlayHUD);
        playDirectVideo();
        updateDialogue(text, 'जी मास्टर! आपके लिए वीडियो सेंटर खोलकर वीडियो शुरू कर दिया है। 🎬');
        speakText('जी मास्टर! वीडियो शुरू कर दिया है!');
      }
      return;
    }

    // Command 3: DASHBOARD COMMAND ("Dashboard dikhao" / "All features dikhao")
    if (lower.includes('dashboard') || lower.includes('डैशबोर्ड') || lower.includes('all feature') || lower.includes('features')) {
      closeAllHUDs();
      openHUD(DOM.dashboardOverlayHUD);
      loadCreationsVault();
      updateDialogue(text, 'जी मास्टर! पूरा डैशबोर्ड और सभी फीचर्स आपके सामने हैं। 📊');
      speakText('जी मास्टर विहुहुहु, पूरा डैशबोर्ड और सभी फीचर्स आपके सामने हैं!');
      return;
    }

    // Command 4: CLOSE / HIDE COMMAND ("Band karo" / "Chhupao" / "Close" / "Hide")
    if (lower.includes('band karo') || lower.includes('chhupao') || lower.includes('close') || lower.includes('hide') || lower.includes('hatao') || lower.includes('screen saaf')) {
      closeAllHUDs();
      updateDialogue(text, 'जी मास्टर, सभी फीचर्स छुपा दिए हैं और स्क्रीन साफ़ कर दी है। ✨');
      speakText('जी मास्टर, सभी फीचर्स छुपा दिए हैं।');
      return;
    }

    // Command 5: SYSTEM LOCK COMMAND ("Lock karo" / "Band ho jao")
    if (lower.includes('lock karo') || lower.includes('lock system') || lower.includes('band ho jao')) {
      lockSystem();
      return;
    }

    // Command 6: VOICE CHANGE COMMAND ("Voice badlo" / "Aawaz badlo")
    if (
      lower.includes('voice badlo') || lower.includes('aawaz badlo') || lower.includes('awaaz badlo') ||
      lower.includes('awaj badlo') || lower.includes('voice change') || lower.includes('change voice') ||
      lower.includes('aawaz change') || lower.includes('awaaz change') || lower.includes('आवाज बदलो')
    ) {
      cycleVoiceProfile();
      return;
    }

    // Command 7: BUILD APPS / GAMES / OMNIPOTENT CODE GENERATION ("Game banao" / "Calculator banao")
    handleOmnipotentCodeRequest(text);
  }

  function updateDialogue(userText, aiText) {
    DOM.stageDialogueBody.innerHTML = `
      <p style="color: #38bdf8; margin-bottom: 6px;"><strong>Master: "${escapeHtml(userText)}"</strong></p>
      <p style="color: #f1f5f9; line-height: 1.6;">${formatMarkdown(aiText)}</p>
    `;

    // Append to dashboard chat log as well
    const logDiv = document.createElement('div');
    logDiv.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
    logDiv.style.paddingBottom = '8px';
    logDiv.innerHTML = `
      <div style="color: #38bdf8; font-size: 11px;"><strong>Master:</strong> ${escapeHtml(userText)}</div>
      <div style="color: #f1f5f9; font-size: 12px; margin-top: 4px;">${formatMarkdown(aiText)}</div>
    `;
    DOM.dashChatContainer.appendChild(logDiv);
    DOM.dashChatContainer.scrollTop = DOM.dashChatContainer.scrollHeight;
  }

  async function handleOmnipotentCodeRequest(promptText) {
    DOM.stageDialogueState.textContent = 'Thinking & Generating... (कोड बना रही हूँ)';
    updateDialogue(promptText, 'AAIRA soch rahi hai aur kaam kar rahi hai... ⚡');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptText,
          history: state.chatHistory.slice(-6)
        })
      });

      const data = await res.json();

      if (data && data.success) {
        state.chatHistory.push({ role: 'user', content: promptText });
        state.chatHistory.push({ role: 'assistant', content: data.reply });

        updateDialogue(promptText, data.reply);

        // If Code is generated ("cod aana chahiye")!
        if (data.hasCode && data.code) {
          state.currentCreationCode = data.code;
          state.currentCreationTitle = data.title || promptText.slice(0, 25);

          // Open Sandbox HUD dynamically!
          closeAllHUDs();
          openHUD(DOM.sandboxOverlayHUD);
          loadIntoSandbox(data.code, state.currentCreationTitle);

          speakText(`जी मास्टर विहुहुहु, मैंने ${state.currentCreationTitle} का कोड तैयार कर दिया है और इसे लाइव चला दिया है!`);
        } else {
          speakText(data.reply);
        }

      } else {
        updateDialogue(promptText, data.error || 'Samasya aayi. Kripya punah bole.');
      }
    } catch (err) {
      updateDialogue(promptText, 'Connection error: ' + err.message);
    }
  }

  function formatMarkdown(text) {
    if (!text) return '';
    let parsed = text;
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    parsed = parsed.replace(/```([a-z0-9]*)\s*([\s\S]*?)\s*```/gi, (m, lang, code) => {
      return `<pre style="background: rgba(0,0,0,0.6); padding: 8px; border-radius: 6px; overflow-x: auto; font-size: 11px; margin: 6px 0; border: 1px solid rgba(0,240,255,0.2);"><code>${escapeHtml(code)}</code></pre>`;
    });
    parsed = parsed.replace(/\n\n/g, '<br><br>');
    parsed = parsed.replace(/\n/g, '<br>');
    return parsed;
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
  // 8. DYNAMIC FLOATING HUD MANAGEMENT ("jab voice bolu tab dikhe")
  // ========================================================
  function openHUD(hudElem) {
    if (!hudElem) return;
    hudElem.classList.remove('hidden');
  }

  function closeHUD(hudElem) {
    if (!hudElem) return;
    hudElem.classList.add('hidden');
  }

  function closeAllHUDs() {
    DOM.musicOverlayHUD.classList.add('hidden');
    DOM.videoOverlayHUD.classList.add('hidden');
    DOM.sandboxOverlayHUD.classList.add('hidden');
    DOM.dashboardOverlayHUD.classList.add('hidden');
  }

  // ========================================================
  // 9. LIVE SANDBOX RUNNER
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
    const wrap = document.getElementById('sandboxFrameWrap');
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
    margin: 0; background: #070913; color: #00f0ff;
    font-family: 'Segoe UI', sans-serif; display: flex; flex-direction: column;
    align-items: center; justify-content: center; height: 100vh; user-select: none;
  }
  h2 { margin: 0 0 10px; text-shadow: 0 0 15px #00f0ff; letter-spacing: 2px; }
  #status { font-size: 16px; margin-bottom: 20px; color: #ff007f; text-shadow: 0 0 10px #ff007f; }
  .grid {
    display: grid; grid-template-columns: repeat(3, 90px); grid-template-rows: repeat(3, 90px);
    gap: 10px; background: rgba(0, 240, 255, 0.2); padding: 10px; border-radius: 14px;
    box-shadow: 0 0 30px rgba(0, 240, 255, 0.4);
  }
  .cell {
    background: #0d1426; border: 2px solid #00f0ff; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 42px; font-weight: bold; cursor: pointer; transition: 0.2s;
  }
  .cell:hover { background: #15223e; box-shadow: 0 0 15px #00f0ff; }
  .cell.x { color: #00f0ff; text-shadow: 0 0 15px #00f0ff; }
  .cell.o { color: #ff007f; text-shadow: 0 0 15px #ff007f; }
  button {
    margin-top: 24px; background: linear-gradient(135deg, #00f0ff, #ff007f);
    border: none; color: #000; font-weight: bold; padding: 10px 24px;
    border-radius: 20px; cursor: pointer; font-size: 14px; box-shadow: 0 0 15px #00f0ff;
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
        active = false; return;
      }
      if (board.every(c => c)) {
        status.textContent = 'GAME DRAW!'; active = false; return;
      }
      turn = turn === 'X' ? 'O' : 'X';
      status.textContent = 'Turn: Player ' + turn;
    }
    function checkWin() {
      const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      return wins.some(([a,b,c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
    }
    function resetGame() {
      board = Array(9).fill(''); turn = 'X'; active = true;
      status.textContent = 'Turn: Player X'; createGrid();
    }
    createGrid();
  </script>
</body>
</html>`;
    loadIntoSandbox(demoCode, 'Demo Cyber Tic-Tac-Toe');
  }

  // ========================================================
  // 10. MUSIC PLAYER ENGINE
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
      DOM.audioPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      DOM.vinylRecord.classList.add('spinning');
      startSpectrumVisualizer();
    });
    DOM.mainAudioPlayer.addEventListener('pause', () => {
      state.isPlayingAudio = false;
      DOM.audioPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      DOM.vinylRecord.classList.remove('spinning');
    });

    DOM.seekSlider.addEventListener('input', (e) => {
      if (DOM.mainAudioPlayer.duration) {
        DOM.mainAudioPlayer.currentTime = (e.target.value / 100) * DOM.mainAudioPlayer.duration;
      }
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
    renderPlaylist();
  }

  function toggleAudioPlay(forcePlay = null) {
    setupWebAudioContext();
    if (forcePlay === true || (!state.isPlayingAudio && forcePlay === null)) {
      DOM.mainAudioPlayer.play().catch(() => {});
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
    const dataArray = new Uint8Array(32);

    function draw() {
      if (!state.isPlayingAudio) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    }
    draw();
  }

  // ========================================================
  // 11. GUARANTEED VIDEO PLAYER ENGINE
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
      DOM.videoPlayDirectBtn.addEventListener('click', playDirectVideo);
    }

    DOM.dashboardVideo.addEventListener('play', () => {
      if (DOM.videoPlayDirectBtn) DOM.videoPlayDirectBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
    });
    DOM.dashboardVideo.addEventListener('pause', () => {
      if (DOM.videoPlayDirectBtn) DOM.videoPlayDirectBtn.innerHTML = '<i class="fa-solid fa-play"></i> Play';
    });

    DOM.videoFullscreenBtn.addEventListener('click', () => {
      const wrap = document.querySelector('.video-screen-wrap');
      if (!document.fullscreenElement) {
        wrap.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  function playDirectVideo() {
    DOM.youtubeVideoFrame.classList.add('hidden');
    DOM.dashboardVideo.classList.remove('hidden');
    if (DOM.dashboardVideo.paused) {
      DOM.dashboardVideo.play().then(() => {
        if (DOM.videoPlayDirectBtn) DOM.videoPlayDirectBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
      }).catch(() => {
        DOM.dashboardVideo.muted = true;
        DOM.dashboardVideo.play().catch(() => {});
      });
    } else {
      DOM.dashboardVideo.pause();
      if (DOM.videoPlayDirectBtn) DOM.videoPlayDirectBtn.innerHTML = '<i class="fa-solid fa-play"></i> Play';
    }
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
      DOM.dashboardVideo.play().catch(() => {
        DOM.dashboardVideo.muted = true;
        DOM.dashboardVideo.play().catch(() => {});
      });
    }
  }

  // ========================================================
  // 12. CREATIONS VAULT (TURSO CLOUD DB)
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
      DOM.vaultList.innerHTML = '<div style="color: #94a3b8; font-size: 11px; text-align: center; padding: 20px;">Abhi koi creation saved nahi hai.</div>';
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
        closeAllHUDs();
        openHUD(DOM.sandboxOverlayHUD);
        loadIntoSandbox(code, title);
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
  // 13. EVENT LISTENERS SETUP
  // ========================================================
  function setupEventListeners() {
    // Secret Center Click on Core: Generates Auth Code when locked, or toggles mic when unlocked
    DOM.mainOrbBtn.addEventListener('click', handleMainOrbClick);

    // Tapping the Secret Code Badge quick-authorizes as fallback
    if (DOM.authCodeBadge) {
      DOM.authCodeBadge.addEventListener('click', authorizeMaster);
    }

    // Stage Top Actions
    DOM.stageLockBtn.addEventListener('click', lockSystem);
    if (DOM.voiceProfileBtn) {
      DOM.voiceProfileBtn.addEventListener('click', cycleVoiceProfile);
    }
    DOM.stageTtsToggle.addEventListener('click', () => {
      state.ttsEnabled = !state.ttsEnabled;
      DOM.stageTtsToggle.classList.toggle('active', state.ttsEnabled);
      DOM.stageTtsToggle.innerHTML = state.ttsEnabled
        ? '<i class="fa-solid fa-volume-high"></i> <span class="hide-mobile">VOICE ON</span>'
        : '<i class="fa-solid fa-volume-xmark"></i> <span class="hide-mobile">VOICE OFF</span>';
    });

    // Mic button
    DOM.stageMicBtn.addEventListener('click', () => {
      if (!state.unlocked) {
        generateSecretAuthCode();
      } else {
        toggleListening();
      }
    });

    DOM.stageSendBtn.addEventListener('click', () => {
      const val = DOM.stageTextInput.value.trim();
      if (!val) return;
      if (!state.unlocked) {
        if (verifySpokenAuthCode(val)) {
          authorizeMaster();
        } else {
          updateDialogue(val, `कोड मैच नहीं हुआ। कृपया कोड <strong>${state.activeAuthCode}</strong> दर्ज करें या बोलें।`);
        }
      } else {
        dispatchVoiceCommand(val);
      }
    });

    DOM.stageTextInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = DOM.stageTextInput.value.trim();
        if (!val) return;
        if (!state.unlocked) {
          if (verifySpokenAuthCode(val)) {
            authorizeMaster();
          } else {
            updateDialogue(val, `कोड मैच नहीं हुआ। कृपया कोड <strong>${state.activeAuthCode}</strong> दर्ज करें या बोलें।`);
          }
        } else {
          dispatchVoiceCommand(val);
        }
      }
    });

    // Voice Command Chips
    DOM.voiceCmdChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd');
        if (!state.unlocked) {
          generateSecretAuthCode();
        } else {
          dispatchVoiceCommand(cmd);
        }
      });
    });

    // Close HUD Buttons
    DOM.hudCloseBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const targetElem = document.getElementById(targetId);
        closeHUD(targetElem);
      });
    });

    // Music Player Buttons
    DOM.audioPlayBtn.addEventListener('click', () => toggleAudioPlay());
    DOM.audioNextBtn.addEventListener('click', playNextTrack);
    DOM.audioPrevBtn.addEventListener('click', playPrevTrack);

    // Sandbox Controls
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

  function initCompanionFeatures() {
    initMainOrbCanvas();
    initSpeechRecognition();
    initMusicPlayer();
    initVideoPlayer();
    loadCreationsVault();
  }

  // Initialization
  window.addEventListener('DOMContentLoaded', () => {
    initCompanionFeatures();
    setupEventListeners();
  });

})();
