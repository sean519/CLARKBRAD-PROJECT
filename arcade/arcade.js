/* ─────────────────────────────────────────────────────────────
   Small helpers every arcade game needs: a best-score store, a
   swipe reader, a d-pad binder, and a score field that flashes
   when it changes. Nothing here knows about any single game.
   ───────────────────────────────────────────────────────────── */
(function (global) {
  'use strict';

  /* localStorage throws in private-mode Safari and on file:// in some
     browsers — a missing high score should never break the game. */
  function readBest(key) {
    try { return parseInt(localStorage.getItem('arcade:' + key), 10) || 0; }
    catch (e) { return 0; }
  }

  function writeBest(key, value) {
    try { localStorage.setItem('arcade:' + key, String(value)); }
    catch (e) { /* score just won't survive the reload */ }
  }

  /* Set a .stat-value's text and flash it when the number goes up. */
  function setStat(el, value, flash) {
    if (!el) return;
    el.textContent = value;
    if (!flash) return;
    el.classList.remove('bump');
    void el.offsetWidth;              // restart the animation
    el.classList.add('bump');
  }

  /* Swipes on `el` → cb('up'|'down'|'left'|'right').
     30px threshold: small enough for a thumb, large enough that a
     tap on a card never registers as a swipe. */
  function onSwipe(el, cb, threshold) {
    var min = threshold || 30;
    var x0 = 0, y0 = 0, tracking = false;

    el.addEventListener('touchstart', function (e) {
      var t = e.changedTouches[0];
      x0 = t.clientX; y0 = t.clientY; tracking = true;
    }, { passive: true });

    el.addEventListener('touchmove', function (e) {
      if (tracking) e.preventDefault();   // stop the page from scrolling mid-swipe
    }, { passive: false });

    el.addEventListener('touchend', function (e) {
      if (!tracking) return;
      tracking = false;
      var t = e.changedTouches[0];
      var dx = t.clientX - x0, dy = t.clientY - y0;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < min) return;
      if (Math.abs(dx) > Math.abs(dy)) cb(dx > 0 ? 'right' : 'left');
      else                             cb(dy > 0 ? 'down'  : 'up');
    }, { passive: true });
  }

  /* Wire the shared .pad markup to cb(direction). Uses pointerdown so
     a held button responds immediately instead of after touchend. */
  function bindPad(root, cb) {
    ['up', 'down', 'left', 'right'].forEach(function (dir) {
      var btn = root.querySelector('.' + dir);
      if (!btn) return;
      btn.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        cb(dir);
      });
    });
  }

  /* Arrow keys and WASD → cb(direction). Returns nothing; the caller
     decides what to do with directions it doesn't use. */
  var KEYS = {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    w: 'up', s: 'down', a: 'left', d: 'right',
    W: 'up', S: 'down', A: 'left', D: 'right'
  };

  function bindKeys(cb) {
    global.addEventListener('keydown', function (e) {
      var dir = KEYS[e.key];
      if (!dir) return;
      e.preventDefault();
      cb(dir, e);
    });
  }

  global.Arcade = {
    readBest: readBest,
    writeBest: writeBest,
    setStat: setStat,
    onSwipe: onSwipe,
    bindPad: bindPad,
    bindKeys: bindKeys
  };
})(window);
