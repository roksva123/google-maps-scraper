# 🗺️ UMKM Lead Scraper - Google Maps

Aplikasi web untuk scraping UMKM/bisnis kecil dari Google Maps yang **belum memiliki website**. Memudahkan Anda menemukan prospek bisnis potensial untuk sales dan marketing.

## 🎯 Fitur Utama

✅ **Filter Krusial**: Hanya tampilkan tempat/UMKM yang **BELUM punya website**  
✅ **Scraping Realtime**: Ambil data langsung dari Google Maps (Nama, Telepon, Alamat)  
✅ **Direct Links**: Tombol cepat ke Google Maps dan WhatsApp  
✅ **Search History**: Simpan dan akses kembali pencarian lama  
✅ **Responsive Design**: Bekerja di desktop, tablet, dan mobile  
✅ **Dark Theme**: UI modern dengan tema gelap yang nyaman

## 📋 Informasi yang Diambil

Untuk setiap lead, aplikasi mengumpulkan:
- 📍 **Nama Tempat** - Nama bisnis/UMKM
- 📞 **Nomor Telepon** - Nomor kontak yang tertera di Google Maps
- 🏠 **Alamat** - Lokasi lengkap bisnis
- 🗺️ **Link Google Maps** - URL resmi Google Maps untuk setiap lokasi

## 🏗️ Struktur Project

```
google-maps-scraper/
├── backend/
│   ├── main.py              # FastAPI server & endpoints
│   ├── scraper.py           # Playwright scraping logic
│   ├── database.py          # SQLite history management
│   ├── requirements.txt      # Python dependencies
│   └── history.db           # SQLite database (auto-generated)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── App.css          # Styling & responsive design
│   │   ├── index.css        # Global styles
│   │   └── main.jsx         # Entry point
│   ├── .env.example         # Environment variable template
│   ├── .env.local           # Local config (create from .env.example)
│   ├── package.json         # Node dependencies
│   └── vite.config.js       # Vite configuration
│
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## 🚀 Cara Setup & Menjalankan

### Prerequisites

- **Python 3.8+** - Untuk backend
- **Node.js 16+** - Untuk frontend
- **Git** - Untuk version control
- **Docker & Docker Compose** (optional) - Untuk setup yang lebih gampang

### ⚡ Quick Start dengan Docker (Recommended)

Jika sudah install Docker:
```bash
git clone <repo-url>
cd google-maps-scraper
docker-compose up
```
Buka browser: `http://localhost:5173`

📖 Detail: Lihat [DOCKER_SETUP.md](./DOCKER_SETUP.md)

---

### 1️⃣ Backend Setup (Manual)

```bash
# Masuk ke folder backend
cd backend

# Install dependencies Python
pip install -r requirements.txt

# Install Playwright browsers (Chrome)
python -m playwright install chromium

# Jalankan FastAPI server
python main.py
```

✅ Backend akan berjalan di: `http://0.0.0.0:8000`

**API Endpoints:**
- `GET /api/scrape?keyword=cafe&limit=10` - Mulai scraping
- `GET /api/history?limit=20` - Lihat history pencarian
- `DELETE /api/history` - Hapus semua history

### 2️⃣ Frontend Setup

```bash
# Masuk ke folder frontend
cd frontend

# Install dependencies Node
npm install

# (Opsional) Buat file .env.local dari template
cp .env.example .env.local

# Jalankan development server
npm run dev
```

✅ Frontend akan berjalan di: `http://localhost:5173`

### 3️⃣ Akses Aplikasi

Buka browser dan navigasi ke:
```
http://localhost:5173
```

## 🔧 Konfigurasi Environment

### Frontend (.env.local)

Buat file `.env.local` di folder `frontend/`:

```env
# Development (lokal)
VITE_API_BASE_URL=http://localhost:8000

# Production (server lain)
# VITE_API_BASE_URL=http://your-server-ip:8000
# atau
# VITE_API_BASE_URL=https://api.yourdomain.com
```

Jika tidak ada `.env.local`, aplikasi akan otomatis fallback ke `http://localhost:8000`.

## 📖 Cara Menggunakan

1. **Masukkan Kata Kunci**
   - Contoh: "cafe di jakarta", "toko baju bandung", "barbershop jogja"
   - Gunakan keywords spesifik untuk hasil yang lebih akurat

2. **Atur Jumlah Hasil**
   - Slider/input untuk mengontrol berapa banyak hasil yang diambil
   - Maximum 50 hasil per pencarian

3. **Mulai Cari**
   - Klik tombol "Mulai Cari"
   - Tunggu 30-60 detik hingga proses scraping selesai
   - Loading indicator akan menunjukkan progress

4. **Lihat Hasil**
   - Data ditampilkan dalam grid/card yang rapi
   - Setiap card menampilkan: Nama, Alamat, Telepon

5. **Aksi Cepat**
   - 🗺️ **Buka di Google Maps** - Lihat lokasi di peta
   - 💬 **Hubungi via WhatsApp** - Chat langsung (jika nomor tersedia)

6. **Simpan & Reuse**
   - Semua pencarian otomatis tersimpan di history
   - Klik history item untuk reload hasil lama
   - Hapus history kapan saja dengan tombol "Clear History"

## 🔍 Teknik Filtering Website

Aplikasi menggunakan multiple checks untuk mendeteksi apakah tempat sudah punya website:

1. **Selector Resmi Google Maps** - `a[data-item-id="authority"]`
2. **Button/Link Website** - Cari text "Website"
3. **External Links** - Deteksi link ke domain eksternal (bukan Google Maps)

Jika ada salah satu indikator website, tempat tersebut **DIABAIKAN/DIFILTER KELUAR** dari hasil.

## 🐛 Troubleshooting

### Error: "Failed to connect to backend"

**Solusi:**
1. Pastikan FastAPI server sudah berjalan: `python main.py`
2. Cek port 8000 tidak ada yang pakai: `netstat -ano | findstr :8000`
3. Update `.env.local` dengan URL yang benar

### Error: "Playwright not installed"

**Solusi:**
```bash
cd backend
python -m playwright install chromium
```

### Hasil scraping kosong

**Kemungkinan penyebab:**
- Keyword terlalu umum atau tidak ada hasil di Google Maps
- Google Maps memblokir request (try again later)
- Coba dengan keyword yang lebih spesifik

### Error CORS / Cannot reach API

**Solusi:**
- Backend harus berjalan dengan `host="0.0.0.0"` (sudah dikonfigurasi)
- Frontend harus mengakses URL yang benar di `.env.local`
- Pastikan firewall tidak memblokir port 8000

## 🌐 Deploy ke Production

### Deploy Backend (Python/FastAPI)

**Option 1: Heroku**
```bash
heroku create your-app-name
heroku config:set PYTHONUNBUFFERED=1
git push heroku main
```

**Option 2: Railway / Render / PythonAnywhere**
- Ikuti dokumentasi platform masing-masing
- Pastikan `requirements.txt` sudah lengkap

### Deploy Frontend (React/Vite)

**Option 1: GitHub Pages**
```bash
cd frontend
npm run build
npm run deploy
```

**Option 2: Vercel**
```bash
npm i -g vercel
vercel
```

**Option 3: Netlify**
```bash
npm run build
# Deploy folder 'dist' ke Netlify
```

## 📊 API Response Format

### Successful Scrape
```json
{
  "status": "success",
  "history_id": 1,
  "count": 5,
  "data": [
    {
      "name": "Kopi Jauh",
      "phone": "08123456789",
      "address": "Jl. Merdeka No. 123, Jakarta",
      "maps_url": "https://www.google.com/maps/place/...",
      "has_website": false
    }
  ]
}
```

### Get History
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "keyword": "cafe di jakarta",
      "limit": 10,
      "count": 5,
      "results": [...],
      "created_at": "2024-08-05 10:30:00"
    }
  ]
}
```

## 🔐 Privacy & Security

- ✅ Data hanya disimpan di SQLite lokal (tidak ada cloud)
- ✅ Informasi yang diambil hanya dari public Google Maps
- ✅ Tidak ada tracking atau telemetri
- ✅ Respeto terhadap robots.txt dan rate limiting

## 📝 Catatan Penting

⚠️ **Rate Limiting**: Google Maps mungkin membatasi jika terlalu banyak request. Jika terjadi blocking:
- Tunggu 5-10 menit sebelum scraping lagi
- Gunakan keywords yang lebih spesifik
- Kurangi jumlah hasil per pencarian

⚠️ **Akurasi Data**: Data yang diambil bergantung pada informasi yang tertera di Google Maps. Validasi nomor telepon sebelum menghubungi.

## 🤝 Contributing

Issues dan pull requests welcome! Silakan:
1. Fork repository
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - Bebas digunakan untuk komersial maupun personal.

## 📞 Support

Jika ada pertanyaan atau issue:
1. Cek bagian Troubleshooting di atas
2. Buka issue di GitHub
3. Diskusi di discussions section

---

**Dibuat dengan ❤️ untuk membantu UMKM berkembang**

Version: 1.0.0  
Last Updated: August 2024
