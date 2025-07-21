import type { HeadingData } from "@/types/content";

interface HeadingEditorProps {
  data: HeadingData;
  onChange?: (data: HeadingData) => void;
  readOnly?: boolean;
}

export function HeadingEditor({
  data,
  onChange,
  readOnly = false,
}: HeadingEditorProps) {
  return (
    <div className="space-y-3">
      {!readOnly && (
        <div className="flex gap-2">
          {[2, 3, 4].map((level) => (
            <button
              key={level}
              onClick={() => onChange?.({ ...data, level: level as 2 | 3 | 4 })}
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
      )}

      <input
        type="text"
        value={data.text}
        onChange={
          readOnly
            ? undefined
            : (e) => onChange?.({ ...data, text: e.target.value })
        }
        placeholder="Escribe tu título..."
        readOnly={readOnly}
        className={`w-full p-3 border rounded-lg text-lg font-semibold ${
          readOnly
            ? "border-gray-200 bg-gray-50 cursor-default"
            : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        }`}
      />
    </div>
  );
}
