# CoastalOS — Website Prototype and WordPress Build

The root HTML files are the original static, responsive prototype. The WordPress conversion lives in `coastalos/` as a block theme and `coastalos-blocks/` as its companion plugin. The prototype is deployed at https://coastalos.onrender.com/; this repository work does not deploy to that domain.

## WordPress development with LocalWP

The project uses LocalWP for the local WordPress site. Create a LocalWP site with WordPress 6.9 or newer and PHP 8.1 or newer. The theme uses `theme.json` version 3 and border-radius presets introduced in WordPress 6.9.

1. Create and start the site in LocalWP. Open its site folder from LocalWP’s **Go to site folder** action.
2. Copy `coastalos` to `<Local site>/app/public/wp-content/themes/coastalos` and `coastalos-blocks` to `<Local site>/app/public/wp-content/plugins/coastalos-blocks`. Do not copy the plugin’s `node_modules` folder.
3. In the WordPress dashboard, activate **CoastalOS Blocks** under **Plugins**, then activate **CoastalOS** under **Appearance → Themes**.
4. Open **Appearance → Editor** to edit the header, footer, navigation and global styles. Set the site title to **CoastalOS**.

Install the companion plugin before the theme parts that use its logo, CTA, and contact blocks. If WordPress asks, install the **WordPress Importer** from **Tools → Import**. Import `content/coastalos-demo.xml` from **Tools → Import → WordPress** after activating the plugin. The file creates six main site pages plus the Privacy Policy, ten Property entries, and imports the prototype images from the `wordpress-build` GitHub branch. Set **Settings → Reading → Your homepage displays → A static page → Home** after import, then save **Settings → Permalinks** once.

The editor uses standard Gutenberg blocks inside CoastalOS section blocks. Insert a section from **Patterns → CoastalOS Sections** or choose a full-page starter from **Patterns → CoastalOS Pages**. You can duplicate a section from its block toolbar, reorder it, change the safe background and spacing options, hide it on a page, or add core headings, text, images, lists, buttons, and other blocks inside it. The generic CoastalOS Section block is the blank container for custom layouts. The header and footer remain editable under **Appearance → Editor**. The imported prototype sections preserve their exact source markup in a core Custom HTML child block; administrators can edit its HTML, while new/custom layouts can be assembled with the visual core blocks. WordPress restricts Custom HTML to administrators in this plugin.

Edit the shared logo URL, CTA labels and links, and contact details under **Settings → CoastalOS**. Clear a setting to hide its matching item. Use the **CoastalOS Global Logo**, **Global Button**, and **Contact Details** blocks in a template part or page to display those values.

The included contact form matches the prototype and only validates in the browser; it does not send or store submissions. To connect a real form, choose Fluent Forms or Contact Form 7 and replace the demo form before launch. The property cards read from **Properties**; edit each property’s title, featured image, location, type, and external website there.

To rebuild the block-editor bundle after editing the plugin, use Node.js 20.19 or newer:

```powershell
cd coastalos-blocks
npm install
npm run build
npm run lint:js
```

Regenerate the WordPress import file with `node scripts/generate-wxr.mjs` from the repository root. The XML references photos on the public `wordpress-build` branch, so those image downloads work after that branch is pushed.

Visual comparison and plugin compatibility checks still need to be run in the client’s LocalWP site. No LocalWP runtime, PHP CLI, or WordPress installation is present in the build environment, so Lighthouse scores, screenshots, and tests with SEO, caching, form, and security plugins have not been verified here. Review the sample prototype facts, testimonials, case study, contact details, and privacy wording before launch.

The theme self-hosts Outfit and Instrument Sans variable WOFF2 files. Font files and their SIL Open Font License notices are in `coastalos/assets/fonts/`.

## Prototype pages

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
| `privacy.html` | Privacy Policy (starter text written for this prototype; the client will replace it with reviewed wording) |
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
- Design system: each page has one navy band (`.navy-band` in `site.css`; on the homepage it is the platform section), open layouts instead of boxed cards where cards add nothing, and a light closing CTA (`.cta-band`). The Contact page's navy hero holds the form.
- Each page keeps its page-specific CSS in a small `<style>` block. Homepage-only scripts (outcome tabs) stay inline in `index.html`.
- `assets/portfolio/` — property photos from the CHG site, for the homepage hotels section and `portfolio.html`.
- Image frames (`.img-frame` in `site.css`): seven labelled placeholders waiting for real photos. Platform: "Team at work" (banner), "Guest check-in", "Housekeeping", "Owner dashboard screenshot". Services: "Front desk welcome" (banner), "Team member at work", "Owner reporting". To fill one, replace its `<div class="img-frame" ...>` with an `<img>` of the same proportions. `assets/site/` now holds only the Contact background.
- `assets/about/` — Hickory Falls Inn room photo and Jed Tarr's headshot (About page).

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
- The current logo stays unless Jed sends a new one.

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
- Contact FAQ: onboarding time, existing systems, agreements, choosing individual services.
- Portfolio, case study: a 40-room coastal motel with sample figures (+18%, -9%, 4 → 1). Need an approved case study with real numbers.
- Image frames on Platform and Services (see Structure).

**Before launch**
- `privacy.html` is starter text, linked from every footer and below both forms. Have it reviewed before real data is collected, and update it to name the form service once one is chosen.
- Connect the forms to a real destination (email, CRM or form service).
- Testimonials (Home, "In their words"): three quotes supplied by the client, attributed only as Hotel owner, Investor and Partner. Adding names, roles and property (with permission) would make them stronger.
