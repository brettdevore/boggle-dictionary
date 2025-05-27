import { useState, useEffect } from 'react';
import { searchWord, getWordSuggestions, loadDictionary, clearDictionaryCache } from './services/dictionaryService';
import type { WordResult } from './services/dictionaryService';
import { Autocomplete, TextField } from '@mui/material';
import GoogleLogo from './components/GoogleLogo';
import './App.css';

function App() {
  const [search, setSearch] = useState('');
  const [result, setResult] = useState<WordResult | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Preload dictionary on app load
  useEffect(() => {
    // Clear cache to ensure we get the latest dictionary
    clearDictionaryCache();
    loadDictionary();
  }, []);

  useEffect(() => {
    if (!search) return setSuggestions([]);
    // Remove debounce for instant suggestions
    (async () => {
      setSuggestions(await getWordSuggestions(search));
    })();
  }, [search]);

  const handleSearch = async (word: string | null) => {
    if (!word) return setResult(null);
    setLoading(true);
    setResult(await searchWord(word));
    setLoading(false);
  };

  return (
    <div className="app">
      <div className="container">
        <div className="logo-container"><GoogleLogo /></div>
        <p className="subtitle"><strong>Find your Boggle word:</strong></p>
        <div className="search-container">
          <Autocomplete
            freeSolo
            options={suggestions}
            inputValue={search}
            onInputChange={(_, v) => setSearch(v)}
            onChange={(_, v) => handleSearch(v)}
            ListboxProps={{
              style: {
                maxHeight: 48 * 7, // 7 items at 48px each
                overflowY: 'auto',
              },
            }}
            renderInput={(params) => (
              <TextField {...params} placeholder="Type your word..." variant="outlined" fullWidth />
            )}
            className="search-input"
          />
        </div>
        {loading && <p className="loading">Checking word...</p>}
        {result && (
          <div className="results">
            <div className="result-card">
              <div className="result-header">
                <h2>{result.word}</h2>
                <span className="score">{result.score} {result.score === 1 ? 'point' : 'points'}</span>
              </div>
              <p className="definition">{result.definition}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
