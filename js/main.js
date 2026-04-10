/* ======================================================
   PRASEODYMIUM WEB CO. — Main JavaScript
   ====================================================== */

/* ── Highlight current nav link ── */
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ── Mobile nav toggle ── */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.classList.toggle('open');
  });
  // Close when link clicked
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

/* ── Intro door animation (index only) ── */
function initIntro() {
  const screen = document.getElementById('intro-screen');
  const door   = document.querySelector('.intro-door');
  if (!screen || !door) return;

  // Check sessionStorage so it only runs once per session
  if (sessionStorage.getItem('pr_intro_done')) {
    screen.style.display = 'none';
    return;
  }

  setTimeout(() => {
    door.classList.add('split');
  }, 1600);

  setTimeout(() => {
    screen.classList.add('hidden');
    setTimeout(() => {
      screen.style.display = 'none';
      sessionStorage.setItem('pr_intro_done', '1');
    }, 1000);
  }, 2800);
}

/* ── Scroll reveal ── */
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-stagger');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
}

/* ── Animated counters ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();

  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => io.observe(el));
}

/* ── Navbar shrink on scroll ── */
function initNavShrink() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.style.background = 'rgba(0,0,0,0.97)';
    } else {
      navbar.style.background = 'rgba(0,0,0,0.88)';
    }
  }, { passive: true });
}

/* ── Cursor glow trail ── */
function initCursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed; pointer-events:none; z-index:9000;
    width:220px; height:220px; border-radius:50%;
    background:radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%);
    transform:translate(-50%,-50%);
    transition:opacity 0.3s ease;
    mix-blend-mode:screen;
  `;
  document.body.appendChild(glow);

  let mx = 0, my = 0, gx = 0, gy = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  function loop() {
    gx += (mx - gx) * 0.1;
    gy += (my - gy) * 0.1;
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
    requestAnimationFrame(loop);
  }
  loop();
}

/* ── Typing effect ── */
function initTyping() {
  const el = document.querySelector('[data-typing]');
  if (!el) return;
  const words = el.dataset.typing.split('|');
  let wi = 0, ci = 0, deleting = false;

  function tick() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(tick, deleting ? 50 : 90);
  }
  tick();
}

/* --submit button--*/
function handleSubmit() {
  const name = document.getElementById("submitBtn").value;
  const message = document.getElementById("").value;

  window.location.href = `mailto:?subject=Project Brief&body=Name: ${name}%0AMessage: ${message}`;
}


/* ── Boot ── */
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initMobileNav();
  initIntro();
  initReveal();
  initCounters();
  initNavShrink();
  initCursorGlow();
  initTyping();
});
