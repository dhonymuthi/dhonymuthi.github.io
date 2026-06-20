const nomorAdmin = "6289520227074"; // Format internasional tanpa simbol +
const PASSWORD_VALID = "ALUMNIHARUM2026"; // Anda bisa ganti password grup ini kapan saja

// Fungsi beralih tampilan antara Login dan Daftar
function tampilkanFormDaftar(isDaftar) {
    if (isDaftar) {
        document.getElementById('box-login').style.display = 'none';
        document.getElementById('box-daftar').style.display = 'block';
    } else {
        document.getElementById('box-login').style.display = 'block';
        document.getElementById('box-daftar').style.display = 'none';
    }
}

// Fungsi Mengirim Data Pendaftaran Anggota Baru ke WhatsApp Admin
function kirimPendaftaranAdmin() {
    const nama = document.getElementById('daftar-nama').value.trim();
    const wa = document.getElementById('daftar-whatsapp').value.trim();
    const angkatan = document.getElementById('daftar-angkatan').value.trim();

    if (nama === "" || wa === "" || angkatan === "") {
        alert("Mohon isi semua data pendaftaran dengan benar!");
        return;
    }

    // Menyusun teks template pendaftaran untuk Admin
    const pesan teks = `Assalamualaikum Admin HARUM,\n\nSaya ingin mendaftar ke Aplikasi Web HARUM Malang.\n\nBerikut data saya:\n- *Nama lengkap* : ${nama}\n- *No. WhatsApp* : ${wa}\n- *Angkatan* : ${angkatan}\n\nMohon diverifikasi dan minta password masuk aplikasinya. Terima kasih.`;
    
    // Encode teks agar aman dikirim via URL link WA
    const urlWA = `https://api.whatsapp.com/send?phone=${nomorAdmin}&text=${encodeURIComponent(pesan)}`;
    
    // Buka aplikasi WhatsApp ke chat Admin
    window.open(urlWA, '_blank');
}

// Fungsi Proses Login Utama
function prosesLogin() {
    const wa = document.getElementById('login-whatsapp').value.trim();
    const pass = document.getElementById('login-password').value.trim();

    if (wa === "" || pass === "") {
        alert("Nomor WhatsApp dan Password wajib diisi!");
        return;
    }

    if (pass !== PASSWORD_VALID) {
        alert("Password Salah! Jika belum terdaftar, silakan klik tombol 'Daftar Jadi Anggota' untuk meminta password kepada admin.");
        return;
    }

    // Jika password benar, simpan nomor WA sebagai penanda login
    localStorage.setItem('user_harum_session', wa);
    
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
}

function logout() {
    localStorage.removeItem('user_harum_session');
    document.getElementById('login-screen').style.display = 'block';
    document.getElementById('main-app').style.display = 'none';
    
    document.getElementById('login-whatsapp').value = "";
    document.getElementById('login-password').value = "";
}

function bukaHalaman(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(pageId).classList.add('active');
    
    if(event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

// --- SISTEM KALENDER REAL TIME ---
function updateJamDanTanggal() {
    const sekarang = new Date();
    
    const jam = String(sekarang.getHours()).padStart(2, '0');
    const menit = String(sekarang.getMinutes()).padStart(2, '0');
    const detik = String(sekarang.getSeconds()).padStart(2, '0');
    document.getElementById('jam-info').innerText = `${jam}:${menit}:${detik} WIB`;

    const opsiMasehi = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const tglMasehi = sekarang.toLocaleDateString('id-ID', opsiMasehi);

    const pasaran = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
    const baseTime = new Date(1970, 0, 1).getTime();
    const diffDays = Math.floor((sekarang.getTime() - baseTime) / 86400000);
    const pasaranHariIni = pasaran[(diffDays + 3) % 5]; 

    const bulanJawa = ["Sura", "Sapar", "Mulud", "Bakda Mulud", "Jumadil Awal", "Jumadil Akhir", "Rajab", "Ruwah", "Pasa", "Sawal", "Sela", "Besar"];
    
    let day = sekarang.getDate();
    let month = sekarang.getMonth() + 1;
    let year = sekarang.getFullYear();

    if (month < 3) {
        year -= 1;
        month += 12;
    }

    let a = Math.floor(year / 100);
    let b = Math.floor(a / 4);
    let c = 2 - a + b;
    let e = Math.floor(365.25 * (year + 4716));
    let f = Math.floor(30.6001 * (month + 1));
    let jd = c + day + e + f - 1524.5; 

    let ijd = Math.floor(jd + 0.5);
    let l = ijd - 1948440 + 10632;
    let n = Math.floor((l - 1) / 10631);
    l = l - 10631 * n + 354;
    let j = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) + Math.floor(l / 5670) * Math.floor((43 * l) / 15313);
    l = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 30) * Math.floor((15313 * j) / 43) + 29;
    
    let mH = Math.floor((24 * l) / 709);
    let dH = l - Math.floor((709 * mH) / 24);
    let yH = 30 * n + j - 30; 

    const bulanHijriah = ["Muharram", "Safar", "Rabiul Awal", "Rabiul Akhir", "Jumadil Awal", "Jumadil Akhir", "Rajab", "Sya'ban", "Ramadhan", "Syawal", "Dzulqa'dah", "Dzulhijjah"];

    document.getElementById('kalender-masehi-jawa').innerText = `${tglMasehi} (${pasaranHariIni})`;
    document.getElementById('kalender-hijriah').innerText = `${dH} ${bulanHijriah[mH-1]} ${yH} H / ${dH} ${bulanJawa[mH-1]} ${yH + 512} AJ`;
}

window.onload = function() {
    const savedUser = localStorage.getItem('user_harum_session');
    if (savedUser) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
    }
    updateJamDanTanggal();
    setInterval(updateJamDanTanggal, 1000);
}
