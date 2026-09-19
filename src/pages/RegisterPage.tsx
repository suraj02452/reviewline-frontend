import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { Logo } from "../components/ui/Logo";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/authApi";
import type { ApiError } from "../api/client";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirm?: string;
    form?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Enter your name.";
    if (!email) e.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email address.";
    if (!password) e.password = "Choose a password.";
    else if (password.length < 8) e.password = "Use at least 8 characters.";
    if (!confirm) e.confirm = "Confirm your password.";
    else if (confirm !== password) e.confirm = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setErrors({});
    try {
      await register({ name, email, password });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const e = err as ApiError;
      setErrors({
        form: e.message || "Registration failed. Try a different email.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-ink-950">
      <header className="flex h-16 items-center px-4 sm:px-6">
        <Logo />
      </header>
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl font-bold tracking-tight text-paper-100">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-paper-400">
            Free tier includes 10 reviews a month. No card required.
          </p>

          {errors.form && (
            <div className="mt-4 rounded-lg border border-diff-red/30 bg-diff-red-bg px-3 py-2 text-sm text-diff-red">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <Input
              label="Name"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Ada Lovelace"
              icon={<User className="h-4 w-4" />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
            <Input
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@company.com"
              icon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <Input
              label="Password"
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              icon={<Lock className="h-4 w-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
            <Input
              label="Confirm password"
              type="password"
              name="confirm"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              icon={<Lock className="h-4 w-4" />}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={errors.confirm}
            />
            <Button type="submit" size="lg" fullWidth loading={submitting}>
              Create account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-ink-600" />
            <span className="font-mono text-xs text-paper-500">or</span>
            <span className="h-px flex-1 bg-ink-600" />
          </div>

          <a href={authApi.getGoogleAuthUrl()} className="block">
            <Button variant="secondary" fullWidth size="lg">
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
                />
              </svg>
              Sign up with Google
            </Button>
          </a>

          <p className="mt-6 text-center text-sm text-paper-400">
            Already have an account?{" "}
            <Link to="/login" className="text-amber-500 hover:text-amber-400">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
