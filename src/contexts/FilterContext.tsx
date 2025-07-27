import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';

interface FilterContextType {
  searchQuery: string;
  selectedCategoryId: number | null;
  inputValue: string;
  setInputValue: (value: string) => void;
  setSelectedCategoryId: (categoryId: number | null) => void;
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
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null); // null = 모두 보기
  const [inputValue, setInputValue] = useState<string>('');

  const handleSearch = useCallback(() => {
    setSearchQuery(inputValue);
  }, [inputValue]);

  const value = useMemo(() => ({
    searchQuery,
    selectedCategoryId,
    inputValue,
    setInputValue,
    setSelectedCategoryId,
    handleSearch,
  }), [searchQuery, selectedCategoryId, inputValue, setInputValue, setSelectedCategoryId, handleSearch]);

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};