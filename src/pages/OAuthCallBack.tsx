import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Logo } from "../components/ui/Logo";
import { setAuthToken } from "../api/client";
import { useAuth } from "../context/AuthContext";

const OAuthCallBack = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setAuthToken(token);

    refreshUser().then(() => {
      navigate("/dashboard", { replace: true });
    });
  }, [searchParams, navigate, refreshUser]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-950">
      <Logo />
      <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
      <p className="text-sm text-paper-400">Signing you in…</p>
    </div>
  );
};

export default OAuthCallBack;
