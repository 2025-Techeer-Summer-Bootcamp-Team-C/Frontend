import { useState, useEffect, useCallback, useRef } from "react";
import onboardingBg from "@/assets/onboarding_bg.webp";

interface OnBoardingProps {
  scale?: number;
  translateY?: number;
  opacity?: number;
}

const OnBoarding = ({
  scale = 1,
  translateY = 0,
  opacity = 1,
}: OnBoardingProps) => {
  const [textOpacity, setTextOpacity] = useState(0);
  const [textTransformY, setTextTransformY] = useState(50);
  const rafRef = useRef<number>(0);

  // 스크롤 구간 설정
  const videoSectionHeight = 800; // VideoSection 높이
  const onboardingHeight = 1000; // OnBoarding 섹션 높이
  const fadeInStart = videoSectionHeight - 100; // 페이드인 시작 (500px)
  const fadeInEnd = videoSectionHeight + 100; // 페이드인 완료 (1000px)
  const fadeOutStart = videoSectionHeight + 200; // 페이드아웃 시작 (1100px)
  const fadeOutEnd = videoSectionHeight + onboardingHeight; // 페이드아웃 완료 (1600px)

  // Easing 함수
  const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);

  // 스크롤 핸들러
  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const scrollY = window.scrollY;

      // 기존 텍스트 애니메이션
      if (scrollY < fadeInStart) {
        // 애니메이션 시작 전 - 숨김 상태
        setTextOpacity(0);
        setTextTransformY(50);
      } else if (scrollY >= fadeInStart && scrollY <= fadeInEnd) {
        // 페이드인 구간 - 아래에서 위로 나타남
        const progress = (scrollY - fadeInStart) / (fadeInEnd - fadeInStart);
        const easedProgress = easeOut(progress);
        setTextOpacity(easedProgress);
        setTextTransformY(50 - easedProgress * 50); // 50px → 0px
      } else if (scrollY > fadeInEnd && scrollY < fadeOutStart) {
        // 완전히 표시된 상태
        setTextOpacity(1);
        setTextTransformY(0);
      } else if (scrollY >= fadeOutStart && scrollY <= fadeOutEnd) {
        // 페이드아웃 구간 - 위로 사라짐
        const progress = (scrollY - fadeOutStart) / (fadeOutEnd - fadeOutStart);
        const easedProgress = easeOut(progress);
        setTextOpacity(1 - easedProgress);
        setTextTransformY(-easedProgress * 50); // 0px → -50px
      } else {
        // 완전히 사라진 상태
        setTextOpacity(0);
        setTextTransformY(-50);
      }
    });
  }, [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // 초기 상태 설정

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll]);
  return (
    <div
      className="relative z-[60] w-full h-[1000px] bg-white overflow-hidden transition-all duration-300 ease-out"
      style={{
        transform: `translateY(${translateY}px)`,
      }}
    >
      {/* 배경 이미지 - 스케일 애니메이션 적용 */}
      <img
        src={onboardingBg}
        alt="onboarding"
        className="w-full h-full object-cover pt-[100px] pb-[50px] transition-transform duration-300 ease-out"
        style={{
          transform: `scale(${scale})`,
          opacity: opacity,
        }}
      />
      {/* 텍스트 영역 - 동적 애니메이션 */}
      <div
        className="absolute top-[50px] left-0 w-full h-full text-white text-center font-bold flex flex-col items-center justify-center"
        style={{
          opacity: textOpacity,
          transform: `translateY(${textTransformY}px)`,
        }}
      >
        <div className="text-[44px] mb-[20px] font-pretendard">
          클릭 한 번으로 새로운 나를 발견하세요
        </div>
        <div className="text-[28px] font-pretendard">
          당신의 사진이 모든 옷의 피팅모델이 됩니다. AI가 완벽하게 합성해서 진짜
          입은 것처럼 보여드려요. <br />
          이제 다른 사람이 입은 옷 사진은 보지 마세요. 당신이 입은 모습만 보면
          됩니다.
        </div>
      </div>
    </div>
  );
};

export default OnBoarding;
