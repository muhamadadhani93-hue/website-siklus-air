/* ============================================
   SIKLUS AIR — SPA Router & App Controller
   ============================================ */

const App = {
  _currentPage: null,
  _pages: ['home', 'belajar', 'lab', 'quiz', 'glosarium'],

  init() {
    // Initialize systems
    AudioManager.init();

    // Splash screen
    SplashScreen.init();

    // Audio toggle
    const audioBtn = document.getElementById('audioToggle');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => AudioManager.toggle());
    }

    // Badge modal close
    const badgeClose = document.getElementById('badgeModalClose');
    if (badgeClose) {
      badgeClose.addEventListener('click', () => {
        document.getElementById('badgeModal').classList.remove('visible');
      });
    }

    // Process modal close
    const processClose = document.getElementById('processModalClose');
    if (processClose) {
      processClose.addEventListener('click', () => {
        document.getElementById('processModal').classList.remove('visible');
      });
    }

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('visible');
      });
    });

    // Nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const page = item.dataset.page;
        if (page) {
          AudioManager.playSFX('pop');
          this.navigate(page);
        }
      });
    });

    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1) || 'home';
      this._showPage(hash);
    });
  },

  navigate(page) {
    window.location.hash = page;
  },

  _showPage(pageId) {
    // Parse sub-routes like belajar/2
    let mainPage = pageId.split('/')[0];
    const subRoute = pageId.split('/')[1];

    if (!this._pages.includes(mainPage)) mainPage = 'home';

    // Hide current page
    document.querySelectorAll('.page').forEach(p => {
      p.classList.remove('active');
    });

    // Show target page
    const targetEl = document.getElementById(`page-${mainPage}`);
    if (targetEl) {
      targetEl.classList.add('active');
    }

    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === mainPage);
    });

    // Show/hide bottom nav (hidden on splash)
    const nav = document.getElementById('bottomNav');
    if (nav) {
      nav.classList.remove('hidden');
    }

    // Page-specific init
    this._initPage(mainPage, subRoute);
    this._currentPage = mainPage;
  },

  _initPage(pageId, subRoute) {
    switch (pageId) {
      case 'home':
        BadgeSystem.renderHomeBadges();
        // Animate menu items
        const menu = document.querySelector('.home-menu');
        if (menu) Utils.animate.staggerChildren(menu, 100);
        break;

      case 'belajar':
        BelajarModule.init();
        BelajarModule.show(subRoute ? parseInt(subRoute) : 1);
        break;

      case 'lab':
        LabModule.init();
        break;

      case 'quiz':
        QuizModule.init();
        break;

      case 'glosarium':
        GlosariumModule.init();
        break;
    }
  }
};

// Boot on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

window.App = App;
