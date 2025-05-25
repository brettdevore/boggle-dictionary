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

export async function loadDictionary(): Promise<Dictionary> {
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

const isPluralForm = (word: string, otherWord: string): boolean => {
  // Check if word is plural of otherWord
  if (word === otherWord + 's') return true;
  // Check for words ending in 'y' that become 'ies'
  if (otherWord.endsWith('y') && word === otherWord.slice(0, -1) + 'ies') return true;
  return false;
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
