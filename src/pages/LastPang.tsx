import VideoSection from "@/components/sections/VideoSection";
import { useState, useEffect, useCallback, useRef } from "react";
import jsw from "@/assets/jsw.mp4";
import jesh from "@/assets/jesh.mp4";
import khh from "@/assets/khh.mp4";
import josh from "@/assets/josh.mp4";
import jjw from "@/assets/jjw.mp4";
import jsw_image from "@/assets/jsw_image.png";
import jesh_image from "@/assets/jesh_image.png";
import khh_image from "@/assets/khh_image.png";
import josh_image from "@/assets/josh_image.png";
import jjw_image from "@/assets/jjw_image.png";

interface MemberInfo {
  name: string;
  imageUrl: string;
  videoUrl: string;
  position: string;
}

const members: MemberInfo[] = [
  {
    name: "김환희",
    imageUrl: khh_image,
    videoUrl: khh,
    position: "Leader, Backend, DevOps",
  },
  {
    name: "조성훈",
    imageUrl: josh_image,
    videoUrl: josh,
    position: "Backend, Design",
  },
  {
    name: "장성우",
    imageUrl: jsw_image,
    videoUrl: jsw,
    position: "Backend",
  },
  {
    name: "제승현",
    imageUrl: jesh_image,
    videoUrl: jesh,
    position: "Frontend, Design",
  },
  {
    name: "정지원",
    imageUrl: jjw_image,
    videoUrl: jjw,
    position: "Backend, DevOps",
  },
];

const LastPang = () => {
  const [showVideo, setShowVideo] = useState(false);
  const rafRef = useRef<number>(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // 스크롤 핸들러
  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const videoSectionHeight = 800; // VideoSection의 높이

      const shouldShowVideo = scrollY >= videoSectionHeight;

      // 상태가 변경될 때만 업데이트
      if (shouldShowVideo !== showVideo) {
        setShowVideo(shouldShowVideo);

        // 비디오 재생/정지 제어
        videoRefs.current.forEach((video) => {
          if (video) {
            if (shouldShowVideo) {
              video.currentTime = 0; // 처음부터 재생
              video.play().catch(console.error);
            } else {
              video.pause();
            }
          }
        });
      }
    });
  }, [showVideo]);

  // 스크롤 리스너 등록
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // 초기 상태 설정

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll]);

  return (
    <div className="w-full bg-white relative">
      <VideoSection />

      {/* 고정 로고 */}
      <div className="absolute top-[400px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black text-[200px] font-butler z-[65] pointer-events-none transition-opacity duration-300">
        Morph
      </div>

      {/* Main Content */}
      <div className="flex justify-center pt-[100px]">
        <div className="w-full mx-40">
          {/* Member */}

          <div className="flex gap-10">
            {members.map((member, index) => (
              <div key={index}>
                <div className="w-full h-full max-w-[300px] min-w-[240px] sm:w-[300px] mt-50">
                  <div className="w-full h-full sm:h-[500px] bg-white mb-4 cursor-pointer overflow-hidden hover:shadow-lg transition-shadow relative">
                    {/* Member Image - 기본 표시 */}
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ${
                        showVideo ? "opacity-0" : "opacity-100"
                      }`}
                    />

                    {/* Member Video - 스크롤 시 표시 */}
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      key={`member-${member.name}`}
                      src={member.videoUrl || ""}
                      className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ${
                        showVideo ? "opacity-100" : "opacity-0"
                      }`}
                      muted
                      playsInline
                      preload="metadata"
                    />
                  </div>

                  {/* Member Info Container */}
                  <div className="flex flex-col">
                    {/* Default and Viewed Layout */}
                    <div className="w-fit min-w-full h-15 flex flex-col justify-center gap-2">
                      <div className="flex flex-col justify-end gap-0.5 h-10">
                        {/* Member Name and Position */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[20px] sm:text-[20px] font-bold font-inter leading-tight text-gray-600`}
                          >
                            {member.name}
                          </span>
                        </div>

                        {/* Position */}
                        <span
                          className={`text-[16px] sm:text-[16px] font-inter leading-tight font-medium text-gray-600`}
                        >
                          {member.position}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LastPang;
