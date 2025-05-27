import json
import requests
import time
from bs4 import BeautifulSoup

def scrape_merriam_webster_definition(word: str) -> str:
    """
    Scrape a word definition from Merriam-Webster main dictionary website
    """
    try:
        url = f"https://www.merriam-webster.com/dictionary/{word}"
        
        # Add headers to mimic a real browser
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Look for the definition using the .dtText selector
            definition_element = soup.select_one('.dtText')
            
            if definition_element:
                # Extract text and clean it up
                definition_text = definition_element.get_text(strip=True)
                
                # Clean up the definition
                definition_text = definition_text.replace('\n', ' ').replace('\t', ' ')
                # Remove extra spaces
                definition_text = ' '.join(definition_text.split())
                
                # Remove common formatting artifacts
                definition_text = definition_text.replace(': ', '')
                definition_text = definition_text.strip()
                
                # Limit length to avoid very long definitions
                if len(definition_text) > 300:
                    definition_text = definition_text[:300] + "..."
                
                return definition_text
            
            # If .dtText not found, try alternative selectors
            alt_selectors = [
                '.sb-0 .dtText',
                '.definition .dtText',
                '.sense .dtText',
                '.dt',
                '.definition'
            ]
            
            for selector in alt_selectors:
                element = soup.select_one(selector)
                if element:
                    definition_text = element.get_text(strip=True)
                    definition_text = definition_text.replace('\n', ' ').replace('\t', ' ')
                    definition_text = ' '.join(definition_text.split())
                    definition_text = definition_text.replace(': ', '')
                    definition_text = definition_text.strip()
                    
                    if len(definition_text) > 300:
                        definition_text = definition_text[:300] + "..."
                    
                    return definition_text
        
        return "Definition not found"
    
    except Exception as e:
        print(f"Error scraping '{word}': {e}")
        return "Definition not found"

# Test with some words from our missing list
test_words = ["covid", "botox", "adorbs", "fam", "stan", "deepfake", "activewear", "alprazolam"]

print("Testing main Merriam-Webster scraper:")
for word in test_words:
    print(f"\nScraping: {word}")
    definition = scrape_merriam_webster_definition(word)
    print(f"Result: {definition}")
    time.sleep(0.5)  # Be respectful with delays 