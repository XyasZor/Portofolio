// ==================== SISTEM ADMIN (COOKIE / LOCALSTORAGE PERMANEN) ====================
let isAdmin = false;
const ADMIN_CODE = "zodiczdividen123";
const STORAGE_KEY = "admin_token";

function checkAdminStatus() {
  const token = localStorage.getItem(STORAGE_KEY);
  if (token === ADMIN_CODE) {
    isAdmin = true;
    enableAdminFeatures();
  } else {
    isAdmin = false;
    disableAdminFeatures();
  }
}

function enableAdminFeatures() {
  // Tampilkan tombol edit profil
  const editBtn = document.getElementById('editProfileBtn');
  if (editBtn) editBtn.style.display = 'inline-block';
  // Foto profil bisa diklik untuk upload (hanya admin)
  const photoWrap = document.getElementById('profilePhotoWrap');
  if (photoWrap) {
    photoWrap.style.cursor = 'pointer';
    photoWrap.onclick = () => { if (isAdmin) document.getElementById('photoInput').click(); };
  }
  // Tampilkan semua tombol edit media card
  document.querySelectorAll('.edit-media-btn').forEach(btn => btn.style.display = 'flex');
}

function disableAdminFeatures() {
  const editBtn = document.getElementById('editProfileBtn');
  if (editBtn) editBtn.style.display = 'none';
  const photoWrap = document.getElementById('profilePhotoWrap');
  if (photoWrap) {
    photoWrap.style.cursor = 'default';
    photoWrap.onclick = null;
  }
  document.querySelectorAll('.edit-media-btn').forEach(btn => btn.style.display = 'none');
}

// Login admin via double-click pada PORT / FOLIO
function requestAdminAccess() {
  const code = prompt("Masukkan kode admin untuk mengedit website ini:", "");
  if (code === ADMIN_CODE) {
    localStorage.setItem(STORAGE_KEY, code);
    isAdmin = true;
    enableAdminFeatures();
    alert("Mode admin aktif. Anda sekarang dapat mengedit profil dan media card.\nKlik ganda pada PORT/FOLIO untuk menonaktifkan.");
    // Refresh data media agar tombol edit muncul
    renderAllMedia();
  } else if (code !== null && code !== "") {
    alert("Kode salah. Akses ditolak.");
  }
}

function logoutAdmin() {
  localStorage.removeItem(STORAGE_KEY);
  isAdmin = false;
  disableAdminFeatures();
  alert("Mode admin dinonaktifkan.");
  renderAllMedia(); // refresh untuk menyembunyikan tombol edit
}

// Event double-click pada PORT dan FOLIO
document.addEventListener('DOMContentLoaded', () => {
  const portElem = document.getElementById('adminTriggerPort');
  const folioElem = document.getElementById('adminTriggerFolio');
  function handleDoubleClick(e) {
    e.preventDefault();
    if (isAdmin) {
      if (confirm("Anda dalam mode admin. Ingin menonaktifkan mode admin?")) logoutAdmin();
    } else {
      requestAdminAccess();
    }
  }
  if (portElem) portElem.addEventListener('dblclick', handleDoubleClick);
  if (folioElem) folioElem.addEventListener('dblclick', handleDoubleClick);
  
  initAll();
});

// ==================== DATA MEDIA CARD (default & penyimpanan permanen) ====================
// ⚠️ PENTING: Naikkan versi ini setiap kali kamu update gambar/path di defaultMediaData
// Ini akan otomatis reset localStorage semua pengunjung agar gambar terbaru muncul
const DATA_VERSION = "1.2"; // dinaikkan agar localStorage lama auto-reset

const defaultMediaData = {
  0: [ // Gambar
    { src: "GD_1.jpg", note: "Sketsa digital ekspresif", type: "image" },
    { src: "GD_2.jpg", note: "Komposisi warna", type: "image" },
    { src: "GD_3.jpg", note: "Ilustrasi konseptual", type: "image" },
    { src: "GD_4.jpg", note: "Eksplorasi bentuk", type: "image" }
  ],
  1: [ // Menulis
    { src: "ILL_1.jpg", note: "Puisi visual", type: "image" },
    { src: "ILL_2.jpg", note: "Sketsa naratif", type: "image" },
    { src: "ILL_3.jpg", note: "Tipografi eksperimental", type: "image" },
    { src: "ILL_4.jpg", note: "Cerita pendek bergambar", type: "image" }
  ],
  2: [ // Cyber — placeholder, ganti via mode admin nanti
    { src: "GD_1.jpg", note: "Ganti via mode admin", type: "image" },
    { src: "GD_2.jpg", note: "Ganti via mode admin", type: "image" },
    { src: "ILL_1.jpg", note: "Ganti via mode admin", type: "image" },
    { src: "ILL_2.jpg", note: "Ganti via mode admin", type: "image" }
  ],
  3: [ // Photography — placeholder, ganti via mode admin nanti
    { src: "GD_3.jpg", note: "Ganti via mode admin", type: "image" },
    { src: "GD_4.jpg", note: "Ganti via mode admin", type: "image" },
    { src: "ILL_3.jpg", note: "Ganti via mode admin", type: "image" },
    { src: "ILL_4.jpg", note: "Ganti via mode admin", type: "image" }
  ],
  4: [ // Edukasi — placeholder, ganti via mode admin nanti
    { src: "GD_1.jpg", note: "Ganti via mode admin", type: "image" },
    { src: "ILL_1.jpg", note: "Ganti via mode admin", type: "image" },
    { src: "GD_3.jpg", note: "Ganti via mode admin", type: "image" },
    { src: "ILL_3.jpg", note: "Ganti via mode admin", type: "image" }
  ]
};

function loadMediaData() {
  const savedVersion = localStorage.getItem('media_data_version');
  const saved = localStorage.getItem('media_cards_data');

  // Jika versi cocok DAN ada data tersimpan → pakai localStorage
  if (saved && savedVersion === DATA_VERSION) {
    return JSON.parse(saved);
  }

  // Versi beda atau belum ada → reset ke defaultMediaData
  // Ini memastikan update path gambar di kode langsung berlaku
  localStorage.setItem('media_cards_data', JSON.stringify(defaultMediaData));
  localStorage.setItem('media_data_version', DATA_VERSION);
  return JSON.parse(JSON.stringify(defaultMediaData));
}

function saveMediaData(data) {
  localStorage.setItem('media_cards_data', JSON.stringify(data));
  localStorage.setItem('media_data_version', DATA_VERSION);
}

function renderAllMedia() {
  const mediaData = loadMediaData();
  for (let skillIdx = 0; skillIdx <= 4; skillIdx++) {
    const grid = document.getElementById(`mediaGrid${skillIdx}`);
    if (!grid) continue;
    grid.innerHTML = '';
    const cards = mediaData[skillIdx] || [];
    cards.forEach((card, cardIdx) => {
      const cardDiv = document.createElement('div');
      cardDiv.className = 'media-card';
      cardDiv.setAttribute('data-skill', skillIdx);
      cardDiv.setAttribute('data-card-idx', cardIdx);
      
      // Tombol edit (hanya tampil jika admin)
      const editBtn = document.createElement('div');
      editBtn.className = 'edit-media-btn';
      editBtn.innerHTML = '✏️';
      editBtn.title = 'Edit media (Admin only)';
      editBtn.style.display = isAdmin ? 'flex' : 'none';
      editBtn.onclick = (e) => {
        e.stopPropagation();
        if (isAdmin) editMediaCard(skillIdx, cardIdx);
      };
      
      const bgDiv = document.createElement('div');
      bgDiv.className = 'media-card-bg';
      if (card.type === 'video') {
        const video = document.createElement('video');
        video.controls = true;
        video.preload = 'metadata';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        const source = document.createElement('source');
        source.src = card.src;
        source.type = 'video/mp4';
        video.appendChild(source);
        video.onerror = () => { video.style.display = 'none'; bgDiv.innerHTML = '<div style="padding:20px;color:cyan;">Video tidak ditemukan</div>'; };
        bgDiv.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = card.src;
        img.alt = card.note;
        img.onerror = () => { img.src = 'https://placehold.co/400x300/0d2040/00e5ff?text=Gambar+Tidak+Tersedia'; };
        bgDiv.appendChild(img);
      }
      
      const noteDiv = document.createElement('div');
      noteDiv.className = 'media-card-note';
      noteDiv.innerText = card.note;
      
      cardDiv.appendChild(editBtn);
      cardDiv.appendChild(bgDiv);
      cardDiv.appendChild(noteDiv);
      
      // Event klik untuk membuka modal (public)
      cardDiv.addEventListener('click', (e) => {
        if (e.target === editBtn || editBtn.contains(e.target)) return;
        openModalFromCard(cardDiv, card);
      });
      grid.appendChild(cardDiv);
    });
  }
}

function editMediaCard(skillIdx, cardIdx) {
  const mediaData = loadMediaData();
  const card = mediaData[skillIdx][cardIdx];
  const newSrc = prompt("URL gambar/video:", card.src);
  if (newSrc !== null && newSrc !== '') card.src = newSrc;
  const newNote = prompt("Catatan deskripsi:", card.note);
  if (newNote !== null && newNote !== '') card.note = newNote;
  // Deteksi tipe
  if (card.src.match(/\.(mp4|webm|ogg)$/i)) card.type = 'video';
  else card.type = 'image';
  saveMediaData(mediaData);
  renderAllMedia();
  alert("Media card berhasil diperbarui!");
}

// ==================== MODAL & CATATAN SEMENTARA ====================
function openModalFromCard(cardElement, cardData) {
  const modal = document.getElementById('mediaModal');
  const modalContent = document.getElementById('modalContent');
  const savedNote = localStorage.getItem(`media_note_temp_${cardData.src}`) || cardData.note;
  modalContent.innerHTML = `
    <div class="modal-media"></div>
    <div class="modal-note-section">
      <label>📝 CATATAN KARYA</label>
      <textarea id="modalNoteInput" rows="3">${escapeHtml(savedNote)}</textarea>
      <div class="modal-actions"><button id="saveModalNoteBtn">💾 SIMPAN CATATAN</button></div>
    </div>
  `;
  const mediaContainer = modalContent.querySelector('.modal-media');
  if (cardData.type === 'video') {
    const video = document.createElement('video');
    video.controls = true;
    const source = document.createElement('source');
    source.src = cardData.src;
    source.type = 'video/mp4';
    video.appendChild(source);
    mediaContainer.appendChild(video);
  } else {
    const img = document.createElement('img');
    img.src = cardData.src;
    img.alt = cardData.note;
    mediaContainer.appendChild(img);
  }
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  const saveBtn = document.getElementById('saveModalNoteBtn');
  saveBtn.addEventListener('click', () => {
    const newNote = document.getElementById('modalNoteInput').value;
    localStorage.setItem(`media_note_temp_${cardData.src}`, newNote);
    const noteDiv = cardElement.querySelector('.media-card-note');
    if (noteDiv) noteDiv.innerText = newNote.length > 45 ? newNote.substring(0,42)+'...' : newNote;
    alert('Catatan tersimpan untuk sesi ini (hanya di browser Anda).');
  });
}

function closeModal() {
  const modal = document.getElementById('mediaModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

function escapeHtml(str) {
  return str.replace(/[&<>]/g, m => m==='&'?'&amp;':m==='<'?'&lt;':'&gt;');
}

// ==================== PROFIL ADMIN (permanen) ====================
function saveProfileData() {
  if (!isAdmin) return;
  const profile = {
    name: document.getElementById('profileName').innerText,
    age: document.getElementById('profileAge').innerText,
    place: document.getElementById('profilePlace').innerText,
    family: document.getElementById('profileFamily').innerText,
    title: document.getElementById('profileTitle').innerText,
    gender: document.getElementById('profileGender').innerText,
    school: document.getElementById('profileSchool').innerText
  };
  localStorage.setItem('profile_data', JSON.stringify(profile));
  const img = document.getElementById('profileImg');
  if (img.src && img.src !== '') localStorage.setItem('profile_photo', img.src);
}

function loadProfileData() {
  const saved = localStorage.getItem('profile_data');
  if (saved) {
    const data = JSON.parse(saved);
    document.getElementById('profileName').innerText = data.name;
    document.getElementById('profileAge').innerText = data.age;
    document.getElementById('profilePlace').innerText = data.place;
    document.getElementById('profileFamily').innerText = data.family;
    document.getElementById('profileTitle').innerText = data.title;
    document.getElementById('profileGender').innerText = data.gender;
    document.getElementById('profileSchool').innerText = data.school;
  }
  const savedPhoto = localStorage.getItem('profile_photo');
  if (savedPhoto && savedPhoto !== '') {
    document.getElementById('profileImg').src = savedPhoto;
    document.getElementById('profileImg').style.display = 'block';
    document.getElementById('photoPlaceholder').style.display = 'none';
  } else {
    document.getElementById('profileImg').style.display = 'none';
    document.getElementById('photoPlaceholder').style.display = 'flex';
  }
}

function editProfile() {
  if (!isAdmin) return;
  let val;
  if ((val = prompt("Nama:", document.getElementById('profileName').innerText))) document.getElementById('profileName').innerText = val;
  if ((val = prompt("Umur:", document.getElementById('profileAge').innerText))) document.getElementById('profileAge').innerText = val;
  if ((val = prompt("Tempat:", document.getElementById('profilePlace').innerText))) document.getElementById('profilePlace').innerText = val;
  if ((val = prompt("Marga:", document.getElementById('profileFamily').innerText))) document.getElementById('profileFamily').innerText = val;
  if ((val = prompt("Gelar:", document.getElementById('profileTitle').innerText))) document.getElementById('profileTitle').innerText = val;
  if ((val = prompt("Gender:", document.getElementById('profileGender').innerText))) document.getElementById('profileGender').innerText = val;
  if ((val = prompt("Sekolah:", document.getElementById('profileSchool').innerText))) document.getElementById('profileSchool').innerText = val;
  saveProfileData();
}

const photoInput = document.getElementById('photoInput');
photoInput.addEventListener('change', function(e) {
  if (!isAdmin) return;
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = ev => {
      document.getElementById('profileImg').src = ev.target.result;
      document.getElementById('profileImg').style.display = 'block';
      document.getElementById('photoPlaceholder').style.display = 'none';
      saveProfileData();
    };
    reader.readAsDataURL(file);
  } else alert("Hanya file gambar.");
});
document.getElementById('editProfileBtn').addEventListener('click', editProfile);

// ==================== PROTEKSI BERLAPIS ====================
// Nonaktifkan klik kanan
document.addEventListener('contextmenu', e => e.preventDefault());
// Nonaktifkan shortcut DevTools
document.addEventListener('keydown', function(e) {
  if (e.key === 'F12' || 
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
      (e.ctrlKey && (e.key === 'u' || e.key === 'U')) ||
      (e.ctrlKey && (e.key === 's' || e.key === 'S'))) {
    e.preventDefault();
    alert("Aksi dinonaktifkan untuk keamanan.");
    return false;
  }
});
// Deteksi DevTools
setInterval(() => {
  const before = new Date();
  debugger;
  const after = new Date();
  if (after - before > 100) {
    alert("DevTools terdeteksi! Beberapa fitur mungkin terbatas.");
  }
}, 2000);

// ==================== CANVAS & FITUR UTAMA ====================
// Background Canvas (Star Wave)
function initBackgroundCanvas() {
  const c = document.getElementById('bgCanvas');
  const ctx = c.getContext('2d');
  let W, H, stars = [], meteors = [];
  function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; buildStars(); }
  function buildStars() {
    stars = [];
    const n = Math.min(Math.floor(W * H / 1800), 700);
    for (let i = 0; i < n; i++) {
      const isBig = Math.random() < .08;
      stars.push({ x: Math.random() * W, y: Math.random() * H, r: isBig ? Math.random() * 2.8 + 1.2 : Math.random() * 1.4 + .3, a: Math.random() * .9 + .1, phase: Math.random() * Math.PI * 2, speed: Math.random() * .025 + .008, drift: Math.random() * .15 - .075, color: Math.random() < .12 ? '#f0c040' : Math.random() < .2 ? '#00e5ff' : Math.random() < .08 ? '#b060ff' : '#ffffff', twinkle: Math.random() < .4 });
    }
  }
  const blobs = [{ x: .18, y: .2, r: .38, hue: 210, a: .28 }, { x: .82, y: .35, r: .32, hue: 195, a: .22 }, { x: .5, y: .75, r: .42, hue: 220, a: .24 }, { x: .08, y: .65, r: .28, hue: 42, a: .18 }, { x: .92, y: .12, r: .25, hue: 38, a: .16 }, { x: .35, y: .5, r: .22, hue: 270, a: .14 }, { x: .65, y: .6, r: .2, hue: 330, a: .12 }, { x: .5, y: .15, r: .18, hue: 180, a: .15 }];
  let blobT = 0, t = 0;
  function frame() {
    t += .014; blobT += .004;
    ctx.clearRect(0, 0, W, H);
    const sky = ctx.createLinearGradient(0, 0, W * .25, H);
    sky.addColorStop(0, '#04091c'); sky.addColorStop(.3, '#071830'); sky.addColorStop(.6, '#0b2248'); sky.addColorStop(1, '#051220');
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
    for (let w = 0; w < 10; w++) {
      const yBase = H * (0.08 + w * .09);
      const amp = Math.min(90, Math.max(12, 18 + w * 9));
      const freq = .003 + w * .0014;
      const spd = .5 + w * .18;
      const bright = w % 3 === 0 ? .22 : w % 3 === 1 ? .18 : .12;
      const col = w % 4 === 0 ? `rgba(240,192,64,${bright})` : w % 4 === 1 ? `rgba(0,220,240,${bright * 1.1})` : w % 4 === 2 ? `rgba(120,80,255,${bright * .8})` : `rgba(255,80,140,${bright * .6})`;
      ctx.beginPath(); ctx.moveTo(0, yBase);
      for (let x = 0; x <= W; x += 3) {
        const y = yBase + Math.sin(x * freq + t * spd) * amp + Math.cos(x * freq * .55 + t * (spd * .65)) * amp * .38 + Math.sin(x * freq * .3 + t * (spd * .4)) * amp * .18;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = col; ctx.lineWidth = .8 + w * .12; ctx.stroke();
    }
    stars.forEach(s => {
      s.phase += s.speed;
      s.x += s.drift;
      if (s.x > W + 5) s.x = -5; if (s.x < -5) s.x = W + 5;
      const flicker = s.twinkle ? .5 + Math.abs(Math.sin(s.phase)) * 0.5 : s.a;
      ctx.globalAlpha = flicker;
      ctx.fillStyle = s.color;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      if (s.r > 1.6) {
        ctx.globalAlpha = flicker * .35;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2); ctx.fill();
      }
    });
    if (Math.random() < .004) meteors.push({ x: Math.random() * W, y: Math.random() * H * .3, vx: 9 + Math.random() * 6, vy: 4 + Math.random() * 4, life: 1, tail: [] });
    meteors = meteors.filter(m => {
      m.x += m.vx; m.y += m.vy; m.life -= .055;
      if (m.life <= 0) return false;
      m.tail.push({ x: m.x, y: m.y });
      if (m.tail.length > 16) m.tail.shift();
      m.tail.forEach((p, i) => {
        ctx.globalAlpha = (i / m.tail.length) * m.life * .7;
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(p.x, p.y, .9, 0, Math.PI * 2); ctx.fill();
      });
      return true;
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }
  window.addEventListener('resize', resize);
  resize(); frame();
}

// Nirvana Canvas
function initNirvanaCanvas() {
  const c = document.getElementById('nirvanaCanvas');
  const ctx = c.getContext('2d');
  let W, H;
  function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
  window.addEventListener('resize', resize); resize();
  const tris = [];
  for (let i = 0; i < 14; i++) {
    tris.push({ x: Math.random() * W, y: Math.random() * H, size: Math.random() * 60 + 20, rot: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - .5) * .012, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .3, col: Math.random() < .4 ? 'rgba(240,192,64,' : 'rgba(0,200,220,', a: Math.random() * .5 + .15, filled: Math.random() < .35 });
  }
  const cubes = [];
  for (let i = 0; i < 8; i++) {
    cubes.push({ x: Math.random() * W, y: Math.random() * H, sz: Math.random() * 50 + 18, rx: Math.random() * .02 - .01, ry: Math.random() * .018 - .009, rz: Math.random() * .015 - .0075, ax: Math.random() * Math.PI * 2, ay: Math.random() * Math.PI * 2, az: Math.random() * Math.PI * 2, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .25, col: Math.random() < .5 ? [0, 200, 220] : Math.random() < .5 ? [240, 192, 64] : [176, 96, 255], a: Math.random() * .45 + .12 });
  }
  function rotX(p, a) { return [p[0], p[1]*Math.cos(a)-p[2]*Math.sin(a), p[1]*Math.sin(a)+p[2]*Math.cos(a)]; }
  function rotY(p, a) { return [p[0]*Math.cos(a)+p[2]*Math.sin(a), p[1], -p[0]*Math.sin(a)+p[2]*Math.cos(a)]; }
  function rotZ(p, a) { return [p[0]*Math.cos(a)-p[1]*Math.sin(a), p[0]*Math.sin(a)+p[1]*Math.cos(a), p[2]]; }
  const cubeBase = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
  const cubeEdges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  function drawCube(cb) {
    const verts = cubeBase.map(v => { let p = [v[0]*cb.sz*.5, v[1]*cb.sz*.5, v[2]*cb.sz*.5]; p = rotX(p,cb.ax); p = rotY(p,cb.ay); p = rotZ(p,cb.az); return p; });
    ctx.strokeStyle = `rgba(${cb.col[0]},${cb.col[1]},${cb.col[2]},${cb.a})`;
    ctx.lineWidth = 1.1;
    cubeEdges.forEach(([a,b]) => { ctx.beginPath(); ctx.moveTo(cb.x+verts[a][0], cb.y+verts[a][1]); ctx.lineTo(cb.x+verts[b][0], cb.y+verts[b][1]); ctx.stroke(); });
  }
  function drawTri(tr) {
    const h = tr.size * Math.sqrt(3)/2;
    ctx.save(); ctx.translate(tr.x,tr.y); ctx.rotate(tr.rot);
    ctx.beginPath(); ctx.moveTo(0,-h*2/3); ctx.lineTo(tr.size/2,h/3); ctx.lineTo(-tr.size/2,h/3); ctx.closePath();
    if(tr.filled) ctx.fillStyle = tr.col + tr.a*.5 + ')', ctx.fill();
    ctx.strokeStyle = tr.col + tr.a + ')'; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.restore();
  }
  function frame() {
    ctx.clearRect(0,0,W,H);
    tris.forEach(tr => { tr.x+=tr.vx; tr.y+=tr.vy; tr.rot+=tr.rotSpeed; if(tr.x<-80) tr.x=W+80; if(tr.x>W+80) tr.x=-80; if(tr.y<-80) tr.y=H+80; if(tr.y>H+80) tr.y=-80; drawTri(tr); });
    cubes.forEach(cb => { cb.ax+=cb.rx; cb.ay+=cb.ry; cb.az+=cb.rz; cb.x+=cb.vx; cb.y+=cb.vy; if(cb.x<-80) cb.x=W+80; if(cb.x>W+80) cb.x=-80; if(cb.y<-80) cb.y=H+80; if(cb.y>H+80) cb.y=-80; drawCube(cb); });
    requestAnimationFrame(frame);
  }
  frame();
}

// Globe 3D
function initGlobe() {
  const canvas = document.getElementById('globeCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 200; canvas.height = 200;
  const R = canvas.width/2-4;
  let angle = 0;
  const continents = [[[.48,.3],[.52,.28],[.56,.32],[.58,.4],[.56,.52],[.52,.58],[.48,.56],[.44,.5],[.43,.4]],[[.46,.22],[.5,.2],[.54,.22],[.55,.28],[.52,.3],[.48,.3],[.45,.26]],[[.54,.15],[.62,.13],[.72,.18],[.78,.25],[.76,.32],[.68,.35],[.6,.3],[.56,.25]],[[.28,.18],[.32,.16],[.36,.2],[.38,.3],[.36,.42],[.3,.48],[.26,.4],[.24,.3],[.26,.22]],[[.3,.5],[.34,.48],[.36,.55],[.34,.65],[.3,.68],[.27,.6],[.27,.52]],[[.7,.52],[.76,.5],[.78,.56],[.74,.6],[.7,.58]]];
  function ll2xy(lat,lon,ang) {
    const phi = (90-lat)*Math.PI/180, theta = (lon+ang)*Math.PI/180;
    return {x:R*Math.sin(phi)*Math.cos(theta), y:R*Math.cos(phi), z:R*Math.sin(phi)*Math.sin(theta)};
  }
  function draw() {
    ctx.clearRect(0,0,200,200);
    const cx=100,cy=100;
    angle += 1.2;
    const dayShift = (Math.cos(angle*Math.PI/180)+1)/2;
    const grd = ctx.createLinearGradient(cx-R,cy,cx+R,cy);
    if(dayShift>.5) grd.addColorStop(0,'#001840'),grd.addColorStop(.38,'#001840'),grd.addColorStop(.52,'#1a6aab'),grd.addColorStop(.68,'#4db8e8'),grd.addColorStop(1,'#4db8e8');
    else grd.addColorStop(0,'#4db8e8'),grd.addColorStop(.32,'#4db8e8'),grd.addColorStop(.48,'#1a6aab'),grd.addColorStop(.62,'#001840'),grd.addColorStop(1,'#001840');
    ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.clip();
    ctx.fillStyle=grd; ctx.fillRect(0,0,200,200);
    for(let lat=-75;lat<=75;lat+=30){ ctx.beginPath(); let f=true; for(let lon=0;lon<=360;lon+=3){ const p=ll2xy(lat,lon,angle); if(p.z<0) continue; f?ctx.moveTo(cx+p.x,cy-p.y):ctx.lineTo(cx+p.x,cy-p.y); f=false; } ctx.strokeStyle='rgba(100,200,255,.12)'; ctx.lineWidth=.5; ctx.stroke(); }
    for(let lon=0;lon<360;lon+=30){ ctx.beginPath(); let f=true; for(let lat=-90;lat<=90;lat+=3){ const p=ll2xy(lat,lon,angle); if(p.z<0) continue; f?ctx.moveTo(cx+p.x,cy-p.y):ctx.lineTo(cx+p.x,cy-p.y); f=false; } ctx.stroke(); }
    continents.forEach(cont=>{ ctx.beginPath(); let st=false,ab=true; cont.forEach(([u,v])=>{ const lat=(1-v)*180-90, lon=u*360; const p=ll2xy(lat,lon,angle); if(p.z>0){ ab=false; const sx=cx+p.x, sy=cy-p.y; st?ctx.lineTo(sx,sy):ctx.moveTo(sx,sy); st=true; } }); if(!ab){ ctx.closePath(); ctx.fillStyle='rgba(30,160,80,.72)'; ctx.fill(); ctx.strokeStyle='rgba(60,210,100,.5)'; ctx.lineWidth=.8; ctx.stroke(); } });
    ctx.restore();
    ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.strokeStyle='rgba(0,200,255,.4)'; ctx.lineWidth=1.6; ctx.stroke();
    requestAnimationFrame(draw);
  }
  draw();
}

// Skill Deck (Fan & merge)
function initSkillDeck() {
  let fanOpen = false;
  const fanDiv = document.getElementById('skillFan');
  const stackDiv = document.getElementById('cardStack');
  const hintSpan = document.getElementById('stackHint');
  window.toggleFan = function() {
    if (fanOpen) {
      const activeContent = document.querySelector('.skill-content.active');
      if (activeContent) {
        activeContent.classList.add('tv-off');
        activeContent.addEventListener('animationend', function onTvEnd() {
          activeContent.classList.remove('tv-off', 'active');
          activeContent.removeEventListener('animationend', onTvEnd);
          startFanCloseMerge();
        });
      } else startFanCloseMerge();
    } else {
      fanDiv.classList.add('open');
      if(stackDiv) stackDiv.style.opacity = '0';
      if(hintSpan) hintSpan.textContent = '✦ KLIK UNTUK TUTUP KARTU ✦';
      openSkill(0);
      fanOpen = true;
    }
  };
  function startFanCloseMerge() {
    if(!fanDiv.classList.contains('open')) return;
    fanDiv.classList.add('closing-fan');
    setTimeout(() => {
      fanDiv.classList.remove('open','closing-fan');
      if(stackDiv) stackDiv.style.opacity = '1';
      if(hintSpan) hintSpan.textContent = '✦ KLIK UNTUK BUKA KARTU ✦';
      fanOpen = false;
      document.querySelectorAll('.skill-content').forEach(p => p.classList.remove('active'));
    }, 450);
  }
  window.openSkill = function(index, element) {
    document.querySelectorAll('.skill-content').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`skill-${index}`);
    if(target) target.classList.add('active');
    document.querySelectorAll('.skill-card').forEach(c => c.classList.remove('active'));
    if(element) element.classList.add('active');
    else { const activeCard = document.querySelector(`.skill-card[data-skill-index="${index}"]`); if(activeCard) activeCard.classList.add('active'); }
  };
  document.querySelectorAll('.skill-card').forEach(card => {
    const idx = card.getAttribute('data-skill-index');
    if(idx !== null) card.addEventListener('click', (e) => { e.stopPropagation(); if(fanOpen) openSkill(parseInt(idx), card); });
  });
}

// Contact toggle
function initContactToggle() {
  window.toggleContact = function(el) {
    const was = el.classList.contains('active');
    document.querySelectorAll('.contact-item').forEach(c => c.classList.remove('active'));
    if (!was) el.classList.add('active');
  };
  document.addEventListener('click', e => {
    if (!e.target.closest('.contact-item')) {
      document.querySelectorAll('.contact-item').forEach(c => c.classList.remove('active'));
    }
  });
}

// ==================== INISIALISASI SEMUA ====================
function initAll() {
  checkAdminStatus(); // ← Restore status admin dari localStorage saat load
  loadProfileData();
  renderAllMedia();
  initBackgroundCanvas();
  initNirvanaCanvas();
  initGlobe();
  initSkillDeck();
  initContactToggle();
  window.closeModal = closeModal;
}