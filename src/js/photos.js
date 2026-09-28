/* ==========================================================================
   photos.js — Smart DCC photography for the design layer (V2)

   Swaps the illustrated placeholders for Smart DCC's own photography and
   homepage video, loaded directly from smartdcc.co.uk. Each image is only
   applied once it has loaded, so anywhere the images can't be reached the
   illustrated placeholder stays in place. Photography © Smart DCC, used here
   to show how the proposals would look on the live site.
   ========================================================================== */

(function () {
  'use strict';

  var BASE = 'https://www.smartdcc.co.uk/media/';
  function u(path, w) { return BASE + path + '?width=' + (w || 1200) + '&quality=80'; }

  /* Static placeholders, matched on their label text */
  var LABEL = {
    'photo · about dcc': u('g1yeqgs4/210929_33_dcc_0532.jpg'),
    'photo · innovation': u('1726/homepage2.jpg'),
    'photo · careers': u('3bmduec3/img_0815.jpg'),
    'the front door': u('o5mfqyh5/dcc_hero_video_1440x700_0001.png', 900),
    'consultations': u('1123/man-in-meeting.jpg', 900),
    'find anything': u('x34b3ilq/img_4826.jpg', 900),
    'status and performance': u('1073/on-call.jpg', 900),
    'joining the network': u('jx2po0bd/testing-at-brabazon-4.jpg', 900)
  };

  /* The homepage hero video, as on the live site */
  var HERO_VIDEO = BASE + 'l5lmpa4r/dcc_hero_video_1440x700_260522.mp4';
  var HERO_POSTER = u('o5mfqyh5/dcc_hero_video_1440x700_0001.png', 1440);

  /* A photo behind each page head, chosen to match what the page is about */
  var BAND = {
    'ownership.html': u('abaj0h2c/wan.jpg', 1800),
    'public.html': u('sy4pzpai/couple-crop.jpeg', 1800),
    'consultations.html': u('1236/board-of-people.jpg', 1800),
    'consultation.html': u('7010/210929_33_dcc_0429.png', 1800),
    'events.html': u('1123/man-in-meeting.jpg', 1800),
    'search.html': u('6799/lines-min.jpg', 1800),
    'documents.html': u('1286/software.jpg', 1800),
    'glossary.html': u('1156/smart-infrastructure.jpg', 1800),
    'status.html': u('6467/toc1-medium.jpg', 1800),
    'performance.html': u('6474/toc3.jpg', 1800),
    'programmes.html': u('1476/networkupdateshero.jpg', 1800),
    'join.html': u('6975/210929_33_dcc_0872.jpg', 1800),
    'partner-enquiry.html': u('1178/test-lab.jpg', 1800)
  };
  var HUB = u('1727/aboutushero.jpg', 1800);

  function file() { return window.location.pathname.split('/').pop() || 'index.html'; }

  /* Apply a photo once it has loaded; leave the illustration if it fails. */
  function whenLoaded(src, fn) {
    var img = new Image();
    img.onload = function () { fn(src); };
    img.src = src;
  }
  function photo(el, src) {
    if (!el || !src || el.getAttribute('data-photo')) return;
    el.setAttribute('data-photo', src);
    whenLoaded(src, function () {
      el.style.backgroundImage = 'url("' + src + '")';
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
      el.classList.add('has-photo');
      if (!el.hasAttribute('role') && !el.closest('[aria-hidden="true"]')) {
        el.setAttribute('role', 'img');
        el.setAttribute('aria-label', el.textContent.replace(/^photo · /i, '').trim() || 'Photo');
      }
    });
  }
  function band(el, src) {
    if (!el || !src) return;
    whenLoaded(src, function () {
      el.style.setProperty('--band-photo', 'url("' + src + '")');
      el.classList.add('has-photo');
    });
  }

  /* Hero video: muted, looping, with a pause button (WCAG 2.2.2). Shows the
     poster only for people who prefer reduced motion. */
  function heroVideo(el) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { photo(el, HERO_POSTER); return; }
    var v = document.createElement('video');
    v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
    v.poster = HERO_POSTER;
    v.src = HERO_VIDEO;
    v.addEventListener('loadeddata', function () {
      el.classList.add('has-video');
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'video-toggle'; b.textContent = 'Pause video';
      b.addEventListener('click', function () {
        if (v.paused) { v.play(); b.textContent = 'Pause video'; } else { v.pause(); b.textContent = 'Play video'; }
      });
      el.appendChild(b);
    });
    v.addEventListener('error', function () { photo(el, HERO_POSTER); });
    el.appendChild(v);
    var p = v.play && v.play(); if (p && p.catch) p.catch(function () { /* autoplay blocked: poster shows */ });
  }

  function applyAll() {
    document.querySelectorAll('.wf-placeholder').forEach(function (el) {
      var key = (el.textContent || '').trim().toLowerCase();
      if (key === 'hero video, as now') { heroVideo(el); return; }
      if (LABEL[key]) photo(el, LABEL[key]);
    });
    var b = document.querySelector('.band');
    if (b) band(b, BAND[file()]);
    var hub = document.querySelector('.hub-hero');
    if (hub) band(hub, HUB);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyAll);
  else applyAll();
})();
