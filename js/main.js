/* Pohyb jen tam, kde ho uživatel nevypnul. */
const omezenyPohyb = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== NAVIGACE: pozadí po odjetí z vršku stránky =====
   Hlídá se značka na začátku stránky přes IntersectionObserver,
   ne posluchač scrollu, který běží při každém snímku. */
const nav = document.getElementById('nav');
if (nav) {
  const znacka = document.createElement('div');
  znacka.setAttribute('aria-hidden', 'true');
  znacka.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:60px;pointer-events:none;';
  document.body.prepend(znacka);
  new IntersectionObserver(([e]) => nav.classList.toggle('scrolled', !e.isIntersecting)).observe(znacka);
}

/* ===== MOBILNÍ MENU =====
   Tlačítko se doplní do každé stránky, jazykové verze ho v HTML nemají. */
if (nav) {
  const odkazy = nav.querySelector('.nav-links');
  const ovladani = nav.querySelector('.nav-controls');
  if (odkazy && ovladani && !nav.querySelector('.menu-toggle')) {
    const lang = (document.documentElement.lang || 'cs').slice(0, 2);
    const popis = { cs: 'Menu', en: 'Menu', de: 'Menü' }[lang] || 'Menu';
    const tl = document.createElement('button');
    tl.className = 'menu-toggle';
    tl.type = 'button';
    tl.setAttribute('aria-label', popis);
    tl.setAttribute('aria-expanded', 'false');
    tl.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>';
    ovladani.appendChild(tl);
    const zavri = () => { nav.classList.remove('menu-open'); tl.setAttribute('aria-expanded', 'false'); };
    tl.addEventListener('click', () => {
      const otevreno = nav.classList.toggle('menu-open');
      tl.setAttribute('aria-expanded', String(otevreno));
    });
    odkazy.querySelectorAll('a').forEach(a => a.addEventListener('click', zavri));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') zavri(); });
  }
}

/* ===== ODHALENÍ PŘI SCROLLU ===== */
const revealEls = document.querySelectorAll('.reveal');
if (omezenyPohyb || !('IntersectionObserver' in window)) {
  revealEls.forEach(el => el.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealEls.forEach(el => observer.observe(el));
}

/* ===== THEME TOGGLE ===== */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem('theme', theme); } catch (e) {}
  if (themeIcon) {
    if (theme === 'light') {
      themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    } else {
      themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
    }
  }
  // Sync theme to calculator iframe
  var iframe = document.querySelector('.calc-iframe-section iframe');
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({ type: 'theme-change', theme: theme }, '*');
  }
}

// Výchozí režim podle systému, ruční volba se pamatuje.
let savedTheme = null;
try { savedTheme = localStorage.getItem('theme'); } catch (e) {}
setTheme(savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

/* ===== 3D CUBE LOGO ===== */
const logoCube = document.querySelector('.logo-cube-3d');
if (logoCube) {
  const ns = 'http://www.w3.org/2000/svg';
  const V = [[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1],[-1,1,-1],[1,1,-1],[1,1,1],[-1,1,1]];
  const E = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  const EC = ['#D040C8','#B855D4','#9B59D4','#C040B8','#8030B8','#7045D0','#4B6EE0','#6050C8','#B040C0','#9B59D4','#5070E0','#4060C8'];
  const VC = ['#F0C0FF','#9B59D4','#C080FF','#E040C8','#A030C0','#6060D0','#4060C8','#8050D0'];

  const edgeEls = E.map((_, i) => {
    const l = document.createElementNS(ns, 'line');
    l.setAttribute('stroke', EC[i]);
    l.setAttribute('stroke-width', '1');
    l.setAttribute('opacity', '0.75');
    logoCube.appendChild(l);
    return l;
  });

  const vertEls = V.map((_, i) => {
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('r', '1.6');
    c.setAttribute('fill', VC[i]);
    logoCube.appendChild(c);
    return c;
  });

  const xTilt = 0.55;
  const cx2 = Math.cos(xTilt), sx2 = Math.sin(xTilt);

  function updateCube(t) {
    const a = t * 0.0008;
    const cy2 = Math.cos(a), sy2 = Math.sin(a);

    const proj = V.map(([x, y, z]) => {
      const rx = x * cy2 + z * sy2;
      const rz = -x * sy2 + z * cy2;
      const fy = y * cx2 - rz * sx2;
      return [25 + rx * 13, 25 + fy * 13];
    });

    edgeEls.forEach((el, i) => {
      const [a2, b] = E[i];
      el.setAttribute('x1', proj[a2][0]);
      el.setAttribute('y1', proj[a2][1]);
      el.setAttribute('x2', proj[b][0]);
      el.setAttribute('y2', proj[b][1]);
    });

    vertEls.forEach((el, i) => {
      el.setAttribute('cx', proj[i][0]);
      el.setAttribute('cy', proj[i][1]);
    });

    if (!omezenyPohyb) requestAnimationFrame(updateCube);
  }

  requestAnimationFrame(updateCube);
}

/* ===== FAQ ===== */
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  if (q.tagName !== 'BUTTON') { q.setAttribute('role', 'button'); q.setAttribute('tabindex', '0'); }
  q.setAttribute('aria-expanded', 'false');
  const prepni = () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) { item.classList.add('open'); q.setAttribute('aria-expanded', 'true'); }
  };
  q.addEventListener('click', prepni);
  q.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); prepni(); } });
});
