/* ============================================================
   OWASP Agentic Skills Top 10 — Slide Deck Navigation Engine
   ============================================================ */
(function () {
  let slides = [];
  let total = 0;
  let prevBtn, nextBtn, count, dotsWrap, progress, title, fsBtn;
  let dots = [];
  let cur = 0;

  function clamp(i) {
    return Math.max(0, Math.min(total - 1, i));
  }

  function go(i) {
    if (total === 0) return;
    i = clamp(i);
    slides.forEach((s, idx) => {
      s.classList.toggle('is-active', idx === i);
      s.classList.toggle('is-prev', idx < i);
    });
    dots.forEach((d, idx) => d.classList.toggle('is-on', idx === i));
    cur = i;
    if (count) count.textContent = `${i + 1} / ${total}`;
    
    // Dynamic Slide Title
    if (title && slides[i]) {
      const customTitle = (window.AST_I18N && window.AST_I18N.t(slides[i].dataset.i18nTitle)) || slides[i].dataset.title || '';
      title.textContent = customTitle;
    }
    
    if (progress) {
      progress.style.width = ((i) / Math.max(1, total - 1) * 100) + '%';
    }
    if (prevBtn) prevBtn.disabled = i === 0;
    if (nextBtn) nextBtn.disabled = i === total - 1;
    
    if (history.replaceState) {
      history.replaceState(null, '', '#' + (i + 1));
    }
    
    // Render hand-drawn diagram for active slide
    if (window.AST_DIAGRAMS && typeof window.AST_DIAGRAMS.renderSlide === 'function') {
      window.AST_DIAGRAMS.renderSlide(slides[i]);
    }
  }

  function next() {
    go(cur + 1);
  }

  function prev() {
    go(cur - 1);
  }

  function isFullscreen() {
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  }

  function toggleFullscreen() {
    if (!isFullscreen()) {
      const docEl = document.documentElement;
      const rfs = docEl.requestFullscreen ||
                  docEl.webkitRequestFullscreen ||
                  docEl.mozRequestFullScreen ||
                  docEl.msRequestFullscreen;
      if (rfs) {
        const p = rfs.call(docEl);
        if (p && p.catch) p.catch(() => {});
      }
    } else {
      const efs = document.exitFullscreen ||
                  document.webkitExitFullscreen ||
                  document.mozCancelFullScreen ||
                  document.msExitFullscreen;
      if (efs) {
        const p = efs.call(document);
        if (p && p.catch) p.catch(() => {});
      }
    }
  }

  function t(key, fallback) {
    return (window.AST_I18N && window.AST_I18N.t(key)) || fallback;
  }

  function updateFullscreenUI() {
    const inFs = isFullscreen();
    document.body.classList.toggle('is-fullscreen', inFs);
    if (fsBtn) {
      const label = t(inFs ? 'ui.fsExit' : 'ui.fsEnter', inFs ? 'Exit Fullscreen (F)' : 'Enter Fullscreen (F)');
      fsBtn.setAttribute('aria-label', label);
      fsBtn.setAttribute('title', t(inFs ? 'ui.fsExit' : 'ui.fsToggle', label));
      const fsLabel = fsBtn.querySelector('.bar__btn-label');
      if (fsLabel) {
        fsLabel.textContent = t(inFs ? 'ui.exitFull' : 'ui.fullscreen', inFs ? 'Exit Full' : 'Full Screen');
      }
    }
  }

  function readHash() {
    const start = parseInt((location.hash || '').replace('#', ''), 10);
    if (!isNaN(start)) {
      go(start - 1);
    } else {
      go(0);
    }
  }

  function initDeck() {
    slides = Array.from(document.querySelectorAll('.slide'));
    total = slides.length;
    prevBtn = document.getElementById('prevBtn');
    nextBtn = document.getElementById('nextBtn');
    count = document.getElementById('count');
    dotsWrap = document.getElementById('dots');
    progress = document.getElementById('progress');
    title = document.getElementById('slideTitle');
    fsBtn = document.getElementById('fsBtn');

    if (total === 0) return;

    // Build pagination dots
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const d = document.createElement('button');
        d.className = 'dot';
        d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        d.addEventListener('click', (e) => {
          e.preventDefault();
          go(i);
        });
        dotsWrap.appendChild(d);
      });
      dots = Array.from(dotsWrap.children);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        next();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prev();
      });
    }

    if (fsBtn) {
      fsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleFullscreen();
      });
    }

    readHash();
  }

  // Lifecycle Bindings
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDeck);
  } else {
    initDeck();
  }

  window.addEventListener('hashchange', readHash);

  ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(evt => {
    document.addEventListener(evt, updateFullscreenUI);
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    const tag = (e.target && e.target.tagName) || '';
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;

    if (['ArrowRight', 'PageDown', ' '].includes(e.key)) {
      e.preventDefault();
      next();
    } else if (['ArrowLeft', 'PageUp'].includes(e.key)) {
      e.preventDefault();
      prev();
    } else if (e.key === 'Home') {
      e.preventDefault();
      go(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      go(total - 1);
    } else if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      toggleFullscreen();
    }
  });

  // Touch Swipe
  let x0 = null;
  document.addEventListener('touchstart', e => {
    x0 = e.touches[0].clientX;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) {
      (dx < 0 ? next : prev)();
    }
    x0 = null;
  }, { passive: true });

  // Mouse Wheel (debounced)
  let wheelLock = false;
  document.addEventListener('wheel', e => {
    if (wheelLock) return;
    if (Math.abs(e.deltaY) < 24 && Math.abs(e.deltaX) < 24) return;
    wheelLock = true;
    setTimeout(() => { wheelLock = false; }, 600);
    (e.deltaY > 0 || e.deltaX > 0) ? next() : prev();
  }, { passive: true });

  // Language Change Listener
  document.addEventListener('ast:lang', () => {
    if (slides[cur]) {
      const customTitle = (window.AST_I18N && window.AST_I18N.t(slides[cur].dataset.i18nTitle)) || slides[cur].dataset.title || '';
      if (title) title.textContent = customTitle;
    }
    updateFullscreenUI();
    dots.forEach((d, i) => {
      d.setAttribute('aria-label', t('ui.goto', 'Go to slide') + ' ' + (i + 1));
    });
    if (window.AST_DIAGRAMS && typeof window.AST_DIAGRAMS.renderAll === 'function') {
      window.AST_DIAGRAMS.renderAll();
    }
  });

  window.AST_DECK = {
    go,
    next,
    prev,
    getCur: () => cur,
    getTotal: () => total
  };
})();
