# 🐳 DOCKER SETUP GUIDE

## Prasyarat

- **Docker** - [Download di sini](https://www.docker.com/products/docker-desktop)
- **Docker Compose** - Biasanya included dengan Docker Desktop

Cek instalasi:
```bash
docker --version
docker-compose --version
```

---

## 🚀 Jalankan dengan Docker (1 Command!)

### Step 1: Clone Repository
```bash
git clone https://github.com/username/google-maps-scraper.git
cd google-maps-scraper
```

### Step 2: Run Docker Compose
```bash
docker-compose up
```

✅ **Tunggu sampai muncul output:**
```
backend | INFO:     Uvicorn running on http://0.0.0.0:8000
frontend | VITE v5.x.x  ready in xxx ms
```

### Step 3: Buka Browser
Navigasi ke: **http://localhost:5173**

---

## 🔧 Commands Berguna

### Start services
```bash
docker-compose up
```

### Start di background
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### Rebuild images (setelah install dependencies baru)
```bash
docker-compose up --build
```

### View logs
```bash
# Semua services
docker-compose logs -f

# Hanya backend
docker-compose logs -f backend

# Hanya frontend
docker-compose logs -f frontend
```

### Shell ke dalam container
```bash
# Backend
docker-compose exec backend bash

# Frontend
docker-compose exec frontend sh
```

---

## 📋 Apa yang Terjadi?

Docker Compose akan:
1. ✅ Build backend image dengan Python 3.11 + Playwright
2. ✅ Build frontend image dengan Node.js 18
3. ✅ Install semua dependencies otomatis
4. ✅ Run backend di port 8000
5. ✅ Run frontend di port 5173
6. ✅ Connect keduanya via network

---

## 🌍 Akses dari Device Lain

Backend berjalan di container, tapi accessible dari:
- **Local machine**: `http://localhost:8000`
- **From other devices**: `http://<your-ip>:8000`

Frontend accessible dari:
- **Local machine**: `http://localhost:5173`
- **From other devices**: `http://<your-ip>:5173`

Cek IP Anda:
```bash
# Windows
ipconfig

# macOS/Linux
ifconfig
```

Kemudian teman bisa akses: `http://192.168.x.x:5173` (ganti dengan IP kamu)

---

## 🔴 Troubleshooting

### Port sudah terpakai
Jika port 8000 atau 5173 sudah dipakai, ubah di `docker-compose.yml`:
```yaml
ports:
  - "8001:8000"  # Ubah port external (8001)
  - "5174:5173"  # Ubah port external (5174)
```

### Build gagal
```bash
# Clear cache
docker-compose down -v

# Rebuild
docker-compose up --build
```

### Out of memory
Docker butuh ~2GB RAM free. Kalau error OOM:
1. Buka Docker Desktop settings
2. Tingkatkan memory allocation (misal 4GB)
3. Restart Docker

### Playwright timeout
Jika scraping timeout saat di Docker, cek:
- Internet connection stabil?
- Google Maps tidak memblock?
- Coba keyword yang lebih spesifik

---

## 📝 Production Deployment

### Push ke Docker Hub
```bash
# Login
docker login

# Tag image
docker tag google-maps-scraper-backend username/gmaps-backend:latest

# Push
docker push username/gmaps-backend:latest
```

### Deploy ke cloud (contoh: Railway, Render, DigitalOcean)
1. Connect GitHub repo
2. Set up Docker Compose
3. Deploy otomatis on every push

---

## 🆚 Docker vs Local

| Aspek | Docker | Local |
|-------|--------|-------|
| Setup time | 2-3 menit (first time) | 5-10 menit |
| Dependencies conflict | ❌ Nggak mungkin | ⚠️ Bisa terjadi |
| Shareable | ✅ Gampang | ❌ Repot (harus install semua) |
| Port management | ✅ Otomatis | ⚠️ Manual |
| Performance | ✅ Native (Linux native) | ✅ Native |
| Debugging | ⚠️ Sedikit lebih susah | ✅ Lebih mudah |

---

## 💡 Tips

1. **First time setup**: `docker-compose up --build` buat ensure image build fresh
2. **Development**: Gunakan `docker-compose up` aja, volume mounting auto-reload code
3. **Production**: Disable hot-reload, set `NODE_ENV=production`
4. **Multi-machine**: Pastikan firewall port 8000 & 5173 terbuka

---

## 🔗 Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

---

Happy containerizing! 🚀
