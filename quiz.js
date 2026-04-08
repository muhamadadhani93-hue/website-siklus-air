/* ============================================
   SIKLUS AIR — Quiz Module (Drag & Drop)
   ============================================ */

const QuizModule = {
  _questions: [
    {
      question: 'Urutkan proses siklus air yang benar!',
      emoji: '🔄',
      items: [
        { id: 'evaporasi', icon: '☀️', label: 'Evaporasi' },
        { id: 'kondensasi', icon: '☁️', label: 'Kondensasi' },
        { id: 'presipitasi', icon: '🌧️', label: 'Presipitasi' },
        { id: 'aliran', icon: '🏞️', label: 'Mengalir' }
      ],
      correctOrder: ['evaporasi', 'kondensasi', 'presipitasi', 'aliran'],
      hint: 'Ingat, semuanya dimulai dari matahari yang memanaskan air...'
    },
    {
      question: 'Urutkan perjalanan tetes air dari laut ke awan!',
      emoji: '💧',
      items: [
        { id: 'laut', icon: '🌊', label: 'Air Laut' },
        { id: 'panas', icon: '☀️', label: 'Dipanaskan' },
        { id: 'uap', icon: '♨️', label: 'Menjadi Uap' },
        { id: 'awan', icon: '☁️', label: 'Jadi Awan' }
      ],
      correctOrder: ['laut', 'panas', 'uap', 'awan'],
      hint: 'Mulai dari laut, apa yang terjadi saat matahari menyinari air laut?'
    },
    {
      question: 'Apa yang terjadi setelah hujan turun?',
      emoji: '🌧️',
      items: [
        { id: 'hujan', icon: '🌧️', label: 'Hujan Turun' },
        { id: 'meresap', icon: '🌍', label: 'Meresap Tanah' },
        { id: 'sungai', icon: '🏞️', label: 'Ke Sungai' },
        { id: 'laut2', icon: '🌊', label: 'Ke Laut' }
      ],
      correctOrder: ['hujan', 'meresap', 'sungai', 'laut2'],
      hint: 'Air hujan bisa meresap ke dalam tanah atau mengalir ke sungai...'
    },
    {
      question: 'Bagaimana tanaman berperan dalam siklus air?',
      emoji: '🌳',
      items: [
        { id: 'akar', icon: '🌱', label: 'Akar Serap Air' },
        { id: 'naik', icon: '⬆️', label: 'Air Naik' },
        { id: 'daun', icon: '🍃', label: 'Keluar Lewat Daun' },
        { id: 'uap2', icon: '♨️', label: 'Jadi Uap' }
      ],
      correctOrder: ['akar', 'naik', 'daun', 'uap2'],
      hint: 'Tanaman menyerap air melalui akar. Proses ini disebut transpirasi!'
    },
    {
      question: 'Urutkan proses terbentuknya salju!',
      emoji: '❄️',
      items: [
        { id: 'uap3', icon: '♨️', label: 'Uap Air' },
        { id: 'naik2', icon: '⬆️', label: 'Naik Tinggi' },
        { id: 'dingin', icon: '🥶', label: 'Sangat Dingin' },
        { id: 'salju', icon: '❄️', label: 'Jadi Salju' }
      ],
      correctOrder: ['uap3', 'naik2', 'dingin', 'salju'],
      hint: 'Saat uap air naik sangat tinggi, suhu menjadi sangat dingin...'
    }
  ],

  _currentQ: 0,
  _score: 0,
  _attempts: 0,
  _wrongCount: 0,
  _slots: [],
  _draggedItem: null,
  _touchData: null,

  init() {
    this._currentQ = 0;
    this._score = 0;
    this._wrongCount = 0;
    this._renderQuestion();
  },

  _renderQuestion() {
    const q = this._questions[this._currentQ];
    if (!q) {
      this._showResults();
      return;
    }

    this._wrongCount = 0;
    this._slots = new Array(q.items.length).fill(null);

    // Update progress
    const progressText = document.getElementById('quizProgressText');
    const progressFill = document.getElementById('quizProgressFill');
    if (progressText) progressText.textContent = `Soal ${this._currentQ + 1}/${this._questions.length}`;
    if (progressFill) progressFill.style.width = `${((this._currentQ) / this._questions.length) * 100}%`;

    // Question text
    const questionEl = document.getElementById('quizQuestion');
    if (questionEl) {
      questionEl.innerHTML = `<span class="quiz-question-emoji">${q.emoji}</span>${q.question}`;
    }

    // Render draggable items (shuffled)
    const sourceArea = document.getElementById('dragSourceArea');
    if (sourceArea) {
      sourceArea.innerHTML = '';
      const shuffled = [...q.items].sort(() => Math.random() - 0.5);
      shuffled.forEach(item => {
        const el = this._createDragItem(item);
        sourceArea.appendChild(el);
      });
    }

    // Render drop slots
    const dropArea = document.getElementById('dropTargetArea');
    if (dropArea) {
      dropArea.innerHTML = '';
      q.items.forEach((_, i) => {
        const slot = document.createElement('div');
        slot.className = 'drop-slot';
        slot.dataset.index = i;
        slot.innerHTML = `
          <span class="slot-number">${i + 1}</span>
          <span class="slot-placeholder">Taruh di sini</span>
        `;
        this._bindDropSlot(slot);
        dropArea.appendChild(slot);
      });
    }

    // Hide hint & result
    const hint = document.getElementById('quizHint');
    if (hint) hint.classList.add('hidden');

    const resultSection = document.getElementById('quizResult');
    if (resultSection) resultSection.style.display = 'none';

    const questionSection = document.getElementById('quizQuestionSection');
    if (questionSection) questionSection.style.display = 'block';
  },

  _createDragItem(item) {
    const el = document.createElement('div');
    el.className = 'drag-item';
    el.dataset.id = item.id;
    el.draggable = true;
    el.innerHTML = `
      <span class="drag-icon">${item.icon}</span>
      <span class="drag-label">${item.label}</span>
    `;

    // Desktop drag events
    el.addEventListener('dragstart', (e) => {
      this._draggedItem = item;
      el.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', item.id);
    });

    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
      this._draggedItem = null;
    });

    // Touch events for mobile
    el.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this._draggedItem = item;
      el.classList.add('dragging');

      const touch = e.touches[0];
      this._touchData = {
        element: el,
        startX: touch.clientX,
        startY: touch.clientY,
        offsetX: 0,
        offsetY: 0,
        clone: null
      };

      // Create floating clone
      const clone = el.cloneNode(true);
      clone.style.position = 'fixed';
      clone.style.zIndex = '9999';
      clone.style.pointerEvents = 'none';
      clone.style.width = el.offsetWidth + 'px';
      clone.style.opacity = '0.85';
      clone.style.transform = 'scale(1.1) rotate(3deg)';
      clone.style.left = (touch.clientX - el.offsetWidth / 2) + 'px';
      clone.style.top = (touch.clientY - el.offsetHeight / 2) + 'px';
      document.body.appendChild(clone);
      this._touchData.clone = clone;

      el.style.opacity = '0.3';
    }, { passive: false });

    el.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!this._touchData || !this._touchData.clone) return;

      const touch = e.touches[0];
      this._touchData.clone.style.left = (touch.clientX - el.offsetWidth / 2) + 'px';
      this._touchData.clone.style.top = (touch.clientY - el.offsetHeight / 2) + 'px';

      // Highlight drop slots
      document.querySelectorAll('.drop-slot').forEach(slot => {
        const rect = slot.getBoundingClientRect();
        if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
            touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
          slot.classList.add('drag-over');
        } else {
          slot.classList.remove('drag-over');
        }
      });
    }, { passive: false });

    el.addEventListener('touchend', (e) => {
      if (!this._touchData) return;

      const touch = e.changedTouches[0];
      el.classList.remove('dragging');
      el.style.opacity = '1';

      if (this._touchData.clone) {
        this._touchData.clone.remove();
      }

      // Find which slot was dropped on
      document.querySelectorAll('.drop-slot').forEach(slot => {
        slot.classList.remove('drag-over');
        const rect = slot.getBoundingClientRect();
        if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
            touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
          this._dropOnSlot(slot, this._draggedItem, el);
        }
      });

      this._touchData = null;
      this._draggedItem = null;
    });

    return el;
  },

  _bindDropSlot(slot) {
    slot.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      slot.classList.add('drag-over');
    });

    slot.addEventListener('dragleave', () => {
      slot.classList.remove('drag-over');
    });

    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      slot.classList.remove('drag-over');

      if (this._draggedItem) {
        const sourceEl = document.querySelector(`.drag-item[data-id="${this._draggedItem.id}"]`);
        this._dropOnSlot(slot, this._draggedItem, sourceEl);
      }
    });
  },

  _dropOnSlot(slot, item, sourceEl) {
    const index = parseInt(slot.dataset.index);

    // Remove item from source area or previous slot
    if (sourceEl) sourceEl.remove();

    // If slot already has an item, move it back to source
    if (this._slots[index]) {
      const prevItem = this._slots[index];
      const sourceArea = document.getElementById('dragSourceArea');
      if (sourceArea) {
        sourceArea.appendChild(this._createDragItem(prevItem));
      }
    }

    // Place item in slot
    this._slots[index] = item;
    slot.classList.add('filled');
    slot.innerHTML = `
      <span class="slot-number">${index + 1}</span>
      <div class="drag-item" data-id="${item.id}">
        <span class="drag-icon">${item.icon}</span>
        <span class="drag-label">${item.label}</span>
      </div>
    `;

    // Make the item in slot draggable again (to reorder)
    const slotItem = slot.querySelector('.drag-item');
    if (slotItem) {
      slotItem.addEventListener('click', () => {
        // Click to remove from slot and return to source
        this._slots[index] = null;
        slot.classList.remove('filled', 'correct', 'incorrect');
        slot.innerHTML = `
          <span class="slot-number">${index + 1}</span>
          <span class="slot-placeholder">Taruh di sini</span>
        `;
        this._bindDropSlot(slot);

        const sourceArea = document.getElementById('dragSourceArea');
        if (sourceArea) {
          sourceArea.appendChild(this._createDragItem(item));
        }
      });
    }

    AudioManager.playSFX('drop');
  },

  checkAnswer() {
    const q = this._questions[this._currentQ];

    // Check if all slots are filled
    if (this._slots.some(s => s === null)) {
      // Shake empty slots
      document.querySelectorAll('.drop-slot:not(.filled)').forEach(slot => {
        slot.style.animation = 'wiggle 0.4s ease';
        setTimeout(() => slot.style.animation = '', 500);
      });
      return;
    }

    const userOrder = this._slots.map(s => s.id);
    const isCorrect = userOrder.every((id, i) => id === q.correctOrder[i]);

    // Animate slots
    document.querySelectorAll('.drop-slot').forEach((slot, i) => {
      const itemId = this._slots[i]?.id;
      if (itemId === q.correctOrder[i]) {
        slot.classList.add('correct');
        slot.classList.remove('incorrect');
      } else {
        slot.classList.add('incorrect');
        slot.classList.remove('correct');
      }
    });

    if (isCorrect) {
      AudioManager.playSFX('correct');
      this._score++;

      setTimeout(() => {
        this._currentQ++;
        this._renderQuestion();
      }, 1200);
    } else {
      AudioManager.playSFX('wrong');
      this._wrongCount++;

      // Show hint after 2 wrong attempts
      if (this._wrongCount >= 2) {
        const hint = document.getElementById('quizHint');
        const hintText = document.getElementById('quizHintText');
        if (hint && hintText) {
          hintText.textContent = q.hint;
          hint.classList.remove('hidden');
        }
      }

      // Reset incorrect slots after a moment
      setTimeout(() => {
        document.querySelectorAll('.drop-slot.incorrect').forEach(slot => {
          slot.classList.remove('incorrect');
        });
      }, 800);
    }
  },

  _showResults() {
    const questionSection = document.getElementById('quizQuestionSection');
    const resultSection = document.getElementById('quizResult');
    if (questionSection) questionSection.style.display = 'none';
    if (resultSection) {
      resultSection.style.display = 'block';

      const total = this._questions.length;
      const pct = Math.round((this._score / total) * 100);

      // Icon
      const icon = document.getElementById('quizResultIcon');
      if (icon) icon.textContent = pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪';

      // Title
      const title = document.getElementById('quizResultTitle');
      if (title) title.textContent = pct >= 80 ? 'Luar Biasa!' : pct >= 50 ? 'Bagus!' : 'Terus Berlatih!';

      // Score
      const scoreEl = document.getElementById('quizResultScore');
      if (scoreEl) scoreEl.textContent = `${this._score} / ${total} Benar (${pct}%)`;

      // Message
      const msg = document.getElementById('quizResultMsg');
      if (msg) {
        if (pct >= 80) msg.textContent = 'Kamu sudah sangat memahami siklus air! Hebat sekali! 🎉';
        else if (pct >= 50) msg.textContent = 'Bagus! Coba pelajari lagi materinya dan ulangi quiz untuk skor lebih tinggi!';
        else msg.textContent = 'Jangan menyerah! Buka "Belajar Yuk!" dulu, lalu coba lagi quiz-nya!';
      }

      // Stars
      const starCount = pct >= 80 ? 5 : pct >= 60 ? 4 : pct >= 40 ? 3 : pct >= 20 ? 2 : 1;
      const starsContainer = document.getElementById('quizStars');
      if (starsContainer) {
        starsContainer.innerHTML = '';
        for (let i = 0; i < 5; i++) {
          const star = document.createElement('span');
          star.className = `score-star ${i < starCount ? 'active' : ''}`;
          star.textContent = i < starCount ? '⭐' : '☆';
          starsContainer.appendChild(star);
        }
      }

      // Save progress
      const prev = Utils.storage.get('progress.quiz.bestScore') || 0;
      if (pct > prev) Utils.storage.set('progress.quiz.bestScore', pct);
      Utils.storage.set('progress.quiz.attempts', (Utils.storage.get('progress.quiz.attempts') || 0) + 1);

      // Badge
      if (pct >= 80) {
        const isNew = BadgeSystem.earn('juara-quiz');
        if (isNew) setTimeout(() => BadgeSystem.showBadgeEarned('juara-quiz'), 1000);
      }

      // Confetti for high score
      if (pct >= 80) {
        setTimeout(() => Utils.confetti(), 400);
      }
    }
  },

  restart() {
    this._currentQ = 0;
    this._score = 0;
    this._wrongCount = 0;
    this._renderQuestion();
  }
};

window.QuizModule = QuizModule;
