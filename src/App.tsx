import { useState, useEffect } from 'react';
import { searchWord, getWordSuggestions, loadDictionary, clearDictionaryCache, setCurrentDictionary } from './services/dictionaryService';
import type { WordResult } from './services/dictionaryService';
import { Autocomplete, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import BoggleLogo from './components/BoggleLogo';
import './App.css';

type DictionaryType = 'NWL 2023' | 'MW Scrabble' | 'CSW 2024';

// Map dropdown values to dictionary files
const DICTIONARY_FILE_MAP: Record<DictionaryType, string> = {
  'MW Scrabble': 'boggleDictionary.json',
  'NWL 2023': 'NWL2023.json',
  'CSW 2024': 'CSW2024.json'
};

function App() {
  const [search, setSearch] = useState('');
  const [result, setResult] = useState<WordResult | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [dictionaryLoading, setDictionaryLoading] = useState(false);
  const [selectedDictionary, setSelectedDictionary] = useState<DictionaryType>('NWL 2023');

  // Preload dictionary on app load
  useEffect(() => {
    const loadNewDictionary = async () => {
      setDictionaryLoading(true);
      // Set the default dictionary based on initial selection
      setCurrentDictionary(DICTIONARY_FILE_MAP[selectedDictionary]);
      
      // Clear cache to ensure we get the latest dictionary
      clearDictionaryCache();
      await loadDictionary();
      setDictionaryLoading(false);
    };
    
    loadNewDictionary();
  }, [selectedDictionary]);

  // Reset search state when dictionary changes
  useEffect(() => {
    setSearch('');
    setSuggestions([]);
    setResult(null);
  }, [selectedDictionary]);

  useEffect(() => {
    if (!search || dictionaryLoading) return setSuggestions([]);
    // Remove debounce for instant suggestions
    (async () => {
      setSuggestions(await getWordSuggestions(search));
    })();
  }, [search, dictionaryLoading]);

  const handleSearch = async (word: string | null) => {
    if (!word) return setResult(null);
    setLoading(true);
    setResult(await searchWord(word));
    setLoading(false);
  };

  const handleDictionaryChange = (dictionary: DictionaryType) => {
    setSelectedDictionary(dictionary);
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <BoggleLogo />
          <h2 className="subtitle-main">Word Checker</h2>
          <p className="subtitle">Find out if your boggle word is real</p>
        </header>
        
        <main className="main-content">
          <div className="search-section">
            <Autocomplete
              key={selectedDictionary}
              freeSolo
              options={suggestions}
              inputValue={search}
              onInputChange={(_, v) => setSearch(v)}
              onChange={(_, v) => handleSearch(v)}
              disabled={dictionaryLoading}
              ListboxProps={{
                style: {
                  maxHeight: 48 * 7, // 7 items at 48px each
                  overflowY: 'auto',
                },
              }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  placeholder={dictionaryLoading ? "Enter word..." : "Enter word..."} 
                  variant="outlined" 
                  fullWidth 
                  className="search-field"
                />
              )}
              className="search-input"
            />
          </div>
          
          {loading && (
            <div className="loading-state">
              <div className="loading-indicator"></div>
              <p className="loading-text">Checking word...</p>
            </div>
          )}
          
          {result && (
            <div className="results-section">
              <div className="result-card">
                <div className="result-header">
                  <h2 className="word-title">{result.word.toUpperCase()}</h2>
                  <div className="score-badge">
                    <span className="score-number">{result.score}</span>
                    <span className="score-label">{result.score === 1 ? 'point' : 'points'}</span>
                  </div>
                </div>
                <div className="definition-section">
                  <p className="definition">{result.definition}</p>
                </div>
              </div>
            </div>
          )}
        </main>
        
        <div className="dictionary-selector">
          <FormControl variant="outlined" size="small" className="dictionary-select">
            <InputLabel id="dictionary-select-label">Select Dictionary</InputLabel>
            <Select
              labelId="dictionary-select-label"
              value={selectedDictionary}
              onChange={(e) => handleDictionaryChange(e.target.value as DictionaryType)}
              label="Dictionary"
            >
              <MenuItem value="MW Scrabble">MW Scrabble (strictest)</MenuItem>
              <MenuItem value="NWL 2023">NWL 2023 (official)</MenuItem>
              <MenuItem value="CSW 2024">CSW 2024 (international)</MenuItem>
            </Select>
          </FormControl>
        </div>
        
        <footer className="footer">
          <p className="footer-text">made with 🖤 for boggle nerds</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
