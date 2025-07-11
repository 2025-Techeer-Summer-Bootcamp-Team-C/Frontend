import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="w-full flex flex-col items-center bg-white mb-[250px] mt-[132px]">
      {/* Hero Content Container */}
      <div className="flex flex-col items-center gap-[96px] w-full">
        {/* Badge */}
        <div className="flex items-center justify-center bg-[#D9D9D9] rounded-[22.5px] px-[9px] py-[8.25px] gap-[7.5px] w-[300px] h-[42px]">
          <span className="text-[rgba(0,0,0,0.5)] text-[15px] font-inter font-bold leading-[22.5px] tracking-[0.05em] text-center">
            온라인 의류 구매의 새로운 패러다임
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-[#000000] text-[112.5px] font-inter font-bold leading-[75px] text-center w-[1437.75px]">
          가상 의류 피팅 <span className="text-[#B7B7B7]">AI</span>
        </h1>

        {/* Empty Text Element */}
        <div className="w-full text-center">
          <span className="text-[rgba(0,0,0,0.5)] text-[30px] font-inter font-normal leading-[45px] tracking-[-0.011em] text-center">
            {" "}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-[23.25px]">
          <Button
            variant="outline"
            className="group h-[63.75px] w-[226.5px] border-[#333333] border-[0.75px] rounded-[9px] bg-white hover:bg-[#333333] transition-colors px-[30px] py-[10.5px]"
          >
            <span className="text-[18.75px] font-inter font-bold leading-[15px] text-[#333333] group-hover:text-white transition-colors">
              GET START
            </span>
          </Button>
          <Button
            variant="outline"
            className="group h-[62.25px] w-[225.75px] border-[#333333] border-[0.75px] rounded-[9px] bg-white hover:bg-[#333333] transition-colors px-[30px] py-[10.5px]"
          >
            <span className="text-[18.75px] font-inter font-bold leading-[15px] text-[#333333] group-hover:text-white transition-colors">
              VIEW MORE
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
