# Qamous Dev

An open dictionary of 40 programming concepts (Git, API, REST, JSON, Docker, JWT, React state and props, SQL JOIN…) for beginners in Morocco. Each term comes with a short explanation, an analogy from Moroccan life (the café waiter for an API, the Tanger Med containers for Docker) and a small code example, in Arabic, French and English.

Site: https://elfarisssaid19.github.io/qamous-dev/

## Pages

Each language has its own folder (`ar/`, `fr/`, `en/`) with four tabs:

| File | Tab |
| --- | --- |
| `index.html` | Dictionary: live search, topic filters, the 40 entries |
| `path.html` | Path: 20 terms in learning order, with your “Got it” progress |
| `quiz.html` | Test yourself: match a scene to its term |
| `contribute.html` | Add a term |

The root `index.html` sends visitors to their browser language (Arabic by default) and keeps `?q=`, `&cat=` and `#term`, so `/?q=docker#docker` opens the Docker entry. Without JavaScript it shows links to the three languages, and every dictionary entry stays readable.

“Got it” progress is stored in the visitor's browser (`localStorage`) and shared by the three languages.

## Add or edit a term

1. Edit `tools/terms.mjs`: each term is one object with its `name`, `scene`, `like` (the analogy) and `text` in `ar`, `fr` and `en`, plus a code sample.
2. Rebuild every page:

   ```sh
   node tools/build.mjs
   ```

3. Commit the generated HTML with your change and open a pull request.

Interface text (tabs, buttons, headings) lives in `tools/ui.mjs`. The build stops with an error if a term is missing text in one of the languages.

## Structure

```
index.html          language redirect
favicon.svg         site icon
ar/ fr/ en/         generated pages, four per language
css/style.css       the liquid glass theme (light and dark)
js/vendor/          Lenis 1.3.26 smooth scrolling, MIT
js/app.js           search, filters, progress, quiz, copy buttons
tools/terms.mjs     the 40 terms
tools/ui.mjs        interface text, site and repo URLs
tools/build.mjs     page generator (Node 18 or later, no dependencies)
```

## Deploy

The site is static and needs no build step on the server. On GitHub, open Settings, then Pages, and publish the `main` branch from the root folder.

To preview locally, serve the folder rather than opening the files directly:

```sh
python3 -m http.server 8000
```
