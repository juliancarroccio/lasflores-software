/* Shared chrome behaviour for secondary pages: reveal-on-scroll, mobile
   nav, header ink by chapter, back-to-top, cookie banner + GA4.
   index.html keeps its own inline copy and does not load this file. */
document.documentElement.classList.add('js');

/* ---------- reveal on scroll ---------- */
(() => {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) { targets.forEach(el => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  targets.forEach(el => io.observe(el));
  window.addEventListener('load', () => setTimeout(() => {
    targets.forEach(el => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in'); });
  }, 2500));
})();

/* ---------- nav móvil ---------- */
const navToggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');
function closeMobileMenu() { navToggle.classList.remove('open'); mobileMenu.classList.remove('open'); navToggle.setAttribute('aria-expanded','false'); }
navToggle.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));

/* ---------- colour by chapter: header ink follows the field beneath it ---------- */
(() => {
  const chapters = document.querySelectorAll('[data-ink]');
  if (!chapters.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) if (entry.isIntersecting) document.documentElement.style.setProperty('--header-ink', entry.target.dataset.ink);
  }, { rootMargin: '0px 0px -92% 0px', threshold: 0 });
  chapters.forEach(el => io.observe(el));
})();

/* ---------- back to top ---------- */
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => backToTop.classList.toggle('visible', window.scrollY > 600));
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- COOKIE BANNER + GA4 ---------- */
const GA4_ID = 'G-CGJE92SB7Y';
function loadGA4() {
  if (window.gaLoaded) return;
  window.gaLoaded = true;
  const s = document.createElement('script');
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  s.async = true;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', GA4_ID);
  window.gtag = gtag;
}
const cookieBanner = document.getElementById('cookie-banner');
try {
  const consent = localStorage.getItem('lfs_cookie_consent');
  if (consent === 'accepted') loadGA4();
  else if (consent !== 'rejected') cookieBanner.classList.add('visible');
} catch (e) { cookieBanner.classList.add('visible'); }
document.getElementById('cookie-accept').addEventListener('click', () => {
  try { localStorage.setItem('lfs_cookie_consent', 'accepted'); } catch (e) {}
  cookieBanner.classList.remove('visible');
  loadGA4();
});
document.getElementById('cookie-reject').addEventListener('click', () => {
  try { localStorage.setItem('lfs_cookie_consent', 'rejected'); } catch (e) {}
  cookieBanner.classList.remove('visible');
});
