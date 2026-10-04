import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'content/coastalos-demo.xml');
const patternOutput = resolve(root, 'coastalos-blocks/patterns/generated.json');
const pageCssDirectory = resolve(root, 'coastalos-blocks/assets/css/pages');
const rawBase = 'https://raw.githubusercontent.com/mdzumanfarhad663-alt/CoastalOS/wordpress-build';

const properties = [
	[ 'Island House Resort', 'North Redington Beach, FL', 'https://www.islandhousebeachhotel.com/', 'chg-island-house.webp' ],
	[ 'Sea Shells Beach Club', 'Daytona Beach, FL', 'https://www.seashellsbeachclub.com/', 'chg-sea-shells.webp' ],
	[ 'The Pineola', 'Newland, NC', 'https://www.thepineola.com/', 'chg-pineola.webp' ],
	[ 'Coastal Suites', 'Wilmington, NC', 'https://www.coastalsuites.com/', 'chg-coastal-suites.webp' ],
	[ 'Hickory Falls Inn', 'Lake Lure, NC', 'https://www.hickoryfallsinn.com/', 'chg-hickory-falls.webp' ],
	[ 'Bluebird Day Inn & Suites', 'South Lake Tahoe, CA', 'https://www.bluebirddaytahoe.com/', 'chg-bluebird.webp' ],
	[ 'Blind Pass Resort', 'St. Pete Beach, FL', 'https://www.blindpassresort.com/', 'chg-blind-pass.webp' ],
	[ 'Malibu Resort Motel', 'North Redington Beach, FL', 'https://www.themaliburesortmotel.com/', 'chg-malibu.webp' ],
	[ 'Geneva Hotel & Tiki Bar', 'Lake Lure, NC', 'https://www.genevahoteltiki.com/', 'chg-geneva.webp', 'In redevelopment' ],
	[ 'Patriots’ Boutique Motel', 'San Clemente, CA', 'https://www.thepatriotsmotel.com/', 'chg-patriots.webp' ],
];

const pages = [
	{
		slug: 'home', title: 'Home', source: 'index.html',
		sections: [ 'hero', 'opportunity', 'capabilities', 'outcomes', 'owner-reporting', 'testimonials', 'property-cards', 'contact' ],
	},
	{
		slug: 'about', title: 'About CoastalOS', source: 'about.html',
		sections: [ 'hero', 'owner-reporting', 'operator-story', 'cta-band' ],
	},
	{
		slug: 'platform', title: 'Platform', source: 'platform.html',
		sections: [ 'hero', 'capabilities', 'guest-journey', 'owner-reporting', 'cta-band' ],
	},
	{
		slug: 'services', title: 'Services', source: 'services.html',
		sections: [ 'hero', 'capabilities', 'faq', 'principles', 'cta-band' ],
	},
	{
		slug: 'portfolio', title: 'Portfolio', source: 'portfolio.html',
		sections: [ 'hero', 'property-cards', 'results-strip', 'cta-band' ],
	},
	{
		slug: 'contact', title: 'Contact', source: 'contact.html',
		sections: [ 'contact', 'faq' ],
	},
	{
		slug: 'privacy', title: 'Privacy Policy', source: 'privacy.html',
		sections: null,
	},
];

function xml(value) {
	return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

function cdata(value) {
	return `<![CDATA[${String(value).replaceAll(']]>', ']]]]><![CDATA[>')}]]>`;
}

function backgroundFor(sectionHtml, slug) {
	const className = (sectionHtml.match(/<section\b[^>]*class=["']([^"']*)/i) || [ '', '' ])[1];
	if (slug === 'outcomes' || /contact-top|navy-band/i.test(className)) return 'navy';
	if (/sec-white/i.test(className)) return 'white';
	return 'light';
}

function pageStyle(source) {
	const styles = [ ...source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi) ].map((match) => match[1]);
	return styles.join('\n').replaceAll('url(assets/site/contact-sea-shells-sunset.webp)', 'url(../../images/contact-sea-shells-sunset.webp)');
}

function removeDivWithClass(markup, className) {
	const tokens = /<div\b[^>]*>|<\/div\s*>/gi;
	let depth = 0;
	let targetDepth = null;
	let targetStart = -1;
	let targetEnd = -1;
	let token;
	while ((token = tokens.exec(markup))) {
		if (/^<div\b/i.test(token[0])) {
			depth += 1;
			const classes = (token[0].match(/class=["']([^"']*)["']/i) || [ '', '' ])[1].split(/\s+/);
			if (targetDepth === null && classes.includes(className)) {
				targetDepth = depth;
				targetStart = token.index;
			}
		} else {
			if (targetDepth === depth) {
				targetEnd = tokens.lastIndex;
				break;
			}
			depth -= 1;
		}
	}
	return targetStart >= 0 && targetEnd > targetStart
		? markup.slice(0, targetStart) + markup.slice(targetEnd)
		: markup;
}

function htmlBlock(markup) {
	const trimmed = markup.trim();
	return trimmed ? `<!-- wp:html -->\n${trimmed}\n<!-- /wp:html -->\n` : '';
}

function sectionBlock(sectionSlug, sectionHtml, pageSlug, index) {
	const blockSlug = sectionSlug === 'contact' && /<form\b/i.test(sectionHtml) ? 'contact' : sectionSlug;
	let markup = sectionHtml;
	if (sectionSlug === 'property-cards') markup = removeDivWithClass(markup, 'pcard-grid');
	markup = markup.replace(/(src\s*=\s*["'])assets\/(portfolio|about)\/([^"']+)(["'])/gi, `$1${rawBase}/assets/$2/$3$4`);
	markup = markup.replace(/(href\s*=\s*["'])((?:\.\/)?(?:index|about|platform|services|portfolio|contact|privacy)\.html)([^"']*)(["'])/gi, (match, start, file, query, end) => {
		const slug = file.replace(/^\.\//, '').replace(/\.html$/, '');
		return `${start}${'index' === slug ? '/' : `/${slug}/`}${query}${end}`;
	});

	const formMatch = markup.match(/<form\b[\s\S]*?<\/form>/i);
	const inner = [];
	if (formMatch) {
		const pieces = markup.split(formMatch[0]);
		inner.push(htmlBlock(pieces[0]));
		inner.push('<!-- wp:coastalos/contact-form /-->\n');
		inner.push(htmlBlock(pieces.slice(1).join(formMatch[0])));
	} else {
		inner.push(htmlBlock(markup));
	}

	const attrs = {
		background: backgroundFor(sectionHtml, sectionSlug),
		prototypePage: pageSlug,
	};
	if (sectionSlug === 'property-cards') {
		attrs.layout = pageSlug === 'home' ? 'home' : 'portfolio';
		attrs.postsToShow = pageSlug === 'home' ? 3 : 10;
	}
	const serialized = `<!-- wp:coastalos/${blockSlug} ${JSON.stringify(attrs)} -->\n${inner.join('')}<!-- /wp:coastalos/${blockSlug} -->\n`;
	return { content: serialized, pattern: { slug: blockSlug, page: pageSlug, index, content: serialized } };
}

function createItem({ id, title, slug, type = 'page', content = '', meta = '', parent = 0, order = 0, mime = '', attachmentUrl = '' }) {
	const link = type === 'attachment' ? attachmentUrl : `https://example.com/${slug}/`;
	const attachment = type === 'attachment' ? `<wp:attachment_url>${xml(attachmentUrl)}</wp:attachment_url>` : '';
	const guid = type === 'attachment' ? xml(attachmentUrl) : `coastalos-${id}`;
	return `<item><title>${xml(title)}</title><link>${xml(link)}</link><pubDate>Sun, 04 Oct 2026 00:00:00 +0000</pubDate><dc:creator><![CDATA[admin]]></dc:creator><guid isPermaLink="false">${guid}</guid><description></description><content:encoded>${cdata(content)}</content:encoded><excerpt:encoded><![CDATA[]]></excerpt:encoded><wp:post_id>${id}</wp:post_id><wp:post_date>2026-10-04 00:00:00</wp:post_date><wp:post_date_gmt>2026-10-04 00:00:00</wp:post_date_gmt><wp:comment_status>closed</wp:comment_status><wp:ping_status>closed</wp:ping_status><wp:post_name>${xml(type === 'attachment' ? slug.replace(/\.(webp|jpg|png)$/i, '') : slug)}</wp:post_name><wp:status>${type === 'attachment' ? 'inherit' : 'publish'}</wp:status><wp:post_parent>${parent}</wp:post_parent><wp:menu_order>${order}</wp:menu_order><wp:post_type>${type}</wp:post_type>${mime ? `<wp:post_mime_type>${mime}</wp:post_mime_type>` : ''}${attachment}${meta}</item>`;
}

const pageBlocks = [];
const generatedPagePatterns = [];
const sectionPatterns = [];
const imageFiles = new Set(properties.map((property) => `assets/portfolio/${property[3]}`));
const pageItems = [];

for (const [pageIndex, page] of pages.entries()) {
	const source = await readFile(resolve(root, page.source), 'utf8');
	const mainMatch = source.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
	if (!mainMatch) throw new Error(`Could not find main content in ${page.source}`);
	if ( ! page.sections ) {
		const content = `<!-- wp:html -->\n${mainMatch[1].trim()}\n<!-- /wp:html -->\n`;
		pageItems.push(createItem({ id: 100 + pageIndex, title: page.title, slug: page.slug, content }));
		continue;
	}
	const sourceSections = [ ...mainMatch[1].matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/gi) ];
	if (sourceSections.length !== page.sections.length) {
		throw new Error(`${page.source}: expected ${page.sections.length} sections, found ${sourceSections.length}`);
	}

	const generatedSections = sourceSections.map((match, sectionIndex) => {
		const converted = sectionBlock(page.sections[sectionIndex], match[0], page.slug, sectionIndex + 1);
		for (const image of match[0].matchAll(/(?:src|poster)=["']assets\/(portfolio|about)\/([^"']+)["']/gi)) {
			imageFiles.add(`assets/${image[1]}/${image[2]}`);
		}
		return converted;
	});
	const content = generatedSections.map((section) => section.content).join('');
	pageBlocks.push({ slug: page.slug, title: page.title, content });
	generatedPagePatterns.push({ slug: page.slug, title: `${page.title} — CoastalOS`, content });
	generatedSections.forEach((section) => sectionPatterns.push(section.pattern));

	const pageCss = pageStyle(source);
	await mkdir(pageCssDirectory, { recursive: true });
	await writeFile(resolve(pageCssDirectory, `${page.slug}.css`), pageCss, 'utf8');
	pageItems.push(createItem({
		id: 100 + pageIndex,
		title: page.title,
		slug: page.slug,
		content,
		meta: '<wp:postmeta><wp:meta_key><![CDATA[_wp_page_template]]></wp:meta_key><wp:meta_value><![CDATA[default]]></wp:meta_value></wp:postmeta>',
	}));
}

const uniqueImages = [ ...imageFiles ];
const imageIds = new Map(uniqueImages.map((path, index) => [ path, 500 + index ]));
const attachments = uniqueImages.map((path, index) => {
	const fileName = path.split('/').at(-1);
	const attachmentUrl = `${rawBase}/${path}`;
	return createItem({
		id: 500 + index,
		title: fileName.replace(/\.[^.]+$/, '').replaceAll('-', ' '),
		slug: fileName,
		type: 'attachment',
		mime: fileName.endsWith('.webp') ? 'image/webp' : 'image/jpeg',
		attachmentUrl,
		meta: `<wp:postmeta><wp:meta_key><![CDATA[_wp_attachment_image_alt]]></wp:meta_key><wp:meta_value>${cdata(fileName.replace(/\.[^.]+$/, '').replaceAll('-', ' '))}</wp:meta_value></wp:postmeta>`,
	});
});

const propertyItems = properties.map((property, index) => {
	const attachmentId = imageIds.get(`assets/portfolio/${property[3]}`);
	const fields = [
		[ '_coastalos_property_location', property[1] ],
		[ '_coastalos_property_type', property[4] || '' ],
		[ '_coastalos_property_url', property[2] ],
		[ '_thumbnail_id', String(attachmentId) ],
	];
	const meta = fields.map(([ key, value ]) => `<wp:postmeta><wp:meta_key>${cdata(key)}</wp:meta_key><wp:meta_value>${cdata(value)}</wp:meta_value></wp:postmeta>`).join('');
	const slug = property[0].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
	return createItem({ id: 300 + index, title: property[0], slug, type: 'coastalos_property', meta, order: index });
});

const wxr = `<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0" xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:wp="http://wordpress.org/export/1.2/">\n<channel><title>CoastalOS local content</title><link>https://example.com</link><description>Content migrated from the CoastalOS prototype for local WordPress testing.</description><pubDate>Sun, 04 Oct 2026 00:00:00 +0000</pubDate><language>en-US</language><wp:wxr_version>1.2</wp:wxr_version><wp:base_site_url>https://example.com</wp:base_site_url><wp:base_blog_url>https://example.com</wp:base_blog_url>\n${[ ...attachments, ...pageItems, ...propertyItems ].join('\n')}\n</channel></rss>\n`;

await mkdir(dirname(output), { recursive: true });
await writeFile(output, wxr, 'utf8');
await writeFile(patternOutput, JSON.stringify({ pages: generatedPagePatterns, sections: sectionPatterns }, null, 2), 'utf8');
console.log(`Wrote ${output}, ${patternOutput}, and ${generatedPagePatterns.length} page-specific stylesheets.`);
