"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import type { ImageData } from "@/types/content";

interface ImageEditorProps {
  data: ImageData;
  onChange: (data: ImageData) => void;
}

export function ImageEditor({ data, onChange }: ImageEditorProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Error al subir imagen");

      const result = await response.json();
      onChange({ ...data, url: result.url, alt: file.name });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {data.url ? (
        <div className="relative">
          <img
            src={data.url}
            alt={data.alt}
            className="max-w-full h-auto rounded-lg"
          />
          <button
            onClick={() => onChange({ url: "", alt: "", caption: "" })}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 mb-4">Sube una imagen</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
          >
            {uploading ? "Subiendo..." : "Seleccionar imagen"}
          </label>
        </div>
      )}

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Texto alternativo"
          value={data.alt}
          onChange={(e) => onChange({ ...data, alt: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Leyenda (opcional)"
          value={data.caption || ""}
          onChange={(e) => onChange({ ...data, caption: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
