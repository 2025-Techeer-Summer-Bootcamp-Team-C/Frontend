import { useMutation } from "@tanstack/react-query";
import { signUp } from "../api/auth";
import type { SignUpRequest, SignUpResponse } from "../types/user";
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
