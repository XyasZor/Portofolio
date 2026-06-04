/* ═══════════════════════════════════════════
   VISITOR PROTECTION
   Blokir klik kanan, inspect element, copy, drag
   Semua perubahan konten HANYA lewat VS Code
═══════════════════════════════════════════ */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  // Blokir F12, Ctrl+Shift+I/J/C/U, Ctrl+U (view source)
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key.toUpperCase())) ||
    (e.ctrlKey && e.key.toUpperCase() === 'U')
  ) {
    e.preventDefault();
    return false;
  }
});
document.addEventListener('copy',  e => e.preventDefault());
document.addEventListener('cut',   e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());

/* ═══════════════════════════════════════════
   1. BACKGROUND CANVAS — Starry Wave + Dense Dynasty
═══════════════════════════════════════════ */
(function(){
  const c = document.getElementById('bgCanvas');
  const ctx = c.getContext('2d');
  let W, H, stars = [], meteors = [];

  function resize() {
    W = c.width  = window.innerWidth;
    H = c.height = window.innerHeight;
    buildStars();
  }

  function buildStars() {
    stars = [];
    const n = Math.min(Math.floor(W * H / 1800), 700);
    for (let i = 0; i < n; i++) {
      const isBig = Math.random() < .08;
      stars.push({
        x: Math.random() * W, y: Math.random() * H,
        r: isBig ? Math.random() * 2.8 + 1.2 : Math.random() * 1.4 + .3,
        a: Math.random() * .9 + .1,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * .025 + .008,
        drift: Math.random() * .15 - .075,
        color: Math.random() < .12 ? '#f0c040' : Math.random() < .2 ? '#00e5ff' : Math.random() < .08 ? '#b060ff' : '#ffffff',
        twinkle: Math.random() < .4,
      });
    }
  }

  const blobs = [
    {x:.18,y:.2,r:.38,hue:210,a:.28},{x:.82,y:.35,r:.32,hue:195,a:.22},
    {x:.5,y:.75,r:.42,hue:220,a:.24},{x:.08,y:.65,r:.28,hue:42,a:.18},
    {x:.92,y:.12,r:.25,hue:38,a:.16},{x:.35,y:.5,r:.22,hue:270,a:.14},
    {x:.65,y:.6,r:.2,hue:330,a:.12},{x:.5,y:.15,r:.18,hue:180,a:.15},
  ];
  let blobT = 0, t = 0;

  function frame() {
    t += .014; blobT += .004;
    ctx.clearRect(0, 0, W, H);

    const sky = ctx.createLinearGradient(0, 0, W * .25, H);
    sky.addColorStop(0, '#04091c');
    sky.addColorStop(.3, '#071830');
    sky.addColorStop(.6, '#0b2248');
    sky.addColorStop(1, '#051220');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

    blobs.forEach((b, i) => {
      const px = b.x * W + Math.sin(blobT + i) * W * .015;
      const py = b.y * H + Math.cos(blobT * .7 + i) * H * .01;
      const gr = ctx.createRadialGradient(px, py, 0, px, py, b.r * Math.min(W, H));
      gr.addColorStop(0, `hsla(${b.hue},85%,60%,${b.a})`);
      gr.addColorStop(.5, `hsla(${b.hue},70%,50%,${b.a * .4})`);
      gr.addColorStop(1, 'transparent');
      ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
    });

    const cx2 = W * .5, cy2 = H * .3;
    const pulse = .18 + Math.sin(t * .8) * .06;
    const gr2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, W * .5);
    gr2.addColorStop(0, `rgba(0,120,220,${pulse})`);
    gr2.addColorStop(.5, `rgba(0,80,160,${pulse * .4})`);
    gr2.addColorStop(1, 'transparent');
    ctx.fillStyle = gr2; ctx.fillRect(0, 0, W, H);

    const streams = 10;
    for (let w = 0; w < streams; w++) {
      const yBase = H * (0.08 + w * .09);
      const amp   = Math.min(Math.max(18 + w * 9, 12), 90);
      const freq  = .003 + w * .0014;
      const spd   = .5 + w * .18;
      const bright = w % 3 === 0 ? .22 : w % 3 === 1 ? .18 : .12;
      const col = w % 4 === 0 ? `rgba(240,192,64,${bright})` :
                  w % 4 === 1 ? `rgba(0,220,240,${bright * 1.1})` :
                  w % 4 === 2 ? `rgba(120,80,255,${bright * .8})` : `rgba(255,80,140,${bright * .6})`;
      ctx.beginPath(); ctx.moveTo(0, yBase);
      for (let x = 0; x <= W; x += 3) {
        const y = yBase
          + Math.sin(x * freq + t * spd) * amp
          + Math.cos(x * freq * .55 + t * (spd * .65)) * amp * .38
          + Math.sin(x * freq * .3  + t * (spd * .4)) * amp * .18;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = col; ctx.lineWidth = .8 + w * .12; ctx.stroke();

      ctx.beginPath(); ctx.moveTo(0, yBase + 8);
      for (let x = 0; x <= W; x += 6) {
        const y = yBase + 8 + Math.sin(x * freq * .8 + t * spd * .6 + 1.2) * amp * .6;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = col.replace(/[\d.]+\)$/, `${bright * .35})`);
      ctx.lineWidth = .5; ctx.stroke();
    }

    stars.forEach(s => {
      s.phase += s.speed;
      s.x += s.drift;
      if (s.x > W + 5) s.x = -5;
      if (s.x < -5) s.x = W + 5;
      const flicker = s.twinkle ? .5 + Math.abs(Math.sin(s.phase)) * 0.5 : s.a;
      ctx.globalAlpha = flicker;
      ctx.fillStyle = s.color;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      if (s.r > 1.6) {
        ctx.globalAlpha = flicker * .35;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = flicker * .25;
        ctx.strokeStyle = s.color; ctx.lineWidth = .6;
        ctx.beginPath();
        ctx.moveTo(s.x - s.r * 5, s.y); ctx.lineTo(s.x + s.r * 5, s.y);
        ctx.moveTo(s.x, s.y - s.r * 5); ctx.lineTo(s.x, s.y + s.r * 5);
        ctx.stroke();
      }
    });

    if (Math.random() < .004)
      meteors.push({x: Math.random() * W, y: Math.random() * H * .3, vx: 9 + Math.random() * 6, vy: 4 + Math.random() * 4, life: 1, tail: []});

    meteors = meteors.filter(m => {
      m.x += m.vx; m.y += m.vy; m.life -= .055;
      if (m.life <= 0) return false;
      m.tail.push({x: m.x, y: m.y});
      if (m.tail.length > 16) m.tail.shift();
      m.tail.forEach((p, i) => {
        ctx.globalAlpha = (i / m.tail.length) * m.life * .7;
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(p.x, p.y, .9, 0, Math.PI * 2); ctx.fill();
      });
      return true;
    });

    const arcs = [
      [0, H*.28, W*.14, H*.07, W*.36, H*.22, 'rgba(240,192,64,.16)'],
      [W, H*.28, W*.86, H*.07, W*.64, H*.22, 'rgba(240,192,64,.16)'],
      [0, H*.72, W*.14, H*.93, W*.36, H*.78, 'rgba(0,200,220,.13)'],
      [W, H*.72, W*.86, H*.93, W*.64, H*.78, 'rgba(0,200,220,.13)'],
      [0, H*.5,  W*.1,  H*.35, W*.25, H*.46, 'rgba(176,96,255,.1)'],
      [W, H*.5,  W*.9,  H*.35, W*.75, H*.46, 'rgba(176,96,255,.1)'],
    ];
    arcs.forEach(([x1, y1, cx3, cy3, x2, y2, col]) => {
      const off = Math.sin(t * .4) * 8;
      ctx.beginPath(); ctx.moveTo(x1, y1 + off);
      ctx.quadraticCurveTo(cx3, cy3 + off, x2, y2 + off);
      ctx.strokeStyle = col; ctx.lineWidth = 1.4; ctx.stroke();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }
  window.addEventListener('resize', resize);
  resize(); frame();
})();

/* ═══════════════════════════════════════════
   2. NIRVANA CANVAS
═══════════════════════════════════════════ */
(function(){
  const c = document.getElementById('nirvanaCanvas');
  const ctx = c.getContext('2d');
  let W, H;
  function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
  window.addEventListener('resize', resize); resize();

  const tris = [];
  for (let i = 0; i < 14; i++) {
    const size = Math.random() * 60 + 20;
    tris.push({
      x: Math.random() * W, y: Math.random() * H, size,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - .5) * .012,
      vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .3,
      col: Math.random() < .4 ? 'rgba(240,192,64,' : 'rgba(0,200,220,',
      a: Math.random() * .5 + .15, filled: Math.random() < .35,
    });
  }

  const cubes = [];
  for (let i = 0; i < 8; i++) {
    const sz = Math.random() * 50 + 18;
    cubes.push({
      x: Math.random() * W, y: Math.random() * H, sz,
      rx: Math.random() * .02 - .01, ry: Math.random() * .018 - .009, rz: Math.random() * .015 - .0075,
      ax: Math.random() * Math.PI * 2, ay: Math.random() * Math.PI * 2, az: Math.random() * Math.PI * 2,
      vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .25,
      col: Math.random() < .5 ? [0,200,220] : Math.random() < .5 ? [240,192,64] : [176,96,255],
      a: Math.random() * .45 + .12,
    });
  }

  const clouds = [];
  for (let i = 0; i < 7; i++) {
    const scale = Math.random() * 1.4 + .5;
    clouds.push({
      x: Math.random() * W, y: Math.random() * (H * .7) + H * .05, scale,
      vx: (Math.random() - .5) * .22, vy: Math.sin(Math.random() * Math.PI) * .08,
      a: Math.random() * .55 + .18,
      col: Math.random() < .4 ? [0,200,220] : Math.random() < .5 ? [180,120,255] : [80,180,255],
      phase: Math.random() * Math.PI * 2, phaseSpeed: Math.random() * .008 + .003,
    });
  }

  function rotX(p, a) { return [p[0], p[1]*Math.cos(a)-p[2]*Math.sin(a), p[1]*Math.sin(a)+p[2]*Math.cos(a)]; }
  function rotY(p, a) { return [p[0]*Math.cos(a)+p[2]*Math.sin(a), p[1], -p[0]*Math.sin(a)+p[2]*Math.cos(a)]; }
  function rotZ(p, a) { return [p[0]*Math.cos(a)-p[1]*Math.sin(a), p[0]*Math.sin(a)+p[1]*Math.cos(a), p[2]]; }
  const cubeBase  = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
  const cubeEdges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];

  function drawCube(cb) {
    const verts = cubeBase.map(v => {
      let p = [v[0]*cb.sz*.5, v[1]*cb.sz*.5, v[2]*cb.sz*.5];
      p = rotX(p, cb.ax); p = rotY(p, cb.ay); p = rotZ(p, cb.az);
      return p;
    });
    ctx.strokeStyle = `rgba(${cb.col[0]},${cb.col[1]},${cb.col[2]},${cb.a})`;
    ctx.lineWidth = 1.1;
    cubeEdges.forEach(([a, b]) => {
      ctx.beginPath();
      ctx.moveTo(cb.x + verts[a][0], cb.y + verts[a][1]);
      ctx.lineTo(cb.x + verts[b][0], cb.y + verts[b][1]);
      ctx.stroke();
    });
    ctx.fillStyle = `rgba(${cb.col[0]},${cb.col[1]},${cb.col[2]},${cb.a * .8})`;
    verts.forEach(v => {
      ctx.beginPath(); ctx.arc(cb.x + v[0], cb.y + v[1], 1.4, 0, Math.PI * 2); ctx.fill();
    });
  }

  function drawMegamendung(cloud) {
    const {x, y, scale, a, col, phase} = cloud;
    const s = scale;
    ctx.save(); ctx.translate(x, y); ctx.globalAlpha = a;
    const layers = 3;
    for (let l = 0; l < layers; l++) {
      const lScale = 1 - l * .28, lAlpha = 1 - l * .3, offY = -l * 18 * s;
      ctx.save(); ctx.translate(0, offY); ctx.scale(lScale * s, lScale * s);
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${lAlpha * .85})`;
      ctx.lineWidth = (1.8 - l * .3) / s;
      ctx.arc(0, -10, 38, Math.PI, 0, false);
      ctx.arc(-28, -14, 18, 0, Math.PI, true);
      ctx.arc(-50, -8, 14, 0, Math.PI * .8, true);
      ctx.arc(28, -14, 18, Math.PI, 0, false);
      ctx.arc(50, -8, 14, Math.PI * .2, Math.PI, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${lAlpha * .55})`;
      ctx.lineWidth = (1.1 - l * .2) / s;
      for (let i = 0; i < 60; i++) {
        const ang = i * .12 + phase, r = 14 - i * .12;
        if (r < 2) break;
        const px2 = -26 + r * Math.cos(ang), py2 = -14 + r * Math.sin(ang);
        i === 0 ? ctx.moveTo(px2, py2) : ctx.lineTo(px2, py2);
      }
      ctx.stroke();
      ctx.beginPath();
      for (let i = 0; i < 60; i++) {
        const ang = -i * .12 - phase, r = 14 - i * .12;
        if (r < 2) break;
        const px2 = 26 + r * Math.cos(ang), py2 = -14 + r * Math.sin(ang);
        i === 0 ? ctx.moveTo(px2, py2) : ctx.lineTo(px2, py2);
      }
      ctx.stroke();
      if (l === 0) {
        const gr = ctx.createRadialGradient(0, -10, 0, 0, -10, 40);
        gr.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},0.06)`);
        gr.addColorStop(1, 'transparent');
        ctx.fillStyle = gr;
        ctx.beginPath(); ctx.arc(0, -10, 40, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();
  }

  function drawTri(tr) {
    const h = tr.size * Math.sqrt(3) / 2;
    ctx.save(); ctx.translate(tr.x, tr.y); ctx.rotate(tr.rot);
    ctx.beginPath();
    ctx.moveTo(0, -h * 2 / 3);
    ctx.lineTo(tr.size / 2, h / 3);
    ctx.lineTo(-tr.size / 2, h / 3);
    ctx.closePath();
    if (tr.filled) { ctx.fillStyle = tr.col + tr.a * .5 + ')'; ctx.fill(); }
    ctx.strokeStyle = tr.col + tr.a + ')'; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -h * 2 / 3 * .5);
    ctx.lineTo(tr.size / 2 * .5, h / 3 * .5);
    ctx.lineTo(-tr.size / 2 * .5, h / 3 * .5);
    ctx.closePath();
    ctx.strokeStyle = tr.col + (tr.a * .5) + ')'; ctx.lineWidth = .7; ctx.stroke();
    ctx.restore();
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    clouds.forEach(cl => {
      cl.x += cl.vx; cl.y += cl.vy; cl.phase += cl.phaseSpeed;
      if (cl.x < -150) cl.x = W + 150;
      if (cl.x > W + 150) cl.x = -150;
      if (cl.y < -80) cl.y = H * .7;
      if (cl.y > H * .8) cl.y = -80;
      drawMegamendung(cl);
    });
    tris.forEach(tr => {
      tr.x += tr.vx; tr.y += tr.vy; tr.rot += tr.rotSpeed;
      if (tr.x < -80) tr.x = W + 80; if (tr.x > W + 80) tr.x = -80;
      if (tr.y < -80) tr.y = H + 80; if (tr.y > H + 80) tr.y = -80;
      drawTri(tr);
    });
    cubes.forEach(cb => {
      cb.ax += cb.rx; cb.ay += cb.ry; cb.az += cb.rz;
      cb.x += cb.vx; cb.y += cb.vy;
      if (cb.x < -80) cb.x = W + 80; if (cb.x > W + 80) cb.x = -80;
      if (cb.y < -80) cb.y = H + 80; if (cb.y > H + 80) cb.y = -80;
      drawCube(cb);
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }
  frame();
})();

/* ═══════════════════════════════════════════
   3. GLOBE
═══════════════════════════════════════════ */
(function(){
  const canvas = document.getElementById('globeCanvas');
  const ctx = canvas.getContext('2d');
  const SIZE = 200; canvas.width = SIZE; canvas.height = SIZE;
  const R = SIZE / 2 - 4;
  let angle = 0;
  const continents = [
    [[.48,.3],[.52,.28],[.56,.32],[.58,.4],[.56,.52],[.52,.58],[.48,.56],[.44,.5],[.43,.4]],
    [[.46,.22],[.5,.2],[.54,.22],[.55,.28],[.52,.3],[.48,.3],[.45,.26]],
    [[.54,.15],[.62,.13],[.72,.18],[.78,.25],[.76,.32],[.68,.35],[.6,.3],[.56,.25]],
    [[.28,.18],[.32,.16],[.36,.2],[.38,.3],[.36,.42],[.3,.48],[.26,.4],[.24,.3],[.26,.22]],
    [[.3,.5],[.34,.48],[.36,.55],[.34,.65],[.3,.68],[.27,.6],[.27,.52]],
    [[.7,.52],[.76,.5],[.78,.56],[.74,.6],[.7,.58]],
  ];

  function ll2xy(lat, lon, ang) {
    const phi   = (90 - lat) * Math.PI / 180;
    const theta = (lon + ang) * Math.PI / 180;
    return { x: R*Math.sin(phi)*Math.cos(theta), y: R*Math.cos(phi), z: R*Math.sin(phi)*Math.sin(theta) };
  }

  function draw() {
    ctx.clearRect(0, 0, SIZE, SIZE);
    const cx = SIZE / 2, cy = SIZE / 2;
    angle += 1.2;
    const dayShift = (Math.cos(angle * Math.PI / 180) + 1) / 2;
    const grd = ctx.createLinearGradient(cx - R, cy, cx + R, cy);
    if (dayShift > .5) {
      grd.addColorStop(0, '#001840'); grd.addColorStop(.38, '#001840');
      grd.addColorStop(.52, '#1a6aab'); grd.addColorStop(.68, '#4db8e8'); grd.addColorStop(1, '#4db8e8');
    } else {
      grd.addColorStop(0, '#4db8e8'); grd.addColorStop(.32, '#4db8e8');
      grd.addColorStop(.48, '#1a6aab'); grd.addColorStop(.62, '#001840'); grd.addColorStop(1, '#001840');
    }
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = grd; ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.strokeStyle = 'rgba(100,200,255,.12)'; ctx.lineWidth = .5;
    for (let lat = -75; lat <= 75; lat += 30) {
      ctx.beginPath(); let f = true;
      for (let lon = 0; lon <= 360; lon += 3) {
        const p = ll2xy(lat, lon, angle); if (p.z < 0) continue;
        f ? ctx.moveTo(cx+p.x, cy-p.y) : ctx.lineTo(cx+p.x, cy-p.y); f = false;
      } ctx.stroke();
    }
    for (let lon = 0; lon < 360; lon += 30) {
      ctx.beginPath(); let f = true;
      for (let lat = -90; lat <= 90; lat += 3) {
        const p = ll2xy(lat, lon, angle); if (p.z < 0) continue;
        f ? ctx.moveTo(cx+p.x, cy-p.y) : ctx.lineTo(cx+p.x, cy-p.y); f = false;
      } ctx.stroke();
    }
    continents.forEach(cont => {
      ctx.beginPath(); let st = false, ab = true;
      cont.forEach(([u, v]) => {
        const lat = (1 - v) * 180 - 90, lon = u * 360;
        const p = ll2xy(lat, lon, angle);
        if (p.z > 0) {
          ab = false;
          const sx = cx + p.x, sy = cy - p.y;
          st ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy); st = true;
        }
      });
      if (!ab) {
        ctx.closePath();
        ctx.fillStyle = 'rgba(30,160,80,.72)'; ctx.fill();
        ctx.strokeStyle = 'rgba(60,210,100,.5)'; ctx.lineWidth = .8; ctx.stroke();
      }
    });
    [[40,116],[51,0],[40,-74],[35,139],[1,103],[-34,-58],[55,37],[-33,151],[19,-99]].forEach(([la, lo]) => {
      const p = ll2xy(la, lo, angle);
      if (p.z < 0) {
        const sx = cx + p.x, sy = cy - p.y;
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 5);
        g.addColorStop(0, 'rgba(255,225,80,.95)'); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI * 2); ctx.fill();
      }
    });
    const atm = ctx.createRadialGradient(cx, cy, R * .86, cx, cy, R + 7);
    atm.addColorStop(0, 'transparent');
    atm.addColorStop(.55, 'rgba(80,180,255,.1)');
    atm.addColorStop(1, 'rgba(80,180,255,.22)');
    ctx.fillStyle = atm; ctx.beginPath(); ctx.arc(cx, cy, R + 7, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,200,255,.4)'; ctx.lineWidth = 1.6; ctx.stroke();
    const sp = ctx.createRadialGradient(cx - R * .3, cy - R * .3, 0, cx - R * .3, cy - R * .3, R * .5);
    sp.addColorStop(0, 'rgba(255,255,255,.2)'); sp.addColorStop(1, 'transparent');
    ctx.fillStyle = sp;
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
    ctx.fillRect(0, 0, SIZE, SIZE); ctx.restore();
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ═══════════════════════════════════════════
   4. SKILL DECK — dengan animasi tutup (kartu kembali ke tumpukan)
═══════════════════════════════════════════ */
let fanOpen = false;
let isClosing = false;

function toggleFan() {
  if (isClosing) return;
  const fan   = document.getElementById('skillFan');
  const stack = document.getElementById('cardStack');
  const hint  = document.getElementById('stackHint');

  if (fanOpen) {
    /* ── TUTUP: animasi kartu kembali ke tumpukan ── */
    isClosing = true;

    // 1. Tutup panel konten dengan animasi
    const activeContent = document.querySelector('.skill-content.active');
    if (activeContent) {
      activeContent.classList.add('closing');
      activeContent.addEventListener('animationend', () => {
        activeContent.classList.remove('active', 'closing');
      }, { once: true });
    }

    // 2. Animasi kartu fan keluar (class closing)
    fan.classList.add('closing');

    // 3. Hapus active dari skill cards
    document.querySelectorAll('.skill-card').forEach(c => c.classList.remove('active'));

    // Total durasi animasi closing: 0.35s + delay max 0.20s = ~0.6s
    setTimeout(() => {
      fan.classList.remove('open', 'closing');
      if (stack) stack.style.opacity = '1';
      if (hint)  hint.textContent = '✦ KLIK UNTUK BUKA KARTU ✦';
      fanOpen   = false;
      isClosing = false;
    }, 620);

  } else {
    /* ── BUKA ── */
    fan.classList.add('open');
    if (stack) stack.style.opacity = '0';
    if (hint)  hint.textContent = '✦ KLIK UNTUK TUTUP KARTU ✦';
    openSkill(0, fan.querySelector('.skill-card'));
    fanOpen = true;
  }
}

function openSkill(index, element) {
  // Tutup panel yang sedang aktif (dengan animasi)
  const prev = document.querySelector('.skill-content.active');
  if (prev) {
    const id = prev.id;
    // Hanya animasikan jika beda panel
    if (id !== `skill-${index}`) {
      prev.classList.add('closing');
      prev.addEventListener('animationend', () => {
        prev.classList.remove('active', 'closing');
      }, { once: true });
    } else {
      return; // Klik kartu yang sama, tidak perlu buka ulang
    }
  }

  // Highlight kartu yang aktif
  document.querySelectorAll('.skill-card').forEach(c => c.classList.remove('active'));
  if (element) element.classList.add('active');

  // Buka panel baru (sedikit delay agar animasi close selesai duluan)
  setTimeout(() => {
    const target = document.getElementById(`skill-${index}`);
    if (target) {
      target.classList.remove('closing');
      target.classList.add('active');
    }
  }, prev && prev.id !== `skill-${index}` ? 180 : 0);
}

/* ═══════════════════════════════════════════
   5. MODAL — image only
═══════════════════════════════════════════ */
function openModal(cardElement) {
  const modal        = document.getElementById('mediaModal');
  const modalContent = document.getElementById('modalContent');
  const img          = cardElement.querySelector('.media-card-bg img');
  if (!img) return;

  const clone = img.cloneNode(true);
  clone.style.cssText = ''; // Reset inline style
  modalContent.innerHTML = '';
  modalContent.appendChild(clone);
  modal.classList.add('open');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('mediaModal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('open');
  }
  document.body.style.overflow = 'auto';
}

window.addEventListener('click', e => {
  const modal = document.getElementById('mediaModal');
  if (e.target === modal) closeModal();
});

/* ═══════════════════════════════════════════
   6. CONTACT
═══════════════════════════════════════════ */
function toggleContact(el) {
  const was = el.classList.contains('active');
  document.querySelectorAll('.contact-item').forEach(c => c.classList.remove('active'));
  if (!was) el.classList.add('active');
}
document.addEventListener('click', e => {
  if (!e.target.closest('.contact-item'))
    document.querySelectorAll('.contact-item').forEach(c => c.classList.remove('active'));
});

/* ═══════════════════════════════════════════
   7. VISITOR INTERACTION LOCK
   Semua event di luar area yang diizinkan diblokir
   Area diizinkan: .skill-card, .media-card, .contact-item, .modal-close, nav a
═══════════════════════════════════════════ */
document.addEventListener('click', function(e) {
  const allowed =
    e.target.closest('.skill-card')    ||  // klik skill card
    e.target.closest('.media-card')    ||  // klik media card (untuk modal)
    e.target.closest('.contact-item')  ||  // klik kontak
    e.target.closest('.modal-close')   ||  // tutup modal
    e.target.closest('.modal')         ||  // klik area modal (untuk tutup)
    e.target.closest('nav a')          ||  // navigasi
    e.target.closest('.card-stack')    ||  // klik tumpukan kartu
    e.target.closest('#stackHint');        // klik hint

  // Jika bukan area yang diizinkan, biarkan event berjalan (untuk scrolling dll)
  // tetapi jangan lakukan apapun yang mengubah konten
}, false);
