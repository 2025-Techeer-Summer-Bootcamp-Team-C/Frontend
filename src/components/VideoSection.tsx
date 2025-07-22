import { useState, useRef, useEffect } from 'react';
import video1 from "../assets/video1.mp4";
import video2 from "../assets/video2.mp4";
import video3 from "../assets/video3.mp4";

interface VideoSectionProps {
  onVolumeChange?: (volume: number) => void;
}

const VideoSection = ({ onVolumeChange }: VideoSectionProps) => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const videos = [
    video1,
    video2,
    video3
  ];

  const handleVideoEnded = () => {
    const nextVideo = (currentVideo + 1) % videos.length;
    setCurrentVideo(nextVideo);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.load();
      video.play();
    }
  }, [currentVideo]);

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
        onVolumeChange?.(1);
      } else {
        // 비디오 섹션이 부분적으로 화면을 벗어나는 경우 비례적으로 볼륨 조절
        const visibleHeight = Math.max(0, rect.bottom);
        const sectionHeight = rect.height;
        const volume = Math.max(0, Math.min(1, visibleHeight / sectionHeight));
        onVolumeChange?.(volume);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 초기 볼륨 설정
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onVolumeChange]);

  return (
    <div ref={sectionRef}>
      <video 
        ref={videoRef}
        autoPlay 
        muted 
        className="w-full h-[800px] object-cover object-top"
        onEnded={handleVideoEnded}
      >
        <source src={videos[currentVideo]} type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoSection;