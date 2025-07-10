import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative w-full h-[600px] flex flex-col shadow-[0_4px_4px_rgba(0,0,0,0.08)] bg-[#E6E6E6] overflow-hidden">
      {/* Center circle */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute mr-[400px] w-[1000px] h-[1000px] bg-gradient-to-br from-[#F5C6C7] to-[#D2AAA8] rounded-full top-1/2 -translate-y-1/2 -right-96 z-0"></div>
      </div>
      {/* Main content area */}
      <div className="flex flex-1 relative z-10">
        {/* Main content */}
        <div className="flex-1 flex flex-col justify-center px-20 py-20 relative z-10">
          {/* Title */}
          <h1 className="font-inter font-normal text-[60px] leading-[60px] text-black mb-[10px] relative z-10">
            AI가상 피팅 서비스 <span className="font-bold">FITIN</span>
          </h1>

          {/* Subtitle */}
          <p className="font-inter font-normal text-[24px] leading-[150%] text-black/50 mb-[18px] max-w-[800px] tracking-[-0.011em] relative z-10">
            클릭만으로 완성하는 가상의류 피팅. 3초만에 완성되는 가상 의류
            피팅으로 새로운 온라인 쇼핑을 경험해보세요.
          </p>

          {/* Buttons */}
          <div className="flex gap-6 relative z-10">
            <Button
              variant="outline"
              className="h-[40px] w-[150px] bg-[#e6e6e6] border-[#333333] rounded-[30px] font-inter font-bold text-[16px] leading-[20px] text-[#333333] hover:bg-[#333333] hover:text-white transition-colors"
            >
              GET START
            </Button>
            <Button
              variant="outline"
              className="h-[40px] w-[150px] bg-[#e6e6e6] border-[#333333] rounded-[30px] font-inter font-bold text-[16px] leading-[20px] text-[#333333] hover:bg-[#333333] hover:text-white transition-colors"
            >
              VIEW MORE
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
