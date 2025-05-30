export interface WordResult {
  word: string;
  definition: string;
  score: number;
}

const calculateScore = (word: string): number => {
  // Ensure we're counting each character exactly once
  const length = word.trim().length;
  return Math.max(0, length - 2);
};

// Type the dictionary as a record of word to definition
type Dictionary = Record<string, string>;

let dictionaryCache: Dictionary | null = null;
let currentDictionary: string = 'boggleDictionary.json'; // Default dictionary
let loadingPromise: Promise<Dictionary> | null = null;

export function setCurrentDictionary(dictionaryFile: string): void {
  if (currentDictionary !== dictionaryFile) {
    console.log(`Switching dictionary from ${currentDictionary} to ${dictionaryFile}`);
    currentDictionary = dictionaryFile;
    // Clear cache when switching dictionaries
    dictionaryCache = null;
    loadingPromise = null;
  }
}

export async function loadDictionary(): Promise<Dictionary> {
  if (dictionaryCache) return dictionaryCache;
  
  // If already loading, return the existing promise
  if (loadingPromise) return loadingPromise;
  
  console.log(`Loading dictionary: ${currentDictionary}`);
  
  loadingPromise = (async () => {
    const res = await fetch(`/${currentDictionary}`);
    const data = await res.json();
    dictionaryCache = data as Dictionary;
    console.log(`Dictionary loaded successfully: ${currentDictionary} (${Object.keys(dictionaryCache).length} words)`);
    return dictionaryCache;
  })();
  
  return loadingPromise;
}

export function clearDictionaryCache(): void {
  dictionaryCache = null;
  loadingPromise = null;
}

export const searchWord = async (word: string): Promise<WordResult | null> => {
  const dictionary = await loadDictionary();
  const normalizedWord = word.trim().toLowerCase();
  // Only consider words that are at least 3 letters long and don't contain spaces
  if (normalizedWord.length < 3 || normalizedWord.includes(' ')) {
    return null;
  }
  if (normalizedWord in dictionary) {
      return {
      word: normalizedWord,
      definition: dictionary[normalizedWord],
      score: calculateScore(normalizedWord)
      };
    }
    return null;
};

export const getWordSuggestions = async (prefix: string): Promise<string[]> => {
  const dictionary = await loadDictionary();
  const normalizedPrefix = prefix.toLowerCase();
  let suggestions = Object.keys(dictionary)
    .filter(word => word.length >= 3 && !word.includes(' ') && word.startsWith(normalizedPrefix))
    .sort((a, b) => {
      if (a.length !== b.length) return a.length - b.length;
      return a.localeCompare(b);
    });

  // Only prioritize the standard 's' ending plural
  const baseIdx = suggestions.indexOf(normalizedPrefix);
  const plural = normalizedPrefix + 's';
  const pluralIdx = suggestions.indexOf(plural);

  if (pluralIdx !== -1) {
    const [pluralWord] = suggestions.splice(pluralIdx, 1);
    if (baseIdx !== -1) {
      suggestions.splice(baseIdx + 1, 0, pluralWord);
    } else {
      suggestions.unshift(pluralWord);
    }
  }

  return suggestions.slice(0, 21);
}; 
