/* ============================================
   SIKLUS AIR — Laboratorium Air Module
   ============================================ */

const LabModule = {
  _sunIntensity: 50,
  _desertWater: 80,
  _arcticWater: 80,
  _interval: null,
  _vaporIntervals: [],

  init() {
    this._sunIntensity = 50;
    this._desertWater = 80;
    this._arcticWater = 80;
    this._bindSlider();
    this._startSimulation();
    this._updateDisplay();
  },

  _bindSlider() {
    const slider = document.getElementById('labSunSlider');
    if (slider) {
      slider.value = 50;
      slider.addEventListener('input', (e) => {
        this._sunIntensity = parseInt(e.target.value);
        this._updateSunVisual();
      });
    }
  },

  _updateSunVisual() {
    const desertSun = document.getElementById('desertSunVisual');
    const arcticSun = document.getElementById('arcticSunVisual');

    const scale = 0.5 + (this._sunIntensity / 100) * 1.5;
    const opacity = 0.2 + (this._sunIntensity / 100) * 0.6;

    if (desertSun) {
      desertSun.style.transform = `scale(${scale})`;
      desertSun.style.opacity = opacity;
    }
    if (arcticSun) {
      arcticSun.style.transform = `scale(${scale * 0.5})`;
      arcticSun.style.opacity = opacity * 0.5;
    }
  },

  _startSimulation() {
    this._stopSimulation();

    this._interval = setInterval(() => {
      // Desert: water evaporates based on sun intensity
      const desertRate = (this._sunIntensity / 100) * 0.8;
      this._desertWater = Math.max(5, this._desertWater - desertRate);

      // Arctic: minimal evaporation
      const arcticRate = (this._sunIntensity / 100) * 0.05;
      this._arcticWater = Math.max(60, this._arcticWater - arcticRate);

      this._updateDisplay();
      this._createVaporParticles();
    }, 200);
  },

  _stopSimulation() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  },

  _updateDisplay() {
    // Water levels
    const desertFill = document.getElementById('desertWaterFill');
    const arcticFill = document.getElementById('arcticWaterFill');

    if (desertFill) desertFill.style.height = this._desertWater + '%';
    if (arcticFill) arcticFill.style.height = this._arcticWater + '%';

    // Temperatures
    const desertTemp = document.getElementById('desertTemp');
    const arcticTemp = document.getElementById('arcticTemp');

    const dt = Math.round(25 + (this._sunIntensity / 100) * 25);
    const at = Math.round(-15 + (this._sunIntensity / 100) * 15);

    if (desertTemp) desertTemp.textContent = `${dt}°C`;
    if (arcticTemp) arcticTemp.textContent = `${at}°C`;

    // Insight text
    this._updateInsight();
  },

  _updateInsight() {
    const insight = document.getElementById('labInsightText');
    if (!insight) return;

    if (this._sunIntensity > 75) {
      insight.textContent = '🔥 Wah, matahari sangat terik! Air di gurun menguap sangat cepat. Tapi di kutub, es tetap tidak mencair banyak karena suhunya masih sangat dingin!';
    } else if (this._sunIntensity > 40) {
      insight.textContent = '☀️ Semakin panas matahari, semakin cepat air menguap. Perhatikan perbedaan antara gurun dan kutub!';
    } else {
      insight.textContent = '🌤️ Matahari masih lemah. Air menguap sangat lambat, bahkan di gurun sekalipun.';
    }
  },

  _createVaporParticles() {
    if (this._sunIntensity < 20) return;

    const desertVapor = document.getElementById('desertVapor');
    if (desertVapor && Math.random() < this._sunIntensity / 100) {
      const p = document.createElement('div');
      p.className = 'lab-vapor-particle';
      p.style.left = (20 + Math.random() * 60) + '%';
      p.style.bottom = (this._desertWater + 5) + '%';
      p.style.animation = `evaporate ${1 + Math.random()}s ease-out forwards`;
      desertVapor.appendChild(p);
      setTimeout(() => p.remove(), 2000);
    }
  },

  reset() {
    this._desertWater = 80;
    this._arcticWater = 80;
    this._sunIntensity = 50;
    const slider = document.getElementById('labSunSlider');
    if (slider) slider.value = 50;
    this._updateDisplay();
    this._updateSunVisual();
  },

  complete() {
    this._stopSimulation();
    Utils.storage.set('progress.lab.completed', true);
    const isNew = BadgeSystem.earn('ilmuwan-cilik');
    if (isNew) BadgeSystem.showBadgeEarned('ilmuwan-cilik');
    App.navigate('home');
  },

  destroy() {
    this._stopSimulation();
  }
};

window.LabModule = LabModule;
