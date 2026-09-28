# Smart DCC — website improvement prototypes (V1)

Five clickable prototypes for improvements to smartdcc.co.uk, prepared by ClerksWell following the
phase 1 review (28 September 2026). This is the greyscale version: structure and behaviour first.
The design layer will go in `src/css/theme.css`, which is empty for now.

## View
Live: https://hrhlescargotleo.github.io/Smart-DCC-Roadmap/

Or open `docs/index.html` in a browser. No server or install needed.

GitHub Pages publishes from the `docs/` folder on `main`
(Settings → Pages → Deploy from a branch → `main` / `/docs`).

## Prototypes
1. The front door — `pages/home.html`, `pages/ownership.html`, `pages/public.html`
2. Consultations and engagement — `pages/consultations.html`, `pages/consultation.html?c=<id>`, `pages/events.html`
3. Find anything — `pages/search.html`, `pages/documents.html`, `pages/glossary.html`
4. Status and performance — `pages/status.html`, `pages/performance.html`, `pages/programmes.html`
5. Joining the network — `pages/join.html`, `pages/partner-enquiry.html`

Module library: `modules/library.html`. Requirements: `requirements/requirements.md`.

## Build
```
node build-includes.js && node validate.js
```
Edit files in `src/`; `docs/` is generated (commit it, as GitHub Pages serves it).
The prototype navigator, sub-page bars and previous/next footer live in `src/includes/`.
Content is in `src/js/data.js`: figures marked live come from smartdcc.co.uk on 28 September 2026,
everything else is sample data.

## Status
V1, greyscale prototypes for internal review. Smart DCC's own header and footer are replaced by a
prototype navigator. Notes are off by default; switch "Notes on" in the top bar to show what each
prototype proposes and why, plus in-page annotations.
