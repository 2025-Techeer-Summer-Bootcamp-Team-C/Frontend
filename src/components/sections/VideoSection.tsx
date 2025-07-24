import { useState, useRef, useEffect, memo, useCallback } from "react";
import video1 from "@/assets/video1_optimized.mp4";
import video2 from "@/assets/video2_optimized.mp4";
import video3 from "@/assets/video3_optimized.mp4";

interface VideoSectionProps {
  onVolumeChange?: (volume: number) => void;
}

const VideoSection = memo(({ onVolumeChange }: VideoSectionProps) => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videos = [video1, video2, video3];

  const handleVideoEnded = useCallback(() => {
    const nextVideo = (currentVideo + 1) % videos.length;
    setCurrentVideo(nextVideo);
  }, [currentVideo, videos.length]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isInView]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && isInView) {
      video.load();
      video.play();
    }
  }, [currentVideo, isInView]);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();

      // 비디오 섹션이 화면에 완전히 보이는 상태에서의 볼륨 계산
      if (rect.bottom <= 0) {
        // 비디오 섹션이 완전히 화면을 벗어난 경우 볼륨 0
        onVolumeChange?.(0);
      } else if (rect.top >= 0) {
        // 비디오 섹션이 완전히 화면에 있는 경우 볼륨 1
        onVolumeChange?.(0.5);
      } else {
        // 비디오 섹션이 부분적으로 화면을 벗어나는 경우 비례적으로 볼륨 조절
        const visibleHeight = Math.max(0, rect.bottom);
        const sectionHeight = rect.height;
        const volume = Math.max(0, Math.min(1, visibleHeight / sectionHeight));
        onVolumeChange?.(volume);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // 초기 볼륨 설정

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [onVolumeChange]);

  const handleLoadedData = () => {
    setIsLoaded(true);
  };

  return (
    <div ref={sectionRef} className="relative z-[60]">
      <video
        ref={videoRef}
        autoPlay
        muted
        className={`w-full h-[800px] object-cover object-top transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onEnded={handleVideoEnded}
        onLoadedData={handleLoadedData}
      >
        {isInView && <source src={videos[currentVideo]} type="video/mp4" />}
      </video>
      {!isLoaded && isInView && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <div className="text-gray-400">Loading video...</div>
        </div>
      )}
    </div>
  );
});

VideoSection.displayName = "VideoSection";

export default VideoSection;
