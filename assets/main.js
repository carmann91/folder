'use strict';
const config = window.OMA_CONFIG || {};
const status = document.querySelector('#contact-status');
const number = String(config.whatsappNumber || '').trim();
const validNumber = /^[1-9]\d{6,14}$/.test(number);
const message = config.bookingMessage || 'Ciao Oma Osteria Moderna! Vorrei richiedere una prenotazione. Potete confermarmi la disponibilità?';
document.querySelectorAll('[data-whatsapp]').forEach(link => {
  if (validNumber) {
    link.href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  } else {
    link.href = '#contatti';
    link.addEventListener('click', () => {
      status.textContent = 'Demo: il numero WhatsApp del ristorante deve ancora essere configurato.';
    });
  }
});
if (!validNumber) status.textContent = 'Demo: contatto WhatsApp in aggiornamento.';
for (const [id, value] of [['address', config.address], ['hours', config.hours]]) {
  if (value) document.getElementById(id).textContent = value;
}
function setExternalLink(id, value) {
  if (!value) return false;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return false;
    const link = document.getElementById(id);
    link.href = url.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.hidden = false;
    return true;
  } catch { return false; }
}
setExternalLink('map-link', config.mapUrl);
if (setExternalLink('instagram-link', config.instagramUrl)) document.getElementById('social-placeholder').hidden = true;
if (setExternalLink('menu-link', config.menuUrl)) document.getElementById('menu-link').textContent = 'Esplora il menu ↗';
document.getElementById('year').textContent = new Date().getFullYear();
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#navigation');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
  nav.classList.toggle('open', open);
});
function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Apri menu');
  nav.classList.remove('open');
}
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
