'use strict';
const status = document.getElementById('contact-status');
function text(id, value) {
  if (typeof value === 'string') document.getElementById(id).textContent = value;
}
function safeUrl(value) {
  try {
    const url = new URL(value, document.baseURI);
    return url.protocol === 'https:' || url.origin === location.origin ? url.href : null;
  } catch { return null; }
}
function external(id, value) {
  if (!value) return false;
  const href = safeUrl(value);
  if (!href || !href.startsWith('https:')) return false;
  const link = document.getElementById(id);
  Object.assign(link, {href, target: '_blank', rel: 'noopener noreferrer', hidden: false});
  return true;
}
function applySite(config) {
  status.textContent = '';
  text('address', config.address || (config.mapUrl ? 'Oma Osteria Moderna · Roma' : 'Indirizzo in aggiornamento'));
  text('hours', config.hours || 'Orari in aggiornamento');
  external('map-link', config.mapUrl);
  applyPreviews(config);
  if (external('reviews-link', config.reviewsUrl)) document.getElementById('reviews-card').hidden = false;
  if (external('instagram-link', config.instagramUrl)) document.getElementById('social-placeholder').hidden = true;
  if (external('menu-link', config.menuUrl)) text('menu-link', 'Esplora il menu ↗');
  for (const [id, key] of [['hero-title-main','heroTitle'],['hero-title-emphasis','heroEmphasis'],['hero-description','heroDescription'],['intro-lead','introLead'],['intro-text','introText'],['intro-extra','introExtra']]) text(id, config[key]);
  if (Array.isArray(config.photos)) document.querySelectorAll('main img').forEach((img, i) => {
    const photo = config.photos[i];
    if (!photo) return;
    const href = photo.src && safeUrl(photo.src);
    if (href) { img.src = href; if (typeof photo.alt === 'string') img.alt = photo.alt; }
  });
}
function element(tag, value, className) {
  const el = document.createElement(tag);
  if (value !== undefined) el.textContent = String(value);
  if (className) el.className = className;
  return el;
}
function applyMenu(menu) {
  if (!Array.isArray(menu.categories)) throw new Error('Menu non valido');
  const fragment = document.createDocumentFragment();
  for (const category of menu.categories) {
    if (typeof category.title !== 'string' || !Array.isArray(category.dishes)) throw new Error('Categoria non valida');
    const section = element('div', undefined, 'menu-category');
    section.append(element('h3', category.title));
    const list = element('ul');
    for (const dish of category.dishes) {
      if (typeof dish.name !== 'string' || typeof dish.price !== 'number' || !Number.isFinite(dish.price) || dish.price < 0) throw new Error('Piatto non valido');
      const li = element('li'); const heading = element('div', undefined, 'dish-heading');
      heading.append(element('h4', dish.name), element('span', new Intl.NumberFormat('it-IT', {style:'currency',currency:'EUR'}).format(dish.price), 'dish-price'));
      li.append(heading, element('p', dish.description || '')); list.append(li);
    }
    section.append(list); fragment.append(section);
  }
  document.getElementById('menu-grid').replaceChildren(fragment);
  text('menu-note', menu.note || '');
  document.getElementById('menu-note').hidden = !menu.note;
}
async function loadJson(path) {
  const response = await fetch(path, {cache:'no-cache'});
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('navigation');
function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Apri menu'); nav.classList.remove('open');
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu'); nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
text('year', String(new Date().getFullYear()));
if (status) loadJson('data/site.json').then(applySite).catch(() => {
  applySite({}); status.textContent = 'Impossibile caricare i contatti aggiornati. Riprova più tardi.';
});
if (document.getElementById('menu-grid')) loadJson('data/menu.json').then(applyMenu).catch(() => {
  const notice = document.getElementById('menu-status'); notice.hidden = false;
  notice.textContent = 'Menu aggiornato non disponibile. Le proposte qui sotto sono la versione dimostrativa iniziale: contattaci per conferma.';
});

function googleEmbedUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || !['www.google.com', 'www.google.it', 'maps.google.com'].includes(url.hostname) || !url.pathname.startsWith('/maps')) return null;
    return url.href;
  } catch { return null; }
}
function instagramEmbedUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || !['www.instagram.com','instagram.com'].includes(url.hostname)) return null;
    const path = url.pathname.match(/^\/(p|reel|tv)\/([A-Za-z0-9_-]+)\/?$/);
    if (path) return `https://www.instagram.com/${path[1]}/${path[2]}/embed/`;
    const profile = url.pathname.match(/^\/([A-Za-z0-9_.]+)\/?$/);
    return profile ? `https://www.instagram.com/${profile[1]}/embed/` : null;
  } catch { return null; }
}
function applyPreviews(config) {
  const mapSrc = googleEmbedUrl(config.mapEmbedUrl);
  if (mapSrc) document.getElementById('map-frame').src = mapSrc;
  external('instagram-preview-link', config.instagramUrl);
  const postUrls = Array.isArray(config.instagramPosts) ? config.instagramPosts.map(post => instagramEmbedUrl(post.url)).filter(Boolean) : [];
  const embeds = postUrls.length ? postUrls : [instagramEmbedUrl(config.instagramUrl)].filter(Boolean);
  if (embeds.length) {
    const frames = embeds.slice(0, 6).map((src, i) => {
      const frame = element('iframe', undefined, 'instagram-frame');
      frame.src = src; frame.title = `Anteprima Instagram Oma ${i + 1}`;
      frame.loading = 'lazy'; frame.referrerPolicy = 'strict-origin-when-cross-origin';
      return frame;
    });
    document.getElementById('instagram-previews').replaceChildren(...frames);
  }
  const reviews = Array.isArray(config.reviews) ? config.reviews : [];
  const cards = [];
  for (const review of reviews) {
    if (typeof review.author !== 'string' || typeof review.text !== 'string') continue;
    const card = element('figure', undefined, 'review-preview');
    const max = review.ratingMax === 10 ? 10 : 5;
    if (Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= max) {
      const value = max === 5 ? '★'.repeat(review.rating) + '☆'.repeat(5-review.rating) : `${review.rating}/${max}`;
      const rating = element('p', value, 'review-stars');
      rating.setAttribute('aria-label', max === 5 ? `${review.rating} stelle su 5` : `Voto ${review.rating} su ${max}`);
      card.append(rating);
    }
    if (review.excerpt) card.append(element('p', 'Estratto della recensione', 'review-excerpt'));
    const quote = element('blockquote', review.text);
    if (review.text.length > 320) {
      const cut = review.text.lastIndexOf(' ', 240);
      quote.textContent = review.text.slice(0, cut > 0 ? cut : 240) + '…';
      const details = element('details', undefined, 'review-full');
      const summary = element('summary', 'Leggi il testo completo');
      details.append(summary, element('p', review.text));
      quote.append(details);
    }
    const caption = element('figcaption');
    caption.append(element('strong', review.author));
    const sourceText = `${review.source || 'Google'}${review.date ? ' · ' + review.date : ''}`;
    const href = review.sourceUrl && safeUrl(review.sourceUrl);
    if (href && href.startsWith('https:')) {
      const source = element('a', sourceText + ' ↗');
      Object.assign(source, {href, target: '_blank', rel: 'noopener noreferrer'});
      caption.append(source);
    } else caption.append(element('span', sourceText));
    card.append(quote, caption); cards.push(card);
  }
  if (cards.length) document.getElementById('review-previews').replaceChildren(...cards);
}
