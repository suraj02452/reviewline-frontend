import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Logo } from "../components/ui/Logo";
import { Button } from "../components/ui/Button";
import { authApi } from "../api/authApi";
import type { ApiError } from "../api/client";

type Status = "verifying" | "success" | "error";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<Status>("verifying");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setErrorMessage("This verification link is missing a token.");
      return;
    }

    authApi
      .verifyEmail(token)
      .then(() => setStatus("success"))
      .catch((err) => {
        const e = err as ApiError;
        setStatus("error");
        setErrorMessage(e.message || "Could not verify this email.");
      });
  }, [searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-950 px-4">
      <Logo />

      {status === "verifying" && (
        <>
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <p className="text-sm text-paper-400">Verifying your email…</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle2 className="h-10 w-10 text-diff-green" />
          <h1 className="font-display text-xl font-bold text-paper-100">
            Email verified
          </h1>
          <p className="max-w-sm text-center text-sm text-paper-400">
            Your email has been confirmed. You can now use all of Reviewline.
          </p>
          <Link to="/dashboard">
            <Button size="lg">Go to dashboard</Button>
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="h-10 w-10 text-diff-red" />
          <h1 className="font-display text-xl font-bold text-paper-100">
            Verification failed
          </h1>
          <p className="max-w-sm text-center text-sm text-paper-400">
            {errorMessage}
          </p>
          <Link to="/dashboard">
            <Button size="lg" variant="outline">
              Go to dashboard
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default VerifyEmailPage;
