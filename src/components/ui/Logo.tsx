import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

interface LogoProps {
  className?: string;
  to?: string;
  showWordmark?: boolean;
}

export function Logo({
  className = "",
  to = "/",
  showWordmark = true,
}: LogoProps) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 ${className}`}
      aria-label="Reviewline home"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-500 text-ink-950">
        <ShieldCheck className="h-5 w-5" strokeWidth={2.5} />
      </span>
      {showWordmark && (
        <span className="font-display text-lg font-bold tracking-tight text-paper-100">
          Reviewline
        </span>
      )}
    </Link>
  );
}
