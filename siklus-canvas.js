/* ============================================
   SIKLUS AIR — Interactive Cycle Canvas (Step 2)
   ============================================ */

const SiklusCanvas = {
  _animating: false,
  _particles: [],
  _speed: 1,
  _activeProcess: null,
  _animFrameId: null,

  init() {
    this._bindTapZones();
    this._bindSpeedSlider();
    this._startParticleLoop();
  },

  _bindTapZones() {
    const zones = {
      'tapSun': { process: 'evaporasi', icon: '☀️', title: 'Evaporasi', desc: 'Air laut kepanasan oleh matahari, lalu berubah jadi uap air yang tidak terlihat. Uap ini terbang naik ke langit!', emoji: '♨️' },
      'tapCloud': { process: 'kondensasi', icon: '☁️', title: 'Kondensasi', desc: 'Uap air yang naik ke langit kedinginan, lalu berubah jadi titik-titik air kecil. Titik air ini berkumpul dan membentuk awan!', emoji: '💨' },
      'tapRain': { process: 'presipitasi', icon: '🌧️', title: 'Presipitasi', desc: 'Awan sudah terlalu berat menahan titik air. Akhirnya, titik air jatuh menjadi hujan! Bisa juga jadi salju kalau di tempat dingin.', emoji: '💧' },
      'tapLeaf': { process: 'transpirasi', icon: '🌿', title: 'Transpirasi', desc: 'Tanaman juga mengeluarkan air lewat daun-daunnya. Seperti tanaman sedang berkeringat! Air ini juga naik ke langit.', emoji: '🌳' }
    };

    Object.keys(zones).forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', () => {
          AudioManager.playSFX('pop');
          this._showProcessInfo(zones[id]);
          this._triggerAnimation(zones[id].process);
        });
      }
    });
  },

  _showProcessInfo(info) {
    const overlay = document.getElementById('processModal');
    const icon = document.getElementById('processModalIcon');
    const title = document.getElementById('processModalTitle');
    const desc = document.getElementById('processModalDesc');

    if (overlay && icon && title && desc) {
      icon.textContent = info.icon;
      title.textContent = info.title;
      desc.textContent = info.desc;
      overlay.classList.add('visible');
    }
  },

  _bindSpeedSlider() {
    const slider = document.getElementById('siklusSpeed');
    if (slider) {
      slider.addEventListener('input', (e) => {
        this._speed = parseFloat(e.target.value);
      });
    }
  },

  _triggerAnimation(process) {
    this._activeProcess = process;
    const container = document.getElementById('particlesOverlay');
    if (!container) return;

    // Create particles based on process
    const count = 8;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';

      switch (process) {
        case 'evaporasi':
          p.classList.add('particle-vapor');
          p.style.left = (30 + Math.random() * 40) + '%';
          p.style.bottom = '30%';
          p.style.animation = `evaporate ${1.5 + Math.random()}s ease-out ${i * 0.1}s forwards`;
          break;
        case 'kondensasi':
          p.classList.add('particle-water');
          p.style.left = (20 + Math.random() * 30) + '%';
          p.style.top = '15%';
          p.style.animation = `condense ${1 + Math.random()}s ease-in ${i * 0.08}s forwards`;
          break;
        case 'presipitasi':
          p.classList.add('particle-water');
          p.style.left = (30 + Math.random() * 30) + '%';
          p.style.top = '25%';
          p.style.animation = `rainDrop ${1 + Math.random() * 0.5}s ease-in ${i * 0.12}s forwards`;
          break;
        case 'transpirasi':
          p.classList.add('particle-vapor');
          p.style.left = (10 + Math.random() * 15) + '%';
          p.style.bottom = '25%';
          p.style.animation = `evaporate ${1.2 + Math.random()}s ease-out ${i * 0.1}s forwards`;
          break;
      }

      container.appendChild(p);

      // Remove after animation
      setTimeout(() => p.remove(), 3000);
    }
  },

  _startParticleLoop() {
    // Add CSS for custom particle animations
    if (!document.getElementById('siklusAnimStyles')) {
      const style = document.createElement('style');
      style.id = 'siklusAnimStyles';
      style.textContent = `
        @keyframes evaporate {
          0% { transform: translateY(0) scale(1); opacity: 0.8; }
          100% { transform: translateY(-120px) scale(0.3); opacity: 0; }
        }
        @keyframes condense {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.2); opacity: 0.8; }
          100% { transform: scale(1) translateX(10px); opacity: 0.6; }
        }
      `;
      document.head.appendChild(style);
    }
  },

  destroy() {
    if (this._animFrameId) {
      cancelAnimationFrame(this._animFrameId);
    }
  }
};

window.SiklusCanvas = SiklusCanvas;
