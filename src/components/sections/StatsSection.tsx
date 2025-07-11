const StatsSection = () => {
  return (
    <section className="w-full bg-white mb-[245px]">
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="flex justify-center items-center">
          <div className="flex justify-center items-center gap-[82px] w-full max-w-[1365px]">
            {/* Stat 1 */}
            <div className="flex flex-col items-center gap-[34px] w-[274px]">
              <div className="text-[#000000] text-[100px] font-inter font-bold leading-[75px] text-center">
                72%
              </div>
              <div className="text-[#7E7E7E] text-[30px] font-inter font-medium leading-[75px] text-center">
                고객리텐션 비율
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center gap-[34px] w-[274px]">
              <div className="text-[#000000] text-[100px] font-inter font-bold leading-[75px] text-center">
                60%
              </div>
              <div className="text-[#7E7E7E] text-[30px] font-inter font-medium leading-[75px] text-center">
                구매 기회비용 절감
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center gap-[34px] w-[351px]">
              <div className="text-[#000000] text-[100px] font-inter font-bold leading-[75px] text-center">
                3
              </div>
              <div className="text-[#7E7E7E] text-[30px] font-inter font-medium leading-[75px] text-center">
                가상피팅 사진 생성 시간(초)
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col items-center gap-[34px] w-[320px]">
              <div className="text-[#000000] text-[100px] font-inter font-bold leading-[75px] text-center">
                340%
              </div>
              <div className="text-[#7E7E7E] text-[30px] font-inter font-medium leading-[75px] text-center">
                서비스 이용 증가율
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
