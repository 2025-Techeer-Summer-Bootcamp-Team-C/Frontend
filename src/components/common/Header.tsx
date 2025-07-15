import { useState } from "react";
import { useNavigate } from "react-router-dom";

type HeaderVariant = "기본" | "상세페이지" | "장바구니" | "주문";

interface HeaderProps {
  variant?: HeaderVariant;
}

const Header = ({ variant = "기본" }: HeaderProps) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("모두 보기");

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    // 여기에 카테고리별 페이지 이동 로직 추가 가능
    // navigate(`/category/${category}`);
  };

  // 각 변형별 표시 여부 결정
  const showNavigation = variant === "기본";
  const showSearch =
    variant === "기본" || variant === "상세페이지" || variant === "장바구니";
  const showUserActions = variant === "기본" || variant === "상세페이지";

  // 카테고리 메뉴 아이템들
  const categoryItems = ["모두 보기", "상의", "하의", "아우터"];

  const filterItems = ["보기", "2", "3", "필터"];

  return (
    <header className="w-full bg-white">
      {/* Main Header */}
      <div className="flex items-center justify-center py-5">
        <div className="w-full max-w-[1329px] px-4 lg:px-8 xl:px-0">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div
                className="w-[200px] md:w-[262px] h-[80px] md:h-[109px] flex items-center justify-center cursor-pointer"
                onClick={handleLogoClick}
              >
                <span className="text-black text-[32px] md:text-[50px] font-inter leading-none">
                  Techeer Fashion
                </span>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col items-end gap-2 md:gap-4">
              {/* Top Row - Search and User Actions */}
              <div className="flex items-center gap-3 md:gap-5">
                {/* Search */}
                {showSearch && (
                  <div className="w-[120px] md:w-[170px]">
                    <input
                      type="text"
                      placeholder="검색"
                      className="w-full bg-transparent border-b-1 border-black outline-none text-black text-[9px] md:text-[10px] font-inter leading-tight pb-1 placeholder-black focus:border-black"
                    />
                  </div>
                )}

                {/* User Actions */}
                {showUserActions && (
                  <div className="flex items-center gap-3 md:gap-5">
                    <span className="text-black text-[9px] md:text-[10px] font-inter text-center w-6 md:w-8 h-4 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity">
                      로그인
                    </span>
                    <span className="text-black text-[9px] md:text-[10px] font-inter text-center w-6 md:w-8 h-4 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity">
                      도움말
                    </span>
                    <span className="text-black text-[9px] md:text-[10px] font-inter text-center w-[50px] md:w-[62px] h-4 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity">
                      장바구니(0)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          {showNavigation && (
            <div className="mt-[60px] md:mt-[99px]">
              <div className="w-full max-w-[1200px] py-2">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
                  {/* Category Menu */}
                  <div className="flex flex-wrap items-center gap-2 md:gap-4">
                    {categoryItems.map((item, index) => (
                      <span
                        key={index}
                        onClick={() => handleCategoryClick(item)}
                        className={`text-black text-[9px] md:text-[10px] font-inter leading-4 cursor-pointer hover:opacity-70 transition-all whitespace-nowrap ${
                          selectedCategory === item
                            ? "font-bold"
                            : "font-normal"
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Filter Options */}
                  <div className="flex items-center gap-1 md:gap-1">
                    {filterItems.map((item, index) => (
                      <span
                        key={index}
                        className="text-black text-[9px] md:text-[10px] font-inter leading-4 cursor-pointer hover:opacity-70 transition-opacity ml-2"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
