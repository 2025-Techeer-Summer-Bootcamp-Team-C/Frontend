import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginDialog from "@/components/dialogs/LoginDialog";
import { useFilter } from "@/contexts/FilterContext";
import type { HeaderVariant } from "@/types/variants";
import { useCart } from "@/contexts/CartContext";
import { useLogoutMutation } from "@/hooks/useAuth";
import { useHeaderSticky } from "@/hooks/useHeaderSticky";

interface HeaderProps {
  variant?: HeaderVariant;
  showSearch?: boolean;
  showUserActions?: boolean;
  showNavigation?: boolean;
}

const Header = ({
  showSearch,
  showUserActions,
  showNavigation,
}: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    inputValue,
    setInputValue,
    handleSearch,
    selectedCategory,
    setSelectedCategory,
  } = useFilter();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  const isSticky = useHeaderSticky();

  // 로그인 상태 체크
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("access_token");
      setIsLogin(!!token);
    };

    // 컴포넌트 마운트 시 로그인 상태 체크
    checkLoginStatus();

    // 커스텀 이벤트 리스너 (같은 탭에서 로그인 상태 변경 감지)
    const handleLoginStatusChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("loginStatusChange", handleLoginStatusChange);

    return () => {
      window.removeEventListener("loginStatusChange", handleLoginStatusChange);
    };
  }, []);
  const { cartData } = useCart();
  const cartCount = cartData?.cart_product?.length || 0;
  const { mutate: logoutMutation } = useLogoutMutation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY > lastScrollY ? 1 : -1;
      const isHomePage = location.pathname === "/";

      if (isHomePage) {
        // 비디오 섹션 내에서의 스크롤 진행도 계산
        const maxScrollDistance = 100;
        const rawProgress = Math.min(currentScrollY / maxScrollDistance, 1);

        let adjustedProgress;
        if (scrollDirection > 0) {
          adjustedProgress = Math.min(rawProgress * 1, 1);
        } else {
          adjustedProgress = Math.max(rawProgress * 1, 0);
        }

        setScrollProgress(adjustedProgress);
      } else {
        // 다른 페이지에서는 항상 메뉴 숨김
        setScrollProgress(1);
      }

      setLastScrollY(currentScrollY);
    };

    // 스크롤 이벤트 리스너 등록
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 초기 실행
    handleScroll();

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, location.pathname]);

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleLogout = () => {
    logoutMutation();
  };

  // 카테고리 메뉴 아이템들
  const categoryItems = ["모두 보기", "상의", "하의", "아우터"];

  const filterItems = ["보기", "2", "3", "필터"];

  const isHomePage = location.pathname === "/";

  return (
    <header
      className={`${
        isHomePage && !isSticky
          ? "relative bg-transparent"
          : "fixed top-0 left-0 bg-transparent"
      } w-full z-50 hover:bg-white/70 group transition-all duration-300`}
    >
      {/* Main Header */}
      <div className="flex items-center justify-center py-5">
        <div className="w-full max-w-[1440px] px-4 lg:px-8 xl:px-0">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div
                className="w-[200px] md:w-[262px] h-[80px] md:h-[109px] flex items-center justify-center cursor-pointer"
                onClick={handleLogoClick}
              >
                <span className="text-black text-[32px] md:text-[50px] leading-none font-butler">
                  Morph
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
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                      className="w-full bg-transparent border-b-1 border-black outline-none text-black text-[9px] md:text-[10px] font-inter leading-tight pb-1 placeholder-black focus:border-black"
                    />
                  </div>
                )}

                {/* User Actions */}
                {showUserActions && (
                  <div className="flex items-center gap-3 md:gap-5">
                    {isLogin ? (
                      <span
                        className="text-black text-[9px] md:text-[10px] font-inter text-center w-auto h-4 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity"
                        onClick={handleLogout}
                      >
                        로그아웃
                      </span>
                    ) : (
                      <LoginDialog>
                        <span className="text-black text-[9px] md:text-[10px] font-inter text-center w-auto h-4 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity">
                          로그인
                        </span>
                      </LoginDialog>
                    )}
                    <span
                      className="text-black text-[9px] md:text-[10px] font-inter text-center w-[50px] md:w-[62px] h-4 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity"
                      onClick={() => {
                        if (!isLogin) {
                          alert("로그인이 필요합니다.");
                          return;
                        }
                        navigate("/cart");
                      }}
                    >
                      장바구니({cartCount})
                    </span>
                    <span
                      className="text-black text-[9px] md:text-[10px] font-inter text-center w-auto h-4 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity"
                      onClick={() => {
                        if (!isLogin) {
                          alert("로그인이 필요합니다.");
                          return;
                        }
                        navigate("/mypage");
                      }}
                    >
                      마이페이지
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
