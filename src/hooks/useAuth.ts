import { useMutation } from "@tanstack/react-query";
import { signUp, login } from "../api/auth";
import type {
  SignUpRequest,
  SignUpResponse,
  LoginRequest,
  LoginResponse,
} from "../types/user";
import { AxiosError } from "axios";

export const useSignUpMutation = () => {
  return useMutation<SignUpResponse, AxiosError, SignUpRequest>({
    mutationFn: (userData: SignUpRequest) => signUp(userData),
    onSuccess: (data) => {
      // 성공 시
      console.log("회원가입 성공", data);
      alert(data.message);
    },
    onError: (error) => {
      // 실패 시
      console.log("회원가입 실패", error);
      alert("회원가입 중 오류가 발생했습니다.");
    },
  });
};

export const useLoginMutation = () => {
  return useMutation<LoginResponse, AxiosError, LoginRequest>({
    mutationFn: (userData: LoginRequest) => login(userData),
    onSuccess: (data) => {
      // 로그인 성공 시
      console.log("로그인 성공", data);
      alert(data.message);
      // 로그인 성공 시 토큰 저장
      localStorage.setItem("access_token", data.access_token);
    },
    onError: (error) => {
      // 로그인 실패 시
      console.log("로그인 실패", error);
      alert("아이디 또는 비밀번호를 확인해주세요.");
    },
  });
};
