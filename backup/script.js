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

  function openModal(src, from) {
    if (modalError) {
      modalError.hidden = true;
      modalError.textContent = '';
    }
    modalFrom.textContent = from ? 'From: ' + from : '';
    modal.hidden = false;
    modalVideo.src = src;
    modalVideo.currentTime = 0;
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
    if (videoSrc) openModal(videoSrc, from);
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
  });
})();
