import { useState, useEffect, useCallback, useRef } from "react";

const MorphLogo = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [positionState, setPositionState] = useState<
    "fixed" | "absolute" | "scaling"
  >("fixed");

  const absoluteStartPoint = 800; // absolute 구간 시작 지점
  const scalingStartPoint = 1000; // 축소 시작 지점 (200px 구간 후)
  const scalingEndPoint = 2000; // 축소 완료 지점
  const rafRef = useRef<number>(0);

  // Easing 함수 - ease-out 곡선 (부드러운 감속)
  const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);

  // Morph logo scroll behavior - 3단계 애니메이션
  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const scrollY = window.scrollY;

      if (scrollY < absoluteStartPoint) {
        // 1단계: fixed 상태, 큰 크기 유지
        setPositionState("fixed");
        setScrollProgress(0);
      } else if (scrollY >= absoluteStartPoint && scrollY < scalingStartPoint) {
        // 2단계: absolute 상태, 고정된 top 위치에서 100px 구간 동안 머무름
        setPositionState("absolute");
        setScrollProgress(0);
      } else if (scrollY >= scalingStartPoint && scrollY <= scalingEndPoint) {
        // 3단계: scaling 상태, fixed로 돌아가면서 크기 축소
        setPositionState("scaling");
        const rawProgress =
          (scrollY - scalingStartPoint) / (scalingEndPoint - scalingStartPoint);
        const easedProgress = easeOut(Math.min(rawProgress, 1));
        setScrollProgress(easedProgress);
      } else {
        // 축소 완료: 헤더 크기로 고정
        setPositionState("scaling");
        setScrollProgress(1);
      }
    });
  }, [absoluteStartPoint, scalingStartPoint, scalingEndPoint]);

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

  // 크기 및 위치 계산
  const getLogoStyles = () => {
    const baseSize = 200;
    const headerSize = 60;
    const baseTop = 300;
    const headerTop = 40;

    switch (positionState) {
      case "fixed":
        // 1단계: 초기 fixed 상태
        return {
          position: "fixed" as const,
          fontSize: `${baseSize}px`,
          height: `${baseSize}px`,
          top: `${baseTop}px`,
        };

      case "absolute":
        // 2단계: absolute 상태, 고정된 위치에서 100px 구간 동안 머무름
        return {
          position: "absolute" as const,
          fontSize: `${baseSize}px`,
          height: `${baseSize}px`,
          top: `${absoluteStartPoint + baseTop}px`, // 절대 위치로 계산
        };

      case "scaling":
        // 3단계: fixed로 돌아가면서 크기 축소(top은 200px 구간 후 고정)
        const logoSize = baseSize - scrollProgress * (baseSize - headerSize);
        const topPosition =
          baseTop - 200 - scrollProgress * (baseTop - 200 - headerTop);
        return {
          position: "fixed" as const,
          fontSize: `${logoSize}px`,
          height: `${logoSize}px`,
          top: `${topPosition}px`,
        };

      default:
        return {
          position: "fixed" as const,
          fontSize: `${baseSize}px`,
          height: `${baseSize}px`,
          top: `${baseTop}px`,
        };
    }
  };

  const logoStyles = getLogoStyles();

  return (
    <div>
      {/* Morph Logo with 3-phase scroll animation */}
      <div
        className="left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black font-butler z-[65] pointer-events-none transition-opacity duration-300"
        style={logoStyles}
      >
        Morph
      </div>
    </div>
  );
};

export default MorphLogo;
