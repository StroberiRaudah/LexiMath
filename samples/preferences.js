/**
 * preferences.js — shared settings for all pages except /solver.
 * solver.js handles settings independently on the solver page.
 */
(function () {
  var STORAGE_KEY = 'leximath-settings';

  function loadSettings() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        var parsed = JSON.parse(stored);
        if (parsed.animations === undefined) parsed.animations = true;
        return parsed;
      }
    } catch (_) {}
    return defaults();
  }

  function defaults() {
    return {
      fontFamily: "'Lexend', 'Open Sans', Arial, Verdana, sans-serif",
      fontFamilyKey: 'lexend',
      textSize: 'normal',
      theme: 'soft-blue',
      focusMode: false,
      contrastMode: false,
      animations: true,
      language: 'en',
    };
  }

  function saveSettings(s) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  }

  var THEMES = {
    cream: {
      bg: 'radial-gradient(circle at top, #fff9f0 0%, #f7f1e6 45%, #fbf7f2 100%)',
      surface: '#fbf5ef', soft: '#f7eee2', strong: '#f0e2cf',
      tp: '#1f2937', ts: '#45506d', border: '#d7c9b3',
    },
    'light-grey': {
      bg: 'radial-gradient(circle at top, #eef1f4 0%, #e2e6eb 45%, #f4f7fb 100%)',
      surface: '#f7fafc', soft: '#eef2f8', strong: '#dbe4ef',
      tp: '#11203b', ts: '#475569', border: '#d1dce6',
    },
    'off-white': {
      bg: 'radial-gradient(circle at top, #fdfcfa 0%, #f8f5f0 45%, #fbfaf8 100%)',
      surface: '#ffffff', soft: '#f8f6f1', strong: '#ece8df',
      tp: '#1b293b', ts: '#4a5e74', border: '#dde1e6',
    },
    'pink-haze': {
      bg: 'radial-gradient(circle at top, #fff0f8 0%, #f9e7f4 40%, #f7eef8 100%)',
      surface: '#fff4fb', soft: '#ffe7f7', strong: '#f8d5ec',
      tp: '#2f1d31', ts: '#5e3a5d', border: '#edb4df',
      primary: '#d946ef', info: '#ec4899',
    },
  };

  function applySettings(s) {
    var root = document.documentElement;
    document.body.classList.toggle('focus-mode', !!s.focusMode);
    document.body.classList.toggle('high-contrast', !!s.contrastMode);
    document.body.classList.toggle('no-motion', s.animations === false);

    root.style.fontFamily = s.fontFamily || "'Lexend', 'Open Sans', Arial, Verdana, sans-serif";

    if (s.textSize === 'small') root.style.fontSize = '15px';
    else if (s.textSize === 'large') root.style.fontSize = '18px';
    else root.style.fontSize = '16px';

    var t = THEMES[s.theme];
    if (t) {
      document.body.style.background = t.bg;
      root.style.setProperty('--surface', t.surface);
      root.style.setProperty('--surface-soft', t.soft);
      root.style.setProperty('--surface-strong', t.strong);
      root.style.setProperty('--text-primary', t.tp);
      root.style.setProperty('--text-secondary', t.ts);
      root.style.setProperty('--border', t.border);
      if (t.primary) root.style.setProperty('--primary', t.primary);
      if (t.info) root.style.setProperty('--info', t.info);
    } else {
      document.body.style.background =
        'radial-gradient(circle at top, #eef7ff 0%, #e9f1f8 45%, #f7fafc 100%)';
      root.style.setProperty('--surface', '#f6f9fc');
      root.style.setProperty('--surface-soft', '#eef4fb');
      root.style.setProperty('--surface-strong', '#dbe9f5');
      root.style.setProperty('--text-primary', '#10203a');
      root.style.setProperty('--text-secondary', '#3f556f');
      root.style.setProperty('--border', '#d4dce7');
    }

    function el(id) { return document.getElementById(id); }

    var fontSel = el('font-select');
    var themeSel = el('theme-select');
    var focusBtn = el('focus-mode-toggle');
    var contrastBtn = el('contrast-toggle');
    var animBtn = el('animation-toggle');

    if (fontSel) fontSel.value = s.fontFamilyKey || 'lexend';
    if (themeSel) themeSel.value = s.theme || 'soft-blue';

    if (focusBtn) {
      focusBtn.textContent = s.focusMode ? 'On' : 'Off';
      focusBtn.setAttribute('aria-pressed', String(!!s.focusMode));
    }
    if (contrastBtn) {
      contrastBtn.textContent = s.contrastMode ? 'On' : 'Off';
      contrastBtn.setAttribute('aria-pressed', String(!!s.contrastMode));
    }
    var animOn = s.animations !== false;
    if (animBtn) {
      animBtn.textContent = animOn ? 'Off' : 'On';
      animBtn.setAttribute('aria-pressed', String(!animOn));
    }

    var szMap = { small: ['size-sm', 'control-small'], normal: ['size-md', 'control-normal'], large: ['size-lg', 'control-large'] };
    Object.keys(szMap).forEach(function (size) {
      szMap[size].forEach(function (id) {
        var b = el(id);
        if (b) b.classList.toggle('is-active', s.textSize === size);
      });
    });

    applyLanguage(s.language || 'en');
  }

  function applyLanguage(lang) {
    document.querySelectorAll('[data-en]').forEach(function (el) {
      var text = lang === 'bm'
        ? (el.getAttribute('data-bm') || el.getAttribute('data-en'))
        : el.getAttribute('data-en');
      if (text !== null) el.textContent = text;
    });
    var btnEn = document.getElementById('lang-en');
    var btnBm = document.getElementById('lang-bm');
    if (btnEn) btnEn.classList.toggle('is-active', lang !== 'bm');
    if (btnBm) btnBm.classList.toggle('is-active', lang === 'bm');
    // Let page-specific scripts (e.g. quiz.js) know a language switch just
    // happened, so they can re-render any dynamically-generated text that
    // data-en/data-bm swapping can't reach on its own.
    window.dispatchEvent(new CustomEvent('leximath:language-changed', { detail: { language: lang } }));
  }

  function init() {
    var s = loadSettings();
    applySettings(s);

    function el(id) { return document.getElementById(id); }

    /* ---- Modal open / close ---- */
    var modal = el('settings-modal');
    var settingsBtn = el('settings-button');
    var closeBtn = el('close-settings');
    var panel = modal && modal.querySelector('.settings-panel');

    if (settingsBtn && modal) {
      settingsBtn.addEventListener('click', function () {
        modal.classList.remove('hidden');
        if (panel) panel.focus();
      });
    }
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', function () { modal.classList.add('hidden'); });
    }
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) modal.classList.add('hidden');
      });
    }
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
      }
    });

    /* ---- Font ---- */
    var fontSel = el('font-select');
    if (fontSel) {
      fontSel.addEventListener('change', function () {
        var cur = loadSettings();
        var map = {
          lexend: "'Lexend', 'Open Sans', Arial, Verdana, sans-serif",
          'open-sans': "'Open Sans', Arial, Verdana, sans-serif",
          arial: 'Arial, Verdana, sans-serif',
          verdana: 'Verdana, Arial, sans-serif',
        };
        cur.fontFamily = map[fontSel.value] || map.lexend;
        cur.fontFamilyKey = fontSel.value;
        applySettings(cur); saveSettings(cur);
      });
    }

    /* ---- Theme ---- */
    var themeSel = el('theme-select');
    if (themeSel) {
      themeSel.addEventListener('change', function () {
        var cur = loadSettings();
        cur.theme = themeSel.value;
        applySettings(cur); saveSettings(cur);
      });
    }

    /* ---- Text size ---- */
    function setSize(size) {
      var cur = loadSettings();
      cur.textSize = size;
      applySettings(cur); saveSettings(cur);
    }
    [
      ['size-sm', 'small'], ['size-md', 'normal'], ['size-lg', 'large'],
      ['control-small', 'small'], ['control-normal', 'normal'], ['control-large', 'large'],
    ].forEach(function (pair) {
      var b = el(pair[0]);
      if (b) b.addEventListener('click', function () { setSize(pair[1]); });
    });

    /* ---- Toggles ---- */
    var focusBtn = el('focus-mode-toggle');
    if (focusBtn) {
      focusBtn.addEventListener('click', function () {
        var cur = loadSettings(); cur.focusMode = !cur.focusMode;
        applySettings(cur); saveSettings(cur);
      });
    }
    var animBtn = el('animation-toggle');
    if (animBtn) {
      animBtn.addEventListener('click', function () {
        var cur = loadSettings(); cur.animations = !cur.animations;
        applySettings(cur); saveSettings(cur);
      });
    }
    var contrastBtn = el('contrast-toggle');
    if (contrastBtn) {
      contrastBtn.addEventListener('click', function () {
        var cur = loadSettings(); cur.contrastMode = !cur.contrastMode;
        applySettings(cur); saveSettings(cur);
      });
    }

    /* ---- Reset ---- */
    var resetBtn = el('reset-settings');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        var def = defaults();
        applySettings(def); saveSettings(def);
      });
    }

    /* ---- Language ---- */
    var btnLangEn = el('lang-en');
    var btnLangBm = el('lang-bm');
    if (btnLangEn) {
      btnLangEn.addEventListener('click', function () {
        var cur = loadSettings(); cur.language = 'en';
        applySettings(cur); saveSettings(cur);
      });
    }
    if (btnLangBm) {
      btnLangBm.addEventListener('click', function () {
        var cur = loadSettings(); cur.language = 'bm';
        applySettings(cur); saveSettings(cur);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
