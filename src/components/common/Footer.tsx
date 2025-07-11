const Footer = () => {
  return (
    <footer className="w-full bg-[#333333] relative">
      <div className="w-full h-[247px] flex items-start justify-between">
        <div className="ml-[106.54px] mt-[49px]">
          {/* Company Info */}
          <div className="mb-[55px]">
            <h2 className="text-[#FFFFFF] text-[30px] font-inter font-bold leading-[18px] mb-[25.54px]">
              FITIN
            </h2>
            <div className="flex flex-col gap-[6px]">
              <div className="text-[#FFFFFF] text-[12px] font-inter font-normal leading-[18px]">
                주소
              </div>
              <div className="text-[#FFFFFF] text-[12px] font-inter font-normal leading-[14.5px]">
                전화번호
              </div>
              <div className="text-[#FFFFFF] text-[12px] font-inter font-normal leading-[14.5px]">
                이메일
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-[#FFFFFF] text-[12px] font-inter font-normal leading-[12px]">
            © 2025 FITIN, All Rights Reserved.
          </div>
        </div>

        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[#8D8C8C] text-center max-w-[600px]">
            <p className="text-[20px] font-inter font-normal leading-[30px]">
              클릭만으로 완성하는 가상의류 피팅.
            </p>
            <p className="text-[16px] font-inter font-normal leading-[24px] mt-[8px]">
              3초만에 완성되는 가상 의류 피팅으로 새로운 온라인 쇼핑을
              경험해보세요.
            </p>
          </div>
        </div>

        {/* Right spacer to balance layout */}
        <div className="w-[183.54px]"></div>
      </div>
    </footer>
  );
};

export default Footer;
