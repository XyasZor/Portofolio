// Data default
const defaultProfile = {
  name: 'Fakih Aditya Rahman',
  age: '15 Tahun',
  place: 'Limus Pratama Regency',
  family: 'Adzmatkhan',
  title: 'Raden & Dzurriyat',
  gender: 'Laki-laki',
  school: 'SMK & MTS AL MUHTADIN'
};
const defaultMedia = {
  0: [
    { src: 'GD_1.jpg', note: 'Sketsa digital ekspresif', type: 'image' },
    { src: 'GD_2.jpg', note: 'Komposisi warna', type: 'image' },
    { src: 'videos/GD_VID.mp4', note: 'Proses kreatif (video)', type: 'video' },
    { src: 'GD_3.jpg', note: 'Ilustrasi konseptual', type: 'image' },
    { src: 'GD_4.jpg', note: 'Eksplorasi bentuk', type: 'image' },
    { src: 'GD_5.jpg', note: 'Lukisan digital lanjutan', type: 'image' }
  ],
  1: [
    { src: 'ILL_1.jpg', note: 'Puisi visual', type: 'image' },
    { src: 'ILL_2.jpg', note: 'Sketsa naratif', type: 'image' },
    { src: 'videos/ILL_VID.mp4', note: 'Behind the words (video)', type: 'video' },
    { src: 'ILL_3.jpg', note: 'Tipografi eksperimental', type: 'image' },
    { src: 'ILL_4.jpg', note: 'Cerita pendek bergambar', type: 'image' },
    { src: 'ILL_5.jpg', note: 'Komik strip', type: 'image' }
  ],
  2: [
    { src: 'UI_1.jpg', note: 'Desain antarmuka', type: 'image' },
    { src: 'UI_2.jpg', note: 'User flow', type: 'image' },
    { src: 'videos/UI_VID.mp4', note: 'Demo interaksi (video)', type: 'video' },
    { src: 'UI_3.jpg', note: 'Arsitektur informasi', type: 'image' },
    { src: 'UI_4.jpg', note: 'Animasi UI', type: 'image' },
    { src: 'UI_5.jpg', note: 'Sistem desain', type: 'image' }
  ],
  3: [
    { src: 'PH_1.jpg', note: 'Komposisi cahaya', type: 'image' },
    { src: 'PH_2.jpg', note: 'Potret dinamis', type: 'image' },
    { src: 'videos/PH_VID.mp4', note: 'BTS shooting (video)', type: 'video' },
    { src: 'PH_3.jpg', note: 'Ekspresi visual', type: 'image' },
    { src: 'PH_4.jpg', note: 'Arsitektur modern', type: 'image' },
    { src: 'PH_5.jpg', note: 'Street photography', type: 'image' }
  ],
  4: [
    { src: 'BR_1.jpg', note: 'Identitas merek', type: 'image' },
    { src: 'BR_2.jpg', note: 'Kemasan & mockup', type: 'image' },
    { src: 'videos/BR_VID.mp4', note: 'Presentasi brand (video)', type: 'video' },
    { src: 'BR_3.jpg', note: 'Panduan visual', type: 'image' },
    { src: 'BR_4.jpg', note: 'Poster edukasi', type: 'image' },
    { src: 'BR_5.jpg', note: 'Infografis interaktif', type: 'image' }
  ]
};

function loadProfileData() {
  let profile = localStorage.getItem('profile_data');
  if (!profile) {
    localStorage.setItem('profile_data', JSON.stringify(defaultProfile));
    return defaultProfile;
  }
  return JSON.parse(profile);
}

function loadMediaData() {
  let media = localStorage.getItem('media_data');
  if (!media) {
    localStorage.setItem('media_data', JSON.stringify(defaultMedia));
    return defaultMedia;
  }
  return JSON.parse(media);
}

function renderProfile() {
  const profile = loadProfileData();
  const container = document.getElementById('profileContainer');
  if (container) {
    container.innerHTML = `
      <div class="info-row"><span class="info-label">Nama</span><span class="info-value">${escapeHtml(profile.name)}</span></div>
      <div class="info-row"><span class="info-label">Umur</span><span class="info-value">${escapeHtml(profile.age)}</span></div>
      <div class="info-row"><span class="info-label">Tempat</span><span class="info-value">${escapeHtml(profile.place)}</span></div>
      <div class="info-row"><span class="info-label">Marga</span><span class="info-value">${escapeHtml(profile.family)}</span></div>
      <div class="info-row"><span class="info-label">Gelar</span><span class="info-value">${escapeHtml(profile.title)}</span></div>
      <div class="info-row"><span class="info-label">Gender</span><span class="info-value">${escapeHtml(profile.gender)}</span></div>
      <div class="info-row"><span class="info-label">Sekolah</span><span class="info-value">${escapeHtml(profile.school)}</span></div>
    `;
  }
  const photo = localStorage.getItem('profile_photo');
  const img = document.getElementById('profileImg');
  const placeholder = document.getElementById('photoPlaceholder');
  if (photo && img) {
    img.src = photo;
    img.style.display = 'block';
    if (placeholder) placeholder.style.display = 'none';
  } else {
    if (img) img.style.display = 'none';
    if (placeholder) placeholder.style.display = 'flex';
  }
}

function renderMediaCards() {
  const media = loadMediaData();
  for (let skill = 0; skill <= 4; skill++) {
    const grid = document.getElementById(`mediaGrid${skill}`);
    if (!grid) continue;
    grid.innerHTML = '';
    if (!media[skill]) continue;
    media[skill].forEach((card, idx) => {
      const cardDiv = document.createElement('div');
      cardDiv.className = 'media-card';
      const bgDiv = document.createElement('div');
      bgDiv.className = 'media-card-bg';
      if (card.type === 'video') {
        const vid = document.createElement('video');
        vid.controls = true;
        vid.src = card.src;
        vid.style.width = '100%';
        vid.style.height = '100%';
        vid.style.objectFit = 'cover';
        bgDiv.appendChild(vid);
      } else {
        const img = document.createElement('img');
        img.src = card.src;
        img.alt = card.note;
        img.onerror = () => img.src = 'https://placehold.co/400x300/0d2040/00e5ff?text=No+Image';
        bgDiv.appendChild(img);
      }
      const noteDiv = document.createElement('div');
      noteDiv.className = 'media-card-note';
      noteDiv.innerText = card.note;
      cardDiv.appendChild(bgDiv);
      cardDiv.appendChild(noteDiv);
      grid.appendChild(cardDiv);
    });
  }
}

let fanOpen = false;
function toggleFan() {
  const fan = document.getElementById('skillFan');
  const stack = document.getElementById('cardStack');
  const hint = document.getElementById('stackHint');
  if (fanOpen) {
    fan.classList.remove('open');
    if (stack) stack.style.opacity = '1';
    if (hint) hint.textContent = '✦ KLIK UNTUK BUKA KARTU ✦';
    document.querySelectorAll('.skill-content').forEach(p => p.classList.remove('active'));
    fanOpen = false;
  } else {
    fan.classList.add('open');
    if (stack) stack.style.opacity = '0';
    if (hint) hint.textContent = '✦ KLIK UNTUK TUTUP KARTU ✦';
    openSkill(0);
    fanOpen = true;
  }
}
function openSkill(index) {
  document.querySelectorAll('.skill-content').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`skill-${index}`);
  if (target) target.classList.add('active');
}
document.querySelectorAll('.skill-card').forEach(card => {
  const idx = card.getAttribute('data-skill-index');
  if (idx !== null) {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      if (fanOpen) openSkill(parseInt(idx));
    });
  }
});

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

function openModal(card) {
  const modal = document.getElementById('mediaModal');
  const modalContent = document.getElementById('modalContent');
  const savedNote = localStorage.getItem(`note_${card.src}`) || card.note;
  modalContent.innerHTML = `
    <div class="modal-media"></div>
    <div class="modal-note-section">
      <label>📝 CATATAN KARYA</label>
      <textarea id="modalNoteInput" rows="3">${escapeHtml(savedNote)}</textarea>
      <div class="modal-actions"><button id="saveModalNoteBtn">💾 SIMPAN CATATAN (lokal)</button></div>
    </div>
  `;
  const mediaContainer = modalContent.querySelector('.modal-media');
  if (card.type === 'video') {
    const vid = document.createElement('video');
    vid.controls = true;
    vid.src = card.src;
    mediaContainer.appendChild(vid);
  } else {
    const img = document.createElement('img');
    img.src = card.src;
    mediaContainer.appendChild(img);
  }
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  document.getElementById('saveModalNoteBtn').onclick = () => {
    const newNote = document.getElementById('modalNoteInput').value;
    localStorage.setItem(`note_${card.src}`, newNote);
    alert('Catatan tersimpan di browser Anda.');
  };
}
window.closeModal = function() {
  const modal = document.getElementById('mediaModal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = 'auto';
};
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;');
}

function initBackgroundCanvas() {
  const c = document.getElementById('bgCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  let W, H;
  function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
  function draw() {
    if (!ctx) return;
    ctx.fillStyle = '#060f20';
    ctx.fillRect(0, 0, W, H);
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  resize();
  draw();
}
function initNirvanaCanvas() {}
function initGlobe() {
  const canvas = document.getElementById('globeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 200; canvas.height = 200;
  ctx.fillStyle = '#00e5ff';
  ctx.beginPath();
  ctx.arc(100, 100, 90, 0, Math.PI * 2);
  ctx.fill();
}

document.addEventListener('DOMContentLoaded', () => {
  renderProfile();
  renderMediaCards();
  initBackgroundCanvas();
  initNirvanaCanvas();
  initGlobe();
});
