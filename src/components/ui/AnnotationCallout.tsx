import { type ReactNode } from "react";
import {
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import type { Severity } from "../../api/reviewApi";

type CalloutTone = Severity | "pass" | "neutral";

interface AnnotationCalloutProps {
  tone?: CalloutTone;
  title: string;
  lineLabel?: string;
  children: ReactNode;
  className?: string;
  showConnector?: boolean;
  animateIn?: boolean;
  style?: React.CSSProperties;
}

const toneStyles: Record<
  CalloutTone,
  { border: string; bg: string; icon: string; label: string }
> = {
  security: {
    border: "border-l-diff-red",
    bg: "bg-diff-red-bg",
    icon: "text-diff-red",
    label: "Security",
  },
  bug: {
    border: "border-l-amber-500",
    bg: "bg-diff-amber-bg",
    icon: "text-amber-500",
    label: "Bug",
  },
  style: {
    border: "border-l-paper-400",
    bg: "bg-ink-800",
    icon: "text-paper-300",
    label: "Style",
  },
  pass: {
    border: "border-l-diff-green",
    bg: "bg-diff-green-bg",
    icon: "text-diff-green",
    label: "Passed",
  },
  neutral: {
    border: "border-l-ink-500",
    bg: "bg-ink-800",
    icon: "text-paper-300",
    label: "",
  },
};

const toneIcon: Record<CalloutTone, typeof AlertTriangle> = {
  security: ShieldAlert,
  bug: AlertTriangle,
  style: Sparkles,
  pass: CheckCircle2,
  neutral: AlertTriangle,
};

const AnnotationCallout = ({
  tone = "neutral",
  title,
  lineLabel,
  children,
  className = "",
  showConnector = false,
  animateIn = false,
  style,
}: AnnotationCalloutProps) => {
  const s = toneStyles[tone];
  const Icon = toneIcon[tone];
  return (
    <div
      className={[
        "relative rounded-r-lg rounded-l-sm border border-ink-600 border-l-2 px-4 py-3",
        s.border,
        s.bg,
        animateIn
          ? "opacity-0 animate-[fade-in-up_0.5s_ease-out_forwards]"
          : "",
        className,
      ].join(" ")}
      style={style}
    >
      {showConnector && (
        <span
          className="absolute -left-px top-1/2 h-px w-5 -translate-y-1/2 bg-ink-600"
          aria-hidden
        />
      )}
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 shrink-0 ${s.icon}`} strokeWidth={2} />
        <span className="font-mono text-xs uppercase tracking-wide text-paper-400">
          {s.label}
        </span>
        {lineLabel && (
          <span className="ml-auto font-mono text-xs text-paper-500">
            L{lineLabel}
          </span>
        )}
      </div>
      <h4 className="mt-1.5 text-sm font-semibold text-paper-100">{title}</h4>
      <div className="mt-1 text-sm leading-relaxed text-paper-300">
        {children}
      </div>
    </div>
  );
};

export default AnnotationCallout;
