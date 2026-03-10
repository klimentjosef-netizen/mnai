/* ===== STARFIELD ===== */
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [], shootingStars = [];

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initStars() {
  stars = [];
  for (let i = 0; i < 280; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      a: Math.random() * 0.8 + 0.1,
      speed: Math.random() * 0.003 + 0.001,
      phase: Math.random() * Math.PI * 2,
      hue: Math.random() > 0.7 ? '220,180,255' : '240,235,255'
    });
  }
}

function spawnShootingStar() {
  shootingStars.push({
    x: Math.random() * canvas.width * 0.8,
    y: Math.random() * canvas.height * 0.4,
    len: Math.random() * 120 + 60,
    speed: Math.random() * 6 + 4,
    angle: Math.PI / 4 + (Math.random() - 0.5) * 0.4,
    alpha: 1,
    width: Math.random() * 1.5 + 0.5
  });
}

function drawStars(t) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach(s => {
    const alpha = s.a * (0.6 + 0.4 * Math.sin(t * s.speed + s.phase));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${s.hue},${alpha})`;
    ctx.fill();
  });

  shootingStars = shootingStars.filter(ss => ss.alpha > 0.02);
  shootingStars.forEach(ss => {
    const ex = ss.x + Math.cos(ss.angle) * ss.len;
    const ey = ss.y + Math.sin(ss.angle) * ss.len;
    const grad = ctx.createLinearGradient(ss.x, ss.y, ex, ey);
    grad.addColorStop(0, `rgba(220,180,255,0)`);
    grad.addColorStop(0.6, `rgba(200,160,255,${ss.alpha * 0.8})`);
    grad.addColorStop(1, `rgba(255,255,255,${ss.alpha})`);
    ctx.beginPath();
    ctx.moveTo(ss.x, ss.y);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = grad;
    ctx.lineWidth = ss.width;
    ctx.stroke();
    ss.x += Math.cos(ss.angle) * ss.speed;
    ss.y += Math.sin(ss.angle) * ss.speed;
    ss.alpha -= 0.018;
  });
}

let frame = 0;
function animate() {
  frame++;
  drawStars(frame);
  if (frame % 220 === 0) spawnShootingStar();
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => { resize(); initStars(); });
resize();
initStars();
animate();

/* ===== STICKY NAV ===== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ===== SCROLL REVEALS ===== */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 90);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
revealEls.forEach(el => observer.observe(el));

/* ===== THEME TOGGLE ===== */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (themeIcon) {
    if (theme === 'light') {
      themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    } else {
      themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
    }
  }
}

const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

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

    requestAnimationFrame(updateCube);
  }

  requestAnimationFrame(updateCube);
}

/* ===== FAQ ===== */
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-q').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});
