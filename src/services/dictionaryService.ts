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

async function loadDictionary(): Promise<Dictionary> {
  if (dictionaryCache) return dictionaryCache;
  const res = await fetch('/dictionary.json');
  const data = await res.json();
  dictionaryCache = data as Dictionary;
  return dictionaryCache;
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
  return Object.keys(dictionary)
    .filter(word => word.length >= 3 && !word.includes(' ') && word.startsWith(normalizedPrefix))
    .sort((a, b) => a.length !== b.length ? a.length - b.length : a.localeCompare(b))
    .slice(0, 5);
}; 
