import { PostsController } from "@/backend/controllers/posts.controller";
import { NextRequest } from "next/server";

const postsController = new PostsController();

/**
 * GET /api/posts/id/[id] - Obtener post por ID (para edición/admin)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return await postsController.getPostById(request, { params });
}

/**
 * PUT /api/posts/id/[id] - Actualizar post por ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return await postsController.updatePost(request, { params });
}

/**
 * DELETE /api/posts/id/[id] - Eliminar post por ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return await postsController.deletePost(request, { params });
}
