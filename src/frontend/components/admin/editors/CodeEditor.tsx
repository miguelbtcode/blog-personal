"use client";

import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import type { CodeData } from "@/types/content";

interface CodeEditorProps {
  data: CodeData & { editorTheme?: "auto" | "light" | "dark" };
  onChange?: (
    data: CodeData & { editorTheme?: "auto" | "light" | "dark" }
  ) => void;
  readOnly?: boolean;
}

export function CodeEditor({
  data,
  onChange,
  readOnly = false,
}: CodeEditorProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const getEditorTheme = () => {
    const themeMode = data.editorTheme || "auto";
    if (themeMode === "auto") return isDark ? "vs-dark" : "light";
    return themeMode === "dark" ? "vs-dark" : "light";
  };

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "css", label: "CSS" },
    { value: "html", label: "HTML" },
    { value: "sql", label: "SQL" },
    { value: "json", label: "JSON" },
    { value: "bash", label: "Bash" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
  ];

  return (
    <div className="space-y-4">
      {!readOnly && (
        <div className="flex gap-3 items-center flex-wrap">
          <select
            value={data.language}
            onChange={(e) => onChange?.({ ...data, language: e.target.value })}
            className="px-3 py-2 border border-border bg-background rounded-lg"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          <select
            value={data.editorTheme || "auto"}
            onChange={(e) =>
              onChange?.({
                ...data,
                editorTheme: e.target.value as "auto" | "light" | "dark",
              })
            }
            className="px-3 py-2 border border-border bg-background rounded-lg"
          >
            <option value="auto">🔄 Auto</option>
            <option value="light">☀️ Claro</option>
            <option value="dark">🌙 Oscuro</option>
          </select>

          <input
            type="text"
            placeholder="Nombre del archivo (opcional)"
            value={data.filename || ""}
            onChange={(e) => onChange?.({ ...data, filename: e.target.value })}
            className="flex-1 min-w-48 px-3 py-2 border border-border bg-background rounded-lg"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={data.showLineNumbers}
              onChange={(e) =>
                onChange?.({ ...data, showLineNumbers: e.target.checked })
              }
              className="w-4 h-4"
            />
            Números de línea
          </label>
        </div>
      )}

      <div className="border border-border rounded-lg overflow-hidden">
        <Editor
          height="300px"
          language={data.language}
          value={data.code}
          onChange={
            readOnly
              ? undefined
              : (value) => onChange?.({ ...data, code: value || "" })
          }
          theme={getEditorTheme()}
          options={{
            minimap: { enabled: false },
            lineNumbers: data.showLineNumbers ? "on" : "off",
            fontSize: 14,
            scrollBeyondLastLine: false,
            fontFamily: "'Fira Code', 'Monaco', monospace",
            readOnly: readOnly,
            domReadOnly: readOnly,
            padding: { top: 16, bottom: 16 },
          }}
        />
      </div>
    </div>
  );
}
