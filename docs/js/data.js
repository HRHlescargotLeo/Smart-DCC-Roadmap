/* data.js — sample content for the Smart DCC prototypes.
   Real where marked "live": figures and titles taken from smartdcc.co.uk on 28 Sep 2026.
   Everything else is illustrative sample data, clearly labelled on the pages. */

/* Today, fixed so "days left" and status read the same in every review. */
window.DCC_TODAY = '2026-09-28';

/* Headline statistics (live, 28.09.2026) */
window.DCC_STATS = {
  meters: 38965999,
  smets2: 28422823,
  smets1: 10543176,
  dailyRate: 16421,
  premises: 23323572,
  devices: 97295748,
  messagesMonthly: 3710345257,
  co2: 1440963,
  updated: '28.09.2026'
};

/* Network performance, Aug 2025 to Jul 2026 (live: read from the chart images on the Performance page) */
window.DCC_PERF = {
  months: ['Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26'],
  series: [
    { id: 'requests', title: 'Successful service requests', unit: '%', avgLabel: 'Overall average', avg: 94.0,
      desc: 'Commands sent over the network to a smart meter, such as a request for a reading, that completed successfully.',
      values: [93.6, 93.1, 93.3, 94.0, 93.6, 93.9, 93.7, 94.2, 94.7, 94.6, 94.5, 94.6],
      volume: { from: '2.9bn requests in Aug 2025', to: '3.6bn in Jul 2026', change: '+24.1%' } },
    { id: 'topups', title: 'Successful prepayment top-ups', unit: '%', avgLabel: 'Prepay average', avg: 98.2,
      desc: 'Prepayment top-up requests carried on the network that completed successfully.',
      values: [97.9, 97.8, 97.5, 98.2, 98.3, 98.5, 98.3, 98.4, 98.4, 98.5, 98.2, 98.4],
      volume: { from: '11.5m top-ups in Aug 2025', to: '12.3m in Jul 2026', change: '+6.7%' } },
    { id: 'availability', title: 'Network availability', unit: '%', avgLabel: 'Average', avg: 99.5,
      desc: 'Proportion of time the network was operating as normal.',
      values: [99.6, 97.8, 99.8, 99.7, 100, 100, 99.6, 98.0, 100, 99.8, 99.0, 99.9] },
    { id: 'planned', title: 'Availability during planned changes', unit: '%', avgLabel: 'Planned change window average', avg: 98.0,
      desc: 'How often the network ran as normal during planned upgrades.',
      values: [98.1, 97.1, 97.2, 98.5, 99.4, 99.4, 98.5, 95.9, 97.0, 98.1, 97.6, 98.5] }
  ]
};

/* Consultations. Titles, statuses and dates are live (page 1 of the listing on 28.09.2026);
   topics and audiences are our tagging. */
window.DCC_CONSULTATIONS = [
  { id: 'vwan', title: 'Consultation on the Virtual Wide Area Network (VWAN) arrangements', status: 'open', opens: '2026-09-18', closes: '2026-10-30', topic: 'Network and coverage', audience: 'SEC Parties',
    summary: 'Proposed changes to the SEC to support the Virtual Wide Area Network arrangements. Mostly clarifications to the existing framework.' },
  { id: 'testing-rfi', title: 'Request for Information on Revised DCC Testing Arrangements', status: 'open', opens: '2026-09-16', closes: '2026-10-16', topic: 'Testing', audience: 'All customers',
    summary: 'DCC is seeking feedback and insight on future testing requirements.' },
  { id: 'charging', title: 'Consultation on Charging Group Weighting Factors and Efficient Usage of the Network', status: 'open', opens: '2026-09-04', closes: '2026-10-02', topic: 'Charging', audience: 'SEC Parties',
    summary: 'Feedback from Parties on the proposed future direction on charging.' },
  { id: 'maintenance', title: 'Proposed Maintenance Deferral Policy', status: 'closed', closes: '2026-09-25', topic: 'Service management', audience: 'SEC Parties',
    summary: 'How DCC proposes to handle deferring planned maintenance on its systems.' },
  { id: 'lrr', title: 'Proposed Changes to Service Provider Performance Measures Contract – LRR', status: 'closed', closes: '2026-09-15', topic: 'Performance', audience: 'SEC Parties',
    summary: 'Proposed changes to Long Range Radio service provider contracts.' },
  { id: 'wansa-conclusion', title: 'DCC conclusions on updates to the WAN Selection Arrangements', status: 'response', published: '2026-09-02', topic: 'Network and coverage', audience: 'SEC Parties', parent: 'wansa',
    summary: 'DCC\'s conclusions on the WANSA consultation, clarifying the parameters used by Virtual WAN Communications Hubs.' },
  { id: 'remuneration', title: 'DCC Response to Ofgem\'s Remuneration Policy Guidance Consultation', status: 'response', published: '2026-08-20', topic: 'Regulation', audience: 'Industry and government',
    summary: 'DCC\'s position on Ofgem\'s proposals for a Remuneration Policy from 1 April 2027.' },
  { id: 'wansa', title: 'Consultation on the Wide Area Network Selection Arrangements (WANSA)', status: 'closed', closes: '2026-07-27', topic: 'Network and coverage', audience: 'SEC Parties', child: 'wansa-conclusion',
    summary: 'Proposed changes to the WANSA document to give more clarity on the parameters used by Virtual WAN Communications Hubs.' },
  { id: 'pmm-conclusion', title: 'Conclusion on Proposed Amendments to the Performance Measures Methodology', status: 'response', published: '2026-07-20', topic: 'Performance', audience: 'SEC Parties',
    summary: 'Conclusions on amendments to the PMM and the Reported List of Service Provider Performance Measures.' },
  { id: 'fsm', title: 'FSM consultation on updates to the code required documents', status: 'closed', closes: '2026-07-13', topic: 'Service management', audience: 'SEC Parties',
    summary: 'Updates to code required documents for the Future Service Management solution.' },
  { id: 'budget-2029', title: 'Indicative Budget consultation, RY28/29 and RY29/30', status: 'upcoming', opens: '2026-10-19', closes: '2026-11-16', topic: 'Charging', audience: 'SEC Parties', sample: true,
    summary: 'Sample upcoming consultation, to show how "Upcoming" items would appear.' }
];

/* Forums and events. Forum names are live (Customer Engagement page); dates are sample. */
window.DCC_EVENTS = [
  { date: '2026-10-01', title: 'Operations Forum', type: 'Forum', where: 'Online', audience: 'SEC Parties', desc: 'Incident and problem management, service requests, change and release.' },
  { date: '2026-10-07', title: 'Design Release Forum', type: 'Forum', where: 'Online', audience: 'SEC Parties', desc: 'Design-level detail of upcoming releases, with time for questions.' },
  { date: '2026-10-14', title: 'VWAN consultation briefing', type: 'Webinar', where: 'Online', audience: 'SEC Parties', desc: 'A walk through the VWAN proposals before the consultation closes.' },
  { date: '2026-10-21', title: 'Quarterly Finance Forum', type: 'Forum', where: 'London and online', audience: 'SEC Parties', desc: 'The charging statement for next year and the three-year forecast.' },
  { date: '2026-11-04', title: 'Moving to DCC2: customer briefing', type: 'Webinar', where: 'Online', audience: 'All customers', desc: 'What the transfer means for contracts, contacts and charges.' },
  { date: '2026-11-18', title: 'Interoperability test event', type: 'Test event', where: 'Manchester', audience: 'Manufacturers and innovators', desc: 'Test devices against the DCC network at the Operations Centre.' },
  { date: '2026-12-02', title: 'Operations Forum', type: 'Forum', where: 'Online', audience: 'SEC Parties', desc: 'Incident and problem management, service requests, change and release.' }
];

/* Documents. The first nine are live (Document Centre page 1); the rest are sample entries
   built from real document types and naming on the site. */
window.DCC_DOCS = [
  { t: 'DCC MAP Manufacturer reporting document', cat: 'General', date: '2026-09-28', ry: '2026/27', prog: 'Devices', type: 'PDF', size: '412 KB', v: 1, live: true },
  { t: 'Wide Area Network Selection Arrangements', cat: 'General', date: '2026-09-08', ry: '2026/27', prog: 'VWAN', type: 'PDF', size: '1.1 MB', v: 2, prev: [{ v: 1, date: '2025-11-14' }], live: true },
  { t: 'Annual Service Report 2025/2026', cat: 'Annual Reports', date: '2026-09-01', ry: '2025/26', prog: 'Corporate', type: 'PDF', size: '3.2 MB', v: 1, live: true },
  { t: 'DCC Annual Report 2026', cat: 'Annual Reports', date: '2026-08-28', ry: '2025/26', prog: 'Corporate', type: 'PDF', size: '4.47 MB', v: 1, live: true },
  { t: 'Smart DCC Annual Compliance Report RY 2025/26', cat: 'Annual Reports', date: '2026-07-31', ry: '2025/26', prog: 'Regulation', type: 'PDF', size: '860 KB', v: 1, live: true },
  { t: 'Information Security Policy', cat: 'General', date: '2026-07-30', ry: '2026/27', prog: 'Corporate', type: 'PDF', size: '240 KB', v: 3, prev: [{ v: 2, date: '2025-07-28' }, { v: 1, date: '2024-06-03' }], live: true },
  { t: 'DCC Business Handover Plan (BHP)', cat: 'Business & Development plans', date: '2026-07-10', ry: '2026/27', prog: 'DCC2 transition', type: 'PDF', size: '1.9 MB', v: 1, live: true },
  { t: 'Indicative Budget RY28/29 and RY29/30', cat: 'Charging', date: '2026-07-03', ry: '2026/27', prog: 'Charging', type: 'PDF', size: '720 KB', v: 2, prev: [{ v: 1, date: '2026-04-02' }], live: true },
  { t: 'Indicative Charging Statement RY27/28', cat: 'Charging', date: '2026-07-03', ry: '2026/27', prog: 'Charging', type: 'PDF', size: '980 KB', v: 2, prev: [{ v: 1, date: '2026-04-02' }], live: true },
  { t: 'Annual Outage Plan 2026/27', cat: 'Service Management', date: '2026-04-01', ry: '2026/27', prog: 'Service management', type: 'PDF', size: '528 KB', v: 1 },
  { t: 'Business & Development Plan 2025/26', cat: 'Business & Development plans', date: '2025-06-30', ry: '2025/26', prog: 'Corporate', type: 'PDF', size: '5.29 MB', v: 1 },
  { t: 'Business and Development Plan 2024/25', cat: 'Business & Development plans', date: '2024-06-28', ry: '2024/25', prog: 'Corporate', type: 'PDF', size: '4.09 MB', v: 1, superseded: true },
  { t: 'Charging Statement RY26/27', cat: 'Charging', date: '2026-03-02', ry: '2025/26', prog: 'Charging', type: 'PDF', size: '1.2 MB', v: 1 },
  { t: 'Charging Statement RY25/26', cat: 'Charging', date: '2025-03-03', ry: '2024/25', prog: 'Charging', type: 'PDF', size: '1.1 MB', v: 1, superseded: true },
  { t: 'Communications Hub Installation and Maintenance Support Materials', cat: 'Communication hubs', date: '2026-05-12', ry: '2026/27', prog: 'Devices', type: 'PDF', size: '6.4 MB', v: 7, prev: [{ v: 6, date: '2025-10-20' }] },
  { t: 'Dual Band Communications Hub Product Guide', cat: 'Communication hubs', date: '2026-02-16', ry: '2025/26', prog: 'Devices', type: 'PDF', size: '2.3 MB', v: 3, prev: [{ v: 2, date: '2024-09-09' }] },
  { t: 'GFI User Guide', cat: 'GFI', date: '2026-06-22', ry: '2026/27', prog: 'Testing', type: 'PDF', size: '1.4 MB', v: 5, prev: [{ v: 4, date: '2025-12-01' }] },
  { t: 'Parse and Correlate Software Release Notes 6.2', cat: 'Parse and Correlate', date: '2026-08-11', ry: '2026/27', prog: 'Testing', type: 'ZIP', size: '18 MB', v: 1 },
  { t: 'Test Completion Report: DSMS Release 2', cat: 'Test Completion Reports', date: '2026-06-05', ry: '2026/27', prog: 'DSMS', type: 'PDF', size: '690 KB', v: 1 },
  { t: 'Test Completion Report: MHHS Release 1.1', cat: 'Test Completion Reports', date: '2026-04-17', ry: '2026/27', prog: 'MHHS', type: 'PDF', size: '740 KB', v: 1 },
  { t: 'SIT Depth and Breadth: MHHS', cat: 'SIT Depth and Breadth', date: '2026-02-09', ry: '2025/26', prog: 'MHHS', type: 'XLSX', size: '210 KB', v: 2, prev: [{ v: 1, date: '2025-11-03' }] },
  { t: 'DMCT Process Guide', cat: 'DMCT Process', date: '2025-10-06', ry: '2025/26', prog: 'Devices', type: 'PDF', size: '560 KB', v: 4 },
  { t: 'TMAD: Testing Manual and Approach Document', cat: 'TMAD', date: '2026-03-23', ry: '2025/26', prog: 'Testing', type: 'PDF', size: '1.8 MB', v: 6 },
  { t: 'Service Provider Contract: Data Service Provider (redacted)', cat: 'Service provider contracts', date: '2025-09-11', ry: '2025/26', prog: 'DSP', type: 'PDF', size: '9.8 MB', v: 1 },
  { t: 'Customer onboarding: DCC Consultancy Framework Call Off Contract (redacted)', cat: 'Service provider contracts', date: '2025-09-11', ry: '2025/26', prog: 'Onboarding', type: 'PDF', size: '1.2 MB', v: 1 },
  { t: 'DCC Glossary of Terms', cat: 'General', date: '2025-05-19', ry: '2025/26', prog: 'Corporate', type: 'PDF', size: '145 KB', v: 1 },
  { t: 'Communication Services Availability Statement', cat: 'General', date: '2026-05-20', ry: '2026/27', prog: 'Regulation', type: 'PDF', size: '380 KB', v: 1 },
  { t: 'Data for Good Paper', cat: 'General', date: '2025-01-27', ry: '2024/25', prog: 'Innovation', type: 'PDF', size: '14.46 MB', v: 1 },
  { t: 'Category 1 Incidents: August 2026', cat: 'Service Management', date: '2026-09-05', ry: '2026/27', prog: 'Service management', type: 'PDF', size: '157.79 KB', v: 1 },
  { t: 'Category 1 Incidents: July 2026', cat: 'Service Management', date: '2026-08-05', ry: '2026/27', prog: 'Service management', type: 'PDF', size: '290.9 KB', v: 1 },
  { t: 'Price Control Submission RY25/26', cat: 'General', date: '2026-07-31', ry: '2025/26', prog: 'Regulation', type: 'PDF', size: '2.6 MB', v: 1 },
  { t: 'Modern Slavery Statement 2024/25', cat: 'General', date: '2025-09-30', ry: '2024/25', prog: 'Corporate', type: 'PDF', size: '310 KB', v: 1 },
  { t: 'VWAN Communications Hub Technical Specification', cat: 'Communication hubs', date: '2026-06-30', ry: '2026/27', prog: 'VWAN', type: 'PDF', size: '1.5 MB', v: 2, prev: [{ v: 1, date: '2026-01-19' }] },
  { t: 'Upgrading first-generation smart meters: programme update', cat: 'General', date: '2026-08-18', ry: '2026/27', prog: 'Devices', type: 'PDF', size: '670 KB', v: 1 },
  { t: 'Enduring Change of Supplier: close-down report', cat: 'Test Completion Reports', date: '2024-12-12', ry: '2024/25', prog: 'ECoS', type: 'PDF', size: '1.3 MB', v: 1 }
];

/* Pages, news and events for site search (titles live unless marked sample) */
window.DCC_PAGES = [
  { t: 'Help for the public', kind: 'Page', url: 'public.html', desc: 'Problems with a smart meter, bills, in-home displays and coverage, and who to contact.', keys: 'smart meter not working broken bill bills ihd in-home display economy 7 coverage aerial t3 install consumer public customer home firmware data privacy' },
  { t: 'Joining the network', kind: 'Page', url: 'join.html', desc: 'How to become a DCC customer, by type of organisation.', keys: 'onboarding join become customer other user supplier dno idno sec party gateway duis uept' },
  { t: 'Our new ownership', kind: 'Page', url: 'ownership.html', desc: 'DCC2, SECCo and the transfer from Capita in November 2026.', keys: 'dcc2 secco capita licence transfer ownership not-for-profit governance ofgem' },
  { t: 'Service status', kind: 'Page', url: 'status.html', desc: 'Current service status, incidents and planned maintenance.', keys: 'status incident outage down maintenance category 1 availability' },
  { t: 'Network performance', kind: 'Page', url: 'performance.html', desc: 'Monthly performance of the network, with data to download.', keys: 'performance availability top-up topup prepay service requests statistics data' },
  { t: 'What we\'re working on', kind: 'Page', url: 'programmes.html', desc: 'Programmes, their status and next milestones.', keys: 'programme programmes mhhs dsms dsp vwan roadmap milestone' },
  { t: 'Consultations', kind: 'Page', url: 'consultations.html', desc: 'Open, upcoming and closed consultations, and DCC responses.', keys: 'consultation consultations respond response open closed' },
  { t: 'Glossary', kind: 'Page', url: 'glossary.html', desc: 'Plain definitions of the terms and acronyms used on this site.', keys: 'glossary acronym definition duis smki sec' },
  { t: 'Partner with DCC', kind: 'Page', url: 'partner-enquiry.html', desc: 'Tell us about your organisation and we\'ll put you in touch with the right team.', keys: 'partner partnership enquiry contact innovation test lab' },
  { t: 'DCC launches new digital onboarding tool to simplify access to the smart meter network', kind: 'News', url: '#', date: '2026-09-16', desc: 'A guided journey for organisations applying to become a DCC Other User.', keys: 'onboarding tool other user uep' },
  { t: 'Ofgem formally awards next Smart Metering Communication Licence', kind: 'News', url: '#', date: '2026-06-02', desc: 'The licence is awarded to DCC2 Ltd, a wholly owned subsidiary of SECCo.', keys: 'dcc2 licence ofgem secco' },
  { t: 'One million premises now connected to 4G communications', kind: 'News', url: '#', date: '2026-05-11', desc: 'Over one million 4G Communications Hubs connected to the network.', keys: '4g communications hub milestone' },
  { t: 'Starting a new job in lockdown', kind: 'News', url: '#', date: '2020-06-15', desc: 'Industry insight, 2020.', keys: 'onboarding new job lockdown', archived: true }
];

/* Glossary. Definitions written for this prototype, to be checked by DCC. */
window.DCC_GLOSSARY = [
  { term: 'CH', full: 'Communications Hub', def: 'The device installed with a smart meter that connects it to the DCC network over the wide area network, and to other devices in the home over the home area network.' },
  { term: 'Category 1 incident', def: 'An incident that, in DCC\'s reasonable opinion, stops a large group of Service Users using DCC systems, has a critical impact on DCC, causes significant loss or disruption, or results in material loss or corruption of DCC data.' },
  { term: 'CSP', full: 'Communications Service Provider', def: 'A company contracted by DCC to provide the wide area network that carries messages to and from Communications Hubs in a region.' },
  { term: 'CSS', full: 'Central Switching Service', def: 'The central system, run by DCC, that supports faster and more reliable switching of energy supplier.' },
  { term: 'DCC2', def: 'DCC2 Ltd, a wholly owned subsidiary of SECCo and the holder of the new Smart Meter Communication Licence.' },
  { term: 'DCC Gateway Connection', def: 'The secure physical connection an organisation needs to exchange messages with DCC systems and use the Self-Service Interface.' },
  { term: 'DNO', full: 'Distribution Network Operator', def: 'A company licensed to run the local electricity network in a region of Great Britain.' },
  { term: 'DSP', full: 'Data Service Provider', def: 'The provider that runs the central data systems routing messages between energy companies and devices.' },
  { term: 'DUIS', full: 'DCC User Interface Specification', def: 'The XML web service specification that users build to, or buy, in order to send and receive messages through DCC.' },
  { term: 'ECoS', full: 'Enduring Change of Supplier', def: 'The service that updates security credentials on smart meters when a customer changes energy supplier. Completed in 2024.' },
  { term: 'GBCS', full: 'Great Britain Companion Specification', def: 'The specification describing how smart metering devices communicate with each other and with DCC.' },
  { term: 'HAN', full: 'Home Area Network', def: 'The short-range network in a home that links the smart meter, Communications Hub and in-home display.' },
  { term: 'iDNO', full: 'Independent Distribution Network Operator', def: 'A company that builds and runs local electricity networks, usually on new developments, connected to a DNO\'s network.' },
  { term: 'IHD', full: 'In-home display', def: 'The screen your energy supplier provides with a smart meter, showing what energy you are using. It belongs to your supplier, not DCC.' },
  { term: 'MHHS', full: 'Market-wide Half-Hourly Settlement', def: 'The industry programme moving electricity settlement to half-hourly data for all customers.' },
  { term: 'Other User', def: 'An organisation that uses DCC services without being an energy supplier or network operator, such as an energy services company or innovator.' },
  { term: 'RAPP', full: 'Registration Authority Policies and Procedures', def: 'The SMKI document setting out how organisations register for and use SMKI services.' },
  { term: 'SEC', full: 'Smart Energy Code', def: 'The agreement that sets the rights and obligations of energy suppliers, network operators and others involved in smart metering in Great Britain.' },
  { term: 'SEC Party', def: 'An organisation that has signed up to the Smart Energy Code.' },
  { term: 'SECCo', full: 'Smart Energy Code Company', def: 'The company that administers the SEC, and the parent company of DCC2.' },
  { term: 'SMETS1', full: 'Smart Metering Equipment Technical Specifications, first generation', def: 'First-generation smart meters, installed before the DCC network was ready and since enrolled on to it.' },
  { term: 'SMETS2', full: 'Smart Metering Equipment Technical Specifications, second generation', def: 'Second-generation smart meters, which connect to the DCC network from installation.' },
  { term: 'SMKI', full: 'Smart Metering Key Infrastructure', def: 'The public key infrastructure that secures communication between users and smart metering devices.' },
  { term: 'SREPT', full: 'SMKI and Repository Entry Process Tests', def: 'Tests an organisation passes to become an Authorised Subscriber for SMKI services.' },
  { term: 'SSI', full: 'Self-Service Interface', def: 'DCC\'s online portal for customers to raise and track incidents and service requests.' },
  { term: 'UEPT', full: 'User Entry Process Tests', def: 'The final tests that show an organisation can interact correctly with DCC systems before it goes live.' },
  { term: 'VWAN', full: 'Virtual Wide Area Network', def: 'New technology that lets Communications Hubs connect over other networks where standard coverage is weak.' },
  { term: 'WAN', full: 'Wide Area Network', def: 'The long-range network, run by the Communications Service Providers, that carries messages between Communications Hubs and DCC.' }
];

/* Services for the status page (names live; states sample) */
window.DCC_SERVICES = [
  { name: 'DCC User Gateway', state: 'ok' },
  { name: 'Self-Service Interface', state: 'ok' },
  { name: 'Central Switching Service', state: 'ok' },
  { name: 'Wide Area Network: North', state: 'ok' },
  { name: 'Wide Area Network: Central and South', state: 'degraded', note: 'Slower responses for some Communications Hubs in the South West. Investigating.' },
  { name: 'SMKI and Repository', state: 'ok' },
  { name: 'Test environments', state: 'maintenance', note: 'Planned maintenance until 18:00.' }
];

/* Incidents. August 2026 had no Category 1 incidents (live); the rest are sample. */
window.DCC_INCIDENTS = [
  { id: 'INC-2026-0931', title: 'Slower responses, Central and South WAN', cat: 'Category 2', service: 'Wide Area Network: Central and South', start: '2026-09-28 07:40', end: null, sample: true,
    updates: [['09:15', 'Our provider has identified a faulty network component and is replacing it.'], ['08:05', 'Investigating slower responses from some Communications Hubs in the South West.']] },
  { id: 'INC-2026-0914', title: 'Self-Service Interface login errors', cat: 'Category 2', service: 'Self-Service Interface', start: '2026-09-14 10:02', end: '2026-09-14 11:31', sample: true,
    updates: [['11:31', 'Resolved. A certificate was renewed and logins are working normally.']] },
  { id: 'INC-2026-0722', title: 'Delayed service responses, all regions', cat: 'Category 1', service: 'DCC User Gateway', start: '2026-07-22 14:20', end: '2026-07-22 17:05', sample: true,
    updates: [['17:05', 'Resolved. Queued messages have been processed. Full report in the July incident summary.']] }
];

window.DCC_MAINTENANCE = [
  { date: '2026-09-28', time: '09:00–18:00', service: 'Test environments', impact: 'Unavailable', sample: true },
  { date: '2026-10-04', time: '00:00–04:00', service: 'Central Switching Service', impact: 'Reduced service', sample: true },
  { date: '2026-10-11', time: '01:00–05:00', service: 'DCC User Gateway', impact: 'Messages queued', sample: true },
  { date: '2026-10-25', time: '00:00–06:00', service: 'Self-Service Interface', impact: 'Unavailable', sample: true },
  { date: '2026-11-08', time: '01:00–05:00', service: 'Wide Area Network: North', impact: 'Reduced service', sample: true },
  { date: '2026-11-22', time: '00:00–04:00', service: 'SMKI and Repository', impact: 'Unavailable', sample: true }
];

/* Programmes (names and target years live; stage, milestones and progress sample) */
window.DCC_PROGRAMMES = [
  { name: 'Market-wide Half-Hourly Settlement (MHHS)', year: 2026, state: 'on-track', stage: 'Migration', next: 'Customer migration wave 3', nextDate: 'Nov 2026', pct: 80 },
  { name: 'DCC Service Management Systems (DSMS)', year: 2026, state: 'at-risk', stage: 'Testing', next: 'Release 3 go-live', nextDate: 'Dec 2026', pct: 65 },
  { name: 'Data Service Provider (DSP) Data Systems', year: 2027, state: 'on-track', stage: 'Build', next: 'Integration testing starts', nextDate: 'Feb 2027', pct: 40 },
  { name: 'Upgrading first-generation smart meters', year: 2027, state: 'on-track', stage: 'Delivery', next: 'Next upgrade tranche', nextDate: 'Jan 2027', pct: 35 },
  { name: 'Virtual Wide Area Network (VWAN)', year: 2027, state: 'on-track', stage: 'Early deployment', next: 'VWAN consultation closes', nextDate: '30 Oct 2026', pct: 30 },
  { name: 'Transfer to DCC2', year: 2026, state: 'on-track', stage: 'Handover', next: 'Business transfer from Capita', nextDate: 'Nov 2026', pct: 85 },
  { name: '4G Communications Hubs and Networks (CH&N)', year: 2025, state: 'complete', stage: 'Complete', next: 'Over one million 4G hubs connected', nextDate: 'May 2026', pct: 100 },
  { name: 'PKI Enduring Services (PKI-E)', year: 2025, state: 'complete', stage: 'Complete', next: '—', nextDate: '2025', pct: 100 },
  { name: 'Enduring Change of Supplier (ECoS)', year: 2024, state: 'complete', stage: 'Complete', next: '—', nextDate: '2024', pct: 100 }
];

/* Joining the network: routes by organisation type. Steps are live (Partner with DCC); timings sample. */
window.DCC_ROUTES = {
  supplier: { label: 'Energy supplier', role: 'SEC Party', tool: false,
    intro: 'Suppliers join as SEC Parties and complete all six steps before sending live messages.',
    steps: ['sec', 'gateway', 'duis', 'smki', 'srept', 'uept'], weeks: '9 to 12 months', quote: 'Highland Electricity' },
  network: { label: 'Network operator (DNO or iDNO)', role: 'SEC Party', tool: false,
    intro: 'Network operators join as SEC Parties and use the network to see the state of their local grid.',
    steps: ['sec', 'gateway', 'duis', 'smki', 'srept', 'uept'], weeks: '9 to 12 months', quote: 'Aurora Utilities' },
  other: { label: 'Energy services or data company (Other User)', role: 'Other User', tool: true,
    intro: 'Other Users can now apply through the digital onboarding tool, which takes you through the steps in order.',
    steps: ['sec', 'gateway', 'duis', 'smki', 'srept', 'uept'], weeks: '6 to 9 months', quote: 'UrbanChain' },
  innovator: { label: 'Innovator or manufacturer testing a product', role: 'Test and innovation services', tool: false,
    intro: 'You may not need to join as a user at all. Most innovators start with our test labs or DCC Boxed.',
    steps: ['talk', 'lab', 'boxed'], weeks: 'A few weeks to start testing', quote: 'Passiv' },
  research: { label: 'University or research body', role: 'Data for public good', tool: false,
    intro: 'Research access to anonymised smart meter system data runs through our data for public good work.',
    steps: ['talk', 'data'], weeks: 'Depends on the data requested', quote: null }
};

window.DCC_STEPS = {
  sec: { title: 'Sign the Smart Energy Code', term: 'SEC', what: 'Accede to the SEC through SECCo. You need a signed accession agreement and your company details.', who: 'SECCo', time: '4 to 6 weeks' },
  gateway: { title: 'Order a DCC Gateway Connection', term: 'DCC Gateway Connection', what: 'Choose a connection type and order it through the Self-Service Interface. Lead times depend on the connection.', who: 'DCC Service Centre', time: '8 to 16 weeks' },
  duis: { title: 'Build or buy a DUIS interface', term: 'DUIS', what: 'Build to the DCC User Interface Specification, or buy software that already does.', who: 'Your team or supplier', time: '3 to 6 months, alongside the gateway' },
  smki: { title: 'Register for SMKI', term: 'SMKI', what: 'Follow the RAPP to register for Smart Metering Key Infrastructure so messages to devices are secure.', who: 'SMKI Registration Authority', time: '4 to 8 weeks' },
  srept: { title: 'Pass the SREPT tests', term: 'SREPT', what: 'Pass the SMKI and Repository Entry Process Tests to become an Authorised Subscriber.', who: 'DCC test team', time: '2 to 4 weeks' },
  uept: { title: 'Complete User Entry Process Tests', term: 'UEPT', what: 'Show you can interact correctly with DCC systems. Once passed, you can go live.', who: 'DCC test team', time: '4 to 8 weeks' },
  talk: { title: 'Tell us what you want to test or build', what: 'A short conversation with our partnerships team to find the right service.', who: 'Partnerships team', time: 'Within 5 working days' },
  lab: { title: 'Book time in the test labs', what: 'Test products against real smart metering equipment, on site in Manchester or remotely.', who: 'Test services', time: '2 to 4 weeks to book' },
  boxed: { title: 'Try DCC Boxed', what: 'A portable version of the DCC infrastructure for testing on your own premises.', who: 'Test services', time: 'Varies' },
  data: { title: 'Agree what data you need', what: 'We work through what anonymised data is available and how it can be shared.', who: 'Data for good team', time: 'Varies' }
};
