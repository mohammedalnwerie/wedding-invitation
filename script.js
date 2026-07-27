/* ==========================================================================
   Wedding Invitation - Mahmoud & Layan
   Script - Single YouTube Audio Player (No Secondary Background Music)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPetalsCanvas();
  initEnvelope();
  initCountdown();
  initAudioControls();
  initWishesForm();
  initGuestbook();
  initAutoPlayListeners();
});

/* ==========================================================================
   1. Dynamic Floating Petals Canvas
   ========================================================================== */
function initPetalsCanvas() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petalsCount = 35;
  const petals = [];

  const petalColors = [
    'rgba(244, 227, 230, 0.75)',
    'rgba(232, 180, 184, 0.65)',
    'rgba(255, 240, 243, 0.8)',
    'rgba(212, 154, 156, 0.5)'
  ];

  for (let i = 0; i < petalsCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 10 + 8,
      speedY: Math.random() * 1.2 + 0.6,
      speedX: Math.random() * 0.8 - 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: Math.random() * 0.02 - 0.01,
      color: petalColors[Math.floor(Math.random() * petalColors.length)]
    });
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(p.size / 2, -p.size, p.size, -p.size / 3, 0, p.size);
    ctx.bezierCurveTo(-p.size, -p.size / 3, -p.size / 2, -p.size, 0, 0);
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    petals.forEach((p) => {
      p.y += p.speedY;
      p.x += Math.sin(p.y * 0.01) * 0.8 + p.speedX;
      p.rotation += p.rotationSpeed;

      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }
      drawPetal(p);
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. 3D Envelope Opening Interaction
   ========================================================================== */
function initEnvelope() {
  const wrapper = document.getElementById('envelope-wrapper');
  const overlay = document.getElementById('envelope-overlay');
  const mainApp = document.getElementById('main-app');

  if (!wrapper || !overlay) return;

  function openEnvelope() {
    if (wrapper.classList.contains('open')) return;

    wrapper.classList.add('open');
    playMusic();

    setTimeout(() => {
      overlay.classList.add('opened');
      if (mainApp) mainApp.classList.add('visible');
    }, 1100);
  }

  wrapper.addEventListener('click', openEnvelope);
}

/* ==========================================================================
   3. Live Countdown Timer
   ========================================================================== */
function initCountdown() {
  // Wedding Date: July 30, 2026 17:00:00
  const targetDate = new Date(2026, 6, 30, 17, 0, 0).getTime();

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!daysEl) return;

  function updateTimer() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = days < 10 ? '0' + days : days;
    hoursEl.textContent = hours < 10 ? '0' + hours : hours;
    minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
    secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   4. EXCLUSIVE YouTube Audio Player ONLY (Video ID: qsrqBFJ1WN8)
   ========================================================================== */
let ytPlayer = null;
let isYtReady = false;
let isPlaying = false;

// Global YouTube API Ready Callback
window.onYouTubeIframeAPIReady = function () {
  try {
    ytPlayer = new YT.Player('youtube-player', {
      height: '1',
      width: '1',
      videoId: 'qsrqBFJ1WN8',
      playerVars: {
        autoplay: 1,
        controls: 0,
        loop: 1,
        playlist: 'qsrqBFJ1WN8'
      },
      events: {
        onReady: (event) => {
          isYtReady = true;
          try {
            event.target.playVideo();
          } catch (e) {}
        },
        onStateChange: (event) => {
          const btn = document.getElementById('audio-toggle');
          if (event.data === YT.PlayerState.PLAYING) {
            isPlaying = true;
            if (btn) btn.classList.add('playing');
          } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
            isPlaying = false;
            if (btn) btn.classList.remove('playing');
          }
        }
      }
    });
  } catch (e) {
    console.log('YouTube Player initialization error:', e);
  }
};

function initAutoPlayListeners() {
  const triggerAutoPlay = () => {
    if (!isPlaying) {
      playMusic();
    }
    document.removeEventListener('click', triggerAutoPlay);
    document.removeEventListener('touchstart', triggerAutoPlay);
    document.removeEventListener('scroll', triggerAutoPlay);
  };

  document.addEventListener('click', triggerAutoPlay);
  document.addEventListener('touchstart', triggerAutoPlay);
  document.addEventListener('scroll', triggerAutoPlay);
}

function initAudioControls() {
  const btn = document.getElementById('audio-toggle');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  });
}

function playMusic() {
  const btn = document.getElementById('audio-toggle');
  
  if (isYtReady && ytPlayer && typeof ytPlayer.playVideo === 'function') {
    try {
      if (typeof ytPlayer.unMute === 'function') ytPlayer.unMute();
      ytPlayer.playVideo();
      isPlaying = true;
      if (btn) btn.classList.add('playing');
    } catch (err) {
      console.log('YouTube API play error:', err);
    }
  }
}

function pauseMusic() {
  const btn = document.getElementById('audio-toggle');
  
  if (isYtReady && ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
    try {
      ytPlayer.pauseVideo();
    } catch (e) {}
  }
  
  isPlaying = false;
  if (btn) btn.classList.remove('playing');
}

/* ==========================================================================
   5. Optional Wishes Form Handling & Confetti
   ========================================================================== */
function initWishesForm() {
  const form = document.getElementById('wishes-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('guest-name-input').value.trim();
    const messageInput = document.getElementById('guest-msg-input').value.trim();

    const name = nameInput || 'محب ومبارك';
    const message = messageInput || 'ألف مبروك للعروسين محمود وليان، أتمنى لكما حياة مفعمة بالسعادة والهناء! 🌸';

    const newEntry = {
      name: name,
      msg: message,
      date: new Date().toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })
    };

    saveGuestbookEntry(newEntry);
    form.reset();

    // Trigger Confetti
    triggerConfetti();

    showToast('شكراً لك! تم إرسال تهنئتك المعطرة بنجاح ✨');
  });
}

function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e8b4b8', '#c58c85', '#d4af37', '#ffffff']
    });
  }
}

/* ==========================================================================
   6. Guestbook Features (LocalStorage Persistent)
   ========================================================================== */
const defaultGreetings = [
  {
    name: 'عائلة العامودي',
    msg: 'بارَكَ اللَّهُ لَكُما وبَارَك عَلَيْكُما وَجَمَعَ بَيْنَكُمَا فِي خَيْر. ننتظركم بشوق لتكتمل فرحتنا.',
    date: 'منذ قليل'
  },
  {
    name: 'أحمد وزياد',
    msg: 'ألف ألف مبروك لأحلى عريس محمود وللعروس الغالية ليان، بالرفاه والبنين يا رب!',
    date: 'اليوم'
  }
];

function initGuestbook() {
  renderGuestbook();
}

function getStoredEntries() {
  const stored = localStorage.getItem('wedding_guestbook_mahmoud_layan');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return defaultGreetings;
    }
  }
  return defaultGreetings;
}

function saveGuestbookEntry(entry) {
  const entries = getStoredEntries();
  entries.unshift(entry);
  localStorage.setItem('wedding_guestbook_mahmoud_layan', JSON.stringify(entries));
  renderGuestbook();
}

function renderGuestbook() {
  const container = document.getElementById('guestbook-list');
  if (!container) return;

  const entries = getStoredEntries();
  container.innerHTML = entries
    .map(
      (item) => `
    <div class="guestbook-card">
      <div class="guest-name">🌸 ${escapeHtml(item.name)}</div>
      <div class="guest-msg">"${escapeHtml(item.msg)}"</div>
      <div class="guest-time">${item.date}</div>
    </div>
  `
    )
    .join('');
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ==========================================================================
   7. Toast Notification Utility
   ========================================================================== */
function showToast(msg) {
  const toast = document.getElementById('toast-msg');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
