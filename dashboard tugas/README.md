
# Personal Dashboard Mahasiswa ITERA

## 1. Deskripsi Aplikasi

Personal Dashboard Mahasiswa ITERA adalah aplikasi web sederhana
yang membantu mahasiswa mengelola tugas kuliah dan memantau
informasi cuaca kampus.

Aplikasi ini dibuat menggunakan HTML, CSS, dan JavaScript ES6+.
Data tugas disimpan menggunakan localStorage sehingga tetap tersedia
ketika halaman dimuat ulang pada browser yang sama.

## 2. Fitur Aplikasi

- Menambahkan tugas kuliah.
- Mengedit nama tugas, mata kuliah, deadline, dan prioritas.
- Menghapus tugas.
- Menandai tugas yang sudah selesai.
- Memfilter tugas berdasarkan status penyelesaian.
- Menampilkan ringkasan jumlah tugas.
- Menampilkan cuaca menggunakan API Open-Meteo.
- Menyimpan data secara lokal melalui localStorage.
- Tampilan responsif untuk laptop dan ponsel.

## 3. Teknologi yang Digunakan

- HTML5
- CSS3
- JavaScript ES6+
- Browser localStorage
- Fetch API dan Open-Meteo

## 4. Implementasi Fitur ES6+

Daftar berikut mengacu pada nama fungsi dan bagian kode
agar mudah ditemukan menggunakan Ctrl+F di VS Code.

| Fitur ES6+ | File | Bagian kode |
|---|---|---|
| let dan const | script.js | Deklarasi variabel dan konstanta |
| Arrow functions | script.js | escapeHTML, event listener, map, filter |
| Template literals | script.js | createTaskHTML() dan loadWeather() |
| Async/await | script.js | loadWeather() |
| Classes | script.js | TaskItem dan DashboardApp |
| Destructuring | script.js | Constructor TaskItem, createTaskHTML(), handleTaskAction() |
| Spread operator | script.js | handleSubmit() dan handleTaskAction() |
| Array methods | script.js | map(), filter(), find() |
| localStorage | script.js | loadTasks() dan saveTasks() |
| Fetch API | script.js | loadWeather() |

## 5. Screenshot Aplikasi

Tambahkan screenshot aplikasi setelah dijalankan.

Contoh struktur folder:

screenshots/
- dashboard.png
- tambah-tugas.png
- edit-tugas.png
- tugas-selesai.png

## 6. Cara Menjalankan Aplikasi

1. Unduh atau salin semua file proyek.
2. Buka folder personal-dashboard di VS Code.
3. Jalankan index.html menggunakan browser.
4. Tambahkan tugas melalui formulir.
5. Coba fitur edit, hapus, dan tandai selesai.
6. Muat ulang halaman untuk memeriksa penyimpanan data.
7. Pastikan internet tersedia untuk memuat cuaca.

## 7. Kesimpulan

Aplikasi Personal Dashboard Mahasiswa ITERA membantu
pengelolaan tugas kuliah secara sederhana dan interaktif.
Aplikasi ini menerapkan konsep JavaScript ES6+, pemrograman
berorientasi objek, penyimpanan lokal, dan pengambilan data
eksternal secara asinkron.
