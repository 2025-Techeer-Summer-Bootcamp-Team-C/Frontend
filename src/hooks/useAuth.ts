import { useMutation } from "@tanstack/react-query";
import { signUp, login, logout } from "../api/auth";
import type {
  SignUpRequest,
  SignUpResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  AuthErrorResponse,
} from "../types/user";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export const useSignUpMutation = () => {
  return useMutation<SignUpResponse, AxiosError, SignUpRequest>({
    mutationFn: (userData: SignUpRequest) => signUp(userData),
  });
};

export const useLoginMutation = () => {
  const navigate = useNavigate();
  return useMutation<
    LoginResponse,
    AxiosError<AuthErrorResponse>,
    LoginRequest
  >({
    mutationFn: (userData: LoginRequest) => login(userData),
    onSuccess: (data) => {
      // 로그인 성공 시
      console.log("로그인 성공", data);
      alert(data.message);
      // 로그인 성공 시 토큰 저장 (httpOnly 쿠키가 더 안전하지만, 현재는 localStorage 사용)
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      window.dispatchEvent(new Event("loginStatusChange"));
      navigate("/");
    },
    onError: (error) => {
      // 로그인 실패 시
      if (error.response) {
        const status = error.response.status;
        let errorMessage = "";

        if (status === 400) {
          errorMessage = "사용자 이름/비밀번호를 작성해주세요.";
        } else if (status === 404) {
          errorMessage = "회원 정보를 찾을 수 없습니다.";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = "로그인 중 오류가 발생했습니다.";
        }

        console.log("로그인 실패", errorMessage);
        alert(errorMessage);
      } else {
        console.log("로그인 실패", error.message);
        alert("로그인 중 알 수 없는 오류가 발생했습니다.");
      }
    },
  });
};

export const useLogoutMutation = () => {
  const navigate = useNavigate();
  return useMutation<LogoutResponse, AxiosError<AuthErrorResponse>, void>({
    mutationFn: () => logout(),
    onSuccess: (data) => {
      // 로그아웃 성공 시
      console.log("로그아웃 성공", data);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.dispatchEvent(new Event("loginStatusChange"));
      navigate("/");
    },
    onError: (error) => {
      // 로그아웃 실패 시
      console.log("로그아웃 실패", error);
      // 실패해도 로컬 토큰은 제거
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.dispatchEvent(new Event("loginStatusChange"));
      navigate("/");
    },
  });
};
