'use strict';
const nav = document.getElementById('navigation');
const toggle = document.querySelector('.nav-toggle');
function closeMenu() { toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-label','Apri menu'); nav.classList.remove('open'); }
toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded',String(open)); toggle.setAttribute('aria-label',open ? 'Chiudi menu' : 'Apri menu'); nav.classList.toggle('open',open); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e => { if (e.key === 'Escape') closeMenu(); });
document.getElementById('year').textContent = new Date().getFullYear();
function safeUrl(value) { try { const u = new URL(value,document.baseURI); return u.protocol === 'https:' || u.origin === location.origin ? u : null; } catch { return null; } }
async function load(path) { const r = await fetch(path,{cache:'no-cache'}); if (!r.ok) throw Error(r.status); return r.json(); }
load('data/about.json').then(data => {
  for (const [id,key] of [['about-title-main','title'],['about-title-emphasis','titleEmphasis'],['about-lead','lead'],['about-intro','intro'],['about-story-main','story'],['about-story-extra','storyExtra'],['about-signature','signature']]) {
    if (typeof data[key] === 'string') document.getElementById(id).textContent = data[key];
  }
  const photo = data.photo && safeUrl(data.photo);
  if (photo) {
    const image = document.getElementById('about-photo'); image.src = photo.href; image.alt = data.photoAlt || 'Leo e Alessio di Oma Osteria Moderna'; image.hidden = false; document.getElementById('about-instagram').hidden = true;
  }
  const post = data.instagramPostUrl && safeUrl(data.instagramPostUrl);
  if (post && ['www.instagram.com','instagram.com'].includes(post.hostname)) {
    const match = post.pathname.match(/^\/(p|reel)\/([A-Za-z0-9_-]+)\/?$/);
    if (match) { document.getElementById('about-post-link').href = post.href; document.getElementById('about-instagram').src = `https://www.instagram.com/${match[1]}/${match[2]}/embed/`; }
  }
}).catch(() => { document.getElementById('about-status').textContent = 'I contenuti aggiornati non sono disponibili. Riprova più tardi.'; });
load('data/site.json').then(config => {
  const number = String(config.whatsappNumber || '').replace(/[\s+()-]/g,''); if (!/^[1-9]\d{6,14}$/.test(number)) return;
  document.querySelectorAll('[data-whatsapp]').forEach(link => { link.href = `https://wa.me/${number}?text=${encodeURIComponent(config.bookingMessage || 'Ciao Oma! Vorrei richiedere una prenotazione.')}`; link.target = '_blank'; link.rel = 'noopener noreferrer'; });
}).catch(() => {});
