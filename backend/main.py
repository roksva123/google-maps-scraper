import sys
import asyncio

# HARUS di awal sebelum apapun - fix untuk Windows Playwright
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from scraper import scrape_google_maps
from database import clear_history, get_history, init_db, save_search

app = FastAPI(title="UMKM Lead Finder API")
init_db()

# Izinkan CORS agar React bisa berkomunikasi dengan FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/scrape")
async def run_scraper(keyword: str = "cafe di jakarta", limit: int = 10):
    safe_limit = max(1, min(limit, 50))
    data = await scrape_google_maps(keyword=keyword, max_results=safe_limit)
    history_id = save_search(keyword=keyword, limit_count=safe_limit, results=data)
    return {"status": "success", "history_id": history_id, "count": len(data), "data": data}


@app.get("/api/history")
async def list_history(limit: int = 20):
    safe_limit = max(1, min(limit, 100))
    return {"status": "success", "data": get_history(safe_limit)}


@app.delete("/api/history")
async def delete_history():
    clear_history()
    return {"status": "success", "message": "History berhasil dihapus"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)