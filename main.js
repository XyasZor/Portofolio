// ========== KODE RAHASIA UNTUK ADMIN ==========
const ADMIN_CODE = 'zodiczdividen123';
let isAdmin = false;

// Cek apakah admin sudah login sebelumnya
function checkAdmin() {
    const saved = localStorage.getItem('admin_token');
    if (saved === ADMIN_CODE) {
        isAdmin = true;
        enableAdminMode();
    }
}

function enableAdminMode() {
    const editBtn = document.getElementById('editProfileBtn');
    if (editBtn) editBtn.style.display = 'inline-block';
    const photoWrap = document.getElementById('profilePhotoWrap');
    if (photoWrap) {
        photoWrap.style.cursor = 'pointer';
        photoWrap.onclick = () => {
            if (isAdmin) editProfilePhoto();
        };
    }
    addEditButtonsToMediaCards();
}

function addEditButtonsToMediaCards() {
    if (!isAdmin) return;
    document.querySelectorAll('.media-card').forEach(card => {
        if (card.querySelector('.edit-media-btn')) return;
        const editBtn = document.createElement('div');
        editBtn.className = 'edit-media-btn';
        editBtn.innerHTML = '✏️';
        editBtn.style.cssText = 'position:absolute; top:8px; right:8px; background:rgba(0,0,0,0.7); border:1px solid gold; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:10; font-size:14px;';
        editBtn.onclick = (e) => {
            e.stopPropagation();
            const cardDiv = e.target.closest('.media-card');
            const skillIdx = parseInt(cardDiv.closest('.skill-content').id.split('-')[1]);
            const cardIdx = Array.from(cardDiv.parentNode.children).indexOf(cardDiv);
            editMediaCard(skillIdx, cardIdx);
        };
        card.style.position = 'relative';
        card.appendChild(editBtn);
    });
}

// Fungsi untuk mengaktifkan mode admin via double-click pada PORT/FOLIO
function requestAdmin() {
    const code = prompt('Masukkan kode admin untuk mengedit website:');
    if (code === ADMIN_CODE) {
        localStorage.setItem('admin_token', code);
        isAdmin = true;
        enableAdminMode();
        alert('Mode admin aktif. Anda bisa edit profil dan media card.');
        renderProfile(); // refresh tombol edit profil
        renderMediaCards(); // refresh media card dengan tombol edit
    } else if (code !== null) {
        alert('Kode salah.');
    }
}

// Event untuk double-click pada PORT dan FOLIO
document.addEventListener('DOMContentLoaded', () => {
    const portEl = document.querySelector('.title-port');
    const folioEl = document.querySelector('.title-folio');
    if (portEl) portEl.addEventListener('dblclick', requestAdmin);
    if (folioEl) folioEl.addEventListener('dblclick', requestAdmin);
});

// ========== DATA DEFAULT ==========
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

// Load/save dari localStorage
function loadProfileData() {
    const stored = localStorage.getItem('profile_data');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('profile_data', JSON.stringify(defaultProfile));
    return { ...defaultProfile };
}

function loadMediaData() {
    const stored = localStorage.getItem('media_data');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('media_data', JSON.stringify(defaultMedia));
    return JSON.parse(JSON.stringify(defaultMedia));
}

function saveProfile(profile) {
    localStorage.setItem('profile_data', JSON.stringify(profile));
}

function saveMedia(media) {
    localStorage.setItem('media_data', JSON.stringify(media));
}

// Render profil ke HTML
function renderProfile() {
    const profile = loadProfileData();
    document.getElementById('profileName').innerText = profile.name;
    document.getElementById('profileAge').innerText = profile.age;
    document.getElementById('profilePlace').innerText = profile.place;
    document.getElementById('profileFamily').innerText = profile.family;
    document.getElementById('profileTitle').innerText = profile.title;
    document.getElementById('profileGender').innerText = profile.gender;
    document.getElementById('profileSchool').innerText = profile.school;

    const storedPhoto = localStorage.getItem('profile_photo');
    const img = document.getElementById('profileImg');
    const placeholder = document.getElementById('photoPlaceholder');
    if (storedPhoto && img) {
        img.src = storedPhoto;
        img.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
    } else {
        if (img) img.style.display = 'none';
        if (placeholder) placeholder.style.display = 'flex';
    }
}

// Render media cards
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
                vid.style.width = '100%'; vid.style.height = '100%'; vid.style.objectFit = 'cover';
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
    if (isAdmin) addEditButtonsToMediaCards();
}

// Edit profil (hanya admin)
function editProfile() {
    if (!isAdmin) return;
    const profile = loadProfileData();
    const newName = prompt('Nama:', profile.name);
    if (newName) profile.name = newName;
    const newAge = prompt('Umur:', profile.age);
    if (newAge) profile.age = newAge;
    const newPlace = prompt('Tempat:', profile.place);
    if (newPlace) profile.place = newPlace;
    const newFamily = prompt('Marga:', profile.family);
    if (newFamily) profile.family = newFamily;
    const newTitle = prompt('Gelar:', profile.title);
    if (newTitle) profile.title = newTitle;
    const newGender = prompt('Gender:', profile.gender);
    if (newGender) profile.gender = newGender;
    const newSchool = prompt('Sekolah:', profile.school);
    if (newSchool) profile.school = newSchool;
    saveProfile(profile);
    renderProfile();
}

// Edit foto profil (panggil URL, bukan upload file)
function editProfilePhoto() {
    if (!isAdmin) return;
    const url = prompt('Masukkan URL gambar (jpg/png):', localStorage.getItem('profile_photo') || '');
    if (url && url.trim() !== '') {
        localStorage.setItem('profile_photo', url);
        renderProfile();
        alert('Foto profil diperbarui.');
    } else if (url === '') {
        localStorage.removeItem('profile_photo');
        renderProfile();
        alert('Foto profil dihapus.');
    }
}

// Edit media card (hanya admin)
function editMediaCard(skillIdx, cardIdx) {
    const media = loadMediaData();
    const card = media[skillIdx][cardIdx];
    const newSrc = prompt('URL gambar/video:', card.src);
    if (newSrc !== null) card.src = newSrc;
    const newNote = prompt('Catatan:', card.note);
    if (newNote !== null) card.note = newNote;
    let newType = 'image';
    if (card.src.match(/\.(mp4|webm|ogg)$/i)) newType = 'video';
    else newType = 'image';
    card.type = newType;
    saveMedia(media);
    renderMediaCards();
}

// ========== SKILL FAN (sama seperti sebelumnya) ==========
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

// ========== MODAL CATATAN (publik) ==========
function openModal(cardElement) {
    const mediaElem = cardElement.querySelector('.media-card-bg img, .media-card-bg video');
    if (!mediaElem) return;
    const src = mediaElem.src || (mediaElem.querySelector('source')?.src);
    const noteElem = cardElement.querySelector('.media-card-note');
    const defaultNote = noteElem ? noteElem.innerText : '';
    const modal = document.getElementById('mediaModal');
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <div class="modal-media"></div>
        <div class="modal-note-section">
            <label>📝 CATATAN KARYA</label>
            <textarea id="modalNoteInput" rows="3">${escapeHtml(defaultNote)}</textarea>
            <div class="modal-actions"><button id="saveModalNoteBtn">💾 SIMPAN CATATAN (lokal)</button></div>
        </div>
    `;
    const mediaContainer = modalContent.querySelector('.modal-media');
    const clone = mediaElem.cloneNode(true);
    if (clone.tagName === 'VIDEO') clone.setAttribute('controls', 'true');
    mediaContainer.appendChild(clone);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.getElementById('saveModalNoteBtn').onclick = () => {
        const newNote = document.getElementById('modalNoteInput').value;
        const noteDiv = cardElement.querySelector('.media-card-note');
        if (noteDiv) noteDiv.innerText = newNote;
        localStorage.setItem(`note_${src}`, newNote);
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

// ========== CONTACT TOGGLE ==========
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

// ========== CANVAS SEDERHANA (sama seperti sebelumnya) ==========
function initBackgroundCanvas() {
    const c = document.getElementById('bgCanvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    let W, H;
    function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; draw(); }
    function draw() {
        if (!ctx) return;
        ctx.fillStyle = '#060f20';
        ctx.fillRect(0, 0, W, H);
        requestAnimationFrame(draw);
    }
    window.addEventListener('resize', resize);
    resize();
}

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

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
    checkAdmin();
    renderProfile();
    renderMediaCards();
    initBackgroundCanvas();
    initGlobe();
    document.getElementById('editProfileBtn').addEventListener('click', editProfile);
    // Event untuk membuka modal saat klik media card (kecuali tombol edit)
    document.body.addEventListener('click', (e) => {
        const card = e.target.closest('.media-card');
        if (card && !e.target.closest('.edit-media-btn')) {
            openModal(card);
        }
    });
});
