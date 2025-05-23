import axios from 'axios';

export interface WordResult {
  word: string;
  definition: string;
  score: number;
}

export interface DictionaryEntry {
  word: string;
  phonetic: string;
  phonetics: Array<{
    text: string;
    audio: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example: string;
    }>;
  }>;
}

const calculateScore = (word: string): number => {
  // Ensure we're counting each character exactly once
  const length = word.trim().length;
  return Math.max(0, length - 2);
};

export const searchWord = async (word: string): Promise<WordResult | null> => {
  try {
    const response = await axios.get<DictionaryEntry[]>(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    
    if (response.data && response.data.length > 0) {
      const entry = response.data[0];
      const wordToScore = entry.word.trim();
      return {
        word: wordToScore,
        definition: entry.meanings[0]?.definitions[0]?.definition || 'No definition available',
        score: calculateScore(wordToScore)
      };
    }
    return null;
  } catch {
    return null;
  }
};

export const getWordSuggestions = async (prefix: string): Promise<string[]> => {
  try {
    // Get suggestions from Datamuse API with more results
    const response = await axios.get(
      `https://api.datamuse.com/words?sp=${prefix}*&max=30&md=d`
    );
    
    // Filter and sort suggestions
    const suggestions = response.data
      .map((item: { word: string }) => item.word)
      .filter((word: string) => {
        // Include all words that start with the prefix
        const startsWithPrefix = word.toLowerCase().startsWith(prefix.toLowerCase());
        // Include three-letter words even if they don't match the prefix exactly
        const isThreeLetter = word.length === 3;
        return startsWithPrefix || isThreeLetter;
      })
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
    console.error('Error fetching suggestions:', error);
    return [];
  }
}; 