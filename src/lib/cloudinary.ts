// lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// Función para subir imagen a Cloudinary
export const uploadToCloudinary = async (
  file: File,
  folder: string = "blog"
): Promise<{ url: string; publicId: string }> => {
  try {
    // Convertir File a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            folder: folder,
            transformation: [
              { width: 1200, height: 630, crop: "limit" }, // Optimizar para blog
              { quality: "auto" },
              { format: "auto" },
            ],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
              });
            } else {
              reject(new Error("Error desconocido al subir imagen"));
            }
          }
        )
        .end(buffer);
    });
  } catch (error) {
    throw new Error(`Error al procesar imagen: ${error}`);
  }
};

// Función para eliminar imagen de Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error al eliminar imagen de Cloudinary:", error);
    throw error;
  }
};
