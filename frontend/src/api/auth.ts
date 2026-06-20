// services/auth.service.ts
import { fetcher } from "./base";

export interface LoginResponse {
  id: number;
  username: string;
  access_token: string;
  refresh_token: string;
  exp_at: string | null;
}

export interface SignupPayload {
  username: string;
  password: string;
}

export interface Profile {
  id: number;
  user_id: number;
  username: string;
  fullname: string | null;
  email: string | null;
  sex: string | null;
  phone: string | null;
}

const AuthService = {
  login: (username: string, password: string) =>
    fetcher.post<LoginResponse>("/user/login", { username, password }).then(r => r.data),

  signup: (payload: SignupPayload) =>
    fetcher.post<LoginResponse>("/user/signup", payload).then(r => r.data),

  getProfile: () =>
    fetcher.get<Profile>("/user/profile").then(r => r.data),

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },
};

export default AuthService;