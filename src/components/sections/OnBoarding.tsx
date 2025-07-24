import onboardingBg from "@/assets/onboarding_bg.webp";

const OnBoarding = ({ textStyle }: { textStyle: string }) => {
  return (
    <div className="relative z-[60] w-full h-[1000px] bg-white">
      <img
        src={onboardingBg}
        alt="onboarding"
        className="w-full h-full object-cover py-[100px] px-[50px]"
      />
      <div className="absolute top-[100px] left-0 w-full h-full text-white text-center font-bold flex flex-col items-center justify-center">
        <div
          className={`text-[44px] mb-[20px] font-pretendard transition-all duration-300 ${textStyle}`}
        >
          클릭 한 번으로 새로운 나를 발견하세요
        </div>
        <div
          className={`text-[28px] font-pretendard transition-all duration-300 ${textStyle}`}
        >
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
