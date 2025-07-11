const FeaturesSection = () => {
  return (
    <section className="w-full bg-white mb-[340px]">
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col items-center gap-[48px] mb-[96px]">
          {/* Badge */}
          <div className="flex items-center justify-center bg-[#D9D9D9] rounded-[22.5px] px-[9px] py-[8.25px] gap-[7.5px] w-[114px] h-[42px]">
            <span className="text-[rgba(0,0,0,0.5)] text-[15px] font-inter font-bold leading-[22.5px] tracking-[0.05em] text-center">
              핵심기능
            </span>
          </div>

          {/* Title */}
          <h2 className="text-[#000000] text-[70px] font-inter font-bold leading-[75px] text-center max-w-[910px]">
            왜 FiTIN을 선택해야 할까요?
          </h2>

          {/* Subtitle */}
          <p className="text-[rgba(0,0,0,0.5)] text-[30px] font-inter font-normal leading-[45px] tracking-[-0.011em] text-center max-w-[1000px]">
            AI 기술로 온라인 의류 구매의 새로운 기준을 제시합니다.
          </p>
        </div>

        {/* Features Grid */}
        <div className="flex flex-wrap justify-center gap-[41px]">
          {/* Feature Card 1 */}
          <div className="bg-[#F4E8E8] border border-[#000000] rounded-[30px] p-[34px_27px] w-[284px] h-[234px] flex flex-col justify-center items-center gap-[10px]">
            <div className="w-[230px] flex flex-col justify-center gap-[21px]">
              <h3 className="text-[#000000] text-[20px] font-inter font-bold leading-[30px] tracking-[-0.011em] text-left w-[229px] h-[45px]">
                AI 가상 피팅
              </h3>
              <p className="text-[#000000] text-[15px] font-inter font-normal leading-[22.5px] tracking-[-0.011em] text-center h-[100px]">
                패션 상품 이미지 1장만으로 고퀄리티 가상 피팅사진을 10초 이내에
                자동 생성합니다. 최신 AI 기술로 자연스럽고 현실적인 결과물을
                제공합니다.
              </p>
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-[#F4E8E8] border border-[#000000] rounded-[30px] p-[34px_16px] w-[284px] h-[234px] flex flex-col justify-center items-center gap-[10px]">
            <div className="w-[230px] flex flex-col gap-[17px]">
              <h3 className="text-[#000000] text-[20px] font-inter font-bold leading-[30px] tracking-[-0.011em] text-left h-[45px]">
                다양한 상품군
              </h3>
              <p className="text-[#000000] text-[15px] font-inter font-normal leading-[22.5px] tracking-[-0.011em] text-center h-[100px]">
                아우터, 상의, 하의, 전신 카테고리 상품군의 가상피팅을
                제공합니다. 상품군의 제한 없이 가상피팅 서비스를 이용해보세요.
              </p>
            </div>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-[#F4E8E8] border border-[#000000] rounded-[30px] p-[11px_14px] w-[289px] h-[234px] flex flex-col justify-center items-center gap-[10px]">
            <div className="w-[230px] flex flex-col gap-[17px]">
              <h3 className="text-[#000000] text-[20px] font-inter font-bold leading-[30px] tracking-[-0.011em] text-left h-[45px]">
                간편한 사용
              </h3>
              <p className="text-[#000000] text-[15px] font-inter font-normal leading-[22.5px] tracking-[-0.011em] text-center h-[100px]">
                복잡한 설정 없이 클릭 몇 번이면 누구나 쉽게 사용할 수 있는
                직관적인 인터페이스를 제공합니다. 디자인 전문 지식이 필요하지
                않습니다.
              </p>
            </div>
          </div>

          {/* Feature Card 4 */}
          <div className="bg-[#F4E8E8] border border-[#000000] rounded-[30px] p-[29px_27px] w-[284px] h-[234px] flex flex-col justify-center items-center gap-[10px]">
            <div className="w-[230px] flex flex-col gap-[17px]">
              <h3 className="text-[#000000] text-[20px] font-inter font-bold leading-[30px] tracking-[-0.011em] text-left h-[45px]">
                시간과 비용 절감
              </h3>
              <p className="text-[#000000] text-[15px] font-inter font-normal leading-[22.5px] tracking-[-0.011em] text-center h-[114px]">
                옷을 입어보기 위해 오프라인 매장을 더 이상 방문 하지 않아도 되서
                쇼핑의 시간과 비용을 60% 이상 절역할 수 있습니다. 가상피팅
                서비스로 큰 효과를 얻어보세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
