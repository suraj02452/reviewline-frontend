import { type ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FilePlus2,
  History,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "../../components/ui/Logo.tsx";
import { useAuth } from "../../context/AuthContext.tsx";

interface AppLayoutProps {
  children: ReactNode;
}

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/review/new", label: "New Review", icon: FilePlus2 },
  { to: "/history", label: "History", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
];

const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-ink-950">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-ink-600 bg-ink-900 lg:flex">
        <div className="flex h-16 items-center border-b border-ink-600 px-5">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40",
                    isActive
                      ? "bg-amber-500/10 text-amber-500"
                      : "text-paper-300 hover:bg-ink-800 hover:text-paper-100",
                  ].join(" ")
                }
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="border-t border-ink-600 p-3">
          <div className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-700 text-sm font-semibold text-paper-200">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-paper-100">
                {user?.name || "User"}
              </p>
              <p className="truncate text-xs text-paper-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-paper-400 transition-colors hover:bg-ink-800 hover:text-paper-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-ink-600 bg-ink-900 px-4 lg:hidden">
        <Logo />
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                aria-label={item.label}
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-md transition-colors",
                  active
                    ? "bg-amber-500/10 text-amber-500"
                    : "text-paper-400 hover:bg-ink-800",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />
              </NavLink>
            );
          })}
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="flex h-9 w-9 items-center justify-center rounded-md text-paper-400 hover:bg-ink-800"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="lg:pl-60">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
          {children}
        </div>
      </main>

      {/* Trust footer */}
      <footer className="border-t border-ink-600 px-4 py-6 lg:pl-60">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-2 text-xs text-paper-500">
          <ShieldCheck className="h-3.5 w-3.5" />
          Your code is stored securely and only visible to your account.
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
