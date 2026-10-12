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
  const number = String(config.whatsappNumber || '').replace(/[\s+()-]/g, '');
  const valid = /^[1-9]\d{6,14}$/.test(number);
  document.querySelectorAll('[data-whatsapp]').forEach(link => {
    if (valid) {
      link.href = `https://wa.me/${number}?text=${encodeURIComponent(config.bookingMessage || 'Ciao Oma Osteria Moderna! Vorrei richiedere una prenotazione.')}`;
      link.target = '_blank'; link.rel = 'noopener noreferrer';
    } else {
      link.href = '#contatti';
      link.addEventListener('click', () => { status.textContent = 'Contatto WhatsApp non disponibile. Riprova più tardi.'; });
    }
  });
  status.textContent = valid ? '' : 'Contatto WhatsApp in aggiornamento.';
  text('address', config.address || 'Indirizzo in aggiornamento');
  text('hours', config.hours || 'Orari in aggiornamento');
  external('map-link', config.mapUrl);
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
loadJson('data/site.json').then(applySite).catch(() => {
  applySite({}); status.textContent = 'Impossibile caricare i contatti aggiornati. Riprova più tardi.';
});
loadJson('data/menu.json').then(applyMenu).catch(() => {
  const notice = document.getElementById('menu-status'); notice.hidden = false;
  notice.textContent = 'Menu aggiornato non disponibile. Le proposte qui sotto sono la versione dimostrativa iniziale: contattaci per conferma.';
});
