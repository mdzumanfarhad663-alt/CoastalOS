# CoastalOS — Website Prototype

Static, responsive prototype of the CoastalOS marketing site, built for client review. It is not deployed and does not touch the live domain.

## Pages

All six agreed pages are built.

| File | Page |
|---|---|
| `index.html` | Home: full sales journey (opportunity, platform, outcomes, CHG track record, properties, property review form) |
| `platform.html` | Platform / How It Works: central vs on-site split (hero), operating model with the three principles, guest journey, owner view (links to Services). The comparison toggle lives only on Home and the guest journey only here. |
| `about.html` | About CoastalOS: three operating models compared (hero), origin with who we work with |
| `services.html` | Services: five service groups as cards in one section (the single source for the service list), engagement steps |
| `contact.html` | Contact: request a property review or a call (form, next steps, FAQ) |
| `portfolio.html` | Portfolio: the ten current Coastal Hospitality Group hotels (see below) |
| `index-1.html` | Redirect to `index.html` (an earlier homepage lived here; it remains in git history) |
| `home-v2.html` | Redirect to `index.html` (the v2 homepage preview, now the main homepage) |

Platform, Services, About, Portfolio and Contact in the header and footer go to their own pages on every site page. On the homepage, "See How CoastalOS Works" scrolls to the homepage platform section, which ends with a "See the full platform" link. Every "Request a Property Review" button goes to `contact.html`, and every "Talk to Our Team" button goes to `contact.html?request=call`, which pre-selects "A call with our team" in the form. The homepage keeps its own copy of the form.

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
- Each page keeps its page-specific CSS in a small `<style>` block. Homepage-only scripts (outcome tabs) stay inline in `index.html`.
- `assets/portfolio/` — property photos from the CHG site, for the homepage hotels section and `portfolio.html`.
- `assets/about/` — Hickory Falls Inn room photo and Jed Tarr's headshot (About page).

## Awaiting client confirmation

**Portfolio**
- `portfolio.html` shows the ten current properties listed on https://www.coastalhospitalitygroup.com/, with CHG's own photos; the homepage shows the first three. Each card opens the hotel's own website (as linked from the CHG site) with `?utm_source=coastalos&utm_medium=portfolio&utm_campaign=property_card`. Sources: `assets/portfolio/SOURCES.md`.
- Wording: "Hotels owned and operated by Coastal Hospitality Group". The site does not say these hotels run on CoastalOS; Jed should confirm before that is added.
- Past properties are left out. Geneva is tagged "In redevelopment", as on the CHG site.
- When property details change, update both `portfolio.html` and the homepage section.

**Confirmed by the client (via Zuman), sourced from Jed's other sites**
- The site may say CoastalOS is built by the team behind Coastal Hospitality Group (Home owners band, About origin).
- Facts used, taken from search results for coastalhospitalitygroup.com and coastalmanagementco.com (verified against coastalhospitalitygroup.com on 2026-10-03; the Coastal Management Company figure was not re-checked on its own site): CHG founded 2012 by founder and CEO Jed Tarr with a small beach motel in San Clemente, CA; 14 hotels owned and operated as of 2026; currently in North Carolina, Florida and California; Coastal Management Company reports it often lifts a hotel's bottom line 10-30% within its first year of operating it.
- Contact details (temporary, from CHG): (877) 350-0053, info@coastalhospitalitygroup.com, 711 S El Camino Real, San Clemente, CA 92672. Shown in every footer and on the Contact page. Replace if CoastalOS gets its own.
- The current logo stays unless Jed sends a new one.

**Facts still needed from Jed (left out of the About and Services pages)**
- Team or leadership names, roles and photos.
- Whether CoastalOS runs CHG's own hotels, and how it relates to Coastal Management Company and Coastal Getaway (the site currently says only that CoastalOS is built by the team behind CHG).
- Target property size. The "15 to 100 rooms" range was removed from the copy until confirmed; the form still asks for room count.
- Locations or regions served.
- Which services are offered on their own and which only as a full package.
- Expected response time after a form request, if he wants one stated.
- Privacy notice or consent wording for the form, and where form requests should be delivered (email, CRM or form service).
- **Founder (About page):** shows Jed's photo and a short factual bio taken from the CHG About page. A quote in his own words would make it stronger.

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

**Before launch**
- There is no privacy page yet. The contact forms need an approved privacy notice (or a link to one) before they collect real data.
- Connect the forms to a real destination (email, CRM or form service) once chosen.
