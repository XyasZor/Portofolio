// ========== SISTEM ADMIN (kode rahasia) ==========
let isAdmin = false;
const ADMIN_CODE = 'zodiczdividen123';

// Cek apakah admin sudah login sebelumnya
function checkAdmin() {
    const saved = localStorage.getItem('admin_token');
    if (saved === ADMIN_CODE) {
        isAdmin = true;
        enableAdminFeatures();
    }
}

function enableAdminFeatures() {
    // Foto profil bisa diklik untuk upload (hanya admin)
    const photoWrap = document.querySelector('.profile-photo-wrap');
    if (photoWrap) {
        photoWrap.style.cursor = 'pointer';
        photoWrap.onclick = () => document.getElementById('photoInput').click();
    }
    // Tambahkan tombol edit pada setiap media card
    document.querySelectorAll('.media-card').forEach(card => {
        if (card.querySelector('.edit-media-btn')) return;
        const editBtn = document.createElement('div');
        editBtn.className = 'edit-media-btn';
        editBtn.innerHTML = '✏️';
        editBtn.style.cssText = 'position:absolute; top:5px; right:5px; background:rgba(0,0,0,0.6); border:1px solid gold; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:10; font-size:14px;';
        editBtn.onclick = (e) => {
            e.stopPropagation();
            const cardDiv = e.target.closest('.media-card');
            const skillElem = cardDiv.closest('.skill-content');
            const skillIdx = parseInt(skillElem.id.split('-')[1]);
            const cardIdx = Array.from(cardDiv.parentNode.children).indexOf(cardDiv);
            editMediaCard(skillIdx, cardIdx);
        };
        card.style.position = 'relative';
        card.appendChild(editBtn);
    });
    alert('Mode admin aktif. Klik foto profil untuk upload, dan tombol pensil pada media card untuk edit.');
}

// Fungsi untuk mengaktifkan admin via double-click pada "PORT" atau "FOLIO"
function requestAdmin() {
    const code = prompt('Masukkan kode admin:');
    if (code === ADMIN_CODE) {
        localStorage.setItem('admin_token', code);
        isAdmin = true;
        enableAdminFeatures();
        // Refresh data profile & media (untuk memuat tombol edit)
        loadProfileDataToDom();
        renderMediaCards();
    } else if (code !== null) {
        alert('Kode salah.');
    }
}

// Event double-click pada PORT dan FOLIO
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

// ========== LOCALSTORAGE ==========
function loadProfile() {
    let profile = localStorage.getItem('profile_data');
    if (!profile) {
        localStorage.setItem('profile_data', JSON.stringify(defaultProfile));
        return defaultProfile;
    }
    return JSON.parse(profile);
}

function saveProfile(profile) {
    localStorage.setItem('profile_data', JSON.stringify(profile));
}

function loadMedia() {
    let media = localStorage.getItem('media_data');
    if (!media) {
        localStorage.setItem('media_data', JSON.stringify(defaultMedia));
        return JSON.parse(JSON.stringify(defaultMedia));
    }
    return JSON.parse(media);
}

function saveMedia(media) {
    localStorage.setItem('media_data', JSON.stringify(media));
}

// ========== RENDER KE DOM ==========
function loadProfileDataToDom() {
    const profile = loadProfile();
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
        placeholder.style.display = 'none';
    } else {
        img.style.display = 'none';
        placeholder.style.display = 'flex';
    }
}

function renderMediaCards() {
    const media = loadMedia();
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
    if (isAdmin) enableAdminFeatures(); // tambahkan tombol edit jika admin
}

// ========== EDIT DATA (hanya admin) ==========
function editProfile() {
    if (!isAdmin) return;
    const profile = loadProfile();
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
    loadProfileDataToDom();
}

function editMediaCard(skillIdx, cardIdx) {
    const media = loadMedia();
    const card = media[skillIdx][cardIdx];
    const newSrc = prompt('URL gambar/video:', card.src);
    if (newSrc !== null) card.src = newSrc;
    const newNote = prompt('Catatan:', card.note);
    if (newNote !== null) card.note = newNote;
    let newType = 'image';
    if (card.src.match(/\.(mp4|webm|ogg)$/i)) newType = 'video';
    card.type = newType;
    saveMedia(media);
    renderMediaCards();
}

// ========== UPLOAD FOTO PROFIL (admin) ==========
const photoInput = document.getElementById('photoInput');
if (photoInput) {
    photoInput.addEventListener('change', function(e) {
        if (!isAdmin) return;
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                localStorage.setItem('profile_photo', ev.target.result);
                loadProfileDataToDom();
                alert('Foto profil tersimpan.');
            };
            reader.readAsDataURL(file);
        } else alert('Hanya file gambar.');
    });
}

// ========== SKILL FAN ==========
let fanOpen = false;
function toggleFan() {
    const fan = document.getElementById('skillFan');
    const stack = document.getElementById('cardStack');
    const hint = document.getElementById('stackHint');
    if (fanOpen) {
        fan.classList.remove('open');
        stack.style.opacity = '1';
        hint.textContent = '✦ KLIK UNTUK BUKA KARTU ✦';
        document.querySelectorAll('.skill-content').forEach(p => p.classList.remove('active'));
        fanOpen = false;
    } else {
        fan.classList.add('open');
        stack.style.opacity = '0';
        hint.textContent = '✦ KLIK UNTUK TUTUP KARTU ✦';
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

// ========== MODAL ==========
function openModal(cardElement) {
    const mediaElem = cardElement.querySelector('.media-card-bg img, .media-card-bg video');
    if (!mediaElem) return;
    const noteElem = cardElement.querySelector('.media-card-note');
    const defaultNote = noteElem ? noteElem.innerText : '';
    const src = mediaElem.src || (mediaElem.querySelector('source')?.src);
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
    modal.style.display = 'none';
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

// ========== CANVAS (dari kode asli) ==========
(function(){
    const c=document.getElementById('bgCanvas');
    const ctx=c.getContext('2d');
    let W,H,stars=[],meteors=[];
    function resize(){ W=c.width=window.innerWidth; H=c.height=window.innerHeight; buildStars(); }
    function buildStars(){
        stars=[];
        const n=Math.min(Math.floor(W*H/1800),700);
        for(let i=0;i<n;i++){
            const isBig=Math.random()<.08;
            stars.push({
                x:Math.random()*W, y:Math.random()*H,
                r:isBig?Math.random()*2.8+1.2:Math.random()*1.4+.3,
                a:Math.random()*.9+.1,
                phase:Math.random()*Math.PI*2,
                speed:Math.random()*.025+.008,
                drift:Math.random()*.15-.075,
                color:Math.random()<.12?'#f0c040':Math.random()<.2?'#00e5ff':Math.random()<.08?'#b060ff':'#ffffff',
                twinkle:Math.random()<.4,
            });
        }
    }
    const blobs=[
        {x:.18,y:.2,r:.38,hue:210,a:.28},{x:.82,y:.35,r:.32,hue:195,a:.22},
        {x:.5,y:.75,r:.42,hue:220,a:.24},{x:.08,y:.65,r:.28,hue:42,a:.18},
        {x:.92,y:.12,r:.25,hue:38,a:.16},{x:.35,y:.5,r:.22,hue:270,a:.14},
        {x:.65,y:.6,r:.2,hue:330,a:.12},{x:.5,y:.15,r:.18,hue:180,a:.15},
    ];
    let blobT=0, t=0;
    function frame(){
        t+=.014; blobT+=.004;
        ctx.clearRect(0,0,W,H);
        const sky=ctx.createLinearGradient(0,0,W*.25,H);
        sky.addColorStop(0,'#04091c'); sky.addColorStop(.3,'#071830'); sky.addColorStop(.6,'#0b2248'); sky.addColorStop(1,'#051220');
        ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);
        blobs.forEach((b,i)=>{
            const px=b.x*W+Math.sin(blobT+i)*W*.015;
            const py=b.y*H+Math.cos(blobT*.7+i)*H*.01;
            const gr=ctx.createRadialGradient(px,py,0,px,py,b.r*Math.min(W,H));
            gr.addColorStop(0,`hsla(${b.hue},85%,60%,${b.a})`);
            gr.addColorStop(.5,`hsla(${b.hue},70%,50%,${b.a*.4})`);
            gr.addColorStop(1,'transparent');
            ctx.fillStyle=gr; ctx.fillRect(0,0,W,H);
        });
        const cx2=W*.5, cy2=H*.3;
        const pulse=.18+Math.sin(t*.8)*.06;
        const gr2=ctx.createRadialGradient(cx2,cy2,0,cx2,cy2,W*.5);
        gr2.addColorStop(0,`rgba(0,120,220,${pulse})`);
        gr2.addColorStop(.5,`rgba(0,80,160,${pulse*.4})`);
        gr2.addColorStop(1,'transparent');
        ctx.fillStyle=gr2; ctx.fillRect(0,0,W,H);
        const streams=10;
        for(let w=0;w<streams;w++){
            const yBase=H*(0.08+w*.09);
            const amp=Math.min(90,Math.max(12,18+w*9));
            const freq=.003+w*.0014;
            const spd=.5+w*.18;
            const bright=w%3===0?.22:w%3===1?.18:.12;
            const col=w%4===0?`rgba(240,192,64,${bright})`:
                       w%4===1?`rgba(0,220,240,${bright*1.1})`:
                       w%4===2?`rgba(120,80,255,${bright*.8})`:`rgba(255,80,140,${bright*.6})`;
            ctx.beginPath(); ctx.moveTo(0,yBase);
            for(let x=0;x<=W;x+=3){
                const y=yBase
                  +Math.sin(x*freq+t*spd)*amp
                  +Math.cos(x*freq*.55+t*(spd*.65))*amp*.38
                  +Math.sin(x*freq*.3+t*(spd*.4))*amp*.18;
                ctx.lineTo(x,y);
            }
            ctx.strokeStyle=col; ctx.lineWidth=.8+w*.12; ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0,yBase+8);
            for(let x=0;x<=W;x+=6){
                const y=yBase+8+Math.sin(x*freq*.8+t*spd*.6+1.2)*amp*.6;
                ctx.lineTo(x,y);
            }
            ctx.strokeStyle=col.replace(/[\d.]+\)$/,`${bright*.35})`);
            ctx.lineWidth=.5; ctx.stroke();
        }
        stars.forEach(s=>{
            s.phase+=s.speed;
            s.x+=s.drift;
            if(s.x>W+5)s.x=-5; if(s.x<-5)s.x=W+5;
            const flicker=s.twinkle?.5+Math.abs(Math.sin(s.phase))*0.5:s.a;
            ctx.globalAlpha=flicker;
            ctx.fillStyle=s.color;
            ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
            if(s.r>1.6){
                ctx.globalAlpha=flicker*.35;
                ctx.beginPath(); ctx.arc(s.x,s.y,s.r*3.5,0,Math.PI*2); ctx.fill();
                ctx.globalAlpha=flicker*.25;
                ctx.strokeStyle=s.color; ctx.lineWidth=.6;
                ctx.beginPath();
                ctx.moveTo(s.x-s.r*5,s.y); ctx.lineTo(s.x+s.r*5,s.y);
                ctx.moveTo(s.x,s.y-s.r*5); ctx.lineTo(s.x,s.y+s.r*5);
                ctx.stroke();
            }
        });
        if(Math.random()<.004) meteors.push({x:Math.random()*W,y:Math.random()*H*.3,vx:9+Math.random()*6,vy:4+Math.random()*4,life:1,tail:[]});
        meteors=meteors.filter(m=>{
            m.x+=m.vx; m.y+=m.vy; m.life-=.055;
            if(m.life<=0)return false;
            m.tail.push({x:m.x,y:m.y});
            if(m.tail.length>16)m.tail.shift();
            m.tail.forEach((p,i)=>{
                ctx.globalAlpha=(i/m.tail.length)*m.life*.7;
                ctx.fillStyle='#fff';
                ctx.beginPath(); ctx.arc(p.x,p.y,.9,0,Math.PI*2); ctx.fill();
            });
            return true;
        });
        const arcs=[
            [0,H*.28,W*.14,H*.07,W*.36,H*.22,'rgba(240,192,64,.16)'],
            [W,H*.28,W*.86,H*.07,W*.64,H*.22,'rgba(240,192,64,.16)'],
            [0,H*.72,W*.14,H*.93,W*.36,H*.78,'rgba(0,200,220,.13)'],
            [W,H*.72,W*.86,H*.93,W*.64,H*.78,'rgba(0,200,220,.13)'],
            [0,H*.5,W*.1,H*.35,W*.25,H*.46,'rgba(176,96,255,.1)'],
            [W,H*.5,W*.9,H*.35,W*.75,H*.46,'rgba(176,96,255,.1)'],
        ];
        arcs.forEach(([x1,y1,cx3,cy3,x2,y2,col])=>{
            const off=Math.sin(t*.4)*8;
            ctx.beginPath(); ctx.moveTo(x1,y1+off);
            ctx.quadraticCurveTo(cx3,cy3+off,x2,y2+off);
            ctx.strokeStyle=col; ctx.lineWidth=1.4; ctx.stroke();
        });
        ctx.globalAlpha=1;
        requestAnimationFrame(frame);
    }
    window.addEventListener('resize',resize);
    resize(); frame();
})();

(function(){
    const c=document.getElementById('nirvanaCanvas');
    const ctx=c.getContext('2d');
    let W,H;
    function resize(){W=c.width=window.innerWidth;H=c.height=window.innerHeight}
    window.addEventListener('resize',resize); resize();
    const tris=[];
    for(let i=0;i<14;i++){
        const size=Math.random()*60+20;
        tris.push({
            x:Math.random()*W, y:Math.random()*H,
            size, rot:Math.random()*Math.PI*2,
            rotSpeed:(Math.random()-.5)*.012,
            vx:(Math.random()-.5)*.35, vy:(Math.random()-.5)*.3,
            col:Math.random()<.4?'rgba(240,192,64,':'rgba(0,200,220,',
            a:Math.random()*.5+.15,
            filled:Math.random()<.35,
        });
    }
    const cubes=[];
    for(let i=0;i<8;i++){
        const sz=Math.random()*50+18;
        cubes.push({
            x:Math.random()*W, y:Math.random()*H,
            sz, rx:Math.random()*.02-.01, ry:Math.random()*.018-.009, rz:Math.random()*.015-.0075,
            ax:Math.random()*Math.PI*2, ay:Math.random()*Math.PI*2, az:Math.random()*Math.PI*2,
            vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.25,
            col:Math.random()<.5?[0,200,220]:Math.random()<.5?[240,192,64]:[176,96,255],
            a:Math.random()*.45+.12,
        });
    }
    const clouds=[];
    for(let i=0;i<7;i++){
        const scale=Math.random()*1.4+.5;
        clouds.push({
            x:Math.random()*W, y:Math.random()*(H*.7)+H*.05,
            scale,
            vx:(Math.random()-.5)*.22,
            vy:Math.sin(Math.random()*Math.PI)*.08,
            a:Math.random()*.55+.18,
            col:Math.random()<.4?[0,200,220]:Math.random()<.5?[180,120,255]:[80,180,255],
            phase:Math.random()*Math.PI*2,
            phaseSpeed:Math.random()*.008+.003,
        });
    }
    function rotX(p,a){return[p[0],p[1]*Math.cos(a)-p[2]*Math.sin(a),p[1]*Math.sin(a)+p[2]*Math.cos(a)]}
    function rotY(p,a){return[p[0]*Math.cos(a)+p[2]*Math.sin(a),p[1],-p[0]*Math.sin(a)+p[2]*Math.cos(a)]}
    function rotZ(p,a){return[p[0]*Math.cos(a)-p[1]*Math.sin(a),p[0]*Math.sin(a)+p[1]*Math.cos(a),p[2]]}
    const cubeBase=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
    const cubeEdges=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
    function drawCube(cb){
        const verts=cubeBase.map(v=>{
            let p=[v[0]*cb.sz*.5,v[1]*cb.sz*.5,v[2]*cb.sz*.5];
            p=rotX(p,cb.ax); p=rotY(p,cb.ay); p=rotZ(p,cb.az);
            return p;
        });
        ctx.strokeStyle=`rgba(${cb.col[0]},${cb.col[1]},${cb.col[2]},${cb.a})`;
        ctx.lineWidth=1.1;
        cubeEdges.forEach(([a,b])=>{
            ctx.beginPath();
            ctx.moveTo(cb.x+verts[a][0],cb.y+verts[a][1]);
            ctx.lineTo(cb.x+verts[b][0],cb.y+verts[b][1]);
            ctx.stroke();
        });
        ctx.fillStyle=`rgba(${cb.col[0]},${cb.col[1]},${cb.col[2]},${cb.a*.8})`;
        verts.forEach(v=>{
            ctx.beginPath(); ctx.arc(cb.x+v[0],cb.y+v[1],1.4,0,Math.PI*2); ctx.fill();
        });
    }
    function drawTri(tr){
        const h=tr.size*Math.sqrt(3)/2;
        ctx.save();
        ctx.translate(tr.x,tr.y);
        ctx.rotate(tr.rot);
        ctx.beginPath();
        ctx.moveTo(0,-h*2/3);
        ctx.lineTo(tr.size/2,h/3);
        ctx.lineTo(-tr.size/2,h/3);
        ctx.closePath();
        if(tr.filled){
            ctx.fillStyle=tr.col+tr.a*.5+')';ctx.fill();
        }
        ctx.strokeStyle=tr.col+tr.a+')';ctx.lineWidth=1.2;ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0,-h*2/3*.5);
        ctx.lineTo(tr.size/2*.5,h/3*.5);
        ctx.lineTo(-tr.size/2*.5,h/3*.5);
        ctx.closePath();
        ctx.strokeStyle=tr.col+(tr.a*.5)+')';ctx.lineWidth=.7;ctx.stroke();
        ctx.restore();
    }
    let t2=0;
    function frame(){
        t2+=.016;
        ctx.clearRect(0,0,W,H);
        tris.forEach(tr=>{
            tr.x+=tr.vx; tr.y+=tr.vy; tr.rot+=tr.rotSpeed;
            if(tr.x<-80)tr.x=W+80; if(tr.x>W+80)tr.x=-80;
            if(tr.y<-80)tr.y=H+80; if(tr.y>H+80)tr.y=-80;
            drawTri(tr);
        });
        cubes.forEach(cb=>{
            cb.ax+=cb.rx; cb.ay+=cb.ry; cb.az+=cb.rz;
            cb.x+=cb.vx; cb.y+=cb.vy;
            if(cb.x<-80)cb.x=W+80; if(cb.x>W+80)cb.x=-80;
            if(cb.y<-80)cb.y=H+80; if(cb.y>H+80)cb.y=-80;
            drawCube(cb);
        });
        ctx.globalAlpha=1;
        requestAnimationFrame(frame);
    }
    frame();
})();

(function(){
    const canvas=document.getElementById('globeCanvas');
    const ctx=canvas.getContext('2d');
    const SIZE=200; canvas.width=SIZE; canvas.height=SIZE;
    const R=SIZE/2-4;
    let angle=0;
    const continents=[
        [[.48,.3],[.52,.28],[.56,.32],[.58,.4],[.56,.52],[.52,.58],[.48,.56],[.44,.5],[.43,.4]],
        [[.46,.22],[.5,.2],[.54,.22],[.55,.28],[.52,.3],[.48,.3],[.45,.26]],
        [[.54,.15],[.62,.13],[.72,.18],[.78,.25],[.76,.32],[.68,.35],[.6,.3],[.56,.25]],
        [[.28,.18],[.32,.16],[.36,.2],[.38,.3],[.36,.42],[.3,.48],[.26,.4],[.24,.3],[.26,.22]],
        [[.3,.5],[.34,.48],[.36,.55],[.34,.65],[.3,.68],[.27,.6],[.27,.52]],
        [[.7,.52],[.76,.5],[.78,.56],[.74,.6],[.7,.58]],
    ];
    function ll2xy(lat,lon,ang){
        const phi=(90-lat)*Math.PI/180;
        const theta=(lon+ang)*Math.PI/180;
        return{x:R*Math.sin(phi)*Math.cos(theta),y:R*Math.cos(phi),z:R*Math.sin(phi)*Math.sin(theta)};
    }
    function draw(){
        ctx.clearRect(0,0,SIZE,SIZE);
        const cx=SIZE/2,cy=SIZE/2;
        angle+=1.2;
        const dayShift=(Math.cos(angle*Math.PI/180)+1)/2;
        const grd=ctx.createLinearGradient(cx-R,cy,cx+R,cy);
        if(dayShift>.5){
            grd.addColorStop(0,'#001840');grd.addColorStop(.38,'#001840');
            grd.addColorStop(.52,'#1a6aab');grd.addColorStop(.68,'#4db8e8');grd.addColorStop(1,'#4db8e8');
        }else{
            grd.addColorStop(0,'#4db8e8');grd.addColorStop(.32,'#4db8e8');
            grd.addColorStop(.48,'#1a6aab');grd.addColorStop(.62,'#001840');grd.addColorStop(1,'#001840');
        }
        ctx.save();
        ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.clip();
        ctx.fillStyle=grd;ctx.fillRect(0,0,SIZE,SIZE);
        ctx.strokeStyle='rgba(100,200,255,.12)';ctx.lineWidth=.5;
        for(let lat=-75;lat<=75;lat+=30){
            ctx.beginPath();let f=true;
            for(let lon=0;lon<=360;lon+=3){
                const p=ll2xy(lat,lon,angle);if(p.z<0)continue;
                f?ctx.moveTo(cx+p.x,cy-p.y):ctx.lineTo(cx+p.x,cy-p.y);f=false;
            }ctx.stroke();
        }
        for(let lon=0;lon<360;lon+=30){
            ctx.beginPath();let f=true;
            for(let lat=-90;lat<=90;lat+=3){
                const p=ll2xy(lat,lon,angle);if(p.z<0)continue;
                f?ctx.moveTo(cx+p.x,cy-p.y):ctx.lineTo(cx+p.x,cy-p.y);f=false;
            }ctx.stroke();
        }
        continents.forEach(cont=>{
            ctx.beginPath();let st=false,ab=true;
            cont.forEach(([u,v])=>{
                const lat=(1-v)*180-90,lon=u*360;
                const p=ll2xy(lat,lon,angle);
                if(p.z>0){ab=false;const sx=cx+p.x,sy=cy-p.y;st?ctx.lineTo(sx,sy):ctx.moveTo(sx,sy);st=true;}
            });
            if(!ab){ctx.closePath();ctx.fillStyle='rgba(30,160,80,.72)';ctx.fill();ctx.strokeStyle='rgba(60,210,100,.5)';ctx.lineWidth=.8;ctx.stroke();}
        });
        [[40,116],[51,0],[40,-74],[35,139],[1,103],[-34,-58],[55,37],[-33,151],[19,-99]].forEach(([la,lo])=>{
            const p=ll2xy(la,lo,angle);
            if(p.z<0){
                const sx=cx+p.x,sy=cy-p.y;
                const g=ctx.createRadialGradient(sx,sy,0,sx,sy,5);
                g.addColorStop(0,'rgba(255,225,80,.95)');g.addColorStop(1,'transparent');
                ctx.fillStyle=g;ctx.beginPath();ctx.arc(sx,sy,5,0,Math.PI*2);ctx.fill();
            }
        });
        const atm=ctx.createRadialGradient(cx,cy,R*.86,cx,cy,R+7);
        atm.addColorStop(0,'transparent');atm.addColorStop(.55,'rgba(80,180,255,.1)');atm.addColorStop(1,'rgba(80,180,255,.22)');
        ctx.fillStyle=atm;ctx.beginPath();ctx.arc(cx,cy,R+7,0,Math.PI*2);ctx.fill();
        ctx.restore();
        ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.strokeStyle='rgba(0,200,255,.4)';ctx.lineWidth=1.6;ctx.stroke();
        const sp=ctx.createRadialGradient(cx-R*.3,cy-R*.3,0,cx-R*.3,cy-R*.3,R*.5);
        sp.addColorStop(0,'rgba(255,255,255,.2)');sp.addColorStop(1,'transparent');
        ctx.fillStyle=sp;ctx.save();ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.clip();ctx.fillRect(0,0,SIZE,SIZE);ctx.restore();
        requestAnimationFrame(draw);
    }
    draw();
})();

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
    checkAdmin();
    loadProfileDataToDom();
    renderMediaCards();
    // Tombol edit profil (hanya admin)
    const editBtn = document.createElement('span');
    editBtn.id = 'editProfileBtn';
    editBtn.innerText = '✏️ Edit';
    editBtn.style.cssText = 'display:none; cursor:pointer; font-size:0.8rem; margin-left:10px;';
    editBtn.onclick = editProfile;
    const profileTitle = document.querySelector('.profile-info h3');
    if (profileTitle) profileTitle.appendChild(editBtn);
});
