# 📰 BeritaKita

BeritaKita adalah platform portal berita modern yang memungkinkan administrator mengelola konten berita secara efisien dan pengguna membaca serta berinteraksi melalui fitur komentar.

==================================================
FITUR UTAMA
==================================================

USER
- Melihat daftar berita terbaru
- Membaca detail berita
- Mencari berita berdasarkan kata kunci
- Memberikan komentar pada berita
- Melihat komentar pengguna lain

ADMIN
- Login ke dashboard admin
- Mengelola berita (CRUD)
- Membuat berita baru
- Mengedit berita
- Menghapus berita
- Mengubah status berita menjadi Draft atau Published
- Mengelola komentar pengguna
- Upload gambar berita

MULTI ADMIN
- Mendukung 2 admin atau lebih
- Setiap admin dapat membuat dan mengelola berita
- Pengelolaan konten dilakukan secara terpusat

MANAJEMEN BERITA
- Create News
- Read News
- Update News
- Delete News
- Draft News
- Publish News
- Search News
- Dynamic News Detail (/news/[slug])
- Upload Thumbnail/Gambar Berita

SISTEM KOMENTAR
- User dapat memberikan komentar pada berita
- Komentar tersimpan ke database
- Admin dapat memoderasi komentar

PENCARIAN BERITA
- Berdasarkan judul berita
- Berdasarkan kata kunci
- Berdasarkan isi berita

==================================================
STRUKTUR PROJECT
==================================================

app
├── admin
├── api
│   ├── admin/login
│   ├── comments
│   ├── news
│   ├── seed
│   └── upload
├── components
├── news/[slug]
├── favicon.ico
├── globals.css
├── layout.js
└── page.js

lib
└── prisma.js

==================================================
TECH STACK
==================================================

Frontend:
- Next.js
- React.js
- App Router
- Tailwind CSS

Backend:
- Next.js API Routes
- Prisma ORM

Database:
- MySQL / PostgreSQL

Authentication:
- Admin Login Authentication

Storage:
- Local Upload Storage

==================================================
STATUS BERITA
==================================================

Draft
- Berita disimpan tetapi belum tampil ke publik

Published
- Berita tampil dan dapat dibaca pengguna

==================================================
ALUR KERJA
==================================================

Admin Login
    ↓
Buat Berita
    ↓
Simpan sebagai Draft
    ↓
Review Konten
    ↓
Publish
    ↓
Tampil di Website
    ↓
User Membaca & Berkomentar

==================================================
FITUR SELESAI
==================================================

✅ Multi Admin Login
✅ CRUD Berita
✅ Draft & Publish Berita
✅ Upload Gambar Berita
✅ Dynamic Slug News
✅ Komentar Pengguna
✅ Search Berita
✅ API Routes
✅ Prisma ORM Integration

==================================================
PENGEMBANGAN SELANJUTNYA
==================================================

- Role Based Access Control
- Rich Text Editor
- Kategori Berita
- Tag Berita
- Pagination
- Dashboard Analytics
- Notifikasi Komentar
- SEO Optimization
- Dark Mode
- Bookmark Berita
- Like & Share Berita

==================================================
AUTHOR
==================================================

Habib

BeritaKita — Portal Berita Modern, Cepat, dan Interaktif untuk Semua.
