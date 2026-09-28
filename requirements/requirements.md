# Smart DCC website prototypes — requirements (V1)

Numbered requirements for the four prototypes, traced to ideas in the phase 1 opportunities list (#n).
Every section in `src/` carries an HTML comment naming the requirement it meets.

## Global
- R01 Prototype navigator replaces Smart DCC's header; previous/next pager replaces the footer.
- R02 Notes switch, off by default, shows the proposal panel and in-page annotations.
- R03 Works at 390px and 1440px with no horizontal scroll; keyboard operable; Escape closes overlays.

## 1. The front door
- R10 Header keeps its structure and adds Smart meter problem?, Service status and Glossary to the utility bar. (#6)
- R11 Site-wide, dismissible notice about the move to DCC2, linking to the ownership page. (#3)
- R12 Homepage audience picker: suppliers and network operators, new entrants, public, industry and government, careers. (#5)
- R13 "This week at DCC": consultations closing soonest, newest documents, next events, all automatic. (#9)
- R14 Meter counter and CO₂ figure readable by assistive technology; CO₂ printed as a number. (#10)
- R15 Ownership page: timeline of the licence change. (#1, #2)
- R16 Ownership page: what changes, what stays the same, FAQs, contacts shown as copyable text. (#1)
- R17 Public help page: single question that returns one answer and who to contact. (#6)
- R18 Public help page: filterable FAQ, reusing live answers. (#6)
- R19 Public contact form for the cases DCC handles (coverage, SMETS1 migration). (#6)

## 2. Consultations and engagement
- R20 Email addresses shown as text with a copy button; fix trailing full stop in mailto links. (#18)
- R21 Listing: status chips with counts, days left, open first; filter by topic and audience; search; sort. (#19)
- R22 Consultation page: status, deadline and documents at the top. (#19)
- R23 Online response form: question by question, autosaved draft, save and return, publish preference, attachment, receipt. (#20)
- R24 Lifecycle strip linking a consultation and DCC's conclusions both ways. (#21)
- R25 Email alerts by topic, from listing, events and status pages. (#22)
- R26 Forums and events calendar with type filter, register and add to calendar (.ics). (#36)
- R27 Customer Engagement "Latest consultations" filled automatically (shown via R13). (#37)

## Parked: Find anything (separate search project; pages kept, not linked)
- R30 Site search: synonyms, stop words, pages ranked above documents, duplicates removed, archived hidden by default, best bets for glossary terms and public questions, type tabs with counts. (#7, #8)
- R31 Document Centre: combinable facets (category, regulatory year, programme, file type), keyword filter, result count, sort, paging, mobile filter button. (#23, #48)
- R32 Document versions: current badge, earlier versions listed under each document, superseded hidden by default. (#24)
- R33 HTML glossary: A–Z, filter, addressable terms. (#25, #39)
- R34 Glossary terms in running text show definitions in place. (#25, #26)

## 3. Status and performance
- R40 Status summary with time of last update. (#14)
- R41 Service list with state shown by shape and words. (#14)
- R42 Headline statistics rendered as text from the start. (#11)
- R43 Performance charts drawn from data, with hover/focus values, table view and CSV per chart and for all. (#12, #13)
- R44 Open and resolved incidents with timed updates; category filter; links to monthly PDFs. (#14)
- R45 Planned maintenance table with service filter and add to calendar; programme tracker with stage, status, next milestone. (#15, #16)
- R46 Strategy scorecard against the four strategic outcomes. (#46)
- R47 One "latest plan" link used everywhere. (#17)

## 4. Joining the network
- R50 Pathfinder by organisation type, remembered for the visit, linkable with ?type=. (#27)
- R51 All route steps on one page, with who you deal with, typical time and a done tick. (#28)
- R52 Digital onboarding tool promoted for Other Users; descriptive link text, no "here"; term definitions shown in place, without linking to the parked glossary. (#26, #27)
- R53 Partner enquiry routed by organisation type with a conditional question and visible destination team. (#29)
- R54 Customer quote placeholder per route, drawn from existing testimonials. (#30)
