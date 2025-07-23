import { useState, useEffect } from "react";

const MorphLogo = () => {
  const [logoPosition, setLogoPosition] = useState("fixed");
  const releasePoint = 800;

  // Morph logo scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // VideoSection height is 800px, OnBoarding height is 1000px
      // Logo should release when reaching onboarding section middle (800 + 500 = 1300px)
      if (scrollY >= releasePoint) {
        setLogoPosition("released");
      } else {
        if (logoPosition === "released") {
          setLogoPosition("fixed");
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial position check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [logoPosition]);

  return (
    <div>
      {/* Morph Logo with scroll-based positioning */}
      <div
        className={`
          text-black text-[200px] h-[200px] font-butler z-[65] pointer-events-none
          ${
            logoPosition === "fixed"
              ? "fixed top-[300px] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              : "absolute top-[1000px] left-1/2 transform -translate-x-1/2"
          }
        `}
      >
        Morph
      </div>
    </div>
  );
};

export default MorphLogo;
