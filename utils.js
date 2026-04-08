/* ============================================
   SIKLUS AIR — Utility Helpers
   ============================================ */

const Utils = {
  // --- localStorage wrapper ---
  storage: {
    _key: 'waterCycleApp',

    _getData() {
      try {
        const raw = localStorage.getItem(this._key);
        return raw ? JSON.parse(raw) : this._defaults();
      } catch {
        return this._defaults();
      }
    },

    _defaults() {
      return {
        progress: {
          belajar: { step1: false, step2: false, step3: false },
          lab: { completed: false },
          quiz: { bestScore: 0, attempts: 0 }
        },
        badges: [],
        settings: { audioEnabled: true, bgmVolume: 0.5 }
      };
    },

    save(data) {
      localStorage.setItem(this._key, JSON.stringify(data));
    },

    get(path) {
      const data = this._getData();
      return path.split('.').reduce((obj, key) => obj?.[key], data);
    },

    set(path, value) {
      const data = this._getData();
      const keys = path.split('.');
      let current = data;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      this.save(data);
    },

    getAll() {
      return this._getData();
    }
  },

  // --- Animation helpers ---
  animate: {
    fadeIn(el, duration = 500, delay = 0) {
      el.style.opacity = '0';
      el.style.transition = `opacity ${duration}ms var(--ease-out) ${delay}ms`;
      requestAnimationFrame(() => { el.style.opacity = '1'; });
    },

    fadeInUp(el, duration = 500, delay = 0) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity ${duration}ms var(--ease-out) ${delay}ms, transform ${duration}ms var(--ease-out) ${delay}ms`;
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    },

    staggerChildren(parent, delay = 80) {
      const children = parent.children;
      Array.from(children).forEach((child, i) => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(15px)';
        child.style.transition = `opacity 400ms var(--ease-out) ${i * delay}ms, transform 400ms var(--ease-out) ${i * delay}ms`;
        requestAnimationFrame(() => {
          child.style.opacity = '1';
          child.style.transform = 'translateY(0)';
        });
      });
    }
  },

  // --- Confetti ---
  confetti(container, count = 40) {
    const colors = ['#FFD93D', '#FF6B6B', '#5DADE2', '#4CAF50', '#FF8A65', '#BA68C8', '#1E90FF'];
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    (container || document.body).appendChild(confettiContainer);

    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
      piece.style.animationDelay = (Math.random() * 0.5) + 's';
      piece.style.width = (6 + Math.random() * 8) + 'px';
      piece.style.height = (6 + Math.random() * 8) + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      confettiContainer.appendChild(piece);
    }

    setTimeout(() => confettiContainer.remove(), 3500);
  },

  // --- Delay promise ---
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // --- DOM helpers ---
  $(selector) {
    return document.querySelector(selector);
  },

  $$(selector) {
    return document.querySelectorAll(selector);
  },

  // --- Create element ---
  createElement(tag, className, innerHTML) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (innerHTML) el.innerHTML = innerHTML;
    return el;
  }
};

// Make globally available
window.Utils = Utils;
