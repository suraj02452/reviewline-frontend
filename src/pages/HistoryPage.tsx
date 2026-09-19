import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Filter } from "lucide-react";
import AppLayout from "../components/layout/AppLayout.tsx";
import { Input } from "../components/ui/Input.tsx";
import { reviewApi, type ReviewListItem } from "../api/reviewApi";

const LANGUAGES = [
  "all",
  "javascript",
  "typescript",
  "python",
  "go",
  "rust",
  "java",
  "csharp",
  "php",
  "ruby",
  "swift",
  "kotlin",
  "cpp",
];

function severityTone(count: number) {
  if (count === 0) return "text-diff-green";
  if (count <= 1) return "text-amber-500";
  return "text-diff-red";
}

const HistoryPage = () => {
  const [history, setHistory] = useState<ReviewListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("all");

  useEffect(() => {
    reviewApi
      .list()
      .then(setHistory)
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return history.filter((r) => {
      const matchesLang = language === "all" || r.language === language;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (r.fileName || "").toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.language.toLowerCase().includes(q);
      return matchesLang && matchesSearch;
    });
  }, [search, language]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <h1 className="font-display text-2xl font-bold tracking-tight text-paper-100">
        History
      </h1>
      <p className="mt-1 text-sm text-paper-400">
        Every review you&apos;ve run, searchable and filterable.
      </p>

      {/* Controls */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            type="search"
            name="search"
            placeholder="Search by file name or summary…"
            icon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-paper-400" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="h-10 rounded-lg border border-ink-600 bg-ink-900 px-3 text-sm text-paper-100 focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l === "all" ? "All languages" : l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-ink-600 bg-ink-800 p-10 text-center">
            <p className="text-sm text-paper-400">
              No reviews match that search.
            </p>
          </div>
        ) : (
          filtered.map((r) => (
            <Link
              key={r.id}
              to={`/review/${r.id}`}
              className="group flex items-center gap-4 rounded-lg border border-ink-600 bg-ink-800 p-4 transition-colors hover:border-amber-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-ink-600 bg-ink-900 font-mono text-xs uppercase text-paper-300">
                {r.language.slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-sm text-paper-100">
                  {r.fileName || "untitled"}
                </p>
                <p className="truncate text-sm text-paper-400">{r.summary}</p>
              </div>
              <div className="hidden items-center gap-3 sm:flex">
                <span
                  className={`font-mono text-sm ${severityTone(r.issueCount)}`}
                >
                  {r.issueCount} {r.issueCount === 1 ? "issue" : "issues"}
                </span>
                <span className="font-mono text-sm text-paper-500">
                  {new Date(r.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-paper-500 transition-colors group-hover:text-amber-500" />
            </Link>
          ))
        )}
      </div>
    </AppLayout>
  );
};

export default HistoryPage;
