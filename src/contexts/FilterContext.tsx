import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';

interface FilterContextType {
  searchQuery: string;
  selectedCategory: string;
  inputValue: string;
  setInputValue: (value: string) => void;
  setSelectedCategory: (category: string) => void;
  handleSearch: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider = ({ children }: FilterProviderProps) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('모두 보기');
  const [inputValue, setInputValue] = useState<string>('');

  const handleSearch = useCallback(() => {
    setSearchQuery(inputValue);
  }, [inputValue]);

  const value = useMemo(() => ({
    searchQuery,
    selectedCategory,
    inputValue,
    setInputValue,
    setSelectedCategory,
    handleSearch,
  }), [searchQuery, selectedCategory, inputValue, setInputValue, setSelectedCategory, handleSearch]);

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};