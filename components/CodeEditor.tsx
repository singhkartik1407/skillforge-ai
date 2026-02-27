"use client";

import { useEffect, useRef } from "react";
import type { Language } from "@/types";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  placeholder?: string;
}

const lineNumbers = (code: string): number[] => {
  const lines = code.split("\n").length;
  return Array.from({ length: Math.max(lines, 10) }, (_, i) => i + 1);
};

export default function CodeEditor({
  value,
  onChange,
  language,
  placeholder = "// Write your solution here...",
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = value.substring(0, start) + "    " + value.substring(end);
      onChange(newValue);
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 4;
          textareaRef.current.selectionEnd = start + 4;
        }
      });
    }
  };

  const lines = lineNumbers(value || "\n".repeat(9));

  return (
    <div className="bg-gray-950 border border-white/10 rounded-2xl overflow-hidden font-mono text-sm">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-gray-900/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-amber-500/60" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
          </div>
          <span className="text-xs text-gray-500 ml-2">solution.{language === "cpp" ? "cpp" : language === "java" ? "java" : language === "c" ? "c" : "py"}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-600">{value.split("\n").length} lines</span>
          <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30">
            {language === "cpp" ? "C++" : language === "java" ? "Java" : language === "c" ? "C" : "Python"}
          </span>
        </div>
      </div>

      <div className="flex">
        <div className="select-none px-3 py-4 text-right min-w-[3rem] border-r border-white/5 bg-gray-900/30">
          {lines.map((num) => (
            <div key={num} className="text-xs text-gray-600 leading-6">
              {num}
            </div>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          spellCheck={false}
          className="flex-1 bg-transparent text-gray-200 px-4 py-4 resize-none outline-none placeholder:text-gray-700 leading-6 min-h-[280px] w-full"
          style={{ fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, monospace" }}
        />
      </div>
    </div>
  );
}
