import { PostsController } from "@/backend/controllers/posts.controller";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validatePostContent } from "@/lib/blockUtils";

const postsController = new PostsController();

export async function GET(request: Request) {
  return postsController.getPosts(request as any);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { title, excerpt, featuredImage, content, status } =
      await request.json();

    // Validaciones
    if (!title?.trim()) {
      return NextResponse.json({ error: "Título requerido" }, { status: 400 });
    }

    if (!validatePostContent(content)) {
      return NextResponse.json(
        { error: "Contenido inválido" },
        { status: 400 }
      );
    }

    // Generar slug único
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    let slug = baseSlug;
    let counter = 1;

    while (await prisma.post.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt: excerpt || "",
        content: JSON.parse(JSON.stringify(content)),
        featuredImage: featuredImage || null,
        status,
        authorId: session.user.id,
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
