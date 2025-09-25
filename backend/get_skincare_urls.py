from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from urllib.parse import urlparse
import time

chrome_driver_path = r"C:\Desktop\skinsense\chromedriver-win64\chromedriver.exe"
service = Service(executable_path=chrome_driver_path)
driver = webdriver.Chrome(service=service)

all_urls = set()

# Retry logic to handle slow or failed pages
def try_load_page(driver, url, retries=3, wait=5):
    for attempt in range(retries):
        try:
            driver.get(url)
            time.sleep(wait)
            return True
        except Exception as e:
            print(f"⚠️ Attempt {attempt + 1} failed for {url}: {e}")
            time.sleep(2)
    print(f"❌ Skipping {url} after {retries} retries.")
    return False

# Scrape pages 1 to 40
for page in range(1, 41):
    url = f"https://skinsort.com/products/page/{page}"
    print(f"🌐 Visiting Page {page}: {url}")

    if not try_load_page(driver, url):
        continue  # Skip this page if it fails after retries

    elements = driver.find_elements(By.CSS_SELECTOR, 'a[href^="/products/"]')
    count_before = len(all_urls)

    for elem in elements:
        href = elem.get_attribute("href")
        if "/products/" in href and len(urlparse(href).path.split("/")) == 4:
            all_urls.add(href)

    print(f"✅ Page {page}: Added {len(all_urls) - count_before} new product URLs.")

# Save to file
all_urls = sorted(all_urls)
print(f"\n🎉 Total unique skincare product URLs scraped: {len(all_urls)}")

with open("skinsort_product_urls.txt", "w", encoding="utf-8") as f:
    for url in all_urls:
        f.write(url + "\n")

driver.quit()
