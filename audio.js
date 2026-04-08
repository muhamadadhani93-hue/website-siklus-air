/* ============================================
   SIKLUS AIR — Audio Manager
   ============================================ */

const AudioManager = {
  _enabled: true,
  _bgmVolume: 0.3,
  _sfxVolume: 0.5,
  _currentBgm: null,
  _ctx: null,

  init() {
    this._enabled = Utils.storage.get('settings.audioEnabled') !== false;
    this._bgmVolume = Utils.storage.get('settings.bgmVolume') || 0.3;
    this._updateToggleUI();
  },

  _getContext() {
    if (!this._ctx) {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this._ctx;
  },

  // Play a synthesized sound effect
  playSFX(type) {
    if (!this._enabled) return;
    try {
      const ctx = this._getContext();
      if (ctx.state === 'suspended') ctx.resume();

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      switch (type) {
        case 'pop':
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(800, ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
          gainNode.gain.setValueAtTime(this._sfxVolume * 0.3, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.15);
          break;

        case 'correct':
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(523, ctx.currentTime);
          oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
          gainNode.gain.setValueAtTime(this._sfxVolume * 0.3, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.4);
          break;

        case 'wrong':
          oscillator.type = 'sawtooth';
          oscillator.frequency.setValueAtTime(300, ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);
          gainNode.gain.setValueAtTime(this._sfxVolume * 0.2, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.3);
          break;

        case 'achievement':
          const notes = [523, 659, 784, 1047];
          notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
            gain.gain.setValueAtTime(this._sfxVolume * 0.25, ctx.currentTime + i * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
            osc.start(ctx.currentTime + i * 0.12);
            osc.stop(ctx.currentTime + i * 0.12 + 0.3);
          });
          break;

        case 'drop':
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(1200, ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.15);
          gainNode.gain.setValueAtTime(this._sfxVolume * 0.2, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.2);
          break;

        case 'water':
          // Simulate water/bubble sound
          for (let i = 0; i < 5; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            const baseFreq = 600 + Math.random() * 800;
            osc.frequency.setValueAtTime(baseFreq, ctx.currentTime + i * 0.08);
            osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, ctx.currentTime + i * 0.08 + 0.1);
            gain.gain.setValueAtTime(this._sfxVolume * 0.1, ctx.currentTime + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.12);
            osc.start(ctx.currentTime + i * 0.08);
            osc.stop(ctx.currentTime + i * 0.08 + 0.12);
          }
          break;

        default:
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(600, ctx.currentTime);
          gainNode.gain.setValueAtTime(this._sfxVolume * 0.2, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.1);
      }
    } catch (e) {
      // Audio not supported, silently fail
    }
  },

  // TTS for glossary
  speak(text, lang = 'id-ID') {
    if (!this._enabled) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.85;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  },

  toggle() {
    this._enabled = !this._enabled;
    Utils.storage.set('settings.audioEnabled', this._enabled);
    this._updateToggleUI();
    if (this._enabled) {
      this.playSFX('pop');
    }
  },

  _updateToggleUI() {
    const btn = document.getElementById('audioToggle');
    if (btn) {
      btn.textContent = this._enabled ? '🔊' : '🔇';
      btn.classList.toggle('muted', !this._enabled);
    }
  },

  isEnabled() {
    return this._enabled;
  }
};

window.AudioManager = AudioManager;
