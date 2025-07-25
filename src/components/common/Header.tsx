import {
  useState,
  useEffect,
  lazy,
  Suspense,
  memo,
  useCallback,
  useRef,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, ShoppingCart, Search } from "lucide-react";

// Lazy load dialog
const LoginDialog = lazy(() => import("@/components/dialogs/LoginDialog"));
import { useFilter } from "@/contexts/FilterContext";
import type { HeaderVariant } from "@/types/variants";
import { useCart } from "@/contexts/CartContext";
import { useHeaderSticky } from "@/hooks/useHeaderSticky";

interface HeaderProps {
  variant?: HeaderVariant;
  showSearch?: boolean;
  showUserActions?: boolean;
  showCategoryMenu?: boolean;
}

const Header = memo(
  ({ showSearch, showUserActions, showCategoryMenu }: HeaderProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
      inputValue,
      setInputValue,
      handleSearch,
      selectedCategory,
      setSelectedCategory,
    } = useFilter();
    const [isLogin, setIsLogin] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
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
        window.removeEventListener(
          "loginStatusChange",
          handleLoginStatusChange
        );
      };
    }, []);
    const { cartData } = useCart();
    const cartCount = cartData?.cart_product?.length || 0;

    const handleCategoryClick = useCallback(
      (category: string) => {
        setSelectedCategory(category);
      },
      [setSelectedCategory]
    );

    const toggleSearch = useCallback(() => {
      setIsSearchExpanded(!isSearchExpanded);
    }, [isSearchExpanded]);

    // 검색창 밖 클릭 시 닫기
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          searchRef.current &&
          !searchRef.current.contains(event.target as Node)
        ) {
          setIsSearchExpanded(false);
        }
      };

      if (isSearchExpanded) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isSearchExpanded]);

    // 카테고리 메뉴 아이템들
    const categoryItems = ["모두 보기", "상의", "하의", "아우터"];

    const isHomePage = location.pathname === "/";

    return (
      <header
        className={`${
          isHomePage && !isSticky
            ? "relative bg-transparent"
            : "fixed top-0 left-0 bg-transparent"
        } w-full h-[100px] z-50 group backdrop-blur-sm transition-all duration-300`}
      >
        {/* Main Header */}
        <div className="flex items-center h-[100px] justify-center py-5">
          <div className="w-full max-w-[1300px] px-4 lg:px-8 xl:px-0">
            <div className="flex items-center justify-between">
              {/* Left Section - Category Menu 또는 Logo */}
              <div className="flex items-center">
                {showCategoryMenu ? (
                  // Category Menu (Home 페이지)
                  <div className="flex flex-wrap items-center gap-4 md:gap-6">
                    {categoryItems.map((item, index) => (
                      <span
                        key={index}
                        onClick={() => handleCategoryClick(item)}
                        className={`text-black text-[15px] font-inter leading-4 cursor-pointer hover:opacity-70 transition-all whitespace-nowrap ${
                          selectedCategory === item
                            ? "font-bold"
                            : "font-normal"
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  // Logo (다른 페이지들)
                  <div className="cursor-pointer" onClick={() => navigate("/")}>
                    <span className="text-black text-[60px] leading-none font-butler">
                      Morph
                    </span>
                  </div>
                )}
              </div>

              {/* Right Section */}
              <div className="flex flex-col items-end gap-2 md:gap-4">
                {/* Top Row - Search and User Actions */}
                <div className="flex items-center gap-10">
                  {/* Search */}
                  {showSearch && (
                    <div ref={searchRef} className="flex items-center">
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isSearchExpanded
                            ? "w-[120px] md:w-[170px] mr-2"
                            : "w-0"
                        }`}
                      >
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
                      <button
                        type="button"
                        onClick={toggleSearch}
                        className="text-black hover:opacity-70 transition-opacity bg-transparent border-none outline-none cursor-pointer"
                        aria-label="검색"
                      >
                        <Search size={25} strokeWidth={1.5} />
                      </button>
                    </div>
                  )}

                  {/* User Actions */}
                  {showUserActions && (
                    <div className="flex items-center gap-10">
                      {/* User Profile/Login Button */}
                      {isLogin ? (
                        <button
                          type="button"
                          className="text-black w-auto h-4 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity bg-transparent border-none outline-none"
                          onClick={() => navigate("/mypage")}
                          aria-label="마이페이지로 이동"
                        >
                          <User size={25} strokeWidth={1.5} />
                        </button>
                      ) : (
                        <Suspense
                          fallback={
                            <div className="text-black w-auto h-4 flex items-center justify-center">
                              <User size={25} strokeWidth={1.5} />
                            </div>
                          }
                        >
                          <LoginDialog>
                            <button
                              type="button"
                              className="text-black w-auto h-4 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity bg-transparent border-none outline-none"
                              aria-label="로그인 창 열기"
                            >
                              <User size={25} strokeWidth={1.5} />
                            </button>
                          </LoginDialog>
                        </Suspense>
                      )}
                      <button
                        type="button"
                        className="text-black w-auto h-4 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity bg-transparent border-none outline-none relative"
                        onClick={() => {
                          if (!isLogin) {
                            alert("로그인이 필요합니다.");
                            return;
                          }
                          navigate("/cart");
                        }}
                        aria-label={`장바구니 (상품 ${cartCount}개)`}
                      >
                        <div className="relative">
                          <ShoppingCart size={25} strokeWidth={1.5} />
                          {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                              {cartCount > 99 ? "99+" : cartCount}
                            </span>
                          )}
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
);

Header.displayName = "Header";

export default Header;
