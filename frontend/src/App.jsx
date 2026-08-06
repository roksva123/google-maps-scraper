import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Clock3,
  Download,
  MapPin,
  Phone,
  Search,
  Sparkles,
  Trash2,
  Zap,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import './App.css';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const gsap = window.gsap;

function App() {
  const [keyword, setKeyword] = useState('cafe di jakarta');
  const [limit, setLimit] = useState(10);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Cari UMKM atau cafe yang belum punya website.');

  const pageRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    gsap?.fromTo(
      '.hero-copy > *, .search-panel, .stat-card, .history-panel',
      { y: 26, opacity: 0, filter: 'blur(8px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, stagger: 0.08, ease: 'power3.out' }
    );
    loadHistory();
  }, []);

  useEffect(() => {
    if (results.length > 0) {
      gsap?.fromTo(
        '.lead-card',
        { y: 24, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.55, stagger: 0.06, ease: 'back.out(1.4)' }
      );
    }
  }, [results]);

  const loadHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/api/history?limit=12`);
      const data = await response.json();
      if (data.status === 'success') {
        setHistory(data.data);
      }
    } catch (error) {
      console.error('Gagal memuat history:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);
    setMessage('Scraper sedang berjalan. Tunggu sebentar ya...');

    gsap.to('.search-button', { scale: 0.96, duration: 0.12, yoyo: true, repeat: 1 });

    try {
      const response = await fetch(
        `${API_URL}/api/scrape?keyword=${encodeURIComponent(keyword)}&limit=${limit}`
      );
      const resData = await response.json();

      if (resData.status === 'success') {
        setResults(resData.data);
        setMessage(`Ditemukan ${resData.count} lead tanpa website untuk "${keyword}".`);
        await loadHistory();
      } else {
        setMessage('Server memberi respons tidak valid.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Gagal mengambil data. Pastikan backend FastAPI sudah menyala.');
    } finally {
      setLoading(false);
    }
  };

  const useHistoryItem = (item) => {
    setKeyword(item.keyword);
    setLimit(item.limit);
    setResults(item.results || []);
    setMessage(`Menampilkan ulang history: "${item.keyword}".`);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const clearSearchHistory = async () => {
    try {
      await fetch(`${API_URL}/api/history`, { method: 'DELETE' });
      setHistory([]);
      setMessage('History pencarian sudah dihapus.');
    } catch (error) {
      console.error('Gagal menghapus history:', error);
      setMessage('Gagal menghapus history.');
    }
  };

  const totalSavedLeads = history.reduce((total, item) => total + item.count, 0);

  const downloadPDF = () => {
    if (results.length === 0) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const lineHeight = 7;
    let yPosition = margin;

    // Title
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('Daftar Cafe/UMKM', margin, yPosition);
    yPosition += 10;

    // Search info
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Keyword: ${keyword}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Total: ${results.length} tempat`, margin, yPosition);
    yPosition += 10;

    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Results list
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    results.forEach((item, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - margin - 10) {
        doc.addPage();
        yPosition = margin;
      }

      // Number and name
      const text = `${index + 1}. ${item.name}`;
      doc.text(text, margin + 3, yPosition);
      yPosition += lineHeight;

      // Address (if available)
      if (item.address && item.address !== 'Tidak ada alamat') {
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        const addressLines = doc.splitTextToSize(`📍 ${item.address}`, pageWidth - margin * 2 - 5);
        doc.text(addressLines, margin + 5, yPosition);
        yPosition += addressLines.length * 5;
      }

      // Phone (if available)
      if (item.phone && item.phone !== 'Tidak ada telepon') {
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.text(`☎️ ${item.phone}`, margin + 5, yPosition);
        yPosition += 5;
      }

      yPosition += 4;
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    // Download
    const filename = `cafe-${keyword.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
  };

  return (
    <main className="app-shell" ref={pageRef}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={18} /> UMKM Prospect Finder
          </div>
          <h1>Cari cafe & UMKM potensial yang belum punya website.</h1>
          <p>
            Masukkan keyword, scraper akan mencari data dari Google Maps, lalu history pencarian
            tersimpan otomatis untuk dipakai lagi nanti.
          </p>
        </div>

        <form onSubmit={handleSearch} className="search-panel">
          <label htmlFor="keyword">Keyword pencarian</label>
          <div className="input-row">
            <div className="input-wrap keyword-input">
              <Search size={20} />
              <input
                id="keyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Contoh: cafe di bandung"
                required
              />
            </div>
            <div className="input-wrap limit-input">
              <Zap size={18} />
              <input
                type="number"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                min="1"
                max="50"
                aria-label="Jumlah hasil"
              />
            </div>
            <button className="search-button" type="submit" disabled={loading}>
              {loading ? 'Mencari...' : 'Mulai Cari'}
            </button>
          </div>
          <p className="helper-text">Filter otomatis: hanya tempat yang belum punya website.</p>
        </form>
      </section>

      <section className="dashboard-grid">
        <article className="stat-card">
          <span>Total History</span>
          <strong>{history.length}</strong>
          <p>Pencarian tersimpan</p>
        </article>
        <article className="stat-card">
          <span>Saved Leads</span>
          <strong>{totalSavedLeads}</strong>
          <p>Lead dari history</p>
        </article>
        <article className="stat-card status-card">
          <span>Status</span>
          <p>{message}</p>
        </article>
      </section>

      <section className="content-grid">
        <div className="results-section" ref={resultsRef}>
          <div className="section-heading">
            <div>
              <span>Lead Results</span>
              <h2>{results.length > 0 ? `${results.length} tempat ditemukan` : 'Belum ada hasil'}</h2>
            </div>
            {results.length > 0 && (
              <button type="button" onClick={downloadPDF} className="download-button" aria-label="Download PDF">
                <Download size={18} />
                Download PDF
              </button>
            )}
          </div>

          {loading && (
            <div className="loading-card">
              <div className="loader" />
              <p>Mengambil data Google Maps...</p>
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="empty-state">
              <Search size={42} />
              <h3>Mulai pencarian pertamamu</h3>
              <p>Contoh: “warung kopi di jogja”, “bakery di jakarta”, atau “barbershop bandung”.</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="lead-grid">
              {results.map((item, index) => {
                const cleanPhone = item.phone?.replace(/[^0-9]/g, '');

                return (
                  <article key={`${item.maps_url}-${index}`} className="lead-card">
                    <div className="card-topline">
                      <span>Tanpa Website</span>
                      <small>#{index + 1}</small>
                    </div>
                    <h3>{item.name}</h3>
                    <p className="detail-line">
                      <MapPin size={17} /> {item.address}
                    </p>
                    <p className="detail-line">
                      <Phone size={17} /> {item.phone}
                    </p>

                    <div className="card-actions">
                      {cleanPhone && item.phone !== 'Tidak ada telepon' && (
                        <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noreferrer" className="wa-link">
                          Hubungi WA
                        </a>
                      )}
                      <a href={item.maps_url} target="_blank" rel="noreferrer" className="maps-link">
                        Maps <ArrowUpRight size={16} />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <aside className="history-panel">
          <div className="history-header">
            <div>
              <span>Search History</span>
              <h2>Pencarian Terakhir</h2>
            </div>
            {history.length > 0 && (
              <button type="button" onClick={clearSearchHistory} className="icon-button" aria-label="Hapus history">
                <Trash2 size={18} />
              </button>
            )}
          </div>

          <div className="history-list">
            {history.length === 0 && <p className="history-empty">History masih kosong.</p>}
            {history.map((item) => (
              <button key={item.id} type="button" className="history-item" onClick={() => useHistoryItem(item)}>
                <div>
                  <strong>{item.keyword}</strong>
                  <span>
                    <Clock3 size={14} /> {item.created_at}
                  </span>
                </div>
                <em>{item.count} lead</em>
              </button>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}

export default App;
