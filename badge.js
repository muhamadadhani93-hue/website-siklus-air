/* ============================================
   SIKLUS AIR — Badge / Achievement System
   ============================================ */

const BadgeSystem = {
  _badges: [
    { id: 'kenalan-air', name: 'Pengenal Air', icon: '💧', desc: 'Selesai Step 1: Kenalan dengan Air' },
    { id: 'ahli-siklus', name: 'Ahli Siklus', icon: '🔄', desc: 'Selesai Step 2: Panggung Siklus' },
    { id: 'sahabat-tetes', name: 'Sahabat Tetes', icon: '📖', desc: 'Selesai Step 3: Cerita Si Tetes Air' },
    { id: 'ilmuwan-cilik', name: 'Ilmuwan Cilik', icon: '🔬', desc: 'Selesai Laboratorium Air' },
    { id: 'juara-quiz', name: 'Juara Quiz', icon: '🏆', desc: 'Skor quiz di atas 80%' }
  ],

  getAll() {
    return this._badges.map(b => ({
      ...b,
      earned: this.hasEarned(b.id)
    }));
  },

  hasEarned(badgeId) {
    const earned = Utils.storage.get('badges') || [];
    return earned.includes(badgeId);
  },

  earn(badgeId) {
    if (this.hasEarned(badgeId)) return false;
    const earned = Utils.storage.get('badges') || [];
    earned.push(badgeId);
    Utils.storage.set('badges', earned);
    return true;
  },

  getEarnedCount() {
    return (Utils.storage.get('badges') || []).length;
  },

  getTotalCount() {
    return this._badges.length;
  },

  // Show badge popup
  showBadgeEarned(badgeId) {
    const badge = this._badges.find(b => b.id === badgeId);
    if (!badge) return;

    AudioManager.playSFX('achievement');
    Utils.confetti();

    const overlay = document.getElementById('badgeModal');
    const icon = document.getElementById('badgeModalIcon');
    const title = document.getElementById('badgeModalTitle');
    const desc = document.getElementById('badgeModalDesc');

    if (overlay && icon && title && desc) {
      icon.textContent = badge.icon;
      title.textContent = badge.name;
      desc.textContent = badge.desc;
      overlay.classList.add('visible');
    }
  },

  // Render badges in home page
  renderHomeBadges() {
    const container = document.getElementById('homeBadges');
    if (!container) return;

    container.innerHTML = '';
    this.getAll().forEach(badge => {
      const card = document.createElement('div');
      card.className = `badge-card ${badge.earned ? 'earned' : 'locked'}`;
      card.innerHTML = `
        <span class="badge-stamp">${badge.icon}</span>
        <span class="badge-name">${badge.name}</span>
      `;
      container.appendChild(card);
    });
  }
};

window.BadgeSystem = BadgeSystem;
