import { createContext, useContext, useState } from 'react';
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

  const handleSearch = () => {
    setSearchQuery(inputValue);
  };

  return (
    <FilterContext.Provider value={{ 
      searchQuery, 
      selectedCategory, 
      inputValue, 
      setInputValue, 
      setSelectedCategory, 
      handleSearch 
    }}>
      {children}
    </FilterContext.Provider>
  );
};