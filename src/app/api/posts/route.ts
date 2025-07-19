import { PostsController } from "@/backend/controllers/posts.controller";
import { NextRequest } from "next/server";

const postsController = new PostsController();

/**
 * GET /api/posts - Obtener lista de posts con filtros
 */
export async function GET(request: NextRequest) {
  return await postsController.getPosts(request);
}

/**
 * POST /api/posts - Crear nuevo post
 */
export async function POST(request: NextRequest) {
  return await postsController.createPost(request);
}
