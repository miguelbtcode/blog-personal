import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No se encontró archivo" },
        { status: 400 }
      );
    }

    // Por ahora retorna una URL ficticia
    // TODO: Implementar Cloudinary u otro servicio
    const mockUrl = `https://via.placeholder.com/800x400?text=${encodeURIComponent(
      file.name
    )}`;

    return NextResponse.json({ url: mockUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error al subir archivo" },
      { status: 500 }
    );
  }
}
