import {
  useState,
  useCallback,
  type FormEvent,
  type DragEvent,
  type ChangeEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Clipboard,
  FileCode2,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import { Button } from "../components/ui/Button";
import { reviewApi, type ReviewResult } from "../api/reviewApi";
import type { ApiError } from "../api/client";

const LANGUAGES = [
  "auto",
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

const MAX_FILE_BYTES = 500 * 1024;

const EXTENSION_TO_LANGUAGE: Record<string, string> = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  py: "python",
  go: "go",
  rs: "rust",
  java: "java",
  cs: "csharp",
  php: "php",
  rb: "ruby",
  swift: "swift",
  kt: "kotlin",
  cpp: "cpp",
  cc: "cpp",
  h: "cpp",
};

function detectLanguageFromFilename(filename: string): string | null {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext ? EXTENSION_TO_LANGUAGE[ext] || null : null;
}

type Tab = "paste" | "upload";

const NewReviewPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("paste");
  const [language, setLanguage] = useState("auto");
  const [code, setCode] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (tab === "paste") {
      if (!code.trim()) return "Paste some code to review.";
      if (code.length > MAX_FILE_BYTES)
        return `Code is too large — max ${MAX_FILE_BYTES / 1024}KB per submission.`;
    } else {
      if (!fileContent) return "Choose a file to upload.";
      if (fileContent.length > MAX_FILE_BYTES)
        return `File too large — max ${MAX_FILE_BYTES / 1024}KB per upload.`;
    }
    return null;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const result = await reviewApi.submit({
        language,
        code: tab === "paste" ? code : fileContent,
        fileName: tab === "upload" ? fileName : undefined,
      });
      navigate(`/review/${result.id}`);
    } catch (err) {
      const e = err as ApiError;
      setError(e.message || "Could not submit the review. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFile = useCallback((file: File) => {
    if (file.size > MAX_FILE_BYTES) {
      setError(`File too large — max ${MAX_FILE_BYTES / 1024}KB per upload.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFileContent(String(reader.result || ""));
      setFileName(file.name);
      setError(null);

      const detected = detectLanguageFromFilename(file.name);
      if (detected) {
        setLanguage(detected);
      }
    };
    reader.onerror = () =>
      setError("Could not read that file. Try a different one.");
    reader.readAsText(file);
  }, []);

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearFile = () => {
    setFileName("");
    setFileContent("");
  };

  return (
    <AppLayout>
      <h1 className="font-display text-2xl font-bold tracking-tight text-paper-100">
        New Review
      </h1>
      <p className="mt-1 text-sm text-paper-400">
        Paste your code or upload a file. We&apos;ll read it line by line.
      </p>

      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-lg border border-diff-red/30 bg-diff-red-bg px-4 py-3 text-sm text-diff-red">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6">
        {/* Tabs */}
        <div className="inline-flex rounded-lg border border-ink-600 bg-ink-900 p-1">
          <button
            type="button"
            onClick={() => setTab("paste")}
            className={[
              "flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40",
              tab === "paste"
                ? "bg-amber-500/10 text-amber-500"
                : "text-paper-400 hover:text-paper-100",
            ].join(" ")}
          >
            <Clipboard className="h-4 w-4" />
            Paste code
          </button>
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={[
              "flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40",
              tab === "upload"
                ? "bg-amber-500/10 text-amber-500"
                : "text-paper-400 hover:text-paper-100",
            ].join(" ")}
          >
            <Upload className="h-4 w-4" />
            Upload file
          </button>
        </div>

        {/* Language selector */}
        <div className="mt-5">
          <label
            htmlFor="language"
            className="mb-1.5 block text-sm font-medium text-paper-200"
          >
            Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="h-10 w-full max-w-xs rounded-lg border border-ink-600 bg-ink-900 px-3 text-sm text-paper-100 focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l === "auto" ? "Auto-detect" : l}
              </option>
            ))}
          </select>
        </div>

        {/* Paste panel */}
        {tab === "paste" && (
          <div className="mt-5">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Paste your code here…"
              spellCheck={false}
              className="h-80 w-full resize-y rounded-lg border border-ink-600 bg-ink-900 p-4 font-mono text-sm text-paper-100 placeholder:text-paper-500 scrollbar-thin focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
            <p className="mt-1.5 font-mono text-xs text-paper-500">
              {code.length.toLocaleString()} chars · max{" "}
              {(MAX_FILE_BYTES / 1024).toLocaleString()}KB
            </p>
          </div>
        )}

        {/* Upload panel */}
        {tab === "upload" && (
          <div className="mt-5">
            {!fileName ? (
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={[
                  "flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40",
                  dragging
                    ? "border-amber-500 bg-amber-500/5"
                    : "border-ink-600 bg-ink-900 hover:border-amber-500/40",
                ].join(" ")}
              >
                <input type="file" className="sr-only" onChange={onFileInput} />
                <Upload className="h-8 w-8 text-paper-400" />
                <p className="mt-3 text-sm text-paper-200">
                  Drag a file here, or{" "}
                  <span className="text-amber-500">browse</span>
                </p>
                <p className="mt-1 font-mono text-xs text-paper-500">
                  Max {(MAX_FILE_BYTES / 1024).toLocaleString()}KB · .js .ts .py
                  .go .rs .java .cs .php .rb .swift .kt .cpp
                </p>
              </label>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-ink-600 bg-ink-900 p-4">
                <FileCode2 className="h-5 w-5 text-amber-500" />
                <span className="flex-1 truncate font-mono text-sm text-paper-100">
                  {fileName}
                </span>
                <span className="font-mono text-xs text-paper-500">
                  {(fileContent.length / 1024).toFixed(1)}KB
                </span>
                <button
                  type="button"
                  onClick={clearFile}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-paper-400 hover:bg-ink-800 hover:text-paper-100"
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Submit */}
        <div className="mt-6 flex items-center gap-4">
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Reviewing…
              </>
            ) : (
              "Run review"
            )}
          </Button>
          <p className="font-mono text-xs text-paper-500">
            Reviews usually take 2–5 seconds.
          </p>
        </div>
      </form>
    </AppLayout>
  );
};

export default NewReviewPage;
