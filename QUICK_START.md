# 🚀 QUICK START GUIDE

## Prerequisites
- Python 3.8+
- Node.js 16+
- Git

## Setup & Run (5 minutes)

### Terminal 1: Backend
```bash
cd backend
pip install -r requirements.txt
python -m playwright install chromium
python main.py
```
✅ Tunggu hingga: `Uvicorn running on http://0.0.0.0:8000`

### Terminal 2: Frontend
```bash
cd frontend
npm install
npm run dev
```
✅ Tunggu hingga: `Local: http://localhost:5173/`

### Browser
Buka: **http://localhost:5173**

---

## Fitur yang Sudah Siap

| Fitur | Status |
|-------|--------|
| Scraping Google Maps | ✅ |
| Filter website otomatis | ✅ |
| GSAP smooth animations | ✅ |
| Modern dark theme | ✅ |
| Responsive design | ✅ |
| WhatsApp integration | ✅ |
| Search history | ✅ |
| Environment variables | ✅ |
| Error handling | ✅ |

---

## Testing Checklist

- [ ] Page load animations smooth
- [ ] Search card fade-in saat load
- [ ] Input field focus state works
- [ ] Search button pulse on click
- [ ] Loading state shows spinner
- [ ] Results cards appear dengan stagger animation
- [ ] Hover card lift effect works
- [ ] WhatsApp button buka wa.me URL
- [ ] Google Maps button buka Maps
- [ ] Mobile responsive (test di 480px, 768px)
- [ ] Dark mode terlihat bagus
- [ ] No console errors

---

## Common Issues & Fixes

### "Cannot connect to backend"
```
Solusi:
1. Pastikan backend running: python main.py
2. Check firewall: port 8000 terbuka?
3. Update .env.local: VITE_API_BASE_URL=http://localhost:8000
```

### "Playwright not installed"
```bash
python -m playwright install chromium
```

### "Port 8000 sudah terpakai"
```bash
# Cari process yang pakai port 8000
netstat -ano | findstr :8000

# Kill process (ganti PID dengan nomor yang muncul)
taskkill /PID <PID> /F
```

### "npm install gagal"
```bash
# Clear cache
npm cache clean --force

# Install lagi
npm install
```

---

## File Structure

```
google-maps-scraper/
├── backend/
│   ├── main.py          ← FastAPI server
│   ├── scraper.py       ← Playwright logic
│   ├── database.py      ← SQLite storage
│   └── requirements.txt  ← Python deps
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx      ← Main component (UPDATED ✨)
│   │   ├── App.css      ← Modern styling (UPDATED ✨)
│   │   ├── index.css    ← Global styles
│   │   └── main.jsx     ← Entry point
│   ├── .env.local       ← Local config
│   ├── .env.example     ← Template
│   └── package.json     ← Node deps
│
├── README.md            ← Full documentation
├── UI_IMPROVEMENTS.md   ← UI changes detail
└── SETUP.md            ← Original setup notes
```

---

## API Endpoints

```bash
# Search
GET /api/scrape?keyword=cafe&limit=10

# History
GET /api/history?limit=20

# Clear history
DELETE /api/history
```

---

## Tips & Tricks

### 1. Gunakan keyword spesifik
❌ Bad: "cafe"
✅ Good: "cafe di jakarta" atau "cafe bandung"

### 2. Jangan terlalu banyak limit
❌ Bad: limit=50 (bisa lama)
✅ Good: limit=10-15 (cepat, akurat)

### 3. Tunggu sebelum retry
Jika Google Maps block, tunggu 5-10 menit sebelum coba lagi

### 4. Format nomor WhatsApp
Aplikasi otomatis format:
- `0812345678` → `6281234567` ✅
- `+62812345678` → `62812345678` ✅

### 5. Mobile testing
Buka di phone dengan IP device Anda:
```
http://<your-ip>:5173
```

---

## Performance Tips

1. **Backend**: Buka Chromium headless dengan `headless=True`
2. **Frontend**: CSS animations GPU-accelerated
3. **Network**: Reduce API calls, cache history
4. **Bundle**: Vite build sudah optimized

---

## Deployment

### Backend (Python)
- Heroku / Railway / PythonAnywhere
- Set `host="0.0.0.0"` ✅
- Install playwright: `python -m playwright install chromium`

### Frontend (React)
- Vercel / Netlify / GitHub Pages
- Update `VITE_API_BASE_URL` ke production backend

---

## Troubleshooting Commands

```bash
# Check if services running
curl http://localhost:8000/docs

# Test API
curl "http://localhost:8000/api/scrape?keyword=cafe&limit=1"

# Check GSAP loaded
# Open console, type: window.gsap

# Check env vars
cat frontend/.env.local

# Clear all history
curl -X DELETE http://localhost:8000/api/history
```

---

## Getting Help

1. Check console errors: F12 → Console
2. Check network tab: F12 → Network
3. Check backend logs: Terminal 1
4. Check .env files: Path correct?
5. Check firewall: Ports open?

---

## Next Level Features (Optional)

- [ ] Add export to CSV
- [ ] Add bulk email
- [ ] Add CRM integration
- [ ] Add scheduled scraping
- [ ] Add AI classification
- [ ] Add SMS notifications
- [ ] Add analytics dashboard

---

Happy scraping! 🎉
