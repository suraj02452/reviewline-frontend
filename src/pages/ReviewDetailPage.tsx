import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Bug,
  ShieldAlert,
  Sparkles,
  Download,
  CheckCircle2,
  FileCode2,
  type LucideIcon,
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import { Button } from "../components/ui/Button";
import AnnotationCallout from "../components/ui/AnnotationCallout";
import type { Severity, ReviewIssue } from "../api/reviewApi";
import { useEffect } from "react";
import { reviewApi, type ReviewResult } from "../api/reviewApi";
import type { ApiError } from "../api/client";

type Filter = "all" | Severity;

const severityMeta: Record<
  Severity,
  { label: string; icon: LucideIcon; color: string; dot: string }
> = {
  security: {
    label: "Security",
    icon: ShieldAlert,
    color: "text-diff-red",
    dot: "bg-diff-red",
  },
  bug: {
    label: "Bugs",
    icon: Bug,
    color: "text-amber-500",
    dot: "bg-amber-500",
  },
  style: {
    label: "Style",
    icon: Sparkles,
    color: "text-paper-300",
    dot: "bg-paper-400",
  },
};

function scoreColor(score: number) {
  if (score >= 80) return "text-diff-green";
  if (score >= 50) return "text-amber-500";
  return "text-diff-red";
}

const ReviewDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    reviewApi
      .getById(id)
      .then(setReview)
      .catch((err) => {
        const e = err as ApiError;
        setError(e.message || "Could not load this review.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const codeLines = useMemo(
    () => (review ? review.code.split("\n") : []),
    [review],
  );

  const issuesByLine = useMemo(() => {
    const map = new Map<number, ReviewIssue[]>();
    if (!review) return map;
    for (const issue of review.issues) {
      for (let l = issue.lineStart; l <= issue.lineEnd; l++) {
        const arr = map.get(l) || [];
        arr.push(issue);
        map.set(l, arr);
      }
    }
    return map;
  }, [review]);

  const filteredIssues = useMemo(() => {
    if (!review) return [];
    return filter === "all"
      ? review.issues
      : review.issues.filter((i) => i.severity === filter);
  }, [filter, review]);

  const counts = useMemo(() => {
    if (!review) return { security: 0, bug: 0, style: 0 };
    return {
      security: review.issues.filter((i) => i.severity === "security").length,
      bug: review.issues.filter((i) => i.severity === "bug").length,
      style: review.issues.filter((i) => i.severity === "style").length,
    };
  }, [review]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
        </div>
      </AppLayout>
    );
  }

  if (error || !review) {
    return (
      <AppLayout>
        <div className="rounded-xl border border-diff-red/30 bg-diff-red-bg p-6 text-center">
          <p className="text-sm text-diff-red">
            {error || "Review not found."}
          </p>
        </div>
      </AppLayout>
    );
  }

  const handleExport = () => {
    const lines: string[] = [];

    lines.push(`# Code Review: ${review.fileName || "Untitled"}`);
    lines.push("");
    lines.push(`**Language:** ${review.language}  `);
    lines.push(`**Score:** ${review.score}/100  `);
    lines.push(`**Date:** ${new Date(review.createdAt).toLocaleString()}`);
    lines.push("");
    lines.push("## Summary");
    lines.push("");
    lines.push(review.summary);
    lines.push("");
    lines.push("## Issues");
    lines.push("");

    if (review.issues.length === 0) {
      lines.push("No issues found.");
    } else {
      review.issues.forEach((issue, i) => {
        lines.push(
          `### ${i + 1}. ${issue.title} (${issue.severity.toUpperCase()})`,
        );
        lines.push("");
        lines.push(
          `**Line${issue.lineEnd !== issue.lineStart ? "s" : ""}:** ${issue.lineStart}${issue.lineEnd !== issue.lineStart ? `–${issue.lineEnd}` : ""}`,
        );
        lines.push("");
        lines.push(issue.explanation);
        lines.push("");
        if (issue.beforeCode) {
          lines.push("**Before:**");
          lines.push("```");
          lines.push(issue.beforeCode);
          lines.push("```");
          lines.push("");
        }
        if (issue.afterCode) {
          lines.push("**After:**");
          lines.push("```");
          lines.push(issue.afterCode);
          lines.push("```");
          lines.push("");
        }
      });
    }

    lines.push("## Full Code");
    lines.push("");
    lines.push(`\`\`\`${review.language}`);
    lines.push(review.code);
    lines.push("```");

    const markdown = lines.join("\n");
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(review.fileName || "review").replace(/\.[^/.]+$/, "")}-review.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <Link
        to="/history"
        className="inline-flex items-center gap-1.5 text-sm text-paper-400 hover:text-paper-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to history
      </Link>

      {/* Header */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-paper-100">
            {review.fileName || "Untitled review"}
          </h1>
          <p className="mt-1 font-mono text-xs text-paper-500">
            {review.id} · {review.language} ·{" "}
            {new Date(review.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-ink-600 bg-ink-800 px-4 py-2">
            <span className="font-mono text-xs uppercase text-paper-500">
              Score
            </span>
            <p
              className={`font-display text-2xl font-bold ${scoreColor(review.score)}`}
            >
              {review.score}
              <span className="text-base text-paper-500">/100</span>
            </p>
          </div>
          <Button variant="secondary" size="md" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-paper-300">
        {review.summary}
      </p>

      {/* Filter bar */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <FilterChip
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label={`All (${review.issues.length})`}
          dot="bg-paper-400"
        />
        <FilterChip
          active={filter === "security"}
          onClick={() => setFilter("security")}
          label={`Security (${counts.security})`}
          dot="bg-diff-red"
        />
        <FilterChip
          active={filter === "bug"}
          onClick={() => setFilter("bug")}
          label={`Bugs (${counts.bug})`}
          dot="bg-amber-500"
        />
        <FilterChip
          active={filter === "style"}
          onClick={() => setFilter("style")}
          label={`Style (${counts.style})`}
          dot="bg-paper-400"
        />
      </div>

      {/* Two-column: code + comments */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Code panel */}
        <div className="overflow-hidden rounded-xl border border-ink-600 bg-ink-800">
          <div className="flex items-center gap-2 border-b border-ink-600 bg-ink-900 px-4 py-2.5">
            <FileCode2 className="h-4 w-4 text-paper-500" />
            <span className="font-mono text-xs text-paper-500">
              {review.fileName || "snippet"} · {codeLines.length} lines
            </span>
          </div>
          <div className="max-h-[600px] overflow-auto scrollbar-thin">
            <table className="min-w-full border-collapse font-mono text-sm">
              <tbody>
                {codeLines.map((line, i) => {
                  const lineNo = i + 1;
                  const lineIssues = issuesByLine.get(lineNo) || [];
                  const hasIssue = lineIssues.length > 0;
                  const topIssue = lineIssues[0];
                  const highlightBg = topIssue
                    ? topIssue.severity === "security"
                      ? "bg-diff-red-bg"
                      : topIssue.severity === "bug"
                        ? "bg-diff-amber-bg"
                        : "bg-ink-700"
                    : "";
                  return (
                    <tr
                      key={lineNo}
                      className={`${highlightBg} ${hasIssue ? "border-l-2" : ""}`}
                      style={
                        hasIssue && topIssue
                          ? {
                              borderLeftColor:
                                topIssue.severity === "security"
                                  ? "#F0654B"
                                  : topIssue.severity === "bug"
                                    ? "#E8A33D"
                                    : "#8B96A5",
                            }
                          : undefined
                      }
                    >
                      <td className="w-12 select-none border-r border-ink-600 px-3 py-0.5 text-right align-top text-xs text-paper-500">
                        {lineNo}
                      </td>
                      <td className="whitespace-pre-wrap break-words px-3 py-0.5 align-top text-paper-200">
                        {line || " "}
                        {hasIssue && (
                          <span
                            className={`ml-2 inline-flex items-center gap-1 rounded px-1.5 py-0.5 align-middle font-sans text-[10px] uppercase ${severityMeta[topIssue.severity].color}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${severityMeta[topIssue.severity].dot}`}
                            />
                            {severityMeta[topIssue.severity].label}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Comments panel */}
        <div className="space-y-4">
          {filteredIssues.length === 0 && (
            <div className="rounded-xl border border-diff-green/30 bg-diff-green-bg p-6 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-diff-green" />
              <p className="mt-2 text-sm text-paper-200">
                No issues in this category.
              </p>
            </div>
          )}
          {filteredIssues.map((issue) => {
            const meta = severityMeta[issue.severity];
            //const Icon = meta.icon;
            return (
              <div key={issue.id} className="relative">
                <div className="mb-2 flex items-center gap-2 font-mono text-xs text-paper-500">
                  <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                  Line {issue.lineStart}
                  {issue.lineEnd !== issue.lineStart ? `–${issue.lineEnd}` : ""}
                </div>
                <AnnotationCallout
                  tone={issue.severity}
                  title={issue.title}
                  lineLabel={String(issue.lineStart)}
                >
                  <p>{issue.explanation}</p>
                  {(issue.beforeCode || issue.afterCode) && (
                    <div className="mt-3 overflow-hidden rounded-md border border-ink-600">
                      {issue.beforeCode && (
                        <pre className="border-b border-ink-600 bg-diff-red-bg px-3 py-2 font-mono text-xs text-diff-red">
                          <span className="select-none">- </span>
                          {issue.beforeCode}
                        </pre>
                      )}
                      {issue.afterCode && (
                        <pre className="bg-diff-green-bg px-3 py-2 font-mono text-xs text-diff-green">
                          <span className="select-none">+ </span>
                          {issue.afterCode}
                        </pre>
                      )}
                    </div>
                  )}
                </AnnotationCallout>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

function FilterChip({
  active,
  onClick,
  label,
  dot,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  dot: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40",
        active
          ? "border-amber-500/50 bg-amber-500/10 text-amber-500"
          : "border-ink-600 bg-ink-800 text-paper-300 hover:text-paper-100",
      ].join(" ")}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </button>
  );
}

export default ReviewDetailPage;
