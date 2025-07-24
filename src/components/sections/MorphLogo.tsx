import { useState, useEffect, useCallback, useRef } from "react";

const MorphLogo = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const shrinkStartPoint = 900; // 축소 시작 지점 (기존 release 지점)
  const shrinkEndPoint = 2000; // 축소 완료 지점 (1000px 구간에서 축소)
  const rafRef = useRef<number>(0);

  // Easing 함수 - ease-out 곡선 (부드러운 감속)
  const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);

  // Morph logo scroll behavior - 부드러운 크기 축소 애니메이션
  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const scrollY = window.scrollY;

      if (scrollY < shrinkStartPoint) {
        // 축소 시작 전: 큰 크기 유지
        setScrollProgress(0);
      } else if (scrollY >= shrinkStartPoint && scrollY <= shrinkEndPoint) {
        // 축소 진행 중: 0에서 1까지의 진행도 with easing
        const rawProgress =
          (scrollY - shrinkStartPoint) / (shrinkEndPoint - shrinkStartPoint);
        const easedProgress = easeOut(Math.min(rawProgress, 1));
        setScrollProgress(easedProgress);
      } else {
        // 축소 완료: 헤더 크기로 고정
        setScrollProgress(1);
      }
    });
  }, [shrinkStartPoint, shrinkEndPoint]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial position check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll]);

  // 크기 계산: 200px에서 75px로 축소 (easing 적용)
  const logoSize = 200 - scrollProgress * 125; // 200px → 75px
  const topPosition = 300 - scrollProgress * 235; // top-[300px] → top-[65px] (헤더 중앙)

  return (
    <div>
      {/* Morph Logo with scroll-based size transition */}
      <div
        className="fixed left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black font-butler z-[65] pointer-events-none transition-opacity duration-300"
        style={{
          fontSize: `${logoSize}px`,
          height: `${logoSize}px`,
          top: `${topPosition}px`,
        }}
      >
        Morph
      </div>
    </div>
  );
};

export default MorphLogo;
