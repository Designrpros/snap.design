"use client";

import { useState } from "react";
import type { DesignEntry } from "@snap/shared";
import { tokensToTailwind, tokensToCSS } from "@snap/shared";
import Button from "@/components/ui/Button";

interface DocViewerProps {
  design: DesignEntry;
}

export default function DocViewer({ design }: DocViewerProps) {
  const [format, setFormat] = useState<"compact" | "extended">("extended");
  const [copied, setCopied] = useState<string | null>(null);

  const compactMarkdown = design.designMarkdown
    .split("\n")
    .filter((line) => !line.startsWith("## Usage") && !line.startsWith("- ") && line.trim() !== "" && !line.startsWith(">"))
    .join("\n");

  const displayMarkdown =
    format === "compact" ? compactMarkdown : design.designMarkdown;

  async function handleExport(type: "tailwind" | "css") {
    const output =
      type === "tailwind"
        ? tokensToTailwind(design.designTokens)
        : tokensToCSS(design.designTokens);
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      // Fallback for environments where clipboard API is unavailable
      const textarea = document.createElement("textarea");
      textarea.value = output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header with format toggle and export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-ash-gray rounded-full p-0.5">
          <button
            onClick={() => setFormat("compact")}
            className={`px-4 py-1.5 text-caption font-af font-medium rounded-full transition-all ${
              format === "compact"
                ? "bg-dark-charcoal text-canvas-white"
                : "text-medium-gray hover:text-dark-charcoal"
            }`}
          >
            Compact
          </button>
          <button
            onClick={() => setFormat("extended")}
            className={`px-4 py-1.5 text-caption font-af font-medium rounded-full transition-all ${
              format === "extended"
                ? "bg-dark-charcoal text-canvas-white"
                : "text-medium-gray hover:text-dark-charcoal"
            }`}
          >
            Extended
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outlined"
            size="sm"
            onClick={() => handleExport("tailwind")}
          >
            {copied === "tailwind" ? "Copied!" : "Tailwind CSS"}
          </Button>
          <Button
            variant="outlined"
            size="sm"
            onClick={() => handleExport("css")}
          >
            {copied === "css" ? "Copied!" : "Plain CSS"}
          </Button>
        </div>
      </div>

      {/* Markdown content */}
      <div className="bg-off-white rounded-3xl border border-steel-gray overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-cool-gray bg-ash-gray/50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="font-mono text-caption text-medium-gray ml-2">
            {design.id}.design.md
          </span>
        </div>
        <pre className="p-5 font-mono text-caption text-dark-charcoal leading-relaxed overflow-auto max-h-[600px] whitespace-pre-wrap">
          <code>{displayMarkdown}</code>
        </pre>
      </div>
    </div>
  );
}
