import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  authorId: z.string().min(1), // Por ahora lo pasamos manualmente
});

// GET /api/posts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") as "DRAFT" | "PUBLISHED" | null;

    const where = status ? { status } : { status: "PUBLISHED" };

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        categories: {
          include: { category: true },
        },
        tags: {
          include: { tag: true },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.post.count({ where });

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST /api/posts
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createPostSchema.parse(body);

    // Generar slug único
    const baseSlug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    let slug = baseSlug;
    let counter = 1;

    while (await prisma.post.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const post = await prisma.post.create({
      data: {
        ...validatedData,
        slug,
        publishedAt: validatedData.status === "PUBLISHED" ? new Date() : null,
        published: validatedData.status === "PUBLISHED",
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
