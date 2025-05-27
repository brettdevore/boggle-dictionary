import json
import sys

def process_words():
    # Read the scraped entries (list of words)
    with open('public/scraped_entries.json', 'r') as f:
        words = [line.strip() for line in f if line.strip()]
    
    # Read the dictionary
    with open('public/boggleDictionary.json', 'r') as f:
        dictionary = json.load(f)
    
    # Create output with words and their definitions
    output = {}
    found_count = 0
    not_found_count = 0
    words_not_found = []
    
    for word in words:
        if word in dictionary:
            output[word] = dictionary[word]
            found_count += 1
        else:
            output[word] = "Definition not found"
            words_not_found.append(word)
            not_found_count += 1
    
    # Write the output to a new JSON file
    with open('words_with_definitions.json', 'w') as f:
        json.dump(output, f, indent=2)
    
    # Write the words without definitions to a separate file
    with open('words_without_definitions.json', 'w') as f:
        json.dump(words_not_found, f, indent=2)
    
    print(f"Processing complete!")
    print(f"Total words processed: {len(words)}")
    print(f"Definitions found: {found_count}")
    print(f"Definitions not found: {not_found_count}")
    print(f"Output saved to: words_with_definitions.json")
    print(f"Words without definitions saved to: words_without_definitions.json")

if __name__ == "__main__":
    process_words() 
