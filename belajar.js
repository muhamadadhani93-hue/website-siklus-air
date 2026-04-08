/* ============================================
   SIKLUS AIR — Belajar Module
   ============================================ */

const BelajarModule = {
  currentStep: 1,
  totalSteps: 3,

  init() {
    this._bindNavButtons();
  },

  show(step = 1) {
    this.currentStep = step;
    this._hideAllSteps();
    this._showStep(step);
    this._updateProgress();
  },

  _hideAllSteps() {
    document.querySelectorAll('.belajar-step').forEach(s => {
      s.style.display = 'none';
    });
  },

  _showStep(step) {
    const el = document.getElementById(`belajarStep${step}`);
    if (el) {
      el.style.display = 'block';
      el.style.opacity = '0';
      el.style.transform = 'translateX(20px)';
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateX(0)';
      });

      // Step-specific initializations
      if (step === 1) this._initStep1();
      if (step === 2) this._initStep2();
      if (step === 3) this._initStep3();
    }
  },

  _updateProgress() {
    for (let i = 1; i <= this.totalSteps; i++) {
      const dot = document.getElementById(`progressDot${i}`);
      const line = document.getElementById(`progressLine${i}`);
      if (dot) {
        dot.classList.remove('completed', 'active', 'locked');
        if (i < this.currentStep) {
          dot.classList.add('completed');
          dot.innerHTML = '✓';
        } else if (i === this.currentStep) {
          dot.classList.add('active');
          dot.innerHTML = i;
        } else {
          dot.classList.add('locked');
          dot.innerHTML = i;
        }
      }
      if (line) {
        line.classList.remove('completed', 'active');
        if (i < this.currentStep) line.classList.add('completed');
        else if (i === this.currentStep) line.classList.add('active');
      }
    }
  },

  nextStep() {
    // Mark current step as done
    Utils.storage.set(`progress.belajar.step${this.currentStep}`, true);

    // Award badge
    if (this.currentStep === 1) BadgeSystem.earn('kenalan-air') && BadgeSystem.showBadgeEarned('kenalan-air');
    if (this.currentStep === 2) BadgeSystem.earn('ahli-siklus') && BadgeSystem.showBadgeEarned('ahli-siklus');
    if (this.currentStep === 3) {
      BadgeSystem.earn('sahabat-tetes') && BadgeSystem.showBadgeEarned('sahabat-tetes');
      // Return to home after last step
      setTimeout(() => App.navigate('home'), 500);
      return;
    }

    AudioManager.playSFX('correct');
    this.show(this.currentStep + 1);
  },

  prevStep() {
    if (this.currentStep > 1) {
      this.show(this.currentStep - 1);
    } else {
      App.navigate('home');
    }
  },

  _bindNavButtons() {
    // Buttons bound via onclick in HTML
  },

  // --- Step 1: Kenalan dengan Air ---
  _initStep1() {
    // Animate water tubes
    setTimeout(() => {
      document.querySelectorAll('.tube-fill').forEach(el => {
        el.classList.add('animate');
      });
    }, 500);
  },

  // --- Step 2: Panggung Siklus ---
  _initStep2() {
    SiklusCanvas.init();
  },

  // --- Step 3: Cerita Si Tetes Air ---
  _storyPlaying: false,
  _storyInterval: null,

  _initStep3() {
    this._storyPlaying = false;
  },

  toggleStory() {
    if (this._storyPlaying) {
      this._stopStory();
    } else {
      this._playStory();
    }
  },

  _playStory() {
    this._storyPlaying = true;
    const btn = document.getElementById('storyPlayBtn');
    if (btn) btn.textContent = '⏸️';

    const highlights = document.querySelectorAll('#belajarStep3 .highlight');
    let index = 0;

    // Clear previous
    highlights.forEach(h => h.classList.remove('active-read'));

    const readNext = () => {
      if (index >= highlights.length || !this._storyPlaying) {
        this._stopStory();
        return;
      }

      // Remove previous highlight
      if (index > 0) highlights[index - 1].classList.remove('active-read');

      // Highlight current
      highlights[index].classList.add('active-read');

      // Speak the text
      AudioManager.speak(highlights[index].textContent);

      index++;
      this._storyInterval = setTimeout(readNext, 2500);
    };

    readNext();
  },

  _stopStory() {
    this._storyPlaying = false;
    clearTimeout(this._storyInterval);
    const btn = document.getElementById('storyPlayBtn');
    if (btn) btn.textContent = '▶️';

    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    document.querySelectorAll('#belajarStep3 .highlight').forEach(h => {
      h.classList.remove('active-read');
    });
  }
};

window.BelajarModule = BelajarModule;
