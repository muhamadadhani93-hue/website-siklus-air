/* ============================================
   SIKLUS AIR — Splash Screen
   ============================================ */

const SplashScreen = {
  init() {
    const splash = document.getElementById('splashScreen');
    const loadingBar = document.getElementById('splashLoadingBar');
    const startBtn = document.getElementById('splashStartBtn');

    if (!splash || !loadingBar || !startBtn) return;

    // Animate loading bar
    setTimeout(() => {
      loadingBar.classList.add('animate');
    }, 300);

    // Show start button after loading
    setTimeout(() => {
      startBtn.classList.add('visible');
    }, 2500);

    // Start button click
    startBtn.addEventListener('click', () => {
      AudioManager.playSFX('water');
      splash.classList.add('hidden');
      // Navigate to home after splash fades
      setTimeout(() => {
        App.navigate('home');
      }, 400);
    });
  }
};

window.SplashScreen = SplashScreen;
