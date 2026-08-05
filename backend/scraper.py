import asyncio
import threading
from concurrent.futures import ThreadPoolExecutor
from playwright.async_api import async_playwright


def _run_scraper_sync(keyword: str, max_results: int):
    """Wrapper untuk menjalankan Playwright di thread terpisah dengan event loop sendiri"""

    # Buat event loop baru di thread ini
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        return loop.run_until_complete(_scrape_impl(keyword, max_results))
    finally:
        loop.close()


async def _scrape_impl(keyword: str, max_results: int):
    async with async_playwright() as p:
        # Jalankan browser (headless=True jika tidak ingin melihat browser terbuka)
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        try:
            # Buka Google Maps
            search_query = keyword.replace(" ", "+")
            await page.goto(f"https://www.google.com/maps/search/{search_query}", timeout=30000)
            await page.wait_for_timeout(3000)

            results = []

            # Scroll panel samping untuk memuat tempat lebih banyak
            for _ in range(3):
                await page.mouse.wheel(0, 5000)
                await page.wait_for_timeout(2000)

            # Ambil semua elemen toko/kafe yang tampil
            items = await page.query_selector_all('a[href*="/maps/place/"]')

            # Simpan URL detail unik
            urls = set()
            for item in items:
                href = await item.get_attribute('href')
                if href and "/maps/place/" in href:
                    # Hapus query params untuk consistency
                    clean_url = href.split("?")[0] if "?" in href else href
                    urls.add(clean_url)
                if len(urls) >= max_results:
                    break

            # Kunjungi setiap lokasi untuk ambil detail data
            for url in urls:
                try:
                    await page.goto(url, timeout=30000)
                    await page.wait_for_timeout(2000)

                    # 1. CEK FILTER KRUSIAL: Apakah tempat memiliki Website?
                    # Cek HANYA selector spesifik (data-item-id="authority")
                    has_website = False

                    # Selector 1: Link website OFFICIAL di panel detail
                    website_link = await page.query_selector('a[data-item-id="authority"]')
                    if website_link:
                        has_website = True
                        print(f"🔗 Website detected via authority selector - {url}")

                    # FILTER UTAMA: Jika ada website OFFICIAL, SKIP/ABAIKAN
                    if has_website:
                        print(f"⏭️  SKIP - {url} (sudah punya website)")
                        continue

                    # 2. Ambil Nama Tempat
                    name_el = await page.query_selector('h1')
                    name = await name_el.inner_text() if name_el else "Tanpa Nama"
                    name = name.strip() if name else "Tanpa Nama"

                    # 3. Ambil Nomor Telepon
                    phone = None
                    phone_el = await page.query_selector('button[data-item-id^="phone:"]')
                    if phone_el:
                        aria_label = await phone_el.get_attribute('aria-label')
                        if aria_label:
                            # Parse nomor dari aria-label
                            phone = aria_label.replace("Telepon: ", "").replace("Phone: ", "").strip()
                            # Clean nomor: hanya ambil digits dan +
                            phone = ''.join(c for c in phone if c.isdigit() or c == '+')

                    # 4. Ambil Alamat
                    address = None
                    address_el = await page.query_selector('button[data-item-id="address"]')
                    if address_el:
                        aria_label = await address_el.get_attribute('aria-label')
                        if aria_label:
                            address = aria_label.replace("Alamat: ", "").replace("Address: ", "").strip()

                    # Hanya tambahkan ke results jika ada nama
                    if name and name != "Tanpa Nama":
                        results.append({
                            "name": name,
                            "phone": phone,
                            "address": address,
                            "maps_url": url,
                            "has_website": False
                        })
                        print(f"✅ Added - {name}")

                except Exception as e:
                    print(f"⚠️  Error scraping {url}: {e}")
                    continue

            await browser.close()
            return results

        except Exception as e:
            print(f"❌ Fatal error in scraper: {e}")
            await browser.close()
            return []


async def scrape_google_maps(keyword: str, max_results: int = 20):
    """Async wrapper yang menjalankan scraper di thread pool"""
    loop = asyncio.get_event_loop()
    executor = loop._default_executor or ThreadPoolExecutor()
    return await loop.run_in_executor(executor, _run_scraper_sync, keyword, max_results)