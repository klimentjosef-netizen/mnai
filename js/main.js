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

/* ===== FAQ ===== */
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-q').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});
