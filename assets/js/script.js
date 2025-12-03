/* ---------- Configuration ---------- */
const INTERSTITIAL_SHOWN_KEY = 'interstitialShown'; // sessionStorage key

/* ---------- Helper: show/hide overlay (interstitial) ---------- */
const overlay = document.getElementById('overlay');
const overlayClose = document.getElementById('overlay-close');

function showInterstitial() {
  if (!overlay) return;
  overlay.style.display = 'flex';
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function hideInterstitial() {
  if (!overlay) return;
  overlay.style.display = 'none';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

overlayClose && overlayClose.addEventListener('click', hideInterstitial);

/* ---------- Read More -> reveal list & show interstitial (one per session) ---------- */
let interstitialShown = !!sessionStorage.getItem(INTERSTITIAL_SHOWN_KEY);

const readmoreBtn = document.getElementById('readmore-btn');
const introFull = document.getElementById('intro-full');
const introPreview = document.getElementById('intro-preview');
const listSection = document.getElementById('list');

if (readmoreBtn) {
  readmoreBtn.addEventListener('click', function () {
    // reveal intro and list
    if (introPreview) introPreview.style.display = 'none';
    if (introFull) introFull.style.display = 'block';
    if (listSection) {
      listSection.style.display = 'block';
      listSection.setAttribute('aria-hidden', 'false');
    }

    // set aria-expanded for button
    readmoreBtn.setAttribute('aria-expanded', 'true');

    // show interstitial once per session
    if (!interstitialShown) {
      showInterstitial();
      interstitialShown = true;
      try { sessionStorage.setItem(INTERSTITIAL_SHOWN_KEY, '1'); } catch (e) {}
    }

    // scroll to the list for better UX
    // if (listSection) {
    //   const firstItem = listSection.querySelector('.list-item');
    //   if (firstItem) firstItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // }
  });

  // keyboard accessible
  readmoreBtn.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      readmoreBtn.click();
    }
  });
}

/* ---------- Sticky bottom close/open ---------- */
const sticky = document.getElementById('sticky-wrap');
const stickyClose = document.getElementById('sticky-close');
const stickyOpen = document.getElementById('sticky-open');

stickyClose && stickyClose.addEventListener('click', () => {
  if (sticky) sticky.style.display = 'none';
});

stickyOpen && stickyOpen.addEventListener('click', () => {
  const article = document.getElementById('article');
  if (article) {
    window.scrollTo({ top: article.offsetTop, behavior: 'smooth' });
  }
});

/* ---------- Exit intent (desktop) ---------- */
(function () {
  const exitPopup = document.getElementById('exit-popup');
  const exitClose = document.getElementById('exit-close');

  exitClose && exitClose.addEventListener('click', () => {
    exitPopup.style.display = 'none';
  });

  function handleMouse(e) {
    // detect leaving to top
    if (e.clientY <= 3) {
      if (exitPopup && exitPopup.style.display !== 'block') {
        exitPopup.style.display = 'block';
        exitPopup.setAttribute('aria-hidden', 'false');
      }
    }
  }

  document.addEventListener('mouseout', handleMouse);

  // mobile fallback: show after 60s if nothing happened
  setTimeout(() => {
    if (document.visibilityState === 'visible') {
      if (exitPopup && exitPopup.style.display !== 'block') {
        exitPopup.style.display = 'block';
        exitPopup.setAttribute('aria-hidden', 'false');
      }
    }
  }, 60000); // 60s
})();

/* ---------- Accessibility: close overlay/popup with ESC ---------- */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    hideInterstitial();
    const exit = document.getElementById('exit-popup');
    if (exit) exit.style.display = 'none';
  }
});

/* ---------- Optional: measure scroll depth (simple) ---------- */
(function () {
  let maxScroll = 0;
  window.addEventListener(
    'scroll',
    () => {
      const sc = window.scrollY + window.innerHeight;
      if (sc > maxScroll) maxScroll = sc;
      // send to analytics if needed:
      // window.dataLayer && dataLayer.push({event:'scroll_depth', value: Math.round(maxScroll)});
    },
    { passive: true }
  );
})();

/* ---------- Ensure external links use noopener (safety) ---------- */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a[target="_blank"]').forEach(a => {
    if (!a.rel.includes('noopener')) a.rel = (a.rel ? a.rel + ' ' : '') + 'noopener noreferrer';
  });
});
