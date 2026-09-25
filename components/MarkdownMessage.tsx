"use client";

import { useMemo } from "react";
import { marked } from "marked";

type MarkdownMessageProps = {
  content: string;
  className?: string;
};

export function MarkdownMessage({ content, className = "" }: MarkdownMessageProps) {
  const htmlContent = useMemo(() => {
    if (!content) return "";
    try {
      // Configure marked for clean breaks
      marked.setOptions({
        gfm: true,
        breaks: true,
      });
      return marked.parse(content) as string;
    } catch {
      // Fallback: replace newlines with line breaks
      return content.replace(/\\n/g, "<br/>").replace(/\n/g, "<br/>");
    }
  }, [content]);

  return (
    <div
      className={`prose prose-sm max-w-none text-zinc-800 leading-relaxed space-y-2 [&_p]:my-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_strong]:font-semibold [&_h1]:text-base [&_h1]:font-bold [&_h2]:text-sm [&_h2]:font-bold [&_h3]:text-xs [&_h3]:font-bold [&_pre]:bg-zinc-900 [&_pre]:text-zinc-100 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_code]:bg-zinc-200 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_blockquote]:border-l-4 [&_blockquote]:border-orange-500 [&_blockquote]:pl-3 [&_blockquote]:italic [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-zinc-300 [&_th]:p-1.5 [&_th]:bg-zinc-100 [&_td]:border [&_td]:border-zinc-300 [&_td]:p-1.5 ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
