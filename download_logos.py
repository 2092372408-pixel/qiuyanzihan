import requests
from bs4 import BeautifulSoup
import os

headers = {'User-Agent': 'Mozilla/5.0'}
output_dir = r"C:\Users\86151\Desktop\26年8月找实习材料\Rsuem_Website\images"

targets = {
    "cuhk": "https://zh.wikipedia.org/wiki/香港中文大学",
    "xmu": "https://zh.wikipedia.org/wiki/厦门大学",
    "sjtu": "https://zh.wikipedia.org/wiki/上海交通大学",
    "midea": "https://zh.wikipedia.org/wiki/美的集团",
    "cosmx": "https://zh.wikipedia.org/wiki/珠海冠宇"
}

def download_image(name, url):
    try:
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.content, 'html.parser')
        # Find the first image in the infobox
        infobox = soup.find('table', class_='infobox')
        if not infobox:
            print(f"No infobox found for {name}")
            return
        img_tag = infobox.find('img')
        if not img_tag:
            print(f"No image found in infobox for {name}")
            return
            
        img_url = "https:" + img_tag['src']
        # If it's a thumbnail (e.g., thumb/...) try to get the original or just use it
        img_data = requests.get(img_url, headers=headers).content
        
        ext = os.path.splitext(img_url)[1]
        if not ext or '?' in ext:
            ext = '.png'
            
        filename = os.path.join(output_dir, f"logo_{name}{ext}")
        with open(filename, 'wb') as handler:
            handler.write(img_data)
        print(f"Downloaded {name} logo to {filename}")
    except Exception as e:
        print(f"Failed to process {name}: {e}")

for name, url in targets.items():
    download_image(name, url)
