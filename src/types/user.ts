export interface SignUpRequest {
  username: string;
  password: string;
  password2: string;
  email: string;
  user_gender: "M" | "F";
}

export interface SignUpResponse {
  status: number;
  message: string;
}
