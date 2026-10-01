export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
  role: "ADMIN" | "STUDENT" | "DAY_SCHOLAR";
}

export interface LoginResponse {
  token: string;
  role: string;
  username: string;
}

export interface AuthUser {
  username: string;
  role: string;
  token: string;
}