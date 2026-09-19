import apiClient, {
  normalizeError,
  setAuthToken,
  type ApiError,
} from "./client.ts";

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    googleConnected: boolean;
  };
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const { data } = await apiClient.post<AuthResponse>(
        "/auth/register",
        payload,
      );
      setAuthToken(data.token);
      return data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const { data } = await apiClient.post<AuthResponse>(
        "/auth/login",
        payload,
      );
      setAuthToken(data.token);
      return data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  getGoogleAuthUrl(): string {
    return "https://reviewline-backend.onrender.com/oauth2/authorization/google";
  },

  async logout(): Promise<void> {
    setAuthToken(null);
  },

  async verifyEmail(token: string): Promise<void> {
    try {
      await apiClient.get("/auth/verify", { params: { token } });
    } catch (err) {
      throw normalizeError(err);
    }
  },
};

export type { ApiError };
