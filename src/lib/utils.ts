import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de CSS con Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generar slug a partir de un título
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD") // Normalizar caracteres Unicode
    .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
    .replace(/[^a-z0-9\s-]/g, "") // Solo letras, números, espacios y guiones
    .replace(/\s+/g, "-") // Espacios a guiones
    .replace(/-+/g, "-") // Múltiples guiones a uno
    .trim()
    .slice(0, 60); // Limitar longitud
}

/**
 * Formatea una fecha a string legible
 */
export function formatDate(
  date: Date | string,
  locale: string = "es-ES"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}

/**
 * Formatea una fecha de forma relativa (hace X tiempo)
 */
export function formatRelativeDate(
  date: Date | string,
  locale: string = "es-ES"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Hoy";
  if (diffInDays === 1) return "Ayer";
  if (diffInDays < 7) return `Hace ${diffInDays} días`;
  if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`;
  if (diffInDays < 365) return `Hace ${Math.floor(diffInDays / 30)} meses`;

  return `Hace ${Math.floor(diffInDays / 365)} años`;
}

/**
 * Calcular tiempo de lectura estimado basado en el contenido
 */
export function calculateReadTime(content: any): number {
  if (!content || typeof content !== "object") {
    return 1;
  }

  const wordsPerMinute = 200; // Promedio de lectura
  const wordCount = extractWordCount(content);

  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readTime); // Mínimo 1 minuto
}

/**
 * Extraer número de palabras del contenido estructurado
 */
function extractWordCount(content: any): number {
  if (!content || !content.content) {
    return 0;
  }

  let wordCount = 0;

  function traverseContent(node: any) {
    if (node.type === "text" && node.text) {
      // Contar palabras en texto
      const words = node.text
        .trim()
        .split(/\s+/)
        .filter((word: string) => word.length > 0);
      wordCount += words.length;
    }

    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(traverseContent);
    }

    // Manejar casos especiales
    if (node.type === "heading" && node.attrs?.level) {
      // Los títulos cuentan como más palabras por su importancia visual
      wordCount += 2;
    }

    if (node.type === "codeBlock") {
      // Código se lee más lento
      wordCount += 10;
    }

    if (node.type === "image") {
      // Las imágenes toman tiempo de procesamiento
      wordCount += 5;
    }
  }

  traverseContent(content);
  return wordCount;
}

/**
 * Trunca un texto a un número específico de caracteres
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

/**
 * Extrae texto plano de HTML
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

/**
 * Genera un excerpt a partir del contenido
 */
export function generateExcerpt(
  content: string,
  maxLength: number = 160
): string {
  const plainText = stripHtml(content);
  return truncate(plainText, maxLength);
}

/**
 * Valida si una cadena es un email válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida si una URL es válida
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Capitaliza la primera letra de una cadena
 */
export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Convierte un número a formato con separadores de miles
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("es-ES").format(num);
}

/**
 * Genera un color aleatorio en formato hexadecimal
 */
export function generateRandomColor(): string {
  const colors = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#eab308",
    "#84cc16",
    "#22c55e",
    "#10b981",
    "#14b8a6",
    "#06b6d4",
    "#0ea5e9",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
    "#f43f5e",
  ];

  return colors[Math.floor(Math.random() * colors.length)]!;
}

/**
 * Debounce function para optimizar búsquedas
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>): void => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Convierte bytes a formato legible
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Genera un ID único simple
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Valida si una imagen tiene un formato válido
 */
export function isValidImageType(file: File): boolean {
  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  return validTypes.includes(file.type);
}

/**
 * Convierte una cadena de tags separados por comas en array
 */
export function parseTags(tagsString: string): string[] {
  return tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

/**
 * Ordena un array de objetos por una propiedad específica
 */
export function sortBy<T>(
  array: T[],
  key: keyof T,
  direction: "asc" | "desc" = "asc"
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

/**
 * Filtra objetos por múltiples criterios
 */
export function filterBy<T>(
  array: T[],
  filters: Partial<Record<keyof T, any>>
): T[] {
  return array.filter((item) => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === "") return true;
      return item[key as keyof T] === value;
    });
  });
}

/**
 * Agrupa un array de objetos por una propiedad
 */
export function groupBy<T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group]!.push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Obtiene un valor anidado de un objeto usando dot notation
 */
export function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((current, key) => current?.[key], obj);
}

/**
 * Verifica si el código se está ejecutando en el cliente
 */
export function isClient(): boolean {
  return typeof window !== "undefined";
}

/**
 * Verifica si el dispositivo es móvil
 */
export function isMobile(): boolean {
  if (!isClient()) return false;
  return window.innerWidth < 768;
}

/**
 * Copia texto al portapapeles
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!isClient()) return false;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback para navegadores más antiguos
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textArea);
    return success;
  }
}

/**
 * Truncar texto manteniendo palabras completas
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  const truncated = text.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex > 0) {
    return truncated.slice(0, lastSpaceIndex) + "...";
  }

  return truncated + "...";
}

/**
 * Extraer texto plano del contenido estructurado para excerpts
 */
export function extractPlainText(
  content: any,
  maxLength: number = 300
): string {
  if (!content || !content.content) {
    return "";
  }

  let plainText = "";

  function traverseContent(node: any) {
    if (node.type === "text" && node.text) {
      plainText += node.text + " ";
    }

    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(traverseContent);
    }

    // Agregar espacios después de ciertos elementos
    if (["paragraph", "heading"].includes(node.type)) {
      plainText += " ";
    }
  }

  traverseContent(content);

  // Limpiar y truncar
  const cleaned = plainText
    .replace(/\s+/g, " ") // Múltiples espacios a uno
    .trim();

  return truncateText(cleaned, maxLength);
}

/**
 * Validar y limpiar slug
 */
export function validateSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug) && !slug.startsWith("-") && !slug.endsWith("-");
}

/**
 * Formatear fecha para mostrar
 */
export function formatPostDate(date: Date | string): string {
  const postDate = new Date(date);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - postDate.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) {
    return "Hace menos de una hora";
  } else if (diffInHours < 24) {
    return `Hace ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`;
  } else if (diffInHours < 168) {
    // 7 días
    const days = Math.floor(diffInHours / 24);
    return `Hace ${days} día${days > 1 ? "s" : ""}`;
  } else {
    return postDate.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

/**
 * Generar meta description desde contenido
 */
export function generateMetaDescription(
  content: any,
  fallbackExcerpt?: string
): string {
  const extracted = extractPlainText(content, 160);

  if (extracted.length > 50) {
    return extracted;
  }

  return fallbackExcerpt || "Lee este interesante artículo en nuestro blog.";
}
