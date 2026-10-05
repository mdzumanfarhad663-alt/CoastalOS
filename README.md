# CoastalOS — Website Prototype

Static, responsive prototype of the CoastalOS marketing site, built for client review. It is not deployed and does not touch the live domain.

## Pages

All six agreed pages are built.

| File | Page |
|---|---|
| `index.html` | Home (the former home-v2 concept): hero, challenge, solution, platform hub, how it works, owner visibility, who it's for, hotels, FAQ, final CTA |
| `index-v1-backup.html` | Previous homepage, kept for reference only (`noindex`, not linked) |
| `platform.html` | Platform / How It Works: central vs on-site split (hero), operating model with the three principles, guest journey, owner view (links to Services). The comparison toggle lives only on Home and the guest journey only here. |
| `about.html` | About CoastalOS: centred story hero, origin, what we believe, who we work with (pills), the Coastal family, founder note, final CTA |
| `services.html` | Services: five service groups as cards in one section (the single source for the service list), engagement steps |
| `contact.html` | Contact: a single Request a Call form (same fields as the homepage form plus an optional message), next steps, the site's only FAQ (6 questions) |
| `portfolio.html` | Portfolio: centred hero with a stat line counted from the cards, property-type pills, the ten current Coastal Hospitality Group hotels (see below), final CTA |
| `index-1.html` | Redirect to `index.html` (an earlier homepage lived here; it remains in git history) |
| `privacy.html` | Privacy Policy (starter text written for this prototype; the client will replace it with reviewed wording) |
| `home-v2.html` | Redirect to `index.html` (the concept became the homepage; old links keep working) |

Platform, Services, About, Portfolio and Contact in the header and footer go to their own pages on every site page. On the homepage, "See How CoastalOS Works" scrolls to the homepage platform section, which ends with a "See the full platform" link. The primary call to action everywhere is **"Request a Call"**, linking to `contact.html?request=call`, which pre-selects "A call with our team" in the form. The secondary button next to it is "See How It Works" (homepage hero, scrolls to `#platform`) or "Explore the Platform" (`platform.html`) elsewhere. The form's submit label follows the chosen option ("Request a Call" / "Request a Property Review"). The homepage keeps its own copy of the form.

The forms only validate in the browser and show a thank-you message. Nothing is sent: no email, CRM or form service is connected.

## How to run

Open `index.html` in a browser, or serve the folder with any static server:

```
python -m http.server 8000
```

Then visit http://localhost:8000.

## Structure

- `assets/css/site.css` — shared styles: design tokens, base typography, header and mobile menu, buttons, cards, icon tiles, reveal animation, FAQ, CTA band, form, footer, mobile sticky CTA, and reused components (principles list, step flow, hotel illustration layout, navy platform panel, "Managed separately / With CoastalOS" comparison, linked property cards).
- `assets/js/site.js` — shared behavior: header scroll state, mobile menu (Escape closes it), one-time scroll reveals, mobile sticky CTA, in-page nav highlighting on the homepage, the comparison toggle (switches once on first view, then user-controlled), and the property review form (validation and `?request=call`).
- Design system: each page has one navy band (`.navy-band` in `site.css`; on the homepage it is the platform section), open layouts instead of boxed cards where cards add nothing, and a light closing CTA (`.cta-band`). The Contact page's navy hero holds the form.
- Each page keeps its page-specific CSS in a small `<style>` block. Homepage-only scripts (outcome tabs) stay inline in `index.html`.
- `assets/portfolio/` — property photos from the CHG site, for the homepage hotels section and `portfolio.html`.
- Image frames (`.img-frame` in `site.css`): seven labelled placeholders waiting for real photos. Platform: "Team at work" (banner), "Guest check-in", "Housekeeping", "Owner dashboard screenshot". Services: "Front desk welcome" (banner), "Team member at work", "Owner reporting". To fill one, replace its `<div class="img-frame" ...>` with an `<img>` of the same proportions. `assets/site/` now holds only the Contact background.
- `assets/about/` — Hickory Falls Inn room photo and Jed Tarr's headshot (About page).

## Homepage (formerly home-v2)

Design rules: section headings have no eyebrow/kicker label (removed site-wide). Single-column sections center their heading, intro (max ~60ch) and buttons; split sections (text + image) stay left/right.

Motion: only three effects — scroll reveal (fade up 24px, 600ms, 80ms stagger in lists), the How-it-works timeline (scroll-linked: each teal segment fills between two circles, then the next circle activates and its text fades up; vertical on mobile), and the platform hub (core scales in, connector lines draw, cards pop in). No background-image motion. Reduced motion shows everything at once; without JavaScript all content is visible.

`index.html` (built as `home-v2.html`) merges the client's layout concept with our design system (fonts, tokens, buttons, cards, icon tiles, header, footer, mobile menu, sticky mobile CTA, reveal animations). All page-only styles sit in its `<style>` block; `site.css` and `site.js` are shared and unchanged. The previous homepage is kept as `index-v1-backup.html`.

Sections, in order:
1. Hero (centered): photo background with an even navy overlay, H1, "Request a Call" + "See How It Works", four benefit items (2×2 on mobile)
2. The challenge: copy, side photo (desktop), eight challenge cards (4×2 desktop, 2 columns mobile)
3. Operating relationship: "What CoastalOS handles" (navy) and "What you keep" cards, link to Services
4. The platform (`#platform`): hub diagram, CoastalOS core plus eight functions; connector lines draw once; 2-column list on mobile
5. How it works (navy): five steps, horizontal on desktop, vertical on mobile
6. About teaser: Jed Tarr's photo (same file as the About page), the origin story using only facts from `about.html`, a draft line carrying the comparison idea, Jed's approved quote, and a "Read More" link to About. Replaced the comparison cards (`.why-grid`, removed).
7. Built for independent & boutique hotels: property types, "Is My Property a Good Fit?" CTA, photo
8. Portfolio: the three property cards and "View full portfolio"
9. Owner testimonials: data-driven slider (JSON in `#tst-data`), HIDDEN until real quotes are approved; the results cards are also hidden
10. FAQ: the four standard questions
11. Final CTA: photo background with navy overlay, heading, next steps and the inline request-a-call form

Images (all in `assets/home-v2/`, WebP; temporary, pending the client's own photos). Each is marked in the HTML with an `<!-- IMAGE: ... -->` comment; to swap one, replace the file with the same name and proportions:

| File | Where | Source |
|---|---|---|
| `hero-sea-shells-exterior-800/1280/1600.webp` (3:2) | Hero background (preloaded, `srcset`) | Sea Shells Beach Club exterior at dusk, CHG site. The source is only 921px wide, so the 1280/1600 versions are upscaled; replace with a 2400px+ original when the client supplies one. |
| `challenge-hickory-falls.webp` (4:5) | Challenge side photo | Hickory Falls Inn, CHG site |
| `solution-island-house.webp` (4:3) | Solution photo | Island House Resort, CHG site |
| `fit-the-pineola.webp` (4:3) | "Built for" photo | The Pineola, CHG site |
| `cta-mountain-pool.webp` (16:9) | Final CTA background | "Mountain escapes" photo, coastalgetaway.com |
| `testimonial-bluebird.webp` (16:9) | Hidden testimonial background | Bluebird Day Inn & Suites, CHG site |

Hidden sections: "Proven results for independent hotels" (four metric cards) and the testimonial card are in the markup with empty values and the `hidden` attribute. Enable them only when the client supplies verified figures and a real, approved quote: fill the values and remove `hidden`.

Text over photos uses navy gradient overlays: the hero fades from about 90% navy behind the text on the left to 25% on the right, with a darker band behind the benefit row; the final CTA uses a radial gradient that is darkest behind the centered text. Contrast was measured per text element against the brightest pixel behind it at 1440, 820 and 390px: lowest hero 5.1:1, lowest final CTA 5.2:1. All pass WCAG AA.

Open questions for the client (home-v2):
- Verified numbers for the results cards (revenue, cost, guest rating, direct bookings), and their source.
- A real, approved testimonial with name, role and property.
- Whether any AI-powered features, live dashboards or 24/7 coverage can be claimed (none are claimed now).
- The final logo as SVG (the concept's CoastalOS wordmark with the wave above). Until then the current mark is used; the logo spots are marked `<!-- LOGO: ... -->`.
- The client's own photography to replace the images above.

## Awaiting client confirmation

**Portfolio**
- `portfolio.html` shows the ten current properties listed on https://www.coastalhospitalitygroup.com/, with CHG's own photos; the homepage shows the first three. Each card opens the hotel's own website (as linked from the CHG site) with `?utm_source=coastalos&utm_medium=portfolio&utm_campaign=property_card`. Sources: `assets/portfolio/SOURCES.md`.
- Wording: "Hotels owned and operated by Coastal Hospitality Group". The site does not say these hotels run on CoastalOS; Jed should confirm before that is added.
- Past properties are left out. Geneva is tagged "In redevelopment", as on the CHG site.
- When property details change, update both `portfolio.html` and the homepage section.

**Confirmed by the client (via Zuman), sourced from Jed's other sites**
- The site may say CoastalOS is built by the team behind Coastal Hospitality Group (Home owners band, About origin).
- Facts used, taken from search results for coastalhospitalitygroup.com and coastalmanagementco.com (verified against coastalhospitalitygroup.com on 2026-10-03; the Coastal Management Company figure was not re-checked on its own site): CHG founded 2012 by founder and CEO Jed Tarr with a small beach motel in San Clemente, CA; 14 hotels owned and operated as of 2026; currently in North Carolina, Florida and California; Coastal Management Company reports it often lifts a hotel's bottom line 10-30% within its first year of operating it (wording confirmed by the client).
- Contact details (temporary, from CHG): (877) 350-0053, info@coastalhospitalitygroup.com, 711 S El Camino Real, San Clemente, CA 92672. Shown in every footer and on the Contact page. Replace if CoastalOS gets its own.
- Logo: client-approved CoastalOS logo in `assets/brand/`. `coastalos-logo-original.png` is the supplied file (trimmed); `coastalos-logo-light.webp` (white wordmark) is used on dark backgrounds (homepage header over the hero, all footers) and `coastalos-logo-dark.webp` (wordmark recoloured navy, waves and "OS" unchanged) on light headers. The platform hub centre mark on the homepage still uses the earlier placeholder icon.

**Facts still needed from Jed (left out of the About and Services pages)**
- Team or leadership names, roles and photos.
- Whether CoastalOS runs CHG's own hotels, and how it relates to Coastal Management Company and Coastal Getaway (the site currently says only that CoastalOS is built by the team behind CHG).
- Target property size. The "15 to 100 rooms" range was removed from the copy until confirmed; the form still asks for room count.
- Locations or regions served.
- Which services are offered on their own and which only as a full package.
- Expected response time after a form request, if he wants one stated.
- Privacy notice or consent wording for the form, and where form requests should be delivered (email, CRM or form service).
- **Founder (About page):** Jed's quote (supplied by the client), photo, and a short factual bio taken from the CHG About page.

**Platform page (to confirm)**
- Guest journey step owners. Shown as: Booking, CoastalOS and Guest communication = Central team; Property operations = On site. Digital check-in, Review and Repeat guest are marked "Both" because the brief does not say who handles them. Jed should confirm all seven.
- "Handled centrally" vs "Stays at your property" lists use only functions from the brief. Jed should confirm the split is right for every property.
- The owner reporting view is an illustrative layout with no data. Jed should confirm what owners actually receive (format and frequency) before it is described in more detail.
- The automation example ("confirmations, reminders and routine reports go out on their own") is general. Jed should confirm it matches how CoastalOS works.

**Questions for Jed (not answered anywhere on the site yet)**
- Pricing or fee structure, and whether it should appear on the site.
- Contract length and terms.
- Onboarding: how long it takes to bring a property onto the platform, and what it involves.
- Which existing hotel systems CoastalOS works with or replaces (integrations).
- Hours of central team coverage.

**Sample content (generated for the prototype; replace before launch)**

Every item below shows a gold "Sample" tag on the page. Search the HTML for `class="sample"` to find them all.
- Home, "In their words": three testimonials. Need approved quotes with names, roles and properties.
- Services, "Is CoastalOS right for your property?": property size (15-100 rooms), locations and ways to work together.
- Image frames on Platform and Services (see Structure).

**Draft homepage copy:** all new or changed homepage copy is listed in `CONTENT-REVIEW.md` for Jed to confirm.

**Questions for Jed (homepage FAQ, not published until answered)**
- How is CoastalOS priced?
- What is the contract length, and how do owners exit?
- What happens to the current on-site staff?
- How much control does the owner keep over decisions, budgets and standards?
- How long does onboarding take, and what is involved?
To publish one, copy a `<details>` block in the homepage FAQ (`.faq-list`) and replace the question and answer text.

**Homepage request-a-call form** (`#request-call`, final section of `index.html`): prototype only, front-end validation in `site.js`, nothing is sent. Fields: name*, work email*, phone, property*, rooms. Replace with the WordPress form plugin keeping these fields. Homepage "Request a Call" buttons (header, hero, sticky mobile button, footer) scroll to this form; other pages link to `contact.html?request=call`.

**Before launch**
- `privacy.html` is starter text, linked from every footer and below both forms. Have it reviewed before real data is collected, and update it to name the form service once one is chosen.
- Connect the forms to a real destination (email, CRM or form service).
- Testimonials (Home, "In their words"): three quotes supplied by the client, attributed only as Hotel owner, Investor and Partner. Adding names, roles and property (with permission) would make them stronger.

**Shared components for inner pages (About, Portfolio, Contact)**
- `body.page-calm` gives these pages the homepage motion values (450ms, 14px rise) and accessibility fixes. They use `data-anim` / `data-stagger`; the older `.rv` reveal stays in `site.css` for Services and Platform.
- The final CTA (`.photo-sec.fcta`) lives in `site.css`. Inner pages use it centred with one "Request a Call" button (`.fcta-inner`); the homepage adds its inline form layout on top.
- `.pcard-calm` gives property cards a subtle lift on hover, no image zoom.
- `.sec-head.is-centered` and `.types` (text pills) are shared from `site.css`.
- On the contact page, `?request=call` scrolls the form into view on single-column layouts.
