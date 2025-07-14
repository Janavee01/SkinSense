from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import csv
import os
import time
import random
import json

# CONFIG
PRODUCT_URLS_FILE = "pdturlscleaned.txt"
OUTPUT_FILE = "detailsofpdt.csv"
START_INDEX = 0
MAX_PRODUCTS = 401
SAVE_EVERY = 5
WAIT_TIMEOUT = 15
DELAY_BETWEEN = 3

# Load URLs
with open(PRODUCT_URLS_FILE, "r") as f:
    product_urls = [line.strip() for line in f if line.strip()]

# CSV setup
file_exists = os.path.exists(OUTPUT_FILE)
csv_file = open(OUTPUT_FILE, mode='a', newline='', encoding='utf-8')
writer = csv.writer(csv_file)
if not file_exists:
    writer.writerow(["Name", "URL", "Ingredients", "Benefits", "Concerns", "Rating"])

# Browser options
options = Options()
options.add_argument("--headless=new")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--window-size=1920,1080")
driver = webdriver.Chrome(options=options)

def safe_get(driver, url, retries=3, delay=5):
    for _ in range(retries):
        try:
            driver.get(url)
            return True
        except:
            time.sleep(delay)
    return False

for idx, url in enumerate(product_urls[START_INDEX:START_INDEX + MAX_PRODUCTS], start=START_INDEX + 1):
    print(f"🔍 Scraping {idx}/{len(product_urls)}: {url}")
    try:
        if not safe_get(driver, url):
            print(f"❌ Failed to load {url}")
            continue

        time.sleep(DELAY_BETWEEN + random.uniform(1, 2))
        WebDriverWait(driver, WAIT_TIMEOUT).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "h1"))
        )

        soup = BeautifulSoup(driver.page_source, "html.parser")

        name = soup.find("h1").get_text(strip=True) if soup.find("h1") else "Unknown"

# ✅ Extract Key Ingredients (with description)
        ingredients = "Not Found"
        try:
            key_ingredients_section = soup.find("h3", string=lambda text: text and "Key Ingredients" in text)
            if key_ingredients_section:
                ingredient_buttons = key_ingredients_section.find_next("div").find_all("button")
                items = []
                for btn in ingredient_buttons:
                    name_tag = btn.select_one("span.font-medium")
                    desc_tag = name_tag.find_next("span") if name_tag else None
                    ing_name = name_tag.get_text(strip=True) if name_tag else ""
                    desc = desc_tag.get_text(strip=True) if desc_tag else ""
                    if ing_name:
                        items.append(f"{ing_name} – {desc}" if desc else ing_name)
                        
                ingredients = "; ".join(items) if items else "Not Found"
        except Exception as e:
            print("Key ingredient extraction error:", e)

        # Extract Benefits
        benefit_section = soup.find("h3", string=lambda t: t and "Benefit" in t)
        benefits = "Not Found"
        if benefit_section:
            benefit_items = benefit_section.find_next("div").find_all("span", class_="font-medium")
            benefits = "; ".join(b.get_text(strip=True) for b in benefit_items if b.get_text(strip=True))

        # Extract Concerns (from “What’s inside”)
        concerns = []
        concern_section = soup.find("h2", string=lambda t: t and "What's inside" in t)
        if concern_section:
            for btn in concern_section.find_next("div").find_all("span", class_="text-warm-gray-900"):
                concerns.append(btn.get_text(strip=True))
        concerns = "; ".join(concerns) or "Not Found"

        # Extract rating
        import json

# Extract rating from JSON-LD
        rating = "Not Found"
        for script_tag in soup.find_all("script", type="application/ld+json"):
            try:
                data = json.loads(script_tag.string)
                if isinstance(data, dict) and "aggregateRating" in data:
                    rating = data["aggregateRating"].get("ratingValue", "Not Found")
                    break
            except Exception:
                continue

        # Write to CSV
        writer.writerow([name, url, ingredients, benefits, concerns, rating])
        if idx % SAVE_EVERY == 0:
            csv_file.flush()

    except Exception as e:
        print(f"❌ Error scraping {url}: {e}")

csv_file.close()
driver.quit()
print(f"✅ Done! Data saved in '{OUTPUT_FILE}'")
