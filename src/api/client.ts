import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || "/api";
console.log("BASE_URL is:", BASE_URL);

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    sessionStorage.setItem("reviewline_token", token);
  } else {
    sessionStorage.removeItem("reviewline_token");
  }
}

export function getAuthToken(): string | null {
  if (authToken) return authToken;
  const stored = sessionStorage.getItem("reviewline_token");
  if (stored) authToken = stored;
  return authToken;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export interface ApiError {
  message: string;
  field?: string;
  status?: number;
}

export function normalizeError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as
      | { message?: string; field?: string }
      | undefined;
    return {
      message: data?.message || err.message || "Request failed",
      field: data?.field,
      status: err.response?.status,
    };
  }
  return { message: (err as Error)?.message || "Unexpected error" };
}

export default apiClient;
