/* ==========================================================================
   wireframe.js — shared interaction behaviour for lo-fi wireframes.

   Everything here is driven by data attributes and classes, so pages stay
   declarative and no page needs its own inline script. Keep it that way: a
   wireframe pack with five slightly different accordion implementations is
   how nav bugs get reported in a client review.

   All patterns are keyboard-operable and dismissible with Escape, because
   accessibility is cheaper to design in at wireframe stage than to retrofit.
   ========================================================================== */

(function () {
  'use strict';

  /* --- Navigation flyouts ------------------------------------------------
     Opened on hover AND focus. Hover alone would make the whole navigation
     unusable by keyboard, which is the single most common wireframe defect
     that survives into build. */
  function initNav() {
    var backdrop = document.querySelector('.flyout-backdrop');
    var items = document.querySelectorAll('.nav-item');

    function closeAll() {
      document.querySelectorAll('.nav-item.open').forEach(function (i) {
        i.classList.remove('open');
      });
      if (backdrop) backdrop.classList.remove('active');
    }

    items.forEach(function (item) {
      var flyout = item.querySelector('.nav-flyout');
      if (!flyout) return;

      var trigger = item.querySelector('.nav-link');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-haspopup', 'true');
      }

      function open() {
        closeAll();
        item.classList.add('open');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
        if (backdrop) backdrop.classList.add('active');
      }

      function close() {
        item.classList.remove('open');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
        if (backdrop) backdrop.classList.remove('active');
      }

      item.addEventListener('mouseenter', open);
      item.addEventListener('mouseleave', close);
      item.addEventListener('focusin', open);
      item.addEventListener('focusout', function () {
        window.setTimeout(function () {
          if (!item.contains(document.activeElement)) close();
        }, 10);
      });

      if (trigger) {
        trigger.addEventListener('click', function (ev) {
          if (trigger.getAttribute('href') === '#') {
            ev.preventDefault();
            item.classList.contains('open') ? close() : open();
          }
        });
      }
    });

    if (backdrop) backdrop.addEventListener('click', closeAll);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
    });
  }

  /* --- Accordions --------------------------------------------------------
     Markup: <div class="accordion-item"><button class="accordion-title">…
     Multiple panels may be open at once unless the .accordion carries
     data-single. */
  function initAccordions() {
    document.querySelectorAll('.accordion-title').forEach(function (title) {
      var startOpen = title.closest('.accordion-item').classList.contains('open');
      title.setAttribute('aria-expanded', startOpen ? 'true' : 'false');
      title.addEventListener('click', function () {
        var item = title.closest('.accordion-item');
        var group = title.closest('.accordion');
        var willOpen = !item.classList.contains('open');

        if (group && group.hasAttribute('data-single')) {
          group.querySelectorAll('.accordion-item.open').forEach(function (o) {
            o.classList.remove('open');
            var t = o.querySelector('.accordion-title');
            if (t) t.setAttribute('aria-expanded', 'false');
          });
        }

        item.classList.toggle('open', willOpen);
        title.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    });
  }

  /* --- Tabs --------------------------------------------------------------
     Markup: <button class="tab" data-tab="panel-id"> and
             <div class="tab-panel" id="panel-id"> */
  function initTabs() {
    document.querySelectorAll('.tabs').forEach(function (group) {
      var tabs = group.querySelectorAll('.tab');
      tabs.forEach(function (tab) {
        tab.setAttribute('role', 'tab');
        tab.addEventListener('click', function () {
          tabs.forEach(function (t) {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');

          var target = document.getElementById(tab.getAttribute('data-tab'));
          if (!target) return;
          var container = target.parentElement;
          container.querySelectorAll('.tab-panel').forEach(function (p) {
            p.classList.remove('active');
          });
          target.classList.add('active');
        });
      });
    });
  }

  /* --- Carousels ---------------------------------------------------------
     Markup: <div class="carousel" data-autoplay="6000"> containing
             .carousel-track > .carousel-item, .carousel-arrow[data-dir],
             and an empty .carousel-indicators which is populated here. */
  function initCarousels() {
    document.querySelectorAll('.carousel').forEach(function (carousel) {
      var track = carousel.querySelector('.carousel-track');
      if (!track) return;
      var items = track.querySelectorAll('.carousel-item');
      var dotsHost = carousel.querySelector('.carousel-indicators');
      var index = 0;
      var timer = null;

      function render() {
        track.style.transform = 'translateX(-' + index * 100 + '%)';
        if (!dotsHost) return;
        dotsHost.querySelectorAll('.carousel-dot').forEach(function (d, i) {
          d.classList.toggle('active', i === index);
          d.setAttribute('aria-current', i === index ? 'true' : 'false');
        });
      }

      function go(n) {
        index = (n + items.length) % items.length;
        render();
      }

      if (dotsHost) {
        items.forEach(function (_, i) {
          var dot = document.createElement('button');
          dot.className = 'carousel-dot';
          dot.type = 'button';
          dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
          dot.addEventListener('click', function () { go(i); });
          dotsHost.appendChild(dot);
        });
      }

      carousel.querySelectorAll('.carousel-arrow').forEach(function (arrow) {
        arrow.addEventListener('click', function () {
          go(index + (arrow.getAttribute('data-dir') === 'prev' ? -1 : 1));
        });
      });

      var interval = parseInt(carousel.getAttribute('data-autoplay'), 10);
      if (interval > 0) {
        var start = function () { timer = window.setInterval(function () { go(index + 1); }, interval); };
        var stop = function () { window.clearInterval(timer); };
        start();
        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('focusin', stop);
        carousel.addEventListener('mouseleave', start);
      }

      render();
    });
  }

  /* --- Modals ------------------------------------------------------------
     Markup: any element with data-modal-open="modal-id", and
             <div class="wf-modal" id="modal-id"> */
  function initModals() {
    function close(modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-modal-open]').forEach(function (trigger) {
      trigger.addEventListener('click', function (ev) {
        ev.preventDefault();
        var modal = document.getElementById(trigger.getAttribute('data-modal-open'));
        if (!modal) return;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        var panel = modal.querySelector('.wf-modal-panel');
        if (panel) {
          panel.setAttribute('tabindex', '-1');
          panel.focus();
        }
      });
    });

    document.querySelectorAll('.wf-modal').forEach(function (modal) {
      modal.addEventListener('click', function (ev) {
        if (ev.target === modal || ev.target.classList.contains('wf-modal-close')) close(modal);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.wf-modal.open').forEach(close);
    });
  }

  /* --- Notes toggle -------------------------------------------------------
     A switch in the prototype navigator shows or hides everything marked
     as a note: the "what we're proposing and why" panel at the top of each
     prototype and the numbered annotations within it. Off by default; the
     choice is remembered for the session so it carries between prototypes. */
  function initNotes() {
    var hidden = true;
    try { hidden = window.sessionStorage.getItem('wf-notes-hidden') !== '0'; } catch (e) { /* private mode */ }
    var toggles = document.querySelectorAll('[data-notes-toggle]');
    if (!document.querySelector('.wf-note, .proposal')) {
      toggles.forEach(function (t) { t.hidden = true; });
      return;
    }

    function apply() {
      document.body.classList.toggle('wf-notes-hidden', hidden);
      toggles.forEach(function (t) {
        t.setAttribute('aria-checked', hidden ? 'false' : 'true');
        var l = t.querySelector('.notes-label');
        if (l) l.textContent = hidden ? 'Notes off' : 'Notes on';
      });
    }
    toggles.forEach(function (t) {
      t.addEventListener('click', function () {
        hidden = !hidden;
        try { window.sessionStorage.setItem('wf-notes-hidden', hidden ? '1' : '0'); } catch (e) { /* private mode */ }
        apply();
        if (!hidden) {
          var panel = document.querySelector('.proposal');
          if (panel && panel.getBoundingClientRect().top < 0) panel.scrollIntoView({ block: 'start' });
        }
      });
    });
    apply();
  }

  /* --- Prototype navigator: current page and previous / next ------------- */
  function initProtoNav() {
    var file = (window.location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';
    var links = Array.prototype.slice.call(document.querySelectorAll('.proto-links a[data-proto]'));
    var index = -1;
    links.forEach(function (a, i) {
      var match = a.getAttribute('data-proto').split(' ').indexOf(file) !== -1;
      if (match) { a.setAttribute('aria-current', 'page'); index = i; }
    });
    var current = document.querySelector('.proto-links a[aria-current]');
    if (current && current.scrollIntoView && window.innerWidth < 1024) {
      var list = current.closest('.proto-links');
      if (list) list.scrollLeft = current.offsetLeft - 16;
    }
    var pager = document.querySelector('[data-proto-pager]');
    if (!pager || index < 0) return;
    function label(a) { return a.textContent.replace(/\s+/g, ' ').trim(); }
    var html = '';
    if (index > 0) html += '<a class="prev" href="' + links[index - 1].getAttribute('href') + '"><span class="wf-meta">Previous</span>' + label(links[index - 1]) + '</a>';
    else html += '<span></span>';
    if (index < links.length - 1) html += '<a class="next" href="' + links[index + 1].getAttribute('href') + '"><span class="wf-meta">Next</span>' + label(links[index + 1]) + '</a>';
    pager.innerHTML = html;
  }


  /* ======================================================================
     Smart DCC prototype behaviour (V1)
     Driven by ids and data attributes on the pages. Content comes from
     data.js: figures marked live are from smartdcc.co.uk, the rest is sample.
     ====================================================================== */

  var TODAY = new Date((window.DCC_TODAY || '2026-09-28') + 'T12:00:00');
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function d(iso) { return new Date(iso + 'T12:00:00'); }
  function dots(iso) { var x = d(iso); return ('0' + x.getDate()).slice(-2) + '.' + ('0' + (x.getMonth() + 1)).slice(-2) + '.' + x.getFullYear(); }
  function longDate(iso) { var x = d(iso); return x.getDate() + ' ' + MONTHS[x.getMonth()] + ' ' + x.getFullYear(); }
  function daysUntil(iso) { return Math.round((d(iso) - TODAY) / 86400000); }
  function num(n) { return Number(n).toLocaleString('en-GB'); }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function ss(key, val) {
    try {
      if (val === undefined) return window.sessionStorage.getItem(key);
      if (val === null) window.sessionStorage.removeItem(key); else window.sessionStorage.setItem(key, val);
    } catch (e) { /* private mode */ }
    return null;
  }

  /* Links built in script can't use the ~/ build prefix, so work out where
     the pages folder is from the current location. */
  function pageHref(file) {
    var p = window.location.pathname;
    if (p.indexOf('/pages/') !== -1) return file;
    if (p.indexOf('/modules/') !== -1) return '../pages/' + file;
    return 'pages/' + file;
  }

  /* Query parameters (?c=, ?q=, ?type=) carry context between pages. Some hosts
     strip the query string, so the last clicked link's query is kept too. */
  function currentFile() { return (window.location.pathname.split('/').pop() || 'index.html'); }
  function param(name) {
    var v = null;
    try { v = new URLSearchParams(window.location.search).get(name); } catch (e) { v = null; }
    if (v) return v;
    try {
      var saved = JSON.parse(ss('dcc-q') || 'null');
      if (saved && saved.file === currentFile()) return new URLSearchParams(saved.q).get(name);
    } catch (e) { /* ignore */ }
    return null;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (href.indexOf('?') !== -1) ss('dcc-q', JSON.stringify({ file: href.split('?')[0].split('/').pop(), q: href.split('?')[1].split('#')[0] }));
    else if (href.charAt(0) !== '#') ss('dcc-q', null);
  }, true);

  /* --- Toast ------------------------------------------------------------ */
  var toastTimer = null;
  function toast(msg) {
    var t = $('#wf-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'wf-toast';
      t.className = 'toast';
      t.setAttribute('role', 'status');
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { t.hidden = true; }, 2800);
  }

  /* --- Header height, used by sticky filters ----------------------------- */
  function initHeaderHeight() {
    var header = $('.site-header');
    if (!header) return;
    function set() { document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px'); }
    set();
    window.addEventListener('resize', set);
  }

  /* --- Sub-page switcher -------------------------------------------------- */
  function initSubNav() {
    var file = currentFile().replace('.html', '');
    $all('.proto-sub a[data-sub]').forEach(function (a) {
      if (a.getAttribute('data-sub') === file) a.setAttribute('aria-current', 'page');
    });
  }

  /* --- Drawers ------------------------------------------------------------ */
  var lastDrawerTrigger = null;
  function openDrawer(id, trigger) {
    var dr = document.getElementById(id);
    if (!dr) return;
    lastDrawerTrigger = trigger || null;
    dr.classList.add('open');
    document.body.style.overflow = 'hidden';
    var panel = $('.drawer-panel', dr);
    if (panel) { panel.setAttribute('tabindex', '-1'); panel.focus(); }
  }
  function closeDrawer(dr) {
    dr.classList.remove('open');
    document.body.style.overflow = '';
    if (lastDrawerTrigger) lastDrawerTrigger.focus();
  }
  function initDrawers() {
    $all('[data-drawer-open]').forEach(function (t) {
      t.addEventListener('click', function (e) { e.preventDefault(); openDrawer(t.getAttribute('data-drawer-open'), t); });
    });
    $all('.drawer').forEach(function (dr) {
      dr.addEventListener('click', function (e) {
        if (e.target === dr || e.target.closest('.drawer-close') || e.target.closest('[data-drawer-close]')) closeDrawer(dr);
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      $all('.drawer.open').forEach(closeDrawer);
    });
  }

  /* --- Form validation ---------------------------------------------------- */
  function validateForm(form) {
    var first = null;
    $all('[required]', form).forEach(function (input) {
      if (input.closest('[hidden]')) return;
      var field = input.closest('.field') || input.closest('fieldset');
      var ok = input.type === 'email' ? /.+@.+\..+/.test(input.value)
        : input.type === 'checkbox' ? input.checked
        : input.type === 'radio' ? !!$('[name="' + input.name + '"]:checked', form)
        : input.value.trim() !== '';
      if (field) {
        field.classList.toggle('has-error', !ok);
        var err = $('.field-error', field);
        if (err) err.hidden = ok;
      }
      if (!ok && !first) first = input;
    });
    if (first) { first.focus(); return false; }
    return true;
  }
  function focusHeading(el) {
    var h = $('h2, h3', el);
    if (h) { h.setAttribute('tabindex', '-1'); h.focus(); }
  }

  /* --- Copy buttons (email addresses shown as text) ---------------------- */
  function initCopy() {
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-copy]');
      if (!b) return;
      var text = b.getAttribute('data-copy');
      var done = function () { toast('Copied ' + text); };
      try { navigator.clipboard.writeText(text).then(done, function () { toast('Select the address to copy it'); }); }
      catch (err) { toast('Select the address to copy it'); }
    });
  }

  /* --- Calendar files (.ics) ---------------------------------------------- */
  function downloadICS(title, iso, time, where) {
    var start = iso.replace(/-/g, '');
    var t = (time || '09:00').split(/[–-]/)[0].replace(':', '') + '00';
    var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Smart DCC prototype//EN', 'BEGIN:VEVENT',
      'UID:' + slug(title) + '-' + start + '@prototype', 'DTSTAMP:20260928T090000Z',
      'DTSTART:' + start + 'T' + t, 'SUMMARY:' + title, 'LOCATION:' + (where || ''), 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    try {
      var url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
      var a = document.createElement('a'); a.href = url; a.download = slug(title) + '.ics';
      document.body.appendChild(a); a.click(); a.remove();
      window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    } catch (e) { /* ignore */ }
    toast('Added to your calendar: ' + title);
  }
  function downloadCSV(name, rows) {
    var csv = rows.map(function (r) { return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(','); }).join('\r\n');
    try {
      var url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      var a = document.createElement('a'); a.href = url; a.download = name + '.csv';
      document.body.appendChild(a); a.click(); a.remove();
      window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    } catch (e) { /* ignore */ }
    toast('Downloaded ' + name + '.csv');
  }

  /* --- Glossary terms in running text (R34) --------------------------------
     <button class="term" data-term="DUIS">DUIS</button> shows a definition. */
  var GLOSS = window.DCC_GLOSSARY || [];
  function findTerm(key) {
    key = String(key).toLowerCase();
    for (var i = 0; i < GLOSS.length; i++) if (GLOSS[i].term.toLowerCase() === key) return GLOSS[i];
    return null;
  }
  function initTerms() {
    var pop = null, owner = null;
    function close() { if (pop) { pop.remove(); pop = null; if (owner) owner.setAttribute('aria-expanded', 'false'); } }
    document.addEventListener('click', function (e) {
      var t = e.target.closest('.term');
      if (!t) { if (pop && !e.target.closest('.term-pop')) close(); return; }
      e.preventDefault();
      if (owner === t && pop) { close(); owner = null; return; }
      close();
      var g = findTerm(t.getAttribute('data-term'));
      if (!g) return;
      owner = t;
      t.setAttribute('aria-expanded', 'true');
      pop = document.createElement('div');
      pop.className = 'term-pop';
      pop.setAttribute('role', 'dialog');
      pop.setAttribute('aria-label', g.term);
      pop.innerHTML = '<b>' + esc(g.term) + (g.full ? ': ' + esc(g.full) : '') + '</b>' + esc(g.def);
      document.body.appendChild(pop);
      var r = t.getBoundingClientRect();
      var left = Math.min(window.scrollX + r.left, window.scrollX + document.documentElement.clientWidth - pop.offsetWidth - 12);
      pop.style.left = Math.max(12, left) + 'px';
      pop.style.top = (window.scrollY + r.bottom + 6) + 'px';
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && pop) { var o = owner; close(); if (o) o.focus(); } });
    $all('.term').forEach(function (t) { t.setAttribute('aria-expanded', 'false'); if (!t.getAttribute('type')) t.setAttribute('type', 'button'); });
  }
  function termBtn(key, label) { return '<button type="button" class="term" data-term="' + esc(key) + '" aria-expanded="false">' + esc(label || key) + '</button>'; }

  /* ======================================================================
     Prototype 1: The front door (R10–R19)
     ====================================================================== */

  /* Site-wide transition notice, dismissible for the session (R11) */
  function initNotice() {
    var bar = $('#notice-bar');
    if (!bar) return;
    if (ss('dcc-notice') === 'closed') bar.hidden = true;
    $('.notice-close', bar).addEventListener('click', function () { bar.hidden = true; ss('dcc-notice', 'closed'); toast('Notice hidden for this visit'); });
    var reset = $('[data-notice-reset]');
    if (reset) reset.addEventListener('click', function () { bar.hidden = false; ss('dcc-notice', null); });
  }

  /* Live numbers that read correctly for everyone (R14).
     The digits are drawn for sighted users and hidden from screen readers;
     the real number sits in the accessible name. */
  function initMeters() {
    var S = window.DCC_STATS || {};
    $all('[data-meter]').forEach(function (m) {
      var key = m.getAttribute('data-meter');
      var value = S[key] || 0;
      var text = num(value);
      m.setAttribute('role', 'img');
      m.setAttribute('aria-label', text);
      m.innerHTML = text.split('').map(function (ch) { return ch === ',' ? '<span class="c" aria-hidden="true">,</span>' : '<span class="d" aria-hidden="true">' + ch + '</span>'; }).join('');
    });
    $all('[data-stat]').forEach(function (el) { var v = S[el.getAttribute('data-stat')]; if (v != null) el.textContent = typeof v === 'number' ? num(v) : v; });
    $all('[data-dial]').forEach(function (svg) {
      var value = S[svg.getAttribute('data-dial')] || 0;
      var max = parseFloat(svg.getAttribute('data-max')) || 1;
      var a = Math.PI * (1 - Math.min(value / max, 1));
      var x = 80 + 58 * Math.cos(a), y = 80 - 58 * Math.sin(a);
      svg.innerHTML = '<path d="M16 80 A64 64 0 0 1 144 80" fill="none" stroke="currentColor" stroke-width="3" opacity="0.35"/>' +
        '<line x1="80" y1="80" x2="' + x.toFixed(1) + '" y2="' + y.toFixed(1) + '" stroke="currentColor" stroke-width="3"/><circle cx="80" cy="80" r="5" fill="currentColor"/>';
    });
  }

  /* "This week at DCC" strip (R13) */
  function initWeek() {
    var box = $('#week-consultations');
    if (!box) return;
    var open = (window.DCC_CONSULTATIONS || []).filter(function (c) { return c.status === 'open'; })
      .sort(function (a, b) { return a.closes < b.closes ? -1 : 1; }).slice(0, 3);
    box.innerHTML = open.map(function (c) {
      var n = daysUntil(c.closes);
      return '<li><a href="' + pageHref('consultation.html') + '?c=' + c.id + '">' + esc(c.title) + '</a><span class="days-left' + (n <= 7 ? ' soon' : '') + '">Closes in ' + n + ' day' + (n === 1 ? '' : 's') + ' · ' + longDate(c.closes) + '</span></li>';
    }).join('');
    var docs = (window.DCC_DOCS || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 3);
    $('#week-docs').innerHTML = docs.map(function (x) {
      return '<li><a href="#">' + esc(x.t) + '</a><span class="wf-meta">' + esc(x.cat) + ' · ' + longDate(x.date) + '</span></li>';
    }).join('');
    var ev = (window.DCC_EVENTS || []).filter(function (e) { return daysUntil(e.date) >= 0; }).slice(0, 3);
    $('#week-events').innerHTML = ev.map(function (e) {
      return '<li><a href="' + pageHref('events.html') + '">' + esc(e.title) + '</a><span class="wf-meta">' + longDate(e.date) + ' · ' + esc(e.where) + '</span></li>';
    }).join('');
  }

  /* Help for the public: "what do you need help with?" (R17) and FAQ filter (R18) */
  var HELP = {
    meter: { h: 'Your energy supplier can fix this', p: 'Your supplier is responsible for your smart meter and can investigate it. If they think the problem is with our network, they raise it with us directly, so you don\'t need to.', who: 'Your energy supplier. Their number is on your bill.' },
    bill: { h: 'Your energy supplier can help with bills', p: 'We carry encrypted messages between meters and suppliers, and never see billing information. Your supplier can check your readings and your bill.', who: 'Your energy supplier.' },
    ihd: { h: 'Your supplier provides the in-home display', p: 'The display belongs to your supplier, so they can reconnect or replace it. Citizens Advice also has guidance on getting a display working again.', who: 'Your energy supplier, or Citizens Advice for guidance.' },
    e7: { h: 'Your supplier sets Economy 7 and 10 timings', p: 'Timings on a smart meter are set remotely by your supplier. Ask them to check the settings.', who: 'Your energy supplier.' },
    install: { h: 'Ask your supplier for a smart meter', p: 'Suppliers install smart meters. Smart Energy GB explains how smart meters work and how to ask for one.', who: 'Your energy supplier, or Smart Energy GB for information.' },
    coverage: { h: 'Your supplier can check coverage at your address', p: 'Our network covers the vast majority of homes in Britain. Your supplier can confirm whether it reaches your home, and we\'re adding coverage with new technology.', who: 'Your energy supplier. If they say there\'s no coverage, you can contact us.' },
    smets1: { h: 'Most first-generation meters are already on our network', p: 'Moving first-generation meters to our network is nearly complete. If yours still hasn\'t moved, contact us and we\'ll look into it.', who: 'Us, using the contact form below.' },
    data: { h: 'We can\'t see your data', p: 'Messages on our network are encrypted and can only be read by the supplier responsible for your meter. We see the type of message, never its contents.', who: 'Our privacy notice explains more.' }
  };
  function initPublic() {
    var sel = $('#finder-q');
    if (sel) {
      var out = $('#finder-answer');
      sel.addEventListener('change', function () {
        var h = HELP[sel.value];
        if (!h) { out.hidden = true; return; }
        $('h3', out).textContent = h.h;
        $('[data-a="p"]', out).textContent = h.p;
        $('[data-a="who"]', out).textContent = h.who;
        out.hidden = false;
      });
    }
    var f = $('#faq-filter');
    if (f) {
      var items = $all('#faq .accordion-item');
      var none = $('#faq-none');
      f.addEventListener('input', function () {
        var q = f.value.trim().toLowerCase();
        var shown = 0;
        items.forEach(function (it) {
          var hit = !q || it.textContent.toLowerCase().indexOf(q) !== -1;
          it.hidden = !hit;
          if (hit) shown += 1;
        });
        none.hidden = shown > 0;
      });
    }
    var cf = $('#public-contact');
    if (cf) cf.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(cf)) return;
      cf.hidden = true;
      var done = $('#public-contact-done'); done.hidden = false; focusHeading(done);
    });
  }

  /* ======================================================================
     Prototype 2: Consultations and engagement (R20–R28)
     ====================================================================== */
  var CONS = window.DCC_CONSULTATIONS || [];
  function consById(id) { for (var i = 0; i < CONS.length; i++) if (CONS[i].id === id) return CONS[i]; return null; }
  function statusChip(c) {
    if (c.status === 'open') {
      var n = daysUntil(c.closes);
      return '<span class="status open">Open</span> <span class="days-left' + (n <= 7 ? ' soon' : '') + '">' + (n <= 0 ? 'Closes today' : 'Closes in ' + n + ' day' + (n === 1 ? '' : 's')) + '</span>';
    }
    if (c.status === 'upcoming') return '<span class="status upcoming">Upcoming</span> <span class="wf-meta">Opens ' + longDate(c.opens) + '</span>';
    if (c.status === 'response') return '<span class="status response">DCC response</span>';
    return '<span class="status closed">Closed</span>';
  }
  function consDates(c) {
    if (c.status === 'open' || c.status === 'upcoming') return dots(c.opens) + ' – ' + dots(c.closes);
    if (c.status === 'response') return 'Published ' + dots(c.published);
    return 'Closed ' + dots(c.closes);
  }

  function initConsultations() {
    var list = $('#cons-list');
    if (!list) return;
    var state = { status: 'all', topic: '', audience: '', q: '', sort: 'closing' };
    var topics = [], auds = [];
    CONS.forEach(function (c) { if (topics.indexOf(c.topic) === -1) topics.push(c.topic); if (auds.indexOf(c.audience) === -1) auds.push(c.audience); });
    $('#cons-topic').innerHTML = '<option value="">All topics</option>' + topics.sort().map(function (t) { return '<option>' + esc(t) + '</option>'; }).join('');
    $('#cons-aud').innerHTML = '<option value="">Everyone</option>' + auds.sort().map(function (t) { return '<option>' + esc(t) + '</option>'; }).join('');

    function counts() {
      $all('[data-cstatus]').forEach(function (b) {
        var s = b.getAttribute('data-cstatus');
        var n = CONS.filter(function (c) { return s === 'all' || c.status === s; }).length;
        var span = $('.n', b); if (span) span.textContent = n;
      });
    }
    function render() {
      var rows = CONS.filter(function (c) {
        return (state.status === 'all' || c.status === state.status) &&
          (!state.topic || c.topic === state.topic) &&
          (!state.audience || c.audience === state.audience) &&
          (!state.q || (c.title + ' ' + c.summary).toLowerCase().indexOf(state.q) !== -1);
      });
      var rank = { open: 0, upcoming: 1, response: 2, closed: 3 };
      rows.sort(function (a, b) {
        if (state.sort === 'az') return a.title < b.title ? -1 : 1;
        if (state.sort === 'latest') return (b.opens || b.published || b.closes) < (a.opens || a.published || a.closes) ? -1 : 1;
        if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status];
        return (a.closes || a.published) < (b.closes || b.published) ? (a.status === 'open' || a.status === 'upcoming' ? -1 : 1) : (a.status === 'open' || a.status === 'upcoming' ? 1 : -1);
      });
      $('#cons-count').textContent = rows.length + ' of ' + CONS.length + ' shown';
      list.innerHTML = rows.length ? rows.map(function (c) {
        return '<li><div class="meta">' + statusChip(c) + '<span>' + consDates(c) + '</span><span>' + esc(c.topic) + '</span><span>' + esc(c.audience) + '</span>' + (c.sample ? '<span>Sample</span>' : '') + '</div>' +
          '<h3><a href="' + pageHref('consultation.html') + '?c=' + c.id + '">' + esc(c.title) + '</a></h3><p>' + esc(c.summary) + '</p>' +
          (c.child ? '<p class="wf-meta">DCC has published its conclusions on this consultation.</p>' : '') + '</li>';
      }).join('') : '<li class="empty-state"><p>No consultations match. Try another topic or clear the search.</p></li>';
    }
    $all('[data-cstatus]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.status = b.getAttribute('data-cstatus');
        $all('[data-cstatus]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        render();
      });
    });
    $('#cons-topic').addEventListener('change', function () { state.topic = this.value; render(); });
    $('#cons-aud').addEventListener('change', function () { state.audience = this.value; render(); });
    $('#cons-sort').addEventListener('change', function () { state.sort = this.value; render(); });
    $('#cons-q').addEventListener('input', function () { state.q = this.value.trim().toLowerCase(); render(); });
    counts();
    render();
  }

  /* Email alerts (R25) — used on several pages */
  function initAlerts() {
    $all('.alert-form').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var picked = $all('input[type="checkbox"]:checked', f).map(function (c) { return c.value; });
        var topicErr = $('[data-topic-error]', f);
        if (topicErr) topicErr.hidden = picked.length > 0;
        if (!validateForm(f) || !picked.length) return;
        var done = document.getElementById(f.getAttribute('data-done'));
        f.hidden = true;
        if (done) { $('[data-topics]', done).textContent = picked.join(', '); done.hidden = false; focusHeading(done); }
      });
    });
  }

  function initConsultation() {
    var app = $('#cons-app');
    if (!app) return;
    var c = consById(param('c') || 'vwan') || consById('vwan');
    document.title = c.title + ' — Smart DCC prototype';
    $('#c-title').textContent = c.title;
    $('#c-status').innerHTML = statusChip(c);
    $('#c-dates').textContent = consDates(c);
    $('#c-topic').textContent = c.topic + ' · ' + c.audience;
    $('#c-summary').textContent = c.summary;
    $all('[data-vwan]').forEach(function (el) { el.hidden = c.id !== 'vwan'; });
    $all('[data-not-vwan]').forEach(function (el) { el.hidden = c.id === 'vwan'; });

    /* Lifecycle strip (R24) */
    var parent = c.parent ? consById(c.parent) : null;
    var child = c.child ? consById(c.child) : null;
    var base = parent || c;
    var steps = [
      { l: 'Open', v: base.opens ? longDate(base.opens) : 'Open', done: base.status !== 'upcoming' },
      { l: 'Closes', v: base.closes ? longDate(base.closes) : '—', done: base.status === 'closed' || base.status === 'response' || !!parent },
      { l: 'Responses published', v: (base.status === 'closed' || parent) ? 'With DCC\'s conclusions' : 'After it closes', done: !!parent || !!child },
      { l: 'DCC conclusions', v: (child || c.status === 'response') ? longDate((child || c).published) : 'To follow', done: !!parent || !!child || c.status === 'response' }
    ];
    var nowIndex = c.status === 'open' ? 1 : c.status === 'upcoming' ? 0 : (c.status === 'closed' && !child) ? 2 : 3;
    $('#c-life').innerHTML = steps.map(function (s, i) {
      return '<li class="' + (i === nowIndex ? 'now' : (s.done ? 'done' : '')) + '"><b>' + s.l + '</b>' + esc(s.v) + '</li>';
    }).join('');
    var rel = $('#c-related');
    if (child) rel.innerHTML = 'DCC has published its conclusions: <a href="consultation.html?c=' + child.id + '">' + esc(child.title) + '</a>';
    else if (parent) rel.innerHTML = 'This is DCC\'s response to <a href="consultation.html?c=' + parent.id + '">' + esc(parent.title) + '</a>';
    else rel.hidden = true;

    var respond = $('#c-respond'), closedBox = $('#c-closed');
    if (c.status !== 'open') {
      respond.hidden = true;
      closedBox.hidden = false;
      $('#c-closed-text').textContent = c.status === 'upcoming' ? 'This consultation opens on ' + longDate(c.opens) + '. Sign up for alerts and we\'ll tell you when it does.'
        : c.status === 'response' ? 'This is a published DCC response, so there is nothing to respond to.'
        : 'This consultation closed on ' + longDate(c.closes) + '.';
      return;
    }
    $('#c-deadline').textContent = '5pm on ' + longDate(c.closes);

    /* Response form with save and return (R23) */
    var form = $('#response-form');
    var key = 'dcc-draft-' + c.id;
    try {
      var draft = JSON.parse(ss(key) || 'null');
      if (draft) {
        Object.keys(draft).forEach(function (k) {
          var el = form.elements[k];
          if (!el) return;
          if (el.length && el[0] && el[0].type === 'radio') { $all('[name="' + k + '"]', form).forEach(function (r) { r.checked = r.value === draft[k]; }); }
          else el.value = draft[k];
        });
        $('#draft-note').textContent = 'We\'ve restored the draft you saved earlier.';
      }
    } catch (e) { /* ignore */ }
    function save(silent) {
      var data = {};
      $all('input, textarea, select', form).forEach(function (el) {
        if (!el.name) return;
        if (el.type === 'radio') { if (el.checked) data[el.name] = el.value; }
        else if (el.type !== 'checkbox') data[el.name] = el.value;
      });
      ss(key, JSON.stringify(data));
      var t = new Date();
      $('#draft-note').textContent = 'Draft saved at ' + ('0' + t.getHours()).slice(-2) + ':' + ('0' + t.getMinutes()).slice(-2) + '.';
      if (!silent) toast('Draft saved. You can come back to it before the deadline.');
    }
    var timer = null;
    form.addEventListener('input', function () { window.clearTimeout(timer); timer = window.setTimeout(function () { save(true); }, 800); });
    $('#save-draft').addEventListener('click', function () { save(false); });
    $all('textarea[maxlength]', form).forEach(function (ta) {
      var out = ta.parentElement.querySelector('.count-out');
      function upd() { if (out) out.textContent = ta.value.length + ' / ' + ta.getAttribute('maxlength') + ' characters'; }
      ta.addEventListener('input', upd); upd();
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var answered = $all('[data-answer]', form).some(function (el) { return el.value.trim() !== ''; });
      var qErr = $('#q-error');
      qErr.hidden = answered;
      if (!validateForm(form)) return;
      if (!answered) { qErr.scrollIntoView({ block: 'center' }); return; }
      ss(key, null);
      form.hidden = true;
      var done = $('#response-done');
      $('#ref').textContent = 'CR-' + c.id.toUpperCase().slice(0, 4) + '-' + (1000 + Math.floor(Math.random() * 9000));
      $('#done-email').textContent = form.elements['r-email'].value;
      done.hidden = false;
      focusHeading(done);
    });
  }

  /* Forums and events (R26) */
  function initEvents() {
    var list = $('#event-list');
    if (!list) return;
    var EV = window.DCC_EVENTS || [];
    var type = 'all';
    function render() {
      var rows = EV.filter(function (e) { return type === 'all' || e.type === type; });
      list.innerHTML = rows.map(function (e, i) {
        var x = d(e.date);
        return '<li><div class="when"><b>' + x.getDate() + '</b><span>' + MONTHS[x.getMonth()] + '</span></div><div><span class="kind">' + esc(e.type) + '</span><h3 style="font-size:1.0625rem;margin:0.15rem 0">' + esc(e.title) + '</h3><p class="wf-meta" style="margin:0">' + esc(e.where) + ' · ' + esc(e.audience) + '</p><p style="margin:0.35rem 0 0;font-size:0.9375rem">' + esc(e.desc) + '</p></div>' +
          '<div class="stack" style="gap:0.4rem"><button type="button" class="btn btn-sm" data-register="' + i + '">Register</button><button type="button" class="btn btn-sm btn-secondary" data-ics="' + i + '">Add to calendar</button></div></li>';
      }).join('');
    }
    list.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ics]');
      if (b) { var ev = EV[+b.getAttribute('data-ics')]; downloadICS(ev.title, ev.date, '10:00', ev.where); return; }
      var r = e.target.closest('[data-register]');
      if (r) { var ev2 = EV[+r.getAttribute('data-register')]; r.textContent = 'Registered'; r.disabled = true; toast('You\'re registered for ' + ev2.title + '. We\'ve sent the joining details by email.'); }
    });
    $all('[data-etype]').forEach(function (b) {
      b.addEventListener('click', function () {
        type = b.getAttribute('data-etype');
        $all('[data-etype]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        render();
      });
    });
    render();
  }

  /* ======================================================================
     Parked: Find anything (R30–R35). Now a separate search project; pages kept but not linked from the pack
     ====================================================================== */
  var DOCS = window.DCC_DOCS || [];

  /* Plain-language words people type, mapped to the words the site uses (R30) */
  var SYNONYMS = {
    'not working': ['smart meter', 'public'], 'broken': ['public'], 'bill': ['bill', 'public'], 'bills': ['public'], 'display': ['ihd'], 'screen': ['ihd'],
    'join': ['onboarding'], 'sign up': ['onboarding'], 'become a customer': ['onboarding'], 'onboard': ['onboarding'],
    'price': ['charging'], 'prices': ['charging'], 'charges': ['charging'], 'fees': ['charging'], 'cost': ['charging'],
    'outage': ['status', 'maintenance'], 'down': ['status', 'incident'], 'owner': ['ownership', 'dcc2'], 'capita': ['dcc2', 'ownership'],
    'half hourly': ['mhhs'], 'half-hourly': ['mhhs'], '4g': ['4g', 'communications hub'], 'hub': ['communications hub']
  };
  function expand(q) {
    var extra = [];
    Object.keys(SYNONYMS).forEach(function (k) { if (q.indexOf(k) !== -1) extra = extra.concat(SYNONYMS[k]); });
    return extra;
  }
  function searchIndex() {
    var idx = [];
    (window.DCC_PAGES || []).forEach(function (p) { idx.push({ kind: p.kind, t: p.t, desc: p.desc, keys: p.keys, url: p.url === '#' ? '#' : pageHref(p.url), date: p.date, archived: p.archived }); });
    DOCS.forEach(function (x) { idx.push({ kind: 'Document', t: x.t, desc: x.cat + ' · ' + x.type + ' · ' + x.size + (x.v > 1 ? ' · Version ' + x.v : ''), keys: x.cat + ' ' + x.prog, url: pageHref('documents.html'), date: x.date, archived: x.superseded }); });
    CONS.forEach(function (c) { idx.push({ kind: 'Consultation', t: c.title, desc: c.summary, keys: c.topic + ' consultation', url: pageHref('consultation.html') + '?c=' + c.id, date: c.opens || c.published || c.closes }); });
    return idx;
  }
  function initSearch() {
    var input = $('#q');
    if (!input) return;
    var idx = searchIndex();
    var kindFilter = 'All';
    var showArchived = $('#q-archived');
    function score(item, words) {
      var t = item.t.toLowerCase(), rest = (item.desc + ' ' + (item.keys || '')).toLowerCase(), s = 0;
      words.forEach(function (w) { if (t.indexOf(w) !== -1) s += 3; else if (rest.indexOf(w) !== -1) s += 1; });
      if (s && item.kind === 'Page') s += 2;
      if (s && item.archived) s -= 3;
      return s;
    }
    function run() {
      var raw = input.value.trim().toLowerCase();
      var out = $('#results'), bet = $('#best-bet'), note = $('#q-note');
      if (!raw) { out.innerHTML = ''; bet.hidden = true; note.textContent = ''; $('#q-count').textContent = 'Type a question or a document name.'; $all('[data-kind] .n').forEach(function (n) { n.textContent = ''; }); return; }
      var stop = ['my', 'is', 'the', 'a', 'an', 'to', 'of', 'how', 'do', 'i', 'what', 'when', 'will', 'you', 'can', 'for', 'and', 'with', 'in', 'on', 'be'];
      var words = raw.split(/\s+/).filter(function (w) { return w && stop.indexOf(w) === -1; });
      var extra = expand(raw);
      var all = words.concat(extra);
      note.textContent = extra.length ? 'Also searched for: ' + extra.filter(function (v, i, a) { return a.indexOf(v) === i; }).join(', ') : '';
      var seen = {};
      var hits = idx.map(function (it) { return { it: it, s: score(it, all) }; })
        .filter(function (h) { if (h.s <= 0) return false; var k = h.it.kind + h.it.t; if (seen[k]) return false; seen[k] = true; return true; })
        .filter(function (h) { return showArchived.checked || !h.it.archived; })
        .sort(function (a, b) { return b.s - a.s || ((b.it.date || '') < (a.it.date || '') ? -1 : 1); });
      /* Best bet: a glossary term, or the help page for public questions */
      var g = findTerm(raw.replace(/\?$/, '')) || (words.length === 1 ? findTerm(words[0]) : null);
      var publicQ = /meter|bill|display|ihd|economy|install|coverage|aerial|not working|broken/.test(raw) && !/uept|duis|smki|sec party|gateway|charging/.test(raw);
      if (g) {
        bet.innerHTML = '<span class="kind">Definition</span><h2 style="font-size:1.25rem;margin:0 0 0.25rem">' + esc(g.term) + (g.full ? ': ' + esc(g.full) : '') + '</h2><p style="margin:0 0 0.5rem">' + esc(g.def) + '</p><a href="' + pageHref('glossary.html') + '#term-' + slug(g.term) + '">Open the glossary</a>';
        bet.hidden = false;
      } else if (publicQ) {
        bet.innerHTML = '<span class="kind">Looking for help with your own smart meter?</span><h2 style="font-size:1.25rem;margin:0 0 0.25rem">Your energy supplier is the right place to start</h2><p style="margin:0 0 0.5rem">We run the network behind smart meters but can\'t see or change your meter, bill or display. Our help page explains who to contact for each problem.</p><a class="btn" href="' + pageHref('public.html') + '">Help for the public</a>';
        bet.hidden = false;
      } else bet.hidden = true;
      var kinds = { All: hits.length };
      hits.forEach(function (h) { kinds[h.it.kind] = (kinds[h.it.kind] || 0) + 1; });
      $all('[data-kind]').forEach(function (b) { var n = $('.n', b); if (n) n.textContent = kinds[b.getAttribute('data-kind')] ? '(' + kinds[b.getAttribute('data-kind')] + ')' : '(0)'; });
      var shown = hits.filter(function (h) { return kindFilter === 'All' || h.it.kind === kindFilter; });
      $('#q-count').textContent = shown.length + ' result' + (shown.length === 1 ? '' : 's') + ' for "' + input.value.trim() + '"';
      out.innerHTML = shown.slice(0, 20).map(function (h) {
        var it = h.it;
        return '<li><div class="meta"><span class="kind">' + esc(it.kind) + '</span>' + (it.date ? '<span>' + dots(it.date) + '</span>' : '') + (it.archived ? '<span class="badge-old">Archived</span>' : '') + '</div><h3><a href="' + it.url + '">' + esc(it.t) + '</a></h3><p>' + esc(it.desc) + '</p></li>';
      }).join('') || '<li class="empty-state"><p>Nothing matched. Try fewer words, or <a href="' + pageHref('glossary.html') + '">look the term up in the glossary</a>.</p></li>';
    }
    $all('[data-kind]').forEach(function (b) {
      b.addEventListener('click', function () {
        kindFilter = b.getAttribute('data-kind');
        $all('[data-kind]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        run();
      });
    });
    $('#q-form').addEventListener('submit', function (e) { e.preventDefault(); run(); });
    input.addEventListener('input', run);
    showArchived.addEventListener('change', run);
    $all('[data-try]').forEach(function (b) { b.addEventListener('click', function () { input.value = b.getAttribute('data-try'); run(); input.focus(); }); });
    var start = param('q');
    if (start) input.value = start;
    run();
  }

  /* Document Centre with facets, versions and paging (R31, R32) */
  function initDocs() {
    var list = $('#doc-list');
    if (!list) return;
    var PAGE = 10, page = 1;
    function uniq(k) { var o = []; DOCS.forEach(function (x) { if (o.indexOf(x[k]) === -1) o.push(x[k]); }); return o.sort(); }
    function facet(host, k, name) {
      $(host).innerHTML = uniq(k).map(function (v, i) {
        var n = DOCS.filter(function (x) { return x[k] === v && !x.superseded; }).length;
        return '<label class="check"><input type="checkbox" name="' + name + '" value="' + esc(v) + '" id="' + name + '-' + i + '"> ' + esc(v) + '<span class="facet-count">' + n + '</span></label>';
      }).join('');
    }
    facet('#f-cat', 'cat', 'fcat');
    facet('#f-ry', 'ry', 'fry');
    facet('#f-type', 'type', 'ftype');
    $('#f-prog').innerHTML = '<option value="">All programmes</option>' + uniq('prog').map(function (v) { return '<option>' + esc(v) + '</option>'; }).join('');
    function picked(name) { return $all('input[name="' + name + '"]:checked').map(function (c) { return c.value; }); }
    function render() {
      var cats = picked('fcat'), rys = picked('fry'), types = picked('ftype');
      var prog = $('#f-prog').value, q = $('#doc-q').value.trim().toLowerCase(), old = $('#f-old').checked, sort = $('#doc-sort').value;
      var rows = DOCS.filter(function (x) {
        return (!cats.length || cats.indexOf(x.cat) !== -1) && (!rys.length || rys.indexOf(x.ry) !== -1) && (!types.length || types.indexOf(x.type) !== -1) &&
          (!prog || x.prog === prog) && (old || !x.superseded) && (!q || (x.t + ' ' + x.cat + ' ' + x.prog).toLowerCase().indexOf(q) !== -1);
      });
      rows.sort(function (a, b) { return sort === 'az' ? (a.t < b.t ? -1 : 1) : sort === 'oldest' ? (a.date < b.date ? -1 : 1) : (a.date < b.date ? 1 : -1); });
      var pages = Math.max(1, Math.ceil(rows.length / PAGE));
      if (page > pages) page = pages;
      var active = cats.concat(rys, types, prog ? [prog] : [], q ? ['"' + q + '"'] : []);
      $('#doc-count').textContent = rows.length + ' document' + (rows.length === 1 ? '' : 's') + (active.length ? ' matching ' + active.join(', ') : '') + (old ? ', including superseded versions' : '');
      $('#facet-btn-count').textContent = active.length ? ' (' + active.length + ')' : '';
      list.innerHTML = rows.slice((page - 1) * PAGE, page * PAGE).map(function (x, i) {
        var id = 'v-' + slug(x.t).slice(0, 30) + i;
        return '<li><div class="meta"><span class="kind">' + esc(x.cat) + '</span><span>Published ' + dots(x.date) + '</span><span>RY ' + esc(x.ry) + '</span>' + (x.superseded ? '<span class="badge-old">Superseded</span>' : '<span class="badge-current">Current' + (x.v > 1 ? ' · v' + x.v : '') + '</span>') + (x.live ? '' : '<span>Sample</span>') + '</div>' +
          '<h3><a href="#">' + esc(x.t) + '</a></h3><div class="actions"><a href="#">Download ' + esc(x.type) + ' (' + esc(x.size) + ')</a>' +
          (x.prev ? '<button type="button" class="btn-link" aria-expanded="false" aria-controls="' + id + '" data-versions>Earlier versions (' + x.prev.length + ')</button>' : '') + '</div>' +
          (x.prev ? '<ul class="versions" id="' + id + '" hidden>' + x.prev.map(function (p) { return '<li>Version ' + p.v + ' · ' + dots(p.date) + ' · <a href="#">Download</a></li>'; }).join('') + '</ul>' : '') + '</li>';
      }).join('') || '<li class="empty-state"><p>No documents match these filters. <button type="button" class="btn-link" data-clear>Clear all filters</button></p></li>';
      var pg = $('#doc-pager'), h = '<button type="button" data-page="' + (page - 1) + '"' + (page === 1 ? ' disabled' : '') + '>Previous</button>';
      for (var i = 1; i <= pages; i++) h += '<button type="button" data-page="' + i + '"' + (i === page ? ' aria-current="page"' : '') + '>' + i + '</button>';
      h += '<button type="button" data-page="' + (page + 1) + '"' + (page === pages ? ' disabled' : '') + '>Next</button>';
      pg.innerHTML = h;
    }
    function reset() { page = 1; render(); }
    $all('.facets input[type="checkbox"], #f-prog').forEach(function (el) { el.addEventListener('change', reset); });
    $('#f-old').addEventListener('change', reset);
    $('#doc-sort').addEventListener('change', reset);
    $('#doc-q').addEventListener('input', reset);
    $('#doc-pager').addEventListener('click', function (e) { var b = e.target.closest('[data-page]'); if (!b || b.disabled) return; page = +b.getAttribute('data-page'); render(); $('#doc-count').scrollIntoView({ block: 'start' }); });
    list.addEventListener('click', function (e) {
      var v = e.target.closest('[data-versions]');
      if (v) { var ul = document.getElementById(v.getAttribute('aria-controls')); var open = ul.hidden; ul.hidden = !open; v.setAttribute('aria-expanded', open ? 'true' : 'false'); }
      if (e.target.closest('[data-clear]')) clearAll();
    });
    function clearAll() { $all('.facets input[type="checkbox"]').forEach(function (c) { c.checked = false; }); $('#f-prog').value = ''; $('#doc-q').value = ''; reset(); }
    $('#clear-filters').addEventListener('click', clearAll);
    var fb = $('#facet-btn');
    fb.addEventListener('click', function () {
      var l = $('.listing'); var open = !l.classList.contains('show-facets');
      l.classList.toggle('show-facets', open); fb.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    render();
  }

  /* Glossary (R33) */
  function initGlossary() {
    var host = $('#gloss');
    if (!host) return;
    var list = GLOSS.slice().sort(function (a, b) { return a.term.toLowerCase() < b.term.toLowerCase() ? -1 : 1; });
    function render(q) {
      q = (q || '').toLowerCase();
      var groups = {};
      list.forEach(function (g) {
        if (q && (g.term + ' ' + (g.full || '') + ' ' + g.def).toLowerCase().indexOf(q) === -1) return;
        var L = g.term.charAt(0).toUpperCase();
        (groups[L] = groups[L] || []).push(g);
      });
      var letters = Object.keys(groups).sort();
      $('#az').innerHTML = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(function (L) { return groups[L] ? '<a href="#letter-' + L + '">' + L + '</a>' : '<span aria-hidden="true">' + L + '</span>'; }).join('');
      host.innerHTML = letters.map(function (L) {
        return '<section class="gloss-group" aria-labelledby="letter-' + L + '"><h2 id="letter-' + L + '">' + L + '</h2><dl class="gloss-list">' + groups[L].map(function (g) {
          return '<dt id="term-' + slug(g.term) + '">' + esc(g.term) + (g.full ? '<small>' + esc(g.full) + '</small>' : '') + '</dt><dd>' + esc(g.def) + '</dd>';
        }).join('') + '</dl></section>';
      }).join('') || '<p class="empty-state">No terms match. <a href="' + pageHref('search.html') + '">Search the whole site</a> instead.</p>';
      $('#gloss-count').textContent = letters.reduce(function (n, L) { return n + groups[L].length; }, 0) + ' terms';
    }
    $('#gloss-q').addEventListener('input', function () { render(this.value.trim()); });
    render('');
    if (window.location.hash) {
      var t = document.getElementById(window.location.hash.slice(1));
      if (t) { t.classList.add('hl'); t.scrollIntoView({ block: 'center' }); }
    }
  }

  /* ======================================================================
     Prototype 3: Status and performance (R40–R47)
     ====================================================================== */
  function initStatus() {
    var host = $('#svc-list');
    if (!host) return;
    var SV = window.DCC_SERVICES || [];
    var label = { ok: 'Operating normally', degraded: 'Degraded', maintenance: 'Planned maintenance', down: 'Unavailable' };
    host.innerHTML = SV.map(function (s) {
      return '<li><span>' + esc(s.name) + '</span><span class="svc-state ' + s.state + '">' + label[s.state] + '</span>' + (s.note ? '<span class="note">' + esc(s.note) + '</span>' : '') + '</li>';
    }).join('');
    var issues = SV.filter(function (s) { return s.state !== 'ok'; });
    $('#status-big').textContent = issues.length ? issues.length + ' services affected, the rest operating normally' : 'All services operating normally';
    var INC = window.DCC_INCIDENTS || [];
    function incHTML(i) {
      return '<article class="incident"><div class="meta" style="display:flex;gap:0.75rem;flex-wrap:wrap;font-size:0.8125rem"><span class="status ' + (i.end ? 'closed' : 'open') + '">' + (i.end ? 'Resolved' : 'Investigating') + '</span><span>' + esc(i.cat) + '</span><span>' + esc(i.id) + '</span><span>Sample</span></div>' +
        '<h3>' + esc(i.title) + '</h3><p class="wf-meta" style="margin:0">' + esc(i.service) + ' · Started ' + esc(i.start) + (i.end ? ' · Resolved ' + esc(i.end) : '') + '</p>' +
        '<ol>' + i.updates.map(function (u) { return '<li><b>' + esc(u[0]) + '</b>' + esc(u[1]) + '</li>'; }).join('') + '</ol></article>';
    }
    $('#inc-open').innerHTML = INC.filter(function (i) { return !i.end; }).map(incHTML).join('') || '<p>No open incidents.</p>';
    var cat = 'all';
    function renderPast() {
      var rows = INC.filter(function (i) { return i.end && (cat === 'all' || i.cat === cat); });
      $('#inc-past').innerHTML = rows.map(incHTML).join('') || '<p class="wf-meta">No resolved incidents of this category in the last 90 days.</p>';
    }
    $('#inc-cat').addEventListener('change', function () { cat = this.value; renderPast(); });
    renderPast();
    var MT = window.DCC_MAINTENANCE || [];
    var svcSel = $('#mt-svc');
    var names = []; MT.forEach(function (m) { if (names.indexOf(m.service) === -1) names.push(m.service); });
    svcSel.innerHTML = '<option value="">All services</option>' + names.map(function (n) { return '<option>' + esc(n) + '</option>'; }).join('');
    function renderMT() {
      var v = svcSel.value;
      $('#mt-body').innerHTML = MT.filter(function (m) { return !v || m.service === v; }).map(function (m, i) {
        var n = daysUntil(m.date);
        return '<tr><td>' + longDate(m.date) + (n === 0 ? ' <span class="status open">Today</span>' : '') + '</td><td>' + esc(m.time) + '</td><td>' + esc(m.service) + '</td><td>' + esc(m.impact) + '</td><td><button type="button" class="btn-link" data-mt="' + MT.indexOf(m) + '">Add to calendar</button></td></tr>';
      }).join('');
    }
    svcSel.addEventListener('change', renderMT);
    $('#mt-body').addEventListener('click', function (e) { var b = e.target.closest('[data-mt]'); if (!b) return; var m = MT[+b.getAttribute('data-mt')]; downloadICS('DCC maintenance: ' + m.service, m.date, m.time, 'DCC'); });
    renderMT();
  }

  /* Charts drawn from data, with a table and CSV for each (R43, R44) */
  function initPerformance() {
    var host = $('#charts');
    if (!host) return;
    var P = window.DCC_PERF;
    var range = 12;
    function chart(s) {
      var months = P.months.slice(-range), vals = s.values.slice(-range);
      var W = 640, H = 220, L = 40, R = 12, T = 16, B = 30;
      var min = 80, max = 100;
      var x = function (i) { return L + (W - L - R) * (months.length === 1 ? 0.5 : i / (months.length - 1)); };
      var y = function (v) { return T + (H - T - B) * (1 - (v - min) / (max - min)); };
      var g = '';
      for (var v = min; v <= max; v += 5) g += '<line class="grid-line" x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v).toFixed(1) + '" y2="' + y(v).toFixed(1) + '"/><text class="axis-label" x="' + (L - 6) + '" y="' + (y(v) + 4).toFixed(1) + '" text-anchor="end">' + v + '%</text>';
      months.forEach(function (m, i) { g += '<text class="axis-label" x="' + x(i).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle">' + m + '</text>'; });
      var path = vals.map(function (v, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1); }).join(' ');
      g += '<path class="line" d="' + path + '"/>';
      vals.forEach(function (v, i) {
        g += '<circle class="pt" cx="' + x(i).toFixed(1) + '" cy="' + y(v).toFixed(1) + '" r="4" data-i="' + i + '"/>';
        g += '<rect class="hit" x="' + (x(i) - 18).toFixed(1) + '" y="' + T + '" width="36" height="' + (H - T - B) + '" data-i="' + i + '" tabindex="0" role="button" aria-label="' + m(months[i]) + ': ' + v + '%"/>';
      });
      function m(t) { return t; }
      var tableRows = months.map(function (mm, i) { return '<tr><td>' + mm + '</td><td class="num">' + vals[i].toFixed(1) + '%</td></tr>'; }).join('');
      return '<article class="chart-card" data-series="' + s.id + '"><div class="chart-head"><div><h3>' + esc(s.title) + '</h3><p class="wf-meta" style="margin:0;max-width:52ch">' + esc(s.desc) + '</p></div><div class="chart-avg"><span class="wf-meta">' + esc(s.avgLabel) + ', 12 months</span><b>' + s.avg.toFixed(1) + '%</b></div></div>' +
        '<svg class="chart-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(s.title) + ', ' + months[0] + ' to ' + months[months.length - 1] + '. Lowest ' + Math.min.apply(null, vals) + '%, highest ' + Math.max.apply(null, vals) + '%.">' + g + '</svg>' +
        '<p class="chart-tip" aria-live="polite">Hover or tab to a month to see its value.</p>' +
        (s.volume ? '<p class="wf-meta" style="margin:0">Volume: ' + esc(s.volume.from) + ', ' + esc(s.volume.to) + ' (' + esc(s.volume.change) + ')</p>' : '') +
        '<div class="chart-foot"><button type="button" class="btn-link" data-table aria-expanded="false">Show as a table</button><button type="button" class="btn btn-sm btn-secondary" data-csv>Download CSV</button></div>' +
        '<div class="chart-table table-wrap" hidden><table class="data-table"><thead><tr><th>Month</th><th class="num">' + esc(s.title) + '</th></tr></thead><tbody>' + tableRows + '</tbody></table></div></article>';
    }
    function render() { host.innerHTML = P.series.map(chart).join(''); }
    host.addEventListener('mouseover', tip);
    host.addEventListener('focusin', tip);
    function tip(e) {
      var h = e.target.closest && e.target.closest('.hit');
      if (!h) return;
      var card = h.closest('.chart-card'), s = null;
      P.series.forEach(function (x) { if (x.id === card.getAttribute('data-series')) s = x; });
      var i = +h.getAttribute('data-i');
      var months = P.months.slice(-range), vals = s.values.slice(-range);
      $all('.pt', card).forEach(function (p) { p.classList.toggle('active', +p.getAttribute('data-i') === i); });
      var diff = vals[i] - s.avg;
      $('.chart-tip', card).textContent = months[i] + ': ' + vals[i].toFixed(1) + '% (' + (diff >= 0 ? '+' : '') + diff.toFixed(1) + ' points against the 12-month average)';
    }
    host.addEventListener('click', function (e) {
      var card = e.target.closest('.chart-card');
      if (!card) return;
      var s = null; P.series.forEach(function (x) { if (x.id === card.getAttribute('data-series')) s = x; });
      var t = e.target.closest('[data-table]');
      if (t) { var box = $('.chart-table', card); box.hidden = !box.hidden; t.textContent = box.hidden ? 'Show as a table' : 'Hide the table'; t.setAttribute('aria-expanded', box.hidden ? 'false' : 'true'); }
      if (e.target.closest('[data-csv]')) {
        var months = P.months.slice(-range), vals = s.values.slice(-range);
        downloadCSV('dcc-' + s.id + '-performance', [['Month', s.title + ' (%)']].concat(months.map(function (m, i) { return [m, vals[i]]; })));
      }
    });
    $all('[data-range]').forEach(function (b) {
      b.addEventListener('click', function () {
        range = +b.getAttribute('data-range');
        $all('[data-range]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        render();
      });
    });
    $('#csv-all').addEventListener('click', function () {
      var rows = [['Month'].concat(P.series.map(function (s) { return s.title + ' (%)'; }))];
      P.months.forEach(function (m, i) { rows.push([m].concat(P.series.map(function (s) { return s.values[i]; }))); });
      downloadCSV('dcc-network-performance-aug25-jul26', rows);
    });
    render();
  }

  /* Programme tracker (R45) */
  function initProgrammes() {
    var host = $('#prog-grid');
    if (!host) return;
    var PR = window.DCC_PROGRAMMES || [];
    var label = { 'on-track': 'On track', 'at-risk': 'At risk', complete: 'Complete' };
    var filter = 'live';
    function render() {
      var rows = PR.filter(function (p) { return filter === 'all' || (filter === 'live' ? p.state !== 'complete' : p.state === filter); });
      host.innerHTML = rows.map(function (p) {
        return '<article class="prog"><span class="state ' + p.state + '">' + label[p.state] + '</span><h3>' + esc(p.name) + '</h3>' +
          '<div class="progress" role="img" aria-label="' + p.pct + '% complete"><i style="width:' + p.pct + '%"></i></div>' +
          '<dl class="kv"><dt>Stage</dt><dd>' + esc(p.stage) + '</dd><dt>' + (p.state === 'complete' ? 'Completed' : 'Next milestone') + '</dt><dd>' + esc(p.state === 'complete' ? p.nextDate : p.next + ', ' + p.nextDate) + '</dd><dt>Target</dt><dd>' + p.year + '</dd></dl>' +
          '<div class="row" style="gap:1rem;font-size:0.875rem"><a href="#">Documents</a><a href="' + pageHref('consultations.html') + '">Consultations</a></div></article>';
      }).join('');
      $('#prog-count').textContent = rows.length + ' programme' + (rows.length === 1 ? '' : 's');
    }
    $all('[data-pstate]').forEach(function (b) {
      b.addEventListener('click', function () {
        filter = b.getAttribute('data-pstate');
        $all('[data-pstate]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        render();
      });
    });
    render();
  }

  /* ======================================================================
     Prototype 4: Joining the network (R50–R55)
     ====================================================================== */
  function initJoin() {
    var app = $('#join-app');
    if (!app) return;
    var R = window.DCC_ROUTES, S = window.DCC_STEPS;
    var out = $('#route');
    function done() { try { return JSON.parse(ss('dcc-steps') || '{}'); } catch (e) { return {}; } }
    function render(key) {
      var r = R[key];
      if (!r) { out.hidden = true; return; }
      var dn = done();
      $('#route-title').textContent = r.label;
      $('#route-role').textContent = r.role;
      $('#route-intro').textContent = r.intro;
      $('#route-time').textContent = r.weeks;
      $('#route-tool').hidden = !r.tool;
      var count = 0;
      $('#route-steps').innerHTML = r.steps.map(function (k, i) {
        var s = S[k], isDone = !!dn[key + '-' + k];
        if (isDone) count += 1;
        var title = s.term ? esc(s.title).replace(esc(s.term), termBtn(s.term)) : esc(s.title);
        return '<li class="' + (isDone ? 'done' : '') + '"><h3>' + title + '</h3><p style="margin:0">' + esc(s.what) + '</p>' +
          '<dl class="kv"><dt>Who you deal with</dt><dd>' + esc(s.who) + '</dd><dt>Typical time</dt><dd>' + esc(s.time) + ' <span class="wf-meta">(sample)</span></dd></dl>' +
          '<label class="check"><input type="checkbox" data-step="' + key + '-' + k + '" id="step-' + key + '-' + k + '"' + (isDone ? ' checked' : '') + '> We\'ve done this</label></li>';
      }).join('');
      $('#route-progress').textContent = count + ' of ' + r.steps.length + ' steps done';
      $('#route-quote').innerHTML = r.quote ? '[Quote from ' + esc(r.quote) + ', taken from the existing testimonials on Partner with DCC]' : '[No customer quote yet for this route]';
      $('#route-enquire').setAttribute('href', 'partner-enquiry.html?type=' + key);
      out.hidden = false;
    }
    $all('input[name="role"]').forEach(function (r) {
      r.addEventListener('change', function () { ss('dcc-role', r.value); render(r.value); $('#route').scrollIntoView({ block: 'start', behavior: 'smooth' }); });
    });
    out.addEventListener('change', function (e) {
      var c = e.target.closest('[data-step]');
      if (!c) return;
      var dn = done(); dn[c.getAttribute('data-step')] = c.checked; ss('dcc-steps', JSON.stringify(dn));
      var key = $('input[name="role"]:checked').value;
      render(key);
    });
    var saved = param('type') || ss('dcc-role');
    if (saved && R[saved]) { var inp = $('input[name="role"][value="' + saved + '"]'); if (inp) { inp.checked = true; render(saved); } }
  }

  /* Routed partner enquiry (R53) */
  var TEAMS = {
    supplier: 'Customer onboarding team', network: 'Customer onboarding team', other: 'Customer onboarding team (digital onboarding tool)',
    innovator: 'Test services and partnerships', research: 'Data for public good team', supplierToDcc: 'Procurement', other2: 'Partnerships team'
  };
  function initPartnerEnquiry() {
    var f = $('#enq-form');
    if (!f) return;
    var type = $('#enq-type');
    var t = param('type');
    if (t && TEAMS[t]) type.value = t;
    function upd() {
      var v = type.value;
      $all('.cond', f).forEach(function (c) { c.hidden = c.getAttribute('data-for').split(' ').indexOf(v) === -1; });
      var r = $('#team-route');
      if (!v) { r.hidden = true; return; }
      r.hidden = false;
      $('#team-name').textContent = TEAMS[v] || 'Partnerships team';
      var tool = $('#enq-tool'); if (tool) tool.hidden = v !== 'other';
    }
    type.addEventListener('change', upd);
    upd();
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(f)) return;
      f.hidden = true;
      var dn = $('#enq-done');
      $('#enq-done-team').textContent = TEAMS[type.value] || 'Partnerships team';
      $('#enq-done-ref').textContent = 'PE-' + (20000 + Math.floor(Math.random() * 9999));
      dn.hidden = false; focusHeading(dn);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initAccordions();
    initTabs();
    initCarousels();
    initModals();
    initNotes();
    initProtoNav();
    initSubNav();
    initHeaderHeight();
    initDrawers();
    initCopy();
    initTerms();
    initNotice();
    initMeters();
    initWeek();
    initPublic();
    initConsultations();
    initAlerts();
    initConsultation();
    initEvents();
    initSearch();
    initDocs();
    initGlossary();
    initStatus();
    initPerformance();
    initProgrammes();
    initJoin();
    initPartnerEnquiry();
  });
})();
