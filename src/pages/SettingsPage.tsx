import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import { userApi } from "../api/userApi";
import type { ApiError } from "../api/client";
import { billingApi } from "../api/billingApi";

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwErrors, setPwErrors] = useState<{
    current?: string;
    next?: string;
    confirm?: string;
    form?: string;
  }>({});
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  const handleManageSubscription = async () => {
    setPortalError(null);
    setPortalLoading(true);
    try {
      const { checkoutUrl } = await billingApi.createPortalSession();
      window.location.href = checkoutUrl;
    } catch (err) {
      const e = err as ApiError;
      setPortalError(e.message || "Could not open billing portal. Try again.");
      setPortalLoading(false);
    }
  };

  const handleChangePassword = async (ev: FormEvent) => {
    ev.preventDefault();
    const e: typeof pwErrors = {};
    if (!current) e.current = "Enter your current password.";
    if (!next) e.next = "Enter a new password.";
    else if (next.length < 8) e.next = "Use at least 8 characters.";
    if (!confirm) e.confirm = "Confirm the new password.";
    else if (confirm !== next) e.confirm = "Passwords do not match.";
    setPwErrors(e);
    if (Object.keys(e).length) return;

    setPwLoading(true);
    setPwSuccess(false);
    try {
      await userApi.updatePassword({
        currentPassword: current,
        newPassword: next,
      });
      setPwSuccess(true);
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      const apiErr = err as ApiError;
      setPwErrors({
        form: apiErr.message || "Could not change password. Try again.",
      });
    } finally {
      setPwLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await userApi.deleteAccount();
      logout();
      navigate("/");
    } catch (err) {
      const apiErr = err as ApiError;
      setPwErrors({
        form: apiErr.message || "Could not delete account. Contact support.",
      });
      setConfirmDelete(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <AppLayout>
      <h1 className="font-display text-2xl font-bold tracking-tight text-paper-100">
        Settings
      </h1>
      <p className="mt-1 text-sm text-paper-400">
        Manage your profile, password, and account.
      </p>

      {/* Profile */}
      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold text-paper-100">
          Profile
        </h2>
        <div className="mt-4 rounded-xl border border-ink-600 bg-ink-800 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-700 font-display text-xl font-semibold text-paper-100">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-base font-semibold text-paper-100">
                {user?.name || "User"}
              </p>
              <p className="font-mono text-sm text-paper-400">{user?.email}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Plan */}
      {/* Plan */}
      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold text-paper-100">
          Plan
        </h2>
        <div className="mt-4 rounded-xl border border-ink-600 bg-ink-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-paper-100">
                {user?.planStatus === "pro" ? "Pro Plan" : "Free Plan"}
              </p>
              {user?.planStatus === "free" && (
                <p className="mt-1 font-mono text-xs text-paper-400">
                  {user.reviewsThisMonth} / 25 reviews used this month
                </p>
              )}
              {user?.planStatus === "pro" && (
                <p className="mt-1 font-mono text-xs text-paper-400">
                  Unlimited reviews
                </p>
              )}
            </div>
            {user?.planStatus === "pro" ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={handleManageSubscription}
                loading={portalLoading}
              >
                Manage subscription
              </Button>
            ) : (
              <Link to="/#pricing">
                <Button size="sm">Upgrade to Pro</Button>
              </Link>
            )}
          </div>
          {portalError && (
            <p className="mt-3 text-sm text-diff-red">{portalError}</p>
          )}
        </div>
      </section>

      {/* Connected Google account */}
      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold text-paper-100">
          Connected accounts
        </h2>
        <div className="mt-4 flex items-center justify-between rounded-xl border border-ink-600 bg-ink-800 p-6">
          <div className="flex items-center gap-3">
            <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden>
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
            <div>
              <p className="text-sm font-medium text-paper-100">Google</p>
              <p className="font-mono text-xs text-paper-400">
                {user?.googleConnected ? "Connected" : "Not connected"}
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm">
            {user?.googleConnected ? "Disconnect" : "Connect"}
          </Button>
        </div>
      </section>

      {/* Change password */}
      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold text-paper-100">
          Change password
        </h2>
        {pwSuccess && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-diff-green/30 bg-diff-green-bg px-4 py-3 text-sm text-diff-green">
            <CheckCircle2 className="h-4 w-4" />
            Password updated.
          </div>
        )}
        {pwErrors.form && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-diff-red/30 bg-diff-red-bg px-4 py-3 text-sm text-diff-red">
            <AlertTriangle className="h-4 w-4" />
            {pwErrors.form}
          </div>
        )}
        <form
          onSubmit={handleChangePassword}
          className="mt-4 max-w-md space-y-4"
          noValidate
        >
          <Input
            label="Current password"
            type="password"
            name="current"
            autoComplete="current-password"
            icon={<Lock className="h-4 w-4" />}
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            error={pwErrors.current}
          />
          <Input
            label="New password"
            type="password"
            name="new"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            icon={<Lock className="h-4 w-4" />}
            value={next}
            onChange={(e) => setNext(e.target.value)}
            error={pwErrors.next}
          />
          <Input
            label="Confirm new password"
            type="password"
            name="confirm"
            autoComplete="new-password"
            icon={<Lock className="h-4 w-4" />}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={pwErrors.confirm}
          />
          <Button type="submit" loading={pwLoading}>
            {pwLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Update password
          </Button>
        </form>
      </section>

      {/* Danger zone */}
      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold text-diff-red">
          Danger zone
        </h2>
        <div className="mt-4 rounded-xl border border-diff-red/30 bg-ink-800 p-6">
          <p className="text-sm text-paper-300">
            Deleting your account is permanent. It removes your saved reviews
            and cannot be undone.
          </p>
          {!confirmDelete ? (
            <Button
              variant="danger"
              className="mt-4"
              onClick={() => setConfirmDelete(true)}
            >
              Delete account
            </Button>
          ) : (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <p className="text-sm text-paper-200">
                Are you sure? This cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  loading={deleteLoading}
                >
                  Yes, delete permanently
                </Button>
                <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </AppLayout>
  );
};

export default SettingsPage;
