cleaned_urls = []

with open("skinsort_product_urls.txt", "r", encoding="utf-8") as f:
    for line in f:
        url = line.strip()
        if "/products/page/" not in url:
            cleaned_urls.append(url)

with open("pdturlscleaned.txt", "w", encoding="utf-8") as f:
    for url in cleaned_urls:
        f.write(url + "\n")

print(f"✅ Cleaned and saved {len(cleaned_urls)} product URLs.")
