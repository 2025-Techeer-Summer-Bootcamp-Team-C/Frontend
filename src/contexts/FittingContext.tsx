import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';

interface FittingContextType {
  showFitting: boolean;
  setShowFitting: (showFitting: boolean) => void;
}

const FittingContext = createContext<FittingContextType | undefined>(undefined);

export const FittingProvider = ({ children }: { children: ReactNode }) => {
  const [showFitting, setShowFitting] = useState(false);

  // 로그아웃 시 피팅 상태 초기화 이벤트 감지
  useEffect(() => {
    const handleResetFittingState = () => {
      setShowFitting(false);
    };

    window.addEventListener("resetFittingState", handleResetFittingState);
    return () => window.removeEventListener("resetFittingState", handleResetFittingState);
  }, []);

  const handleSetShowFitting = useCallback((showFitting: boolean) => {
    setShowFitting(showFitting);
  }, []);

  const value = useMemo(() => ({
    showFitting,
    setShowFitting: handleSetShowFitting,
  }), [showFitting, handleSetShowFitting]);

  return (
    <FittingContext.Provider value={value}>
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