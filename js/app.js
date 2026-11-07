// Shared behaviour for the four tab pages; each block runs only where its markup exists.
(() => {
  const root = document.documentElement;
  const t = JSON.parse(document.getElementById('ui').textContent);
  const termsData = document.getElementById('terms');
  const terms = termsData ? JSON.parse(termsData.textContent) : null;
  const plurals = new Intl.PluralRules(t.lang);
  const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k]);

  // Motion: smooth wheel scrolling, parallax, reveals and the header state. Off under reduced motion;
  // touch-first devices keep native scrolling.
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touchFirst = matchMedia('(hover: none) and (pointer: coarse)').matches;
  const finePointer = !reduceMotion && matchMedia('(hover: hover) and (pointer: fine)').matches;
  const supportsView = CSS.supports('animation-timeline: view()');
  const supportsScrollTimeline = CSS.supports('animation-timeline: scroll()');
  const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';
  // A long exponential ease and a lighter wheel give the scroll a soft, gliding finish.
  const lenis = !reduceMotion && !touchFirst && typeof window.Lenis === 'function'
    ? new window.Lenis({ autoRaf: true, duration: 1.35, easing: (x) => (x === 1 ? 1 : 1 - 2 ** (-10 * x)), smoothWheel: true, wheelMultiplier: 0.9 })
    : null;
  const stickyOffset = () => parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
  const scrollToEl = (el, immediate = false) => {
    if (lenis) lenis.scrollTo(el, { offset: -stickyOffset(), immediate, force: true });
    else el.scrollIntoView({ block: 'start', behavior: immediate || reduceMotion ? 'auto' : 'smooth' });
  };

  const header = document.querySelector('.site-header');
  const backdrop = document.querySelector('.backdrop');
  const progressBar = document.querySelector('.scroll-progress');
  let pathFallback = null;
  let cursorOnScroll = null;

  // Count a number up when it appears. Screen readers get the final value at once.
  const countUp = (el, to, render = String, from = 0) => {
    const finalText = render(to);
    if (reduceMotion || to === from) { el.textContent = finalText; return; }
    const sr = document.createElement('span');
    sr.className = 'visually-hidden';
    sr.textContent = finalText;
    const shown = document.createElement('span');
    shown.setAttribute('aria-hidden', 'true');
    shown.textContent = render(from);
    el.replaceChildren(sr, shown);
    const start = performance.now();
    const duration = 900 + Math.min(500, Math.abs(to - from) * 10);
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      shown.textContent = render(Math.round(from + (to - from) * (1 - (1 - p) ** 3)));
      if (p < 1) requestAnimationFrame(step); else el.textContent = finalText;
    };
    requestAnimationFrame(step);
  };
  const whenVisible = (el, fn) => {
    if (!('IntersectionObserver' in window)) { fn(); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); fn(); } }, { threshold: 0.4 });
    io.observe(el);
  };
  let ticking = false;
  let idle;
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        header.classList.toggle('is-scrolled', y > 40);
        if (!reduceMotion) backdrop.style.setProperty('--parallax', `${Math.round(Math.min(y, 1600))}px`);
        if (!reduceMotion && !supportsScrollTimeline && progressBar) {
          const max = document.documentElement.scrollHeight - innerHeight;
          progressBar.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);
        }
        if (pathFallback) pathFallback();
        if (cursorOnScroll) cursorOnScroll();
        ticking = false;
      });
    }
    // The mesh pauses while scrolling so the glass is re-blurred once per frame, not twice.
    root.classList.add('is-scrolling');
    clearTimeout(idle);
    idle = setTimeout(() => root.classList.remove('is-scrolling'), 160);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Keep the sticky offsets in step with the real header height (measured now, then on every resize).
  root.style.setProperty('--header-h', `${document.querySelector('.nav').offsetHeight}px`);
  new ResizeObserver(([e]) => {
    root.style.setProperty('--header-h', `${Math.round(e.borderBoxSize[0].blockSize)}px`);
  }).observe(document.querySelector('.nav'));

  // Reveal on scroll: fade in with a slight rise, staggered, once. Content is visible without it.
  if (!reduceMotion && !supportsView && 'IntersectionObserver' in window) {
    root.classList.add('reveal-on');
    const io = new IntersectionObserver((seen) => {
      let i = 0;
      seen.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const delay = Math.min(i, 8) * 55;
        i += 1;
        el.style.setProperty('--d', `${delay}ms`);
        el.classList.add('is-in');
        io.unobserve(el);
        // Drop the stagger once revealed, so hover lifts answer at once.
        setTimeout(() => el.style.removeProperty('--d'), 700 + delay);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
    document.querySelectorAll('[data-reveal], .slide').forEach((el) => io.observe(el));
  }

  // Numbers in the copy (40 terms, the topic counts) count up when they come into view.
  if (!reduceMotion) {
    document.querySelectorAll('.count[data-count]').forEach((el) => {
      const n = Number(el.dataset.count);
      // Hold the final width so counting never shifts the layout.
      el.style.display = 'inline-block';
      el.style.minWidth = `${String(n).length}ch`;
      whenVisible(el, () => countUp(el, n));
    });
  }

  // Cursor effects, mouse and trackpad only: a light that follows the cursor across glass cards,
  // a brighter rim near it, a small tilt, magnetic buttons and tabs, and blobs leaning toward the cursor.
  if (finePointer) {
    const glassSel = '.hero, .page-head, .qamous__top, .group, .empty, .progress, .path__stops > li, .quiz__scene, .quiz__choice, .steps__repo, .steps__list > li';
    const tiltSel = '.progress, .path__stops > li, .quiz__scene, .quiz__choice, .steps__repo, .steps__list > li';
    const decorate = (card) => {
      if (card.querySelector(':scope > .spot')) return;
      card.insertAdjacentHTML('afterbegin', '<span class="spot" aria-hidden="true"><i></i></span><span class="rim" aria-hidden="true"><i></i></span>');
    };
    document.querySelectorAll(glassSel).forEach(decorate);
    document.querySelectorAll('.btn, .nav__links a').forEach((el) => el.classList.add('magnetic'));

    let hot = null;
    let magnet = null;
    let pointer = null;
    let frame = 0;
    const cool = (card) => { card.classList.remove('is-hot'); card.style.removeProperty('--rx'); card.style.removeProperty('--ry'); };
    const release = (el) => { el.style.removeProperty('--tx'); el.style.removeProperty('--ty'); };
    const update = () => {
      frame = 0;
      if (!pointer) return;
      const { x, y } = pointer;
      const under = document.elementFromPoint(x, y);
      const card = under ? under.closest(glassSel) : null;
      if (hot && hot !== card) cool(hot);
      hot = card;
      if (card) {
        decorate(card);
        const r = card.getBoundingClientRect();
        const px = x - r.left;
        const py = y - r.top;
        card.style.setProperty('--mx', `${px.toFixed(1)}px`);
        card.style.setProperty('--my', `${py.toFixed(1)}px`);
        card.classList.add('is-hot');
        if (card.matches(tiltSel) && card.getAttribute('aria-disabled') !== 'true') {
          const max = 4 * Math.min(1, 520 / r.width);
          card.style.setProperty('--rx', `${((0.5 - py / r.height) * 2 * max).toFixed(2)}deg`);
          card.style.setProperty('--ry', `${((px / r.width - 0.5) * 2 * max).toFixed(2)}deg`);
        }
      }
      const mag = under ? under.closest('.magnetic') : null;
      if (magnet && magnet !== mag) release(magnet);
      magnet = mag;
      if (mag) {
        const r = mag.getBoundingClientRect();
        mag.style.setProperty('--tx', `${(((x - r.left) / r.width - 0.5) * 10).toFixed(1)}px`);
        mag.style.setProperty('--ty', `${(((y - r.top) / r.height - 0.5) * 6).toFixed(1)}px`);
      }
      backdrop.style.setProperty('--cx', ((x / innerWidth - 0.5) * 2).toFixed(3));
      backdrop.style.setProperty('--cy', ((y / innerHeight - 0.5) * 2).toFixed(3));
    };
    addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      pointer = { x: e.clientX, y: e.clientY };
      if (!frame) frame = requestAnimationFrame(update);
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => {
      pointer = null;
      if (hot) cool(hot);
      if (magnet) release(magnet);
      hot = null;
      magnet = null;
    });
    cursorOnScroll = () => { if (pointer && !frame) frame = requestAnimationFrame(update); };
  }

  // The language links keep the current page, search, filter and open term.
  const syncLangLinks = () => {
    document.querySelectorAll('.langs a').forEach((a) => {
      a.href = a.getAttribute('href').split(/[?#]/)[0] + location.search + location.hash;
    });
  };
  syncLangLinks();

  // "Got it": kept in this browser only, shared by the three languages.
  const KEY = 'qamous-dev:got';
  let got;
  try { got = new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch { got = new Set(); }
  const saveGot = () => { try { localStorage.setItem(KEY, JSON.stringify([...got])); } catch { /* storage blocked: progress lasts this visit */ } };
  const markChecks = () => {
    document.querySelectorAll('.entry').forEach((el) => { el.querySelector('.check').hidden = !got.has(el.id); });
    document.querySelectorAll('a[data-term]').forEach((a) => { a.querySelector('.check').hidden = !got.has(a.dataset.term); });
  };

  // Copy buttons on code blocks.
  document.querySelectorAll('.code__copy').forEach((btn) => {
    const label = btn.textContent;
    btn.setAttribute('aria-live', 'polite');
    let timer;
    btn.addEventListener('click', async () => {
      const code = btn.closest('.code').querySelector('code').innerText;
      btn.classList.remove('is-done');
      try {
        await navigator.clipboard.writeText(code);
        btn.textContent = t.copied;
        void btn.offsetWidth; // restart the confirmation pop on repeated clicks
        btn.classList.add('is-done');
      } catch {
        btn.textContent = t.copyFail;
      }
      clearTimeout(timer);
      timer = setTimeout(() => { btn.textContent = label; btn.classList.remove('is-done'); }, 1600);
    });
  });

  // Dictionary: live search, filters, deep links and the "Got it" checkboxes.
  const input = document.getElementById('q');
  if (input) {
    const form = input.form;
    const status = document.getElementById('status');
    const empty = document.getElementById('empty');
    const emptyHead = document.getElementById('empty-head');
    const toolbar = document.querySelector('.toolbar');
    const chips = [...document.querySelectorAll('input[name="cat"]')];
    const groups = [...document.querySelectorAll('.group')];
    const entries = [...document.querySelectorAll('.entry')];

    // Fold case, accents and Arabic spelling variants so "Sécurité" = "securite" and "مستودع" = "المستودع".
    const fold = (s) => s.toLowerCase().normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[ً-ٰٟـ]/g, '')
      .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
      .replace(/[’‘]/g, "'").replace(/ /g, ' ');

    const index = entries.map((el) => ({
      el,
      cat: el.dataset.cat,
      term: fold(`${el.dataset.terms} ${el.closest('.group').querySelector('h3').textContent}`),
      text: fold(el.textContent),
    }));
    const catName = (id) => {
      const chip = chips.find((c) => c.value === id);
      return chip ? chip.labels[0].firstChild.textContent.trim() : '';
    };
    const count = (n) => fill(t.count[plurals.select(n)] || t.count.other, { n });

    const compute = () => {
      const raw = input.value.trim();
      const words = fold(raw).split(/\s+/).filter(Boolean);
      const cat = (chips.find((c) => c.checked) || {}).value || '';
      const shownSet = new Set(index.filter((item) => (!cat || item.cat === cat) && words.every((w) => item.term.includes(w) || item.text.includes(w))).map((item) => item.el));
      return { raw, words, cat, shownSet };
    };

    const render = ({ raw, words, cat, shownSet }, { syncUrl = true } = {}) => {
      for (const item of index) item.el.hidden = !shownSet.has(item.el);
      const shown = shownSet.size;
      for (const g of groups) g.hidden = !g.querySelector('.entry:not([hidden])');

      empty.hidden = shown > 0;
      emptyHead.textContent = fill(t.empty, { q: raw });
      if (!raw && !cat) status.textContent = t.hint;
      else status.textContent = count(shown) + (cat ? fill(t.inCat, { cat: catName(cat) }) : '') + (raw ? fill(t.forQ, { q: raw }) : '');

      // One match left: open it, the reader came for that one.
      if (shown === 1 && words.length) index.find((i) => !i.el.hidden).el.open = true;

      if (syncUrl) {
        const params = new URLSearchParams();
        if (raw) params.set('q', raw);
        if (cat) params.set('cat', cat);
        const qs = params.toString();
        history.replaceState(null, '', (qs ? `?${qs}` : location.pathname) + location.hash);
        syncLangLinks();
      }
    };
    const apply = (opts) => render(compute(), opts);

    // FLIP: rows and groups glide from where they were to where they land; new ones fade in.
    const inView = (r) => r.bottom > -80 && r.top < innerHeight + 80;
    const watched = [...groups, ...entries];
    const flip = (mutate) => {
      const before = new Map();
      watched.forEach((el) => {
        if (!el.getClientRects().length) return;
        const r = el.getBoundingClientRect();
        if (inView(r)) before.set(el, r);
      });
      mutate();
      const groupShift = new Map();
      let k = 0;
      watched.forEach((el) => {
        if (!el.getClientRects().length) return;
        const r = el.getBoundingClientRect();
        if (!inView(r)) return;
        const b = before.get(el);
        if (b) {
          let dx = b.left - r.left;
          let dy = b.top - r.top;
          if (el.classList.contains('group')) groupShift.set(el, [dx, dy]);
          else { const [gx, gy] = groupShift.get(el.parentElement) || [0, 0]; dx -= gx; dy -= gy; }
          if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) el.animate([{ translate: `${dx}px ${dy}px` }, { translate: '0 0' }], { duration: 440, easing: ease });
        } else {
          // New, or arriving from below the screen: rise and fade in.
          el.animate([{ opacity: 0, translate: '0 12px', scale: 0.97, filter: 'blur(4px)' }, { opacity: 1, translate: '0 0', scale: 1, filter: 'blur(0px)' }], { duration: 380, delay: 40 + Math.min(k, 8) * 28, easing: ease, fill: 'backwards' });
          k += 1;
        }
      });
    };
    let fading = null;
    const applyAnimated = () => {
      const plan = compute();
      if (reduceMotion) { render(plan); return; }
      if (fading) { fading.forEach((a) => a.cancel()); fading = null; flip(() => render(plan)); return; }
      const leaving = index.filter((i) => !i.el.hidden && !plan.shownSet.has(i.el) && inView(i.el.getBoundingClientRect())).map((i) => i.el);
      if (!leaving.length) { flip(() => render(plan)); return; }
      const anims = leaving.map((el) => el.animate([{ opacity: 1, scale: 1, filter: 'blur(0px)' }, { opacity: 0, scale: 0.97, filter: 'blur(3px)' }], { duration: 170, easing: 'ease-in', fill: 'forwards' }));
      fading = anims;
      Promise.all(anims.map((a) => a.finished)).then(() => {
        if (fading !== anims) return;
        fading = null;
        flip(() => render(compute()));
        anims.forEach((a) => a.cancel());
      }).catch(() => {});
    };

    const openFromHash = (initial = false) => {
      const id = decodeURIComponent(location.hash.slice(1));
      const target = id && document.getElementById(id);
      if (!target || !target.classList.contains('entry')) return;
      if (target.hidden) {
        input.value = '';
        chips[0].checked = true;
        apply();
      }
      target.open = true;
      scrollToEl(target, initial);
    };

    // Restore ?q= and &cat= from a shared link.
    const params = new URLSearchParams(location.search);
    if (params.has('q')) input.value = params.get('q');
    const startCat = chips.find((c) => c.value === params.get('cat'));
    if (startCat) startCat.checked = true;
    if (params.has('q') || startCat) apply({ syncUrl: false });

    input.addEventListener('input', () => applyAnimated());
    chips.forEach((c) => c.addEventListener('change', () => applyAnimated()));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const first = index.find((i) => !i.el.hidden);
      if (!first) return;
      first.el.open = true;
      scrollToEl(first.el);
      first.el.querySelector('summary').focus({ preventScroll: true });
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && input.value) {
        input.value = '';
        applyAnimated();
      }
    });

    document.getElementById('clear').addEventListener('click', () => {
      input.value = '';
      chips[0].checked = true;
      applyAnimated();
      input.focus();
    });

    // "/" jumps to the search, as on most docs sites.
    document.addEventListener('keydown', (e) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      const el = e.target;
      if (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(el.tagName)) return;
      e.preventDefault();
      input.focus();
      input.select();
    });

    // Opening or closing an entry: toggle it ourselves, then glide the rows and groups below into place.
    if (!reduceMotion) {
      document.addEventListener('click', (e) => {
        const summary = e.target.closest('.entry > summary');
        if (!summary || e.defaultPrevented) return;
        const entry = summary.parentElement;
        const below = [];
        for (let el = entry.nextElementSibling; el; el = el.nextElementSibling) if (el.matches('.entry:not([hidden])')) below.push(el);
        for (let g = entry.closest('.group').nextElementSibling; g; g = g.nextElementSibling) if (g.matches('.group:not([hidden])')) below.push(g);
        const footer = document.querySelector('.footer');
        if (footer) below.push(footer);
        const tops = below.map((el) => el.getBoundingClientRect().top).map((top, i) => [below[i], top]).filter(([, top]) => top < innerHeight + 80);
        e.preventDefault();
        entry.open = !entry.open;
        tops.forEach(([el, top]) => {
          const dy = top - el.getBoundingClientRect().top;
          if (Math.abs(dy) > 1) el.animate([{ translate: `0 ${dy}px` }, { translate: '0 0' }], { duration: 520, easing: ease });
        });
      });
    }

    // An opened entry becomes the address, so it can be shared.
    entries.forEach((el) => el.addEventListener('toggle', () => {
      if (!el.open) return;
      history.replaceState(null, '', location.search + '#' + el.id);
      syncLangLinks();
    }));

    window.addEventListener('hashchange', () => { openFromHash(); syncLangLinks(); });
    // Measure the search bar before the first jump: in Arabic its chips wrap to two rows.
    root.style.setProperty('--toolbar-h', `${toolbar.offsetHeight}px`);
    openFromHash(true);
    // Web fonts can change the bars' height; land the deep link again once they are in.
    // Scroll anchoring moves scrollY on its own during that reflow, so only a real gesture counts as the reader taking over.
    if (location.hash && document.fonts) {
      let tookOver = false;
      const stop = () => { tookOver = true; };
      ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((type) => addEventListener(type, stop, { once: true, passive: true }));
      document.fonts.ready.then(() => {
        root.style.setProperty('--toolbar-h', `${toolbar.offsetHeight}px`);
        if (!tookOver) openFromHash(true);
      });
    }
    syncLangLinks();

    const boxes = [...document.querySelectorAll('[data-got]')];
    const paintBoxes = () => { boxes.forEach((box) => { box.checked = got.has(box.dataset.got); }); markChecks(); };
    boxes.forEach((box) => box.addEventListener('change', () => {
      if (box.checked) got.add(box.dataset.got); else got.delete(box.dataset.got);
      saveGot();
      paintBoxes();
    }));
    paintBoxes();

    // Keep the sticky group heads and anchor jumps clear of the search bar's real height.
    new ResizeObserver(([e]) => {
      root.style.setProperty('--toolbar-h', `${Math.round(e.borderBoxSize[0].blockSize)}px`);
    }).observe(toolbar);
  }

  // Path: overall progress, a count per stage and a tick on each understood term.
  const progress = document.getElementById('progress');
  if (progress && terms) {
    const ids = new Set(terms.map((x) => x.id));
    const n = [...got].filter((id) => ids.has(id)).length;
    progress.textContent = fill(t.progress, { n: reduceMotion ? n : 0, total: t.total });
    const meter = document.getElementById('meter');
    if (reduceMotion) meter.style.transform = `scaleX(${n / t.total})`;
    else whenVisible(progress, () => {
      countUp(progress, n, (v) => fill(t.progress, { n: v, total: t.total }));
      meter.style.transform = `scaleX(${n / t.total})`;
    });
    const stops = document.querySelector('.path__stops');
    if (!reduceMotion && !supportsView && stops) {
      const nodes = [...stops.children];
      pathFallback = () => {
        const r = stops.getBoundingClientRect();
        const mid = innerHeight / 2;
        stops.style.setProperty('--fill', Math.max(0, Math.min(1, (mid - r.top) / r.height)).toFixed(3));
        nodes.forEach((li) => { const b = li.getBoundingClientRect(); li.classList.toggle('is-lit', b.top + b.height / 2 <= mid); });
      };
      pathFallback();
    }
    document.querySelectorAll('[data-stage]').forEach((li) => {
      const stage = li.dataset.stage.split(' ');
      li.querySelector('.stop__count').textContent = fill(t.stage, { n: stage.filter((id) => got.has(id)).length, total: stage.length });
    });
    markChecks();
  }

  // Quiz: a scene, four terms from other topics, one right answer.
  const quiz = document.getElementById('quiz');
  if (quiz && terms) {
    const sceneEl = document.getElementById('quiz-scene');
    const choicesEl = document.getElementById('quiz-choices');
    const feedback = document.getElementById('quiz-feedback');
    const scoreEl = document.getElementById('quiz-score');
    const nextBtn = document.getElementById('quiz-next');
    const tick = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
    const score = { right: 0, total: 0 };
    let streak = 0;
    let answer = null;
    const confetti = (origin) => {
      const canvas = document.createElement('canvas');
      canvas.className = 'confetti';
      canvas.setAttribute('aria-hidden', 'true');
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      document.body.append(canvas);
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      const r = origin.getBoundingClientRect();
      const colours = ['#f4b400', '#6050dc', '#3fcf9f', '#59b7ff', '#ffffff'];
      const bits = Array.from({ length: 70 }, () => {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9;
        const v = 6 + Math.random() * 7;
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, vx: Math.cos(a) * v, vy: Math.sin(a) * v, w: 5 + Math.random() * 5, h: 3 + Math.random() * 4, rot: Math.random() * 6.3, vr: (Math.random() - 0.5) * 0.3, c: colours[Math.floor(Math.random() * colours.length)] };
      });
      const start = performance.now();
      const tickFrame = (now) => {
        const p = (now - start) / 1400;
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        ctx.globalAlpha = Math.max(0, 1 - p);
        bits.forEach((b) => {
          b.vy += 0.28; b.vx *= 0.985; b.x += b.vx; b.y += b.vy; b.rot += b.vr;
          ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.rot); ctx.fillStyle = b.c; ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); ctx.restore();
        });
        if (p < 1) requestAnimationFrame(tickFrame); else canvas.remove();
      };
      requestAnimationFrame(tickFrame);
    };
    let done = false;

    const shuffle = (list) => {
      const a = [...list];
      for (let i = a.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    const choose = (button, item) => {
      if (done) return;
      done = true;
      const ok = item === answer;
      score.total += 1;
      if (ok) score.right += 1;
      choicesEl.querySelectorAll('.quiz__choice').forEach((b) => {
        b.setAttribute('aria-disabled', 'true');
        if (b.dataset.id === answer.id) { b.classList.add('is-right'); b.insertAdjacentHTML('beforeend', tick); }
      });
      if (!ok) button.classList.add('is-wrong');
      feedback.textContent = fill(ok ? t.right : t.wrong, { term: answer.name });
      streak = ok ? streak + 1 : 0;
      countUp(scoreEl, score.right, (v) => fill(t.score, { right: v, total: score.total }), score.right - (ok ? 1 : 0));
      if (ok && !reduceMotion) {
        scoreEl.classList.remove('is-pop');
        void scoreEl.offsetWidth; // restart the pop
        scoreEl.classList.add('is-pop');
        if (streak % 3 === 0) confetti(button);
      }
      nextBtn.hidden = false;
      nextBtn.focus({ preventScroll: true });
    };

    const ask = () => {
      const pool = terms.filter((x) => x !== answer);
      answer = pool[Math.floor(Math.random() * pool.length)];
      const others = shuffle(terms.filter((x) => x.cat !== answer.cat)).slice(0, 3);
      sceneEl.textContent = answer.scene;
      choicesEl.replaceChildren(...shuffle([answer, ...others]).map((item) => {
        const li = document.createElement('li');
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'quiz__choice';
        b.dataset.id = item.id;
        b.textContent = item.name;
        b.addEventListener('click', () => choose(b, item));
        li.append(b);
        return li;
      }));
      feedback.textContent = '';
      nextBtn.hidden = true;
      done = false;
    };

    nextBtn.addEventListener('click', () => {
      ask();
      choicesEl.querySelector('.quiz__choice').focus({ preventScroll: true });
    });
    quiz.hidden = false;
    ask();
  }
})();
