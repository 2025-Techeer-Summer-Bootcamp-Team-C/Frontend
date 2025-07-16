import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginDialog from "@/components/dialogs/LoginDialog";
import type { HeaderVariant } from "@/types/variants";

interface HeaderProps {
  variant?: HeaderVariant;
}

const Header = ({ variant = "default" }: HeaderProps) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("모두 보기");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY > lastScrollY ? 1 : -1;

      // 스크롤 진행도 계산 (0~200px 구간에서 0~1로 매핑)
      const maxScrollDistance = 100;
      const rawProgress = Math.min(currentScrollY / maxScrollDistance, 1);

      // 스크롤 방향에 따른 가속도 적용(지금은 그대로임)
      let adjustedProgress;
      if (scrollDirection > 0) {
        // 아래로 스크롤 시
        adjustedProgress = Math.min(rawProgress * 1, 1);
      } else {
        // 위로 스크롤 시
        adjustedProgress = Math.max(rawProgress * 1, 0);
      }

      setScrollProgress(adjustedProgress);
      setLastScrollY(currentScrollY);
    };

    // 스크롤 이벤트 리스너 등록
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    // 이제 .filter를 사용해서 카테고리별 상품 목록 표시
  };

  // 각 변형별 표시 여부 결정
  const showNavigation = variant === "default";
  const showSearch =
    variant === "default" || variant === "detail" || variant === "cart";
  const showUserActions = variant === "default" || variant === "detail";

  // 카테고리 메뉴 아이템들
  const categoryItems = ["모두 보기", "상의", "하의", "아우터"];

  const filterItems = ["보기", "2", "3", "필터"];

  return (
    <header className="fixed top-0 left-0 w-full bg-transparent z-50 hover:bg-white/70 group">
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
                    <LoginDialog>
                      <span
                        className="text-black text-[9px] md:text-[10px] font-inter text-center w-auto h-4 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity"
                        onClick={() => setIsLogin(!isLogin)}
                      >
                        {isLogin ? "로그아웃" : "로그인"}
                      </span>
                    </LoginDialog>
                    <span className="text-black text-[9px] md:text-[10px] font-inter text-center w-6 md:w-8 h-4 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity">
                      도움말
                    </span>
                    <span
                      className="text-black text-[9px] md:text-[10px] font-inter text-center w-[50px] md:w-[62px] h-4 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity"
                      onClick={() => navigate("/cart")}
                    >
                      장바구니(4)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          {showNavigation && (
            <div
              className="mt-[60px] md:mt-[80px] transition-all duration-300 ease-out overflow-hidden group-hover:!transform-none group-hover:!opacity-100 group-hover:!max-h-[100px]"
              style={{
                transform: `translateY(-${scrollProgress * 100}%)`,
                opacity: 1 - scrollProgress,
                maxHeight: `${(1 - scrollProgress) * 100}px`,
                // marginTop: `${60 - scrollProgress * 30}px`,
              }}
            >
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
