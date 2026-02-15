// Tab switching: show the selected panel, hide others, update active button
(function () {
  var nav = document.querySelector('.tab-nav');
  var buttons = document.querySelectorAll('.tab-btn');
  var panels = document.querySelectorAll('.tab-panel');

  if (!nav || !buttons.length || !panels.length) return;

  function switchTab(tabId) {
    buttons.forEach(function (btn) {
      var isActive = btn.getAttribute('data-tab') === tabId;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    panels.forEach(function (panel) {
      var isPanel = panel.id === 'panel-' + tabId;
      panel.classList.toggle('active', isPanel);
      panel.hidden = !isPanel;
    });

    var main = document.querySelector('main.notion-content');
    if (main) main.classList.toggle('moments-visible', tabId === 'moments');

    // Page-specific color theme
    document.body.classList.remove('page-home', 'page-moments', 'page-wishes');
    document.body.classList.add('page-' + tabId);

    // Confetti when opening Home tab (after first load)
    if (tabId === 'home' && window.confetti && window._confettiAlreadyFiredOnLoad) {
      fireConfetti();
    }
  }

  nav.addEventListener('click', function (e) {
    var btn = e.target.closest('.tab-btn');
    if (!btn) return;
    var tabId = btn.getAttribute('data-tab');
    if (tabId) switchTab(tabId);
  });

  // Optional: support hash links e.g. #moments
  function syncFromHash() {
    var hash = window.location.hash.slice(1);
    if (hash === 'moments' || hash === 'wishes' || hash === 'home') switchTab(hash);
  }

  window.addEventListener('hashchange', syncFromHash);
  syncFromHash();
})();

// Birthday wish videos: open modal and play when a card is clicked
(function () {
  var grid = document.getElementById('video-grid');
  var modal = document.getElementById('video-modal');
  var modalVideo = document.getElementById('modal-video');
  var modalFrom = document.getElementById('modal-from');
  var modalError = document.getElementById('modal-video-error');
  var modalClose = document.getElementById('modal-close');
  var modalBackdrop = document.getElementById('modal-backdrop');

  if (!grid || !modal || !modalVideo) return;

  function openModal(src, from, poster) {
    if (modalError) {
      modalError.hidden = true;
      modalError.textContent = '';
    }
    modalFrom.textContent = from ? 'From: ' + from : '';
    modal.hidden = false;
    modalVideo.src = src;
    modalVideo.currentTime = 0;
    if (poster) {
      modalVideo.poster = poster;
    } else {
      modalVideo.removeAttribute('poster');
    }
    modalVideo.load();
    modalVideo.play().catch(function () {});
    document.body.style.overflow = 'hidden';
  }

  modalVideo.addEventListener('error', function () {
    if (modalError) {
      modalError.textContent = 'Video couldn\'t load. If you opened this page from your file manager (file://), run a local server instead. In this folder run: npx serve';
      modalError.hidden = false;
    }
  });

  function closeModal() {
    modal.hidden = true;
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.removeAttribute('poster');
    if (modalError) {
      modalError.hidden = true;
      modalError.textContent = '';
    }
    document.body.style.overflow = '';
  }

  grid.addEventListener('click', function (e) {
    var card = e.target.closest('.wish-card');
    if (!card) return;
    var videoSrc = card.getAttribute('data-video');
    var from = card.getAttribute('data-from') || '';
    var poster = card.getAttribute('data-poster') || '';
    if (videoSrc) openModal(videoSrc, from, poster);
  });

  // Set cover images on wish cards from data-poster
  document.querySelectorAll('.wish-card[data-poster]').forEach(function (card) {
    var posterEl = card.querySelector('.wish-card-poster');
    var posterSrc = card.getAttribute('data-poster');
    if (posterEl && posterSrc) posterEl.src = posterSrc;
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
  });
})();

// Moment videos: wrap in poster container, capture still from video as cover, click to play
(function () {
  var grid = document.getElementById('moments-grid');
  if (!grid) return;

  var videos = grid.querySelectorAll('.moment-vid');
  if (!videos.length) return;

  function capturePoster(video, posterEl) {
    var src = video.currentSrc || video.getAttribute('src');
    if (!src) return;

    var seekTime = 0.5;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    function tryCapture() {
      if (video.readyState < 2) return;
      try {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        if (canvas.width && canvas.height) {
          ctx.drawImage(video, 0, 0);
          posterEl.style.backgroundImage = 'url(' + canvas.toDataURL('image/jpeg', 0.85) + ')';
        }
      } catch (err) {}
    }

    video.addEventListener('seeked', tryCapture, { once: true });
    video.addEventListener('loadeddata', function () {
      if (video.duration > 0 && isFinite(video.duration)) {
        seekTime = Math.min(0.5, video.duration * 0.1);
      }
      video.currentTime = seekTime;
    }, { once: true });

    video.addEventListener('error', function () {
      posterEl.style.backgroundColor = 'var(--notion-hover)';
    }, { once: true });

    video.preload = 'auto';
    video.load();
  }

  function wrapVideo(video) {
    var parent = video.parentNode;
    var next = video.nextSibling;

    var wrap = document.createElement('div');
    wrap.className = 'moment-vid-wrap';

    var poster = document.createElement('div');
    poster.className = 'moment-vid-poster';
    poster.setAttribute('aria-hidden', 'true');

    var playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.className = 'moment-vid-play-btn';
    playBtn.setAttribute('aria-label', 'Play video');
    playBtn.innerHTML = '▶';

    video.removeAttribute('controls');
    video.classList.add('moment-vid');
    wrap.appendChild(poster);
    wrap.appendChild(video);
    wrap.appendChild(playBtn);

    parent.insertBefore(wrap, next);

    function play() {
      wrap.classList.add('is-playing');
      video.controls = true;
      video.play().catch(function () {});
    }

    function pause() {
      wrap.classList.remove('is-playing');
      video.controls = false;
      video.pause();
    }

    video.addEventListener('ended', function () {
      wrap.classList.remove('is-playing');
      video.controls = false;
    });

    wrap.addEventListener('click', function (e) {
      if (e.target === playBtn || e.target === poster || wrap.classList.contains('is-playing') === false) {
        if (!wrap.classList.contains('is-playing')) play();
      }
    });

    capturePoster(video, poster);
  }

  videos.forEach(wrapVideo);
})();

// Photo lightbox: click a moment image to view fullscreen
(function () {
  var grid = document.getElementById('moments-grid');
  var lightbox = document.getElementById('photo-lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxClose = document.getElementById('lightbox-close');
  var lightboxBackdrop = document.getElementById('lightbox-backdrop');

  if (!grid || !lightbox || !lightboxImg) return;

  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.removeAttribute('src');
    document.body.style.overflow = '';
  }

  grid.addEventListener('click', function (e) {
    var img = e.target.closest('.moment-img');
    if (!img || !img.src) return;
    e.preventDefault();
    openLightbox(img.src);
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox();
  });
})();

// Confetti: on first load and when opening Home tab
function fireConfetti() {
  if (typeof confetti !== 'function') return;
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#8f7fa3', '#b87d7d', '#6b8d9e', '#a6926a', '#7a8e7a', '#ffb6c1', '#ffd700']
  });
  setTimeout(function () {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0.2, y: 0.6 },
      colors: ['#8f7fa3', '#b87d7d', '#6b8d9e']
    });
  }, 150);
  setTimeout(function () {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 0.8, y: 0.6 },
      colors: ['#8f7fa3', '#b87d7d', '#6b8d9e']
    });
  }, 300);
}

(function confettiOnLoad() {
  window._confettiAlreadyFiredOnLoad = false;
  function onLoad() {
    if (window._confettiAlreadyFiredOnLoad) return;
    window._confettiAlreadyFiredOnLoad = true;
    setTimeout(fireConfetti, 400);
  }
  if (document.readyState === 'complete') setTimeout(onLoad, 100);
  else window.addEventListener('load', onLoad);
})();

// Age "25" counter: animate when home section is in view
(function () {
  var ageBadge = document.getElementById('age-badge');
  var panelHome = document.getElementById('panel-home');
  if (!ageBadge || !panelHome) return;

  var targetAge = 25;
  var duration = 1200;
  var startTime = null;
  var hasAnimated = false;

  function easeOutQuart(t) {
    return 1 - (1 - t) * (1 - t) * (1 - t) * (1 - t);
  }

  function ordinal(n) {
    if (n === 0) return '0th';
    var s = n % 10;
    var t = (n % 100) - s;
    if (s === 1 && t !== 10) return n + 'st';
    if (s === 2 && t !== 10) return n + 'nd';
    if (s === 3 && t !== 10) return n + 'rd';
    return n + 'th';
  }

  function runCounter(timestamp) {
    if (!startTime) startTime = timestamp;
    var elapsed = timestamp - startTime;
    var progress = Math.min(elapsed / duration, 1);
    var eased = easeOutQuart(progress);
    var value = Math.min(targetAge, Math.floor(eased * (targetAge + 1)));
    ageBadge.textContent = ordinal(value);
    if (progress < 1) requestAnimationFrame(runCounter);
    else ageBadge.textContent = '25th';
  }

  function startCounter() {
    if (hasAnimated) return;
    hasAnimated = true;
    ageBadge.classList.add('visible');
    startTime = null;
    requestAnimationFrame(runCounter);
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) startCounter();
      });
    },
    { threshold: 0.3, rootMargin: '0px' }
  );
  observer.observe(panelHome);
})();

// Konami code: ↑↑↓↓←→←→BA
(function () {
  var code = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  var index = 0;
  var messageEl = document.getElementById('konami-message');

  document.addEventListener('keydown', function (e) {
    if (e.keyCode === code[index]) {
      index++;
      if (index === code.length) {
        index = 0;
        if (messageEl) {
          messageEl.hidden = false;
          messageEl.classList.add('visible');
          if (typeof confetti === 'function') fireConfetti();
          setTimeout(function () {
            messageEl.classList.remove('visible');
            setTimeout(function () {
              messageEl.hidden = true;
            }, 400);
          }, 4000);
        }
      }
    } else {
      index = 0;
    }
  });
})();
