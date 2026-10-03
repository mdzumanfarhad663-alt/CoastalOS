# CoastalOS — Website Prototype

Static, responsive prototype of the CoastalOS marketing site, built for client review. It is not deployed and does not touch the live domain.

## Pages

All six agreed pages are built.

| File | Page |
|---|---|
| `index.html` | Home: full sales journey (platform, outcomes, portfolio, FAQ, property review form) |
| `platform.html` | Platform / How It Works: operating model, central vs on-site work, capability map, principles, guest journey, owner view, FAQ |
| `about.html` | About CoastalOS: origin, principles, who we work with, focus |
| `services.html` | Services: five capability groups, engagement steps, FAQ |
| `contact.html` | Contact: request a property review or a call (form, next steps, FAQ) |
| `portfolio.html` | Portfolio: properties in the Coastal portfolio (temporary, see below) |
| `index-1.html` | Earlier homepage version, kept for reference |

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
- `assets/portfolio/` — property images for the homepage Portfolio section and `portfolio.html`.

## Awaiting client confirmation

**Portfolio (temporary)**
- Six properties from https://coastalgetaway.com/ appear on `portfolio.html`, and the first three on the homepage. Names, locations, types and page URLs come from the Coastal Getaway property pages. Images and sources are listed in `assets/portfolio/SOURCES.md`.
- The homepage shows the first three cards from `portfolio.html`; when property details change, update both files.
- Every property link opens the Coastal Getaway page in a new tab with `?utm_source=coastalos&utm_medium=portfolio&utm_campaign=property_card` added (merged with any existing query string).
- Jed needs to approve: using these properties and images on CoastalOS; whether they may be described as running on CoastalOS; Malibu Resort Motel's city (the site lists both St. Pete Beach and North Redington Beach); the Malibu and Geneva image matches; and whether he has front-exterior photos for Island House and The Pineola.
- No ratings, prices, reviews or metrics are shown. Property results will be added once verified.

**Facts still needed from Jed (left out of the About and Services pages)**
- Founding year, and how many years of hotel ownership and operation to cite.
- Number and names of properties owned or operated.
- Team or leadership names, roles and photos.
- How CoastalOS relates to Coastal Hospitality Group, Coastal Management Company and Coastal Getaway.
- Locations or regions served.
- Which services are offered on their own and which only as a full package.
- Contact details for the Contact page: phone number, email address and office address.
- Expected response time after a form request, if he wants one stated.
- Privacy notice or consent wording for the form, and where form requests should be delivered (email, CRM or form service).
- Final logo files (SVG or transparent PNG).
- **Founder note (About page):** a finished founder-note section is commented out in `about.html` (search for `FOUNDER NOTE`). It needs Jed's own text, his name and title, and a portrait photo saved as `assets/about/founder.jpg`. Uncomment it once those arrive.

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
