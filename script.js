// 1. Daftarkan Service Worker agar aplikasi bisa jalan OFFLINE
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('Service Worker terdaftar!'))
    .catch((err) => console.log('Gagal daftar SW:', err));
}

// 2. Ambil data dari memori HP (localStorage) atau pakai nilai awal 0
let dataTabungan = JSON.parse(localStorage.getItem('tabunganKuData')) || {
  namaTarget: 'Belum diatur',
  nominalTarget: 0,
  terkumpul: 0
};

// Daftar Tips Keuangan Random
const daftarTips = [
  "Sisihkan uang jajan di pagi hari sebelum dipakai jajan!",
  "Bawa botol minum sendiri dari rumah bisa hemat Rp5.000 sehari.",
  "Bedakan mana 'kebutuhan' dan mana yang cuma 'keinginan'.",
  "Uang receh kembalian kalau dikumpulkan sebulan bisa jadi banyak!",
  "Puasa jajan boba/kopi kekinian 2 kali seminggu sangat membantu targetmu.",
  "Catat setiap pengeluaran sekecil apa pun agar tidak bocor halus."
];

// Fungsi format angka ke Rupiah
function formatRupiah(angka) {
  return 'Rp ' + angka.toLocaleString('id-ID');
}

// Fungsi memperbarui tampilan layar & menyimpan ke localStorage
function updateTampilan() {
  document.getElementById('nama-target').innerText = dataTabungan.namaTarget;
  document.getElementById('total-tabungan').innerText = formatRupiah(dataTabungan.terkumpul);
  document.getElementById('nominal-target').innerText = formatRupiah(dataTabungan.nominalTarget);

  // Hitung persentase Progress Bar
  let persen = 0;
  if (dataTabungan.nominalTarget > 0) {
    persen = Math.min(100, Math.round((dataTabungan.terkumpul / dataTabungan.nominalTarget) * 100));
  }
  document.getElementById('progress-bar').style.width = persen + '%';
  document.getElementById('persen-angka').innerText = persen + '%';

  // Simpan perubahan ke memori lokal browser
  localStorage.setItem('tabunganKuData', JSON.stringify(dataTabungan));
}

// 3. Event Form Atur Target
document.getElementById('form-target').addEventListener('submit', function(e) {
  e.preventDefault();
  const nama = document.getElementById('input-nama-target').value;
  const nominal = parseInt(document.getElementById('input-nominal-target').value);

  if (nominal > 0) {
    dataTabungan.namaTarget = nama;
    dataTabungan.nominalTarget = nominal;
    updateTampilan();
    this.reset();
  }
});

// 4. Event Tombol Nabung & Jajan
document.getElementById('btn-nabung').addEventListener('click', function() {
  const input = document.getElementById('input-nominal');
  const nilai = parseInt(input.value);
  if (nilai > 0) {
    dataTabungan.terkumpul += nilai;
    updateTampilan();
    input.value = '';
    if (dataTabungan.terkumpul >= dataTabungan.nominalTarget && dataTabungan.nominalTarget > 0) {
      alert('🎉 Selamat! Target tabunganmu sudah tercapai!');
    }
  }
});

document.getElementById('btn-jajan').addEventListener('click', function() {
  const input = document.getElementById('input-nominal');
  const nilai = parseInt(input.value);
  if (nilai > 0) {
    dataTabungan.terkumpul = Math.max(0, dataTabungan.terkumpul - nilai);
    updateTampilan();
    input.value = '';
  }
});

// Tombol Reset Data
document.getElementById('btn-reset').addEventListener('click', function() {
  if (confirm('Yakin ingin menghapus semua data tabungan?')) {
    dataTabungan = { namaTarget: 'Belum diatur', nominalTarget: 0, terkumpul: 0 };
    updateTampilan();
  }
});

// 5. Fitur Dark / Light Mode
const btnTheme = document.getElementById('btn-theme');
if (localStorage.getItem('tema') === 'dark') {
  document.body.classList.add('dark-mode');
  btnTheme.innerText = '☀️';
}

btnTheme.addEventListener('click', function() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  btnTheme.innerText = isDark ? '☀️' : '🌙';
  localStorage.setItem('tema', isDark ? 'dark' : 'light');
});

// 6. Fitur Notifikasi Harian
document.getElementById('btn-notif').addEventListener('click', function() {
  if (!('Notification' in window)) {
    alert('Browser kamu tidak mendukung fitur notifikasi.');
    return;
  }

  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      new Notification('Tabungan-Ku Aktif! 🔔', {
        body: 'Mantap! Jangan lupa sisihkan sisa uang jajanmu hari ini ya.'
      });
    } else {
      alert('Izin notifikasi ditolak. Aktifkan di pengaturan browser jika berubah pikiran.');
    }
  });
});

// 7. Tampilkan Tips Keuangan Random saat halaman dibuka
const tipsAcak = daftarTips[Math.floor(Math.random() * daftarTips.length)];
document.getElementById('teks-tips').innerText = tipsAcak;

// Jalankan pertama kali saat web dibuka
updateTampilan();
