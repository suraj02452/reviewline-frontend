interface DiffLine {
  n: number;
  type: "ctx" | "add" | "del";
  code: string;
}

interface CodeDiffProps {
  lines: DiffLine[];
  highlightLines?: number[];
  className?: string;
}

export function CodeDiff({
  lines,
  highlightLines = [],
  className = "",
}: CodeDiffProps) {
  return (
    <div
      className={`overflow-x-auto scrollbar-thin font-mono text-sm ${className}`}
    >
      <table className="min-w-full border-collapse">
        <tbody>
          {lines.map((line) => {
            const isAdd = line.type === "add";
            const isDel = line.type === "del";
            const isHighlight = highlightLines.includes(line.n);
            return (
              <tr
                key={line.n}
                className={[
                  isAdd ? "bg-diff-green-bg" : "",
                  isDel ? "bg-diff-red-bg" : "",
                  isHighlight
                    ? "bg-diff-amber-bg ring-1 ring-inset ring-amber-500/40"
                    : "",
                ].join(" ")}
              >
                <td className="w-12 select-none border-r border-ink-600 px-3 py-0.5 text-right align-top text-xs text-paper-500">
                  {line.n}
                </td>
                <td className="w-6 select-none px-2 py-0.5 text-center align-top text-xs">
                  <span
                    className={
                      isAdd
                        ? "text-diff-green"
                        : isDel
                          ? "text-diff-red"
                          : "text-transparent"
                    }
                  >
                    {isAdd ? "+" : isDel ? "-" : " "}
                  </span>
                </td>
                <td className="whitespace-pre px-3 py-0.5 align-top">
                  <span
                    className={[
                      isAdd ? "text-diff-green" : "",
                      isDel ? "text-diff-red" : "",
                      !isAdd && !isDel ? "text-paper-200" : "",
                    ].join(" ")}
                  >
                    {line.code || " "}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export type { DiffLine };
