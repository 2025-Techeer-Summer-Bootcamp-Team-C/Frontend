import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import morphSpinnerImg from "@/assets/MorphSpinner-removebg.png";

interface MorphSpinnerProps {
  size?: number;
  message?: string;
  className?: string;
}

export function MorphSpinner({
  size = 48,
  message,
  className,
}: MorphSpinnerProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        className
      )}
    >
      {/* 옷걸이 로고 스피너 애니메이션 */}
      <div className="relative">
        {/* 메인 옷걸이 이미지 */}
        <motion.img
          src={morphSpinnerImg}
          alt="Morph Loading"
          width={size}
          height={size}
          className="object-contain"
          style={{
            transformOrigin: "50% 15%", // 후크 위치를 중심으로 회전 (상단에서 15% 지점)
          }}
          animate={{
            // 위에서 직선으로 떨어진 후, 걸리는 순간 바로 흔들림 시작
            y: [-15, -12, 0, 0, 0, 0, 0, 0, 0, 0], // 걸린 후(15% 지점)부터는 y축 이동 없음
            rotate: [0, 0, 20, -18, 14, -10, 7, -4, 2, 0], // 걸리는 순간(15%) 바로 흔들림 시작
          }}
          transition={{
            duration: 3.2,
            repeat: Number.POSITIVE_INFINITY,
            ease: [0.15, 0.8, 0.25, 0.96],
            times: [0, 0.03, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.8, 1], // 걸리는 순간(15%) 바로 흔들림 시작
          }}
        />

        {/* 걸이 고리 부분 - 이미지 내 후크 위치에 정확히 배치 */}
        <motion.div
          className="absolute w-2 h-2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            top: `${size * 0.15}px`, // 이미지 상단에서 15% 지점 (후크 위치)
            left: "50%", // 중앙
          }}
          animate={{
            // 옷걸이와 함께 떨어지다가 걸린 후 완전 고정
            y: [-15, -12, 0, 0, 0, 0, 0, 0], // 옷걸이 이미지와 동일한 y 이동
            rotate: [0, 0, 0, 0, 0, 0, 0, 0], // 후크는 회전하지 않음
            scale: [1, 1, 1, 1, 1, 1, 1, 1], // 후크는 크기 변화 없음
          }}
          transition={{
            duration: 3.2,
            repeat: Number.POSITIVE_INFINITY,
            ease: [0.15, 0.8, 0.25, 0.96],
            times: [0, 0.03, 0.15, 0.3, 0.45, 0.65, 0.8, 1],
          }}
        >
          <div className="w-full h-full bg-transparent" />
        </motion.div>

        {/* 그림자 효과 - 떨어질 때 자연스럽게 변화 */}
        <motion.div
          className="absolute top-full left-1/2 w-12 h-2 bg-black/15 rounded-full transform -translate-x-1/2 blur-sm mt-1"
          animate={{
            // 떨어질 때는 단순하게, 걸리는 순간 바로 역동적 변화
            scaleX: [0.7, 0.8, 1.4, 1.3, 1.1, 1.2, 0.9, 1.1, 0.95, 1],
            opacity: [0.15, 0.2, 0.1, 0.25, 0.35, 0.3, 0.4, 0.3, 0.35, 0.3],
            // 떨어질 때는 중앙, 걸리는 순간 바로 왼쪽으로 움직임
            x: [0, 0, -2, 1.5, -1, 1.2, -0.8, 0.6, -0.3, 0],
          }}
          transition={{
            duration: 3.2,
            repeat: Number.POSITIVE_INFINITY,
            ease: [0.15, 0.8, 0.25, 0.96],
            delay: 0.02,
            times: [0, 0.03, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.8, 1], // 옷걸이와 동일한 타이밍
          }}
        />
      </div>

      {/* 로딩 메시지 */}
      {message && (
        <motion.div
          className="text-black text-sm font-inter font-medium text-center max-w-xs"
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {message}
        </motion.div>
      )}

      {/* 로딩 점들 애니메이션 */}
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 bg-black rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
