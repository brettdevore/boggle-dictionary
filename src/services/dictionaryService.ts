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

// Type assertion for the dictionary import
const wordList: string[] = dictionary as string[];

export const searchWord = async (word: string): Promise<WordResult | null> => {
  try {
    const normalizedWord = word.trim().toLowerCase();
    const exists = wordList.includes(normalizedWord);
    
    if (exists) {
      return {
        word: normalizedWord,
        definition: 'Valid Boggle word',
        score: calculateScore(normalizedWord)
      };
    }
    return null;
  } catch {
    return null;
  }
};

export const getWordSuggestions = async (prefix: string): Promise<string[]> => {
  try {
    const normalizedPrefix = prefix.toLowerCase();
    
    // Filter words from the dictionary that start with the prefix
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