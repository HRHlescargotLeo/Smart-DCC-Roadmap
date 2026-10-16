# Smart DCC — website improvement prototypes (V3)

Clickable prototypes for improvements to smartdcc.co.uk, in two sets: four big improvements and 21 quick wins,, prepared by ClerksWell following the
phase 1 review (28 September 2026). The Smart DCC design layer (colours, Lato, pill buttons, gradient page
heads) lives entirely in `src/css/theme.css`; remove that file to get the greyscale prototypes back.

Photography and the homepage hero video are Smart DCC's own, loaded directly from smartdcc.co.uk by
`src/js/photos.js` (the mapping of images to pages lives there). Where they can't load, brand-colour
illustrated placeholders show instead. Photography © Smart DCC; the repository and site are public,
so treat them accordingly. The DCC logo is not reproduced; the wordmark is drawn in Lato.

## View
Live: https://hrhlescargotleo.github.io/Smart-DCC-Roadmap/

Or open `docs/index.html` in a browser. No server or install needed.

GitHub Pages publishes from the `docs/` folder on `main`
(Settings → Pages → Deploy from a branch → `main` / `/docs`).

## Big improvements
1. The front door — `pages/home.html`, `pages/ownership.html`, `pages/public.html`
2. Consultations and engagement — `pages/consultations.html`, `pages/consultation.html?c=<id>`, `pages/events.html`
3. Status and performance — `pages/status.html`, `pages/performance.html`, `pages/programmes.html`
4. Joining the network — `pages/join.html`, `pages/partner-enquiry.html`

Parked: the Find anything prototype (`pages/search.html`, `pages/documents.html`, `pages/glossary.html`)
is kept in the repo but not linked from anywhere in the pack, as search is now a separate project.

## Quick wins
21 smaller improvements, each on its own page in `quick/` with what the site does now and what it would
do after the change. The navigator's second tab ("Quick wins") lists them, and the hub has a matching tab
(`index.html#quick-wins`). No estimates appear anywhere in the pack.

The quick-win pages are generated: edit `gen-quick-wins.py` (content as data) and run
`python3 gen-quick-wins.py` from the repo root before building. It writes `src/quick/*.html`,
`src/includes/quick-links.html` and `src/includes/quick-cards.html`.

Module library: `modules/library.html`. Requirements: `requirements/requirements.md`.

## Build
```
python3 gen-quick-wins.py && node build-includes.js && node validate.js
```
Edit files in `src/`; `docs/` is generated (commit it, as GitHub Pages serves it).
The prototype navigator, sub-page bars and previous/next footer live in `src/includes/`.
Content is in `src/js/data.js`: figures marked live come from smartdcc.co.uk on 28 September 2026,
everything else is sample data.

## Status
V3: big improvements plus 21 quick wins, designed, for internal review. V1 (greyscale) is the same pack without theme.css. Smart DCC's own header and footer are replaced by a
prototype navigator. Notes are off by default; switch "Notes on" in the top bar to show what each
prototype proposes and why, plus in-page annotations.
