import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Define the search history item interface
export interface SearchHistoryItem {
  id: string;
  text: string;
  timestamp: number;
  type: 'text' | 'image';
  imageUrl?: string;
}

// Define the context interface
interface SearchHistoryContextType {
  searchHistory: SearchHistoryItem[];
  addSearchItem: (text: string, type: 'text' | 'image', imageUrl?: string) => void;
  removeSearchItem: (id: string) => void;
  clearSearchHistory: () => void;
  isIncognito: boolean;
  setIsIncognito: (isIncognito: boolean) => void;
}

// Create the context with a default value
const SearchHistoryContext = createContext<SearchHistoryContextType>({
  searchHistory: [],
  addSearchItem: () => {},
  removeSearchItem: () => {},
  clearSearchHistory: () => {},
  isIncognito: false,
  setIsIncognito: () => {},
});

// Storage key for local storage
const STORAGE_KEY = 'google_lens_clone_search_history';
const INCOGNITO_KEY = 'google_lens_clone_incognito_mode';

// Create a provider component
export function SearchHistoryProvider({ children }: { children: ReactNode }) {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isIncognito, setIsIncognito] = useState(false);

  // Load search history from local storage on component mount
  useEffect(() => {
    const storedHistory = localStorage.getItem(STORAGE_KEY);
    if (storedHistory) {
      try {
        setSearchHistory(JSON.parse(storedHistory));
      } catch (error) {
        console.error('Error parsing search history from local storage:', error);
        setSearchHistory([]);
      }
    }

    const storedIncognito = localStorage.getItem(INCOGNITO_KEY);
    if (storedIncognito) {
      setIsIncognito(storedIncognito === 'true');
    }
  }, []);

  // Save search history to local storage whenever it changes
  useEffect(() => {
    if (!isIncognito) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(searchHistory));
    }
  }, [searchHistory, isIncognito]);

  // Save incognito mode state to local storage
  useEffect(() => {
    localStorage.setItem(INCOGNITO_KEY, String(isIncognito));
  }, [isIncognito]);

  // Function to add a new search item
  const addSearchItem = (text: string, type: 'text' | 'image', imageUrl?: string) => {
    if (isIncognito) return; // Don't save searches in incognito mode

    if (!text.trim()) return; // Don't add empty searches

    const newItem: SearchHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      text: text.trim(),
      timestamp: Date.now(),
      type,
      imageUrl,
    };

    // Add to beginning of array and remove duplicates
    setSearchHistory(prev => {
      const filteredHistory = prev.filter(item => item.text !== newItem.text);
      return [newItem, ...filteredHistory].slice(0, 20); // Keep only the latest 20 searches
    });
  };

  // Function to remove a search item
  const removeSearchItem = (id: string) => {
    setSearchHistory(prev => prev.filter(item => item.id !== id));
  };

  // Function to clear all search history
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Update incognito mode
  const handleSetIsIncognito = (value: boolean) => {
    setIsIncognito(value);
  };

  return (
    <SearchHistoryContext.Provider
      value={{
        searchHistory,
        addSearchItem,
        removeSearchItem,
        clearSearchHistory,
        isIncognito,
        setIsIncognito: handleSetIsIncognito,
      }}
    >
      {children}
    </SearchHistoryContext.Provider>
  );
}

// Custom hook to use the search history context
export function useSearchHistory() {
  const context = useContext(SearchHistoryContext);
  if (context === undefined) {
    throw new Error('useSearchHistory must be used within a SearchHistoryProvider');
  }
  return context;
}
