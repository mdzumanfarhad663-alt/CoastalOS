// Builds the Our Work property rows from data/properties.json.
// Usage: node scripts/build-work.mjs   (no dependencies)
// Rewrites only the parts of our-work.html between the <!-- work:... --> markers.
import { readFileSync, writeFileSync } from 'node:fs';

const props = JSON.parse(readFileSync('data/properties.json', 'utf8'));
const STATES = { FL: 'Florida', NC: 'North Carolina', CA: 'California' };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const utm = url => url + (url.includes('?') ? '&' : '?') + 'utm_source=coastalos&utm_medium=our-work';

function row(p, i) {
  const w = p.image.widths, max = w[w.length - 1];
  const srcset = w.map(x => `${p.image.base}-${x}.webp ${x}w`).join(', ');
  const tint = i % 2 ? ' work-row-tint' : '';
  const flip = i % 2 ? ' flip' : '';
  const desc = p.description ? `\n        <p class="lede">${esc(p.description)}</p>` : '';
  return `<section class="work-row${tint}" id="${p.slug}" aria-labelledby="${p.slug}-h">
  <div class="wrap work-grid${flip}">
    <figure class="work-photo"><img src="${p.image.base}-${max}.webp" srcset="${srcset}" sizes="(max-width:900px) 100vw, 600px" width="${max}" height="${Math.round(max * 3 / 4)}" alt="${esc(p.alt)}" loading="lazy" decoding="async"></figure>
    <div class="work-text" data-anim="fade-up">
        <p class="work-label">${esc(p.type)} · ${esc(p.city)}, ${esc(STATES[p.state] || p.state)}</p>
        <h2 id="${p.slug}-h">${esc(p.name)}</h2>${desc}
        <a class="btn btn-ghost" href="${esc(utm(p.website))}" target="_blank" rel="noopener">Visit website <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>
    </div>
  </div>
</section>`;
}

// Hero count: every property since founding (Jed, Oct 7 2026: 14 since 2012, 10 active, 4 sold),
// not the number of rows below, which shows current hotels only.
const foundedTotal = 14, foundedYear = 2012;
const stat = `${foundedTotal} properties since ${foundedYear}`;

function replace(html, name, content) {
  const re = new RegExp(`(<!-- work:${name} -->)[\\s\\S]*?(<!-- /work:${name} -->)`);
  if (!re.test(html)) throw new Error(`Marker work:${name} not found`);
  return html.replace(re, `$1\n${content}\n$2`);
}

let page = readFileSync('our-work.html', 'utf8');
page = replace(page, 'stat', `    <p class="work-stat">${stat}</p>`);
page = replace(page, 'rows', props.map(row).join('\n\n'));
writeFileSync('our-work.html', page);
console.log(`our-work.html: ${props.length} properties, ${stat}`);
