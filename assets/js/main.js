/* ========== LAKSFORD PARTNERS — site JS ========== */
(function () {
  /* ── Visitor analytics (Cloudflare Web Analytics) ──
     Paste your token between the quotes below. Get it free at:
     Cloudflare dashboard → Analytics & Logs → Web Analytics → Add a site.
     This applies to every page automatically. */
  var CF_ANALYTICS_TOKEN = "YOUR_CF_TOKEN";
  if (CF_ANALYTICS_TOKEN && CF_ANALYTICS_TOKEN !== "YOUR_CF_TOKEN" && location.protocol !== 'file:') {
    var cf = document.createElement('script');
    cf.defer = true;
    cf.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    cf.setAttribute('data-cf-beacon', JSON.stringify({ token: CF_ANALYTICS_TOKEN }));
    document.head.appendChild(cf);
  }

  /* ── Calendly booking popup ──
     Any button whose text starts with "Book" (or has data-calendly) opens this. */
  var CALENDLY_URL = "https://calendly.com/laksfordpartners/30min";
  if (CALENDLY_URL) {
    var cl = document.createElement('link');
    cl.rel = 'stylesheet'; cl.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(cl);
    var cs = document.createElement('script');
    cs.src = 'https://assets.calendly.com/assets/external/widget.js'; cs.async = true;
    document.head.appendChild(cs);
    var triggers = Array.prototype.slice.call(document.querySelectorAll('a, button'))
      .filter(function (el) {
        return el.hasAttribute('data-calendly') || /^book\b/i.test((el.textContent || '').trim());
      });
    triggers.forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        if (window.Calendly && Calendly.initPopupWidget) {
          Calendly.initPopupWidget({ url: CALENDLY_URL });
        } else {
          window.open(CALENDLY_URL, '_blank');
        }
      });
    });
  }

  // Sticky nav
  const nav = document.querySelector('header.nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('solid', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const burger = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-menu');
  const closeBtn = document.querySelector('.mobile-close');
  if (burger && menu) {
    burger.addEventListener('click', () => menu.classList.add('open'));
    if (closeBtn) closeBtn.addEventListener('click', () => menu.classList.remove('open'));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
  }

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    reveals.forEach(r => io.observe(r));
  } else {
    reveals.forEach(r => r.classList.add('in'));
  }

  // Animated counters
  const counters = document.querySelectorAll('[data-count]');
  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const dec = (el.dataset.dec ? parseInt(el.dataset.dec) : 0);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dur = 1500; const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = (target * eased).toFixed(dec);
      el.textContent = prefix + Number(val).toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { animate(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));
  } else { counters.forEach(animate); }

  // Hero particle network (center animation)
  const canvas = document.getElementById('hero-canvas');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr, particles = [], raf, mouse = { x: -999, y: -999 };
    const COUNT = 70;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const init = () => {
      particles = [];
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
          r: Math.random() * 1.8 + .6
        });
      }
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(140,192,255,.85)';
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(56,210,240,${(1 - dist / 130) * .28})`;
            ctx.lineWidth = .7;
            ctx.stroke();
          }
        }
        const mdx = p.x - mouse.x, mdy = p.y - mouse.y;
        const md = Math.hypot(mdx, mdy);
        if (md < 160) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(79,155,255,${(1 - md / 160) * .5})`;
          ctx.lineWidth = .8; ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    const start = () => { resize(); init(); cancelAnimationFrame(raf); draw(); };
    window.addEventListener('resize', start);
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });
    start();
  }

  // Year
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  /* ── Quick-contact chat widget ── */
  (function buildChat() {
    var PHONE_DISPLAY = "(732) 532-5691";
    var PHONE_DIAL = "+17325325691";
    var EMAIL = "laksfordpartners@outlook.com";
    var WHATSAPP = "https://wa.me/17325325691";
    var BOOK = (typeof CALENDLY_URL !== 'undefined' && CALENDLY_URL) ? CALENDLY_URL : 'contact.html';

    var wrap = document.createElement('div');
    wrap.className = 'lp-chat';
    wrap.innerHTML =
      '<div class="lp-chat-panel" role="dialog" aria-label="Contact Laksford Partners">' +
        '<div class="lp-chat-head"><div class="hero-glow g1"></div>' +
          '<strong>Chat with Laksford Partners</strong>' +
          '<span><i class="dot"></i> We typically reply within minutes</span>' +
        '</div>' +
        '<div class="lp-chat-body">' +
          '<p>Hi 👋 How can we help? Pick the quickest way to reach us.</p>' +
          '<div class="lp-chat-actions">' +
            '<a class="primary" data-book href="#"><span class="cic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></span><span>Book a free strategy call<small>Pick a time on our calendar</small></span></a>' +
            '<a href="tel:' + PHONE_DIAL + '"><span class="cic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span><span>Call us<small>' + PHONE_DISPLAY + '</small></span></a>' +
            '<a href="' + WHATSAPP + '" target="_blank" rel="noopener"><span class="cic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 1 1 16.1-3.8z"/></svg></span><span>WhatsApp<small>Message us instantly</small></span></a>' +
            '<a href="mailto:' + EMAIL + '"><span class="cic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6 12 13 2 6"/></svg></span><span>Email us<small>' + EMAIL + '</small></span></a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<button class="lp-chat-btn" aria-label="Open chat">' +
        '<span class="lp-chat-badge">1</span>' +
        '<svg class="ic-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/></svg>' +
        '<svg class="ic-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
      '</button>';
    document.body.appendChild(wrap);

    var btn = wrap.querySelector('.lp-chat-btn');
    btn.addEventListener('click', function () { wrap.classList.toggle('open'); });
    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) wrap.classList.remove('open');
    });
    wrap.querySelector('[data-book]').addEventListener('click', function (e) {
      e.preventDefault();
      wrap.classList.remove('open');
      if (window.Calendly && Calendly.initPopupWidget) Calendly.initPopupWidget({ url: BOOK });
      else window.open(BOOK, '_blank');
    });
  })();

  // Lead form -> Netlify Forms (AJAX so the visitor stays on the page)
  document.querySelectorAll('form[data-form]').forEach(form => {
    const ok = form.querySelector('.form-success');
    const err = form.querySelector('.form-error');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (ok) ok.style.display = 'none';
      if (err) err.style.display = 'none';
      // Local preview (opened as a file): just confirm visually, no server to post to.
      if (location.protocol === 'file:') {
        if (ok) ok.style.display = 'block';
        form.reset();
        return;
      }
      const btn = form.querySelector('button[type="submit"]');
      const label = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.innerHTML = 'Sending…'; }
      try {
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(form)).toString()
        });
        if (res.ok) { if (ok) ok.style.display = 'block'; form.reset(); }
        else { if (err) err.style.display = 'block'; }
      } catch (_) {
        if (err) err.style.display = 'block';
      } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = label; }
      }
    });
  });
})();
