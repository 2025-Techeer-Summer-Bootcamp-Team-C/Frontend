import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface FittingContextType {
  showFitting: boolean;
  setShowFitting: (showFitting: boolean) => void;
}

const FittingContext = createContext<FittingContextType | undefined>(undefined);

export const FittingProvider = ({ children }: { children: ReactNode }) => {
  const [showFitting, setShowFitting] = useState(false);

  return (
    <FittingContext.Provider value={{ showFitting, setShowFitting }}>
      {children}
    </FittingContext.Provider>
  );
};

export const useFittingContext = () => {
  const context = useContext(FittingContext);
  if (context === undefined) {
    throw new Error('useFittingContext must be used within a FittingProvider');
  }
  return context;
};