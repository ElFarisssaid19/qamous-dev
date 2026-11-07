// Usage: node tools/build.mjs
// Writes index.html (the language redirect) and, for ar, fr and en, the four tab pages:
// index.html (dictionary), path.html, quiz.html and contribute.html, from terms.mjs and ui.mjs.
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { cats, terms } from './terms.mjs';
import { brand, site, repo, langs, langNames, locales, pages, ui, path } from './ui.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = (s) => esc(s).replace(/"/g, '&quot;');

// Prose typography per language; code keeps its straight quotes.
const typeset = (s, lang) => {
  let out = s.replace(/\.\.\./g, '…');
  if (lang !== 'ar') out = out.replace(/'/g, '’');
  if (lang === 'fr') out = out.replace(/ ([:;?!»])/g, '\u202F$1').replace(/« /g, '«\u202F');
  return out;
};
const typo = (s, lang) => typeset(esc(s), lang);

const commentMark = { JavaScript: '//', React: '//', Terminal: '#', YAML: '#', Dockerfile: '#', HTTP: '#', SQL: '--' };
const codeHtml = (lang, code) => code.split('\n').map((line) => {
  const mark = commentMark[lang];
  if (!mark) return esc(line);
  const m = line.match(new RegExp(`(^|\\s)(${mark.replace(/[/]/g, '\\/')}.*)$`));
  if (!m) return esc(line);
  const at = m.index + m[1].length;
  return esc(line.slice(0, at)) + `<span class="c">${esc(line.slice(at))}</span>`;
}).join('\n');
const fillCode = (t, lang) => t.code.replace(/\{\{(\d+)\}\}/g, (_, i) => t.c[lang][i]);

const svg = (paths, size = 22, stroke = 1.75) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const icons = {
  dict: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  path: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
  quiz: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  add: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/>',
};
const check = (label) => `<span class="check" hidden>${svg('<path d="M20 6 9 17l-5-5"/>', 18, 2)}<span class="visually-hidden">${label}</span></span>`;
const copyButton = (u) => `<button class="code__copy" type="button">${u.copy}</button>`;

const pageUrl = (lang, pg) => `${site}${lang}/${pg.file === 'index.html' ? '' : pg.file}`;
const fonts = {
  ar: 'family=IBM+Plex+Sans+Arabic:wght@400;600;700&family=JetBrains+Mono:wght@400&family=Onest:wght@400;600;700',
  fr: 'family=JetBrains+Mono:wght@400&family=Onest:wght@400;600;700',
  en: 'family=JetBrains+Mono:wght@400&family=Onest:wght@400;600;700',
};
// The animated mesh behind the glass: soft colour shapes, decorative only.
const backdrop = `  <div class="backdrop" aria-hidden="true">
    <span class="blob blob--majorelle"></span>
    <span class="blob blob--saffron"></span>
    <span class="blob blob--mint"></span>
    <span class="blob blob--sky"></span>
  </div>`;
const themeMeta = `  <meta name="color-scheme" content="light dark">
  <meta name="theme-color" content="#f1efe9" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#0a0c18" media="(prefers-color-scheme: dark)">`;
const byId = Object.fromEntries(terms.map((t) => [t.id, t]));

// One page: head, header with the tabs and the language switcher, the page's own content, footer, bottom tab bar.
const layout = (lang, key, { title, description, top, main, data }) => {
  const u = ui[lang];
  const pg = pages.find((p) => p.key === key);
  const rel = pg.file === 'index.html' ? '' : pg.file;
  const tabLinks = (withIcon) => pages.map((p) => `<li><a href="${p.href}"${p.key === key ? ' aria-current="page"' : ''}>${withIcon ? svg(icons[p.key]) : ''}<span>${u.tabs[p.key]}</span></a></li>`).join('\n          ');
  const switcher = langs.map((l) => `<li><a href="../${l}/${rel}" hreflang="${l}" lang="${l}" dir="${ui[l].dir}"${l === lang ? ' aria-current="page"' : ''}>${langNames[l]}</a></li>`).join('\n          ');
  const alternates = langs.map((l) => `  <link rel="alternate" hreflang="${l}" href="${pageUrl(l, pg)}">`).join('\n')
    + `\n  <link rel="alternate" hreflang="x-default" href="${key === 'dict' ? site : pageUrl('ar', pg)}">`;
  const jsData = JSON.stringify({ ...u.js, lang, total: terms.length }).replace(/</g, '\\u003c');
  const termData = data ? `\n  <script type="application/json" id="terms">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>` : '';

  return `<!doctype html>
<html lang="${lang}" dir="${u.dir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${attr(description)}">
  <link rel="canonical" href="${pageUrl(lang, pg)}">
${alternates}
  <meta property="og:site_name" content="${brand}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${attr(title)}">
  <meta property="og:description" content="${attr(description)}">
  <meta property="og:url" content="${pageUrl(lang, pg)}">
  <meta property="og:locale" content="${locales[lang]}">
${langs.filter((l) => l !== lang).map((l) => `  <meta property="og:locale:alternate" content="${locales[l]}">`).join('\n')}
  <meta name="twitter:card" content="summary">
${themeMeta}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?${fonts[lang]}&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
  <script>document.documentElement.classList.add('js');</script>
</head>
<body class="page-${key}">
  <a class="skip" href="#main">${u.skip}</a>
${backdrop}

  <header class="site-header">
    <nav class="nav container" aria-label="${attr(u.navLabel)}">
      <a class="wordmark" href="./" aria-label="${attr(u.home)}" dir="ltr">${brand}</a>
      <div class="nav__rows">
        <ul class="nav__links">
          ${tabLinks(false)}
        </ul>
        <ul class="langs" aria-label="${attr(u.langLabel)}">
          ${switcher}
        </ul>
      </div>
    </nav>
  </header>

  <main id="main">
${top}
${main}
  </main>

  <footer class="footer">
    <div class="container">
      <div class="footer__row">
      <p class="footer__mark"><a class="wordmark" href="./" aria-label="${attr(u.home)}" dir="ltr">${brand}</a></p>
      <p class="footer__line">${typo(u.footerLine, lang)}</p>
      <ul class="footer__links">
          ${tabLinks(false)}
      </ul>
      </div>
    </div>
  </footer>

  <nav class="tabbar" aria-label="${attr(u.navLabel)}">
    <ul>
          ${tabLinks(true)}
    </ul>
  </nav>

  <script type="application/json" id="ui">${jsData}</script>${termData}
  <script src="../js/vendor/lenis.min.js" defer></script>
  <script src="../js/app.js" defer></script>
</body>
</html>
`;
};

const pageHead = (inner) => `    <div class="container">
      <div class="page-head" data-reveal>
${inner}
      </div>
    </div>`;
const pageTitle = (lang, key) => `${esc(ui[lang].tabs[key])}${ui[lang].sep}${brand}`;
const plain = (s) => s.replace(/<[^>]+>/g, '');

// Dictionary
const entry = (t, lang) => {
  const L = t[lang], u = ui[lang];
  const showTerm = L.name.toLowerCase() !== t.term.toLowerCase();
  const search = [t.term, t.keys, L.name, L.scene].join(' ');
  return `        <details class="entry" id="${t.id}" data-cat="${t.cat}" data-terms="${attr(search)}" data-reveal>
          <summary>
            <span class="entry__term">${typo(L.name, lang)}${check(u.gotMark)}${showTerm ? `<span class="entry__en" lang="en" dir="ltr">${esc(t.term)}</span>` : ''}</span>
            <span class="entry__scene">${typo(`${u.like} ${L.scene}`, lang)}</span>
          </summary>
          <div class="entry__body">
            <div class="entry__words">
              <p class="entry__like">${typo(L.like, lang)}</p>
              <p class="entry__text">${typo(L.text, lang)}</p>
              <label class="got"><input type="checkbox" data-got="${t.id}"> ${u.got}</label>
            </div>
            <figure class="code" dir="ltr">
              <figcaption>${esc(t.lang === 'Terminal' ? u.terminal : t.lang)}</figcaption>
              ${copyButton(u)}
              <pre tabindex="0" data-lenis-prevent><code>${codeHtml(t.lang, t.c ? fillCode(t, lang) : t.code)}</code></pre>
            </figure>
          </div>
        </details>`;
};

const dictionary = (lang) => {
  const u = ui[lang];
  const chips = [`            <input type="radio" name="cat" id="cat-all" value="" checked><label for="cat-all">${u.all} <span class="chip__n">${terms.length}</span></label>`]
    .concat(cats.map((c) => `            <input type="radio" name="cat" id="cat-${c.id}" value="${c.id}"><label for="cat-${c.id}">${typo(c[lang], lang)} <span class="chip__n">${terms.filter((t) => t.cat === c.id).length}</span></label>`))
    .join('\n');
  const groups = cats.map((c) => `      <section class="group" data-group="${c.id}" aria-labelledby="g-${c.id}">
        <h3 class="group__head" id="g-${c.id}">${typo(c[lang], lang)}</h3>
${terms.filter((t) => t.cat === c.id).map((t) => entry(t, lang)).join('\n')}
      </section>`).join('\n');

  return layout(lang, 'dict', {
    title: typo(u.title, lang),
    description: u.description,
    top: `    <div class="container">
      <div class="hero" data-reveal>
        <h1 class="hero__head">${typo(u.headline, lang)}</h1>
        <p class="hero__lede">${typo(u.lede, lang)}</p>
      </div>
    </div>`,
    main: `    <div class="lookup">
      <div class="toolbar">
        <div class="toolbar__inner container">
          <form class="search" role="search" action="./">
            <label class="search__label" for="q">${u.searchLabel}</label>
            <div class="search__field">
              <input id="q" name="q" type="search" autocomplete="off" spellcheck="false" placeholder="${attr(u.placeholder)}" aria-keyshortcuts="/" aria-describedby="status">
              <kbd class="search__key" aria-hidden="true">/</kbd>
            </div>
          </form>
          <fieldset class="chips" data-lenis-prevent>
            <legend class="visually-hidden">${u.catLegend}</legend>
${chips}
          </fieldset>
        </div>
      </div>

      <section class="qamous container" id="dictionary" aria-labelledby="dictionary-head">
        <div class="qamous__top" data-reveal>
          <h2 class="qamous__head" id="dictionary-head">${typo(u.dictHead, lang)}</h2>
          <p class="qamous__status" id="status" role="status">${typo(u.hint, lang)}</p>
        </div>

        <div class="empty" id="empty" hidden>
          <p class="empty__head" id="empty-head"></p>
          <p>${typo(u.emptyText, lang)}</p>
          <button class="btn btn--quiet" type="button" id="clear">${u.clear}</button>
        </div>

${groups}
      </section>
    </div>`,
  });
};

// Path, with the "Got it" progress
const pathPage = (lang) => {
  const u = ui[lang];
  const stops = path.map((ids, i) => `        <li data-stage="${ids.join(' ')}" data-reveal>
          <h3>${typo(u.stages[i], lang)}</h3>
          <p class="stop__count"></p>
          <ul>${ids.map((id) => `<li><a href="./#${id}" data-term="${id}">${typo(byId[id][lang].name, lang)}${check(u.gotMark)}</a></li>`).join('')}</ul>
        </li>`).join('\n');
  return layout(lang, 'path', {
    title: pageTitle(lang, 'path'),
    description: u.pathText,
    top: pageHead(`      <h1 class="page-head__title">${typo(u.pathHead, lang)}</h1>
      <p class="page-head__lede">${typo(u.pathText, lang)}</p>`),
    main: `    <section class="path container" aria-labelledby="stages-head">
      <div class="progress" data-reveal>
        <p class="progress__text" id="progress" aria-live="polite"></p>
        <div class="meter" aria-hidden="true"><span class="meter__fill" id="meter"></span></div>
        <p class="progress__how">${typo(u.pathHow, lang)}</p>
      </div>
      <h2 class="path__head" id="stages-head" data-reveal>${typo(u.stagesHead, lang)}</h2>
      <ol class="path__stops">
${stops}
      </ol>
    </section>`,
    data: terms.map((t) => ({ id: t.id })),
  });
};

// Test yourself
const quizPage = (lang) => {
  const u = ui[lang];
  return layout(lang, 'quiz', {
    title: pageTitle(lang, 'quiz'),
    description: `${u.quizHead} ${u.quizText}`,
    top: pageHead(`      <h1 class="page-head__title">${typo(u.quizHead, lang)}</h1>
      <p class="page-head__lede">${typo(u.quizText, lang)}</p>
      <p class="quiz__score" id="quiz-score" aria-live="polite"></p>`),
    main: `    <section class="quiz container" aria-label="${attr(u.tabs.quiz)}">
      <p class="quiz__nojs">${typo(u.quizNoJs, lang)}</p>
      <div class="quiz__card" id="quiz" data-reveal hidden>
        <p class="quiz__scene" id="quiz-scene"></p>
        <ul class="quiz__choices" id="quiz-choices" aria-labelledby="quiz-scene"></ul>
        <p class="quiz__feedback" id="quiz-feedback" aria-live="polite"></p>
        <button class="btn" type="button" id="quiz-next">${u.quizNext}</button>
      </div>
    </section>`,
    data: terms.map((t) => ({ id: t.id, cat: t.cat, name: typeset(t[lang].name, lang), scene: typeset(`${u.like} ${t[lang].scene}`, lang) })),
  });
};

// Add a term
const contributePage = (lang) => {
  const u = ui[lang];
  const steps = u.steps.map(([text, cmd]) => `        <li data-reveal>
          <p>${typeset(text, lang)}</p>${cmd ? `\n          <code class="cmd" dir="ltr">${esc(cmd)}</code>` : ''}
        </li>`).join('\n');
  return layout(lang, 'add', {
    title: pageTitle(lang, 'add'),
    description: plain(u.addText),
    top: pageHead(`      <h1 class="page-head__title">${typo(u.addHead, lang)}</h1>
      <p class="page-head__lede">${typeset(u.addText, lang)}</p>`),
    main: `    <section class="steps container" aria-label="${attr(u.tabs.add)}">
      <p class="steps__repo" data-reveal>${typo(u.repoLine, lang)} <a href="${repo}" dir="ltr">${repo.replace('https://', '')}</a></p>
      <ol class="steps__list">
${steps}
      </ol>
      <figure class="code code--wide" dir="ltr" data-reveal>
        <figcaption>tools/terms.mjs</figcaption>
        ${copyButton(u)}
        <pre tabindex="0" data-lenis-prevent><code>{
  id: <span class="s">'api'</span>,
  cat: <span class="s">'web'</span>,
  term: <span class="s">'API'</span>,
  code: <span class="s">\`fetch(…)\`</span>,
  en: { name: <span class="s">'API'</span>, scene: <span class="s">'the café waiter'</span>, … },
  fr: { … },
  ar: { … },
}</code></pre>
      </figure>
    </section>`,
  });
};

// The root page picks the visitor's language (Arabic by default) and keeps ?q=, &cat= and #term.
const redirect = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${brand}</title>
  <meta name="description" content="${attr(ui.ar.description)}">
  <link rel="canonical" href="${site}">
${langs.map((l) => `  <link rel="alternate" hreflang="${l}" href="${site}${l}/">`).join('\n')}
  <link rel="alternate" hreflang="x-default" href="${site}">
  <meta property="og:site_name" content="${brand}">
  <meta property="og:title" content="${brand}">
  <meta property="og:url" content="${site}">
  <script>
    (function () {
      var supported = ${JSON.stringify(langs)}, pick = 'ar';
      var prefs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
      for (var i = 0; i < prefs.length; i++) {
        var code = String(prefs[i]).slice(0, 2).toLowerCase();
        if (supported.indexOf(code) > -1) { pick = code; break; }
      }
      var page = location.protocol === 'file:' ? 'index.html' : '';
      location.replace(pick + '/' + page + location.search + location.hash);
    })();
  </script>
${themeMeta}
  <link href="https://fonts.googleapis.com/css2?${fonts.ar}&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body class="pick">
${backdrop}
  <main class="pick__main container">
    <div class="pick__card">
      <p class="wordmark"><bdi>${brand}</bdi></p>
      <ul class="pick__langs">
${langs.map((l) => `        <li><a href="${l}/" hreflang="${l}" lang="${l}" dir="${ui[l].dir}">${langNames[l]}</a></li>`).join('\n')}
      </ul>
    </div>
  </main>
</body>
</html>
`;

const missing = terms.flatMap((t) => langs.filter((l) => !t[l]?.name || !t[l]?.scene || !t[l]?.like || !t[l]?.text || (t.c && !t.c[l])).map((l) => `${t.id}:${l}`));
if (missing.length) throw new Error(`missing text: ${missing.join(', ')}`);

const builders = { dict: dictionary, path: pathPage, quiz: quizPage, add: contributePage };
for (const lang of langs) {
  mkdirSync(`${root}${lang}`, { recursive: true });
  for (const pg of pages) writeFileSync(`${root}${lang}/${pg.file}`, builders[pg.key](lang));
}
writeFileSync(`${root}index.html`, redirect);
console.log(`${terms.length} entries, ${pages.length} pages × ${langs.length} languages (${pages.map((p) => p.file).join(', ')}), plus the index.html redirect`);
