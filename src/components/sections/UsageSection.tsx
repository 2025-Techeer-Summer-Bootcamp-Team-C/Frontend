import { Heart } from "lucide-react";

const UsageSection = () => {
  return (
    <section className="w-full bg-white mb-[308px]">
      <div className="max-w-[1440px] mx-auto px-[67px]">
        {/* Header */}
        <div className="flex flex-col items-center gap-[48px] mb-[96px]">
          {/* Badge */}
          <div className="flex items-center justify-center bg-[#D9D9D9] rounded-[22.5px] px-[9px] py-[8.25px] gap-[7.5px] w-[114px] h-[42px]">
            <span className="text-[rgba(0,0,0,0.5)] text-[15px] font-inter font-bold leading-[22.5px] tracking-[0.05em] text-center">
              사용 방법
            </span>
          </div>

          {/* Title */}
          <h2 className="text-[#000000] text-[70px] font-inter font-bold leading-[75px] text-center max-w-[910px]">
            어떻게 사용하나요?
          </h2>

          {/* Subtitle */}
          <p className="text-[rgba(0,0,0,0.5)] text-[30px] font-inter font-normal leading-[45px] tracking-[-0.011em] text-center max-w-[738px]">
            간단한 3단계로 실제와도 같은 가상 피팅 사진을 완성하세요
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-[96px]">
          {/* Step 1 */}
          <div className="flex items-center gap-[48px]">
            <div className="flex-1">
              <div className="bg-[#D9D9D9] rounded-[20px] p-[30px] relative">
                <div className="absolute -top-[15px] left-[24px] bg-[#D9D9D9] border border-[#000000] rounded-[14.5px] w-[29px] h-[29px] flex items-center justify-center">
                  <span className="text-[#000000] text-[17px] font-inter font-bold leading-[22.5px] tracking-[-0.011em] text-center">
                    1
                  </span>
                </div>
                <h3 className="text-[#000000] text-[20px] font-inter font-bold leading-[30px] tracking-[-0.011em] mb-[28px]">
                  상품 카테고리 설정
                </h3>
                <p className="text-[#000000] text-[15px] font-inter font-normal leading-[22.5px] tracking-[-0.011em]">
                  가상 피팅을 하고자 하는 상품의 카테고리를 설정합니다.
                  <br />
                  아우터, 상의, 하의, 전신으로 구성되어있으며 모든 복종의 의류
                  가상피팅이 가능합니다.
                </p>
              </div>
            </div>

            <div className="flex-1">
              {/* Category Selection */}
              <div className="flex gap-[76px]">
                {/* 2x2 Grid for categories */}
                <div className="grid grid-cols-2 gap-[30px]">
                  <div className="bg-[#FFFFFF] border border-[#494949] rounded-[10px] px-[21px] py-[8px] flex flex-col items-center gap-[8px] shadow-sm w-[85px] h-[60px]">
                    <span className="text-[24px] leading-[19px]">🧥</span>
                    <span className="text-[#000000] text-[10px] font-inter font-bold leading-[13.5px]">
                      아우터
                    </span>
                  </div>
                  <div className="bg-[#494949] border border-[#494949] rounded-[10px] px-[21px] py-[8px] flex flex-col items-center gap-[8px] shadow-sm w-[85px] h-[60px]">
                    <span className="text-[24px] leading-[19px]">👕</span>
                    <span className="text-[#FFFFFF] text-[10px] font-inter font-bold leading-[13.5px]">
                      상의
                    </span>
                  </div>
                  <div className="bg-[#FFFFFF] border border-[#494949] rounded-[10px] px-[21px] py-[8px] flex flex-col items-center gap-[8px] shadow-sm w-[85px] h-[60px]">
                    <span className="text-[24px] leading-[19px]">👖</span>
                    <span className="text-[#000000] text-[10px] font-inter font-bold leading-[13.5px]">
                      하의
                    </span>
                  </div>
                  <div className="bg-[#FFFFFF] border border-[#494949] rounded-[10px] px-[21px] py-[8px] flex flex-col items-center gap-[8px] shadow-sm w-[85px] h-[60px]">
                    <span className="text-[24px] leading-[19px]">👗</span>
                    <span className="text-[#000000] text-[10px] font-inter font-bold leading-[13.5px]">
                      전신
                    </span>
                  </div>
                </div>

                {/* Category tags - 3x4 Grid */}
                <div className="grid grid-cols-3 gap-[12px]">
                  {[
                    { name: "반팔 티셔츠", selected: true },
                    { name: "블라우스", selected: false },
                    { name: "가디건", selected: false },
                    { name: "긴팔 티셔츠", selected: false },
                    { name: "민소매", selected: true },
                    { name: "폴라티", selected: false },
                    { name: "셔츠", selected: false },
                    { name: "후드티", selected: false },
                    { name: "크롭탑", selected: false },
                    { name: "맨투맨", selected: false },
                    { name: "니트", selected: false },
                    { name: "브라탑", selected: false },
                  ].map((tag, index) => (
                    <div
                      key={index}
                      className={`border border-[#494949] rounded-[13.5px] py-[5px] flex items-center justify-center w-[102px] h-[31px] ${
                        tag.selected
                          ? "bg-[#494949] text-[#FFFFFF]"
                          : "bg-[#FFFFFF] text-[#000000]"
                      }`}
                    >
                      <span
                        className={`text-[10px] font-inter leading-[18px] ${
                          tag.selected ? "font-bold" : "font-medium"
                        }`}
                      >
                        {tag.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-[48px]">
            <div className="flex-1">
              <div className="bg-[#D9D9D9] rounded-[20px] p-[30px] relative">
                <div className="absolute -top-[15px] left-[24px] bg-[#D9D9D9] border border-[#000000] rounded-[14.5px] w-[29px] h-[29px] flex items-center justify-center">
                  <span className="text-[#000000] text-[17px] font-inter font-bold leading-[22.5px] tracking-[-0.011em] text-center">
                    2
                  </span>
                </div>
                <h3 className="text-[#000000] text-[20px] font-inter font-bold leading-[30px] tracking-[-0.011em] mb-[28px]">
                  사진 등록
                </h3>
                <p className="text-[#000000] text-[15px] font-inter font-normal leading-[22.5px] tracking-[-0.011em]">
                  사용자 전신 사진과 패션 상품 이미지를 드래그 앤 드롭으로
                  간편하게 업로드 하세요.
                  <br />
                  JPG, PNG등 다양한 형식을 지원합니다.
                </p>
              </div>
            </div>

            <div className="flex-1 flex gap-[24px]">
              {/* User Photo Upload */}
              <div className="flex-1 bg-[#D9D9D9] rounded-[20px] p-[10px] h-[279px] flex flex-col items-center justify-center border-2 border-dashed border-[rgba(0,0,0,0.2)]">
                <div className="text-[#000000] text-[20px] font-inter font-bold leading-[27px] text-center mb-[10px]">
                  사용자 전신 사진 등록
                </div>
                <p className="text-[rgba(0,0,0,0.5)] text-[14px] font-inter font-medium leading-[28px] text-center">
                  드래그 앤 드롭 하거나,
                  <br />
                  클릭해 사진을 올려 주세요.
                </p>
              </div>

              {/* Product Photo Upload */}
              <div className="flex-1 bg-[#D9D9D9] rounded-[21px] p-[12px] h-[279px] flex flex-col items-center justify-center border-2 border-dashed border-[rgba(0,0,0,0.2)]">
                <div className="text-[#000000] text-[21px] font-inter font-bold leading-[28px] text-center mb-[10px]">
                  상품 사진 등록
                </div>
                <p className="text-[rgba(0,0,0,0.5)] text-[14px] font-inter font-medium leading-[28px] text-center">
                  드래그 앤 드롭 하거나,
                  <br />
                  클릭해 사진을 올려 주세요.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-[48px]">
            <div className="flex-1">
              <div className="bg-[#D9D9D9] rounded-[20px] p-[30px] relative">
                <div className="absolute -top-[15px] left-[24px] bg-[#D9D9D9] border border-[#000000] rounded-[14.5px] w-[29px] h-[29px] flex items-center justify-center">
                  <span className="text-[#000000] text-[17px] font-inter font-bold leading-[22.5px] tracking-[-0.011em] text-center">
                    3
                  </span>
                </div>
                <h3 className="text-[#000000] text-[20px] font-inter font-bold leading-[30px] tracking-[-0.011em] mb-[28px]">
                  AI가상피팅 생성
                </h3>
                <p className="text-[#000000] text-[15px] font-inter font-normal leading-[22.5px] tracking-[-0.011em]">
                  AI가 자동으로 고퀄리티 가상피팅 사진과 영상을 생성합니다.
                  <br />
                  생성된 이미지와 영상은 즉시 다운로드하여 사용할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex justify-between gap-[24px]">
                {/* Generated Results */}
                <div className="grid grid-cols-2 gap-[16px]">
                  <div className="bg-[#D9D9D9] rounded-[18px] p-[76px_38px] h-[172px] flex items-center justify-center shadow-md">
                    <span className="text-[#000000] text-[10px] font-inter font-bold leading-[15px] text-center">
                      포즈1 사진
                    </span>
                  </div>
                  <div className="bg-[#D9D9D9] rounded-[18px] p-[76px_38px] h-[172px] flex items-center justify-center shadow-md">
                    <span className="text-[#000000] text-[10px] font-inter font-bold leading-[15px] text-center">
                      포즈2 사진
                    </span>
                  </div>
                  <div className="bg-[#D9D9D9] rounded-[18px] p-[76px_38px] h-[172px] flex items-center justify-center shadow-md">
                    <span className="text-[#000000] text-[10px] font-inter font-bold leading-[15px] text-center">
                      포즈3 사진
                    </span>
                  </div>
                  <div className="bg-[#D9D9D9] rounded-[18px] p-[76px_38px] h-[172px] flex items-center justify-center shadow-md">
                    <span className="text-[#000000] text-[10px] font-inter font-bold leading-[15px] text-center">
                      포즈4 사진
                    </span>
                  </div>
                </div>
                <div className="bg-[#D9D9D9] rounded-[18px] p-[76px_38px] h-[356px] w-[260px] flex items-center justify-center shadow-md">
                  <span className="text-[#000000] text-[10px] font-inter font-bold leading-[15px] text-center">
                    가상피팅 영상
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-center gap-[48px]">
            <div className="flex-1">
              <div className="bg-[#D9D9D9] rounded-[20px] p-[30px] relative">
                <div className="absolute -top-[15px] left-[24px] bg-[#D9D9D9] border border-[#000000] rounded-[14.5px] w-[29px] h-[29px] flex items-center justify-center">
                  <span className="text-[#000000] text-[17px] font-inter font-bold leading-[22.5px] tracking-[-0.011em] text-center">
                    4
                  </span>
                </div>
                <h3 className="text-[#000000] text-[20px] font-inter font-bold leading-[30px] tracking-[-0.011em] mb-[28px]">
                  스타일 분석 및 가상피팅 상품 제안
                </h3>
                <p className="text-[#000000] text-[15px] font-inter font-normal leading-[22.5px] tracking-[-0.011em]">
                  가상피팅된 사진을 바탕으로 AI가 사용자의 패션 스타일을
                  분석하여 알려주고
                  <br />
                  사용자에게 어울리는 상품을 찾아서 제안합니다. 이를 다시
                  가상피팅 할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="flex-1">
              {/* Style Analysis */}
              <div className="mb-[24px]">
                <div className="text-[#000000] text-[22px] font-inter font-normal leading-[55px] text-center mb-[8px]">
                  #트렌디 #젠틀 #스포티 #어른스러운 #남자다운
                </div>
                <div className="text-[rgba(0,0,0,0.5)] text-[22px] font-inter font-normal leading-[55px] text-center mb-[12px]">
                  지금 홍길동님의 스타일에 어울리는 의류10가지를 찾았습니다.
                </div>
                <div className="text-[rgba(0,0,0,0.5)] text-[30px] font-inter font-normal leading-[55px] text-center">
                  .....
                </div>
              </div>

              {/* Product Recommendations */}
              <div className="flex gap-[24px]">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex-1 bg-[#CCCCCC] rounded-[8px] overflow-hidden"
                  >
                    <div className="bg-[#D9D9D9] h-[150px] relative">
                      <div className="absolute top-[9px] left-[9px] w-[20px] h-[20px] bg-[#FFFEFE] rounded-full flex items-center justify-center">
                        <Heart size={16} className="text-[rgba(0,0,0,0.5)]" />
                      </div>
                    </div>
                    <div className="p-[12px]">
                      <div className="text-[#000000] text-[10px] font-inter font-semibold leading-[12px] mb-[4px]">
                        브랜드명
                      </div>
                      <div className="text-[#666666] text-[9px] font-inter font-normal leading-[9px] mb-[12px]">
                        상품명
                      </div>
                      <div className="text-[#333333] text-[12px] font-inter font-semibold leading-[12px] mb-[6px]">
                        가격
                      </div>
                      <div className="text-[#333333] text-[12px] font-inter font-normal leading-[12px]">
                        링크
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UsageSection;
