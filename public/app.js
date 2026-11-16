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
    is24x7Active: true,
    currentAudioTTS: null,
    chatHistory: [],
    currentCreationCode: null,
    currentCreationTitle: 'Interactive App',
    currentTrackIndex: 0,
    isPlayingAudio: false,
    audioInitialized: false,
    voiceCallActive: false,
    bestVoice: null,
    activeVoicePersona: localStorage.getItem('aaira_voice_persona') || 'aaira',
    voiceProfileIndex: localStorage.getItem('aaira_voice_persona') === 'vihuhuhu' ? 1 : 0
  };

  // Premium Natural AI Voices Matching User Persona Directives:
  // AAIRA: Natural, friendly, intelligent female AI assistant (hi-IN-SwaraNeural)
  // VIHUHUHU: Natural, confident, clear male voice (hi-IN-MadhurNeural)
  const VOICE_PROFILES = [
    {
      id: 'aaira',
      label: '🌸 AAIRA (Friendly Female)',
      voice: 'aaira',
      gender: 'female',
      lang: 'hi'
    },
    {
      id: 'vihuhuhu',
      label: '⚡ VIHUHUHU (Confident Male)',
      voice: 'vihuhuhu',
      gender: 'male',
      lang: 'hi'
    }
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

    // Minimalist Sci-Fi Watermark Status & Voice Switcher
    statusDot: document.getElementById('statusDot'),
    systemStatusLabel: document.getElementById('systemStatusLabel'),
    voicePersonaToggleBtn: document.getElementById('voicePersonaToggleBtn'),
    currentVoicePersonaLabel: document.getElementById('currentVoicePersonaLabel'),

    // Center Quantum AI Core (AUI)
    mainOrbWrapper: document.getElementById('mainOrbWrapper'),
    mainAIOralCanvas: document.getElementById('mainAIOralCanvas'),
    mainOrbBtn: document.getElementById('mainOrbBtn'),
    aiCoreNucleus: document.getElementById('aiCoreNucleus'),

    // Floating Dashboard Trigger (Top Right)
    openDashboardBtn: document.getElementById('openDashboardBtn'),
    auiShapeButtons: document.getElementById('auiShapeButtons'),

    // Live Voice Call & Drag Controls
    voiceCallTriggerBtn: document.getElementById('voiceCallTriggerBtn'),
    voiceCallBtnLabel: document.getElementById('voiceCallBtnLabel'),
    voiceCallBtnIcon: document.getElementById('voiceCallBtnIcon'),
    resetAuiPosBtn: document.getElementById('resetAuiPosBtn'),

    // Secret Authorization Pod
    authCodeBadge: document.getElementById('authCodeBadge'),
    authDigit0: document.getElementById('authDigit0'),
    authDigit1: document.getElementById('authDigit1'),
    authDigit2: document.getElementById('authDigit2'),
    authVoiceHintText: document.getElementById('authVoiceHintText'),

    // YouTube Direct Floating Stage (On Top of AUI)
    youtubeDirectOverlay: document.getElementById('youtubeDirectOverlay'),
    directYoutubePlayer: document.getElementById('directYoutubePlayer'),
    directHtmlVideo: document.getElementById('directHtmlVideo'),
    switchHtmlVideoBtn: document.getElementById('switchHtmlVideoBtn'),
    switchYoutubeBtn: document.getElementById('switchYoutubeBtn'),
    directPlayerIcon: document.getElementById('directPlayerIcon'),
    youtubeOverlayTitle: document.getElementById('youtubeOverlayTitle'),
    closeYoutubeOverlayBtn: document.getElementById('closeYoutubeOverlayBtn'),

    // 3D Zoom Controls
    auiZoomControlPill: document.getElementById('auiZoomControlPill'),
    zoomOutBtn: document.getElementById('zoomOutBtn'),
    zoomInBtn: document.getElementById('zoomInBtn'),
    zoomResetBtn: document.getElementById('zoomResetBtn'),
    zoomLevelLabel: document.getElementById('zoomLevelLabel'),

    // AUI Quick Action Buttons
    auiQuickActions: document.getElementById('auiQuickActions'),
    quickSongBtn: document.getElementById('quickSongBtn'),
    quickVideoBtn: document.getElementById('quickVideoBtn'),
    quickStopBtn: document.getElementById('quickStopBtn'),

    // 3D Shape Badge & Controls
    auiShapeBadge: document.getElementById('auiShapeBadge'),
    auiShapeName: document.getElementById('auiShapeName'),
    mainOrbWrapper: document.getElementById('mainOrbWrapper'),

    // 24/7 Voice Recorder Live Stream Bar
    voiceRecorderStream: document.getElementById('voiceRecorderStream'),
    recStatusLabel: document.getElementById('recStatusLabel'),
    acousticWaveBars: document.getElementById('acousticWaveBars'),

    // Background Task HUD Toast
    bgAgentToast: document.getElementById('bgAgentToast'),
    bgToastTitle: document.getElementById('bgToastTitle'),
    bgToastDesc: document.getElementById('bgToastDesc'),
    bgToastClose: document.getElementById('bgToastClose'),

    // Minimalist Subtitle Stream
    stageDialogueState: document.getElementById('stageDialogueState'),

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
  // 3. ZERO-CONFLICT MICROPHONE & DIRECT VOICE CALL ENGINE
  // (Zero mic conflict: No getUserMedia holding the hardware device!
  //  Google SpeechRecognition gets 100% exclusive access)
  // ========================================================
  let sharedAudioTTS = null;
  let micStream = null;
  let micAudioCtx = null;

  function releaseHardwareMic() {
    // Ensures NO getUserMedia track locks the microphone device in Chrome
    try {
      if (micStream) {
        micStream.getTracks().forEach(t => {
          try { t.stop(); } catch (_) {}
        });
        micStream = null;
      }
    } catch (_) {}
    try {
      if (micAudioCtx) {
        micAudioCtx.close().catch(() => {});
        micAudioCtx = null;
      }
    } catch (_) {}
  }

  function primeMobileMedia() {
    // 1. Web Audio Context Unlock for mobile browsers
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        if (!state.mobileAudioCtx) state.mobileAudioCtx = new AudioCtx();
        if (state.mobileAudioCtx.state === 'suspended') {
          state.mobileAudioCtx.resume();
        }
      }
    } catch(_) {}

    // 2. HTML5 Audio Unlock & Pre-prime shared audio element
    try {
      if (!sharedAudioTTS) {
        sharedAudioTTS = new Audio();
      }
      sharedAudioTTS.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      sharedAudioTTS.play().catch(() => {});
    } catch(_) {}

    // 3. Free up microphone so Google SpeechRecognition is never blocked
    releaseHardwareMic();
  }

  function startVoiceConversationMode() {
    state.voiceCallActive = true;
    state.unlocked = true;
    primeMobileMedia();
    releaseHardwareMic();

    if (DOM.voiceCallTriggerBtn) {
      DOM.voiceCallTriggerBtn.classList.add('active-call');
      if (DOM.voiceCallBtnLabel) {
        DOM.voiceCallBtnLabel.textContent = '🟢 बातचीत चालू है • बोलिए (Tap to Stop)';
      }
      if (DOM.voiceCallBtnIcon) {
        DOM.voiceCallBtnIcon.className = 'fa-solid fa-microphone';
      }
    }

    if (DOM.statusDot) {
      DOM.statusDot.classList.remove('standby');
      DOM.statusDot.classList.add('online');
    }
    if (DOM.systemStatusLabel) {
      DOM.systemStatusLabel.textContent = 'ONLINE • VOICE CALL ACTIVE • MASTER VIHUHUHU';
    }
    if (DOM.auiQuickActions) {
      DOM.auiQuickActions.classList.remove('hidden');
    }

    playUnlockChord();

    // Natural Verbal Greeting matching chosen persona
    const isMale = (state.activeVoicePersona === 'vihuhuhu');
    const greeting = isMale
      ? 'नमस्ते मास्टर! मैं विहुहुहु हूँ। मैं सुन रहा हूँ, बताइए क्या सेवा करूँ?'
      : 'नमस्ते मास्टर विहुहुहु! मैं आपकी बात सुन रही हूँ, बताइए क्या बात करनी है?';

    updateDialogue('Voice Started', greeting);
    speakText(greeting, () => {
      // Once greeting completes, listen immediately
      startListening();
    });
  }

  function stopVoiceConversationMode() {
    state.voiceCallActive = false;
    if (sharedAudioTTS) {
      try { sharedAudioTTS.pause(); } catch(_) {}
    }
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch(_) {}
    }
    state.isSpeaking = false;
    stopListening();

    if (DOM.voiceCallTriggerBtn) {
      DOM.voiceCallTriggerBtn.classList.remove('active-call');
      if (DOM.voiceCallBtnLabel) {
        DOM.voiceCallBtnLabel.textContent = 'Tap to Talk • वॉयस कॉल शुरू करें';
      }
      if (DOM.voiceCallBtnIcon) {
        DOM.voiceCallBtnIcon.className = 'fa-solid fa-microphone-lines';
      }
    }

    if (DOM.stageDialogueState) {
      DOM.stageDialogueState.textContent = 'STANDBY • TAP TO TALK • बोलिए, मैं सुन रही हूँ 🌸';
    }
  }

  function toggleVoiceConversationMode() {
    if (state.voiceCallActive) {
      stopVoiceConversationMode();
    } else {
      startVoiceConversationMode();
    }
  }

  let lastOrbClickTime = 0;
  function handleMainOrbClick() {
    const now = Date.now();
    if (now - lastOrbClickTime < 350) return;
    lastOrbClickTime = now;

    primeMobileMedia();

    if (!state.unlocked) {
      // 3-Digit Code: Center click generates the code, AI stays silent, user speaks the code to unlock!
      generateSecretAuthCode();
    } else {
      if (state.isSpeaking) {
        // Barge-in: user tapped core to interrupt AI speech and speak immediately
        if (sharedAudioTTS) {
          try { sharedAudioTTS.pause(); } catch(_) {}
        }
        if ('speechSynthesis' in window) {
          try { window.speechSynthesis.cancel(); } catch(_) {}
        }
        state.isSpeaking = false;
        startListening();
      } else {
        startListening();
      }
    }
  }

  function generateSecretAuthCode() {
    const code = Math.floor(100 + Math.random() * 900).toString();
    state.activeAuthCode = code;
    if (DOM.authDigit0) DOM.authDigit0.textContent = code[0];
    if (DOM.authDigit1) DOM.authDigit1.textContent = code[1];
    if (DOM.authDigit2) DOM.authDigit2.textContent = code[2];
    if (DOM.authVoiceHintText) DOM.authVoiceHintText.textContent = `माइक में बोलिए: "${code[0]} ${code[1]} ${code[2]}"`;
    if (DOM.authCodeBadge) DOM.authCodeBadge.classList.remove('hidden');

    if (DOM.stageDialogueState) {
      DOM.stageDialogueState.classList.add('visible');
      DOM.stageDialogueState.innerHTML = `🔒 <strong>AUTH CODE: ${code}</strong> • बोलिए: "${code[0]} ${code[1]} ${code[2]}"`;
    }

    // AI DOES NOT speak! Master directly speaks the 3-digit code into the microphone!
    startListening();
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
      'शून्य': '0', 'zero': '0', 'ज़ीरो': '0',
      'एक': '1', 'one': '1', 'वन': '1',
      'दो': '2', 'two': '2', 'टू': '2',
      'तीन': '3', 'three': '3', 'थ्री': '3',
      'चार': '4', 'four': '4', 'फोर': '4',
      'पांच': '5', 'पाँच': '5', 'five': '5', 'फाइव': '5',
      'छह': '6', 'छ:': '6', 'six': '6', 'सिक्स': '6',
      'सात': '7', 'seven': '7', 'सेवन': '7',
      'आठ': '8', 'eight': '8', 'एट': '8',
      'नौ': '9', 'nine': '9', 'नाइन': '9'
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
      if (DOM.statusDot) {
        DOM.statusDot.classList.remove('standby');
        DOM.statusDot.classList.add('online');
      }
      if (DOM.systemStatusLabel) {
        DOM.systemStatusLabel.textContent = 'ONLINE • 24/7 VOICE COMMANDS ACTIVE • MASTER VIHUHUHU';
      }
      if (DOM.stageLockIcon) {
        DOM.stageLockIcon.className = 'fa-solid fa-lock-open';
      }
      if (DOM.auiQuickActions) {
        DOM.auiQuickActions.classList.remove('hidden');
      }

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
    if (DOM.auiQuickActions) {
      DOM.auiQuickActions.classList.add('hidden');
    }
    if (DOM.statusDot) {
      DOM.statusDot.classList.remove('online');
      DOM.statusDot.classList.add('standby');
    }
    if (DOM.systemStatusLabel) {
      DOM.systemStatusLabel.textContent = 'VIHUHUHU • AAIRA AI';
    }
    closeAllHUDs();
    updateDialogue("System Standby", "STANDBY • TAP CORE TO ACTIVATE");
  }

  // ========================================================
  // 4. MAJESTIC 3D HOLOGRAPHIC AI CORE (THREE.JS ENGINE)
  // Real 3D Quantum Geometries: Sphere, Cube, Torus, Crystal, Vortex, DNA, Heart
  // Interactive 3D Touch/Drag, Audio Reactive Energy Pulse, Voice Morphing
  // ========================================================
  let threeScene = null;
  let threeCamera = null;
  let threeRenderer = null;
  let threeParticleSystem = null;
  let threeCoreMesh = null;
  let threeOuterRing1 = null;
  let threeOuterRing2 = null;
  let threeLight = null;
  let threeGroup = null;

  const PARTICLE_COUNT = 1400;
  let currentPositions = new Float32Array(PARTICLE_COUNT * 3);
  let targetPositions = new Float32Array(PARTICLE_COUNT * 3);

  const SHAPE_PRESETS = {
    SPHERE: '3D Quantum Sphere',
    CUBE: '3D Matrix Tesseract',
    TORUS: '3D Energy Chakra',
    CRYSTAL: '3D Quantum Diamond',
    VORTEX: '3D Cosmic Singularity',
    DNA: '3D Cyber Helix',
    HEART: '3D Companion Core'
  };

  const SHAPE_KEYS = ['SPHERE', 'CUBE', 'TORUS', 'CRYSTAL', 'VORTEX', 'DNA', 'HEART'];
  let currentShapeIndex = 0;

  // 3D Parametric Generators
  function generateSphereTargets() {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    const phiSpan = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phiSpan * i;
      const r = 85 + (Math.sin(i * 0.3) * 6);
      arr[i * 3] = Math.cos(theta) * radiusAtY * r;
      arr[i * 3 + 1] = y * r;
      arr[i * 3 + 2] = Math.sin(theta) * radiusAtY * r;
    }
    return arr;
  }

  function generateCubeTargets() {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    const S = 65;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const face = Math.floor(Math.random() * 6);
      const u = (Math.random() - 0.5) * 2 * S;
      const v = (Math.random() - 0.5) * 2 * S;
      let x = 0, y = 0, z = 0;
      if (face === 0) { x = S; y = u; z = v; }
      else if (face === 1) { x = -S; y = u; z = v; }
      else if (face === 2) { x = u; y = S; z = v; }
      else if (face === 3) { x = u; y = -S; z = v; }
      else if (face === 4) { x = u; y = v; z = S; }
      else { x = u; y = v; z = -S; }
      if (i % 3 === 0) { x *= 1.35; y *= 1.35; z *= 1.35; }
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }

  function generateTorusTargets() {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    const R = 80;
    const r = 30;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;
      arr[i * 3] = (R + r * Math.cos(v)) * Math.cos(u);
      arr[i * 3 + 1] = (R + r * Math.cos(v)) * Math.sin(u);
      arr[i * 3 + 2] = r * Math.sin(v) + (Math.sin(u * 4) * 6);
    }
    return arr;
  }

  function generateCrystalTargets() {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    const phi = (1 + Math.sqrt(5)) / 2;
    const verts = [
      [-1,  phi, 0], [ 1,  phi, 0], [-1, -phi, 0], [ 1, -phi, 0],
      [ 0, -1,  phi], [ 0,  1,  phi], [ 0, -1, -phi], [ 0,  1, -phi],
      [ phi, 0, -1], [ phi, 0,  1], [-phi, 0, -1], [-phi, 0,  1]
    ];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const v1 = verts[Math.floor(Math.random() * verts.length)];
      const v2 = verts[Math.floor(Math.random() * verts.length)];
      const t = Math.random();
      const scale = 54;
      arr[i * 3] = (v1[0] * (1 - t) + v2[0] * t) * scale + (Math.random() - 0.5) * 6;
      arr[i * 3 + 1] = (v1[1] * (1 - t) + v2[1] * t) * scale + (Math.random() - 0.5) * 6;
      arr[i * 3 + 2] = (v1[2] * (1 - t) + v2[2] * t) * scale + (Math.random() - 0.5) * 6;
    }
    return arr;
  }

  function generateVortexTargets() {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const arm = i % 3;
      const progress = Math.pow(Math.random(), 0.7);
      const r = 18 + progress * 105;
      const angle = (arm * (Math.PI * 2 / 3)) + (progress * 5.2);
      const z = (Math.pow(1 - progress, 2) * -38) + (Math.random() - 0.5) * 12;
      arr[i * 3] = Math.cos(angle) * r;
      arr[i * 3 + 1] = z;
      arr[i * 3 + 2] = Math.sin(angle) * r;
    }
    return arr;
  }

  function generateDNATargets() {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    const H = 190;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const strand = i % 2;
      const t = (i / PARTICLE_COUNT) * Math.PI * 8;
      const y = (i / PARTICLE_COUNT) * H - (H / 2);
      const r = 45;
      const offset = strand === 0 ? 0 : Math.PI;
      if (i % 6 === 0) {
        const lerpVal = Math.random();
        arr[i * 3] = Math.cos(t) * r * (1 - lerpVal * 2);
        arr[i * 3 + 1] = y;
        arr[i * 3 + 2] = Math.sin(t) * r * (1 - lerpVal * 2);
      } else {
        arr[i * 3] = Math.cos(t + offset) * r + (Math.random() - 0.5) * 6;
        arr[i * 3 + 1] = y;
        arr[i * 3 + 2] = Math.sin(t + offset) * r + (Math.random() - 0.5) * 6;
      }
    }
    return arr;
  }

  function generateHeartTargets() {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = Math.random() * Math.PI * 2;
      const scale = 5.2;
      const x = 16 * Math.pow(Math.sin(t), 3) * scale;
      const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale;
      const z = (Math.random() - 0.5) * 45;
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }

  function initThreeDCore() {
    if (!window.THREE || !DOM.mainAIOralCanvas) {
      initFallback2DCanvas();
      return;
    }

    try {
      const width = 420;
      const height = 420;

      threeScene = new THREE.Scene();
      threeCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      threeCamera.position.z = 240;

      threeRenderer = new THREE.WebGLRenderer({
        canvas: DOM.mainAIOralCanvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      threeRenderer.setSize(width, height);
      threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      threeGroup = new THREE.Group();
      threeScene.add(threeGroup);

      // Initialize initial Sphere shape
      const initialTargets = generateSphereTargets();
      for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
        currentPositions[i] = initialTargets[i] * 1.5;
        targetPositions[i] = initialTargets[i];
      }

      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));

      // Particle Colors
      const colors = new Float32Array(PARTICLE_COUNT * 3);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        colors[i * 3] = 0.0;     // R
        colors[i * 3 + 1] = 0.94; // G
        colors[i * 3 + 2] = 1.0;  // B
      }
      particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      // Quantum Points Material
      const particleMat = new THREE.PointsMaterial({
        size: 3.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.88,
        blending: THREE.AdditiveBlending
      });

      threeParticleSystem = new THREE.Points(particleGeo, particleMat);
      threeGroup.add(threeParticleSystem);

      // Inner Wireframe Energy Core
      const coreGeo = new THREE.IcosahedronGeometry(36, 1);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.35
      });
      threeCoreMesh = new THREE.Mesh(coreGeo, coreMat);
      threeGroup.add(threeCoreMesh);

      // Orbiting 3D Ring 1
      const ring1Geo = new THREE.TorusGeometry(105, 0.8, 8, 64);
      const ring1Mat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.28
      });
      threeOuterRing1 = new THREE.Mesh(ring1Geo, ring1Mat);
      threeOuterRing1.rotation.x = Math.PI / 3;
      threeGroup.add(threeOuterRing1);

      // Orbiting 3D Ring 2
      const ring2Geo = new THREE.TorusGeometry(120, 0.8, 8, 64);
      const ring2Mat = new THREE.MeshBasicMaterial({
        color: 0xff007f,
        wireframe: true,
        transparent: true,
        opacity: 0.22
      });
      threeOuterRing2 = new THREE.Mesh(ring2Geo, ring2Mat);
      threeOuterRing2.rotation.y = Math.PI / 4;
      threeGroup.add(threeOuterRing2);

      // Lights
      threeLight = new THREE.PointLight(0x00f0ff, 2, 300);
      threeLight.position.set(0, 0, 50);
      threeScene.add(threeLight);

      setup3DDragInteraction();
      animateThreeD();
    } catch (err) {
      console.warn('[Three.js Init Error, Falling back to 2D]', err);
      initFallback2DCanvas();
    }
  }

  // 3D Finger & Mouse Drag Interaction (360° Touch Control + Persistent Zoom)
  let isDragging3D = false;
  let isPinching3D = false;
  let startPinchDist = 0;
  let startPinchZoom = 1.0;
  let startTouchX = 0;
  let startTouchY = 0;
  let prevTouchX = 0;
  let prevTouchY = 0;
  let touchStartTime = 0;
  let totalDragDist = 0;
  let rotSpeedX = 0;
  let rotSpeedY = 0;
  let userHasRotated3D = false; // When true: STOPS auto-spin permanently so user view stays fixed!

  // Persistent 3D Zoom (Defaults to saved zoom or 1.0)
  let current3DZoom = parseFloat(localStorage.getItem('aaira_3d_zoom') || '1.0');
  const MIN_ZOOM = 0.45;
  const MAX_ZOOM = 2.6;

  function set3DZoom(val) {
    current3DZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, val));
    if (DOM.zoomLevelLabel) {
      DOM.zoomLevelLabel.textContent = `${Math.round(current3DZoom * 100)}%`;
    }
    if (threeGroup) {
      threeGroup.scale.set(current3DZoom, current3DZoom, current3DZoom);
    }
    try {
      localStorage.setItem('aaira_3d_zoom', current3DZoom.toFixed(2));
    } catch (_) {}
  }

  let auiPos = { x: 0, y: 0 };
  let lastTapTime = 0;

  function initAUIPosition() {
    try {
      const saved = localStorage.getItem('aaira_aui_pos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          auiPos.x = parsed.x;
          auiPos.y = parsed.y;
          if (DOM.mainOrbWrapper) {
            DOM.mainOrbWrapper.style.transform = `translate3d(${auiPos.x}px, ${auiPos.y}px, 0)`;
          }
        }
      }
    } catch (_) {}
  }

  function resetAUIPosition() {
    auiPos = { x: 0, y: 0 };
    if (DOM.mainOrbWrapper) {
      DOM.mainOrbWrapper.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
      DOM.mainOrbWrapper.style.transform = 'translate3d(0px, 0px, 0)';
      setTimeout(() => {
        if (DOM.mainOrbWrapper) DOM.mainOrbWrapper.style.transition = '';
      }, 450);
    }
    try { localStorage.removeItem('aaira_aui_pos'); } catch (_) {}
  }

  function setup3DDragInteraction() {
    const target = DOM.mainAIOralCanvas || DOM.mainOrbWrapper;
    if (!target) return;

    // Apply saved zoom and position immediately
    set3DZoom(current3DZoom);
    initAUIPosition();

    function onPointerStart(clientX, clientY) {
      primeMobileMedia();
      userHasRotated3D = true;
      isDragging3D = true;
      startTouchX = clientX;
      startTouchY = clientY;
      prevTouchX = clientX;
      prevTouchY = clientY;
      touchStartTime = Date.now();
      totalDragDist = 0;
      rotSpeedX = 0;
      rotSpeedY = 0;
      if (DOM.mainOrbWrapper) DOM.mainOrbWrapper.classList.add('is-dragging');
    }

    function onPointerMove(clientX, clientY) {
      if (!isDragging3D) return;
      const dx = clientX - prevTouchX;
      const dy = clientY - prevTouchY;
      prevTouchX = clientX;
      prevTouchY = clientY;

      totalDragDist += Math.abs(dx) + Math.abs(dy);

      // Free-floating drag anywhere on the screen! ("jaha chahu vaha chala jaye")
      auiPos.x += dx;
      auiPos.y += dy;

      const maxW = Math.max(100, (window.innerWidth / 2) - 30);
      const maxH = Math.max(100, (window.innerHeight / 2) - 30);
      auiPos.x = Math.max(-maxW, Math.min(maxW, auiPos.x));
      auiPos.y = Math.max(-maxH, Math.min(maxH, auiPos.y));

      if (DOM.mainOrbWrapper) {
        DOM.mainOrbWrapper.style.transform = `translate3d(${auiPos.x}px, ${auiPos.y}px, 0)`;
      }

      // Responsive 3D rotation following drag motion
      if (threeGroup) {
        threeGroup.rotation.y += dx * 0.008;
        threeGroup.rotation.x += dy * 0.008;
        rotSpeedY = dx * 0.004;
        rotSpeedX = dy * 0.004;
      }
    }

    function onPointerEnd() {
      if (!isDragging3D) return;
      isDragging3D = false;
      if (DOM.mainOrbWrapper) DOM.mainOrbWrapper.classList.remove('is-dragging');
      const duration = Date.now() - touchStartTime;

      const now = Date.now();
      if (now - lastTapTime < 340 && totalDragDist < 16) {
        // Double-tap detected: snap smoothly back to center!
        resetAUIPosition();
        lastTapTime = 0;
        return;
      }
      lastTapTime = now;

      // If user tapped without dragging (< 14px move & < 350ms): Talk / Voice Call!
      if (totalDragDist < 14 && duration < 350) {
        handleMainOrbClick();
      } else {
        // Dragged to a new location on the screen: persist position!
        try {
          localStorage.setItem('aaira_aui_pos', JSON.stringify(auiPos));
        } catch (_) {}
      }
    }

    // Touch events for Mobile Phones (Silky finger screen drag + 2-finger pinch zoom)
    target.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 2) {
        userHasRotated3D = true;
        isPinching3D = true;
        isDragging3D = false;
        startPinchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        startPinchZoom = current3DZoom;
      } else if (e.touches && e.touches.length === 1) {
        isPinching3D = false;
        onPointerStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (isPinching3D && e.touches && e.touches.length === 2) {
        const curDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        if (startPinchDist > 10) {
          const ratio = curDist / startPinchDist;
          set3DZoom(startPinchZoom * ratio);
        }
        if (e.cancelable) e.preventDefault();
        return;
      }

      if (isDragging3D && e.touches && e.touches[0]) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
        if (totalDragDist > 6 && e.cancelable) {
          e.preventDefault();
        }
      }
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
      if (isPinching3D && (!e.touches || e.touches.length < 2)) {
        isPinching3D = false;
      } else if (isDragging3D) {
        onPointerEnd();
      }
    }, { passive: true });

    // Pointer events for Desktop Mouse / Stylus
    target.addEventListener('pointerdown', (e) => {
      onPointerStart(e.clientX, e.clientY);
    });

    window.addEventListener('pointermove', (e) => {
      onPointerMove(e.clientX, e.clientY);
    });

    window.addEventListener('pointerup', () => {
      onPointerEnd();
    });

    // Mouse Wheel Zoom for Desktop
    target.addEventListener('wheel', (e) => {
      userHasRotated3D = true;
      e.preventDefault();
      const delta = -e.deltaY * 0.0015;
      set3DZoom(current3DZoom + delta);
    }, { passive: false });
  }

  function animateThreeD() {
    requestAnimationFrame(animateThreeD);
    if (!threeRenderer || !threeScene || !threeCamera) return;

    const t = Date.now() * 0.001;

    // Smooth lerp particle morphing
    if (threeParticleSystem && threeParticleSystem.geometry && threeParticleSystem.geometry.attributes.position) {
      const posAttr = threeParticleSystem.geometry.attributes.position;
      const pos = posAttr.array;
      for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
        pos[i] += (targetPositions[i] - pos[i]) * 0.075;
      }
      posAttr.needsUpdate = true;
    }

    // Dynamic Sci-Fi Audio Reactivity without touching hardware microphone device
    let pulseScale = 1.0;
    if (state.isSpeaking) {
      pulseScale = 1.18 + Math.sin(t * 12) * 0.16;
    } else if (state.isListening) {
      pulseScale = 1.07 + Math.sin(t * 7) * 0.07 + Math.sin(t * 13) * 0.03;
    } else {
      pulseScale = 1.0 + Math.sin(t * 2.5) * 0.05;
    }

    if (threeCoreMesh) {
      threeCoreMesh.scale.set(pulseScale, pulseScale, pulseScale);
      threeCoreMesh.rotation.x += 0.015 + (state.isListening ? 0.02 : 0);
      threeCoreMesh.rotation.y += 0.02 + (state.isListening ? 0.02 : 0);
    }

    if (threeOuterRing1) {
      threeOuterRing1.rotation.z += 0.012 + (state.isListening ? 0.015 : 0);
      threeOuterRing1.rotation.x += 0.006;
    }

    if (threeOuterRing2) {
      threeOuterRing2.rotation.z -= 0.008 + (state.isListening ? 0.015 : 0);
      threeOuterRing2.rotation.y += 0.01;
    }

    // User-controlled 3D rotation with smooth inertia (stays fixed where user leaves it!)
    if (threeGroup) {
      // Maintain persistent user zoom scale
      threeGroup.scale.set(current3DZoom, current3DZoom, current3DZoom);

      if (!isDragging3D) {
        if (Math.abs(rotSpeedY) > 0.0001) {
          threeGroup.rotation.y += rotSpeedY;
          rotSpeedY *= 0.90;
        } else {
          rotSpeedY = 0;
        }

        if (Math.abs(rotSpeedX) > 0.0001) {
          threeGroup.rotation.x += rotSpeedX;
          rotSpeedX *= 0.90;
        } else {
          rotSpeedX = 0;
        }

        // Only do an extremely slow gentle idle spin if user has NEVER touched it yet
        if (!userHasRotated3D) {
          threeGroup.rotation.y += 0.004;
        }
      }
    }

    threeRenderer.render(threeScene, threeCamera);
  }

  function morphTo3DShape(name) {
    const upper = (name || '').toUpperCase();
    let newTarget = null;
    let label = '3D Quantum Sphere';

    if (upper.includes('CUBE') || upper.includes('BOX') || upper.includes('MATRIX') || upper.includes('TESSERACT')) {
      newTarget = generateCubeTargets();
      state.auiShape = 'CUBE';
      label = SHAPE_PRESETS.CUBE;
    } else if (upper.includes('TORUS') || upper.includes('RING') || upper.includes('CHAKRA') || upper.includes('DONUT')) {
      newTarget = generateTorusTargets();
      state.auiShape = 'TORUS';
      label = SHAPE_PRESETS.TORUS;
    } else if (upper.includes('CRYSTAL') || upper.includes('DIAMOND') || upper.includes('HEERA') || upper.includes('GEM')) {
      newTarget = generateCrystalTargets();
      state.auiShape = 'CRYSTAL';
      label = SHAPE_PRESETS.CRYSTAL;
    } else if (upper.includes('VORTEX') || upper.includes('BLACK') || upper.includes('GALAXY') || upper.includes('SINGULARITY')) {
      newTarget = generateVortexTargets();
      state.auiShape = 'VORTEX';
      label = SHAPE_PRESETS.VORTEX;
    } else if (upper.includes('DNA') || upper.includes('HELIX') || upper.includes('SPIRAL')) {
      newTarget = generateDNATargets();
      state.auiShape = 'DNA';
      label = SHAPE_PRESETS.DNA;
    } else if (upper.includes('HEART') || upper.includes('DIL') || upper.includes('LOVE')) {
      newTarget = generateHeartTargets();
      state.auiShape = 'HEART';
      label = SHAPE_PRESETS.HEART;
    } else {
      newTarget = generateSphereTargets();
      state.auiShape = 'SPHERE';
      label = SHAPE_PRESETS.SPHERE;
    }

    targetPositions = newTarget;

    if (DOM.auiShapeName) {
      DOM.auiShapeName.textContent = label;
    }

    playTone(1174.66, 0.16, 'triangle', 0.25);
    updateDialogue('3D AUI Morphed', `AUI Shape transformed to: ${label} ✨`);
    speakText(`जी मास्टर विहुहुहु, मैंने AUI को ${label} में बदल दिया है!`);
  }

  function cycleNextShape() {
    currentShapeIndex = (currentShapeIndex + 1) % SHAPE_KEYS.length;
    const nextKey = SHAPE_KEYS[currentShapeIndex];
    morphTo3DShape(nextKey);
  }

  function setAUIColor(hex, name) {
    state.auiColor = hex;
    if (window.THREE && threeParticleSystem) {
      const c = new THREE.Color(hex);
      if (threeCoreMesh) threeCoreMesh.material.color.set(c);
      if (threeLight) threeLight.color.set(c);

      const colors = threeParticleSystem.geometry.attributes.color.array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        colors[i * 3] = c.r + (Math.random() - 0.5) * 0.15;
        colors[i * 3 + 1] = c.g + (Math.random() - 0.5) * 0.15;
        colors[i * 3 + 2] = c.b + (Math.random() - 0.5) * 0.15;
      }
      threeParticleSystem.geometry.attributes.color.needsUpdate = true;
    }

    if (DOM.auiShapeBadge) {
      DOM.auiShapeBadge.style.borderColor = hex;
      DOM.auiShapeBadge.style.color = hex;
      DOM.auiShapeBadge.style.boxShadow = `0 0 20px ${hex}66`;
    }

    playTone(880, 0.15, 'sine', 0.2);
    speakText(`जी मास्टर, मैंने AUI का रंग ${name || 'नया'} कर दिया है!`);
  }

  // Fallback 2D Canvas Renderer
  let fallback2DCtx = null;
  function initFallback2DCanvas() {
    if (!DOM.mainAIOralCanvas) return;
    fallback2DCtx = DOM.mainAIOralCanvas.getContext('2d');
    renderFallback2D();
  }

  function renderFallback2D() {
    if (!fallback2DCtx) return;
    const w = 420, h = 420;
    fallback2DCtx.clearRect(0, 0, w, h);
    requestAnimationFrame(renderFallback2D);
  }

  // ========================================================
  // BACKGROUND AUTONOMOUS WORKER ENGINE
  // ========================================================
  async function triggerBackgroundResearch(topic) {
    if (!topic || !topic.trim()) return;
    const clean = topic.trim();

    showBgToast('BACKGROUND RESEARCH ACTIVE', `रिसर्च चालू है: "${clean.slice(0, 30)}"...`);
    speakText(`जी मास्टर विहुहुहु, मैंने ${clean.slice(0, 35)} पर बैकग्राउंड रिसर्च शुरू कर दी है। पूरा होते ही आपको बता दूँगी।`);

    try {
      const res = await fetch('/api/bg-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: clean })
      });
      const data = await res.json();

      if (data && data.success && data.report) {
        playTone(1318.5, 0.25, 'triangle', 0.28);
        showBgToast(`RESEARCH READY: ${clean.slice(0, 20)}`, data.report.slice(0, 110) + '...');
        updateDialogue(`Master: ${clean}`, data.report);
        speakText(`मास्टर विहुहुहु, ${clean} पर बैकग्राउंड रिसर्च पूरी हो गई है!`);
        loadCreationsVault();
      }
    } catch (err) {
      console.warn('[BG Research Fail]', err);
    }
  }

  async function saveBackgroundNote(text) {
    const clean = text.replace(/^(background me note likho|background me note banao|background me save karo|yaad rakhna|note karo)\s*/i, '').trim();
    if (!clean) return;

    try {
      await fetch('/api/creations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Note: ${clean.slice(0, 25)}`,
          prompt: clean,
          code: clean,
          category: 'note'
        })
      });
      loadCreationsVault();
      showBgToast('MEMORY VAULT UPDATED', `Saved: "${clean.slice(0, 40)}"`);
      playTone(1046.5, 0.15, 'sine', 0.2);
      speakText('जी मास्टर, मैंने बैकग्राउंड में आपका नोट सेव कर लिया है।');
    } catch (_) {}
  }

  function startBackgroundTimer(seconds) {
    const sec = Math.max(5, parseInt(seconds) || 30);
    showBgToast('BACKGROUND TIMER ACTIVE', `${sec} सेकंड का टाइमर शुरू...`);
    speakText(`जी मास्टर, ${sec} सेकंड का बैकग्राउंड टाइमर सेट कर दिया है।`);

    setTimeout(() => {
      playTone(1567.98, 0.35, 'triangle', 0.3);
      showBgToast('TIMER COMPLETE! ⏰', `${sec}s टाइमर पूरा हो गया!`);
      speakText(`मास्टर विहुहुहु, आपका ${sec} सेकंड का टाइमर पूरा हो गया है!`);
    }, sec * 1000);
  }

  let bgAmbienceNodes = null;

  function toggleBackgroundAmbience(type = 'rain') {
    if (bgAmbienceNodes) {
      stopBackgroundAmbience();
      speakText('जी मास्टर, बैकग्राउंड साउंड बंद कर दिया है।');
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.15;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = type === 'space' ? 'bandpass' : 'lowpass';
      filter.frequency.setValueAtTime(type === 'space' ? 240 : 850, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start();

      bgAmbienceNodes = { ctx, whiteNoise, gain };
      showBgToast('BACKGROUND AMBIENCE ON', type === 'space' ? '🌌 Cosmic Space Drone Active' : '🌧️ Cyber Rain Ambience Active');
      speakText('जी मास्टर, बैकग्राउंड में एंबियंस चालू कर दिया है।');
    } catch (_) {}
  }

  function stopBackgroundAmbience() {
    if (bgAmbienceNodes) {
      try {
        bgAmbienceNodes.gain.gain.linearRampToValueAtTime(0.001, bgAmbienceNodes.ctx.currentTime + 0.5);
        setTimeout(() => {
          try {
            bgAmbienceNodes.whiteNoise.stop();
            bgAmbienceNodes.ctx.close();
          } catch(_) {}
          bgAmbienceNodes = null;
        }, 600);
      } catch(_) {
        bgAmbienceNodes = null;
      }
    }
  }

  function showBgToast(title, desc) {
    if (!DOM.bgAgentToast) return;
    if (DOM.bgToastTitle) DOM.bgToastTitle.textContent = title;
    if (DOM.bgToastDesc) DOM.bgToastDesc.textContent = desc;
    DOM.bgAgentToast.classList.remove('hidden');

    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => {
      if (DOM.bgAgentToast) DOM.bgAgentToast.classList.add('hidden');
    }, 8000);
  }



  // ========================================================
  // 5. PREMIUM NATURAL AI ASSISTANT VOICES (AZURE NEURAL TTS)
  // AAIRA: Natural, friendly, intelligent female AI assistant (hi-IN-SwaraNeural)
  // VIHUHUHU: Natural, confident, clear male voice (hi-IN-MadhurNeural)
  // ========================================================
  function setVoicePersona(id) {
    const isMale = (id === 'vihuhuhu' || id === 'male');
    state.activeVoicePersona = isMale ? 'vihuhuhu' : 'aaira';
    state.voiceProfileIndex = isMale ? 1 : 0;
    try {
      localStorage.setItem('aaira_voice_persona', state.activeVoicePersona);
    } catch (_) {}

    updateVoicePersonaUI();

    if (isMale) {
      speakText('नमस्ते मास्टर, मैं विहुहुहु हूँ। आपकी नेचुरल और कॉन्फिडेंट आवाज़ तैयार है!');
    } else {
      speakText('जी मास्टर, मैं आपकी आएरा हूँ। आपकी नेचुरल और फ्रेंडली एआई असिस्टेंट!');
    }
  }

  function toggleVoicePersona() {
    const next = state.activeVoicePersona === 'aaira' ? 'vihuhuhu' : 'aaira';
    setVoicePersona(next);
  }

  function updateVoicePersonaUI() {
    const current = VOICE_PROFILES[state.voiceProfileIndex] || VOICE_PROFILES[0];
    if (DOM.currentVoicePersonaLabel) {
      DOM.currentVoicePersonaLabel.textContent = current.id === 'vihuhuhu' ? 'VIHUHUHU (Male)' : 'AAIRA (Female)';
    }
    if (DOM.voicePersonaToggleBtn) {
      DOM.voicePersonaToggleBtn.className = `voice-persona-badge ${current.id}`;
    }
  }

  function cycleVoiceProfile() {
    toggleVoicePersona();
  }

  function speakText(rawText, onDone = null) {
    if (!state.ttsEnabled) {
      if (onDone) onDone();
      return;
    }

    // Stop any currently playing audio TTS
    if (sharedAudioTTS) {
      try {
        sharedAudioTTS.pause();
        sharedAudioTTS.src = '';
      } catch(_) {}
    }
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch(_) {}
    }

    try {
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

      state.isSpeaking = true;
      if (DOM.mainOrbBtn) DOM.mainOrbBtn.classList.add('speaking');
      if (DOM.mainAIOralCanvas) DOM.mainAIOralCanvas.classList.add('speaking');
      if (DOM.mainOrbWrapper) DOM.mainOrbWrapper.classList.add('speaking');
      if (DOM.voiceRecorderStream) {
        DOM.voiceRecorderStream.classList.add('speaking');
      }
      if (DOM.recStatusLabel) {
        DOM.recStatusLabel.textContent = '🌸 AI SPEAKING...';
      }
      if (DOM.stageDialogueState) {
        DOM.stageDialogueState.textContent = 'Speaking... (बोल रही हूँ)';
      }

      // Pause mic while speaking so AI does not hear her own voice
      if (speechRecognizer) {
        try { speechRecognizer.stop(); } catch(_) {}
      }

      let finished = false;
      const onFinish = () => {
        if (finished) return;
        finished = true;
        state.isSpeaking = false;
        if (DOM.mainOrbBtn) DOM.mainOrbBtn.classList.remove('speaking');
        if (DOM.mainAIOralCanvas) DOM.mainAIOralCanvas.classList.remove('speaking');
        if (DOM.mainOrbWrapper) DOM.mainOrbWrapper.classList.remove('speaking');
        if (DOM.voiceRecorderStream) {
          DOM.voiceRecorderStream.classList.remove('speaking');
        }
        if (DOM.recStatusLabel) {
          DOM.recStatusLabel.textContent = '🟢 24/7 VOICE RECORDER ACTIVE';
        }
        if (DOM.stageDialogueState) {
          DOM.stageDialogueState.textContent = '🟢 सुन रही हूँ... बोलिए मास्टर विहुहुहु 🌸';
        }

        if (onDone) onDone();

        // Continuous Hands-Free: immediately resume mic like ChatGPT / Phone Call!
        setTimeout(() => {
          if (!state.isSpeaking && (state.unlocked || state.voiceCallActive)) {
            startListening();
          }
        }, 150);
      };

      const profile = VOICE_PROFILES[state.voiceProfileIndex] || VOICE_PROFILES[0];
      const voiceParam = profile.voice || state.activeVoicePersona || 'aaira';
      const langParam = profile.lang || 'hi';

      function playViaNativeSpeech() {
        if ('speechSynthesis' in window) {
          try {
            window.speechSynthesis.cancel();
            const utter = new SpeechSynthesisUtterance(clean);
            utter.lang = 'hi-IN';
            utter.rate = 1.0;
            utter.pitch = (voiceParam === 'vihuhuhu' || state.activeVoicePersona === 'vihuhuhu') ? 0.9 : 1.1;
            utter.onend = onFinish;
            utter.onerror = onFinish;
            window.speechSynthesis.speak(utter);
            return true;
          } catch (_) {}
        }
        return false;
      }

      // 1. Studio-Quality Azure Neural Voice Stream from /api/tts (AAIRA / VIHUHUHU)
      const audioUrl = `/api/tts?text=${encodeURIComponent(clean)}&voice=${encodeURIComponent(voiceParam)}&lang=${encodeURIComponent(langParam)}`;

      if (!sharedAudioTTS) sharedAudioTTS = new Audio();
      state.currentAudioTTS = sharedAudioTTS;
      sharedAudioTTS.src = audioUrl;

      sharedAudioTTS.onended = onFinish;
      sharedAudioTTS.onerror = () => {
        console.warn('[Audio TTS playback error, trying SpeechSynthesis fallback]');
        if (!playViaNativeSpeech()) onFinish();
      };

      const playPromise = sharedAudioTTS.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('[Audio TTS play promise error, trying SpeechSynthesis fallback]', err);
          if (!playViaNativeSpeech()) onFinish();
        });
      }
    } catch (_) {
      if (onDone) onDone();
    }
  }

  // ========================================================
  // 6. 24/7 HANDS-FREE AMBIENT SPEECH RECOGNITION (MOBILE OPTIMIZED)
  // ========================================================
  let speechRecognizer = null;

  function checkAndHandleMorphCommand(text) {
    const lower = text.toLowerCase().trim();

    // 1. CUBE / TESSERACT ("Cube banao", "Dabba banao", "Matrix karo")
    if (lower.includes('cube') || lower.includes('box') || lower.includes('dabba') || lower.includes('matrix') || lower.includes('tesseract') || lower.includes('क्यूब') || lower.includes('डब्बा')) {
      morphTo3DShape('CUBE');
      return true;
    }

    // 2. SPHERE / BALL / GOLA ("Sphere banao", "Gola banao", "Ball karo")
    if (lower.includes('sphere') || lower.includes('gola') || lower.includes('round') || lower.includes('ball') || lower.includes('default aui') || lower.includes('गोला')) {
      morphTo3DShape('SPHERE');
      return true;
    }

    // 3. TORUS / RING / CHAKRA ("Ring banao", "Chakra banao", "Donut karo")
    if (lower.includes('ring') || lower.includes('chakra') || lower.includes('torus') || lower.includes('donut') || lower.includes('chhalla') || lower.includes('रिंग') || lower.includes('चक्र')) {
      morphTo3DShape('TORUS');
      return true;
    }

    // 4. CRYSTAL / DIAMOND / HEERA ("Crystal banao", "Diamond banao", "Heera karo")
    if (lower.includes('crystal') || lower.includes('diamond') || lower.includes('heera') || lower.includes('gem') || lower.includes('हीरा') || lower.includes('क्रिस्टल')) {
      morphTo3DShape('CRYSTAL');
      return true;
    }

    // 5. BLACK HOLE / VORTEX / GALAXY ("Black hole banao", "Vortex karo", "Galaxy banao")
    if (lower.includes('black hole') || lower.includes('vortex') || lower.includes('galaxy') || lower.includes('tornado') || lower.includes('bhanwar') || lower.includes('singularity') || lower.includes('ब्लैक होल')) {
      morphTo3DShape('VORTEX');
      return true;
    }

    // 6. DNA / HELIX ("DNA banao", "Helix karo", "Spiral banao")
    if (lower.includes('dna') || lower.includes('helix') || lower.includes('spiral') || lower.includes('tarang') || lower.includes('डीएनए')) {
      morphTo3DShape('DNA');
      return true;
    }

    // 7. HEART / DIL ("Dil banao", "Heart karo")
    if (lower.includes('heart') || lower.includes('dil') || lower.includes('love') || lower.includes('दिल')) {
      morphTo3DShape('HEART');
      return true;
    }

    // 8. COLOR SHIFTS
    if (lower.includes('golden') || lower.includes('gold') || lower.includes('peela') || lower.includes('पीला') || lower.includes('गोल्डन')) {
      setAUIColor('#ffd700', 'गोल्डन (Gold)');
      return true;
    }
    if (lower.includes('green') || lower.includes('hara') || lower.includes('हरा') || lower.includes('ग्रीन')) {
      setAUIColor('#00ff88', 'एमराल्ड ग्रीन (Green)');
      return true;
    }
    if (lower.includes('red') || lower.includes('lal') || lower.includes('लाल') || lower.includes('रेड')) {
      setAUIColor('#ff0033', 'रेड अलर्ट (Red)');
      return true;
    }
    if (lower.includes('pink') || lower.includes('gulabi') || lower.includes('गुलाबी') || lower.includes('पिंक')) {
      setAUIColor('#ff007f', 'सिंथवेव पिंक (Pink)');
      return true;
    }
    if (lower.includes('blue') || lower.includes('neela') || lower.includes('cyan') || lower.includes('नीला') || lower.includes('ब्लू')) {
      setAUIColor('#00f0ff', 'साइबर नियॉन ब्लू (Cyan)');
      return true;
    }
    if (lower.includes('purple') || lower.includes('baingani') || lower.includes('violet') || lower.includes('बैंगनी')) {
      setAUIColor('#a855f7', 'डीप स्पेस वॉयलेट (Purple)');
      return true;
    }

    // 9. CYCLE / ANY MORPH ("AUI badlo", "Shape badlo", "Aisa aui karo", "Vaisa aui karo")
    if (
      lower.includes('badlo') || lower.includes('badal') || lower.includes('change') ||
      lower.includes('aisa aui') || lower.includes('vaisa aui') || lower.includes('aaisa') ||
      lower.includes('roop') || lower.includes('next') || lower.includes('बदलो') || lower.includes('बदल')
    ) {
      cycleNextShape();
      return true;
    }

    return false;
  }

  function initSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      console.warn('[Voice] Speech Recognition not supported in this browser');
      if (DOM.stageDialogueState) {
        DOM.stageDialogueState.textContent = '⚠️ Chrome Browser Recommended for Voice';
      }
      return;
    }

    try {
      if (speechRecognizer) {
        try { speechRecognizer.abort(); } catch(_) {}
      }
    } catch(_) {}

    speechRecognizer = new SpeechRec();
    speechRecognizer.continuous = true;
    speechRecognizer.interimResults = true;
    speechRecognizer.lang = 'hi-IN';

    speechRecognizer.onstart = () => {
      state.isListening = true;
      if (DOM.mainOrbBtn) DOM.mainOrbBtn.classList.add('listening');
      if (DOM.mainAIOralCanvas) DOM.mainAIOralCanvas.classList.add('listening');
      if (DOM.mainOrbWrapper) DOM.mainOrbWrapper.classList.add('listening');
      if (DOM.stageDialogueState) {
        DOM.stageDialogueState.innerHTML = '🟢 <span style="color:#00f0ff;">MIC ACTIVE</span> • बोलिए, मैं सुन रही हूँ 🌸';
      }
    };

    speechRecognizer.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalTranscript += item[0].transcript;
        } else {
          interimTranscript += item[0].transcript;
        }
      }

      // Live Interim Subtitle Feedback (Displays words as the user speaks into microphone!)
      if (interimTranscript) {
        if (DOM.stageDialogueState) {
          DOM.stageDialogueState.innerHTML = `<span style="color: #00f0ff;">🎤 सुन रही हूँ: "${escapeHtml(interimTranscript)}..."</span>`;
        }
      }

      if (finalTranscript.trim()) {
        const transcript = finalTranscript.trim();
        handleSpokenInput(transcript);
      }
    };

    speechRecognizer.onerror = (err) => {
      console.warn('[SpeechRec error]', err.error);
      if (err.error === 'not-allowed') {
        if (DOM.stageDialogueState) {
          DOM.stageDialogueState.textContent = '⚠️ Mic Permission Denied. कृपया ब्राउज़र में माइक Allow करें।';
        }
        return;
      }
      if (err.error === 'audio-capture') {
        // Zero conflict: force release any stray tracks and restart cleanly
        releaseHardwareMic();
        setTimeout(() => {
          if (!state.isSpeaking && (state.unlocked || state.voiceCallActive)) {
            try { speechRecognizer.start(); } catch(_) {}
          }
        }, 300);
        return;
      }
      // Instant auto-restart on silent pause/timeout so voice session continues
      if (!state.isSpeaking && (state.unlocked || state.voiceCallActive)) {
        setTimeout(() => {
          if (!state.isSpeaking && (state.unlocked || state.voiceCallActive)) {
            try { speechRecognizer.start(); } catch(_) {}
          }
        }, 120);
      }
    };

    speechRecognizer.onend = () => {
      state.isListening = false;
      if (DOM.mainOrbBtn) DOM.mainOrbBtn.classList.remove('listening');
      if (DOM.mainAIOralCanvas) DOM.mainAIOralCanvas.classList.remove('listening');
      if (DOM.mainOrbWrapper) DOM.mainOrbWrapper.classList.remove('listening');
      // Continuous Hands-Free: automatically resume listening so voice never drops
      if (!state.isSpeaking && (state.unlocked || state.voiceCallActive)) {
        setTimeout(() => {
          if (!state.isSpeaking && (state.unlocked || state.voiceCallActive)) {
            try { speechRecognizer.start(); } catch(_) {}
          }
        }, 80);
      }
    };
  }

  function handleSpokenInput(transcript) {
    if (!transcript) return;

    // When locked: ONLY speaking the secret 3-digit code unlocks the AI!
    if (!state.unlocked) {
      if (verifySpokenAuthCode(transcript)) {
        authorizeMaster();
        return;
      }
      if (DOM.stageDialogueState) {
        DOM.stageDialogueState.classList.add('visible');
        DOM.stageDialogueState.innerHTML = `<span style="color:#ffcc00;">🎤 सुना: "${escapeHtml(transcript)}" • कोड बोलिए: "${state.activeAuthCode || 'कोड'}"</span>`;
      }
      return;
    }

    // When unlocked: execute any 3D morph, voice command, or conversational chat!
    if (checkAndHandleMorphCommand(transcript)) {
      return;
    }

    dispatchVoiceCommand(transcript);
  }

  function startListening() {
    releaseHardwareMic(); // Make sure NO getUserMedia lock exists!
    if (!speechRecognizer) initSpeechRecognition();
    if (!speechRecognizer) return;

    try {
      if (sharedAudioTTS) {
        sharedAudioTTS.pause();
      }
      speechRecognizer.start();
    } catch (_) {}
  }

  function stopListening() {
    state.isListening = false;
    if (DOM.mainOrbBtn) DOM.mainOrbBtn.classList.remove('listening');
    if (DOM.mainAIOralCanvas) DOM.mainAIOralCanvas.classList.remove('listening');
    if (DOM.mainOrbWrapper) DOM.mainOrbWrapper.classList.remove('listening');
    if (DOM.stageDialogueState) {
      DOM.stageDialogueState.textContent = state.unlocked ? '🟢 24/7 ACTIVE' : 'STANDBY • TAP CORE TO ACTIVATE';
    }
  }

  function toggleListening() {
    if (state.isListening) {
      if (speechRecognizer) speechRecognizer.stop();
    } else {
      startListening();
    }
  }

  // ========================================================
  // CYBER 4K VIDEO & DIRECT YOUTUBE MEDIA ENGINE
  // ========================================================
  function setPlayerMode(mode) {
    if (mode === 'html') {
      if (DOM.switchHtmlVideoBtn) DOM.switchHtmlVideoBtn.classList.add('active');
      if (DOM.switchYoutubeBtn) DOM.switchYoutubeBtn.classList.remove('active');
      if (DOM.directPlayerIcon) DOM.directPlayerIcon.className = 'fa-solid fa-film';
      if (DOM.directHtmlVideo) DOM.directHtmlVideo.classList.remove('hidden');
      if (DOM.directYoutubePlayer) {
        DOM.directYoutubePlayer.classList.add('hidden');
        DOM.directYoutubePlayer.src = '';
      }
      if (DOM.directHtmlVideo) {
        DOM.directHtmlVideo.muted = false;
        DOM.directHtmlVideo.volume = 1.0;
        const playPromise = DOM.directHtmlVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay policy fallback: mute first to guarantee playback
            DOM.directHtmlVideo.muted = true;
            DOM.directHtmlVideo.play().catch(() => {});
          });
        }
      }
    } else {
      if (DOM.switchHtmlVideoBtn) DOM.switchHtmlVideoBtn.classList.remove('active');
      if (DOM.switchYoutubeBtn) DOM.switchYoutubeBtn.classList.add('active');
      if (DOM.directPlayerIcon) DOM.directPlayerIcon.className = 'fa-brands fa-youtube';
      if (DOM.directHtmlVideo) {
        DOM.directHtmlVideo.pause();
        DOM.directHtmlVideo.classList.add('hidden');
      }
      if (DOM.directYoutubePlayer) DOM.directYoutubePlayer.classList.remove('hidden');
    }
  }

  function playDirectCyberVideo(title = 'CYBER 4K VIDEO CENTER') {
    closeAllHUDs();
    if (DOM.youtubeOverlayTitle) DOM.youtubeOverlayTitle.textContent = title;
    setPlayerMode('html');
    if (DOM.youtubeDirectOverlay) {
      DOM.youtubeDirectOverlay.classList.remove('hidden');
    }
    if (DOM.directHtmlVideo) {
      DOM.directHtmlVideo.muted = false;
      DOM.directHtmlVideo.volume = 1.0;
      DOM.directHtmlVideo.play().catch(() => {});
    }
  }

  function playDirectYouTube(queryOrUrl, title = 'YouTube Direct Stream') {
    closeAllHUDs();
    if (DOM.youtubeOverlayTitle) DOM.youtubeOverlayTitle.textContent = title;

    let embedSrc = '';
    const clean = (queryOrUrl || '').trim();

    if (clean.includes('youtube.com') || clean.includes('youtu.be')) {
      const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      const vidId = match ? match[1] : '';
      embedSrc = vidId ? `https://www.youtube.com/embed/${vidId}?autoplay=1&enablejsapi=1` : clean;
    } else {
      const lower = clean.toLowerCase();
      // Verified Embeddable Videos with ZERO copyright/embed errors!
      if (lower.includes('arijit') || lower.includes('bollywood') || lower.includes('hindi')) {
        embedSrc = 'https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1&enablejsapi=1';
      } else if (lower.includes('anime') || lower.includes('cyberpunk') || lower.includes('4k')) {
        embedSrc = 'https://www.youtube.com/embed/4xDzrJKXOOY?autoplay=1&enablejsapi=1';
      } else if (lower.includes('sidhu') || lower.includes('punjabi')) {
        embedSrc = 'https://www.youtube.com/embed/DWcJFNfaw9c?autoplay=1&enablejsapi=1';
      } else {
        embedSrc = 'https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1&enablejsapi=1';
      }
    }

    setPlayerMode('youtube');
    if (DOM.directYoutubePlayer) {
      DOM.directYoutubePlayer.src = embedSrc;
    }
    if (DOM.youtubeDirectOverlay) {
      DOM.youtubeDirectOverlay.classList.remove('hidden');
    }
  }

  function stopDirectYouTube() {
    if (DOM.directHtmlVideo) {
      try { DOM.directHtmlVideo.pause(); } catch (_) {}
    }
    if (DOM.directYoutubePlayer) {
      DOM.directYoutubePlayer.src = '';
    }
    if (DOM.youtubeDirectOverlay) {
      DOM.youtubeDirectOverlay.classList.add('hidden');
    }
  }

  // ========================================================
  // INSTANT SILENT MEDIA PLAYERS ("ai bolna nahi chahiye")
  // ========================================================
  function playMusicNow(query = '') {
    // 1. Immediately silence any AI speech voice
    if (sharedAudioTTS) {
      try { sharedAudioTTS.pause(); sharedAudioTTS.src = ''; } catch(_) {}
    }
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch(_) {}
    }
    state.isSpeaking = false;

    // 2. Play Local Guaranteed Music or Direct YouTube Stream
    const lower = (query || '').toLowerCase();
    if (lower.includes('youtube') || lower.includes('arijit') || lower.includes('sidhu') || lower.includes('punjabi') || lower.includes('bollywood')) {
      playDirectYouTube(query || 'hindi lofi songs', 'YouTube Music Stream');
    } else {
      let trackIdx = 0;
      if (lower.includes('synth') || lower.includes('pulse')) trackIdx = 1;
      else if (lower.includes('anime') || lower.includes('sunset')) trackIdx = 2;

      loadTrack(trackIdx);
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
      if (DOM.mainAudioPlayer) {
        DOM.mainAudioPlayer.muted = false;
        DOM.mainAudioPlayer.volume = 1.0;
        const playPromise = DOM.mainAudioPlayer.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            playDirectCyberVideo('CYBER 4K MUSIC & VIDEO');
          });
        }
      }
    }

    // 3. AI DOES NOT SPEAK! Silent visual subtitle only:
    if (DOM.stageDialogueState) {
      DOM.stageDialogueState.classList.add('visible');
      DOM.stageDialogueState.innerHTML = '🎵 <strong>Playing Music...</strong> (रोकने के लिए बोलिए: "Band karo")';
      clearTimeout(state.dialogueHideTimeout);
      state.dialogueHideTimeout = setTimeout(() => {
        if (!state.isSpeaking && !state.isListening) {
          DOM.stageDialogueState.classList.remove('visible');
        }
      }, 3500);
    }
  }

  function playVideoNow(title = 'CYBER 4K VIDEO CENTER') {
    // 1. Immediately silence any AI speech voice
    if (sharedAudioTTS) {
      try { sharedAudioTTS.pause(); sharedAudioTTS.src = ''; } catch(_) {}
    }
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch(_) {}
    }
    state.isSpeaking = false;

    // 2. Launch Cyber 4K Video immediately!
    playDirectCyberVideo(title);

    // 3. AI DOES NOT SPEAK! Silent visual subtitle only:
    if (DOM.stageDialogueState) {
      DOM.stageDialogueState.classList.add('visible');
      DOM.stageDialogueState.innerHTML = '🎬 <strong>Playing 4K Video...</strong> (रोकने के लिए बोलिए: "Band karo")';
      clearTimeout(state.dialogueHideTimeout);
      state.dialogueHideTimeout = setTimeout(() => {
        if (!state.isSpeaking && !state.isListening) {
          DOM.stageDialogueState.classList.remove('visible');
        }
      }, 3500);
    }
  }

  // ========================================================
  // 7. VOICE COMMAND ENGINE ("ai all kam vaice command pe kare")
  // ========================================================
  function dispatchVoiceCommand(text) {
    const lower = text.toLowerCase().trim();

    // Command 1: STOP / CLOSE COMMAND ("Band karo" / "Roko" / "Stop" / "Hatao")
    if (
      lower.includes('band karo') || lower.includes('chhupao') || lower.includes('close') ||
      lower.includes('hide') || lower.includes('hatao') || lower.includes('screen saaf') ||
      lower.includes('roko') || lower.includes('stop') || lower.includes('pause') ||
      lower.includes('बंद करो') || lower.includes('रोको') || lower.includes('बंद')
    ) {
      stopDirectYouTube();
      toggleAudioPlay(false);
      if (DOM.dashboardVideo) DOM.dashboardVideo.pause();
      closeAllHUDs();
      if (DOM.stageDialogueState) {
        DOM.stageDialogueState.classList.add('visible');
        DOM.stageDialogueState.innerHTML = '🛑 <strong>सब बंद कर दिया है।</strong>';
        setTimeout(() => { DOM.stageDialogueState.classList.remove('visible'); }, 2000);
      }
      return;
    }

    // Command 2: MUSIC / SONG COMMAND (SILENT PLAYBACK - AI DOES NOT SPEAK!)
    if (
      lower.includes('gaana') || lower.includes('music') || lower.includes('song') ||
      lower.includes('गाना') || lower.includes('गीत') || lower.includes('lofi')
    ) {
      playMusicNow(text);
      return;
    }

    // Command 3: VIDEO COMMAND (SILENT PLAYBACK - AI DOES NOT SPEAK!)
    if (lower.includes('video') || lower.includes('वीडियो') || lower.includes('movie') || lower.includes('anime') || lower.includes('film')) {
      playVideoNow('CYBER 4K VIDEO CENTER');
      return;
    }

    // Command 4: DASHBOARD COMMAND ("Dashboard dikhao" / "All features dikhao")
    if (lower.includes('dashboard') || lower.includes('डैशबोर्ड') || lower.includes('all feature') || lower.includes('features')) {
      closeAllHUDs();
      openHUD(DOM.dashboardOverlayHUD);
      loadCreationsVault();
      updateDialogue(text, 'जी मास्टर! पूरा डैशबोर्ड और सभी फीचर्स आपके सामने हैं। 📊');
      speakText('जी मास्टर विहुहुहु, पूरा डैशबोर्ड और सभी फीचर्स आपके सामने हैं!');
      return;
    }

    // Command 5: SYSTEM LOCK COMMAND ("Lock karo" / "Band ho jao")
    if (lower.includes('lock karo') || lower.includes('lock system') || lower.includes('band ho jao')) {
      lockSystem();
      return;
    }

    // Command 6: VOICE PERSONA SWITCHING ("VIHUHUHU voice karo" / "AAIRA voice karo" / "Awaaz badlo")
    if (
      lower.includes('vihuhuhu voice') || lower.includes('vihuhu voice') || lower.includes('male voice') ||
      lower.includes('purush voice') || lower.includes('ladke ki voice') || lower.includes('ladke ki awaaz') ||
      lower.includes('purush awaaz')
    ) {
      setVoicePersona('vihuhuhu');
      return;
    }

    if (
      lower.includes('aaira voice') || lower.includes('female voice') || lower.includes('stree voice') ||
      lower.includes('ladki ki voice') || lower.includes('ladki ki awaaz') || lower.includes('sweet voice') ||
      lower.includes('stree awaaz')
    ) {
      setVoicePersona('aaira');
      return;
    }

    if (
      lower.includes('voice badlo') || lower.includes('aawaz badlo') || lower.includes('awaaz badlo') ||
      lower.includes('awaj badlo') || lower.includes('voice change') || lower.includes('change voice') ||
      lower.includes('aawaz change') || lower.includes('awaaz change') || lower.includes('आवाज बदलो')
    ) {
      toggleVoicePersona();
      return;
    }

    // Command 7: 3D AUI SHAPE MORPH COMMANDS ("Cube karo" / "Sphere karo" / "Ring karo" / "AUI aaisa karo")
    if (lower.includes('cube') || lower.includes('box banao') || lower.includes('dabba') || lower.includes('matrix cube') || lower.includes('tesseract')) {
      morphTo3DShape('CUBE');
      return;
    }
    if (lower.includes('sphere') || lower.includes('gola') || lower.includes('round') || lower.includes('ball') || lower.includes('default aui')) {
      morphTo3DShape('SPHERE');
      return;
    }
    if (lower.includes('ring') || lower.includes('chakra') || lower.includes('torus') || lower.includes('donut')) {
      morphTo3DShape('TORUS');
      return;
    }
    if (lower.includes('crystal') || lower.includes('diamond') || lower.includes('heera') || lower.includes('gem')) {
      morphTo3DShape('CRYSTAL');
      return;
    }
    if (lower.includes('black hole') || lower.includes('vortex') || lower.includes('galaxy') || lower.includes('tornado') || lower.includes('singularity')) {
      morphTo3DShape('VORTEX');
      return;
    }
    if (lower.includes('dna') || lower.includes('helix') || lower.includes('spiral')) {
      morphTo3DShape('DNA');
      return;
    }
    if (lower.includes('heart') || lower.includes('dil banao') || lower.includes('dil karo')) {
      morphTo3DShape('HEART');
      return;
    }
    if (
      lower.includes('aui badlo') || lower.includes('shape badlo') || lower.includes('aui change') ||
      lower.includes('aui aaisa') || lower.includes('aisa aui') || lower.includes('3d badlo') ||
      lower.includes('next shape') || lower.includes('shape change')
    ) {
      cycleNextShape();
      return;
    }

    // Command 8: 3D AUI COLOR SHIFT COMMANDS ("Golden karo" / "Green karo" / "Red karo" / "Blue karo")
    if (lower.includes('golden') || lower.includes('gold color') || lower.includes('peela')) {
      setAUIColor('#ffd700', 'गोल्डन (Gold)');
      return;
    }
    if (lower.includes('green') || lower.includes('hara color') || lower.includes('emerald')) {
      setAUIColor('#00ff88', 'एमराल्ड ग्रीन (Green)');
      return;
    }
    if (lower.includes('red') || lower.includes('lal color') || lower.includes('crimson')) {
      setAUIColor('#ff0033', 'रेड अलर्ट (Red)');
      return;
    }
    if (lower.includes('pink') || lower.includes('gulabi') || lower.includes('magenta')) {
      setAUIColor('#ff007f', 'सिंथवेव पिंक (Pink)');
      return;
    }
    if (lower.includes('blue') || lower.includes('neela') || lower.includes('cyan')) {
      setAUIColor('#00f0ff', 'साइबर नियॉन ब्लू (Cyan)');
      return;
    }
    if (lower.includes('purple') || lower.includes('baingani') || lower.includes('violet')) {
      setAUIColor('#a855f7', 'डीप स्पेस वॉयलेट (Purple)');
      return;
    }

    // Command 9: BACKGROUND AUTONOMOUS WORKER COMMANDS ("Background me research karo" / "Background me note likho")
    if (lower.includes('background me research') || lower.includes('background research') || lower.includes('background me pata') || lower.includes('background me dhoondo')) {
      const topic = text.replace(/.*(background me research karo|background research karo|background me pata karo|background me dhoondo|background me)\s*/i, '').trim();
      triggerBackgroundResearch(topic || 'latest AI technology & future trends');
      return;
    }

    if (lower.includes('background me note') || lower.includes('background me save') || lower.includes('yaad rakhna')) {
      saveBackgroundNote(text);
      return;
    }

    if (lower.includes('barish') || lower.includes('rain ambience') || lower.includes('rain sound') || lower.includes('background sound chalao')) {
      toggleBackgroundAmbience('rain');
      return;
    }
    if (lower.includes('space drone') || lower.includes('space sound') || lower.includes('antariksh')) {
      toggleBackgroundAmbience('space');
      return;
    }
    if (lower.includes('sound band') || lower.includes('ambience band') || lower.includes('background sound band')) {
      stopBackgroundAmbience();
      speakText('जी मास्टर, बैकग्राउंड साउंड बंद कर दिया है।');
      return;
    }

    if (lower.includes('timer') || lower.includes('अलार्म')) {
      const match = text.match(/\d+/);
      const secs = match ? parseInt(match[0]) : 30;
      startBackgroundTimer(secs);
      return;
    }

    // Command 10: BUILD APPS / GAMES / OMNIPOTENT CODE GENERATION ("Game banao" / "Calculator banao")
    handleOmnipotentCodeRequest(text);
  }

  function updateDialogue(userText, aiText) {
    if (DOM.stageDialogueState) {
      const cleanMsg = aiText.replace(/<[^>]+>/g, '').slice(0, 80);
      DOM.stageDialogueState.textContent = cleanMsg || '🟢 24/7 ACTIVE';
    }

    // Append to dashboard chat log as well
    if (DOM.dashChatContainer) {
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
    stopDirectYouTube();
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
    if (DOM.mainOrbBtn) {
      DOM.mainOrbBtn.addEventListener('click', handleMainOrbClick);
    }
    if (DOM.mainAIOralCanvas) {
      DOM.mainAIOralCanvas.addEventListener('click', handleMainOrbClick);
    }
    if (DOM.mainOrbWrapper) {
      DOM.mainOrbWrapper.addEventListener('click', handleMainOrbClick);
    }

    // Tapping the Secret Code Badge quick-authorizes as fallback
    if (DOM.authCodeBadge) {
      DOM.authCodeBadge.addEventListener('click', authorizeMaster);
    }

    // Quick Action Buttons (Dashboard Media Actions)
    if (DOM.quickSongBtn) {
      DOM.quickSongBtn.addEventListener('click', () => {
        playMusicNow('hindi lofi songs');
      });
    }

    if (DOM.quickVideoBtn) {
      DOM.quickVideoBtn.addEventListener('click', () => {
        playVideoNow('CYBER 4K VIDEO CENTER');
      });
    }

    if (DOM.quickStopBtn) {
      DOM.quickStopBtn.addEventListener('click', () => {
        stopDirectYouTube();
        toggleAudioPlay(false);
        if (DOM.dashboardVideo) DOM.dashboardVideo.pause();
        closeAllHUDs();
        if (DOM.stageDialogueState) {
          DOM.stageDialogueState.classList.add('visible');
          DOM.stageDialogueState.innerHTML = '🛑 <strong>सब बंद कर दिया है।</strong>';
          setTimeout(() => { DOM.stageDialogueState.classList.remove('visible'); }, 2000);
        }
      });
    }

    // Close Direct YouTube Button
    if (DOM.closeYoutubeOverlayBtn) {
      DOM.closeYoutubeOverlayBtn.addEventListener('click', stopDirectYouTube);
    }

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
    // 3D Shape Badge Click to cycle shapes
    if (DOM.auiShapeBadge) {
      DOM.auiShapeBadge.addEventListener('click', cycleNextShape);
    }

    // Open Dashboard Button Click
    if (DOM.openDashboardBtn) {
      DOM.openDashboardBtn.addEventListener('click', () => {
        closeAllHUDs();
        openHUD(DOM.dashboardOverlayHUD);
        loadCreationsVault();
      });
    }

    // 3D Shape Buttons in Dashboard
    if (DOM.auiShapeButtons) {
      DOM.auiShapeButtons.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-shape]');
        if (btn) {
          const shape = btn.getAttribute('data-shape');
          morphTo3DShape(shape);
        }
      });
    }

    // Zoom Reset Button
    if (DOM.zoomResetBtn) {
      DOM.zoomResetBtn.addEventListener('click', () => {
        userHasRotated3D = true;
        set3DZoom(1.0);
      });
    }

    // Voice Persona Switcher Badge Click
    if (DOM.voicePersonaToggleBtn) {
      DOM.voicePersonaToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleVoicePersona();
      });
    }

    // Voice Call Mode Button Click ("ak voice ple klick kar dene pe per bat karta hai")
    if (DOM.voiceCallTriggerBtn) {
      DOM.voiceCallTriggerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleVoiceConversationMode();
      });
    }

    // Reset AUI Position to screen center
    if (DOM.resetAuiPosBtn) {
      DOM.resetAuiPosBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetAUIPosition();
      });
    }

    // Close Background Toast
    if (DOM.bgToastClose) {
      DOM.bgToastClose.addEventListener('click', () => {
        if (DOM.bgAgentToast) DOM.bgAgentToast.classList.add('hidden');
      });
    }

    // Interaction primes audio and keeps voice session alive without any mic conflict
    const ensureMicListening = () => {
      primeMobileMedia();
      if (state.voiceCallActive && !state.isSpeaking) {
        startListening();
      }
    };
    window.addEventListener('click', ensureMicListening, { passive: true });
    window.addEventListener('touchstart', ensureMicListening, { passive: true });
  }

  function initCompanionFeatures() {
    initThreeDCore();
    updateVoicePersonaUI();
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
