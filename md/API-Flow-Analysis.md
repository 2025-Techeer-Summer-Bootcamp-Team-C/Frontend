# 회원가입, 로그인, 로그아웃 API 흐름 분석 보고서

## 📋 전체 개요

현재 프론트엔드와 백엔드 간 인증 시스템에서 **쿠키 기반**과 **localStorage 기반**이 혼재되어 있어 일관성 문제가 발생하고 있습니다.

---

## 🔐 1. 회원가입 API 흐름

### 프론트엔드 → 백엔드
```javascript
// 데이터 흐름
SignupForm → Zod 검증 → FormData 생성 → POST /api/v1/users/signup
```

**요청 데이터:**
- `username`: 사용자명
- `email`: 이메일
- `password`: 비밀번호  
- `password2`: 비밀번호 확인
- `profile_image`: 프로필 이미지 파일 (선택사항)

**백엔드 처리:**
1. 사용자 데이터 검증
2. 데이터베이스에 사용자 생성
3. 프로필 이미지 저장
4. 응답 반환

**응답 처리:**
- ✅ 성공: 토스트 메시지 → 로그인 폼으로 전환
- ❌ 실패: 필드별 에러 메시지 표시

---

## 🔑 2. 로그인 API 흐름

### 프론트엔드 → 백엔드
```javascript
// 데이터 흐름
LoginForm → Zod 검증 → JSON 데이터 → POST /api/v1/users/login
```

**요청 데이터:**
```json
{
  "username": "사용자명",
  "password": "비밀번호"
}
```

**백엔드 처리:**
1. 사용자 인증 확인
2. JWT 토큰 생성 (access: 1일, refresh: 7일)
3. 쿠키에 토큰 설정
4. JSON 응답 반환

**응답 데이터:**
```json
{
  "status": 200,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "message": "로그인 성공"
}
```

**문제점 🚨:**
- 백엔드: 쿠키에 토큰 저장
- 프론트엔드: localStorage에 access_token 저장
- **인증 방식 불일치 발생**

---

## 🚪 3. 로그아웃 API 흐름

### 프론트엔드 → 백엔드
```javascript
// 데이터 흐름
Header → 로그아웃 버튼 → POST /api/v1/users/logout
```

**요청 데이터:**
```json
{} // 현재 빈 객체 전송
```

**백엔드 요구사항:**
```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**백엔드 처리:**
1. 쿠키의 access 토큰으로 사용자 인증
2. refresh 토큰 블랙리스트 추가
3. 쿠키에서 토큰 제거
4. 204 No Content 응답

**문제점 🚨:**
- 백엔드: refresh_token 요구
- 프론트엔드: 빈 객체 전송
- **400 Bad Request 오류 발생**

---

## ⚙️ 4. 현재 시스템 설정 분석

### axiosInstance 설정
```javascript
{
  withCredentials: true,  // 쿠키 전송 활성화
  headers: {
    "Content-Type": "application/json"
  }
}
```

### 요청 인터셉터
```javascript
// Authorization 헤더에 localStorage 토큰 추가
config.headers.Authorization = `Bearer ${localStorage.getItem("access_token")}`;
```

### 인증 상태 확인
```javascript
// localStorage 기반 상태 확인
const isLogin = !!localStorage.getItem("access_token");
```

---

## 🔍 5. 문제점 종합

| 구분 | 백엔드 | 프론트엔드 | 문제점 |
|------|--------|------------|--------|
| **인증 방식** | 쿠키 기반 JWT | localStorage + Authorization 헤더 | 방식 불일치 |
| **토큰 저장** | access(쿠키) + refresh(쿠키) | access_token(localStorage) | 저장 방식 불일치 |
| **로그아웃 요청** | refresh_token 필요 | 빈 객체 전송 | 400 Bad Request |
| **상태 확인** | 쿠키 유효성 | localStorage 존재 여부 | 상태 불일치 |

---

## 🛠️ 6. 개선 방안

### A. 쿠키 기반으로 통일 (권장)
```javascript
// localStorage 사용 중단
// 쿠키 기반 인증 상태 확인 API 추가
// Authorization 헤더 제거
```

### B. 토큰 관리 개선
```javascript
// refresh_token도 localStorage에 저장
// 로그아웃 시 refresh_token 전송
// 토큰 갱신 로직 추가
```

### C. 인증 상태 확인 개선
```javascript
// 토큰 유효성 검사 API 호출
// 쿠키 기반 상태 확인으로 변경
```

---

## 📊 7. 권장 구현 순서

1. **refresh_token 관리 추가**
2. **로그아웃 API 수정**
3. **인증 방식 통일**
4. **상태 관리 개선**
5. **토큰 갱신 로직 추가**

현재 가장 시급한 문제는 **로그아웃 API의 400 오류**이므로, refresh_token 관리부터 개선하는 것을 권장합니다.