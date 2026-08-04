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

        # Buka Google Maps
        search_query = keyword.replace(" ", "+")
        await page.goto(f"https://www.google.com/maps/search/{search_query}")
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
                urls.add(href)
            if len(urls) >= max_results:
                break

        # Kunjungi setiap lokasi untuk ambil detail data
        for url in urls:
            try:
                await page.goto(url)
                await page.wait_for_timeout(2000)

                # 1. Cek apakah tempat memiliki Website
                # Jika tombol/link website ada, kita SKIP tempat ini
                website_element = await page.query_selector('a[data-item-id="authority"]')
                if website_element:
                    continue  # Filter: Abaikan jika sudah ada website!

                # 2. Ambil Nama Tempat
                name_el = await page.query_selector('h1')
                name = await name_el.inner_text() if name_el else "Tanpa Nama"

                # 3. Ambil Nomor Telepon
                phone_el = await page.query_selector('button[data-item-id^="phone:"]')
                phone = "Tidak ada telepon"
                if phone_el:
                    aria_label = await phone_el.get_attribute('aria-label')
                    if aria_label:
                        phone = aria_label.replace("Telepon: ", "").replace("Phone: ", "").strip()

                # 4. Ambil Alamat
                address_el = await page.query_selector('button[data-item-id="address"]')
                address = "Tidak ada alamat"
                if address_el:
                    aria_label = await address_el.get_attribute('aria-label')
                    if aria_label:
                        address = aria_label.replace("Alamat: ", "").replace("Address: ", "").strip()

                results.append({
                    "name": name,
                    "phone": phone,
                    "address": address,
                    "maps_url": url,
                    "has_website": False
                })

            except Exception as e:
                print(f"Error scraping {url}: {e}")
                continue

        await browser.close()
        return results


async def scrape_google_maps(keyword: str, max_results: int = 20):
    """Async wrapper yang menjalankan scraper di thread pool"""
    loop = asyncio.get_event_loop()
    executor = loop._default_executor or ThreadPoolExecutor()
    return await loop.run_in_executor(executor, _run_scraper_sync, keyword, max_results)