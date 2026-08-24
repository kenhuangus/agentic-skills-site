/* ============ OWASP AST slide deck navigation ============ */
(function () {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const total = slides.length;
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const count = document.getElementById('count');
  const dotsWrap = document.getElementById('dots');
  const progress = document.getElementById('progress');
  const title = document.getElementById('slideTitle');

  // build dots
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'dot';
    d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    d.addEventListener('click', () => go(i));
    dotsWrap.appendChild(d);
  });
  const dots = Array.from(dotsWrap.children);

  let cur = 0;

  function clamp(i) { return Math.max(0, Math.min(total - 1, i)); }

  function go(i) {
    i = clamp(i);
    slides.forEach((s, idx) => {
      s.classList.toggle('is-active', idx === i);
      s.classList.toggle('is-prev', idx < i);
    });
    dots.forEach((d, idx) => d.classList.toggle('is-on', idx === i));
    cur = i;
    count.textContent = (i + 1) + ' / ' + total;
    
    // Set title
    const customTitle = (window.AST_I18N && window.AST_I18N.t(slides[i].dataset.i18nTitle)) || slides[i].dataset.title || '';
    title.textContent = customTitle;
    
    progress.style.width = ((i) / (total - 1) * 100) + '%';
    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === total - 1;
    if (history.replaceState) history.replaceState(null, '', '#' + (i + 1));
    
    // Trigger diagram render for active slide if not rendered yet
    if (window.AST_DIAGRAMS && typeof window.AST_DIAGRAMS.renderSlide === 'function') {
      window.AST_DIAGRAMS.renderSlide(slides[i]);
    }
  }

  const next = () => go(cur + 1);
  const prev = () => go(cur - 1);
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  // full screen support
  const fsBtn = document.getElementById('fsBtn');
  const fsLabel = fsBtn ? fsBtn.querySelector('.bar__btn-label') : null;

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
    }
    if (fsLabel) {
      fsLabel.textContent = t(inFs ? 'ui.exitFull' : 'ui.fullscreen', inFs ? 'Exit Full' : 'Full Screen');
    }
  }

  if (fsBtn) {
    fsBtn.addEventListener('click', toggleFullscreen);
  }

  ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(evt => {
    document.addEventListener(evt, updateFullscreenUI);
  });

  // keyboard
  document.addEventListener('keydown', e => {
    const tag = (e.target && e.target.tagName) || '';
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;

    if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === 'Home') { e.preventDefault(); go(0); }
    else if (e.key === 'End') { e.preventDefault(); go(total - 1); }
    else if (e.key === 'f' || e.key === 'F') { e.preventDefault(); toggleFullscreen(); }
  });

  // touch swipe
  let x0 = null;
  document.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    x0 = null;
  }, { passive: true });

  // wheel = navigate (debounced)
  let wheelLock = false;
  document.addEventListener('wheel', e => {
    if (wheelLock) return;
    if (Math.abs(e.deltaY) < 24 && Math.abs(e.deltaX) < 24) return;
    wheelLock = true; setTimeout(() => (wheelLock = false), 650);
    (e.deltaY > 0 || e.deltaX > 0) ? next() : prev();
  }, { passive: true });

  // deep-link via hash
  function readHash() {
    const start = parseInt((location.hash || '').replace('#', ''), 10);
    if (!isNaN(start)) go(start - 1);
    else go(0);
  }
  window.addEventListener('hashchange', readHash);
  window.addEventListener('DOMContentLoaded', readHash);

  document.addEventListener('ast:lang', () => {
    const customTitle = (window.AST_I18N && window.AST_I18N.t(slides[cur].dataset.i18nTitle)) || slides[cur].dataset.title || '';
    title.textContent = customTitle;
    updateFullscreenUI();
    dots.forEach((d, i) => {
      d.setAttribute('aria-label', t('ui.goto', 'Go to slide') + ' ' + (i + 1));
    });
    if (window.AST_DIAGRAMS && typeof window.AST_DIAGRAMS.renderAll === 'function') {
      window.AST_DIAGRAMS.renderAll();
    }
  });

  window.AST_DECK = { go, next, prev, getCur: () => cur, getTotal: () => total };
})();
