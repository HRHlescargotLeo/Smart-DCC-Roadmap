# Generates the quick-win pages (src/quick/*.html), the navigator links and the hub cards.
# Run from the repo root. Page content lives here as data; behaviour lives in wireframe.js.
import re, html, os
SRC = 'src'
part = open(f'{SRC}/pages/partner-enquiry.html').read()
FORM = re.search(r'(<form id="enq-form".*?</form>\s*<div class="confirm-box" id="enq-done" hidden>.*?</div>)', part, re.S).group(1)
FORM = FORM.replace('<a href="~/pages/join.html">Back to joining the network</a>', '<a href="#">Back to Partner with DCC</a>')
pub = open(f'{SRC}/pages/public.html').read()
FINDER = re.search(r'(<div class="field" style="max-width:520px">\s*<label for="finder-q">.*?</div>\s*<div class="finder-answer".*?</div>)', pub, re.S).group(1)

def copy(addr): return f'<span class="copy-field"><code>{addr}</code><button type="button" data-copy="{addr}">Copy</button></span>'
def note(n, label, text, q=False): return f'<p class="wf-note{" query" if q else ""}" data-note="{n}"><span class="wf-note-label">{label}</span>{text}</p>'
def quote(t): return f'<blockquote class="qw-quote"><p>{t}</p><cite>From the live page</cite></blockquote>'
UTIL_NOW = '<div class="site-mock"><div class="util"><div class="container"><a href="#">Customer Engagement</a><a href="#">Consultations</a><a href="#">Document Centre</a></div></div><div class="main"><div class="container"><span class="wf-placeholder logo">DCC logo</span><nav aria-label="Main (mock)"><a href="#">About DCC</a><a href="#">Our Smart Network</a><a href="#">Enabling Innovation</a><a href="#">News &amp; Events</a><a href="#">Careers</a></nav><div class="right"><a href="#" class="btn btn-sm btn-secondary">Search</a><a href="#" class="btn btn-sm">Partner with DCC</a></div></div></div></div>'
def util_with(extra): return UTIL_NOW.replace('<div class="util"><div class="container">', '<div class="util"><div class="container">' + extra)

def switch(group, labels):
    return '<div class="seg qw-seg" role="group" aria-label="Show">' + ''.join(f'<button type="button" data-switch="{group}" data-value="{v}" aria-pressed="{"true" if i == 0 else "false"}">{l}</button>' for i, (v, l) in enumerate(labels)) + '</div>'
def panel(group, v, inner, first=False): return f'<div data-switch-panel="{group}" data-value="{v}"{"" if first else " hidden"}>{inner}</div>'

SITEMAP = [
 ('About DCC', ['Who we are', 'Company leadership', 'Business &amp; Development Plan', 'Licence Renewal: preparing for business transfer', 'Partners &amp; suppliers', 'Work with the DCC', 'Governance &amp; Regulations', 'Charges', 'Governance, reports &amp; policies', 'Price control', 'Smart Meter Communication Licence &amp; Regulation']),
 ('Our Smart Network', ['Smart meter statistics', 'Network performance', 'Major incident management', 'Our products', 'Dual Band Communications Hub', 'Communications Hub', 'DCC Boxed', 'GFI Testing Tool', 'Parse and Correlate', 'Customer Service Centre', "What we're working on", 'Data Service Provider (DSP) programme', 'Market-wide Half-Hourly Settlement', "Upgrading Britain's first-generation smart meters"]),
 ('Our services', ['Central Switching Service (CSS)', 'Devices and technology support', 'Elective Communications Services', 'Enduring Change of Supplier (ECoS)', 'Technical Operations Centre', 'Test assurance', 'Testing services']),
 ('Enabling Innovation', ['Government-funded innovation projects', 'Using smart meter system data for public good', 'Smart Meter Enabled Environmental Sensing (SMEES)']),
 ('Working with us', ['Partner with DCC', 'Customer Engagement', 'Consultations', 'Document Centre', 'News &amp; Events', 'Careers']),
 ('Help and legal', ['Contact us', 'Help for the public', 'Privacy notice', 'Cookies', 'Switching services privacy notice', 'Modern Slavery Act policy', 'Information Security Policy']),
]
SITEMAP_HTML = '<div class="field" style="max-width:420px"><label for="sitemap-q">Find a page</label><input type="search" id="sitemap-q" placeholder="For example: charges, testing, careers"></div><div class="sitemap" id="sitemap">' + ''.join(f'<section><h3>{h}</h3><ul>' + ''.join(f'<li><a href="#">{x}</a></li>' for x in items) + '</ul></section>' for h, items in SITEMAP) + '</div><p class="empty-state" id="sitemap-none" hidden>No pages match. Try a shorter word.</p>'

CONTACT_OPTS = [
 ('ops', 'An operational problem with a DCC service', '<h3>Contact the Service Centre</h3><p>For incidents, service requests and anything affecting live service. You can also raise and track incidents in the Self-Service Interface.</p>' + copy('servicecentre@smartdcc.co.uk')),
 ('escalate', "A problem the Service Centre hasn't resolved", "<h3>Contact our High Level Escalations team</h3><p>If you're unhappy with how an issue has been handled, or with any other part of our service, we'll investigate and keep you updated.</p>" + copy('complaints@smartdcc.co.uk')),
 ('charges', 'DCC charges, finance updates or forums', '<h3>Contact Customer Engagement</h3><p>For questions about charges and finance updates. For a forum or event, contact its owner directly.</p>' + copy('customerengagement@smartdcc.co.uk')),
 ('invoices', 'An invoice or payment', '<h3>Contact our finance team</h3><p>For invoice queries and file submissions. From 2 November 2026 invoices come from DCC 2 Ltd.</p>' + copy('finance@smartdcc.co.uk') + ' ' + copy('customerinvoices@smartdcc.co.uk')),
 ('switching', 'The Central Switching Service', '<h3>Contact the switching team</h3><p>For the development and running of the Central Switching Service.</p>' + copy('contact.switching@smartdcc.co.uk')),
 ('media', "I'm a journalist", '<h3>Contact our communications team</h3>' + copy('media@smartdcc.co.uk')),
 ('procurement', 'Selling to DCC', '<h3>Contact Procurement</h3>' + copy('procurement@smartdcc.co.uk')),
 ('jobs', 'A job or job application', '<h3>See our careers site</h3><p>All open roles are on our careers site. For anything else about recruitment:</p>' + copy('DCC.Recruitment@smartdcc.co.uk')),
 ('public', 'My own smart meter, bill or display', "<h3>Your energy supplier can help</h3><p>We run the network behind smart meters but can't see or change your meter, bill or display. Our help page explains who to contact for each problem.</p><a class=\"btn btn-sm\" href=\"#\">Help for the public</a>"),
]
CONTACT_HTML = '<div class="field" style="max-width:520px"><label for="contact-q">What do you need help with?</label><select id="contact-q"><option value="">Choose one</option>' + ''.join(f'<option value="{v}">{l}</option>' for v, l, _ in CONTACT_OPTS) + '</select></div>' + ''.join(f'<div class="finder-answer" data-contact="{v}" hidden>{b}</div>' for v, _, b in CONTACT_OPTS) + '<div class="qw-offices"><div><b>London</b><br>Riverscape, 10 Queen Street Place, London EC4R 1BE</div><div><b>Manchester</b><br>Brabazon House, Concord Business Park, Manchester M22 0RR</div></div>'

QW = [
 # group, slug, short label, title, lead, idea, now, after, notes, related
 ('The move to DCC 2 Ltd', 'licence', 'Licence page', 'Bring the licence page up to date',
  'Say who holds the licence from 2 November, and keep the first licence as history.', 2,
  quote('The licence came into effect on 23 September 2013 and is 12 years long. The licence imposes an ex-post Price Control regime to scrutinise DCC costs.') + '<p>Read today, that says the licence ran out a year ago and describes a price control that is about to be replaced. The new Licence Renewal page explains the change well, but nothing on this page points to it.</p>',
  '<div class="qw-page"><p class="wf-meta">Governance &amp; Regulations</p><h3 class="qw-page-h">The Smart Meter Communication Licence</h3><p>From 2 November 2026, DCC\'s services are delivered by DCC 2 Ltd, a wholly owned subsidiary of SECCo Ltd, under the second Smart Meter Communication Licence. Ofgem awarded the licence in April 2026 after a review of the DCC regulatory framework and a competitive tender.</p><p>The licence sets a not-for-profit operating model and an ex-ante price control, under which our costs are agreed with Ofgem in advance. It is regulated by Ofgem and can be modified by the Department for Energy Security and Net Zero or Ofgem.</p><div class="row" style="gap:0.75rem;flex-wrap:wrap;margin:1rem 0"><a class="btn btn-sm" href="#">Read the licence on Ofgem\'s website</a><a class="btn btn-sm btn-secondary" href="#">Licence Renewal: preparing for business transfer</a></div><div class="accordion"><div class="accordion-item"><button type="button" class="accordion-title">The first licence, held by Smart DCC Ltd from 2013<span class="accordion-icon">&#9662;</span></button><div class="accordion-content"><p>The first Smart Meter Communication Licence came into effect on 23 September 2013, held by Smart DCC Ltd, with an ex-post price control. It remains available for reference, alongside the Licence Application Business Plan.</p></div></div></div></div>',
  [('Content', 'A text change to one page. The wording is a draft for DCC\'s regulation team; the facts come from DCC\'s own Licence Renewal page.', False), ('Open question', 'Was the first licence extended to run until transfer? If so, the history panel should say so.', True)], None),
 ('The move to DCC 2 Ltd', 'notice', 'Transition notice', 'Tell every visitor about the transfer',
  'A short notice across the site, pointing to the Licence Renewal page, until the new arrangements have bedded in.', 3,
  '<p>DCC has published a clear Licence Renewal page, but it sits in the About DCC menu. The homepage and every other page carry on as before, so a customer has to go looking for it.</p>',
  '<div class="notice-bar" id="notice-bar" role="region" aria-label="Notice"><div class="container"><p><strong>From 2 November 2026, DCC\'s services are delivered by DCC 2 Ltd.</strong> Services, contacts and our name stay the same. <a href="#">What\'s changing</a></p><button type="button" class="notice-close">Hide this</button></div></div>' + UTIL_NOW + '<p style="margin-top:1rem"><button type="button" class="btn btn-sm btn-secondary" data-notice-reset>Show the notice again</button></p>',
  [('Behaviour', 'The notice sits above the header on every page. Hiding it keeps it hidden for the rest of the visit. Editors set the wording and the date it stops showing.', False), ('Open question', 'How long should it run? We\'d suggest until the first DCC 2 Ltd invoices have gone out.', True)], None),
 ('Getting people to the right place', 'public-link', 'Public link', 'Give the public a way in',
  'A "Smart meter problem?" link in the header, straight to the help page DCC already has.', 6,
  '<p>The consumer help page is reached through Contact us, then the "Members of the public" panel. It answers ten common questions well, and its first answer is that your energy supplier is the one to call. That only helps once you\'ve found it.</p>',
  util_with('<a href="#qw-public-help" class="util-highlight">Smart meter problem?</a>') + '<div class="qw-landing" id="qw-public-help"><p class="wf-meta">Where the link goes: the existing help page, with one question added at the top</p><div class="finder">' + FINDER + '</div></div>',
  [('Content', 'The help page itself already exists. This adds a header link and, optionally, the single question at the top.', False)], ('1', '../pages/public.html', 'Help for the public')),
 ('Getting people to the right place', 'contact', 'Contact us', 'Make Contact us ask what you need',
  'One question, one answer, instead of eight panels of email addresses.', 32,
  '<p>Contact us is eight accordion panels of email addresses, grouped by team rather than by what the visitor wants. Two smaller things: the switching address has a full stop inside its link, and the London map pin is labelled Ibex House while the address above it reads Riverscape.</p>',
  CONTACT_HTML,
  [('Behaviour', 'Choosing an option shows one answer with its email address as text and a copy button. The addresses are the ones on the live page.', False), ('Open question', 'Is Ibex House still in use, or should the pin say Riverscape?', True)], None),
 ('Getting people to the right place', 'service-centre', 'Service Centre', 'Put the Service Centre in the header',
  'For customers with a live problem, one click to the people who can fix it.', 33,
  '<p>Customers with an operational problem find the Service Centre\'s address inside the "Customer queries" panel on Contact us, after a paragraph about escalations.</p>',
  util_with('<button type="button" class="util-btn" data-disclose="sc-panel" aria-expanded="false">Service Centre</button>') + '<div class="qw-dropdown" id="sc-panel" hidden><h3>Service Centre</h3><p>For incidents and service requests. Our Service Centre is for energy companies and can\'t help with general smart meter questions.</p>' + copy('servicecentre@smartdcc.co.uk') + '<ul class="hub-links" style="margin-top:1rem"><li><a href="#">Raise or track an incident in the Self-Service Interface</a></li><li><a href="#">Escalate an unresolved issue</a></li></ul><p class="wf-meta">Opening hours: [to confirm with DCC]</p></div>',
  [('Behaviour', 'The link opens a small panel rather than a page, so the address is one click away from anywhere on the site.', False)], None),
 ('Getting people to the right place', 'sitemap', 'Sitemap', 'A sitemap people can read',
  'Replace the link to sitemap.xml with a page that lists every section.', 39,
  '<p>The Sitemap link in the footer opens sitemap.xml, a file written for search engines. A person who clicks it gets a page of code.</p>',
  SITEMAP_HTML,
  [('Behaviour', 'Built from the site navigation, so it updates itself. Typing filters the list. The XML file stays for search engines.', False)], None),
 ('Small fixes that add up', 'email-links', 'Email links', 'Fix the broken email links',
  'Two links send email to addresses that don\'t exist, because of a stray full stop.', 18,
  '<ul class="qw-code"><li><span>VWAN consultation, "Please email your response…"</span><code>mailto:consultations@smartdcc.co.uk.</code></li><li><span>Contact us, Switching queries</span><code>mailto:contact.switching@smartdcc.co.uk.</code></li></ul><p>In both, the full stop that ends the sentence is part of the link, so the email goes to an address ending ".uk." and bounces.</p>',
  '<div class="table-wrap"><table class="data-table"><thead><tr><th>Page</th><th>Link after the fix</th></tr></thead><tbody><tr><td>VWAN consultation</td><td>' + copy('consultations@smartdcc.co.uk') + '</td></tr><tr><td>Contact us: Switching queries</td><td>' + copy('contact.switching@smartdcc.co.uk') + '</td></tr></tbody></table></div><p class="wf-meta" style="margin-top:0.75rem">Shown as text with a copy button, so the address works whether or not the visitor has an email app set up.</p>',
  [('Content', 'We found these two by hand. A check of every email link in the CMS would find any others.', False)], None),
 ('Small fixes that add up', 'link-text', 'Link text', 'Links that say where they go',
  'Four onboarding steps link the word "here". Name the destination instead.', 26,
  switch('lt', [('now', 'As written'), ('sr', 'As a screen reader lists the links')]) + panel('lt', 'now', '<ol class="qw-steps"><li>If you\'re an energy supplier or network operator… you\'ll need to become party to the Smart Energy Code. You can find out how <a href="#">here</a>.</li><li>…you\'ll need a DCC User Gateway Connection. You can order one from <a href="#">here</a>.</li><li>All the steps you need to follow… are right <a href="#">here</a> in the SMKI RAPP.</li><li>Find out more about the tests <a href="#">here</a>.</li></ol>', True) + panel('lt', 'sr', '<ul class="qw-linklist"><li>here</li><li>here</li><li>here</li><li>here</li></ul>'),
  switch('lt2', [('now', 'As written'), ('sr', 'As a screen reader lists the links')]) + panel('lt2', 'now', '<ol class="qw-steps"><li>If you\'re an energy supplier or network operator, you\'ll need to <a href="#">become a party to the Smart Energy Code</a>.</li><li>You\'ll need a DCC User Gateway Connection. <a href="#">Order one through the Customer Service Centre</a>.</li><li>Follow the steps in the <a href="#">SMKI Registration Authority Policies and Procedures (RAPP)</a>.</li><li>Read about the <a href="#">SMKI and Repository Entry Process Tests</a>.</li></ol>', True) + panel('lt2', 'sr', '<ul class="qw-linklist"><li>become a party to the Smart Energy Code</li><li>Order one through the Customer Service Centre</li><li>SMKI Registration Authority Policies and Procedures (RAPP)</li><li>SMKI and Repository Entry Process Tests</li></ul>'),
  [('Accessibility', 'Screen reader users often move through a page by its list of links. Four links called "here" give them nothing to go on.', False)], None),
 ('Small fixes that add up', 'latest-plan', 'Latest plan', 'One link to the latest plan',
  'Three pages link to three different versions of the Business and Development Plan.', 17,
  '<div class="table-wrap"><table class="data-table"><thead><tr><th>Page</th><th>Links to</th></tr></thead><tbody><tr><td>What we\'re working on</td><td>Business and Development Plan 2024/25</td></tr><tr><td>Customer Engagement</td><td>Business &amp; Development Plan 2025/26</td></tr><tr><td>Business &amp; Development Plan</td><td>"Our full 2025 Business &amp; Development Plan"</td></tr></tbody></table></div>',
  '<div class="qw-plan"><p class="wf-meta">The same block on all three pages</p><h3>Business and Development Plan 2025/26</h3><p>Our strategic priorities for the next five years and how we\'ll deliver them.</p><div class="row" style="gap:0.75rem;flex-wrap:wrap"><a class="btn btn-sm" href="#">Download PDF (5.29 MB)</a><a class="btn btn-sm btn-secondary" href="#">Interactive plan</a></div></div>',
  [('Content', 'The block is set once in the CMS and placed on each page, so publishing the next plan updates all three together.', False), ('Open question', 'With a second business plan under consultation for April 2028, should the block also mention it?', True)], None),
 ('Small fixes that add up', 'values', 'Values', 'Show all three values',
  'Who we are promises three core values and shows one.', 38,
  quote('At the DCC we have three core values that guide us in our work.') + '<p>Below it, the page shows one: Partnering with people. Either two have gone missing in an edit, or the introduction is out of date.</p>',
  switch('val', [('a', 'Option A: show all three'), ('b', 'Option B: reword the introduction')]) + panel('val', 'a', '<div class="grid grid-3 qw-values"><div class="card"><h3 class="card-title">Partnering with people</h3><p class="card-text">We think working smarter means working together. We believe in collaboration, fostering enjoyable relationships with our customers and people, not simply necessary ones.</p></div><div class="card"><h3 class="card-title">[Second value]</h3><p class="card-text">[Wording from DCC]</p></div><div class="card"><h3 class="card-title">[Third value]</h3><p class="card-text">[Wording from DCC]</p></div></div>', True) + panel('val', 'b', '<div class="qw-page"><p>Our values guide how we work with our customers and with each other.</p><div class="card" style="max-width:420px"><h3 class="card-title">Partnering with people</h3><p class="card-text">We think working smarter means working together…</p></div></div>'),
  [('Open question', 'What are the other two values, and are they still current under DCC 2 Ltd?', True)], None),
 ('Small fixes that add up', 'content-tidy', 'Content tidy', 'Retire out-of-date content',
  'A short audit of pages and articles that describe a DCC that has moved on.', 35,
  '<p>Most of the site is current. A handful of items aren\'t, and some of them still appear in search results.</p>',
  '<div class="table-wrap"><table class="data-table"><thead><tr><th>Item</th><th>Where</th><th>Action</th></tr></thead><tbody>'
  '<tr><td>"Starting a new job in lockdown" (2020)</td><td>News, Industry insight</td><td><span class="status closed">Archive</span></td></tr>'
  '<tr><td>"The licence… is 12 years long"</td><td>Licence &amp; Regulation</td><td><span class="status response">Update</span> See quick win 1</td></tr>'
  '<tr><td>Business and Development Plan 2024/25</td><td>What we\'re working on</td><td><span class="status response">Update</span> See quick win 9</td></tr>'
  '<tr><td>"Twitter" link</td><td>Footer</td><td><span class="status response">Update</span> See quick win 12</td></tr>'
  '<tr><td>Map pin labelled Ibex House</td><td>Contact us</td><td><span class="status upcoming">Check</span></td></tr>'
  '<tr><td>"Please complete the contact us form"</td><td>Help for the public</td><td><span class="status upcoming">Check</span> There is no form on Contact us</td></tr>'
  '</tbody></table></div>',
  [('Content', 'This is what we found while reviewing the site, not a full audit. A full pass would cover the 136 news items and 80 pages, and could repeat every six months.', False)], None),
 ('Small fixes that add up', 'social', 'Social links', 'Update the social links',
  'The footer still links to Twitter.', 40,
  '<div class="qw-footer"><b>Social links</b><a href="#">LinkedIn</a><a href="#">Twitter</a><span class="wf-meta">twitter.com/smartdcc</span></div>',
  '<div class="qw-footer"><b>Follow us</b><a href="#">LinkedIn</a><a href="#">X</a><span class="wf-meta">x.com/smartdcc, or removed if the account is no longer used</span></div>',
  [('Open question', 'Is the X account still active? If not, removing it is better than relabelling it.', True)], None),
 ('Small fixes that add up', 'headings', 'Heading order', 'Put headings in the right order',
  'On the homepage, six menu headings come before the page\'s main heading.', 41,
  '<p class="wf-meta">The homepage outline, as a screen reader or search engine reads it</p><ol class="qw-outline"><li><b>H2</b> About DCC</li><li><b>H2</b> Our Smart Network</li><li><b>H2</b> Enabling innovation</li><li><b>H2</b> About DCC</li><li><b>H2</b> Our Smart Network</li><li><b>H2</b> Enabling innovation</li><li class="main"><b>H1</b> Smarter energy for a greener tomorrow</li><li><b>H2</b> One smart meter at a time</li><li><b>H2</b> Transforming Britain\'s energy infrastructure</li><li><b>H2</b> Helping turn your vision into reality</li></ol>',
  '<p class="wf-meta">The same page, with menu labels no longer marked as headings</p><ol class="qw-outline"><li class="main"><b>H1</b> Smarter energy for a greener tomorrow</li><li><b>H2</b> One smart meter at a time</li><li class="sub"><b>H3</b> Smart meters on DCC network</li><li class="sub"><b>H3</b> CO₂ emissions saved</li><li><b>H2</b> Transforming Britain\'s energy infrastructure</li><li><b>H2</b> Helping turn your vision into reality</li><li><b>H2</b> Shape the future of energy</li></ol>',
  [('Accessibility', 'Nothing changes visually. The menu labels become plain text, and every page then starts its outline with its own H1.', False)], None),
 ('Data', 'numbers', 'Headline numbers', 'Headline numbers everyone can read',
  'The meter counter and CO₂ dial, with their real values available to screen readers.', 10,
  switch('hn', [('look', 'What you see'), ('hear', 'What a screen reader hears')]) + panel('hn', 'look', '<p>A rolling counter showing the number of meters, and a dial whose needle shows CO₂ saved. The dial has no number on it.</p>', True) + panel('hn', 'hear', '<p class="qw-hear">"0 1 2 3 4 5 6 7 8 9, 0 1 2 3 4 5 6 7 8 9, comma, 0 1 2 3 4 5 6 7 8 9…" (eight times). "Smart meters on DCC network." "0, 375,000, 750,000, 1,125,000, 1,500,000. CO2 emissions saved."</p>'),
  '<div class="meter-band"><div class="meter-grid"><div><div class="meter" data-meter="meters"></div><p class="meter-caption">Smart meters on the DCC network</p></div><div><svg class="dial" viewBox="0 0 160 90" data-dial="co2" data-max="1500000" aria-hidden="true"></svg><p class="meter-caption"><span data-stat="co2"></span> tonnes of CO₂ saved in the past year</p></div></div></div><p class="qw-hear" style="margin-top:1rem">A screen reader now hears: "38,965,999. Smart meters on the DCC network. 1,440,963 tonnes of CO₂ saved in the past year."</p>',
  [('Accessibility', 'The digits look the same. They\'re hidden from screen readers, and the real number is given once instead.', False)], ('1', '../pages/home.html', 'the homepage')),
 ('Data', 'stats', 'Statistics as text', 'Statistics that are there from the start',
  'Put the numbers in the page itself, rather than filling them in as each card scrolls into view.', 11,
  '<p class="wf-meta">The Smart meter statistics page, as a search engine or link preview reads it before anyone scrolls</p><div class="stat-row qw-zero"><div><b>0 0 0 0</b><span>Average daily connection rate</span></div><div><b>—</b><span>Connected premises</span></div><div><b>—</b><span>Connected devices</span></div><div><b>0 0 0 0</b><span>CO₂ emissions saved</span></div></div>',
  '<div class="stat-row"><div><b data-stat="dailyRate"></b><span>Average weekday SMETS2 connections</span></div><div><b data-stat="premises"></b><span>Homes and small businesses</span></div><div><b data-stat="devices"></b><span>Connected devices</span></div><div><b data-stat="co2"></b><span>Tonnes of CO₂ saved in the past year</span></div></div><p class="wf-meta" style="margin-top:0.5rem">Figures from the live page, 28 September 2026. The count-up animation can stay; it starts from the real number already in the page.</p>',
  [('Content', 'Search engines, link previews on LinkedIn and Teams, and some screen readers see the page before any scrolling happens.', False)], ('3', '../pages/performance.html', 'Network performance')),
 ('Consultations and news', 'days-left', 'Days left', 'Show how long is left on each consultation',
  'Open consultations first, with the number of days left and a clear status.', 19,
  '<ul class="rows qw-plain"><li><div class="meta"><span>Open</span><span>04.09.2026 – 02.10.2026</span></div><h3>DCC Consultation on Charging Group Weighting Factors and Efficient Usage of the Network</h3></li><li><div class="meta"><span>Closed</span><span>Closed On 25.09.2026</span></div><h3>Proposed Maintenance Deferral Policy</h3></li><li><div class="meta"><span>Open</span><span>18.09.2026 – 30.10.2026</span></div><h3>Consultation on the Virtual Wide Area Network (VWAN) arrangements</h3></li></ul><p>Open and closed consultations look the same, and the reader works out the deadline from a date range.</p>',
  '<ul class="rows" id="qw-cons"></ul>',
  [('Behaviour', 'Days left are worked out from the closing date, so nobody updates them. Anything closing within seven days is marked. Shown as at 28 September 2026.', False)], ('2', '../pages/consultations.html', 'Consultations')),
 ('Consultations and news', 'status-colours', 'Status colours', 'Give status a colour',
  'A small set of status colours, used the same way wherever something is open, current or affected.', 47,
  '<p>Open, Closed and DCC Response are shown as plain words in the same style. So is "Version: 2" on documents. Nothing tells the eye what needs attention.</p>',
  '<div class="qw-swatches"><div><h3>Consultations</h3><span class="status open">Open</span> <span class="days-left soon">Closes in 4 days</span><br><span class="status upcoming">Upcoming</span> <span class="status response">DCC response</span> <span class="status closed">Closed</span></div><div><h3>Documents</h3><span class="badge-current">Current · v2</span> <span class="badge-old">Superseded</span></div><div><h3>Service and programmes</h3><span class="svc-state ok">Operating normally</span><br><span class="svc-state degraded">Degraded</span><br><span class="state on-track">On track</span> <span class="state at-risk">At risk</span></div></div>',
  [('Content', 'Green and amber are additions to the DCC palette, kept for status only so they don\'t compete with the brand colours. Each one passes contrast checks and always comes with a word, never colour alone.', False)], None),
 ('Consultations and news', 'latest-consultations', 'Latest consultations', 'Fill in "Latest consultations"',
  'The Customer Engagement block of that name lists no consultations.', 37,
  '<div class="qw-page"><h3 class="qw-page-h">Latest consultations</h3><p>We\'re keen to hear your views on a number of proposals we would like to make connected to our network.</p><a class="btn btn-sm btn-secondary" href="#">View all consultations</a></div><p>That\'s the whole block.</p>',
  '<div class="qw-page"><h3 class="qw-page-h">Latest consultations</h3><p>We\'re keen to hear your views on a number of proposals we would like to make connected to our network.</p><ul class="rows" id="latest-cons"></ul><a class="btn btn-sm btn-secondary" href="#">View all consultations</a></div>',
  [('Behaviour', 'Shows the three open consultations closing soonest, taken from the consultations listing. Shown as at 28 September 2026.', False)], None),
 ('Consultations and news', 'news-dates', 'News dates', 'Put dates on news',
  'News cards show reading time but not when the news happened.', 34,
  '<ul class="rows qw-plain"><li><div class="meta"><span class="kind">News &amp; Updates</span><span>4 mins</span></div><h3>Centralogic becomes first new customer to onboard through DCC Connect</h3></li><li><div class="meta"><span class="kind">News &amp; Updates</span><span>3 mins</span></div><h3>DCC enters new era with appointment of independent Board</h3></li><li><div class="meta"><span class="kind">News &amp; Updates</span><span>3 min</span></div><h3>One million premises now connected to 4G communications</h3></li></ul>',
  '<ul class="rows"><li><div class="meta"><span class="kind">News &amp; Updates</span><span>[Date]</span><span>4 min read</span></div><h3><a href="#">Centralogic becomes first new customer to onboard through DCC Connect</a></h3></li><li><div class="meta"><span class="kind">News &amp; Updates</span><span>30 September 2026</span><span>3 min read</span></div><h3><a href="#">DCC enters new era with appointment of independent Board</a></h3></li><li><div class="meta"><span class="kind">News &amp; Updates</span><span>11 May 2026</span><span>3 min read</span></div><h3><a href="#">One million premises now connected to 4G communications</a></h3></li></ul>',
  [('Content', 'Each article already has its date. This shows it on the card, and makes "3 min" and "3 mins" consistent.', False)], None),
 ('Partners', 'partner-form', 'Partner form', 'Send partner enquiries to the right team',
  'Two questions at the top of the form do the sorting that someone does by hand now.', 29,
  '<p>The form asks for:</p><ul class="qw-fields"><li>Name *</li><li>Job title *</li><li>Company *</li><li>Email address *</li><li>How can we work together? *</li><li>Consent for storing submitted data *</li></ul><p>Everything that tells DCC who should reply arrives as free text.</p>',
  FORM,
  [('Behaviour', 'The destination team updates as soon as the organisation type is chosen, and the one extra question changes with it. Energy services and data companies are pointed to DCC Connect, the new onboarding tool.', False), ('Open question', 'Do the three named contacts on Partner with DCC want enquiries directly, or through a shared inbox this form would feed?', True)], ('4', '../pages/partner-enquiry.html', 'Partner enquiry')),
 ('Partners', 'quotes', 'Customer quotes', 'Use customer quotes where they help',
  'DCC has eight good customer quotes in a carousel. Put the right one next to the decision it supports.', 30,
  '<p>Eight named testimonials sit in one carousel on Partner with DCC, shown one at a time, from UrbanChain to Highland Electricity.</p>',
  '<div class="qw-quotes"><div class="qw-page"><p class="wf-meta">Partner with DCC: onboarding for energy services and data companies</p><h3 class="qw-page-h">Becoming a DCC Other User</h3><p>Apply through DCC Connect, which takes you through each step in order.</p><blockquote class="quote-ph">[Quote from UrbanChain, from the existing testimonials on Partner with DCC]</blockquote></div><div class="qw-page"><p class="wf-meta">Enabling Innovation: test labs and DCC Boxed</p><h3 class="qw-page-h">Test with the real network</h3><p>Access Britain\'s largest secure smart metering test lab, on site or remotely.</p><blockquote class="quote-ph">[Quote from Passiv about DCC Boxed, from the existing testimonials]</blockquote></div></div>',
  [('Content', 'No new quotes needed: these are the ones already published, placed where they back up what the page is asking someone to do.', False)], None),
]

N = len(QW)
links, cards, groups_seen = [], [], []
os.makedirs(f'{SRC}/quick', exist_ok=True)
for i, (group, slug, short, title, lead, idea, now, after, notes, related) in enumerate(QW, 1):
    fn = f'qw-{i:02d}-{slug}.html'
    links.append(f'          <li><a href="~/quick/{fn}" data-proto="qw-{i:02d}-{slug}"><span class="n">{i}</span> {short}</a></li>')
    if group not in groups_seen:
        if groups_seen: cards.append('        </div>')
        groups_seen.append(group)
        cards.append(f'        <h3 class="qw-group">{group}</h3>\n        <div class="qw-cards">')
    cards.append(f'          <a class="qw-card" href="~/quick/{fn}"><span class="qw-num">{i}</span><span><b>{title}</b><span>{lead}</span></span></a>')
    rel = ''
    if related:
        rel = f'<p class="qw-related">Also part of prototype {related[0]}, in context: <a href="{related[1].replace("../", "~/")}">{related[2]}</a></p>'
    notes_html = '\n'.join('      ' + note(k + 1, l, t, q) for k, (l, t, q) in enumerate(notes))
    page = f'''<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{html.unescape(title)} — Smart DCC quick win</title>
  <link rel="stylesheet" href="~/css/base.css">
  <link rel="stylesheet" href="~/css/components.css">
  <link rel="stylesheet" href="~/css/theme.css">
</head>
<body data-pack="quick">
  <!-- @@include header.html -->

  <main id="main" class="flush">
    <!-- Quick win Q{i:02d} (idea #{idea}) -->
    <div class="band qw-band">
      <div class="container">
        <p class="wf-meta">Quick win {i} of {N} · {group}</p>
        <h1>{title}</h1>
        <p class="lead">{lead}</p>
      </div>
    </div>

    <div class="container qw">
      <section class="qw-now" aria-labelledby="now-title">
        <h2 id="now-title">Now</h2>
        {now}
      </section>
      <section class="qw-after" aria-labelledby="after-title">
        <h2 id="after-title">With this change</h2>
        {after}
      </section>
{notes_html}
      {rel}
    </div>
  </main>

  <!-- @@include footer.html -->
  <script src="~/js/data.js"></script>
  <script src="~/js/wireframe.js"></script>
  <script src="~/js/photos.js"></script>
</body>
</html>
'''
    open(f'{SRC}/quick/{fn}', 'w').write(page)
cards.append('        </div>')
open(f'{SRC}/includes/quick-links.html', 'w').write('\n'.join(links) + '\n')
open(f'{SRC}/includes/quick-cards.html', 'w').write('\n'.join(cards) + '\n')
print('wrote', N, 'quick wins')
