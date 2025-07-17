import type { HeadingData } from "@/types/content";

interface HeadingEditorProps {
  data: HeadingData;
  onChange: (data: HeadingData) => void;
}

export function HeadingEditor({ data, onChange }: HeadingEditorProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {[2, 3, 4].map((level) => (
          <button
            key={level}
            onClick={() => onChange({ ...data, level: level as 2 | 3 | 4 })}
            className={`px-3 py-1 text-sm border rounded ${
              data.level === level
                ? "bg-blue-100 border-blue-300 text-blue-700"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            H{level}
          </button>
        ))}
      </div>

      <input
        type="text"
        value={data.text}
        onChange={(e) => onChange({ ...data, text: e.target.value })}
        placeholder="Escribe tu título..."
        className="w-full p-3 border border-gray-300 rounded-lg text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
