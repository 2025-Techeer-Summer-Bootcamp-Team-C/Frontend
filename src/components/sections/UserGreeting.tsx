import { useEffect, useState, memo } from "react";

const UserGreeting = memo(() => {
  const [userName, setUserName] = useState<string>("사용자");
  const [greeting, setGreeting] = useState<string>("");

  useEffect(() => {
    // 시간대별 인사말 설정
    const getTimeBasedGreeting = () => {
      const hour = new Date().getHours();

      if (hour >= 5 && hour < 12) {
        return "좋은 아침입니다";
      } else if (hour >= 12 && hour < 18) {
        return "즐거운 오후입니다";
      } else if (hour >= 18 && hour < 22) {
        return "오늘 하루도 고생 많았어요";
      } else {
        return "안녕하세요";
      }
    };

    setGreeting(getTimeBasedGreeting());

    // localStorage에서 사용자 정보 확인 (실제 구현에서는 auth context 사용)
    const checkUserInfo = () => {
      // 간단한 사용자 정보 체크 (향후 auth context로 대체)
      const token = localStorage.getItem("access_token");
      if (token) {
        // 실제로는 토큰에서 사용자 정보를 파싱하거나 API 호출
        // 현재는 기본값 사용
        setUserName("사용자");
      }
    };

    checkUserInfo();
  }, []);

  return (
    <section className="mb-8" aria-live="polite" role="banner">
      <h1 className="text-2xl font-bold text-black mb-2">
        {greeting}, {userName}님!
      </h1>
      <p className="text-gray-600">오늘도 즐거운 쇼핑하세요.</p>
    </section>
  );
});

UserGreeting.displayName = "UserGreeting";

export default UserGreeting;
