import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-amber-500 text-ink-950 hover:bg-amber-400 focus-visible:ring-amber-500/50 font-semibold",
  secondary:
    "bg-ink-700 text-paper-100 hover:bg-ink-600 focus-visible:ring-ink-500/50 border border-ink-600",
  ghost:
    "text-paper-300 hover:text-paper-100 hover:bg-ink-800 focus-visible:ring-ink-500/40",
  danger:
    "bg-diff-red/10 text-diff-red border border-diff-red/30 hover:bg-diff-red/20 focus-visible:ring-diff-red/40",
  outline:
    "border border-ink-600 text-paper-100 hover:border-amber-500/50 hover:text-amber-500 focus-visible:ring-amber-500/40 bg-transparent",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm rounded-md gap-1.5",
  md: "h-10 px-4 text-sm rounded-lg gap-2",
  lg: "h-12 px-6 text-base rounded-lg gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      className = "",
      children,
      disabled,
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          "inline-flex items-center justify-center font-medium transition-colors duration-150",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          fullWidth ? "w-full" : "",
          className,
        ].join(" ")}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  },
);
