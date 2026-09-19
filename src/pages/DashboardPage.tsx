import { Link } from "react-router-dom";
import {
  FilePlus2,
  Bug,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout.tsx";
import { Button } from "../components/ui/Button.tsx";
import { useEffect, useState } from "react";
import {
  reviewApi,
  type ReviewListItem,
  type DashboardStats,
} from "../api/reviewApi.ts";

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-ink-600 bg-ink-800 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-paper-400">{label}</span>
        <Icon className={`h-4 w-4 ${accent}`} />
      </div>
      <p className="mt-3 font-display text-3xl font-bold text-paper-100">
        {value}
      </p>
    </div>
  );
}

function severityDot(count: number) {
  if (count === 0) return "text-diff-green";
  if (count <= 1) return "text-amber-500";
  return "text-diff-red";
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    reviewsThisMonth: 0,
    issuesFound: 0,
    securityIssues: 0,
    avgScore: 0,
  });

  useEffect(() => {
    reviewApi
      .getStats()
      .then(setStats)
      .catch(() => {});
  }, []);

  const [recentReviews, setRecentReviews] = useState<ReviewListItem[]>([]);

  useEffect(() => {
    reviewApi
      .list()
      .then((all) => setRecentReviews(all.slice(0, 4)))
      .catch(() => setRecentReviews([]));
  }, []);

  return (
    <AppLayout>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-paper-100">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-paper-400">
            Your review activity and a quick way to start a new one.
          </p>
        </div>
        <Link to="/review/new">
          <Button size="md">
            <FilePlus2 className="h-4 w-4" />
            New Review
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Reviews this month"
          value={stats.reviewsThisMonth}
          icon={FilePlus2}
          accent="text-amber-500"
        />
        <StatCard
          label="Issues found"
          value={stats.issuesFound}
          icon={Bug}
          accent="text-diff-red"
        />
        <StatCard
          label="Security issues"
          value={stats.securityIssues}
          icon={ShieldAlert}
          accent="text-diff-red"
        />
        <StatCard
          label="Avg. score"
          value={stats.avgScore}
          icon={TrendingUp}
          accent="text-diff-green"
        />
      </div>

      {/* Quick new review card */}
      <div className="mt-8 rounded-xl border border-ink-600 bg-ink-800 p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-lg font-semibold text-paper-100">
              Run a review on new code
            </h2>
            <p className="mt-1 text-sm text-paper-400">
              Paste a snippet or upload a file. Results in seconds.
            </p>
          </div>
          <Link to="/review/new">
            <Button>
              Run review
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent reviews */}
      <div className="space-y-3">
        {recentReviews.length === 0 ? (
          <div className="rounded-xl border border-ink-600 bg-ink-800 p-10 text-center">
            <p className="text-sm text-paper-400">
              No reviews yet. Submit your first one to see it here.
            </p>
            <Link to="/review/new" className="mt-3 inline-block">
              <Button size="sm">
                <FilePlus2 className="h-4 w-4" />
                Run your first review
              </Button>
            </Link>
          </div>
        ) : (
          recentReviews.map((r) => (
            <Link
              key={r.id}
              to={`/review/${r.id}`}
              className="flex items-center gap-4 rounded-lg border border-ink-600 bg-ink-800 p-4 transition-colors hover:border-amber-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
            >
              {/* keep everything that was already inside this Link — unchanged */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-ink-600 bg-ink-900 font-mono text-xs uppercase text-paper-300">
                {r.language.slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-sm text-paper-100">
                  {r.fileName || "untitled"}
                </p>
                <p className="truncate text-sm text-paper-400">{r.summary}</p>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <span
                  className={`font-mono text-sm ${severityDot(r.issueCount)}`}
                >
                  {r.issueCount} {r.issueCount === 1 ? "issue" : "issues"}
                </span>
                <span className="font-mono text-sm text-paper-300">·</span>
                <span className="font-mono text-sm text-paper-300">
                  {new Date(r.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-paper-500" />
            </Link>
          ))
        )}
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
