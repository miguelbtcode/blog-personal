import { PostsController } from "@/backend/controllers/posts.controller";
import { NextRequest } from "next/server";

const postsController = new PostsController();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return postsController.getPostById(params.id);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return postsController.updatePost(request, { params });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return postsController.deletePost(request, { params });
}
