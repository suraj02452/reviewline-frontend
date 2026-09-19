import { type InputHTMLAttributes, forwardRef, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, icon, className = "", id, ...props },
  ref,
) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-paper-200"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-paper-400">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            "h-10 w-full rounded-lg border bg-ink-900 px-3 text-sm text-paper-100 placeholder:text-paper-500",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            icon ? "pl-10" : "",
            error
              ? "border-diff-red/60 focus:border-diff-red focus:ring-diff-red/30"
              : "border-ink-600 focus:border-amber-500/60 focus:ring-amber-500/20",
            className,
          ].join(" ")}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-diff-red">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-paper-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
