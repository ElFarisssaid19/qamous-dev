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
  const lenis = !reduceMotion && !touchFirst && typeof window.Lenis === 'function'
    ? new window.Lenis({ autoRaf: true, lerp: 0.1, smoothWheel: true })
    : null;
  const stickyOffset = () => parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
  const scrollToEl = (el, immediate = false) => {
    if (lenis) lenis.scrollTo(el, { offset: -stickyOffset(), immediate, force: true });
    else el.scrollIntoView({ block: 'start', behavior: immediate || reduceMotion ? 'auto' : 'smooth' });
  };

  const header = document.querySelector('.site-header');
  const backdrop = document.querySelector('.backdrop');
  let ticking = false;
  let idle;
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        header.classList.toggle('is-scrolled', y > 40);
        if (!reduceMotion) backdrop.style.setProperty('--parallax', `${Math.round(Math.min(y, 1600))}px`);
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
  if (!reduceMotion && 'IntersectionObserver' in window) {
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
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
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

    const apply = ({ syncUrl = true } = {}) => {
      const raw = input.value.trim();
      const words = fold(raw).split(/\s+/).filter(Boolean);
      const cat = (chips.find((c) => c.checked) || {}).value || '';
      let shown = 0;
      for (const item of index) {
        const inCat = !cat || item.cat === cat;
        const hit = words.every((w) => item.term.includes(w) || item.text.includes(w));
        item.el.hidden = !(inCat && hit);
        if (!item.el.hidden) shown += 1;
      }
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

    input.addEventListener('input', () => apply());
    chips.forEach((c) => c.addEventListener('change', () => apply()));

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
        apply();
      }
    });

    document.getElementById('clear').addEventListener('click', () => {
      input.value = '';
      chips[0].checked = true;
      apply();
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
    if (location.hash && document.fonts) {
      const startY = window.scrollY;
      document.fonts.ready.then(() => {
        root.style.setProperty('--toolbar-h', `${toolbar.offsetHeight}px`);
        if (Math.abs(window.scrollY - startY) < 4) openFromHash(true);
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
    progress.textContent = fill(t.progress, { n, total: t.total });
    document.getElementById('meter').style.transform = `scaleX(${n / t.total})`;
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
    let answer = null;
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
      scoreEl.textContent = fill(t.score, score);
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
