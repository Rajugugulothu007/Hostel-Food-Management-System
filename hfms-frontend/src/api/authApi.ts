import axiosClient from "./axiosClient";
import type { LoginRequest, LoginResponse, SignupRequest } from "../types/auth";

export const authApi = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const res = await axiosClient.post<LoginResponse>("/auth/login", data);
    return res.data;
  },

  async signup(data: SignupRequest): Promise<string> {
    const res = await axiosClient.post<string>("/auth/signup", data);
    return res.data;
  },
};