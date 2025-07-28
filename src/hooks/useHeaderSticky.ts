import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useHeaderSticky = () => {
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isHomePage = location.pathname === "/";

      if (isHomePage) {
        const videoSectionHeight = 900;
        const onBoardingHeight = 1000;
        const stickyThreshold = videoSectionHeight + onBoardingHeight;
        setIsSticky(currentScrollY >= stickyThreshold);
      } else {
        setIsSticky(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // 초기 실행

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  return isSticky;
};