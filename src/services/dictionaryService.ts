import dictionary from '../dictionary.json';

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

// Cache the filtered word list
let cachedWordList: string[] | null = null;

const getWordList = (): string[] => {
  if (!cachedWordList) {
    cachedWordList = Object.keys(dictionary)
      .filter(word => word.length >= 3 && !word.includes(' '));
  }
  return cachedWordList;
};

// Debug log to check dictionary entry structure
const sampleWord = Object.keys(dictionary)[0];
console.log('Sample word entry:', (dictionary as Dictionary)[sampleWord]);

export const searchWord = async (word: string): Promise<WordResult | null> => {
  try {
    const normalizedWord = word.trim().toLowerCase();
    // Only consider words that are at least 3 letters long and don't contain spaces
    if (normalizedWord.length < 3 || normalizedWord.includes(' ')) {
      return null;
    }
    const exists = normalizedWord in dictionary;
    
    if (exists) {
      return {
        word: normalizedWord,
        definition: (dictionary as Dictionary)[normalizedWord],
        score: calculateScore(normalizedWord)
      };
    }
    return null;
  } catch (error) {
    console.error('Error searching word:', error);
    return null;
  }
};

export const getWordSuggestions = async (prefix: string): Promise<string[]> => {
  try {
    const normalizedPrefix = prefix.toLowerCase();
    const wordList = getWordList();
    
    // Filter words from the dictionary that start with the prefix, are at least 3 letters long, and don't contain spaces
    const suggestions = wordList
      .filter((word: string) => word.startsWith(normalizedPrefix))
      .sort((a: string, b: string) => {
        // First sort by length
        if (a.length !== b.length) {
          return a.length - b.length;
        }
        // If lengths are equal, sort alphabetically
        return a.localeCompare(b);
      })
      .slice(0, 5);

    return suggestions;
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return [];
  }
}; 