import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Logo } from "../components/ui/Logo";
import { Button } from "../components/ui/Button";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-ink-950">
      <header className="flex h-16 items-center px-4 sm:px-6">
        <Logo />
      </header>
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="text-center">
          <p className="font-mono text-6xl font-bold text-amber-500 sm:text-8xl">
            404
          </p>
          <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-paper-100">
            This page isn&apos;t in the repo.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-paper-400">
            The route you tried doesn&apos;t exist. Head back to the dashboard
            or start a new review.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/dashboard">
              <Button>
                <Home className="h-4 w-4" />
                Go to dashboard
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4" />
                Back home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
