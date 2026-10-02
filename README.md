# CoastalOS — Website Prototype

Static, responsive prototype of the CoastalOS marketing site, built for client review. It is not deployed and does not touch the live domain.

## Pages

| File | Page |
|---|---|
| `index.html` | Home: full sales journey (platform, outcomes, portfolio, FAQ, property review form) |
| `about.html` | About CoastalOS: origin, principles, who we work with, focus |
| `services.html` | Services: five capability groups, engagement steps, FAQ |
| `index-1.html` | Earlier homepage version, kept for reference |

Platform, Portfolio and Contact currently link to sections on the homepage (`index.html#platform`, `#proof`, `#review`). A separate `platform.html` can replace the Platform link later.

## How to run

Open `index.html` in a browser, or serve the folder with any static server:

```
python -m http.server 8000
```

Then visit http://localhost:8000.

## Structure

- `assets/css/site.css` — shared styles: design tokens, base typography, header and mobile menu, buttons, cards, icon tiles, reveal animation, FAQ, CTA band, form, footer, mobile sticky CTA, and reused components (principles list, step flow, hotel illustration layout).
- `assets/js/site.js` — shared behavior: header scroll state, mobile menu (Escape closes it), one-time scroll reveals, mobile sticky CTA, and in-page nav highlighting on the homepage.
- Each page keeps its page-specific CSS in a small `<style>` block. Homepage-only scripts (comparison toggle, outcome tabs, form validation) stay inline in `index.html`.
- `assets/portfolio/` — property images for the homepage Portfolio section.

## Awaiting client confirmation

**Portfolio (temporary)**
- Property names and images come from https://coastalgetaway.com/. See `assets/portfolio/SOURCES.md`. Jed still needs to approve their use on CoastalOS, and confirm whether these properties may be described as running on CoastalOS.
- No portfolio metrics are shown until verified results are supplied.

**Facts still needed from Jed (left out of the About and Services pages)**
- Founding year, and how many years of hotel ownership and operation to cite.
- Number and names of properties owned or operated.
- Team or leadership names, roles and photos.
- How CoastalOS relates to Coastal Hospitality Group, Coastal Management Company and Coastal Getaway.
- Locations or regions served.
- Which services are offered on their own and which only as a full package.
- Contact details (phone, email, address) and any privacy or consent wording for the form.
- Final logo files (SVG or transparent PNG).
