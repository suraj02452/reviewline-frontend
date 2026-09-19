import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  authApi,
  type LoginPayload,
  type RegisterPayload,
} from "../api/authApi";
import { userApi, type ReviewUser } from "../api/userApi";
import { getAuthToken, setAuthToken } from "../api/client";

interface AuthContextValue {
  user: ReviewUser | null;
  token: string | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ReviewUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!getAuthToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await userApi.me();
      setUser(me);
    } catch {
      setAuthToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (payload: LoginPayload) => {
    const { token, user: authUser } = await authApi.login(payload);
    setAuthToken(token);
    const fullUser: ReviewUser = {
      id: authUser.id,
      name: authUser.name,
      email: authUser.email,
      avatarUrl: authUser.avatarUrl,
      googleConnected: authUser.googleConnected,
      createdAt: new Date().toISOString(),
      planStatus: "free",
      reviewsThisMonth: 0,
    };
    setUser(fullUser);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const { token, user: authUser } = await authApi.register(payload);
    setAuthToken(token);
    const fullUser: ReviewUser = {
      id: authUser.id,
      name: authUser.name,
      email: authUser.email,
      avatarUrl: authUser.avatarUrl,
      googleConnected: authUser.googleConnected,
      createdAt: new Date().toISOString(),
      planStatus: "free",
      reviewsThisMonth: 0,
    };
    setUser(fullUser);
  }, []);

  const logout = useCallback(() => {
    void authApi.logout();
    setAuthToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token: getAuthToken(),
      loading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, loading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
