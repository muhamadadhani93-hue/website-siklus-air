/* ============================================
   SIKLUS AIR — Glosarium (Kamus Bergambar)
   ============================================ */

const GlosariumModule = {
  _terms: [
    {
      icon: '☀️',
      name: 'Evaporasi',
      pronunciation: 'e-va-po-ra-si',
      definition: 'Air berubah jadi uap karena kepanasan matahari. Seperti kalau kamu jemur baju basah, lama-lama kering karena airnya menguap!',
      speak: 'Evaporasi adalah proses air berubah menjadi uap karena panas matahari.'
    },
    {
      icon: '🌿',
      name: 'Transpirasi',
      pronunciation: 'trans-pi-ra-si',
      definition: 'Tanaman mengeluarkan air lewat daun-daunnya. Mirip seperti tanaman sedang berkeringat! Air ini juga naik ke langit.',
      speak: 'Transpirasi adalah proses penguapan air melalui daun tanaman.'
    },
    {
      icon: '☁️',
      name: 'Kondensasi',
      pronunciation: 'kon-den-sa-si',
      definition: 'Uap air yang naik ke langit jadi kedinginan, lalu berubah jadi titik-titik air kecil yang membentuk awan. Seperti embun di gelas es!',
      speak: 'Kondensasi adalah proses uap air berubah menjadi titik-titik air.'
    },
    {
      icon: '🌧️',
      name: 'Presipitasi',
      pronunciation: 'pre-si-pi-ta-si',
      definition: 'Tetes air di awan sudah terlalu banyak dan berat, akhirnya jatuh ke bumi. Bisa jadi hujan, salju, atau hujan es!',
      speak: 'Presipitasi adalah turunnya air dari awan ke bumi dalam bentuk hujan, salju, atau hujan es.'
    },
    {
      icon: '🌍',
      name: 'Infiltrasi',
      pronunciation: 'in-fil-tra-si',
      definition: 'Air hujan yang meresap masuk ke dalam tanah. Air ini bisa jadi air tanah yang diminum lewat sumur!',
      speak: 'Infiltrasi adalah proses air meresap ke dalam tanah.'
    },
    {
      icon: '🏞️',
      name: 'Run Off',
      pronunciation: 'ran of',
      definition: 'Air hujan yang tidak meresap ke tanah, melainkan mengalir di permukaan. Air ini mengalir ke sungai, danau, dan akhirnya ke laut!',
      speak: 'Run off adalah aliran air di permukaan tanah menuju sungai dan laut.'
    },
    {
      icon: '💧',
      name: 'Siklus Air',
      pronunciation: 'sik-lus a-ir',
      definition: 'Perjalanan air yang berputar terus-menerus: dari laut ke langit (menguap), jadi awan, turun jadi hujan, mengalir ke sungai, dan kembali ke laut!',
      speak: 'Siklus air adalah perputaran air secara terus-menerus dari bumi ke atmosfer dan kembali ke bumi.'
    },
    {
      icon: '🌡️',
      name: 'Sublimasi',
      pronunciation: 'sub-li-ma-si',
      definition: 'Es atau salju langsung berubah jadi uap tanpa meleleh dulu. Seperti es batu di freezer yang lama-lama mengecil!',
      speak: 'Sublimasi adalah perubahan es langsung menjadi uap air tanpa meleleh terlebih dahulu.'
    }
  ],

  init() {
    this._renderList();
    this._bindSearch();
  },

  _renderList(filter = '') {
    const list = document.getElementById('glosariumList');
    if (!list) return;

    const filtered = this._terms.filter(t =>
      t.name.toLowerCase().includes(filter.toLowerCase()) ||
      t.definition.toLowerCase().includes(filter.toLowerCase())
    );

    if (filtered.length === 0) {
      list.innerHTML = `
        <div class="glosarium-empty">
          <span class="empty-emoji">🔍</span>
          <p>Tidak ada istilah yang cocok dengan "<strong>${filter}</strong>"</p>
        </div>
      `;
      return;
    }

    list.innerHTML = '';
    filtered.forEach((term, i) => {
      const item = document.createElement('div');
      item.className = 'glosarium-item';
      item.style.animationDelay = `${i * 0.08}s`;
      item.innerHTML = `
        <div class="term-icon">${term.icon}</div>
        <div class="term-content">
          <div class="term-name">${term.name}</div>
          <div class="term-pronunciation">[${term.pronunciation}]</div>
          <div class="term-definition">${term.definition}</div>
        </div>
        <button class="btn-audio term-audio-btn" onclick="GlosariumModule.speakTerm('${term.name}')" aria-label="Dengarkan ${term.name}">
          🔊
        </button>
      `;
      list.appendChild(item);
    });
  },

  _bindSearch() {
    const input = document.getElementById('glosariumSearch');
    if (input) {
      input.addEventListener('input', (e) => {
        this._renderList(e.target.value);
      });
    }
  },

  speakTerm(name) {
    const term = this._terms.find(t => t.name === name);
    if (term) {
      AudioManager.playSFX('pop');
      AudioManager.speak(term.speak || `${term.name}. ${term.definition}`);
    }
  }
};

window.GlosariumModule = GlosariumModule;
