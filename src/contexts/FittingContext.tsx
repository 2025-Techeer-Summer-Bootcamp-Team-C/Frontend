import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import type { ReactNode } from "react";

interface FittingContextType {
  showFitting: boolean;
  setShowFitting: (showFitting: boolean) => void;
  isFittingLoading: boolean;
  setIsFittingLoading: (loading: boolean) => void;
  currentUserImageId: number | null;
  setCurrentUserImageId: (id: number | null) => void;
  hasLastSelectedImage: boolean;
}

const FittingContext = createContext<FittingContextType | undefined>(undefined);

export const FittingProvider = ({ children }: { children: ReactNode }) => {
  const [showFitting, setShowFitting] = useState(false);
  const [isFittingLoading, setIsFittingLoading] = useState(false);
  const [currentUserImageId, setCurrentUserImageId] = useState<number | null>(
    null
  );

  // 로그아웃 시 피팅 상태 초기화 이벤트 감지
  useEffect(() => {
    const handleResetFittingState = () => {
      setShowFitting(false);
      setIsFittingLoading(false);
      setCurrentUserImageId(null);
    };

    window.addEventListener("resetFittingState", handleResetFittingState);
    return () =>
      window.removeEventListener("resetFittingState", handleResetFittingState);
  }, []);

  const handleSetShowFitting = useCallback((showFitting: boolean) => {
    setShowFitting(showFitting);
  }, []);

  const handleSetIsFittingLoading = useCallback((loading: boolean) => {
    setIsFittingLoading(loading);
  }, []);

  const handleSetCurrentUserImageId = useCallback((id: number | null) => {
    setCurrentUserImageId(id);
  }, []);

  const hasLastSelectedImage = useMemo(
    () => currentUserImageId !== null,
    [currentUserImageId]
  );

  const value = useMemo(
    () => ({
      showFitting,
      setShowFitting: handleSetShowFitting,
      isFittingLoading,
      setIsFittingLoading: handleSetIsFittingLoading,
      currentUserImageId,
      setCurrentUserImageId: handleSetCurrentUserImageId,
      hasLastSelectedImage,
    }),
    [
      showFitting,
      handleSetShowFitting,
      isFittingLoading,
      handleSetIsFittingLoading,
      currentUserImageId,
      handleSetCurrentUserImageId,
      hasLastSelectedImage,
    ]
  );

  return (
    <FittingContext.Provider value={value}>{children}</FittingContext.Provider>
  );
};

export const useFittingContext = () => {
  const context = useContext(FittingContext);
  if (context === undefined) {
    throw new Error("useFittingContext must be used within a FittingProvider");
  }
  return context;
};
