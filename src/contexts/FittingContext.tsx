import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';

interface FittingContextType {
  showFitting: boolean;
  setShowFitting: (showFitting: boolean) => void;
  isFittingLoading: boolean;
  setIsFittingLoading: (loading: boolean) => void;
  lastSelectedImage: File | null;
  setLastSelectedImage: (image: File | null) => void;
  hasLastSelectedImage: boolean;
}

const FittingContext = createContext<FittingContextType | undefined>(undefined);

export const FittingProvider = ({ children }: { children: ReactNode }) => {
  const [showFitting, setShowFitting] = useState(false);
  const [isFittingLoading, setIsFittingLoading] = useState(false);
  const [lastSelectedImage, setLastSelectedImage] = useState<File | null>(null);

  // 로그아웃 시 피팅 상태 초기화 이벤트 감지
  useEffect(() => {
    const handleResetFittingState = () => {
      setShowFitting(false);
      setIsFittingLoading(false);
      setLastSelectedImage(null);
    };

    window.addEventListener("resetFittingState", handleResetFittingState);
    return () => window.removeEventListener("resetFittingState", handleResetFittingState);
  }, []);

  const handleSetShowFitting = useCallback((showFitting: boolean) => {
    setShowFitting(showFitting);
  }, []);

  const handleSetIsFittingLoading = useCallback((loading: boolean) => {
    setIsFittingLoading(loading);
  }, []);

  const handleSetLastSelectedImage = useCallback((image: File | null) => {
    setLastSelectedImage(image);
  }, []);

  const hasLastSelectedImage = useMemo(() => lastSelectedImage !== null, [lastSelectedImage]);

  const value = useMemo(() => ({
    showFitting,
    setShowFitting: handleSetShowFitting,
    isFittingLoading,
    setIsFittingLoading: handleSetIsFittingLoading,
    lastSelectedImage,
    setLastSelectedImage: handleSetLastSelectedImage,
    hasLastSelectedImage,
  }), [showFitting, handleSetShowFitting, isFittingLoading, handleSetIsFittingLoading, lastSelectedImage, handleSetLastSelectedImage, hasLastSelectedImage]);

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